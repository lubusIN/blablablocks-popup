/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const fieldWithoutSideLabel = ( id ) => ( {
	id,
	layout: { type: 'regular', labelPosition: 'none' },
} );

/**
 * Vertical settings tabs shown in the DataForm modal.
 */
export const settingsTabs = [
	{
		id: 'advanced',
		label: __( 'Advanced', 'blablablocks-popup' ),
		description: __(
			'Closing behavior, scroll locking, multiple popup handling, and manual open selectors.',
			'blablablocks-popup'
		),
		fields: [
			'closeDelay',
			'autoClose',
			'preventOverlayClose',
			'preventEscClose',
			'disableScroll',
			'avoidMultiple',
			'openSelectors',
		],
	},
	{
		id: 'conditions',
		label: __( 'Conditions', 'blablablocks-popup' ),
		description: __(
			'Choose where this popup can appear. Enabled locations are included; disabled locations are excluded for that context.',
			'blablablocks-popup'
		),
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
		description: __(
			'Events that can automatically open this popup.',
			'blablablocks-popup'
		),
		fields: [
			'pageLoad',
			'pageLoadDelay',
			'scroll',
			'scrollDirection',
			'scrollAmount',
			'scrollElement',
			'scrollSelector',
			'click',
			'clickCount',
			'inactivity',
			'inactivitySeconds',
			'exitIntent',
		],
	},
	{
		id: 'rules',
		label: __( 'Advanced rules', 'blablablocks-popup' ),
		description: __(
			'Runtime limits for page views, sessions, display counts, referrers, users, roles, and devices.',
			'blablablocks-popup'
		),
		fields: [
			'pageViews',
			'pageViewsCount',
			'sessions',
			'sessionsCount',
			'maxDisplays',
			'maxDisplaysCount',
			'countMode',
			'referrerUrl',
			'referrerMode',
			'referrerPattern',
			'referrerRegex',
			'arrivingFrom',
			'hideLoggedIn',
			'hideRoles',
			'devices',
		],
	},
];
