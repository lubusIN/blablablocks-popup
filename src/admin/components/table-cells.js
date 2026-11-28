/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Flex } from '@wordpress/components';
import { Icon, commentAuthorAvatar, drafts } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { config, statusIcons } from '../config/wordpress';

/**
 * Status cell with a WordPress status icon.
 * @param {Object} root0      Component properties.
 * @param {Object} root0.item Popup record.
 */
export function StatusBadge( { item } ) {
	const status = item.status || 'draft';
	const label = config.statuses?.[ status ] || status;
	const icon = statusIcons[ status ] || drafts;

	return (
		<Flex
			className={ `blablablocks-popup-status blablablocks-popup-status--${ status }` }
			direction="row"
			gap={ 1 }
			align="center"
			justify="flex-start"
		>
			<Icon icon={ icon } size={ 24 } />
			<span>{ label }</span>
		</Flex>
	);
}

/**
 * Author cell that falls back to a WordPress avatar icon.
 * @param {Object} root0      Component properties.
 * @param {Object} root0.item Popup record.
 */
export function AuthorCell( { item } ) {
	const name = item.authorName || __( 'Unknown', 'blablablocks-popup' );

	return (
		<Flex
			className="blablablocks-popup-author"
			direction="row"
			gap={ 1 }
			align="center"
			justify="flex-start"
		>
			{ item.authorAvatarUrl ? (
				<img
					className="blablablocks-popup-author__avatar"
					src={ item.authorAvatarUrl }
					alt=""
				/>
			) : (
				<span className="blablablocks-popup-author__icon">
					<Icon icon={ commentAuthorAvatar } size={ 24 } />
				</span>
			) }
			<span>{ name }</span>
		</Flex>
	);
}

/**
 * Date cell that labels published posts by publish date and other posts by
 * modified date.
 * @param {Object} root0      Component properties.
 * @param {Object} root0.item Popup record.
 */
export function DateCell( { item } ) {
	const isPublished = item.status === 'publish';
	const label = isPublished
		? __( 'Published:', 'blablablocks-popup' )
		: __( 'Modified:', 'blablablocks-popup' );
	const value = isPublished ? item.dateFormatted : item.modifiedFormatted;

	return (
		<Flex
			className="blablablocks-popup-date"
			direction="row"
			gap={ 1 }
			align="center"
			justify="flex-start"
		>
			<span>{ label }</span>
			<span>{ value }</span>
		</Flex>
	);
}
