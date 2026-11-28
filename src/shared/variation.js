/**
 * Query parameter and session storage key for newly created popups.
 */
export const VARIATION_QUERY_PARAM = 'blablablocks_popup_variations';
export const VARIATION_SESSION_KEY = 'blablablocks-popup-created-post';

/**
 * Append the variation query parameter to an edit URL.
 *
 * @param {string} editUrl Post edit URL.
 * @return {string} URL with variation parameter.
 */
export const getVariationEditUrl = ( editUrl ) => {
	const url = new URL( editUrl, window.location.href );
	url.searchParams.set( VARIATION_QUERY_PARAM, '1' );

	return url.toString();
};

/**
 * Remove the variation query parameter from the current browser URL.
 */
export const removeVariationQueryParam = () => {
	try {
		const url = new URL( window.location.href );
		url.searchParams.delete( VARIATION_QUERY_PARAM );
		window.history.replaceState( {}, '', url.toString() );
	} catch {}
};

/**
 * Remember the newly created popup ID in session storage.
 *
 * @param {number|string} postId Post ID.
 */
export const rememberVariationPost = ( postId ) => {
	try {
		window.sessionStorage.setItem(
			VARIATION_SESSION_KEY,
			String( postId )
		);
	} catch {}
};

/**
 * Retrieve the stored variation post ID from session storage.
 *
 * @return {string|null} Post ID or null.
 */
export const getStoredVariationPostId = () => {
	try {
		return window.sessionStorage.getItem( VARIATION_SESSION_KEY );
	} catch {
		return null;
	}
};

/**
 * Clear the stored variation post ID from session storage.
 */
export const clearStoredVariationPostId = () => {
	try {
		window.sessionStorage.removeItem( VARIATION_SESSION_KEY );
	} catch {}
};

/**
 * Check whether the variation chooser modal should be opened.
 *
 * @param {number|string} [currentPostId] Current post ID.
 * @return {boolean} Whether to show the chooser.
 */
export const shouldOpenVariationChooser = ( currentPostId ) => {
	try {
		const params = new URLSearchParams( window.location.search );
		const storedPostId = getStoredVariationPostId();
		const postId = String( currentPostId || '' );

		return (
			params.get( VARIATION_QUERY_PARAM ) === '1' ||
			( !! postId && storedPostId === postId )
		);
	} catch {
		return false;
	}
};
