/* eslint-disable @wordpress/no-unsafe-wp-apis -- WordPress 6.9 has no stable Heading or Text exports. */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { BlockIcon } from '@wordpress/block-editor';
import {
	Flex,
	__experimentalHeading as Heading,
	__experimentalText as Text,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { popupIcon } from '../../shared/icons';

/**
 * Block-card style summary shown at the top of the popup sidebar.
 */
export function SummaryCard() {
	return (
		<Flex
			className="block-editor-block-card blablablocks-popup-editor-summary"
			direction="column"
			gap={ 2 }
			align="flex-start"
			justify="flex-start"
			expanded={ false }
		>
			<Flex direction="row" align="center" gap={ 2 } expanded={ false }>
				<BlockIcon icon={ popupIcon } showColors />
				<Heading level={ 2 } className="block-editor-block-card__title">
					{ __( 'Popup', 'blablablocks-popup' ) }
				</Heading>
			</Flex>
			<Text className="block-editor-block-card__description">
				{ __(
					'Configure how this popup appears, opens, and closes.',
					'blablablocks-popup'
				) }
			</Text>
		</Flex>
	);
}
