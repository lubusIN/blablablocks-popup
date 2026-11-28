/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	AlignmentMatrixControl,
	BaseControl,
	Flex,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { defaults } from '../config/wordpress';
import { PopupDimensionControl } from './dimension-control';

/**
 * Popup placement, sizing, overlay, and close-button visibility controls.
 *
 * @param {Object}   props                  Component properties.
 * @param {Object}   props.layout           Current popup layout settings.
 * @param {string}   props.position         Current popup position.
 * @param {Function} props.onChangeLayout   Layout change handler.
 * @param {Function} props.onChangePosition Position change handler.
 * @param {Function} props.onResetLayout    Reset layout values handler.
 * @return {Element} Popup layout controls.
 */
export function LayoutPanel( {
	layout,
	position,
	onChangeLayout,
	onChangePosition,
	onResetLayout,
} ) {
	return (
		<ToolsPanel
			className="blablablocks-popup-editor-tools-panel"
			label={ __( 'Layout', 'blablablocks-popup' ) }
			resetAll={ () =>
				onResetLayout( {
					width: defaults.layout?.width || '640px',
					height: defaults.layout?.height || 'auto',
					horizontal: defaults.layout?.horizontal || 'center',
					vertical: defaults.layout?.vertical || 'center',
					overlay: defaults.layout?.overlay ?? true,
					closeButton: defaults.layout?.closeButton ?? true,
				} )
			}
		>
			<ToolsPanelItem
				hasValue={ () =>
					layout.width !== ( defaults.layout?.width || '640px' )
				}
				isShownByDefault
				label={ __( 'Width', 'blablablocks-popup' ) }
				onDeselect={ () =>
					onChangeLayout( 'width', defaults.layout?.width || '640px' )
				}
			>
				<PopupDimensionControl
					label={ __( 'Width', 'blablablocks-popup' ) }
					type="width"
					value={ layout.width }
					onChange={ ( value ) => onChangeLayout( 'width', value ) }
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				hasValue={ () =>
					layout.height !== ( defaults.layout?.height || 'auto' )
				}
				isShownByDefault
				label={ __( 'Height', 'blablablocks-popup' ) }
				onDeselect={ () =>
					onChangeLayout(
						'height',
						defaults.layout?.height || 'auto'
					)
				}
			>
				<PopupDimensionControl
					label={ __( 'Height', 'blablablocks-popup' ) }
					type="height"
					value={ layout.height }
					onChange={ ( value ) => onChangeLayout( 'height', value ) }
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				hasValue={ () =>
					layout.horizontal !==
						( defaults.layout?.horizontal || 'center' ) ||
					layout.vertical !==
						( defaults.layout?.vertical || 'center' )
				}
				isShownByDefault
				label={ __( 'Position', 'blablablocks-popup' ) }
				onDeselect={ () => onChangePosition( 'center' ) }
			>
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
			</ToolsPanelItem>
			<ToolsPanelItem
				hasValue={ () =>
					layout.overlay !== ( defaults.layout?.overlay ?? true )
				}
				isShownByDefault
				label={ __( 'Overlay', 'blablablocks-popup' ) }
				onDeselect={ () =>
					onChangeLayout(
						'overlay',
						defaults.layout?.overlay ?? true
					)
				}
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Show overlay', 'blablablocks-popup' ) }
					checked={ !! layout.overlay }
					onChange={ ( value ) =>
						onChangeLayout( 'overlay', !! value )
					}
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				hasValue={ () =>
					layout.closeButton !==
					( defaults.layout?.closeButton ?? true )
				}
				isShownByDefault
				label={ __( 'Close button', 'blablablocks-popup' ) }
				onDeselect={ () =>
					onChangeLayout(
						'closeButton',
						defaults.layout?.closeButton ?? true
					)
				}
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Show close button', 'blablablocks-popup' ) }
					checked={ !! layout.closeButton }
					onChange={ ( value ) =>
						onChangeLayout( 'closeButton', !! value )
					}
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
}
