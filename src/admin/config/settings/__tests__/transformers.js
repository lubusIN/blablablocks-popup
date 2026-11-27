/**
 * Internal dependencies
 */
import { flattenSettings, unflattenSettings } from '../transformers';

describe( 'settings transformers', () => {
	it( 'flattens grouped settings into DataForm flat structure', () => {
		const flat = flattenSettings( {
			layout: { width: '500px', overlay: false },
			triggers: { scroll: true, scrollAmount: 75 },
			rules: { devices: [ 'desktop', 'mobile' ] },
		} );

		expect( flat.width ).toBe( '500px' );
		expect( flat.overlay ).toBe( false );
		expect( flat.scroll ).toBe( true );
		expect( flat.scrollAmount ).toBe( 75 );
		expect( flat.devices ).toBe( 'desktop, mobile' );
	} );

	it( 'unflattens DataForm flat structure back to grouped settings model', () => {
		const unflattened = unflattenSettings( {
			width: '720px',
			height: 'auto',
			horizontal: 'left',
			vertical: 'top',
			overlay: false,
			closeButton: true,
			entranceAnimation: 'fade',
			exitAnimation: 'fade',
			animationDuration: 0.4,
			popupBackground: '#000000',
			overlayBackground: 'rgba(0,0,0,0.5)',
			customClass: 'promo-popup',
			preventEscClose: true,
			disableScroll: false,
			openSelectors: '.promo-trigger',
			includeEntireSite: false,
			includeSingular: true,
			includeSingularType: 'post',
			includeSingularIds: '10, 20',
			scroll: true,
			scrollAmount: 60,
			devices: 'desktop, tablet',
		} );

		expect( unflattened.layout.width ).toBe( '720px' );
		expect( unflattened.layout.horizontal ).toBe( 'left' );
		expect( unflattened.layout.vertical ).toBe( 'top' );
		expect( unflattened.layout.overlay ).toBe( false );
		expect( unflattened.style.customClass ).toBe( 'promo-popup' );
		expect( unflattened.advanced.preventEscClose ).toBe( true );
		expect( unflattened.advanced.disableScroll ).toBe( false );
		expect( unflattened.advanced.openSelectors ).toBe( '.promo-trigger' );
		expect( unflattened.conditions.includeEntireSite ).toBe( false );
		expect( unflattened.conditions.includeSingular ).toBe( true );
		expect( unflattened.conditions.includeSingularIds ).toEqual( [
			10, 20,
		] );
		expect( unflattened.triggers.scroll ).toBe( true );
		expect( unflattened.triggers.scrollAmount ).toBe( 60 );
		expect( unflattened.rules.devices ).toEqual( [ 'desktop', 'tablet' ] );
	} );
} );
