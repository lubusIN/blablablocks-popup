/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import {
	Button,
	Flex,
	Modal,
	Notice,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { REST_POPUPS_PATH } from '../config/constants';
import { defaults, titleField } from '../config/settings';

/**
 * Initial creation modal.
 *
 * Creation asks only for a title, then redirects the user to the block editor
 * where popup layout and design are configured.
 * @param {Object}   root0         Component properties.
 * @param {Function} root0.onClose Close callback.
 * @param {Function} root0.onSaved Save callback.
 */
export function CreatePopupModal( { onClose, onSaved } ) {
	const [ title, setTitle ] = useState( '' );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ error, setError ] = useState( '' );

	const save = async () => {
		setIsSaving( true );
		setError( '' );

		try {
			const result = await apiFetch( {
				path: REST_POPUPS_PATH,
				method: 'POST',
				data: {
					title,
					settings: defaults,
				},
			} );
			onSaved( result );
		} catch ( apiError ) {
			setError(
				apiError?.message ||
					__( 'The popup could not be saved.', 'blablablocks-popup' )
			);
		} finally {
			setIsSaving( false );
		}
	};

	return (
		<Modal
			title={ __( 'Draft new: Popup', 'blablablocks-popup' ) }
			onRequestClose={ onClose }
			className="blablablocks-popup-create-modal"
		>
			{ error && (
				<Notice status="error" isDismissible={ false }>
					{ error }
				</Notice>
			) }
			<TextControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ titleField.label }
				value={ title }
				onChange={ setTitle }
			/>
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
					disabled={ isSaving || ! title.trim() }
				>
					{ __( 'Create Popup', 'blablablocks-popup' ) }
				</Button>
			</Flex>
		</Modal>
	);
}
