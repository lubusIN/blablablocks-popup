/**
 * Internal dependencies
 */
import {
	CSS_DURATION_VAR,
	SELECTOR_CLOSE_BUTTON,
	SELECTOR_DIALOG,
	SELECTOR_OVERLAY,
} from '../config/constants';
import { normalizeAnimationDuration } from '../../shared/animation';

/**
 * Convert WordPress preset tokens into CSS custom property references.
 */
const resolveCssValue = ( value ) => {
	if ( typeof value !== 'string' ) {
		return value;
	}

	return value.replace(
		/var:preset\|spacing\|([a-zA-Z0-9_-]+)/g,
		'var(--wp--preset--spacing--$1)'
	);
};

const hasBorderValue = ( border ) => (
	border &&
	typeof border === 'object' &&
	[ border.color, border.style, border.width ].some( Boolean )
);

const hasSplitBorderValue = ( border ) => (
	border &&
	typeof border === 'object' &&
	[ 'top', 'right', 'bottom', 'left' ].some( ( side ) => hasBorderValue( border[ side ] ) )
);

const applyBorderSide = ( dialog, side, border ) => {
	const property = side.charAt( 0 ).toUpperCase() + side.slice( 1 );

	dialog.style[ `border${ property }Style` ] = border?.style || 'solid';
	dialog.style[ `border${ property }Color` ] = border?.color || '#dcdcde';
	dialog.style[ `border${ property }Width` ] = resolveCssValue( border?.width || '1px' );
};

const applyBorderStyles = ( dialog, style ) => {
	const border = style.border || {};

	if ( hasSplitBorderValue( border ) ) {
		dialog.style.borderStyle = 'none';
		[ 'top', 'right', 'bottom', 'left' ].forEach( ( side ) => {
			if ( hasBorderValue( border[ side ] ) ) {
				applyBorderSide( dialog, side, border[ side ] );
			}
		} );
		return;
	}

	if ( hasBorderValue( border ) ) {
		dialog.style.borderStyle = border.style || 'solid';
		dialog.style.borderColor = border.color || '#dcdcde';
		dialog.style.borderWidth = resolveCssValue( border.width || '1px' );
		return;
	}

	dialog.style.borderStyle = style.borderType || 'none';
	dialog.style.borderColor = style.borderColor || '#dcdcde';
	dialog.style.borderWidth = style.borderType === 'none' ? '0' : resolveCssValue( style.borderWidth || '1px' );
};

/**
 * Apply saved layout and style settings to a rendered popup node.
 */
export const applyInlineStyles = ( popup ) => {
	const { node, settings } = popup;
	const layout = settings.layout || {};
	const style = settings.style || {};
	const advanced = settings.advanced || {};
	const dialog = node.querySelector( SELECTOR_DIALOG );
	const overlay = node.querySelector( SELECTOR_OVERLAY );
	const close = node.querySelector( SELECTOR_CLOSE_BUTTON );

	node.dataset.horizontal = layout.horizontal || 'center';
	node.dataset.vertical = layout.vertical || 'center';
	node.dataset.entranceAnimation = layout.entranceAnimation || 'fade';
	node.dataset.exitAnimation = layout.exitAnimation || 'fade';

	node.style.setProperty( CSS_DURATION_VAR, `${ normalizeAnimationDuration( layout.animationDuration ) }s` );

	if ( dialog ) {
		dialog.style.width = layout.width || '640px';
		dialog.style.height = layout.height || 'auto';
		dialog.style.background = style.popupBackground || '#fff';
		applyBorderStyles( dialog, style );
		dialog.style.borderRadius = style.borderRadius || '8px';
		dialog.style.boxShadow = style.boxShadow || 'none';
		dialog.style.margin = resolveCssValue( style.margin || '24px' );
		dialog.style.padding = resolveCssValue( style.padding || '32px' );
	}

	if ( overlay ) {
		overlay.style.display = layout.overlay ? 'block' : 'none';
		overlay.style.background = style.overlayBackground || 'rgba(0,0,0,0.55)';
	}

	if ( close ) {
		close.style.color = style.closeColor || '#1e1e1e';
		close.style.background = style.closeBackground || 'transparent';
		close.style.width = `${ Number( style.closeSize || 28 ) }px`;
		close.style.height = `${ Number( style.closeSize || 28 ) }px`;

		if ( ! layout.closeButton ) {
			close.hidden = true;
		} else if ( Number( advanced.closeDelay || 0 ) > 0 ) {
			close.hidden = true;
			window.setTimeout( () => {
				close.hidden = false;
			}, Number( advanced.closeDelay ) * 1000 );
		}
	}
};
