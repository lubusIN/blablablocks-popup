/**
 * Internal dependencies
 */
import {
	collapseBoxValues,
	parseBoxShorthand,
	resolveCssValue,
	safeCssValue,
} from '../css';

describe( 'CSS helpers', () => {
	describe( 'resolveCssValue', () => {
		it( 'resolves spacing preset variables', () => {
			expect( resolveCssValue( 'var:preset|spacing|50' ) ).toBe(
				'var(--wp--preset--spacing--50)'
			);
		} );

		it( 'resolves color and gradient preset variables', () => {
			expect(
				resolveCssValue( 'var:preset|color|vivid-cyan-blue' )
			).toBe( 'var(--wp--preset--color--vivid-cyan-blue)' );
			expect(
				resolveCssValue( 'var:preset|gradient|cool-to-warm-spectrum' )
			).toBe( 'var(--wp--preset--gradient--cool-to-warm-spectrum)' );
		} );

		it( 'returns non-string or plain values unchanged', () => {
			expect( resolveCssValue( 28 ) ).toBe( 28 );
			expect( resolveCssValue( null ) ).toBe( null );
			expect( resolveCssValue( '#ffffff' ) ).toBe( '#ffffff' );
		} );
	} );

	describe( 'safeCssValue', () => {
		it( 'returns resolved safe CSS values', () => {
			expect( safeCssValue( '24px', '0px' ) ).toBe( '24px' );
			expect( safeCssValue( 'var:preset|spacing|40', '10px' ) ).toBe(
				'var(--wp--preset--spacing--40)'
			);
		} );

		it( 'falls back when invalid characters are detected', () => {
			expect( safeCssValue( 'javascript:alert(1)', 'fallback' ) ).toBe(
				'fallback'
			);
		} );
	} );

	describe( 'parseBoxShorthand', () => {
		it( 'expands single-value shorthand to 4 sides', () => {
			expect( parseBoxShorthand( '10px' ) ).toEqual( [
				'10px',
				'10px',
				'10px',
				'10px',
			] );
		} );

		it( 'expands 2-value shorthand', () => {
			expect( parseBoxShorthand( '10px 20px' ) ).toEqual( [
				'10px',
				'20px',
				'10px',
				'20px',
			] );
		} );

		it( 'expands 3-value shorthand', () => {
			expect( parseBoxShorthand( '10px 20px 30px' ) ).toEqual( [
				'10px',
				'20px',
				'30px',
				'20px',
			] );
		} );

		it( 'returns 4 values when 4 provided', () => {
			expect( parseBoxShorthand( '10px 20px 30px 40px' ) ).toEqual( [
				'10px',
				'20px',
				'30px',
				'40px',
			] );
		} );

		it( 'handles slash-separated radius shorthand', () => {
			expect( parseBoxShorthand( '8px / 12px' ) ).toEqual( [
				'8px',
				'8px',
				'8px',
				'8px',
			] );
		} );

		it( 'preserves slashes inside parentheses such as calc()', () => {
			expect( parseBoxShorthand( 'calc(100%/2)' ) ).toEqual( [
				'calc(100%/2)',
				'calc(100%/2)',
				'calc(100%/2)',
				'calc(100%/2)',
			] );
			expect(
				parseBoxShorthand( 'calc(100px/2) 20px / 5px 10px' )
			).toEqual( [ 'calc(100px/2)', '20px', 'calc(100px/2)', '20px' ] );
		} );

		it( 'returns null for empty input', () => {
			expect( parseBoxShorthand( '' ) ).toBeNull();
			expect( parseBoxShorthand( null ) ).toBeNull();
		} );
	} );

	describe( 'collapseBoxValues', () => {
		it( 'collapses identical values to 1 value', () => {
			expect( collapseBoxValues( '10px', '10px', '10px', '10px' ) ).toBe(
				'10px'
			);
		} );

		it( 'collapses vertical and horizontal pairs to 2 values', () => {
			expect( collapseBoxValues( '10px', '20px', '10px', '20px' ) ).toBe(
				'10px 20px'
			);
		} );

		it( 'collapses matching left and right to 3 values', () => {
			expect( collapseBoxValues( '10px', '20px', '30px', '20px' ) ).toBe(
				'10px 20px 30px'
			);
		} );

		it( 'returns 4 values when distinct', () => {
			expect( collapseBoxValues( '10px', '20px', '30px', '40px' ) ).toBe(
				'10px 20px 30px 40px'
			);
		} );

		it( 'returns empty string when all empty', () => {
			expect( collapseBoxValues( '', '', '', '' ) ).toBe( '' );
		} );
	} );
} );
