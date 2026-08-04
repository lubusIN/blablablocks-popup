/**
 * Internal dependencies
 */
import {
	getStorageNumber,
	hasStorageValue,
	incrementStorageNumber,
	setStorageValue,
} from '../storage';

describe( 'browser storage helpers', () => {
	it( 'continues safely when browser storage is blocked', () => {
		const blockedStorage = {
			getItem: () => {
				throw new DOMException( 'Blocked', 'SecurityError' );
			},
			setItem: () => {
				throw new DOMException( 'Blocked', 'SecurityError' );
			},
		};

		expect( getStorageNumber( blockedStorage, 'count' ) ).toBe( 0 );
		expect( hasStorageValue( blockedStorage, 'session' ) ).toBe( false );
		expect( incrementStorageNumber( blockedStorage, 'count' ) ).toBe( 1 );
		expect( () =>
			setStorageValue( blockedStorage, 'session', '1' )
		).not.toThrow();
	} );

	it( 'normalizes invalid stored counters before incrementing', () => {
		const values = new Map( [ [ 'count', 'invalid' ] ] );
		const storage = {
			getItem: ( key ) => values.get( key ) ?? null,
			setItem: ( key, value ) => values.set( key, value ),
		};

		expect( incrementStorageNumber( storage, 'count' ) ).toBe( 1 );
		expect( values.get( 'count' ) ).toBe( '1' );
	} );
} );
