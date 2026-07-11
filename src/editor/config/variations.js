/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { pluginUrl } from './wordpress';

const variationImage = ( filename ) => `${ pluginUrl }assets/variations/${ filename }`;

const heading = ( content ) => ( {
	name: 'core/heading',
	attributes: {
		content,
		level: 2,
	},
} );

const paragraph = ( content ) => ( {
	name: 'core/paragraph',
	attributes: { content },
} );

const button = ( text ) => ( {
	name: 'core/buttons',
	innerBlocks: [
		{
			name: 'core/button',
			attributes: { text },
		},
	],
} );

const group = ( innerBlocks, attributes = {} ) => ( {
	name: 'core/group',
	attributes: {
		layout: { type: 'constrained' },
		...attributes,
	},
	innerBlocks,
} );

/**
 * Starter popup variations shown once after creating a popup.
 */
export const POPUP_VARIATIONS = [
	{
		id: 'modal',
		label: __( 'Modal Popup', 'blablablocks-popup' ),
		description: __( 'Centered announcement, offer, or form prompt.', 'blablablocks-popup' ),
		image: variationImage( 'modal.png' ),
		settings: {
			layout: {
				width: '640px',
				height: 'auto',
				horizontal: 'center',
				vertical: 'center',
				overlay: true,
				closeButton: true,
				entranceAnimation: 'zoom',
				exitAnimation: 'zoom',
				animationDuration: 0.3,
			},
			style: {
				padding: '32px',
				borderRadius: '8px',
			},
		},
		template: [
			group( [
				heading( __( 'Popup headline', 'blablablocks-popup' ) ),
				paragraph( __( 'Add your popup message, form, offer, or call to action.', 'blablablocks-popup' ) ),
				button( __( 'Get started', 'blablablocks-popup' ) ),
			] ),
		],
	},
	{
		id: 'slide-in',
		label: __( 'Slide-in Popup', 'blablablocks-popup' ),
		description: __( 'A side panel for offers, signups, or contextual prompts.', 'blablablocks-popup' ),
		image: variationImage( 'slide-in.png' ),
		settings: {
			layout: {
				width: '420px',
				height: 'auto',
				horizontal: 'right',
				vertical: 'center',
				overlay: true,
				closeButton: true,
				entranceAnimation: 'slide-left',
				exitAnimation: 'slide-right',
				animationDuration: 0.35,
			},
			style: {
				padding: '28px',
				borderRadius: '8px',
			},
		},
		template: [
			group( [
				heading( __( 'Limited-time offer', 'blablablocks-popup' ) ),
				paragraph( __( 'Use this space for a focused message that slides in without taking over the page.', 'blablablocks-popup' ) ),
				button( __( 'View offer', 'blablablocks-popup' ) ),
			] ),
		],
	},
	{
		id: 'floating-bar',
		label: __( 'Floating Bar', 'blablablocks-popup' ),
		description: __( 'A compact top or bottom bar for site-wide notices.', 'blablablocks-popup' ),
		image: variationImage( 'floating-bar.png' ),
		settings: {
			layout: {
				width: '100%',
				height: 'auto',
				horizontal: 'center',
				vertical: 'top',
				overlay: false,
				closeButton: true,
				entranceAnimation: 'slide-down',
				exitAnimation: 'slide-up',
				animationDuration: 0.3,
			},
			style: {
				padding: '16px 24px',
				borderRadius: '0px',
			},
		},
		template: [
			group(
				[
					paragraph( __( 'Announce shipping updates, discounts, or important news in a floating bar.', 'blablablocks-popup' ) ),
				],
				{ layout: { type: 'flex', justifyContent: 'center' } }
			),
		],
	},
	{
		id: 'fullscreen',
		label: __( 'Fullscreen Popup', 'blablablocks-popup' ),
		description: __( 'A full-canvas takeover for launches, gates, or campaigns.', 'blablablocks-popup' ),
		image: variationImage( 'fullscreen.png' ),
		settings: {
			layout: {
				width: '100%',
				height: '100%',
				horizontal: 'center',
				vertical: 'center',
				overlay: true,
				closeButton: true,
				entranceAnimation: 'fade',
				exitAnimation: 'fade',
				animationDuration: 0.35,
			},
			style: {
				padding: '48px',
				borderRadius: '0px',
			},
		},
		template: [
			group( [
				heading( __( 'Make a bigger announcement', 'blablablocks-popup' ) ),
				paragraph( __( 'Use a fullscreen popup for high-priority campaigns, gated content, or product launches.', 'blablablocks-popup' ) ),
				button( __( 'Continue', 'blablablocks-popup' ) ),
			] ),
		],
	},
	{
		id: 'toast',
		label: __( 'Toast / Small Notification', 'blablablocks-popup' ),
		description: __( 'A small notification for short messages and reminders.', 'blablablocks-popup' ),
		image: variationImage( 'toast.png' ),
		settings: {
			layout: {
				width: '360px',
				height: 'auto',
				horizontal: 'right',
				vertical: 'bottom',
				overlay: false,
				closeButton: true,
				entranceAnimation: 'slide-up',
				exitAnimation: 'slide-down',
				animationDuration: 0.3,
			},
			style: {
				padding: '20px',
				borderRadius: '8px',
			},
		},
		template: [
			group( [
				heading( __( 'Quick update', 'blablablocks-popup' ) ),
				paragraph( __( 'Share a brief notification without interrupting the page.', 'blablablocks-popup' ) ),
			] ),
		],
	},
];
