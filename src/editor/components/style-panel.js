/* eslint-disable @wordpress/no-unsafe-wp-apis -- WordPress 6.9 has no stable exports for these editor controls. */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BorderBoxControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import {
	PanelColorSettings,
	__experimentalBorderRadiusControl as BorderRadiusControl,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalSpacingSizesControl as SpacingSizesControl,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { defaults } from '../config/wordpress';
import {
	borderRadiusValuesToCss,
	cssRadiusToBorderRadiusValues,
	getBorderControlValue,
	hasBorderValue,
} from '../utils/border';
import {
	cssBoxToSpacingValues,
	spacingSides,
	spacingValuesToCssBox,
} from '../utils/spacing';

const closeButtonSizeUnits = [ { value: 'px', label: 'px', step: 1 } ];

/**
 * Design controls for popup color, spacing, and border.
 *
 * @param {Object}   props                          Component properties.
 * @param {Array}    props.backgroundColorSettings  Popup background color controls.
 * @param {Array}    props.closeButtonColorSettings Close button color controls.
 * @param {Object}   props.colorGradientSettings    WordPress color and gradient settings.
 * @param {Object}   props.style                    Current popup style settings.
 * @param {Function} props.onChangeStyle            Single style value change handler.
 * @param {Function} props.onChangeStyleValues      Multiple style values change handler.
 * @param {Function} props.onChangeBorder           Border value change handler.
 * @return {Element} Popup style controls.
 */
export function StylePanel( props ) {
	const {
		backgroundColorSettings,
		closeButtonColorSettings,
		colorGradientSettings,
		style,
		onChangeStyle,
		onChangeStyleValues,
		onChangeBorder,
	} = props;
	return (
		<>
			<PanelColorSettings
				__experimentalIsRenderedInSidebar
				className="blablablocks-popup-editor-tools-panel blablablocks-popup-editor-color-settings-panel"
				colorSettings={ backgroundColorSettings }
				enableAlpha
				title={ __( 'Background', 'blablablocks-popup' ) }
			/>
			{ closeButtonColorSettings.length > 0 && (
				<ToolsPanel
					className="blablablocks-popup-editor-tools-panel"
					label={ __( 'Close button', 'blablablocks-popup' ) }
					resetAll={ () =>
						onChangeStyleValues( {
							closeColor: defaults.style?.closeColor || '#1e1e1e',
							closeBackground:
								defaults.style?.closeBackground ||
								'transparent',
							closeSize: defaults.style?.closeSize || 28,
						} )
					}
				>
					<div
						className="close-button-color-wrapper"
						style={ { gridColumn: '1 / -1' } }
					>
						<ColorGradientSettingsDropdown
							__experimentalIsRenderedInSidebar
							enableAlpha
							settings={ closeButtonColorSettings }
							{ ...colorGradientSettings }
							disableCustomGradients
							gradients={ [] }
						/>
					</div>
					<ToolsPanelItem
						hasValue={ () =>
							style.closeSize !== defaults.style?.closeSize
						}
						isShownByDefault
						label={ __( 'Size', 'blablablocks-popup' ) }
						onDeselect={ () =>
							onChangeStyle(
								'closeSize',
								defaults.style?.closeSize || 28
							)
						}
					>
						<UnitControl
							__next40pxDefaultSize
							label={ __( 'Size', 'blablablocks-popup' ) }
							min={ 12 }
							size="__unstable-large"
							units={ closeButtonSizeUnits }
							onChange={ ( value ) =>
								onChangeStyle(
									'closeSize',
									! value
										? defaults.style?.closeSize || 28
										: Math.max(
												12,
												Number.parseFloat( value ) || 28
										  )
								)
							}
							value={ `${
								style.closeSize ||
								defaults.style?.closeSize ||
								28
							}px` }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			) }
			<ToolsPanel
				className="blablablocks-popup-editor-tools-panel"
				label={ __( 'Dimensions', 'blablablocks-popup' ) }
				resetAll={ () =>
					onChangeStyleValues( {
						margin: defaults.style?.margin || '24px',
						padding: defaults.style?.padding || '32px',
					} )
				}
			>
				<ToolsPanelItem
					hasValue={ () => style.padding !== defaults.style?.padding }
					isShownByDefault
					label={ __( 'Padding', 'blablablocks-popup' ) }
					onDeselect={ () =>
						onChangeStyle(
							'padding',
							defaults.style?.padding || '32px'
						)
					}
				>
					<SpacingSizesControl
						allowReset={ false }
						label={ __( 'Padding', 'blablablocks-popup' ) }
						onChange={ ( value ) =>
							onChangeStyle(
								'padding',
								spacingValuesToCssBox( value )
							)
						}
						sides={ spacingSides }
						values={ cssBoxToSpacingValues( style.padding ) }
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () => style.margin !== defaults.style?.margin }
					isShownByDefault
					label={ __( 'Margin', 'blablablocks-popup' ) }
					onDeselect={ () =>
						onChangeStyle(
							'margin',
							defaults.style?.margin || '24px'
						)
					}
				>
					<SpacingSizesControl
						allowReset={ false }
						label={ __( 'Margin', 'blablablocks-popup' ) }
						onChange={ ( value ) =>
							onChangeStyle(
								'margin',
								spacingValuesToCssBox( value )
							)
						}
						sides={ spacingSides }
						values={ cssBoxToSpacingValues( style.margin ) }
					/>
				</ToolsPanelItem>
			</ToolsPanel>
			<ToolsPanel
				className="blablablocks-popup-editor-tools-panel"
				label={ __( 'Border', 'blablablocks-popup' ) }
				resetAll={ () =>
					onChangeStyleValues( {
						border: {},
						borderType: defaults.style?.borderType || 'none',
						borderColor: defaults.style?.borderColor || '#dcdcde',
						borderWidth: defaults.style?.borderWidth || '1px',
						borderRadius: defaults.style?.borderRadius || '8px',
					} )
				}
			>
				<ToolsPanelItem
					hasValue={ () =>
						hasBorderValue( getBorderControlValue( style ) )
					}
					isShownByDefault
					label={ __( 'Border', 'blablablocks-popup' ) }
					onDeselect={ () => onChangeBorder( undefined ) }
				>
					<BorderBoxControl
						__experimentalIsRenderedInSidebar
						__next40pxDefaultSize
						enableAlpha
						label={ __( 'Border', 'blablablocks-popup' ) }
						onChange={ onChangeBorder }
						popoverOffset={ 36 }
						popoverPlacement="left-start"
						value={ getBorderControlValue( style ) }
						{ ...colorGradientSettings }
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () =>
						style.borderRadius !== defaults.style?.borderRadius
					}
					isShownByDefault
					label={ __( 'Radius', 'blablablocks-popup' ) }
					onDeselect={ () =>
						onChangeStyle(
							'borderRadius',
							defaults.style?.borderRadius || '8px'
						)
					}
				>
					<BorderRadiusControl
						__next40pxDefaultSize
						label={ __( 'Radius', 'blablablocks-popup' ) }
						values={ cssRadiusToBorderRadiusValues(
							style.borderRadius
						) }
						onChange={ ( value ) =>
							onChangeStyle(
								'borderRadius',
								borderRadiusValuesToCss( value )
							)
						}
					/>
				</ToolsPanelItem>
			</ToolsPanel>
		</>
	);
}
