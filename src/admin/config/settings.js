/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { config } from './wordpress';
import { DEFAULT_ANIMATION_DURATION, normalizeAnimationDuration } from '../../shared/animation';
import { ANIMATION_CHOICES } from '../../shared/animation-options';

export const defaults = config.defaults || {};

const clone = ( value ) => JSON.parse( JSON.stringify( value || {} ) );

/**
 * Convert stored array values into the comma-separated format DataForm expects.
 *
 * @param {Array|string} value Stored value.
 * @return {string} CSV string.
 */
export const toCsv = ( value ) => Array.isArray( value ) ? value.join( ', ' ) : '';

/**
 * Convert token field values back to arrays for REST persistence.
 *
 * @param {string}  value   CSV input.
 * @param {boolean} numeric Whether to cast tokens to integers.
 * @return {Array<string|number>} Parsed tokens.
 */
export const fromCsv = ( value, numeric = false ) => String( value || '' )
	.split( ',' )
	.map( ( item ) => item.trim() )
	.filter( Boolean )
	.map( ( item ) => numeric ? parseInt( item, 10 ) : item )
	.filter( ( item ) => ! numeric || ! Number.isNaN( item ) );

export const cleanTokens = ( tokens ) => tokens
	.map( ( token ) => String( token || '' ).trim() )
	.filter( Boolean );

/**
 * Flatten grouped popup settings into DataForm's single-record shape.
 *
 * The settings modal only edits behavior tabs now, but style fields remain in
 * this mapping so saving the modal preserves existing design values.
 *
 * @param {Object} settings Grouped popup settings.
 * @return {Object} Flat settings.
 */
export const flattenSettings = ( settings = defaults ) => {
	const merged = {
		...clone( defaults ),
		...clone( settings ),
		layout: { ...( defaults.layout || {} ), ...( settings.layout || {} ) },
		style: { ...( defaults.style || {} ), ...( settings.style || {} ) },
		advanced: { ...( defaults.advanced || {} ), ...( settings.advanced || {} ) },
		conditions: { ...( defaults.conditions || {} ), ...( settings.conditions || {} ) },
		triggers: { ...( defaults.triggers || {} ), ...( settings.triggers || {} ) },
		rules: { ...( defaults.rules || {} ), ...( settings.rules || {} ) },
	};

	return {
		width: merged.layout.width,
		height: merged.layout.height,
		horizontal: merged.layout.horizontal,
		vertical: merged.layout.vertical,
		overlay: merged.layout.overlay,
		closeButton: merged.layout.closeButton,
		entranceAnimation: merged.layout.entranceAnimation,
		exitAnimation: merged.layout.exitAnimation,
		animationDuration: normalizeAnimationDuration( merged.layout.animationDuration ),
		popupBackground: merged.style.popupBackground,
		overlayBackground: merged.style.overlayBackground,
		border: merged.style.border,
		borderType: merged.style.borderType,
		borderColor: merged.style.borderColor,
		borderWidth: merged.style.borderWidth,
		borderRadius: merged.style.borderRadius,
		boxShadow: merged.style.boxShadow,
		closePosition: merged.style.closePosition,
		closeColor: merged.style.closeColor,
		closeBackground: merged.style.closeBackground,
		closeSize: merged.style.closeSize,
		margin: merged.style.margin,
		padding: merged.style.padding,
		customClass: merged.style.customClass,
		closeDelay: merged.advanced.closeDelay,
		autoClose: merged.advanced.autoClose,
		preventOverlayClose: merged.advanced.preventOverlayClose,
		preventEscClose: merged.advanced.preventEscClose,
		disableScroll: merged.advanced.disableScroll,
		avoidMultiple: merged.advanced.avoidMultiple,
		openSelectors: merged.advanced.openSelectors,
		includeEntireSite: merged.conditions.includeEntireSite,
		includeFrontPage: merged.conditions.includeFrontPage,
		includeSingular: merged.conditions.includeSingular,
		includeSingularType: merged.conditions.includeSingularType,
		includeSingularIds: toCsv( merged.conditions.includeSingularIds ),
		includeArchives: merged.conditions.includeArchives,
		includeArchiveIds: toCsv( merged.conditions.includeArchiveIds ),
		includeIds: toCsv( merged.conditions.includeIds ),
		excludeFrontPage: merged.conditions.excludeFrontPage,
		excludeIds: toCsv( merged.conditions.excludeIds ),
		pageLoad: merged.triggers.pageLoad,
		pageLoadDelay: merged.triggers.pageLoadDelay,
		scroll: merged.triggers.scroll,
		scrollDirection: merged.triggers.scrollDirection,
		scrollAmount: merged.triggers.scrollAmount,
		scrollElement: merged.triggers.scrollElement,
		scrollSelector: merged.triggers.scrollSelector,
		click: merged.triggers.click,
		clickCount: merged.triggers.clickCount,
		inactivity: merged.triggers.inactivity,
		inactivitySeconds: merged.triggers.inactivitySeconds,
		exitIntent: merged.triggers.exitIntent,
		pageViews: merged.rules.pageViews,
		pageViewsCount: merged.rules.pageViewsCount,
		sessions: merged.rules.sessions,
		sessionsCount: merged.rules.sessionsCount,
		maxDisplays: merged.rules.maxDisplays,
		maxDisplaysCount: merged.rules.maxDisplaysCount,
		countMode: merged.rules.countMode,
		referrerUrl: merged.rules.referrerUrl,
		referrerMode: merged.rules.referrerMode,
		referrerPattern: merged.rules.referrerPattern,
		referrerRegex: merged.rules.referrerRegex,
		arrivingFrom: toCsv( merged.rules.arrivingFrom ),
		hideLoggedIn: merged.rules.hideLoggedIn,
		hideRoles: toCsv( merged.rules.hideRoles ),
		devices: toCsv( merged.rules.devices ),
	};
};

