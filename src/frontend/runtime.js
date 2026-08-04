/**
 * WordPress dependencies
 */
import {
	getContext,
	getElement,
	store,
	withSyncEvent,
} from '@wordpress/interactivity';

/**
 * Internal dependencies
 */
import {
	CLASS_CLOSING,
	CLASS_HIDDEN,
	CLASS_OPEN,
	CLASS_OVERLAY,
	CLASS_SCROLL_LOCKED,
	SELECTOR_CLOSE_BUTTON,
	SELECTOR_DIALOG,
	SELECTOR_OPEN_POPUP,
	STATE_CLOSING,
	STATE_HIDDEN,
	STATE_OPEN,
	STATE_OPENING,
	STORE_NAMESPACE,
} from './config/constants';
import { passesRules } from './core/rules';
import {
	incrementStorageNumber,
	hasStorageValue,
	localStore,
	pageKey,
	popupCountKey,
	setStorageValue,
	sessionKey,
	sessionStore,
	sessionsKey,
} from './utils/storage';
import { applyInlineStyles } from './core/apply-styles';
import { findClosest, findElement, splitSelectors } from './utils/browser';
import { normalizeAnimationDuration } from '../shared/animation';

const registeredPopups = new Map();
const openPopupIds = [];
let runtimeCountersReady = false;
const reducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' );
const focusableSelector = [
	'a[href]',
	'button:not([disabled]):not([hidden])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[contenteditable="true"]',
	'[tabindex]:not([tabindex="-1"])',
].join( ',' );

const { state, actions } = store( STORE_NAMESPACE, {
	state: {
		hasOpenPopup: false,
	},
	actions: {
		openPopupById( id, force = false ) {
			openPopupNode( registeredPopups.get( String( id ) ), force );
		},
		closeCurrentPopup( event ) {
			const popup = getCurrentPopup();

			if ( ! popup ) {
				return;
			}

			const advanced = popup.settings.advanced || {};
			if (
				event?.target?.classList?.contains( CLASS_OVERLAY ) &&
				advanced.preventOverlayClose
			) {
				return;
			}

			closePopupNode( popup );
		},
		handlePopupKeydown: withSyncEvent( ( event ) => {
			const popup = getCurrentPopup();

			if ( ! popup?.isOpen || ! isTopmostPopup( popup ) ) {
				return;
			}

			if (
				event.key === 'Escape' &&
				! popup.settings.advanced?.preventEscClose
			) {
				closePopupNode( popup );
				return;
			}

			if ( event.key === 'Tab' ) {
				trapPopupFocus( popup, event );
			}
		} ),
	},
	callbacks: {
		initPopup() {
			ensureRuntimeCounters();

			const { ref } = getElement();
			const popup = parsePopup( ref, getContext() );

			if ( ! popup || registeredPopups.has( popup.id ) ) {
				return;
			}

			registeredPopups.set( popup.id, popup );
			applyInlineStyles( popup );
			bindManualSelectors( popup );
			bindTriggers( popup );
		},
	},
} );

/**
 * Initialize cross-popup counters once per page load.
 */
const ensureRuntimeCounters = () => {
	if ( runtimeCountersReady ) {
		return;
	}

	runtimeCountersReady = true;
	incrementStorageNumber( localStore, pageKey );

	if ( ! hasStorageValue( sessionStore, sessionKey ) ) {
		setStorageValue( sessionStore, sessionKey, '1' );
		incrementStorageNumber( localStore, sessionsKey );
	}
};

/**
 * Resolve the popup connected to the current Interactivity context.
 */
const getCurrentPopup = () => {
	const context = getContext();
	const id = String( context?.id || '' );

	return registeredPopups.get( id );
};

/**
 * Determine whether a popup is the active dialog in the popup stack.
 * @param {Object} popup Popup runtime record.
 */
const isTopmostPopup = ( popup ) =>
	openPopupIds[ openPopupIds.length - 1 ] === popup.id;

/**
 * Return keyboard-focusable controls inside a popup dialog.
 * @param {HTMLElement} dialog Popup dialog element.
 */
const getFocusableElements = ( dialog ) =>
	Array.from( dialog.querySelectorAll( focusableSelector ) ).filter(
		( element ) =>
			! element.hidden &&
			'true' !== element.getAttribute( 'aria-hidden' ) &&
			! element.closest( '[inert]' ) &&
			element.getClientRects().length > 0
	);

