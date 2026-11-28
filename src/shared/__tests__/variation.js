/**
 * Internal dependencies
 */
import {
	VARIATION_QUERY_PARAM,
	VARIATION_SESSION_KEY,
	clearStoredVariationPostId,
	getStoredVariationPostId,
	getVariationEditUrl,
	rememberVariationPost,
	removeVariationQueryParam,
	shouldOpenVariationChooser,
} from '../variation';

describe( 'variation helpers', () => {
	beforeEach( () => {
		window.sessionStorage.clear();
	} );

	describe( 'constants', () => {
		it( 'defines query param and session storage key', () => {
			expect( VARIATION_QUERY_PARAM ).toBe(
				'blablablocks_popup_variations'
			);
			expect( VARIATION_SESSION_KEY ).toBe(
				'blablablocks-popup-created-post'
			);
		} );
	} );

	describe( 'getVariationEditUrl', () => {
		it( 'appends the variation query param to an edit URL', () => {
			const url = getVariationEditUrl( 'post.php?post=42&action=edit' );
			expect( url ).toContain( `${ VARIATION_QUERY_PARAM }=1` );
		} );
	} );

	describe( 'session storage helpers', () => {
		it( 'stores, reads, and clears the variation post ID', () => {
			expect( getStoredVariationPostId() ).toBeNull();

			rememberVariationPost( 123 );
			expect( getStoredVariationPostId() ).toBe( '123' );

			clearStoredVariationPostId();
			expect( getStoredVariationPostId() ).toBeNull();
		} );
	} );

	describe( 'shouldOpenVariationChooser', () => {
		it( 'returns true when query param is present', () => {
			delete window.location;
			window.location = new URL(
				`http://example.com/wp-admin/post.php?post=99&${ VARIATION_QUERY_PARAM }=1`
			);

			expect( shouldOpenVariationChooser( 99 ) ).toBe( true );
		} );

		it( 'returns true when session post ID matches current post', () => {
			delete window.location;
			window.location = new URL(
				'http://example.com/wp-admin/post.php?post=99'
			);
			rememberVariationPost( 99 );

			expect( shouldOpenVariationChooser( 99 ) ).toBe( true );
		} );

		it( 'returns false when neither query param nor matching session ID exists', () => {
			delete window.location;
			window.location = new URL(
				'http://example.com/wp-admin/post.php?post=99'
			);
			rememberVariationPost( 100 );

			expect( shouldOpenVariationChooser( 99 ) ).toBe( false );
		} );
	} );

	describe( 'removeVariationQueryParam', () => {
		it( 'removes query param from browser history', () => {
			delete window.location;
			window.location = new URL(
				`http://example.com/wp-admin/post.php?post=99&${ VARIATION_QUERY_PARAM }=1`
			);
			const replaceStateSpy = jest.spyOn(
				window.history,
				'replaceState'
			);

			removeVariationQueryParam();

			expect( replaceStateSpy ).toHaveBeenCalled();
			const updatedUrl = new URL( replaceStateSpy.mock.calls[ 0 ][ 2 ] );
			expect( updatedUrl.searchParams.has( VARIATION_QUERY_PARAM ) ).toBe(
				false
			);
			expect( updatedUrl.searchParams.get( 'post' ) ).toBe( '99' );
			replaceStateSpy.mockRestore();
		} );
	} );
} );
