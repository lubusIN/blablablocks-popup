/**
 * WordPress dependencies
 */
import { getConfig } from '@wordpress/interactivity';

/**
 * Internal dependencies
 */
import { STORE_NAMESPACE, VIEWPORT_BRIDGE_GLOBAL } from '../config/constants';

/**
 * Runtime data injected by PHP when frontend assets are enqueued.
 */
export const runtime = getConfig( STORE_NAMESPACE ) || {};

/**
 * Split CSS selector lists used for manual popup triggers.
 * @param {Array|string} value Selector list.
 */
export const splitSelectors = ( value ) =>
	String( value || '' )
		.split( ',' )
		.map( ( selector ) => selector.trim() )
		.filter( ( selector ) => {
			if ( ! selector ) {
				return false;
			}

			try {
				document.createDocumentFragment().querySelector( selector );
				return true;
			} catch {
				return false;
			}
		} );

/**
 * Find a matching element without allowing invalid user selectors to throw.
 * @param {string}                    selector CSS selector.
 * @param {Document|DocumentFragment} root     Query root.
 */
export const findElement = ( selector, root = document ) => {
	if ( ! selector || ! root?.querySelector ) {
		return null;
	}

	try {
		return root.querySelector( selector );
	} catch {
		return null;
	}
};

/**
 * Find a matching ancestor without allowing invalid user selectors to throw.
 * @param {Element|null} element  Starting element.
 * @param {string}       selector CSS selector.
 */
export const findClosest = ( element, selector ) => {
	if ( ! element?.closest || ! selector ) {
		return null;
	}

	try {
		return element.closest( selector );
	} catch {
		return null;
	}
};

/**
 * Normalize comma-separated setting strings and array values to arrays.
 * @param {Array|string} value Comma-separated or array value.
 */
export const splitList = ( value ) =>
	Array.isArray( value )
		? value
		: String( value || '' )
				.split( ',' )
				.map( ( item ) => item.trim() )
				.filter( Boolean );

/**
 * Match the responsive device buckets used by popup display rules.
 */
export const getDevice = () => {
	const { isViewportMatch } = window[ VIEWPORT_BRIDGE_GLOBAL ] || {};

	if ( isViewportMatch?.( '< medium' ) ) {
		return 'mobile';
	}

	if ( isViewportMatch?.( '< large' ) ) {
		return 'tablet';
	}

	return 'desktop';
};
