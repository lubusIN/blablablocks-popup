/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { DEFAULT_ANIMATION_DURATION } from '../../../shared/animation';
import { ANIMATION_CHOICES } from '../../../shared/animation-options';

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

export const titleField = settingsFields.find( ( field ) => field.id === 'title' );
