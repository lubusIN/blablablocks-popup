/**
 * Internal dependencies
 */
import {
	DEFAULT_ANIMATION_DURATION,
	normalizeAnimationDuration,
} from '../animation';

describe( 'normalizeAnimationDuration', () => {
	it( 'returns default duration for invalid or negative inputs', () => {
		expect( normalizeAnimationDuration( undefined ) ).toBe(
			DEFAULT_ANIMATION_DURATION
		);
		expect( normalizeAnimationDuration( -5 ) ).toBe(
			DEFAULT_ANIMATION_DURATION
		);
		expect( normalizeAnimationDuration( 'abc' ) ).toBe(
			DEFAULT_ANIMATION_DURATION
		);
	} );

	it( 'normalizes seconds directly', () => {
		expect( normalizeAnimationDuration( 0.5 ) ).toBe( 0.5 );
		expect( normalizeAnimationDuration( '1.2' ) ).toBe( 1.2 );
		expect( normalizeAnimationDuration( 0 ) ).toBe( 0 );
	} );

	it( 'converts millisecond values greater than 20 to seconds', () => {
		expect( normalizeAnimationDuration( 300 ) ).toBe( 0.3 );
		expect( normalizeAnimationDuration( 500 ) ).toBe( 0.5 );
		expect( normalizeAnimationDuration( 1500 ) ).toBe( 1.5 );
	} );
} );
