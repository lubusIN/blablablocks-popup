/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock, serialize } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	Button,
	Modal,
	Notice,
	__experimentalText as Text,
	__experimentalView as View,
} from '@wordpress/components';
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { config, metaKey } from '../config/wordpress';
import { POPUP_VARIATIONS } from '../config/variations';
import { mergeSettings } from '../utils/settings';
import {
	clearStoredVariationPostId,
	removeVariationQueryParam,
	shouldOpenVariationChooser,
} from '../../shared/variation';

const createBlocksFromTemplate = ( blocks ) =>
	blocks.map( ( block ) =>
		createBlock(
			block.name,
			block.attributes || {},
			createBlocksFromTemplate( block.innerBlocks || [] )
		)
	);

/**
 * First-run starter layout chooser shown after creating a popup.
 */
export function VariationChooserModal() {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ applyingVariation, setApplyingVariation ] = useState( '' );
	const [ error, setError ] = useState( '' );
	const meta = useSelect(
		( select ) =>
			select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {},
		[]
	);
	const settings = useMemo(
		() => mergeSettings( meta[ metaKey ] ),
		[ meta ]
	);
	const { editPost, savePost } = useDispatch( 'core/editor' );
	const { resetBlocks } = useDispatch( 'core/block-editor' );

	useEffect( () => {
		if ( shouldOpenVariationChooser( config.postId ) ) {
			setIsOpen( true );
		}
	}, [] );

	const closeModal = useCallback( () => {
		setIsOpen( false );
		removeVariationQueryParam();
		clearStoredVariationPostId();
	}, [] );

	const applyVariation = useCallback(
		async ( variation ) => {
			const blocks = createBlocksFromTemplate( variation.template );
			const nextSettings = {
				...settings,
				layout: {
					...settings.layout,
					...( variation.settings.layout || {} ),
				},
				style: {
					...settings.style,
					...( variation.settings.style || {} ),
				},
			};

			setApplyingVariation( variation.id );
			setError( '' );

			try {
				resetBlocks( blocks );
				editPost( {
					content: serialize( blocks ),
					meta: {
						...meta,
						[ metaKey ]: nextSettings,
					},
				} );
				await savePost();
				closeModal();
			} catch ( saveError ) {
				setError(
					saveError?.message ||
						__(
							'The selected popup type could not be saved.',
							'blablablocks-popup'
						)
				);
			} finally {
				setApplyingVariation( '' );
			}
		},
		[ closeModal, editPost, meta, resetBlocks, savePost, settings ]
	);

	if ( ! isOpen ) {
		return null;
	}

	return (
		<Modal
			className="blablablocks-popup-variation-modal"
			title={ __( 'Choose popup type', 'blablablocks-popup' ) }
			size="fill"
			onRequestClose={ closeModal }
		>
			{ error && (
				<Notice status="error" isDismissible={ false }>
					{ error }
				</Notice>
			) }
			<View className="blablablocks-popup-variation-modal__intro">
				<Text>
					{ __(
						'Select a starting layout. You can still change the design, position, and behavior after it is added.',
						'blablablocks-popup'
					) }
				</Text>
			</View>
			<View className="blablablocks-popup-variation-grid">
				{ POPUP_VARIATIONS.map( ( variation ) => (
					<Button
						key={ variation.id }
						className="blablablocks-popup-variation-card"
						onClick={ () => applyVariation( variation ) }
						disabled={ !! applyingVariation }
						isBusy={ applyingVariation === variation.id }
					>
						<View
							as="span"
							className="blablablocks-popup-variation-card__image"
							aria-hidden="true"
						>
							<View as="img" src={ variation.image } alt="" />
						</View>
						<View
							as="span"
							className="blablablocks-popup-variation-card__content"
						>
							<Text
								as="span"
								className="blablablocks-popup-variation-card__title"
							>
								{ variation.label }
							</Text>
							<Text
								as="span"
								className="blablablocks-popup-variation-card__description"
							>
								{ variation.description }
							</Text>
						</View>
					</Button>
				) ) }
			</View>
		</Modal>
	);
}
