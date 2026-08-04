/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';

import {
	Flex,
	FormTokenField,
	SelectControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
	__experimentalText as Text,
	__experimentalView as View,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	cleanTokens,
	fromCsv,
	numericTokenFieldIds,
	settingsFields,
	toCsv,
	tokenFieldIds,
	tokenFieldSuggestions,
} from '../config/settings';
import { normalizeAnimationDuration } from '../../shared/animation';

const singularEndpoints = {
	post: '/wp/v2/posts',
	page: '/wp/v2/pages',
};

const archiveSources = [
	{
		taxonomy: 'category',
		label: __( 'Category', 'blablablocks-popup' ),
		endpoint: '/wp/v2/categories',
	},
	{
		taxonomy: 'post_tag',
		label: __( 'Tag', 'blablablocks-popup' ),
		endpoint: '/wp/v2/tags',
	},
];

const normalizeTokenIds = ( value ) => fromCsv( value, true ).map( String );

const normalizeArchiveTokens = ( value ) => fromCsv( value ).map( String );

const archiveTokenId = ( token ) => {
	const match = String( token ).match( /(?:^|:)(\d+)$/ );

	return match ? match[ 1 ] : '';
};

const itemTitle = ( item ) => item.title?.rendered || item.name || '';

const itemLabel = ( item, prefix = '' ) => {
	const label = itemTitle( item ) || `#${ item.id }`;
	return prefix ? `${ label } (${ prefix })` : label;
};

const isFieldDisabled = ( field, data ) =>
	typeof field.isDisabled === 'function'
		? field.isDisabled( { item: data, field } )
		: false;

const fetchSuggestions = async ( endpoint, search = '', ids = [] ) => {
	const query = new URLSearchParams( {
		per_page: '20',
		_fields: 'id,title,name',
	} );

	if ( ids.length ) {
		query.set( 'include', ids.join( ',' ) );
	} else if ( search ) {
		query.set( 'search', search );
	}

	return apiFetch( { path: `${ endpoint }?${ query.toString() }` } );
};

const setTokenFieldValue = ( data, field, value, onChange ) => {
	onChange(
		field.setValue( { item: data, value: toCsv( cleanTokens( value ) ) } )
	);
};

/**
 * Toggle renderer for boolean DataForm fields.
 * @param {Object}   root0          Component properties.
 * @param {Object}   root0.data     DataForm record.
 * @param {Object}   root0.field    DataForm field.
 * @param {Function} root0.onChange Change callback.
 */
function ToggleField( { data, field, onChange } ) {
	const checked = !! field.getValue( { item: data } );

	return (
		<ToggleControl
			__nextHasNoMarginBottom
			className="blablablocks-popup-toggle-control"
			label={ field.label }
			help={ field.description }
			checked={ checked }
			disabled={ isFieldDisabled( field, data ) }
			onChange={ ( value ) =>
				onChange( field.setValue( { item: data, value: !! value } ) )
			}
		/>
	);
}

/**
 * Token renderer for comma-separated DataForm fields.
 * @param {Object}   root0          Component properties.
 * @param {Object}   root0.data     DataForm record.
 * @param {Object}   root0.field    DataForm field.
 * @param {Function} root0.onChange Change callback.
 */
function TokenField( { data, field, onChange } ) {
	const tokens = fromCsv( field.getValue( { item: data } ) );
	const isNumeric = numericTokenFieldIds.includes( field.id );

	return (
		<Flex
			className="blablablocks-popup-token-field"
			direction="column"
			gap={ 2 }
			expanded={ false }
		>
			<FormTokenField
				__next40pxDefaultSize
				label={ field.label }
				placeholder={ field.placeholder }
				value={ tokens }
				suggestions={ tokenFieldSuggestions[ field.id ] || [] }
				disabled={ isFieldDisabled( field, data ) }
				tokenizeOnBlur
				__experimentalExpandOnFocus={
					!! tokenFieldSuggestions[ field.id ]
				}
				__experimentalValidateInput={ ( value ) =>
					! isNumeric || /^\d+$/.test( value.trim() )
				}
				saveTransform={ ( value ) => value.trim() }
				onChange={ ( value ) =>
					setTokenFieldValue( data, field, value, onChange )
				}
			/>
			{ field.description && (
				<Text as="p" className="blablablocks-popup-token-field__help">
					{ field.description }
				</Text>
			) }
		</Flex>
	);
}

