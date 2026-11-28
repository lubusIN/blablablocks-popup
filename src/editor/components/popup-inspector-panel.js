/* eslint-disable @wordpress/no-unsafe-wp-apis -- WordPress 6.9 has no stable color-gradient settings hook. */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { cog as settingsIcon, styles as stylesIcon } from '@wordpress/icons';
import { TabPanel } from '@wordpress/components';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { AnimationPanel } from './animation-panel';
import { LayoutPanel } from './layout-panel';
import { StylePanel } from './style-panel';
import { config, metaKey } from '../config/wordpress';
import { SIDEBAR_NAME, TAB_SETTINGS, TAB_STYLES } from '../config/constants';
import { borderToLegacyValues } from '../utils/border';
import { getPositionValue, parsePositionValue } from '../utils/layout';
import { mergeSettings } from '../utils/settings';

const inspectorTabs = [
	{
		name: TAB_SETTINGS,
		title: __( 'Settings', 'blablablocks-popup' ),
		icon: settingsIcon,
		className: 'blablablocks-popup-editor-inspector-tab',
	},
	{
		name: TAB_STYLES,
		title: __( 'Styles', 'blablablocks-popup' ),
		icon: stylesIcon,
		className: 'blablablocks-popup-editor-inspector-tab',
	},
];

/**
 * BlaBlaBlocks Popup block editor document settings panel.
 */
export function PopupInspectorPanel() {
	const postType = useSelect(
		( select ) => select( 'core/editor' ).getCurrentPostType(),
		[]
	);
	const meta = useSelect(
		( select ) =>
			select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {},
		[]
	);
	const { editPost } = useDispatch( 'core/editor' );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	if ( postType !== config.postType ) {
		return null;
	}

	const settings = mergeSettings( meta[ metaKey ] );
	const layout = settings.layout;
	const style = settings.style;

	const updateGroup = ( group, key, value ) => {
		editPost( {
			meta: {
				...meta,
				[ metaKey ]: {
					...settings,
					[ group ]: {
						...settings[ group ],
						[ key ]: value,
					},
				},
			},
		} );
	};

	const updatePosition = ( value ) => {
		editPost( {
			meta: {
				...meta,
				[ metaKey ]: {
					...settings,
					layout: {
						...layout,
						...parsePositionValue( value ),
					},
				},
			},
		} );
	};

	const updateLayoutValues = ( values ) => {
		editPost( {
			meta: {
				...meta,
				[ metaKey ]: {
					...settings,
					layout: {
						...layout,
						...values,
					},
				},
			},
		} );
	};

	const updateStyleValues = ( values ) => {
		editPost( {
			meta: {
				...meta,
				[ metaKey ]: {
					...settings,
					style: {
						...style,
						...values,
					},
				},
			},
		} );
	};

	const updateBorder = ( value ) => {
		updateStyleValues( {
			border: value || {},
			...borderToLegacyValues( value, style ),
		} );
	};

	const backgroundColorSettings = [
		{
			label: __( 'Color', 'blablablocks-popup' ),
			value: style.popupBackground,
			onChange: ( value ) =>
				updateGroup( 'style', 'popupBackground', value ),
		},
		layout.overlay && {
			label: __( 'Overlay', 'blablablocks-popup' ),
			value: style.overlayBackground,
			onChange: ( value ) =>
				updateGroup( 'style', 'overlayBackground', value ),
		},
	].filter( Boolean );

	const closeButtonColorSettings = [
		layout.closeButton && {
			label: __( 'Color', 'blablablocks-popup' ),
			colorValue: style.closeColor,
			onColorChange: ( value ) =>
				updateGroup( 'style', 'closeColor', value ),
		},
		layout.closeButton && {
			label: __( 'Background', 'blablablocks-popup' ),
			colorValue: style.closeBackground,
			onColorChange: ( value ) =>
				updateGroup( 'style', 'closeBackground', value ),
		},
	].filter( Boolean );

	return (
		<PluginDocumentSettingPanel
			name={ SIDEBAR_NAME }
			title={ __( 'Settings', 'blablablocks-popup' ) }
			className="blablablocks-popup-editor-sidebar"
		>
			<TabPanel
				className="blablablocks-popup-editor-inspector"
				initialTabName={ TAB_SETTINGS }
				tabs={ inspectorTabs }
			>
				{ ( tab ) => (
					<>
						{ TAB_SETTINGS === tab.name && (
							<>
								<LayoutPanel
									layout={ layout }
									position={ getPositionValue( layout ) }
									onChangeLayout={ ( key, value ) =>
										updateGroup( 'layout', key, value )
									}
									onChangePosition={ updatePosition }
									onResetLayout={ updateLayoutValues }
								/>
								<AnimationPanel
									layout={ layout }
									onChangeLayout={ ( key, value ) =>
										updateGroup( 'layout', key, value )
									}
									onResetLayout={ updateLayoutValues }
								/>
							</>
						) }
						{ TAB_STYLES === tab.name && (
							<StylePanel
								backgroundColorSettings={
									backgroundColorSettings
								}
								closeButtonColorSettings={
									closeButtonColorSettings
								}
								colorGradientSettings={ colorGradientSettings }
								style={ style }
								onChangeStyle={ ( key, value ) =>
									updateGroup( 'style', key, value )
								}
								onChangeStyleValues={ updateStyleValues }
								onChangeBorder={ updateBorder }
							/>
						) }
					</>
				) }
			</TabPanel>
		</PluginDocumentSettingPanel>
	);
}
