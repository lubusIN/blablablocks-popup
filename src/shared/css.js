/**
 * Resolve WordPress preset tokens into CSS custom properties.
 *
 * @param {*} value CSS value.
 * @return {*} Resolved CSS value.
 */
export const resolveCssValue = ( value ) => {
	if ( typeof value !== 'string' ) {
		return value;
	}

	return value.replace(
		/var:preset\|(color|gradient|spacing)\|([a-zA-Z0-9_-]+)/g,
		'var(--wp--preset--$1--$2)'
	);
};

/**
 * Sanitize a CSS value and ensure it only contains safe characters.
 *
 * @param {*}      value    Raw CSS value.
 * @param {string} fallback Safe fallback value.
 * @return {string} Safe CSS value.
 */
export const safeCssValue = ( value, fallback ) => {
	const resolved = resolveCssValue( String( value || fallback || '' ) );

	return /^[#a-zA-Z0-9\s.,%()+*\/_-]+$/.test( resolved )
		? resolved
		: fallback;
};

/**
 * Extract the portion before any top-level slash (ignoring slashes inside parentheses).
 *
 * @param {string} str CSS value string.
 * @return {string} Substring preceding top-level slash.
 */
const getBeforeTopLevelSlash = ( str ) => {
	let depth = 0;
	for ( let i = 0; i < str.length; i++ ) {
		const char = str[ i ];
		if ( char === '(' ) {
			depth++;
		} else if ( char === ')' ) {
			if ( depth > 0 ) {
				depth--;
			}
		} else if ( char === '/' && depth === 0 ) {
			return str.slice( 0, i );
		}
	}
	return str;
};

/**
 * Parse CSS shorthand values (1 to 4 whitespace-separated values).
 *
 * @param {string|*} value CSS shorthand string.
 * @return {Array<string>|null} 4-tuple of [ top, right, bottom, left ], or null if empty.
 */
export const parseBoxShorthand = ( value ) => {
	const parts = getBeforeTopLevelSlash( String( value || '' ) )
		.trim()
		.split( /\s+/ )
		.filter( Boolean );

	if ( ! parts.length ) {
		return null;
	}

	const [ top, right = top, bottom = top, left = right ] = parts;

	return [ top, right, bottom, left ];
};

/**
 * Collapse 4 box/corner values into the shortest valid CSS shorthand.
 *
 * @param {string} top    Top or top-left value.
 * @param {string} right  Right or top-right value.
 * @param {string} bottom Bottom or bottom-right value.
 * @param {string} left   Left or bottom-left value.
 * @return {string} CSS shorthand representation.
 */
export const collapseBoxValues = (
	top = '',
	right = '',
	bottom = '',
	left = ''
) => {
	if ( ! top && ! right && ! bottom && ! left ) {
		return '';
	}

	if ( top === right && top === bottom && top === left ) {
		return top;
	}

	if ( top === bottom && right === left ) {
		return `${ top } ${ right }`;
	}

	if ( right === left ) {
		return `${ top } ${ right } ${ bottom }`;
	}

	return `${ top } ${ right } ${ bottom } ${ left }`;
};