function SingularTypeSelect( { data, onChange } ) {
	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'Type', 'blablablocks-popup' ) }
			value={ data.includeSingularType || 'post' }
			options={ [
				{ value: 'post', label: __( 'Post', 'blablablocks-popup' ) },
				{ value: 'page', label: __( 'Page', 'blablablocks-popup' ) },
			] }
			onChange={ ( value ) =>
				onChange( {
					includeSingularType: value,
					includeSingularIds: '',
				} )
			}
		/>
	);
}

/**
 * Token field backed by posts or pages based on the selected singular type.
 * @param {Object}   root0          Component properties.
 * @param {Object}   root0.data     DataForm record.
 * @param {Object}   root0.field    DataForm field.
 * @param {Function} root0.onChange Change callback.
 */
function SingularValuesField( { data, field, onChange } ) {
	const endpoint =
		singularEndpoints[ data.includeSingularType || 'post' ] ||
		singularEndpoints.post;
	const [ suggestions, setSuggestions ] = useState( [] );
	const [ labels, setLabels ] = useState( {} );
	const tokens = normalizeTokenIds( field.getValue( { item: data } ) );
	const tokenKey = tokens.join( ',' );

	const updateOptions = useCallback(
		async ( search = '', ids = [] ) => {
			try {
				const items = await fetchSuggestions( endpoint, search, ids );
				const nextLabels = Object.fromEntries(
					items.map( ( item ) => [
						String( item.id ),
						itemLabel( item ),
					] )
				);

				setLabels( ( current ) => ( { ...current, ...nextLabels } ) );
				setSuggestions( items.map( ( item ) => String( item.id ) ) );
			} catch {
				setSuggestions( [] );
			}
		},
		[ endpoint ]
	);

	useEffect( () => {
		updateOptions( '', tokenKey ? tokenKey.split( ',' ) : [] );
	}, [ tokenKey, updateOptions ] );

	return (
		<Flex
			className="blablablocks-popup-condition-singular-row"
			direction="row"
			gap={ 3 }
			align="flex-start"
			expanded={ false }
		>
			<View className="blablablocks-popup-condition-singular-row__type">
				<SingularTypeSelect data={ data } onChange={ onChange } />
			</View>
			<View className="blablablocks-popup-condition-singular-row__values">
				<FormTokenField
					__next40pxDefaultSize
					label={ field.label }
					placeholder={ field.placeholder }
					value={ tokens }
					suggestions={ suggestions }
					displayTransform={ ( token ) => labels[ token ] || token }
					__experimentalRenderItem={ ( { item } ) =>
						labels[ item ] || item
					}
					__experimentalExpandOnFocus
					__experimentalValidateInput={ ( value ) =>
						/^\d+$/.test( value.trim() )
					}
					onInputChange={ ( value ) => updateOptions( value ) }
					onChange={ ( value ) =>
						setTokenFieldValue( data, field, value, onChange )
					}
				/>
			</View>
		</Flex>
	);
}

/**
 * Token field backed by category and tag archives.
 * @param {Object}   root0          Component properties.
 * @param {Object}   root0.data     DataForm record.
 * @param {Object}   root0.field    DataForm field.
 * @param {Function} root0.onChange Change callback.
 */
