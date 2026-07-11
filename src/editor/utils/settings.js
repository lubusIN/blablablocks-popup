/**
 * Internal dependencies
 */
import { defaults } from '../config/wordpress';
import { normalizeAnimationDuration } from '../../shared/animation';

/**
 * Merge stored popup settings with the server-provided default shape.
 *
 * @param {Object|null} settings Stored popup settings.
 * @return {Object} Complete settings object.
 */
export const mergeSettings = ( settings ) => {
	const safeSettings = settings && typeof settings === 'object' ? settings : {};

	const merged = {
		...defaults,
		...safeSettings,
		layout: { ...( defaults.layout || {} ), ...( safeSettings.layout || {} ) },
		style: { ...( defaults.style || {} ), ...( safeSettings.style || {} ) },
		advanced: { ...( defaults.advanced || {} ), ...( safeSettings.advanced || {} ) },
		conditions: { ...( defaults.conditions || {} ), ...( safeSettings.conditions || {} ) },
		triggers: { ...( defaults.triggers || {} ), ...( safeSettings.triggers || {} ) },
		rules: { ...( defaults.rules || {} ), ...( safeSettings.rules || {} ) },
	};

	return {
		...merged,
		layout: {
			...merged.layout,
			animationDuration: normalizeAnimationDuration( merged.layout.animationDuration ),
		},
	};
};

/**
 * Convert compact value-label pairs into SelectControl/DataForm options.
 *
 * @param {Array<Array<string>>} values Value-label pairs.
 * @return {Array<Object>} WordPress option objects.
 */
export const choice = ( values ) => values.map( ( [ value, label ] ) => ( { value, label } ) );
