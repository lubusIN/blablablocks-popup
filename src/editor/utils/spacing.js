/**
 * Internal dependencies
 */
import { CSS_BOX_SIDES } from '../../shared/border';

export const spacingSides = CSS_BOX_SIDES;

/**
 * Convert CSS spacing shorthand into SpacingSizesControl side values.
 *
 * @param {string|Object} value CSS shorthand or existing side values.
 * @return {Object} Spacing values by side.
 */
export const cssBoxToSpacingValues = ( value ) => {
	if ( value && typeof value === 'object' ) {
		return value;
	}

	const parts = String( value || '' )
		.trim()
		.split( /\s+/ )
		.filter( Boolean );

	if ( ! parts.length ) {
		return {};
	}

	const [ top, right = top, bottom = top, left = right ] = parts;

	return { top, right, bottom, left };
};

/**
 * Convert SpacingSizesControl side values back to CSS shorthand.
 *
 * @param {Object} values Spacing values by side.
 * @return {string} CSS spacing shorthand.
 */
export const spacingValuesToCssBox = ( values ) => {
	if ( ! values || typeof values !== 'object' ) {
		return '';
	}

	const top = values.top || values.vertical || '';
	const right = values.right || values.horizontal || '';
	const bottom = values.bottom || values.vertical || '';
	const left = values.left || values.horizontal || '';

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