function ArchiveValuesField( { data, field, onChange } ) {
	const [ suggestions, setSuggestions ] = useState( [] );
	const [ labels, setLabels ] = useState( {} );
	const tokens = normalizeArchiveTokens( field.getValue( { item: data } ) );
	const tokenKey = tokens.join( ',' );

	const updateOptions = useCallback( async ( search = '', ids = [] ) => {
		try {
			const groups = await Promise.all(
				archiveSources.map( ( source ) =>
					fetchSuggestions(
						source.endpoint,
						search,
						ids.map( archiveTokenId ).filter( Boolean )
					)
				)
			);
			const items = groups.flatMap( ( group, index ) =>
				group.map( ( item ) => ( {
					...item,
					label: archiveSources[ index ].label,
					token: `${ archiveSources[ index ].taxonomy }:${ item.id }`,
				} ) )
			);
			const nextLabels = Object.fromEntries(
				items.map( ( item ) => [
					item.token,
					itemLabel( item, item.label ),
				] )
			);

			ids.forEach( ( token ) => {
				if ( /^\d+$/.test( token ) && ! nextLabels[ token ] ) {
					nextLabels[ token ] = `${ token } (${ __(
						'Legacy category or tag',
						'blablablocks-popup'
					) })`;
				}
			} );

			setLabels( ( current ) => ( { ...current, ...nextLabels } ) );
			setSuggestions( items.map( ( item ) => item.token ) );
		} catch {
			setSuggestions( [] );
		}
	}, [] );

	useEffect( () => {
		updateOptions( '', tokenKey ? tokenKey.split( ',' ) : [] );
	}, [ tokenKey, updateOptions ] );

	const displayLabels = useMemo( () => labels, [ labels ] );

	return (
		<FormTokenField
			__next40pxDefaultSize
			label={ field.label }
			placeholder={ field.placeholder }
			value={ tokens }
			suggestions={ suggestions }
			displayTransform={ ( token ) => displayLabels[ token ] || token }
			__experimentalRenderItem={ ( { item } ) =>
				displayLabels[ item ] || item
			}
			__experimentalExpandOnFocus
			__experimentalValidateInput={ ( value ) =>
				/^(?:category|post_tag):\d+$/.test( value.trim() ) ||
				/^\d+$/.test( value.trim() )
			}
			onInputChange={ ( value ) => updateOptions( value ) }
			onChange={ ( value ) =>
				setTokenFieldValue( data, field, value, onChange )
			}
		/>
	);
}

/**
 * Decimal seconds renderer for animation duration.
 * @param {Object}   root0          Component properties.
 * @param {Object}   root0.data     DataForm record.
 * @param {Object}   root0.field    DataForm field.
 * @param {Function} root0.onChange Change callback.
 */
function AnimationDurationField( { data, field, onChange } ) {
	const value = normalizeAnimationDuration(
		field.getValue( { item: data } )
	);

	return (
		<NumberControl
			__next40pxDefaultSize
			label={ field.label }
			help={ field.description }
			min={ 0 }
			step={ 0.1 }
			value={ value }
			disabled={ isFieldDisabled( field, data ) }
			onChange={ ( nextValue ) =>
				onChange(
					field.setValue( {
						item: data,
						value: normalizeAnimationDuration( nextValue, 0 ),
					} )
				)
			}
		/>
	);
}

/**
 * DataForm fields enhanced with WordPress component renderers.
 */
export const popupSettingsFields = settingsFields
	.filter( ( field ) => field.id !== 'title' )
	.map( ( field ) => {
		if ( field.type === 'boolean' ) {
			return { ...field, Edit: ToggleField };
		}

		if ( field.id === 'includeSingularIds' ) {
			return { ...field, Edit: SingularValuesField };
		}

		if ( field.id === 'includeArchiveIds' ) {
			return { ...field, Edit: ArchiveValuesField };
		}

		if ( tokenFieldIds.includes( field.id ) ) {
			return { ...field, Edit: TokenField };
		}

		if ( field.id === 'animationDuration' ) {
			return { ...field, Edit: AnimationDurationField };
		}

		return field;
	} );
