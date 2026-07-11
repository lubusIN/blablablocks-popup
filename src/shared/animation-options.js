/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Animation choices shared by admin DataForm and editor controls.
 */
export const ANIMATION_CHOICES = [
	{ value: 'fade', label: __( 'Fade', 'blablablocks-popup' ) },
	{ value: 'zoom', label: __( 'Zoom', 'blablablocks-popup' ) },
	{ value: 'zoom-out', label: __( 'Zoom out', 'blablablocks-popup' ) },
	{ value: 'slide-up', label: __( 'Slide up', 'blablablocks-popup' ) },
	{ value: 'slide-down', label: __( 'Slide down', 'blablablocks-popup' ) },
	{ value: 'slide-left', label: __( 'Slide left', 'blablablocks-popup' ) },
	{ value: 'slide-right', label: __( 'Slide right', 'blablablocks-popup' ) },
	{ value: 'flip-up', label: __( 'Flip up', 'blablablocks-popup' ) },
	{ value: 'flip-down', label: __( 'Flip down', 'blablablocks-popup' ) },
	{ value: 'none', label: __( 'None', 'blablablocks-popup' ) },
];
