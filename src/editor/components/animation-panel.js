/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	SelectControl,
	__experimentalNumberControl as NumberControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { defaults } from '../config/wordpress';
import {
	DEFAULT_ANIMATION_DURATION,
	normalizeAnimationDuration,
} from '../../shared/animation';
import { ANIMATION_CHOICES } from '../../shared/animation-options';

/**
 * Animation controls shown below layout settings.
 * @param {Object}   root0                Component properties.
 * @param {Object}   root0.layout         Layout settings.
 * @param {Function} root0.onChangeLayout Change callback.
 * @param {Function} root0.onResetLayout  Reset callback.
 */
export function AnimationPanel( { layout, onChangeLayout, onResetLayout } ) {
	return (
		<ToolsPanel
			className="blablablocks-popup-editor-tools-panel"
			label={ __( 'Animation', 'blablablocks-popup' ) }
			resetAll={ () =>
				onResetLayout( {
					entranceAnimation:
						defaults.layout?.entranceAnimation || 'fade',
					exitAnimation: defaults.layout?.exitAnimation || 'fade',
					animationDuration: normalizeAnimationDuration(
						defaults.layout?.animationDuration ||
							DEFAULT_ANIMATION_DURATION
					),
				} )
			}
		>
			<ToolsPanelItem
				hasValue={ () =>
					layout.entranceAnimation !==
					defaults.layout?.entranceAnimation
				}
				isShownByDefault
				label={ __( 'Entrance animation', 'blablablocks-popup' ) }
				onDeselect={ () =>
					onChangeLayout(
						'entranceAnimation',
						defaults.layout?.entranceAnimation || 'fade'
					)
				}
			>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Entrance animation', 'blablablocks-popup' ) }
					value={ layout.entranceAnimation }
					options={ ANIMATION_CHOICES }
					onChange={ ( value ) =>
						onChangeLayout( 'entranceAnimation', value )
					}
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				hasValue={ () =>
					layout.exitAnimation !== defaults.layout?.exitAnimation
				}
				isShownByDefault
				label={ __( 'Exit animation', 'blablablocks-popup' ) }
				onDeselect={ () =>
					onChangeLayout(
						'exitAnimation',
						defaults.layout?.exitAnimation || 'fade'
					)
				}
			>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Exit animation', 'blablablocks-popup' ) }
					value={ layout.exitAnimation }
					options={ ANIMATION_CHOICES }
					onChange={ ( value ) =>
						onChangeLayout( 'exitAnimation', value )
					}
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				hasValue={ () =>
					layout.animationDuration !==
					defaults.layout?.animationDuration
				}
				isShownByDefault
				label={ __( 'Animation duration', 'blablablocks-popup' ) }
				onDeselect={ () =>
					onChangeLayout(
						'animationDuration',
						normalizeAnimationDuration(
							defaults.layout?.animationDuration ||
								DEFAULT_ANIMATION_DURATION
						)
					)
				}
			>
				<NumberControl
					__next40pxDefaultSize
					label={ __( 'Animation duration', 'blablablocks-popup' ) }
					help={ __( 'Seconds.', 'blablablocks-popup' ) }
					min={ 0 }
					step={ 0.1 }
					value={ normalizeAnimationDuration(
						layout.animationDuration
					) }
					onChange={ ( value ) =>
						onChangeLayout(
							'animationDuration',
							normalizeAnimationDuration( value, 0 )
						)
					}
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
}
