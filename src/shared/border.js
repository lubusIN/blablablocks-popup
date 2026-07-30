/**
 * Physical sides used by border and spacing controls.
 */
export const CSS_BOX_SIDES = [ 'top', 'right', 'bottom', 'left' ];

/**
 * Determine whether a key identifies an individual border side.
 *
 * @param {string} key Border property key.
 * @return {boolean} Whether the key is a border side.
 */
export const isBorderSide = ( key ) => CSS_BOX_SIDES.includes( key );

/**
 * Determine whether a flat border object contains a visible value.
 *
 * @param {Object} border Border value.
 * @return {boolean} Whether the border has a color, style, or width.
 */
export const hasFlatBorderValue = ( border ) =>
	!! border &&
	typeof border === 'object' &&
	[ border.color, border.style, border.width ].some( Boolean );

/**
 * Determine whether any side of a split border contains a visible value.
 *
 * @param {Object} border Border value.
 * @return {boolean} Whether the border has a configured side.
 */
export const hasSplitBorderValue = ( border ) =>
	!! border &&
	typeof border === 'object' &&
	CSS_BOX_SIDES.some( ( side ) => hasFlatBorderValue( border[ side ] ) );

/**
 * Determine whether a flat or split border contains a visible value.
 *
 * @param {Object} border Border value.
 * @return {boolean} Whether the border has a configured value.
 */
export const hasBorderValue = ( border ) =>
	hasFlatBorderValue( border ) || hasSplitBorderValue( border );
