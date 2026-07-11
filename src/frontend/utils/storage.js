/**
 * Local and session storage keys used for runtime display rules.
 */
export const pageKey = 'blablablocksPopupPageViews';
export const sessionKey = 'blablablocksPopupSessionActive';
export const sessionsKey = 'blablablocksPopupSessions';

/**
 * Read numeric browser state without leaking NaN into rule checks.
 */
export const getStorageNumber = ( storage, key ) => {
	const value = parseInt( storage.getItem( key ) || '0', 10 );
	return Number.isNaN( value ) ? 0 : value;
};

const setStorageNumber = ( storage, key, value ) => {
	storage.setItem( key, String( value ) );
};

/**
 * Increment and persist a numeric browser state counter.
 */
export const incrementStorageNumber = ( storage, key ) => {
	const value = getStorageNumber( storage, key ) + 1;
	setStorageNumber( storage, key, value );
	return value;
};

export const popupCountKey = ( id, mode ) => `blablablocksPopup:${ id }:${ mode }Count`;
