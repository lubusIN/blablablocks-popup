/**
 * Convert stored array values into the comma-separated format DataForm expects.
 *
 * @param {Array|string} value Stored value.
 * @return {string} CSV string.
 */
export const toCsv = ( value ) =>
	Array.isArray( value ) ? value.join( ', ' ) : '';

/**
 * Convert token field values back to arrays for REST persistence.
 *
 * @param {string}  value   CSV input.
 * @param {boolean} numeric Whether to cast tokens to integers.
 * @return {Array<string|number>} Parsed tokens.
 */
export const fromCsv = ( value, numeric = false ) =>
	String( value || '' )
		.split( ',' )
		.map( ( item ) => item.trim() )
		.filter( Boolean )
		.map( ( item ) => ( numeric ? parseInt( item, 10 ) : item ) )
		.filter( ( item ) => ! numeric || ! Number.isNaN( item ) );

/**
 * Normalize token field values before serializing them.
 *
 * @param {Array} tokens Token field values.
 * @return {Array<string>} Clean tokens.
 */
export const cleanTokens = ( tokens ) =>
	tokens.map( ( token ) => String( token || '' ).trim() ).filter( Boolean );

export const tokenFieldIds = [
	'openSelectors',
	'includeSingularIds',
	'includeArchiveIds',
	'includeIds',
	'arrivingFrom',
	'hideRoles',
	'devices',
];

export const numericTokenFieldIds = [ 'includeSingularIds', 'includeIds' ];

export const tokenFieldSuggestions = {
	arrivingFrom: [ 'search', 'external', 'internal' ],
	devices: [ 'desktop', 'tablet', 'mobile' ],
	hideRoles: [
		'administrator',
		'editor',
		'author',
		'contributor',
		'subscriber',
		'customer',
		'shop_manager',
	],
};
