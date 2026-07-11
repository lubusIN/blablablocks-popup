/**
 * CSS variables controlled by popup settings in the editor preview.
 */
export const canvasPreviewVariables = [
	'--blablablocks-popup-editor-width',
	'--blablablocks-popup-editor-height',
	'--blablablocks-popup-editor-align-x',
	'--blablablocks-popup-editor-align-y',
	'--blablablocks-popup-editor-overlay-background',
	'--blablablocks-popup-editor-background',
	'--blablablocks-popup-editor-border',
	'--blablablocks-popup-editor-radius',
	'--blablablocks-popup-editor-margin',
	'--blablablocks-popup-editor-padding',
	'--blablablocks-popup-editor-close-display',
	'--blablablocks-popup-editor-close-size',
	'--blablablocks-popup-editor-close-color',
	'--blablablocks-popup-editor-close-background',
	'--blablablocks-popup-editor-duration',
];

const resolveCssValue = ( value ) => String( value || '' ).replace(
	/var:preset\|(color|gradient|spacing)\|([a-zA-Z0-9_-]+)/g,
	'var(--wp--preset--$1--$2)'
);

const safeCssValue = ( value, fallback ) => {
	const resolved = resolveCssValue( value || fallback );

	return /^[#a-zA-Z0-9\s.,%()+*\/_-]+$/.test( resolved ) ? resolved : fallback;
};

const getFlexAlignment = ( value ) => {
	if ( 'left' === value || 'top' === value ) {
		return 'flex-start';
	}

	if ( 'right' === value || 'bottom' === value ) {
		return 'flex-end';
	}

	return 'center';
};

const getBorder = ( style ) => {
	if ( ! style.borderType || 'none' === style.borderType ) {
		return '0 solid transparent';
	}

	const width = safeCssValue( style.borderWidth, '1px' );
	const type = [ 'solid', 'dashed', 'dotted', 'double' ].includes( style.borderType ) ? style.borderType : 'solid';
	const color = safeCssValue( style.borderColor, '#dcdcde' );

	return `${ width } ${ type } ${ color }`;
};

/**
 * Convert popup settings into preview CSS custom properties.
 */
export const getCanvasPreviewVariables = ( settings ) => {
	const layout = settings.layout || {};
	const style = settings.style || {};
	const width = safeCssValue( layout.width, '640px' );
	const closeSize = `${ Math.max( 12, Number( style.closeSize || 28 ) ) }px`;

	return {
		'--blablablocks-popup-editor-width': '100%' === width ? 'min(100%, 960px)' : width,
		'--blablablocks-popup-editor-height': safeCssValue( layout.height, 'auto' ),
		'--blablablocks-popup-editor-align-x': getFlexAlignment( layout.horizontal ),
		'--blablablocks-popup-editor-align-y': getFlexAlignment( layout.vertical ),
		'--blablablocks-popup-editor-overlay-background': layout.overlay ? safeCssValue( style.overlayBackground, 'rgba(0,0,0,.55)' ) : '#f0f0f0',
		'--blablablocks-popup-editor-background': safeCssValue( style.popupBackground, '#ffffff' ),
		'--blablablocks-popup-editor-border': getBorder( style ),
		'--blablablocks-popup-editor-radius': safeCssValue( style.borderRadius, '8px' ),
		'--blablablocks-popup-editor-margin': safeCssValue( style.margin, '24px' ),
		'--blablablocks-popup-editor-padding': safeCssValue( style.padding, '32px' ),
		'--blablablocks-popup-editor-close-display': layout.closeButton ? 'flex' : 'none',
		'--blablablocks-popup-editor-close-size': closeSize,
		'--blablablocks-popup-editor-close-color': safeCssValue( style.closeColor, '#1e1e1e' ),
		'--blablablocks-popup-editor-close-background': safeCssValue( style.closeBackground, 'transparent' ),
		'--blablablocks-popup-editor-duration': `${ Number( layout.animationDuration || 0.3 ) }s`,
	};
};
