/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
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
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews';
import {
	createRoot,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';
import { Icon, overlayText as popupIcon, plus } from '@wordpress/icons';

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
		window.sessionStorage.setItem(
			VARIATION_SESSION_KEY,
			String( postId )
		);
	} catch {}
};

const runPopupRequests = async ( popups, request ) => {
	const results = await Promise.allSettled(
		popups.map( async ( popup ) => ( {
			popup,
			result: await request( popup ),
		} ) )
	);

	return {
		successful: results
			.filter( ( result ) => result.status === 'fulfilled' )
			.map( ( result ) => result.value ),
		failedCount: results.filter(
			( result ) => result.status === 'rejected'
		).length,
	};
};

const reportBulkFailures = ( failedCount ) => {
	if ( ! failedCount ) {
		return;
	}

	throw new Error(
		sprintf(
			/* translators: %d: Number of popup actions that failed. */
			__(
				'%d popup actions could not be completed.',
				'blablablocks-popup'
			),
			failedCount
		)
	);
};

/**
 * Empty state displayed when the popup collection is empty.
 * @param {Object}   root0          Component properties.
 * @param {Function} root0.onCreate Create callback.
 */
function EmptyPopupsState( { onCreate } ) {
	return (
		<View className="blablablocks-popup-empty-state">
			<View
				className="blablablocks-popup-empty-state__icon"
				aria-hidden="true"
			>
				<Icon icon={ popupIcon } size={ 24 } />
			</View>
			<Heading
				className="blablablocks-popup-empty-state__title"
				level={ 2 }
			>
				{ __( 'No Popups', 'blablablocks-popup' ) }
			</Heading>
			<View
				as="p"
				className="blablablocks-popup-empty-state__description"
			>
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
			setError(
				apiError?.message ||
					__( 'Could not load popups.', 'blablablocks-popup' )
			);
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
				id: `${ SNACKBAR_ID_PREFIX }-${ Date.now() }-${
					current.length
				}`,
				content,
			},
		] );
	}, [] );

	const removeSnackbar = useCallback( ( id ) => {
		setSnackbars( ( current ) =>
			current.filter( ( snackbar ) => snackbar.id !== id )
		);
	}, [] );

	const duplicatePopup = useCallback(
		async ( popup ) => {
			const result = await apiFetch( {
				path: `${ REST_POPUPS_PATH }/${ popup.id }/duplicate`,
				method: 'POST',
			} );
			setPopups( ( current ) => [ result, ...current ] );
			addSnackbar( __( 'Popup duplicated.', 'blablablocks-popup' ) );
		},
		[ addSnackbar ]
	);

	const trashPopups = useCallback(
		async ( items ) => {
			const popupsToTrash = Array.isArray( items ) ? items : [ items ];
			const { successful, failedCount } = await runPopupRequests(
				popupsToTrash,
				( popup ) =>
					apiFetch( {
						path: `${ REST_POPUPS_PATH }/${ popup.id }`,
						method: 'DELETE',
					} )
			);
			const trashedById = new Map(
				successful.map( ( { result } ) => [ result.id, result ] )
			);

			setPopups( ( current ) =>
				current.map( ( item ) => trashedById.get( item.id ) || item )
			);

			if ( successful.length ) {
				addSnackbar(
					successful.length === 1
						? __( 'Popup moved to Trash.', 'blablablocks-popup' )
						: sprintf(
								/* translators: %d: Number of popups moved to Trash. */
								__(
									'%d popups moved to Trash.',
									'blablablocks-popup'
								),
								successful.length
						  )
				);
			}

			reportBulkFailures( failedCount );
		},
		[ addSnackbar ]
	);

	const restorePopups = useCallback(
		async ( items ) => {
			const popupsToRestore = Array.isArray( items ) ? items : [ items ];

			const { successful, failedCount } = await runPopupRequests(
				popupsToRestore,
				( popup ) =>
					apiFetch( {
						path: `${ REST_POPUPS_PATH }/${ popup.id }/restore`,
						method: 'POST',
					} )
			);
			const restoredById = new Map(
				successful.map( ( { result } ) => [ result.id, result ] )
			);

			setPopups( ( current ) =>
				current.map( ( item ) => restoredById.get( item.id ) || item )
			);

			if ( successful.length ) {
				addSnackbar(
					successful.length === 1
						? __( 'Popup restored.', 'blablablocks-popup' )
						: sprintf(
								/* translators: %d: Number of restored popups. */
								__(
									'%d popups restored.',
									'blablablocks-popup'
								),
								successful.length
						  )
				);
			}

			reportBulkFailures( failedCount );
		},
		[ addSnackbar ]
	);

	const permanentlyDeletePopups = useCallback(
		async ( items ) => {
			const popupsToDelete = Array.isArray( items ) ? items : [ items ];

			const { successful, failedCount } = await runPopupRequests(
				popupsToDelete,
				( popup ) =>
					apiFetch( {
						path: `${ REST_POPUPS_PATH }/${ popup.id }?force=true`,
						method: 'DELETE',
					} )
			);
			const deletedIds = successful.map( ( { popup } ) => popup.id );

			setPopups( ( current ) =>
				current.filter( ( item ) => ! deletedIds.includes( item.id ) )
			);

			if ( successful.length ) {
				addSnackbar(
					successful.length === 1
						? __(
								'Popup permanently deleted.',
								'blablablocks-popup'
						  )
						: sprintf(
								/* translators: %d: Number of permanently deleted popups. */
								__(
									'%d popups permanently deleted.',
									'blablablocks-popup'
								),
								successful.length
						  )
				);
			}

			reportBulkFailures( failedCount );
		},
		[ addSnackbar ]
	);

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
			setError(
				apiError?.message ||
					__(
						'The action could not be completed.',
						'blablablocks-popup'
					)
			);
		} finally {
			setIsConfirming( false );
		}
	}, [
		confirmAction,
		duplicatePopup,
		permanentlyDeletePopups,
		trashPopups,
	] );

	const hasStatusFilter = useMemo(
		() => view.filters?.some( ( filter ) => filter.field === 'status' ),
		[ view.filters ]
	);
	const visiblePopups = useMemo(
		() =>
			hasStatusFilter
				? popups
				: popups.filter( ( popup ) => popup.status !== 'trash' ),
		[ hasStatusFilter, popups ]
	);

	const fields = useMemo( () => {
		const authors = Array.from(
			new Map(
				visiblePopups
					.filter( ( popup ) => popup.authorName )
					.map( ( popup ) => [
						popup.authorName,
						{ value: popup.authorName, label: popup.authorName },
					] )
			).values()
		);

		return [
			{
				id: 'title',
				type: 'text',
				label: __( 'Title', 'blablablocks-popup' ),
				enableGlobalSearch: true,
				render: ( { item } ) => {
					const title =
						item.title || __( '(no title)', 'blablablocks-popup' );

					return item.status === 'trash' ? (
						<Text
							className="blablablocks-popup-title-link"
							as="span"
						>
							{ title }
						</Text>
					) : (
						<Button
							className="blablablocks-popup-title-link"
							variant="link"
							href={ item.editUrl }
						>
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
				elements: Object.entries( config.statuses || {} ).map(
					( [ value, label ] ) => ( { value, label } )
				),
				filterBy: { operators: [ 'isAny', 'isNone' ] },
				render: StatusBadge,
			},
			{
				id: 'authorName',
				type: 'text',
				label: __( 'Author', 'blablablocks-popup' ),
				enableGlobalSearch: true,
				elements: authors,
				render: AuthorCell,
			},
			{
				id: 'triggersSummary',
				type: 'text',
				label: __( 'Triggers', 'blablablocks-popup' ),
				enableGlobalSearch: true,
			},
			{
				id: 'conditionsSummary',
				type: 'text',
				label: __( 'Conditions', 'blablablocks-popup' ),
				enableGlobalSearch: true,
			},
			{
				id: 'devicesSummary',
				type: 'text',
				label: __( 'Devices', 'blablablocks-popup' ),
				enableGlobalSearch: true,
			},
			{
				id: 'date',
				type: 'datetime',
				label: __( 'Date', 'blablablocks-popup' ),
				getValue: ( { item } ) =>
					item.status === 'publish' ? item.date : item.modified,
				render: DateCell,
			},
		];
	}, [ visiblePopups ] );

	const actions = useMemo(
		() => [
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
				label: __( 'Settings', 'blablablocks-popup' ),
				supportsBulk: false,
				isEligible: ( item ) => item.status !== 'trash',
				callback: ( items ) => {
					setModalPopup(
						Array.isArray( items ) ? items[ 0 ] : items
					);
				},
			},
			{
				id: 'duplicate',
				label: __( 'Duplicate', 'blablablocks-popup' ),
				supportsBulk: false,
				isEligible: ( item ) => item.status !== 'trash',
				callback: ( items ) =>
					setConfirmAction( {
						type: 'duplicate',
						items: [ Array.isArray( items ) ? items[ 0 ] : items ],
					} ),
			},
			{
				id: 'trash',
				label: __( 'Trash', 'blablablocks-popup' ),
				supportsBulk: true,
				isEligible: ( item ) => item.status !== 'trash',
				callback: ( items ) =>
					setConfirmAction( {
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
						setError(
							apiError?.message ||
								__(
									'The action could not be completed.',
									'blablablocks-popup'
								)
						);
					}
				},
			},
			{
				id: 'delete',
				label: __( 'Permanently delete', 'blablablocks-popup' ),
				supportsBulk: true,
				isEligible: ( item ) => item.status === 'trash',
				callback: ( items ) =>
					setConfirmAction( {
						type: 'delete',
						items: Array.isArray( items ) ? items : [ items ],
					} ),
			},
		],
		[ restorePopups ]
	);

	const processedPopups = useMemo(
		() => filterSortAndPaginate( visiblePopups, view, fields ),
		[ visiblePopups, view, fields ]
	);
	const hasActivePopups = useMemo(
		() => popups.some( ( popup ) => popup.status !== 'trash' ),
		[ popups ]
	);
	const shouldShowDataViews = popups.length > 0 || hasStatusFilter;
	let confirmButtonText = __( 'Duplicate', 'blablablocks-popup' );

	if ( confirmAction?.type === 'trash' ) {
		confirmButtonText = __( 'Trash', 'blablablocks-popup' );
	} else if ( confirmAction?.type === 'delete' ) {
		confirmButtonText = __( 'Delete permanently', 'blablablocks-popup' );
	}
	const confirmMessage = useMemo( () => {
		if ( ! confirmAction ) {
			return '';
		}

		if ( confirmAction.type === 'trash' ) {
			return confirmAction.items.length === 1
				? sprintf(
						/* translators: %s: Popup title. */
						__(
							'Are you sure you want to move "%s" to the trash?',
							'blablablocks-popup'
						),
						confirmAction.items[ 0 ]?.title ||
							__( '(no title)', 'blablablocks-popup' )
				  )
				: sprintf(
						/* translators: %d: Number of popups to move to Trash. */
						__(
							'Are you sure you want to move %d popups to the trash?',
							'blablablocks-popup'
						),
						confirmAction.items.length
				  );
		}

		if ( confirmAction.type === 'delete' ) {
			return confirmAction.items.length === 1
				? sprintf(
						/* translators: %s: Popup title. */
						__(
							'Are you sure you want to permanently delete "%s"? This cannot be undone.',
							'blablablocks-popup'
						),
						confirmAction.items[ 0 ]?.title ||
							__( '(no title)', 'blablablocks-popup' )
				  )
				: sprintf(
						/* translators: %d: Number of popups to permanently delete. */
						__(
							'Are you sure you want to permanently delete %d popups? This cannot be undone.',
							'blablablocks-popup'
						),
						confirmAction.items.length
				  );
		}

		return sprintf(
			/* translators: %s: Popup title. */
			__(
				'Are you sure you want to duplicate "%s"?',
				'blablablocks-popup'
			),
			confirmAction.items[ 0 ]?.title ||
				__( '(no title)', 'blablablocks-popup' )
		);
	}, [ confirmAction ] );

	return (
		<View className="blablablocks-popup-admin">
			<Flex className="blablablocks-popup-admin__header" align="center">
				<FlexBlock>
					<Heading level={ 1 }>{ ADMIN_APP_TITLE }</Heading>
				</FlexBlock>
				{ hasActivePopups && (
					<FlexItem>
						<Button
							variant="primary"
							onClick={ () => setIsCreating( true ) }
						>
							{ __( 'Add Popup', 'blablablocks-popup' ) }
						</Button>
					</FlexItem>
				) }
			</Flex>

			{ error && (
				<Notice status="error" isDismissible={ false }>
					{ error }
				</Notice>
			) }
			{ isLoading && (
				<View className="blablablocks-popup-admin__loading">
					<Spinner />
				</View>
			) }
			{ ! isLoading && ! error && ! shouldShowDataViews && (
				<EmptyPopupsState onCreate={ () => setIsCreating( true ) } />
			) }
			{ ! isLoading && ! error && shouldShowDataViews && (
				<DataViews
					data={ processedPopups.data }
					fields={ fields }
					view={ view }
					onChangeView={ setView }
					defaultLayouts={ {
						table: {},
						grid: {
							badgeFields: [ 'status', 'devicesSummary' ],
							density: 'balanced',
						},
						list: { density: 'comfortable' },
					} }
					actions={ actions }
					paginationInfo={ processedPopups.paginationInfo }
					search
				/>
			) }

			{ isCreating && (
				<CreatePopupModal
					onClose={ () => setIsCreating( false ) }
					onSaved={ ( popup ) => {
						if ( popup?.editUrl ) {
							rememberVariationPost( popup.id );
							window.location.href = getVariationEditUrl(
								popup.editUrl
							);
							return;
						}

						setPopups( ( current ) => [ popup, ...current ] );
						setIsCreating( false );
						addSnackbar(
							__( 'Popup created.', 'blablablocks-popup' )
						);
					} }
				/>
			) }

			{ modalPopup && (
				<SettingsModal
					popup={ modalPopup }
					onClose={ () => setModalPopup( null ) }
					onSaved={ ( popup ) => {
						setPopups( ( current ) =>
							current.map( ( item ) =>
								item.id === popup.id ? popup : item
							)
						);
						setModalPopup( popup );
						addSnackbar(
							__( 'Popup settings saved.', 'blablablocks-popup' )
						);
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