/**
 * Restore the grouped settings model consumed by PHP and frontend runtime.
 *
 * @param {Object} data Flat DataForm data.
 * @return {Object} Grouped popup settings.
 */
export const unflattenSettings = ( data ) => ( {
	layout: {
		width: data.width,
		height: data.height,
		horizontal: data.horizontal,
		vertical: data.vertical,
		overlay: !! data.overlay,
		closeButton: !! data.closeButton,
		entranceAnimation: data.entranceAnimation,
		exitAnimation: data.exitAnimation,
		animationDuration: normalizeAnimationDuration( data.animationDuration ),
	},
	style: {
		popupBackground: data.popupBackground,
		overlayBackground: data.overlayBackground,
		border: data.border,
		borderType: data.borderType,
		borderColor: data.borderColor,
		borderWidth: data.borderWidth,
		borderRadius: data.borderRadius,
		boxShadow: data.boxShadow,
		closePosition: data.closePosition,
		closeColor: data.closeColor,
		closeBackground: data.closeBackground,
		closeSize: Number( data.closeSize ) || 0,
		margin: data.margin,
		padding: data.padding,
		customClass: data.customClass,
	},
	advanced: {
		closeDelay: Number( data.closeDelay ) || 0,
		autoClose: Number( data.autoClose ) || 0,
		preventOverlayClose: !! data.preventOverlayClose,
		preventEscClose: !! data.preventEscClose,
		disableScroll: !! data.disableScroll,
		avoidMultiple: !! data.avoidMultiple,
		openSelectors: data.openSelectors,
	},
	conditions: {
		includeEntireSite: !! data.includeEntireSite,
		includeFrontPage: !! data.includeFrontPage,
		includeSingular: !! data.includeSingular,
		includeSingularType: data.includeSingularType || 'post',
		includeSingularIds: fromCsv( data.includeSingularIds, true ),
		includeArchives: !! data.includeArchives,
		includeArchiveIds: fromCsv( data.includeArchiveIds, true ),
		includeIds: fromCsv( data.includeIds, true ),
		excludeFrontPage: false,
		excludeIds: fromCsv( data.excludeIds, true ),
	},
	triggers: {
		pageLoad: !! data.pageLoad,
		pageLoadDelay: Number( data.pageLoadDelay ) || 0,
		scroll: !! data.scroll,
		scrollDirection: data.scrollDirection,
		scrollAmount: Number( data.scrollAmount ) || 0,
		scrollElement: !! data.scrollElement,
		scrollSelector: data.scrollSelector,
		click: !! data.click,
		clickCount: Number( data.clickCount ) || 0,
		inactivity: !! data.inactivity,
		inactivitySeconds: Number( data.inactivitySeconds ) || 0,
		exitIntent: !! data.exitIntent,
	},
	rules: {
		pageViews: !! data.pageViews,
		pageViewsCount: Number( data.pageViewsCount ) || 0,
		sessions: !! data.sessions,
		sessionsCount: Number( data.sessionsCount ) || 0,
		maxDisplays: !! data.maxDisplays,
		maxDisplaysCount: Number( data.maxDisplaysCount ) || 0,
		countMode: data.countMode,
		referrerUrl: !! data.referrerUrl,
		referrerMode: data.referrerMode,
		referrerPattern: data.referrerPattern,
		referrerRegex: !! data.referrerRegex,
		arrivingFrom: fromCsv( data.arrivingFrom ),
		hideLoggedIn: !! data.hideLoggedIn,
		hideRoles: fromCsv( data.hideRoles ),
		devices: fromCsv( data.devices ),
	},
} );

