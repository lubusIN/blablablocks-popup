/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, cog as settingsIcon, navigationOverlay as popupIcon, styles as stylesIcon } from '@wordpress/icons';
import { Tabs } from '../../../node_modules/@wordpress/components/build-module/tabs/index.mjs';

/**
 * Internal dependencies
 */
import { AnimationPanel } from './animation-panel';
import { LayoutPanel } from './layout-panel';
import { StylePanel } from './style-panel';
import { SummaryCard } from './summary-card';
import {
	PluginSidebar,
	config,
	metaKey,
	useMultipleOriginColorsAndGradients,
} from '../config/wordpress';
import { SIDEBAR_NAME, TAB_SETTINGS, TAB_STYLES } from '../config/constants';
import { borderToLegacyValues } from '../utils/border';
import { getPositionValue, parsePositionValue } from '../utils/layout';
import { mergeSettings } from '../utils/settings';

/**
 * BlaBlaBlocks Popup block editor sidebar.
 */
export function PopupInspectorPanel() {
	const [ activeTab, setActiveTab ] = useState( TAB_SETTINGS );
	const postType = useSelect(
		( select ) => select( 'core/editor' ).getCurrentPostType(),
		[]
	);
	const meta = useSelect(
		( select ) => select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {},
		[]
	);
	const { editPost } = useDispatch( 'core/editor' );
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	if ( postType !== config.postType || ! PluginSidebar ) {
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

	const colorSettings = [
		{
			label: __( 'Popup background', 'blablablocks-popup' ),
			value: style.popupBackground,
			onChange: ( value ) => updateGroup( 'style', 'popupBackground', value ),
		},
		layout.overlay && {
			label: __( 'Overlay background', 'blablablocks-popup' ),
			value: style.overlayBackground,
			onChange: ( value ) => updateGroup( 'style', 'overlayBackground', value ),
		},
		layout.closeButton && {
			label: __( 'Close color', 'blablablocks-popup' ),
			value: style.closeColor,
			onChange: ( value ) => updateGroup( 'style', 'closeColor', value ),
		},
		layout.closeButton && {
			label: __( 'Close background', 'blablablocks-popup' ),
			value: style.closeBackground,
			onChange: ( value ) => updateGroup( 'style', 'closeBackground', value ),
		},
	].filter( Boolean );

	return (
		<PluginSidebar
			name={ SIDEBAR_NAME }
			title={ __( 'Popup', 'blablablocks-popup' ) }
			icon={ popupIcon }
			className="blablablocks-popup-editor-sidebar"
			isActiveByDefault
		>
			<SummaryCard />
			<Tabs selectedTabId={ activeTab } onSelect={ setActiveTab }>
				<Tabs.TabList className="blablablocks-popup-editor-inspector-tabs" aria-label={ __( 'Popup inspector tabs', 'blablablocks-popup' ) }>
					<Tabs.Tab className="blablablocks-popup-editor-inspector-tab" tabId={ TAB_SETTINGS } title={ __( 'Settings', 'blablablocks-popup' ) } aria-label={ __( 'Settings', 'blablablocks-popup' ) }>
						<Icon icon={ settingsIcon } size={ 24 } />
					</Tabs.Tab>
					<Tabs.Tab className="blablablocks-popup-editor-inspector-tab" tabId={ TAB_STYLES } title={ __( 'Styles', 'blablablocks-popup' ) } aria-label={ __( 'Styles', 'blablablocks-popup' ) }>
						<Icon icon={ stylesIcon } size={ 24 } />
					</Tabs.Tab>
				</Tabs.TabList>

				<Tabs.TabPanel tabId={ TAB_SETTINGS } focusable={ false }>
					<LayoutPanel
						layout={ layout }
						position={ getPositionValue( layout ) }
						style={ style }
						onChangeLayout={ ( key, value ) => updateGroup( 'layout', key, value ) }
						onChangePosition={ updatePosition }
						onChangeStyle={ ( key, value ) => updateGroup( 'style', key, value ) }
					/>
					<AnimationPanel
						layout={ layout }
						onChangeLayout={ ( key, value ) => updateGroup( 'layout', key, value ) }
						onResetLayout={ updateLayoutValues }
					/>
				</Tabs.TabPanel>

				<Tabs.TabPanel tabId={ TAB_STYLES } focusable={ false }>
					<StylePanel
						colorGradientSettings={ colorGradientSettings }
						colorSettings={ colorSettings }
						style={ style }
						onChangeStyle={ ( key, value ) => updateGroup( 'style', key, value ) }
						onChangeStyleValues={ updateStyleValues }
						onChangeBorder={ updateBorder }
					/>
				</Tabs.TabPanel>
			</Tabs>
		</PluginSidebar>
	);
}
