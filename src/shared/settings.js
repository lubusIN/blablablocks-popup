const SETTINGS_GROUPS = [
	'layout',
	'style',
	'advanced',
	'conditions',
	'triggers',
	'rules',
];

const clone = ( value ) => JSON.parse( JSON.stringify( value || {} ) );

/**
 * Merge stored popup settings into a complete default settings shape.
 *
 * @param {Object} defaults Default popup settings.
 * @param {Object} settings Stored popup settings.
 * @return {Object} Complete popup settings.
 */
export const mergePopupSettings = ( defaults, settings ) => {
	const base = clone( defaults );
	const overrides =
		settings && typeof settings === 'object' ? clone( settings ) : {};
	const merged = { ...base, ...overrides };

	SETTINGS_GROUPS.forEach( ( group ) => {
		merged[ group ] = {
			...( base[ group ] || {} ),
			...( overrides[ group ] || {} ),
		};
	} );

	return merged;
};