const choice = ( values ) => values.map( ( [ value, label ] ) => ( { value, label } ) );

const visibleWhen = ( dependency ) => ( data ) => !! data[ dependency ];

const visibleWhenAny = ( dependencies ) => ( data ) => dependencies.some( ( dependency ) => !! data[ dependency ] );

const numberField = ( id, label, description, options = {} ) => ( {
	id,
	type: 'integer',
	label,
	description,
	...options,
} );

const secondsField = ( id, label, description, options = {} ) => ( {
	id,
	type: 'number',
	label,
	description,
	...options,
} );

const fieldWithoutSideLabel = ( id ) => ( {
	id,
	layout: { type: 'regular', labelPosition: 'none' },
} );

/**
 * Field definitions shared by the settings modal and custom DataForm controls.
 */
export const settingsFields = [
	{ id: 'title', type: 'text', label: __( 'Title', 'blablablocks-popup' ) },
	{ id: 'width', type: 'text', label: __( 'Width', 'blablablocks-popup' ), description: __( 'Use CSS units such as 640px, 80vw, or 100%.', 'blablablocks-popup' ) },
	{ id: 'height', type: 'text', label: __( 'Height', 'blablablocks-popup' ) },
	{ id: 'horizontal', type: 'text', label: __( 'Horizontal position', 'blablablocks-popup' ), elements: choice( [ [ 'left', 'Left' ], [ 'center', 'Center' ], [ 'right', 'Right' ] ] ) },
	{ id: 'vertical', type: 'text', label: __( 'Vertical position', 'blablablocks-popup' ), elements: choice( [ [ 'top', 'Top' ], [ 'center', 'Center' ], [ 'bottom', 'Bottom' ] ] ) },
	{ id: 'overlay', type: 'boolean', label: __( 'Show overlay', 'blablablocks-popup' ) },
	{ id: 'closeButton', type: 'boolean', label: __( 'Show close button', 'blablablocks-popup' ) },
	{ id: 'entranceAnimation', type: 'text', label: __( 'Entrance animation', 'blablablocks-popup' ), elements: ANIMATION_CHOICES },
	{ id: 'exitAnimation', type: 'text', label: __( 'Exit animation', 'blablablocks-popup' ), elements: ANIMATION_CHOICES },
	secondsField( 'animationDuration', __( 'Animation duration', 'blablablocks-popup' ), __( 'Seconds.', 'blablablocks-popup' ), { default: DEFAULT_ANIMATION_DURATION } ),
	{ id: 'popupBackground', type: 'color', label: __( 'Popup background', 'blablablocks-popup' ) },
	{ id: 'overlayBackground', type: 'text', label: __( 'Overlay background', 'blablablocks-popup' ), isVisible: visibleWhen( 'overlay' ) },
	{ id: 'borderType', type: 'text', label: __( 'Border type', 'blablablocks-popup' ), elements: choice( [ [ 'none', 'None' ], [ 'solid', 'Solid' ], [ 'dashed', 'Dashed' ], [ 'dotted', 'Dotted' ], [ 'double', 'Double' ] ] ) },
	{ id: 'borderColor', type: 'color', label: __( 'Border color', 'blablablocks-popup' ) },
	{ id: 'borderWidth', type: 'text', label: __( 'Border width', 'blablablocks-popup' ) },
	{ id: 'borderRadius', type: 'text', label: __( 'Border radius', 'blablablocks-popup' ) },
	{ id: 'boxShadow', type: 'text', label: __( 'Box shadow', 'blablablocks-popup' ) },
	{ id: 'closePosition', type: 'text', label: __( 'Close position', 'blablablocks-popup' ), elements: choice( [ [ 'inside', 'Inside' ], [ 'outside', 'Outside' ] ] ), isVisible: visibleWhen( 'closeButton' ) },
	{ id: 'closeColor', type: 'color', label: __( 'Close color', 'blablablocks-popup' ), isVisible: visibleWhen( 'closeButton' ) },
	{ id: 'closeBackground', type: 'text', label: __( 'Close background', 'blablablocks-popup' ), isVisible: visibleWhen( 'closeButton' ) },
	numberField( 'closeSize', __( 'Close size', 'blablablocks-popup' ), __( 'Pixels.', 'blablablocks-popup' ), { isVisible: visibleWhen( 'closeButton' ) } ),
	{ id: 'margin', type: 'text', label: __( 'Margin', 'blablablocks-popup' ) },
	{ id: 'padding', type: 'text', label: __( 'Padding', 'blablablocks-popup' ) },
	{ id: 'customClass', type: 'text', label: __( 'CSS class', 'blablablocks-popup' ) },
	numberField( 'closeDelay', __( 'Show close button after', 'blablablocks-popup' ), __( 'Seconds. Use 0 to show immediately.', 'blablablocks-popup' ), { isVisible: visibleWhen( 'closeButton' ) } ),
	numberField( 'autoClose', __( 'Auto close after', 'blablablocks-popup' ), __( 'Milliseconds. Use 0 to disable.', 'blablablocks-popup' ) ),
	{ id: 'preventOverlayClose', type: 'boolean', label: __( 'Prevent overlay close', 'blablablocks-popup' ), isVisible: visibleWhen( 'overlay' ) },
	{ id: 'preventEscClose', type: 'boolean', label: __( 'Prevent ESC close', 'blablablocks-popup' ) },
	{ id: 'disableScroll', type: 'boolean', label: __( 'Disable page scrolling', 'blablablocks-popup' ) },
	{ id: 'avoidMultiple', type: 'boolean', label: __( 'Avoid multiple popups', 'blablablocks-popup' ) },
	{ id: 'openSelectors', type: 'text', label: __( 'Open by selector', 'blablablocks-popup' ), description: __( 'CSS selectors that manually open this popup.', 'blablablocks-popup' ), placeholder: __( 'Add selector', 'blablablocks-popup' ) },
	{ id: 'includeEntireSite', type: 'boolean', label: __( 'Include entire site', 'blablablocks-popup' ) },
	{ id: 'includeFrontPage', type: 'boolean', label: __( 'Include front page', 'blablablocks-popup' ) },
	{ id: 'includeSingular', type: 'boolean', label: __( 'Include singular content', 'blablablocks-popup' ) },
	{ id: 'includeSingularIds', type: 'text', label: __( 'Values', 'blablablocks-popup' ), placeholder: __( 'Search content', 'blablablocks-popup' ) },
	{ id: 'includeArchives', type: 'boolean', label: __( 'Include archives', 'blablablocks-popup' ) },
	{ id: 'includeArchiveIds', type: 'text', label: __( 'Values', 'blablablocks-popup' ), placeholder: __( 'Search archives', 'blablablocks-popup' ) },
	{ id: 'includeIds', type: 'text', label: __( 'Include IDs', 'blablablocks-popup' ), description: __( 'Post, page, or queried object IDs.', 'blablablocks-popup' ), placeholder: __( 'Add ID', 'blablablocks-popup' ), isVisible: visibleWhenAny( [ 'includeSingular', 'includeArchives' ] ) },
	{ id: 'pageLoad', type: 'boolean', label: __( 'On page load', 'blablablocks-popup' ) },
	numberField( 'pageLoadDelay', __( 'Page load delay', 'blablablocks-popup' ), __( 'Seconds.', 'blablablocks-popup' ), { isVisible: visibleWhen( 'pageLoad' ) } ),
	{ id: 'scroll', type: 'boolean', label: __( 'On scroll', 'blablablocks-popup' ) },
	{ id: 'scrollDirection', type: 'text', label: __( 'Scroll direction', 'blablablocks-popup' ), elements: choice( [ [ 'down', 'Down' ], [ 'up', 'Up' ] ] ), isVisible: visibleWhen( 'scroll' ) },
	numberField( 'scrollAmount', __( 'Scroll amount', 'blablablocks-popup' ), __( 'Down uses percent; up uses pixels.', 'blablablocks-popup' ), { isVisible: visibleWhen( 'scroll' ) } ),
	{ id: 'scrollElement', type: 'boolean', label: __( 'On scroll to element', 'blablablocks-popup' ) },
	{ id: 'scrollSelector', type: 'text', label: __( 'Scroll selector', 'blablablocks-popup' ), isVisible: visibleWhen( 'scrollElement' ) },
	{ id: 'click', type: 'boolean', label: __( 'On click count', 'blablablocks-popup' ) },
	numberField( 'clickCount', __( 'Click count', 'blablablocks-popup' ), undefined, { isVisible: visibleWhen( 'click' ) } ),
	{ id: 'inactivity', type: 'boolean', label: __( 'After inactivity', 'blablablocks-popup' ) },
	numberField( 'inactivitySeconds', __( 'Inactivity seconds', 'blablablocks-popup' ), undefined, { isVisible: visibleWhen( 'inactivity' ) } ),
	{ id: 'exitIntent', type: 'boolean', label: __( 'On exit intent', 'blablablocks-popup' ) },
	{ id: 'pageViews', type: 'boolean', label: __( 'After page views', 'blablablocks-popup' ) },
	numberField( 'pageViewsCount', __( 'Page views count', 'blablablocks-popup' ), undefined, { isVisible: visibleWhen( 'pageViews' ) } ),
	{ id: 'sessions', type: 'boolean', label: __( 'After sessions', 'blablablocks-popup' ) },
	numberField( 'sessionsCount', __( 'Sessions count', 'blablablocks-popup' ), undefined, { isVisible: visibleWhen( 'sessions' ) } ),
	{ id: 'maxDisplays', type: 'boolean', label: __( 'Limit displays', 'blablablocks-popup' ) },
	numberField( 'maxDisplaysCount', __( 'Max displays', 'blablablocks-popup' ), undefined, { isVisible: visibleWhen( 'maxDisplays' ) } ),
	{ id: 'countMode', type: 'text', label: __( 'Count mode', 'blablablocks-popup' ), elements: choice( [ [ 'open', 'On open' ], [ 'close', 'On close' ] ] ), isVisible: visibleWhen( 'maxDisplays' ) },
	{ id: 'referrerUrl', type: 'boolean', label: __( 'Use referrer URL rule', 'blablablocks-popup' ) },
	{ id: 'referrerMode', type: 'text', label: __( 'Referrer mode', 'blablablocks-popup' ), elements: choice( [ [ 'show', 'Show on match' ], [ 'hide', 'Hide on match' ] ] ), isVisible: visibleWhen( 'referrerUrl' ) },
	{ id: 'referrerPattern', type: 'text', label: __( 'Referrer pattern', 'blablablocks-popup' ), isVisible: visibleWhen( 'referrerUrl' ) },
	{ id: 'referrerRegex', type: 'boolean', label: __( 'Pattern is regex', 'blablablocks-popup' ), isVisible: visibleWhen( 'referrerUrl' ) },
	{ id: 'arrivingFrom', type: 'text', label: __( 'Arriving from', 'blablablocks-popup' ), description: __( 'Allowed sources: search, external, internal.', 'blablablocks-popup' ), placeholder: __( 'Add source', 'blablablocks-popup' ) },
	{ id: 'hideLoggedIn', type: 'boolean', label: __( 'Hide for logged-in users', 'blablablocks-popup' ) },
	{ id: 'hideRoles', type: 'text', label: __( 'Hide roles', 'blablablocks-popup' ), description: __( 'Role slugs that should not see this popup.', 'blablablocks-popup' ), placeholder: __( 'Add role', 'blablablocks-popup' ) },
	{ id: 'devices', type: 'text', label: __( 'Devices', 'blablablocks-popup' ), description: __( 'Allowed devices: desktop, tablet, mobile.', 'blablablocks-popup' ), placeholder: __( 'Add device', 'blablablocks-popup' ) },
];

