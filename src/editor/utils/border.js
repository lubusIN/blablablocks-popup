/**
 * Convert CSS border-radius shorthand into BorderRadiusControl corner values.
 */
export const cssRadiusToBorderRadiusValues = ( value ) => {
	if ( value && typeof value === 'object' ) {
		return value;
	}

	const parts = String( value || '' ).split( '/' )[ 0 ].trim().split( /\s+/ ).filter( Boolean );

	if ( ! parts.length ) {
		return undefined;
	}

	const [ topLeft, topRight = topLeft, bottomRight = topLeft, bottomLeft = topRight ] = parts;

	return { topLeft, topRight, bottomRight, bottomLeft };
};

/**
 * Convert BorderRadiusControl corner values back to CSS shorthand.
 */
export const borderRadiusValuesToCss = ( values ) => {
	if ( typeof values === 'string' ) {
		return values;
	}

	if ( ! values || typeof values !== 'object' ) {
		return '';
	}

	const topLeft = values.topLeft || '';
	const topRight = values.topRight || '';
	const bottomRight = values.bottomRight || '';
	const bottomLeft = values.bottomLeft || '';

	if ( ! topLeft && ! topRight && ! bottomRight && ! bottomLeft ) {
		return '';
	}

	if ( topLeft === topRight && topLeft === bottomRight && topLeft === bottomLeft ) {
		return topLeft;
	}

	if ( topLeft === bottomRight && topRight === bottomLeft ) {
		return `${ topLeft } ${ topRight }`;
	}

	if ( topRight === bottomLeft ) {
		return `${ topLeft } ${ topRight } ${ bottomRight }`;
	}

	return `${ topLeft } ${ topRight } ${ bottomRight } ${ bottomLeft }`;
};

const isBorderSide = ( key ) => [ 'top', 'right', 'bottom', 'left' ].includes( key );

const getFlatBorder = ( border ) => {
	if ( ! border || typeof border !== 'object' ) {
		return undefined;
	}

	const value = {
		color: border.color,
		style: border.style,
		width: border.width,
	};

	return [ value.color, value.style, value.width ].some( Boolean ) ? value : undefined;
};

const getSplitBorder = ( border ) => {
	if ( ! border || typeof border !== 'object' ) {
		return undefined;
	}

	const value = [ 'top', 'right', 'bottom', 'left' ].reduce( ( sides, side ) => {
		if ( hasBorderValue( border[ side ] ) ) {
			sides[ side ] = border[ side ];
		}

		return sides;
	}, {} );

	return Object.keys( value ).length ? value : undefined;
};

export const hasBorderValue = ( border ) => {
	if ( ! border || typeof border !== 'object' ) {
		return false;
	}

	if ( [ border.color, border.style, border.width ].some( Boolean ) ) {
		return true;
	}

	return Object.entries( border ).some( ( [ key, value ] ) => (
		isBorderSide( key ) &&
		value &&
		typeof value === 'object' &&
		[ value.color, value.style, value.width ].some( Boolean )
	) );
};

/**
 * Normalize legacy border settings into BorderBoxControl's value shape.
 */
export const getBorderControlValue = ( style ) => {
	const splitBorder = getSplitBorder( style.border );

	if ( splitBorder ) {
		return splitBorder;
	}

	const flatBorder = getFlatBorder( style.border );

	if ( flatBorder ) {
		return flatBorder;
	}

	if ( style.borderType && 'none' !== style.borderType ) {
		return {
			color: style.borderColor,
			style: style.borderType,
			width: style.borderWidth,
		};
	}

	return undefined;
};

/**
 * Mirror BorderBoxControl values into legacy flat keys for runtime fallback.
 */
export const borderToLegacyValues = ( border, style ) => {
	if ( ! hasBorderValue( border ) ) {
		return {
			borderType: 'none',
			borderColor: style.borderColor,
			borderWidth: style.borderWidth,
		};
	}

	const values = isBorderSide( Object.keys( border )[ 0 ] )
		? Object.values( border ).find( ( value ) => value && typeof value === 'object' && hasBorderValue( value ) )
		: border;

	return {
		borderType: values?.style || 'solid',
		borderColor: values?.color || style.borderColor,
		borderWidth: values?.width || style.borderWidth,
	};
};
