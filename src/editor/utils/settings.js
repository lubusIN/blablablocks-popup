/**
 * Internal dependencies
 */
import { defaults } from '../config/wordpress';
import { normalizeAnimationDuration } from '../../shared/animation';
import { mergePopupSettings } from '../../shared/settings';

/**
 * Merge stored popup settings with the server-provided default shape.
 *
 * @param {Object|null} settings Stored popup settings.
 * @return {Object} Complete settings object.
 */
export const mergeSettings = ( settings ) => {
	const merged = mergePopupSettings( defaults, settings );

	return {
		...merged,
		layout: {
			...merged.layout,
			animationDuration: normalizeAnimationDuration(
				merged.layout.animationDuration
			),
		},
	};
};