/**
 * Vertical settings tabs shown in the DataForm modal.
 */
export const settingsTabs = [
	{
		id: 'advanced',
		label: __( 'Advanced', 'blablablocks-popup' ),
		description: __( 'Closing behavior, scroll locking, multiple popup handling, and manual open selectors.', 'blablablocks-popup' ),
		fields: [ 'closeDelay', 'autoClose', 'preventOverlayClose', 'preventEscClose', 'disableScroll', 'avoidMultiple', 'openSelectors' ],
	},
	{
		id: 'conditions',
		label: __( 'Conditions', 'blablablocks-popup' ),
		description: __( 'Choose where this popup can appear. Enabled locations are included; disabled locations are excluded for that context.', 'blablablocks-popup' ),
		fields: [
			'includeEntireSite',
			'includeFrontPage',
			'includeSingular',
			fieldWithoutSideLabel( 'includeSingularIds' ),
			'includeArchives',
			fieldWithoutSideLabel( 'includeArchiveIds' ),
		],
	},
	{
		id: 'triggers',
		label: __( 'Triggers', 'blablablocks-popup' ),
		description: __( 'Events that can automatically open this popup.', 'blablablocks-popup' ),
		fields: [ 'pageLoad', 'pageLoadDelay', 'scroll', 'scrollDirection', 'scrollAmount', 'scrollElement', 'scrollSelector', 'click', 'clickCount', 'inactivity', 'inactivitySeconds', 'exitIntent' ],
	},
	{
		id: 'rules',
		label: __( 'Advanced rules', 'blablablocks-popup' ),
		description: __( 'Runtime limits for page views, sessions, display counts, referrers, users, roles, and devices.', 'blablablocks-popup' ),
		fields: [ 'pageViews', 'pageViewsCount', 'sessions', 'sessionsCount', 'maxDisplays', 'maxDisplaysCount', 'countMode', 'referrerUrl', 'referrerMode', 'referrerPattern', 'referrerRegex', 'arrivingFrom', 'hideLoggedIn', 'hideRoles', 'devices' ],
	},
];

export const titleField = settingsFields.find( ( field ) => field.id === 'title' );
export const tokenFieldIds = [ 'openSelectors', 'includeSingularIds', 'includeArchiveIds', 'includeIds', 'arrivingFrom', 'hideRoles', 'devices' ];
export const numericTokenFieldIds = [ 'includeSingularIds', 'includeArchiveIds', 'includeIds' ];
export const tokenFieldSuggestions = {
	arrivingFrom: [ 'search', 'external', 'internal' ],
	devices: [ 'desktop', 'tablet', 'mobile' ],
	hideRoles: [ 'administrator', 'editor', 'author', 'contributor', 'subscriber', 'customer', 'shop_manager' ],
};
