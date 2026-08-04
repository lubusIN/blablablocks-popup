/* eslint-disable @wordpress/no-unsafe-wp-apis -- WordPress 6.9 has no stable exports for these editor controls. */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Flex,
	__experimentalUnitControl as UnitControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
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
	fit: __( 'Fit contents.', 'blablablocks-popup' ),
	grow: __( 'Stretch to fill available space.', 'blablablocks-popup' ),
	fixed: __( 'Specify a fixed size.', 'blablablocks-popup' ),
};

/**
 * Width/height control that matches WordPress layout sizing semantics.
 *
 * @param {Object}   props          Component properties.
 * @param {string}   props.label    Control label.
 * @param {string}   props.type     Dimension type.
 * @param {string}   props.value    Current CSS dimension.
 * @param {Function} props.onChange Dimension change handler.
 * @return {Element} Dimension control.
 */
export function PopupDimensionControl( props ) {
	const { label, type, value, onChange } = props;
	const mode = getDimensionMode( value, type );
	const fixedValue = getFixedDimensionValue( value, type );

	const updateMode = ( nextMode ) => {
		onChange( getDimensionValue( nextMode, fixedValue, type ) );
	};

	return (
		<Flex
			className="blablablocks-popup-editor-dimension-control"
			direction="column"
			gap={ 2 }
			expanded={ false }
		>
			<ToggleGroupControl
				__next40pxDefaultSize
				isBlock
				label={ label }
				help={ dimensionHelp[ mode ] }
				value={ mode }
				onChange={ updateMode }
			>
				<ToggleGroupControlOption
					value="fit"
					label={ __( 'Fit', 'blablablocks-popup' ) }
				/>
				<ToggleGroupControlOption
					value="grow"
					label={ __( 'Grow', 'blablablocks-popup' ) }
				/>
				<ToggleGroupControlOption
					value="fixed"
					label={ __( 'Fixed', 'blablablocks-popup' ) }
				/>
			</ToggleGroupControl>
			{ 'fixed' === mode && (
				<UnitControl
					__next40pxDefaultSize
					hideLabelFromVision
					className="blablablocks-popup-editor-dimension-control__unit"
					label={ label }
					min={ 0 }
					size="__unstable-large"
					units={ dimensionUnits }
					value={ fixedValue }
					onChange={ onChange }
				/>
			) }
		</Flex>
	);
}
