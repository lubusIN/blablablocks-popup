/**
 * WordPress dependencies
 */
import { getContext, getElement, store, withSyncEvent } from '@wordpress/interactivity';

/**
 * Internal dependencies
 */
import {
	CLASS_CLOSING,
	CLASS_HIDDEN,
	CLASS_OPEN,
	CLASS_OVERLAY,
	CLASS_SCROLL_LOCKED,
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
	pageKey,
	popupCountKey,
	sessionKey,
	sessionsKey,
} from './utils/storage';
import { applyInlineStyles } from './core/apply-styles';
import { splitSelectors } from './utils/browser';
import { normalizeAnimationDuration } from '../shared/animation';

const registeredPopups = new Map();
let runtimeCountersReady = false;
const reducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' );

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
			if ( event?.target?.classList?.contains( CLASS_OVERLAY ) && advanced.preventOverlayClose ) {
				return;
			}

			closePopupNode( popup );
		},
		closeOnEscape: withSyncEvent( ( event ) => {
			const popup = getCurrentPopup();

			if ( event.key === 'Escape' && popup?.isOpen && ! popup.settings.advanced?.preventEscClose ) {
				closePopupNode( popup );
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
	incrementStorageNumber( localStorage, pageKey );

	if ( ! sessionStorage.getItem( sessionKey ) ) {
		sessionStorage.setItem( sessionKey, '1' );
		incrementStorageNumber( localStorage, sessionsKey );
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
 * Keep Interactivity context and DOM state in sync for CSS animation selectors.
 */
const setPopupState = ( popup, nextState ) => {
	popup.context.animationState = nextState;
	popup.node.dataset.state = nextState;
};

/**
 * Resolve the active animation duration for the current motion preference.
 */
const getAnimationDuration = ( popup, phase ) => {
	const layout = popup.settings.layout || {};
	const animation = 'opening' === phase ? layout.entranceAnimation : layout.exitAnimation;

	if ( reducedMotion.matches || 'none' === animation ) {
		return 0;
	}

	return normalizeAnimationDuration( layout.animationDuration, 0 ) * 1000;
};

/**
 * Clear any pending animation listener or timeout.
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
	popup.animationCleanup = () => dialog.removeEventListener( 'animationend', finish );
};

/**
 * Determine whether a popup is allowed to open at this moment.
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

	popup.isOpen = true;
	popup.context.isOpen = true;
	state.hasOpenPopup = true;
	clearAnimationWait( popup );
	node.classList.remove( CLASS_HIDDEN, CLASS_CLOSING );
	node.classList.add( CLASS_OPEN );
	node.setAttribute( 'aria-hidden', 'false' );
	setPopupState( popup, STATE_OPENING );

	if ( advanced.disableScroll ) {
		document.documentElement.classList.add( CLASS_SCROLL_LOCKED );
	}

	if ( rules.maxDisplays && rules.countMode !== 'close' ) {
		incrementStorageNumber( localStorage, popupCountKey( id, 'open' ) );
	}

	const autoClose = Number( advanced.autoClose || 0 );
	if ( autoClose > 0 ) {
		window.clearTimeout( popup.autoCloseTimer );
		popup.autoCloseTimer = window.setTimeout( () => closePopupNode( popup ), autoClose );
	}

	afterAnimation( popup, 'opening', () => {
		if ( popup.isOpen ) {
			setPopupState( popup, STATE_OPEN );
		}
	} );
};

/**
 * Close a popup and release scroll locking when no popup remains open.
 */
const closePopupNode = ( popup ) => {
	if ( ! popup.isOpen ) {
		return;
	}

	const { node, id, settings } = popup;
	const rules = settings.rules || {};

	popup.isOpen = false;
	popup.context.isOpen = false;
	node.classList.add( CLASS_CLOSING );
	node.classList.remove( CLASS_OPEN );
	node.setAttribute( 'aria-hidden', 'true' );
	setPopupState( popup, STATE_CLOSING );
	window.clearTimeout( popup.autoCloseTimer );

	if ( rules.maxDisplays && rules.countMode === 'close' ) {
		incrementStorageNumber( localStorage, popupCountKey( id, 'close' ) );
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
 */
const bindManualSelectors = ( popup ) => {
	const selectors = splitSelectors( popup.settings.advanced?.openSelectors );

	selectors.forEach( ( selector ) => {
		document.addEventListener( 'click', ( event ) => {
			const target = event.target instanceof Element ? event.target.closest( selector ) : null;

			if ( target ) {
				event.preventDefault();
				actions.openPopupById( popup.id, true );
			}
		} );
	} );
};

/**
 * Register automatic popup triggers.
 */
const bindTriggers = ( popup ) => {
	const triggers = popup.settings.triggers || {};

	if ( triggers.pageLoad ) {
		window.setTimeout( () => actions.openPopupById( popup.id ), Number( triggers.pageLoadDelay || 0 ) * 1000 );
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

			const scrollable = document.documentElement.scrollHeight - window.innerHeight;
			const percent = scrollable > 0 ? ( window.scrollY / scrollable ) * 100 : 100;
			if ( percent >= Number( triggers.scrollAmount || 0 ) ) {
				actions.openPopupById( popup.id );
				window.removeEventListener( 'scroll', onScroll );
			}
		};

		window.addEventListener( 'scroll', onScroll, { passive: true } );
	}

	if ( triggers.scrollElement && triggers.scrollSelector ) {
		const target = document.querySelector( triggers.scrollSelector );
		if ( target && 'IntersectionObserver' in window ) {
			const observer = new IntersectionObserver( ( entries ) => {
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
			timer = window.setTimeout( () => actions.openPopupById( popup.id ), Number( triggers.inactivitySeconds || 0 ) * 1000 );
		};

		[ 'mousemove', 'keydown', 'scroll', 'touchstart' ].forEach( ( eventName ) => document.addEventListener( eventName, reset, { passive: true } ) );
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
			animationTimer: null,
			animationCleanup: null,
		};
	} catch ( error ) {
		return null;
	}
};
