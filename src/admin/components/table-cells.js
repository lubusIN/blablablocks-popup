/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Stack } from '@wordpress/ui';
import {
	__experimentalText as Text,
	__experimentalView as View,
} from '@wordpress/components';
import { Icon, commentAuthorAvatar, drafts } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { config, statusIcons } from '../config/wordpress';

/**
 * Status cell with a WordPress status icon.
 */
export function StatusBadge({ item }) {
	const status = item.status || 'draft';
	const label = config.statuses?.[status] || status;
	const icon = statusIcons[status] || drafts;

	return (
		<Stack
			className={`blablablocks-popup-status blablablocks-popup-status--${status}`}
			direction="row"
			gap="xs"
			align="center"
			justify="flex-start"
		>
			<Icon icon={icon} size={24} />
			<Text as="span">{label}</Text>
		</Stack>
	);
}

/**
 * Author cell that falls back to a WordPress avatar icon.
 */
export function AuthorCell({ item }) {
	const name = item.authorName || __('Unknown', 'blablablocks-popup');

	return (
		<Stack className="blablablocks-popup-author" direction="row" gap="xs" align="center" justify="flex-start">
			{item.authorAvatarUrl ? (
				<View
					as="img"
					className="blablablocks-popup-author__avatar"
					src={item.authorAvatarUrl}
					alt=""
				/>
			) : (
				<View as="span" className="blablablocks-popup-author__icon">
					<Icon icon={commentAuthorAvatar} size={24} />
				</View>
			)}
			<Text as="span">{name}</Text>
		</Stack>
	);
}

/**
 * Date cell that labels published posts by publish date and other posts by
 * modified date.
 */
export function DateCell({ item }) {
	const isPublished = item.status === 'publish';
	const label = isPublished ? __('Published:', 'blablablocks-popup') : __('Modified:', 'blablablocks-popup');
	const value = isPublished ? item.dateFormatted : item.modifiedFormatted;

	return (
		<Stack className="blablablocks-popup-date" direction="row" gap="xs" align="center" justify="flex-start">
			<Text as="span">{label}</Text>
			<Text as="span">{value}</Text>
		</Stack>
	);
}
