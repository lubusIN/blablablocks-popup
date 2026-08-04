/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	AlignmentMatrixControl,
	BaseControl,
	Flex,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { PopupDimensionControl } from './dimension-control';

/**
 * Popup placement, sizing, overlay, and close-button visibility controls.
 *
 * @param {Object}   props                  Component properties.
 * @param {Object}   props.layout           Current popup layout settings.
 * @param {string}   props.position         Current popup position.
 * @param {Function} props.onChangeLayout   Layout change handler.
 * @param {Function} props.onChangePosition Position change handler.
 * @return {Element} Popup layout controls.
 */
export function LayoutPanel( {
	layout,
	position,
	onChangeLayout,
	onChangePosition,
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
			<Flex
				className="blablablocks-popup-editor-position-control"
				direction="column"
				gap={ 2 }
				expanded={ false }
			>
				<BaseControl.VisualLabel>
					{ __( 'Position', 'blablablocks-popup' ) }
				</BaseControl.VisualLabel>
				<AlignmentMatrixControl
					label={ __( 'Popup position', 'blablablocks-popup' ) }
					value={ position }
					onChange={ onChangePosition }
				/>
			</Flex>
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
				onChange={ ( value ) =>
					onChangeLayout( 'closeButton', !! value )
				}
			/>
		</PanelBody>
	);
}
