/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Stack } from '@wordpress/ui';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { UnitControl } from '../config/wordpress';
import {
	getDimensionMode,
	getDimensionValue,
	getFixedDimensionValue,
} from '../utils/layout';

const dimensionUnits = [
	{ value: 'px', label: 'px', step: 1 },
	{ value: 'em', label: 'em', step: 0.1 },
	{ value: 'rem', label: 'rem', step: 0.1 },
	{ value: '%', label: '%', step: 1 },
	{ value: 'vw', label: 'vw', step: 1 },
	{ value: 'vh', label: 'vh', step: 1 },
];

const dimensionHelp = {
	fit: __('Fit contents.', 'blablablocks-popup'),
	grow: __('Stretch to fill available space.', 'blablablocks-popup'),
	fixed: __('Specify a fixed size.', 'blablablocks-popup'),
};

/**
 * Width/height control that matches WordPress layout sizing semantics.
 */
export function PopupDimensionControl({ label, type, value, onChange }) {
	const mode = getDimensionMode(value, type);
	const fixedValue = getFixedDimensionValue(value, type);

	const updateMode = (nextMode) => {
		onChange(getDimensionValue(nextMode, fixedValue, type));
	};

	return (
		<Stack className="blablablocks-popup-editor-dimension-control" direction="column" gap="sm">
			<ToggleGroupControl
				__next40pxDefaultSize
				isBlock
				label={label}
				help={dimensionHelp[mode]}
				value={mode}
				onChange={updateMode}
			>
				<ToggleGroupControlOption value="fit" label={__('Fit', 'blablablocks-popup')} />
				<ToggleGroupControlOption value="grow" label={__('Grow', 'blablablocks-popup')} />
				<ToggleGroupControlOption value="fixed" label={__('Fixed', 'blablablocks-popup')} />
			</ToggleGroupControl>
			{'fixed' === mode && UnitControl && (
				<UnitControl
					__next40pxDefaultSize
					hideLabelFromVision
					className="blablablocks-popup-editor-dimension-control__unit"
					label={label}
					min={0}
					size="__unstable-large"
					units={dimensionUnits}
					value={fixedValue}
					onChange={onChange}
				/>
			)}
		</Stack>
	);
}
