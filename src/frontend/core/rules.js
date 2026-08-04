/**
 * Internal dependencies
 */
import {
	getStorageNumber,
	localStore,
	pageKey,
	popupCountKey,
	sessionsKey,
} from '../utils/storage';
import { getDevice, runtime, splitList } from '../utils/browser';

const isSearchReferrer = ( referrer ) =>
	/(^|\.)google\.|(^|\.)bing\.|(^|\.)yahoo\.|duckduckgo\.|ecosia\./i.test(
		referrer
	);

const isInternalReferrer = ( referrer ) => {
	if ( ! referrer ) {
		return false;
	}

	try {
		return (
			new URL( referrer ).host ===
			new URL( runtime.homeUrl || window.location.origin ).host
		);
	} catch {
		return false;
	}
};

const matchesReferrerPattern = ( pattern, referrer, useRegex ) => {
	if ( ! pattern ) {
		return true;
	}

	if ( useRegex ) {
		try {
			return new RegExp( pattern ).test( referrer );
		} catch {
			return false;
		}
	}

	return referrer.includes( pattern );
};

/**
 * Evaluate browser-only popup rules before automatic opening.
 * @param {Object} popup Popup runtime record.
 */
export const passesRules = ( popup ) => {
	const rules = popup.settings.rules || {};
	const device = getDevice();
	const devices = splitList( rules.devices );

	if ( devices.length && ! devices.includes( device ) ) {
		return false;
	}

	if ( rules.hideLoggedIn && runtime.isLoggedIn ) {
		return false;
	}

	const hideRoles = splitList( rules.hideRoles );
	if (
		hideRoles.length &&
		Array.isArray( runtime.userRoles ) &&
		runtime.userRoles.some( ( role ) => hideRoles.includes( role ) )
	) {
		return false;
	}

	if (
		rules.pageViews &&
		getStorageNumber( localStore, pageKey ) <
			Number( rules.pageViewsCount || 0 )
	) {
		return false;
	}

	if (
		rules.sessions &&
		getStorageNumber( localStore, sessionsKey ) <
			Number( rules.sessionsCount || 0 )
	) {
		return false;
	}

	if ( rules.maxDisplays ) {
		const { id } = popup;
		const countMode = rules.countMode === 'close' ? 'close' : 'open';
		if (
			getStorageNumber( localStore, popupCountKey( id, countMode ) ) >=
			Number( rules.maxDisplaysCount || 0 )
		) {
			return false;
		}
	}

	const referrer = document.referrer || '';

	if ( rules.referrerUrl ) {
		const matched = matchesReferrerPattern(
			rules.referrerPattern,
			referrer,
			rules.referrerRegex
		);
		if ( rules.referrerMode === 'hide' && matched ) {
			return false;
		}
		if ( rules.referrerMode !== 'hide' && ! matched ) {
			return false;
		}
	}

	const arrivingFrom = splitList( rules.arrivingFrom );

	if ( arrivingFrom.length ) {
		const matchesSource =
			( arrivingFrom.includes( 'search' ) &&
				isSearchReferrer( referrer ) ) ||
			( arrivingFrom.includes( 'internal' ) &&
				isInternalReferrer( referrer ) ) ||
			( arrivingFrom.includes( 'external' ) &&
				referrer &&
				! isInternalReferrer( referrer ) &&
				! isSearchReferrer( referrer ) );

		if ( ! matchesSource ) {
			return false;
		}
	}

	return true;
};
