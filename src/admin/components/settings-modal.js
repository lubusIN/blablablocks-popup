/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Stack } from '@wordpress/ui';
import apiFetch from '@wordpress/api-fetch';
import { DataForm } from '@wordpress/dataviews';
import { useState } from '@wordpress/element';
import {
	Button,
	Flex,
	Modal,
	Notice,
	__experimentalHeading as Heading,
	__experimentalText as Text,
	__experimentalView as View,
} from '@wordpress/components';
import { Tabs } from '../../../node_modules/@wordpress/components/build-module/tabs/index.mjs';

/**
 * Internal dependencies
 */
import { popupSettingsFields } from './data-form-fields';
import { REST_POPUPS_PATH } from '../config/constants';
import {
	flattenSettings,
	settingsTabs,
	unflattenSettings,
} from '../config/settings';

/**
 * Behavior settings modal opened from the DataViews table.
 */
export function SettingsModal({ popup, onClose, onSaved }) {
	const [data, setData] = useState(flattenSettings(popup?.settings));
	const [activeTabId, setActiveTabId] = useState(settingsTabs[0].id);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');

	const save = async () => {
		setIsSaving(true);
		setError('');

		try {
			const result = await apiFetch({
				path: `${REST_POPUPS_PATH}/${popup.id}`,
				method: 'PUT',
				data: {
					settings: unflattenSettings(data),
				},
			});
			onSaved(result);
		} catch (apiError) {
			setError(apiError?.message || __('The popup settings could not be saved.', 'blablablocks-popup'));
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Modal
			title={sprintf(__('Settings: %s', 'blablablocks-popup'), popup.title)}
			onRequestClose={onClose}
			size="large"
			className="blablablocks-popup-settings-modal"
		>
			{error && <Notice status="error" isDismissible={false}>{error}</Notice>}
			<Tabs
				className="blablablocks-popup-settings-tabs-root"
				orientation="vertical"
				selectedTabId={activeTabId}
				onSelect={(tabId) => setActiveTabId(tabId || settingsTabs[0].id)}
			>
				<View className="blablablocks-popup-settings-layout">
					<Tabs.TabList className="blablablocks-popup-settings-tabs">
						{settingsTabs.map((tab) => (
							<Tabs.Tab key={tab.id} tabId={tab.id}>
								{tab.label}
							</Tabs.Tab>
						))}
					</Tabs.TabList>
					{settingsTabs.map((tab) => (
						<Tabs.TabPanel key={tab.id} tabId={tab.id} focusable={false}>
							<View as="section" className="blablablocks-popup-settings-panel">
								<Stack
									className="blablablocks-popup-settings-panel__header"
									direction="column"
									gap="sm"
								>
									<Heading className="blablablocks-popup-settings-panel__title" level={2}>
										{tab.label}
									</Heading>
									<Text as="p" className="blablablocks-popup-settings-panel__description">
										{tab.description}
									</Text>
								</Stack>
								<DataForm
									data={data}
									fields={popupSettingsFields}
									form={{
										layout: { type: 'regular', labelPosition: 'side' },
										fields: tab.fields,
									}}
									onChange={(edits) => setData((current) => ({ ...current, ...edits }))}
								/>
							</View>
						</Tabs.TabPanel>
					))}
				</View>
			</Tabs>
			<Flex className="blablablocks-popup-modal-actions" justify="flex-end">
				<Button variant="tertiary" onClick={onClose} disabled={isSaving}>
					{__('Cancel', 'blablablocks-popup')}
				</Button>
				<Button variant="primary" onClick={save} isBusy={isSaving} disabled={isSaving}>
					{__('Save settings', 'blablablocks-popup')}
				</Button>
			</Flex>
		</Modal>
	);
}
