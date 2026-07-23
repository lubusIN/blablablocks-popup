/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { SIDEBAR_IDENTIFIER } from '../config/constants';
import { PluginPostStatusInfo } from '../config/wordpress';

/**
 * Open the popup settings sidebar from the post status panel.
 */
export function PopupSettingsStatusAction() {
	const { openGeneralSidebar } = useDispatch('core/edit-post');

	if (!PluginPostStatusInfo) {
		return null;
	}

	const openSettingsSidebar = () => {
		openGeneralSidebar(SIDEBAR_IDENTIFIER);
	};

	return (
		<PluginPostStatusInfo>
			<Button
				__next40pxDefaultSize
				className="blablablocks-popup-editor-settings-button"
				variant="primary"
				onClick={openSettingsSidebar}
			>
				{__('Popup settings', 'blablablocks-popup')}
			</Button>
		</PluginPostStatusInfo>
	);
}
