/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import { SIDEBAR_PLUGIN_NAME } from './config/constants';
import { CanvasPreview } from './components/canvas-preview';
import { PopupInspectorPanel } from './components/popup-inspector-panel';
import { PopupSidebarAutoOpen } from './components/popup-sidebar-auto-open';
import { PopupSettingsStatusAction } from './components/popup-settings-status-action';
import { VariationChooserModal } from './components/variation-chooser-modal';
import { popupIcon } from '../shared/icons';

function PopupEditorPlugin() {
	return (
		<Fragment>
			<CanvasPreview />
			<PopupInspectorPanel />
			<PopupSidebarAutoOpen />
			<PopupSettingsStatusAction />
			<VariationChooserModal />
		</Fragment>
	);
}

/**
 * Register the BlaBlaBlocks Popup editor plugin.
 */
registerPlugin( SIDEBAR_PLUGIN_NAME, {
	icon: popupIcon,
	render: PopupEditorPlugin,
} );
