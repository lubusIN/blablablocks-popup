/**
 * Default animation duration in seconds.
 */
export const DEFAULT_ANIMATION_DURATION = 0.3;

/**
 * Convert old millisecond values and invalid inputs to seconds.
 *
 * @param {*}      value    Raw duration.
 * @param {number} fallback Fallback duration in seconds.
 * @return {number} Duration in seconds.
 */
export const normalizeAnimationDuration = ( value, fallback = DEFAULT_ANIMATION_DURATION ) => {
	const duration = Number( value );

	if ( ! Number.isFinite( duration ) || duration < 0 ) {
		return fallback;
	}

	const seconds = duration > 20 ? duration / 1000 : duration;

	return Math.round( seconds * 1000 ) / 1000;
};
