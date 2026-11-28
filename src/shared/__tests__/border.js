/**
 * Internal dependencies
 */
import {
	CSS_BOX_SIDES,
	hasBorderValue,
	hasFlatBorderValue,
	hasSplitBorderValue,
	isBorderSide,
} from '../border';

describe( 'border helpers', () => {
	it( 'identifies valid box sides correctly', () => {
		expect( CSS_BOX_SIDES ).toEqual( [ 'top', 'right', 'bottom', 'left' ] );
		expect( isBorderSide( 'top' ) ).toBe( true );
		expect( isBorderSide( 'right' ) ).toBe( true );
		expect( isBorderSide( 'bottom' ) ).toBe( true );
		expect( isBorderSide( 'left' ) ).toBe( true );
		expect( isBorderSide( 'center' ) ).toBe( false );
		expect( isBorderSide( null ) ).toBe( false );
	} );

	it( 'detects flat border values', () => {
		expect( hasFlatBorderValue( null ) ).toBe( false );
		expect( hasFlatBorderValue( {} ) ).toBe( false );
		expect( hasFlatBorderValue( { color: '#000' } ) ).toBe( true );
		expect( hasFlatBorderValue( { width: '2px' } ) ).toBe( true );
		expect( hasFlatBorderValue( { style: 'solid' } ) ).toBe( true );
		expect(
			hasFlatBorderValue( { color: '', width: '', style: '' } )
		).toBe( false );
	} );

	it( 'detects split border values', () => {
		expect( hasSplitBorderValue( null ) ).toBe( false );
		expect( hasSplitBorderValue( {} ) ).toBe( false );
		expect(
			hasSplitBorderValue( {
				top: { width: '1px' },
			} )
		).toBe( true );
		expect(
			hasSplitBorderValue( {
				top: {},
				right: { color: 'red' },
			} )
		).toBe( true );
		expect(
			hasSplitBorderValue( {
				top: { color: '' },
				right: {},
			} )
		).toBe( false );
	} );

	it( 'detects combined hasBorderValue for both shapes', () => {
		expect( hasBorderValue( { color: '#fff' } ) ).toBe( true );
		expect( hasBorderValue( { left: { style: 'dashed' } } ) ).toBe( true );
		expect( hasBorderValue( null ) ).toBe( false );
		expect( hasBorderValue( {} ) ).toBe( false );
	} );
} );
