/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import {
	__experimentalConfirmDialog as ConfirmDialog,
	__experimentalHeading as Heading,
	__experimentalText as Text,
	__experimentalView as View,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	Notice,
	SnackbarList,
	Spinner,
} from '@wordpress/components';
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews/wp';
import { createRoot, useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { Icon, navigationOverlay, plus } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { CreatePopupModal } from './components/create-popup-modal';
import { SettingsModal } from './components/settings-modal';
import { AuthorCell, DateCell, StatusBadge } from './components/table-cells';
import {
	ADMIN_APP_TITLE,
	ADMIN_ROOT_ID,
	DEFAULT_VIEW,
	REST_POPUPS_PATH,
	SNACKBAR_ID_PREFIX,
	VARIATION_QUERY_PARAM,
	VARIATION_SESSION_KEY,
} from './config/constants';
import { config } from './config/wordpress';

apiFetch.use( apiFetch.createNonceMiddleware( config.nonce ) );

const getVariationEditUrl = ( editUrl ) => {
	const url = new URL( editUrl, window.location.href );
	url.searchParams.set( VARIATION_QUERY_PARAM, '1' );

	return url.toString();
};

const rememberVariationPost = ( postId ) => {
	try {
		window.sessionStorage.setItem( VARIATION_SESSION_KEY, String( postId ) );
	} catch ( error ) {}
};

/**
 * Empty state displayed when DataViews has no popup rows to render.
 */
function EmptyPopupsState( { onCreate } ) {
	return (
		<View className="blablablocks-popup-empty-state">
			<View className="blablablocks-popup-empty-state__icon" aria-hidden="true">
				<Icon icon={ navigationOverlay } size={ 24 } />
			</View>
			<Heading className="blablablocks-popup-empty-state__title" level={ 2 }>
				{ __( 'No Popups', 'blablablocks-popup' ) }
			</Heading>
			<View as="p" className="blablablocks-popup-empty-state__description">
				{ __( 'Create a popup to get started.', 'blablablocks-popup' ) }
			</View>
			<Button
				className="blablablocks-popup-empty-state__button"
				variant="primary"
				icon={ plus }
				onClick={ onCreate }
			>
				{ __( 'Add Popup', 'blablablocks-popup' ) }
			</Button>
		</View>
	);
}

/**
 * BlaBlaBlocks Popup admin application.
 */
function App() {
	const [ popups, setPopups ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( '' );
	const [ modalPopup, setModalPopup ] = useState( null );
	const [ isCreating, setIsCreating ] = useState( false );
	const [ confirmAction, setConfirmAction ] = useState( null );
	const [ isConfirming, setIsConfirming ] = useState( false );
	const [ snackbars, setSnackbars ] = useState( [] );
	const [ view, setView ] = useState( DEFAULT_VIEW );

	const fetchPopups = useCallback( async () => {
		setIsLoading( true );
		setError( '' );
		try {
			setPopups( await apiFetch( { path: REST_POPUPS_PATH } ) );
		} catch ( apiError ) {
			setError( apiError?.message || __( 'Could not load popups.', 'blablablocks-popup' ) );
		} finally {
			setIsLoading( false );
		}
	}, [] );

	useEffect( () => {
		fetchPopups();
	}, [ fetchPopups ] );

	const addSnackbar = useCallback( ( content ) => {
		setSnackbars( ( current ) => [
			...current,
			{
				id: `${ SNACKBAR_ID_PREFIX }-${ Date.now() }-${ current.length }`,
				content,
			},
		] );
	}, [] );

	const removeSnackbar = useCallback( ( id ) => {
		setSnackbars( ( current ) => current.filter( ( snackbar ) => snackbar.id !== id ) );
	}, [] );

	const duplicatePopup = useCallback( async ( popup ) => {
		const result = await apiFetch( {
			path: `${ REST_POPUPS_PATH }/${ popup.id }/duplicate`,
			method: 'POST',
		} );
		setPopups( ( current ) => [ result, ...current ] );
		addSnackbar( __( 'Popup duplicated.', 'blablablocks-popup' ) );
	}, [ addSnackbar ] );

	const trashPopups = useCallback( async ( items ) => {
		const popupsToTrash = Array.isArray( items ) ? items : [ items ];

		const trashedPopups = await Promise.all( popupsToTrash.map( ( popup ) => apiFetch( {
			path: `${ REST_POPUPS_PATH }/${ popup.id }`,
			method: 'DELETE',
		} ) ) );

		const trashedById = new Map( trashedPopups.map( ( popup ) => [ popup.id, popup ] ) );
		setPopups( ( current ) => current.map( ( item ) => trashedById.get( item.id ) || item ) );
		addSnackbar(
			popupsToTrash.length === 1 ?
				__( 'Popup moved to Trash.', 'blablablocks-popup' ) :
				sprintf( __( '%d popups moved to Trash.', 'blablablocks-popup' ), popupsToTrash.length )
		);
	}, [ addSnackbar ] );

	const restorePopups = useCallback( async ( items ) => {
		const popupsToRestore = Array.isArray( items ) ? items : [ items ];

		const restoredPopups = await Promise.all( popupsToRestore.map( ( popup ) => apiFetch( {
			path: `${ REST_POPUPS_PATH }/${ popup.id }/restore`,
			method: 'POST',
		} ) ) );

		const restoredById = new Map( restoredPopups.map( ( popup ) => [ popup.id, popup ] ) );
		setPopups( ( current ) => current.map( ( item ) => restoredById.get( item.id ) || item ) );
		addSnackbar(
			popupsToRestore.length === 1 ?
				__( 'Popup restored.', 'blablablocks-popup' ) :
				sprintf( __( '%d popups restored.', 'blablablocks-popup' ), popupsToRestore.length )
		);
	}, [ addSnackbar ] );

	const permanentlyDeletePopups = useCallback( async ( items ) => {
		const popupsToDelete = Array.isArray( items ) ? items : [ items ];

		await Promise.all( popupsToDelete.map( ( popup ) => apiFetch( {
			path: `${ REST_POPUPS_PATH }/${ popup.id }?force=true`,
			method: 'DELETE',
		} ) ) );

		const deletedIds = popupsToDelete.map( ( popup ) => popup.id );
		setPopups( ( current ) => current.filter( ( item ) => ! deletedIds.includes( item.id ) ) );
		addSnackbar(
			popupsToDelete.length === 1 ?
				__( 'Popup permanently deleted.', 'blablablocks-popup' ) :
				sprintf( __( '%d popups permanently deleted.', 'blablablocks-popup' ), popupsToDelete.length )
		);
	}, [ addSnackbar ] );

	const closeConfirmDialog = useCallback( () => {
		if ( ! isConfirming ) {
			setConfirmAction( null );
		}
	}, [ isConfirming ] );

	const confirmPendingAction = useCallback( async () => {
		if ( ! confirmAction ) {
			return;
		}

		setIsConfirming( true );
		setError( '' );

		try {
			if ( confirmAction.type === 'duplicate' ) {
				await duplicatePopup( confirmAction.items[ 0 ] );
			}

			if ( confirmAction.type === 'trash' ) {
				await trashPopups( confirmAction.items );
			}

			if ( confirmAction.type === 'delete' ) {
				await permanentlyDeletePopups( confirmAction.items );
			}

			setConfirmAction( null );
		} catch ( apiError ) {
			setError( apiError?.message || __( 'The action could not be completed.', 'blablablocks-popup' ) );
		} finally {
			setIsConfirming( false );
		}
	}, [ confirmAction, duplicatePopup, permanentlyDeletePopups, trashPopups ] );

	const hasStatusFilter = useMemo(
		() => view.filters?.some( ( filter ) => filter.field === 'status' ),
		[ view.filters ]
	);
	const visiblePopups = useMemo(
		() => hasStatusFilter ? popups : popups.filter( ( popup ) => popup.status !== 'trash' ),
		[ hasStatusFilter, popups ]
	);

	const fields = useMemo( () => {
		const authors = Array.from(
			new Map(
				visiblePopups
					.filter( ( popup ) => popup.authorName )
					.map( ( popup ) => [ popup.authorName, { value: popup.authorName, label: popup.authorName } ] )
			).values()
		);

		return [
			{
				id: 'title',
				type: 'text',
				label: __( 'Title', 'blablablocks-popup' ),
				enableGlobalSearch: true,
				render: ( { item } ) => {
					const title = item.title || __( '(no title)', 'blablablocks-popup' );

					return item.status === 'trash' ? (
						<Text className="blablablocks-popup-title-link" as="span">{ title }</Text>
					) : (
						<Button className="blablablocks-popup-title-link" variant="link" href={ item.editUrl }>
							{ title }
						</Button>
					);
				},
			},
			{
				id: 'status',
				type: 'text',
				label: __( 'Status', 'blablablocks-popup' ),
				enableGlobalSearch: true,
				elements: Object.entries( config.statuses || {} ).map( ( [ value, label ] ) => ( { value, label } ) ),
				filterBy: { operators: [ 'isAny', 'isNone' ] },
				render: StatusBadge,
			},
			{ id: 'authorName', type: 'text', label: __( 'Author', 'blablablocks-popup' ), enableGlobalSearch: true, elements: authors, render: AuthorCell },
			{ id: 'triggersSummary', type: 'text', label: __( 'Triggers', 'blablablocks-popup' ), enableGlobalSearch: true },
			{ id: 'conditionsSummary', type: 'text', label: __( 'Conditions', 'blablablocks-popup' ), enableGlobalSearch: true },
			{ id: 'devicesSummary', type: 'text', label: __( 'Devices', 'blablablocks-popup' ), enableGlobalSearch: true },
			{
				id: 'date',
				type: 'datetime',
				label: __( 'Date', 'blablablocks-popup' ),
				getValue: ( { item } ) => item.status === 'publish' ? item.date : item.modified,
				render: DateCell,
			},
		];
	}, [ visiblePopups ] );

	const actions = useMemo( () => [
		{
			id: 'edit-content',
			label: __( 'Edit', 'blablablocks-popup' ),
			isPrimary: true,
			supportsBulk: false,
			isEligible: ( item ) => item.status !== 'trash',
			callback: ( items ) => {
				const item = Array.isArray( items ) ? items[ 0 ] : items;
				if ( item?.editUrl ) {
					window.location.href = item.editUrl;
				}
			},
		},
		{
			id: 'edit-settings',
			label: __( 'Edit settings', 'blablablocks-popup' ),
			supportsBulk: false,
			isEligible: ( item ) => item.status !== 'trash',
			callback: ( items ) => {
				setModalPopup( Array.isArray( items ) ? items[ 0 ] : items );
			},
		},
		{
			id: 'duplicate',
			label: __( 'Duplicate', 'blablablocks-popup' ),
			supportsBulk: false,
			isEligible: ( item ) => item.status !== 'trash',
			callback: ( items ) => setConfirmAction( {
				type: 'duplicate',
				items: [ Array.isArray( items ) ? items[ 0 ] : items ],
			} ),
		},
		{
			id: 'trash',
			label: __( 'Trash', 'blablablocks-popup' ),
			supportsBulk: true,
			isEligible: ( item ) => item.status !== 'trash',
			callback: ( items ) => setConfirmAction( {
				type: 'trash',
				items: Array.isArray( items ) ? items : [ items ],
			} ),
		},
		{
			id: 'restore',
			label: __( 'Restore', 'blablablocks-popup' ),
			supportsBulk: true,
			isEligible: ( item ) => item.status === 'trash',
			callback: async ( items ) => {
				setError( '' );
				try {
					await restorePopups( items );
				} catch ( apiError ) {
					setError( apiError?.message || __( 'The action could not be completed.', 'blablablocks-popup' ) );
				}
			},
		},
		{
			id: 'delete',
			label: __( 'Permanently delete', 'blablablocks-popup' ),
			supportsBulk: true,
			isEligible: ( item ) => item.status === 'trash',
			callback: ( items ) => setConfirmAction( {
				type: 'delete',
				items: Array.isArray( items ) ? items : [ items ],
			} ),
		},
	], [ restorePopups ] );

	const processedPopups = useMemo( () => filterSortAndPaginate( visiblePopups, view, fields ), [ visiblePopups, view, fields ] );
	const confirmButtonText = confirmAction?.type === 'trash' ?
		__( 'Trash', 'blablablocks-popup' ) :
		confirmAction?.type === 'delete' ?
			__( 'Delete permanently', 'blablablocks-popup' ) :
			__( 'Duplicate', 'blablablocks-popup' );
	const confirmMessage = useMemo( () => {
		if ( ! confirmAction ) {
			return '';
		}

		if ( confirmAction.type === 'trash' ) {
			return confirmAction.items.length === 1 ?
				sprintf( __( 'Are you sure you want to move "%s" to the trash?', 'blablablocks-popup' ), confirmAction.items[ 0 ]?.title || __( '(no title)', 'blablablocks-popup' ) ) :
				sprintf( __( 'Are you sure you want to move %d popups to the trash?', 'blablablocks-popup' ), confirmAction.items.length );
		}

		if ( confirmAction.type === 'delete' ) {
			return confirmAction.items.length === 1 ?
				sprintf( __( 'Are you sure you want to permanently delete "%s"? This cannot be undone.', 'blablablocks-popup' ), confirmAction.items[ 0 ]?.title || __( '(no title)', 'blablablocks-popup' ) ) :
				sprintf( __( 'Are you sure you want to permanently delete %d popups? This cannot be undone.', 'blablablocks-popup' ), confirmAction.items.length );
		}

		return sprintf(
			__( 'Are you sure you want to duplicate "%s"?', 'blablablocks-popup' ),
			confirmAction.items[ 0 ]?.title || __( '(no title)', 'blablablocks-popup' )
		);
	}, [ confirmAction ] );

	return (
		<View className="blablablocks-popup-admin">
			<Flex className="blablablocks-popup-admin__header" align="center">
				<FlexBlock>
					<Heading level={ 1 }>{ ADMIN_APP_TITLE }</Heading>
				</FlexBlock>
				{ popups.length > 0 && (
					<FlexItem>
						<Button variant="primary" onClick={ () => setIsCreating( true ) }>
							{ __( 'Add Popup', 'blablablocks-popup' ) }
						</Button>
					</FlexItem>
				) }
			</Flex>

			{ error && <Notice status="error" isDismissible={ false }>{ error }</Notice> }
			{ isLoading ? (
				<View className="blablablocks-popup-admin__loading"><Spinner /></View>
			) : (
				<DataViews
					data={ processedPopups.data }
					fields={ fields }
					view={ view }
					onChangeView={ setView }
					defaultLayouts={ {
						table: {},
						grid: { badgeFields: [ 'status', 'devicesSummary' ], density: 'balanced' },
						list: { density: 'comfortable' },
					} }
					actions={ actions }
					paginationInfo={ processedPopups.paginationInfo }
					search
					empty={ <EmptyPopupsState onCreate={ () => setIsCreating( true ) } /> }
				/>
			) }

			{ isCreating && (
				<CreatePopupModal
					onClose={ () => setIsCreating( false ) }
					onSaved={ ( popup ) => {
						if ( popup?.editUrl ) {
							rememberVariationPost( popup.id );
							window.location.href = getVariationEditUrl( popup.editUrl );
							return;
						}

						setPopups( ( current ) => [ popup, ...current ] );
						setIsCreating( false );
						addSnackbar( __( 'Popup created.', 'blablablocks-popup' ) );
					} }
				/>
			) }

			{ modalPopup && (
				<SettingsModal
					popup={ modalPopup }
					onClose={ () => setModalPopup( null ) }
					onSaved={ ( popup ) => {
						setPopups( ( current ) => current.map( ( item ) => item.id === popup.id ? popup : item ) );
						setModalPopup( popup );
						addSnackbar( __( 'Popup settings saved.', 'blablablocks-popup' ) );
					} }
				/>
			) }

			{ confirmAction && (
				<ConfirmDialog
					isOpen
					onCancel={ closeConfirmDialog }
					onConfirm={ confirmPendingAction }
					isBusy={ isConfirming }
					cancelButtonText={ __( 'Cancel', 'blablablocks-popup' ) }
					confirmButtonText={ confirmButtonText }
				>
					{ confirmMessage }
				</ConfirmDialog>
			) }

			<SnackbarList
				className="blablablocks-popup-snackbar-list"
				notices={ snackbars }
				onRemove={ removeSnackbar }
			/>
		</View>
	);
}

const root = document.getElementById( ADMIN_ROOT_ID );

if ( root ) {
	createRoot( root ).render( <App /> );
}
