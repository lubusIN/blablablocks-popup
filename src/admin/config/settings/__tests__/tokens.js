/**
 * Internal dependencies
 */
import { cleanTokens, fromCsv, toCsv } from '../tokens';

describe( 'settings token transforms', () => {
	it( 'preserves taxonomy-qualified archive tokens', () => {
		const tokens = fromCsv( 'category:12, post_tag:12, 7' );

		expect( tokens ).toEqual( [ 'category:12', 'post_tag:12', '7' ] );
		expect( toCsv( tokens ) ).toBe( 'category:12, post_tag:12, 7' );
	} );

	it( 'removes blank token values without changing valid selectors', () => {
		expect(
			cleanTokens( [ ' .open-popup ', '', null, '#offer' ] )
		).toEqual( [ '.open-popup', '#offer' ] );
	} );
} );