/**
 * Keep Tab and Shift+Tab navigation inside the active popup dialog.
 * @param {Object}        popup Popup runtime record.
 * @param {KeyboardEvent} event Keyboard event.
 */
const trapPopupFocus = ( popup, event ) => {
	const dialog = popup.node.querySelector( SELECTOR_DIALOG );

	if ( ! dialog ) {
		return;
	}

	const focusableElements = getFocusableElements( dialog );

	if ( ! focusableElements.length ) {
		event.preventDefault();
		dialog.focus( { preventScroll: true } );
		return;
	}

	const firstElement = focusableElements[ 0 ];
	const lastElement = focusableElements[ focusableElements.length - 1 ];
	const activeElement = dialog.ownerDocument.activeElement;

	if ( ! dialog.contains( activeElement ) ) {
		event.preventDefault();
		( event.shiftKey ? lastElement : firstElement ).focus();
	} else if ( event.shiftKey && activeElement === firstElement ) {
		event.preventDefault();
		lastElement.focus();
	} else if ( ! event.shiftKey && activeElement === lastElement ) {
		event.preventDefault();
		firstElement.focus();
	}
};

/**
 * Move keyboard focus into a newly opened popup.
 * @param {Object} popup Popup runtime record.
 */
const focusPopup = ( popup ) => {
	const dialog = popup.node.querySelector( SELECTOR_DIALOG );

	if ( ! dialog || ! popup.isOpen ) {
		return;
	}

	const [ firstElement ] = getFocusableElements( dialog );
	( firstElement || dialog ).focus( { preventScroll: true } );
};

/**
 * Restore focus to the control that opened a popup.
 * @param {Object} popup Popup runtime record.
 */
const restorePopupFocus = ( popup ) => {
	const previousElement = popup.previouslyFocusedElement;
	popup.previouslyFocusedElement = null;
	const topmostPopup = registeredPopups.get(
		openPopupIds[ openPopupIds.length - 1 ]
	);

	if ( topmostPopup ) {
		const dialog = topmostPopup.node.querySelector( SELECTOR_DIALOG );

		if (
			previousElement?.isConnected &&
			dialog?.contains( previousElement )
		) {
			previousElement.focus( { preventScroll: true } );
		} else {
			focusPopup( topmostPopup );
		}
		return;
	}

	if (
		previousElement?.isConnected &&
		'function' === typeof previousElement.focus
	) {
		previousElement.focus( { preventScroll: true } );
	}
};

/**
 * Apply close-button visibility and delay for each popup opening.
 * @param {Object} popup Popup runtime record.
 */
const prepareCloseButton = ( popup ) => {
	const closeButton = popup.node.querySelector( SELECTOR_CLOSE_BUTTON );
	const layout = popup.settings.layout || {};

	window.clearTimeout( popup.closeButtonTimer );
	popup.closeButtonTimer = null;

	if ( ! closeButton ) {
		return;
	}

	const closeDelay = Number( popup.settings.advanced?.closeDelay || 0 );

	closeButton.hidden = ! layout.closeButton || closeDelay > 0;

	if ( layout.closeButton && closeDelay > 0 ) {
		popup.closeButtonTimer = window.setTimeout( () => {
			if ( popup.isOpen ) {
				closeButton.hidden = false;
			}
		}, closeDelay * 1000 );
	}
};

/**
 * Keep Interactivity context and DOM state in sync for CSS animation selectors.
 * @param {Object} popup     Popup runtime record.
 * @param {string} nextState Runtime animation state.
 */
const setPopupState = ( popup, nextState ) => {
	popup.context.animationState = nextState;
	popup.node.dataset.state = nextState;
};

/**
 * Resolve the active animation duration for the current motion preference.
 * @param {Object} popup Popup runtime record.
 * @param {string} phase Animation phase.
 */
const getAnimationDuration = ( popup, phase ) => {
	const layout = popup.settings.layout || {};
	const animation =
		'opening' === phase ? layout.entranceAnimation : layout.exitAnimation;

	if ( reducedMotion.matches || 'none' === animation ) {
		return 0;
	}

	return normalizeAnimationDuration( layout.animationDuration, 0 ) * 1000;
};

/**
 * Clear any pending animation listener or timeout.
 * @param {Object} popup Popup runtime record.
 */
const clearAnimationWait = ( popup ) => {
	if ( popup.animationCleanup ) {
		popup.animationCleanup();
		popup.animationCleanup = null;
	}

	window.clearTimeout( popup.animationTimer );
	popup.animationTimer = null;
};

