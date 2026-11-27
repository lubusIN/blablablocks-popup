/**
 * Mock WordPress dependencies before importing browser utils.
 */
jest.mock( '@wordpress/interactivity', () => ( {
	getConfig: () => ( {} ),
} ) );

/**
 * Internal dependencies
 */
import { findElement, splitSelectors } from '../browser';

describe( 'browser utils', () => {
	describe( 'splitSelectors', () => {
		it( 'handles empty and null values gracefully', () => {
			expect( splitSelectors( '' ) ).toEqual( [] );
			expect( splitSelectors( null ) ).toEqual( [] );
			expect( splitSelectors( undefined ) ).toEqual( [] );
		} );

		it( 'splits multiple valid selectors and trims whitespace', () => {
			expect(
				splitSelectors(
					'.btn-popup,  #hero-cta , button[data-trigger]'
				)
			).toEqual( [ '.btn-popup', '#hero-cta', 'button[data-trigger]' ] );
		} );

		it( 'filters out invalid CSS selectors without throwing', () => {
			expect(
				splitSelectors( '.valid, :::invalid:::, #another-valid' )
			).toEqual( [ '.valid', '#another-valid' ] );
		} );
	} );

	describe( 'findElement', () => {
		it( 'returns null on falsy selectors or invalid root', () => {
			expect( findElement( '' ) ).toBeNull();
			expect( findElement( null ) ).toBeNull();
			expect( findElement( '.btn', null ) ).toBeNull();
		} );

		it( 'returns null when selector is invalid instead of throwing', () => {
			expect( findElement( ':::bad:::selector' ) ).toBeNull();
		} );

		it( 'finds existing element in the DOM root', () => {
			const container = document.createElement( 'div' );
			container.innerHTML = '<span class="find-me">Hello</span>';
			const found = findElement( '.find-me', container );
			expect( found ).not.toBeNull();
			expect( found?.textContent ).toBe( 'Hello' );
		} );
	} );
} );
