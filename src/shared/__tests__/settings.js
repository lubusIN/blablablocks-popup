/**
 * Internal dependencies
 */
import { mergePopupSettings } from '../settings';

describe( 'mergePopupSettings', () => {
	it( 'keeps default group values when stored settings are partial', () => {
		const defaults = {
			layout: { width: '640px', overlay: true },
			style: { popupBackground: '#fff' },
		};

		expect(
			mergePopupSettings( defaults, {
				layout: { width: '80vw' },
			} )
		).toEqual( {
			layout: { width: '80vw', overlay: true },
			style: { popupBackground: '#fff' },
			advanced: {},
			conditions: {},
			triggers: {},
			rules: {},
		} );
	} );

	it( 'does not mutate defaults or stored settings', () => {
		const defaults = { layout: { width: '640px' } };
		const stored = { layout: { width: '50%' } };

		const merged = mergePopupSettings( defaults, stored );
		merged.layout.width = '100%';

		expect( defaults.layout.width ).toBe( '640px' );
		expect( stored.layout.width ).toBe( '50%' );
	} );
} );