/**
 * Run a callback when the dialog animation ends, with a timeout fallback.
 * @param {Object}   popup    Popup runtime record.
 * @param {string}   phase    Animation phase.
 * @param {Function} callback Completion callback.
 */
const afterAnimation = ( popup, phase, callback ) => {
	clearAnimationWait( popup );

	const duration = getAnimationDuration( popup, phase );
	const dialog = popup.node.querySelector( SELECTOR_DIALOG );

	if ( ! duration || ! dialog ) {
		callback();
		return;
	}

	let finished = false;
	const finish = ( event ) => {
		if ( event && event.target !== dialog ) {
			return;
		}

		if ( finished ) {
			return;
		}

		finished = true;
		clearAnimationWait( popup );
		callback();
	};

	dialog.addEventListener( 'animationend', finish );
	popup.animationTimer = window.setTimeout( finish, duration + 100 );
	popup.animationCleanup = () =>
		dialog.removeEventListener( 'animationend', finish );
};

/**
 * Determine whether a popup is allowed to open at this moment.
 * @param {Object}  popup Popup runtime record.
 * @param {boolean} force Whether to bypass automatic rules.
 */
const canOpen = ( popup, force = false ) => {
	if ( popup.isOpen ) {
		return false;
	}

	if ( force ) {
		return true;
	}

	if ( state.hasOpenPopup && popup.settings.advanced?.avoidMultiple ) {
		return false;
	}

	return passesRules( popup );
};

/**
 * Open a popup and update runtime display counters.
 * @param {Object}  popup Popup runtime record.
 * @param {boolean} force Whether to bypass automatic rules.
 */
const openPopupNode = ( popup, force = false ) => {
	if ( ! popup ) {
		return;
	}

	if ( ! canOpen( popup, force ) ) {
		return;
	}

	const { node, id, settings } = popup;
	const advanced = settings.advanced || {};
	const rules = settings.rules || {};

	const activeElement = node.ownerDocument.activeElement;
	popup.previouslyFocusedElement = activeElement?.focus
		? activeElement
		: null;
	popup.isOpen = true;
	popup.context.isOpen = true;
	state.hasOpenPopup = true;
	openPopupIds.push( id );
	clearAnimationWait( popup );
	node.classList.remove( CLASS_HIDDEN, CLASS_CLOSING );
	node.classList.add( CLASS_OPEN );
	node.setAttribute( 'aria-hidden', 'false' );
	setPopupState( popup, STATE_OPENING );
	prepareCloseButton( popup );

	window.cancelAnimationFrame( popup.focusFrame );
	popup.focusFrame = window.requestAnimationFrame( () =>
		focusPopup( popup )
	);

	if ( advanced.disableScroll ) {
		document.documentElement.classList.add( CLASS_SCROLL_LOCKED );
	}

	if ( rules.maxDisplays && rules.countMode !== 'close' ) {
		incrementStorageNumber( localStore, popupCountKey( id, 'open' ) );
	}

	const autoClose = Number( advanced.autoClose || 0 );
	if ( autoClose > 0 ) {
		window.clearTimeout( popup.autoCloseTimer );
		popup.autoCloseTimer = window.setTimeout(
			() => closePopupNode( popup ),
			autoClose
		);
	}

	afterAnimation( popup, 'opening', () => {
		if ( popup.isOpen ) {
			setPopupState( popup, STATE_OPEN );
		}
	} );
};

/**
 * Close a popup and release scroll locking when no popup remains open.
 * @param {Object} popup Popup runtime record.
 */
const closePopupNode = ( popup ) => {
	if ( ! popup.isOpen ) {
		return;
	}

	const { node, id, settings } = popup;
	const rules = settings.rules || {};

	popup.isOpen = false;
	popup.context.isOpen = false;
	const openPopupIndex = openPopupIds.indexOf( id );

	if ( openPopupIndex >= 0 ) {
		openPopupIds.splice( openPopupIndex, 1 );
	}
	node.classList.add( CLASS_CLOSING );
	node.classList.remove( CLASS_OPEN );
	node.setAttribute( 'aria-hidden', 'true' );
	restorePopupFocus( popup );
	setPopupState( popup, STATE_CLOSING );
	window.clearTimeout( popup.autoCloseTimer );
	window.clearTimeout( popup.closeButtonTimer );
	window.cancelAnimationFrame( popup.focusFrame );

	if ( rules.maxDisplays && rules.countMode === 'close' ) {
		incrementStorageNumber( localStore, popupCountKey( id, 'close' ) );
	}

	afterAnimation( popup, 'closing', () => {
		node.classList.add( CLASS_HIDDEN );
		node.classList.remove( CLASS_CLOSING );
		setPopupState( popup, STATE_HIDDEN );

		if ( ! document.querySelector( SELECTOR_OPEN_POPUP ) ) {
			document.documentElement.classList.remove( CLASS_SCROLL_LOCKED );
			state.hasOpenPopup = false;
		}
	} );
};

