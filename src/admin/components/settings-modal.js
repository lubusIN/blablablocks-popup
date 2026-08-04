/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { DataForm } from '@wordpress/dataviews';
import { useState } from '@wordpress/element';
import {
	Button,
	Flex,
	Modal,
	Notice,
	TabPanel,
	__experimentalHeading as Heading,
	__experimentalText as Text,
	__experimentalView as View,
} from '@wordpress/components';

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
 * @param {Object}   root0         Component properties.
 * @param {Object}   root0.popup   Popup record.
 * @param {Function} root0.onClose Close callback.
 * @param {Function} root0.onSaved Save callback.
 */
export function SettingsModal( { popup, onClose, onSaved } ) {
	const [ data, setData ] = useState( flattenSettings( popup?.settings ) );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ error, setError ] = useState( '' );
	const tabs = settingsTabs.map( ( tab ) => ( {
		name: tab.id,
		title: tab.label,
	} ) );

	const save = async () => {
		setIsSaving( true );
		setError( '' );

		try {
			const result = await apiFetch( {
				path: `${ REST_POPUPS_PATH }/${ popup.id }`,
				method: 'PUT',
				data: {
					settings: unflattenSettings( data ),
				},
			} );
			onSaved( result );
		} catch ( apiError ) {
			setError(
				apiError?.message ||
					__(
						'The popup settings could not be saved.',
						'blablablocks-popup'
					)
			);
		} finally {
			setIsSaving( false );
		}
	};

	return (
		<Modal
			title={ sprintf(
				/* translators: %s: Popup title. */
				__( 'Settings: %s', 'blablablocks-popup' ),
				popup.title
			) }
			onRequestClose={ onClose }
			size="large"
			className="blablablocks-popup-settings-modal"
		>
			{ error && (
				<Notice status="error" isDismissible={ false }>
					{ error }
				</Notice>
			) }
			<TabPanel
				className="blablablocks-popup-settings-layout"
				tabs={ tabs }
				initialTabName={ settingsTabs[ 0 ].id }
				orientation="vertical"
			>
				{ ( selectedTab ) => {
					const tab =
						settingsTabs.find(
							( candidate ) => candidate.id === selectedTab.name
						) || settingsTabs[ 0 ];

					return (
						<View
							as="section"
							className="blablablocks-popup-settings-panel"
						>
							<Flex
								className="blablablocks-popup-settings-panel__header"
								direction="column"
								gap={ 2 }
								expanded={ false }
							>
								<Heading
									className="blablablocks-popup-settings-panel__title"
									level={ 2 }
								>
									{ tab.label }
								</Heading>
								<Text
									as="p"
									className="blablablocks-popup-settings-panel__description"
								>
									{ tab.description }
								</Text>
							</Flex>
							<DataForm
								data={ data }
								fields={ popupSettingsFields }
								form={ {
									layout: {
										type: 'regular',
										labelPosition: 'side',
									},
									fields: tab.fields,
								} }
								onChange={ ( edits ) =>
									setData( ( current ) => ( {
										...current,
										...edits,
									} ) )
								}
							/>
						</View>
					);
				} }
			</TabPanel>
			<Flex
				className="blablablocks-popup-modal-actions"
				justify="flex-end"
			>
				<Button
					variant="tertiary"
					onClick={ onClose }
					disabled={ isSaving }
				>
					{ __( 'Cancel', 'blablablocks-popup' ) }
				</Button>
				<Button
					variant="primary"
					onClick={ save }
					isBusy={ isSaving }
					disabled={ isSaving }
				>
					{ __( 'Save settings', 'blablablocks-popup' ) }
				</Button>
			</Flex>
		</Modal>
	);
}
