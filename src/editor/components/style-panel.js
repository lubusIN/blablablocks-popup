/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BorderBoxControl,
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	BorderRadiusControl,
	PanelColorSettings,
	SpacingSizesControl,
	defaults,
} from '../config/wordpress';
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

/**
 * Design controls for popup color, spacing, and border.
 */
export function StylePanel({
	colorGradientSettings,
	colorSettings,
	style,
	onChangeStyle,
	onChangeStyleValues,
	onChangeBorder,
}) {
	return (
		<>
			{PanelColorSettings && (
				<PanelColorSettings
					__experimentalIsRenderedInSidebar
					className="blablablocks-popup-editor-tools-panel"
					colorSettings={colorSettings}
					enableAlpha
					title={__('Color', 'blablablocks-popup')}
				/>
			)}
			{SpacingSizesControl && (
				<ToolsPanel
					className="blablablocks-popup-editor-tools-panel"
					label={__('Dimensions', 'blablablocks-popup')}
					resetAll={() => onChangeStyleValues({
						margin: defaults.style?.margin || '24px',
						padding: defaults.style?.padding || '32px',
					})}
				>
					<ToolsPanelItem
						hasValue={() => style.padding !== defaults.style?.padding}
						isShownByDefault
						label={__('Padding', 'blablablocks-popup')}
						onDeselect={() => onChangeStyle('padding', defaults.style?.padding || '32px')}
					>
						<SpacingSizesControl
							allowReset={false}
							label={__('Padding', 'blablablocks-popup')}
							onChange={(value) => onChangeStyle('padding', spacingValuesToCssBox(value))}
							sides={spacingSides}
							values={cssBoxToSpacingValues(style.padding)}
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						hasValue={() => style.margin !== defaults.style?.margin}
						isShownByDefault
						label={__('Margin', 'blablablocks-popup')}
						onDeselect={() => onChangeStyle('margin', defaults.style?.margin || '24px')}
					>
						<SpacingSizesControl
							allowReset={false}
							label={__('Margin', 'blablablocks-popup')}
							onChange={(value) => onChangeStyle('margin', spacingValuesToCssBox(value))}
							sides={spacingSides}
							values={cssBoxToSpacingValues(style.margin)}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			)}
			<ToolsPanel
				className="blablablocks-popup-editor-tools-panel"
				label={__('Border', 'blablablocks-popup')}
				resetAll={() => onChangeStyleValues({
					border: {},
					borderType: defaults.style?.borderType || 'none',
					borderColor: defaults.style?.borderColor || '#dcdcde',
					borderWidth: defaults.style?.borderWidth || '1px',
					borderRadius: defaults.style?.borderRadius || '8px',
				})}
			>
				<ToolsPanelItem
					hasValue={() => hasBorderValue(getBorderControlValue(style))}
					isShownByDefault
					label={__('Border', 'blablablocks-popup')}
					onDeselect={() => onChangeBorder(undefined)}
				>
					<BorderBoxControl
						__experimentalIsRenderedInSidebar
						__next40pxDefaultSize
						enableAlpha
						label={__('Border', 'blablablocks-popup')}
						onChange={onChangeBorder}
						popoverOffset={36}
						popoverPlacement="left-start"
						value={getBorderControlValue(style)}
						{...colorGradientSettings}
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={() => style.borderRadius !== defaults.style?.borderRadius}
					isShownByDefault
					label={__('Radius', 'blablablocks-popup')}
					onDeselect={() => onChangeStyle('borderRadius', defaults.style?.borderRadius || '8px')}
				>
					{BorderRadiusControl ? (
						<BorderRadiusControl
							__next40pxDefaultSize
							label={__('Radius', 'blablablocks-popup')}
							values={cssRadiusToBorderRadiusValues(style.borderRadius)}
							onChange={(value) => onChangeStyle('borderRadius', borderRadiusValuesToCss(value))}
						/>
					) : (
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Radius', 'blablablocks-popup')}
							value={style.borderRadius}
							onChange={(value) => onChangeStyle('borderRadius', value)}
						/>
					)}
				</ToolsPanelItem>
			</ToolsPanel>
		</>
	);
}
