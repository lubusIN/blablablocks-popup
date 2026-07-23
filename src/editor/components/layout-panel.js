/**
 * WordPress dependencies
 */
import {
	AlignmentMatrixControl,
	PanelBody,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
	__experimentalText as Text,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { PopupDimensionControl } from './dimension-control';

/**
 * Popup placement, sizing, overlay, and close-button controls.
 */
export function LayoutPanel( {
	layout,
	position,
	style,
	onChangeLayout,
	onChangePosition,
	onChangeStyle,
} ) {
	return (
		<PanelBody title={ __( 'Layout', 'blablablocks-popup' ) } initialOpen>
			<PopupDimensionControl
				label={ __( 'Width', 'blablablocks-popup' ) }
				type="width"
				value={ layout.width }
				onChange={ ( value ) => onChangeLayout( 'width', value ) }
			/>
			<PopupDimensionControl
				label={ __( 'Height', 'blablablocks-popup' ) }
				type="height"
				value={ layout.height }
				onChange={ ( value ) => onChangeLayout( 'height', value ) }
			/>
			<Stack className="blablablocks-popup-editor-position-control" direction="column" gap="sm">
				<Text className="blablablocks-popup-editor-position-control__label">
					{ __( 'Position', 'blablablocks-popup' ) }
				</Text>
				<AlignmentMatrixControl
					label={ __( 'Popup position', 'blablablocks-popup' ) }
					value={ position }
					onChange={ onChangePosition }
				/>
			</Stack>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Show overlay', 'blablablocks-popup' ) }
				checked={ !! layout.overlay }
				onChange={ ( value ) => onChangeLayout( 'overlay', !! value ) }
			/>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Show close button', 'blablablocks-popup' ) }
				checked={ !! layout.closeButton }
				onChange={ ( value ) => onChangeLayout( 'closeButton', !! value ) }
			/>
			{ layout.closeButton && (
				<NumberControl
					__next40pxDefaultSize
					label={ __( 'Close size', 'blablablocks-popup' ) }
					min={ 12 }
					step={ 1 }
					value={ style.closeSize }
					onChange={ ( value ) => onChangeStyle( 'closeSize', Number( value ) || 0 ) }
				/>
			) }
		</PanelBody>
	);
}