/**
 * Bind manual selector triggers. Manual opens intentionally bypass rules.
 * @param {Object} popup Popup runtime record.
 */
const bindManualSelectors = ( popup ) => {
	const selectors = splitSelectors( popup.settings.advanced?.openSelectors );

	if ( ! selectors.length ) {
		return;
	}

	document.addEventListener( 'click', ( event ) => {
		const eventTarget = event.target?.closest ? event.target : null;
		const matchedSelector = selectors.find( ( selector ) =>
			findClosest( eventTarget, selector )
		);

		if ( matchedSelector ) {
			event.preventDefault();
			actions.openPopupById( popup.id, true );
		}
	} );
};

/**
 * Register automatic popup triggers.
 * @param {Object} popup Popup runtime record.
 */
const bindTriggers = ( popup ) => {
	const triggers = popup.settings.triggers || {};

	if ( triggers.pageLoad ) {
		window.setTimeout(
			() => actions.openPopupById( popup.id ),
			Number( triggers.pageLoadDelay || 0 ) * 1000
		);
	}

	if ( triggers.scroll ) {
		const onScroll = () => {
			if ( popup.isOpen ) {
				return;
			}

			if ( triggers.scrollDirection === 'up' ) {
				if ( window.scrollY <= Number( triggers.scrollAmount || 0 ) ) {
					actions.openPopupById( popup.id );
					window.removeEventListener( 'scroll', onScroll );
				}
				return;
			}

			const scrollable =
				document.documentElement.scrollHeight - window.innerHeight;
			const percent =
				scrollable > 0 ? ( window.scrollY / scrollable ) * 100 : 100;
			if ( percent >= Number( triggers.scrollAmount || 0 ) ) {
				actions.openPopupById( popup.id );
				window.removeEventListener( 'scroll', onScroll );
			}
		};

		window.addEventListener( 'scroll', onScroll, { passive: true } );
	}

	if ( triggers.scrollElement && triggers.scrollSelector ) {
		const target = findElement( triggers.scrollSelector );
		if ( target && 'IntersectionObserver' in window ) {
			const observer = new window.IntersectionObserver( ( entries ) => {
				if ( entries.some( ( entry ) => entry.isIntersecting ) ) {
					actions.openPopupById( popup.id );
					observer.disconnect();
				}
			} );
			observer.observe( target );
		}
	}

	if ( triggers.click ) {
		let count = 0;
		document.addEventListener( 'click', () => {
			count += 1;
			if ( count >= Number( triggers.clickCount || 0 ) ) {
				actions.openPopupById( popup.id );
			}
		} );
	}

	if ( triggers.inactivity ) {
		let timer;
		const reset = () => {
			window.clearTimeout( timer );
			timer = window.setTimeout(
				() => actions.openPopupById( popup.id ),
				Number( triggers.inactivitySeconds || 0 ) * 1000
			);
		};

		[ 'mousemove', 'keydown', 'scroll', 'touchstart' ].forEach(
			( eventName ) =>
				document.addEventListener( eventName, reset, { passive: true } )
		);
		reset();
	}

	if ( triggers.exitIntent ) {
		document.addEventListener( 'mouseout', ( event ) => {
			if ( event.clientY <= 0 && ! event.relatedTarget ) {
				actions.openPopupById( popup.id );
			}
		} );
	}
};

/**
 * Parse a rendered popup DOM node into runtime state.
 * @param {HTMLElement} node    Rendered popup element.
 * @param {Object}      context Interactivity context.
 */
const parsePopup = ( node, context = {} ) => {
	try {
		const id = String( context.id || node.dataset.popupId || '' );

		return {
			node,
			id,
			context,
			settings: JSON.parse( node.dataset.settings || '{}' ),
			isOpen: false,
			autoCloseTimer: null,
			closeButtonTimer: null,
			focusFrame: null,
			previouslyFocusedElement: null,
			animationTimer: null,
			animationCleanup: null,
		};
	} catch {
		return null;
	}
};
