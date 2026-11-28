/**
 * Internal dependencies
 */
import {
	CSS_BOX_SIDES,
	hasBorderValue,
	hasFlatBorderValue,
	isBorderSide,
} from '../../shared/border';
import { collapseBoxValues, parseBoxShorthand } from '../../shared/css';

/**
 * Convert CSS border-radius shorthand into BorderRadiusControl corner values.
 *
 * @param {string|Object} value CSS shorthand or existing corner values.
 * @return {Object|undefined} Border radius corner values.
 */
export const cssRadiusToBorderRadiusValues = ( value ) => {
	if ( value && typeof value === 'object' ) {
		return value;
	}

	const parts = parseBoxShorthand( value );

	if ( ! parts ) {
		return undefined;
	}

	const [ topLeft, topRight, bottomRight, bottomLeft ] = parts;

	return { topLeft, topRight, bottomRight, bottomLeft };
};

/**
 * Convert BorderRadiusControl corner values back to CSS shorthand.
 *
 * @param {string|Object} values Border radius corner values.
 * @return {string} CSS border-radius shorthand.
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

	return collapseBoxValues( topLeft, topRight, bottomRight, bottomLeft );
};

const getFlatBorder = ( border ) => {
	const value = {
		color: border?.color,
		style: border?.style,
		width: border?.width,
	};

	return hasFlatBorderValue( value ) ? value : undefined;
};

const getSplitBorder = ( border ) => {
	if ( ! border || typeof border !== 'object' ) {
		return undefined;
	}

	const value = CSS_BOX_SIDES.reduce( ( sides, side ) => {
		if ( hasFlatBorderValue( border[ side ] ) ) {
			sides[ side ] = border[ side ];
		}

		return sides;
	}, {} );

	return Object.keys( value ).length ? value : undefined;
};

export { hasBorderValue };

/**
 * Normalize legacy border settings into BorderBoxControl's value shape.
 *
 * @param {Object} style Popup style settings.
 * @return {Object|undefined} BorderBoxControl border value.
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
 *
 * @param {Object} border BorderBoxControl border value.
 * @param {Object} style  Current popup style settings.
 * @return {Object} Legacy border settings.
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
		? Object.values( border ).find(
				( value ) =>
					value &&
					typeof value === 'object' &&
					hasBorderValue( value )
		  )
		: border;

	return {
		borderType: values?.style || 'solid',
		borderColor: values?.color || style.borderColor,
		borderWidth: values?.width || style.borderWidth,
	};
};
