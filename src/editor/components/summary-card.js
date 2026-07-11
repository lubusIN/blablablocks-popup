/**
 * WordPress dependencies
 */
import {
	__experimentalHeading as Heading,
	__experimentalText as Text,
	__experimentalView as View,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, navigationOverlay as popupIcon } from '@wordpress/icons';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { BlockIcon } from '../config/wordpress';

/**
 * Block-card style summary shown at the top of the popup sidebar.
 */
export function SummaryCard() {
	return (
		<Stack
			className="block-editor-block-card blablablocks-popup-editor-summary"
			direction="row"
			gap="md"
			align="flex-start"
			justify="flex-start"
		>
			{ BlockIcon ? (
				<BlockIcon icon={ popupIcon } showColors />
			) : (
				<View as="span" className="block-editor-block-icon">
					<Icon icon={ popupIcon } size={ 24 } />
				</View>
			) }
			<Stack direction="column" gap="xs">
				<Heading level={ 2 } className="block-editor-block-card__title">
					<Text as="span" className="block-editor-block-card__name">
						{ __( 'Popup', 'blablablocks-popup' ) }
					</Text>
				</Heading>
				<Text className="block-editor-block-card__description">
					{ __( 'Configure how this popup appears, opens, and closes.', 'blablablocks-popup' ) }
				</Text>
			</Stack>
		</Stack>
	);
}
