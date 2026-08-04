/**
 * Local and session storage keys used for runtime display rules.
 */
export const pageKey = 'blablablocksPopupPageViews';
export const sessionKey = 'blablablocksPopupSessionActive';
export const sessionsKey = 'blablablocksPopupSessions';

const getBrowserStorage = ( name ) => {
	try {
		return window[ name ];
	} catch {
		return null;
	}
};

export const localStore = getBrowserStorage( 'localStorage' );
export const sessionStore = getBrowserStorage( 'sessionStorage' );

/**
 * Read numeric browser state without leaking NaN into rule checks.
 * @param {Storage|null} storage Browser storage provider.
 * @param {string}       key     Storage key.
 */
export const getStorageNumber = ( storage, key ) => {
	try {
		const value = parseInt( storage.getItem( key ) || '0', 10 );

		return Number.isNaN( value ) ? 0 : value;
	} catch {
		return 0;
	}
};

const setStorageNumber = ( storage, key, value ) => {
	try {
		storage.setItem( key, String( value ) );
	} catch {
		// Storage can be unavailable when browser privacy settings block it.
	}
};

/**
 * Determine whether browser storage contains a key without throwing.
 * @param {Storage|null} storage Browser storage provider.
 * @param {string}       key     Storage key.
 */
export const hasStorageValue = ( storage, key ) => {
	try {
		return null !== storage.getItem( key );
	} catch {
		return false;
	}
};

/**
 * Store a browser value when storage is available.
 * @param {Storage|null} storage Browser storage provider.
 * @param {string}       key     Storage key.
 * @param {string}       value   Value to persist.
 */
export const setStorageValue = ( storage, key, value ) => {
	try {
		storage.setItem( key, String( value ) );
	} catch {
		// Runtime behavior must continue when persistence is unavailable.
	}
};

/**
 * Increment and persist a numeric browser state counter.
 * @param {Storage|null} storage Browser storage provider.
 * @param {string}       key     Storage key.
 */
export const incrementStorageNumber = ( storage, key ) => {
	const value = getStorageNumber( storage, key ) + 1;
	setStorageNumber( storage, key, value );
	return value;
};

export const popupCountKey = ( id, mode ) =>
	`blablablocksPopup:${ id }:${ mode }Count`;
