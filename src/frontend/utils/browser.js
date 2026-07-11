/**
 * WordPress dependencies
 */
import { getConfig } from '@wordpress/interactivity';

/**
 * Internal dependencies
 */
import { STORE_NAMESPACE } from '../config/constants';

/**
 * Runtime data injected by PHP when frontend assets are enqueued.
 */
export const runtime = getConfig( STORE_NAMESPACE ) || {};

/**
 * Split CSS selector lists used for manual popup triggers.
 */
export const splitSelectors = ( value ) => String( value || '' )
	.split( ',' )
	.map( ( selector ) => selector.trim() )
	.filter( Boolean );

/**
 * Normalize comma-separated setting strings and array values to arrays.
 */
export const splitList = ( value ) => Array.isArray( value ) ? value : String( value || '' )
	.split( ',' )
	.map( ( item ) => item.trim() )
	.filter( Boolean );

/**
 * Match the responsive device buckets used by popup display rules.
 */
export const getDevice = () => {
	const width = window.innerWidth;

	if ( width < 768 ) {
		return 'mobile';
	}

	if ( width < 1025 ) {
		return 'tablet';
	}

	return 'desktop';
};
