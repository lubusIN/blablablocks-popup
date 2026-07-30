/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Stack } from '@wordpress/ui';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useMemo, useState } from '@wordpress/element';

import {
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

const archiveEndpoints = ['/wp/v2/categories', '/wp/v2/tags'];

const normalizeTokenIds = (value) => fromCsv(value, true).map(String);

const itemTitle = (item) => item.title?.rendered || item.name || '';

const itemLabel = (item, prefix = '') => {
	const label = itemTitle(item) || `#${item.id}`;
	return prefix ? `${label} (${prefix})` : label;
};

const fetchSuggestions = async (endpoint, search = '', ids = []) => {
	const query = new URLSearchParams({
		per_page: '20',
		_fields: 'id,title,name',
	});

	if (ids.length) {
		query.set('include', ids.join(','));
	} else if (search) {
		query.set('search', search);
	}

	return apiFetch({ path: `${endpoint}?${query.toString()}` });
};

const setTokenFieldValue = (data, field, value, onChange) => {
	onChange(field.setValue({ item: data, value: toCsv(cleanTokens(value)) }));
};

/**
 * Toggle renderer for boolean DataForm fields.
 */
function ToggleField({ data, field, onChange }) {
	const checked = !!field.getValue({ item: data });

	return (
		<ToggleControl
			__nextHasNoMarginBottom
			aria-label={field.label}
			label=""
			help={field.description}
			checked={checked}
			disabled={field.isDisabled({ item: data, field })}
			onChange={(value) => onChange(field.setValue({ item: data, value: !!value }))}
		/>
	);
}

/**
 * Token renderer for comma-separated DataForm fields.
 */
function TokenField({ data, field, onChange }) {
	const tokens = fromCsv(field.getValue({ item: data }));
	const isNumeric = numericTokenFieldIds.includes(field.id);

	return (
		<Stack className="blablablocks-popup-token-field" direction="column" gap="sm">
			<FormTokenField
				__next40pxDefaultSize
				label={field.label}
				placeholder={field.placeholder}
				value={tokens}
				suggestions={tokenFieldSuggestions[field.id] || []}
				disabled={field.isDisabled({ item: data, field })}
				tokenizeOnBlur
				__experimentalExpandOnFocus={!!tokenFieldSuggestions[field.id]}
				__experimentalValidateInput={(value) => !isNumeric || /^\d+$/.test(value.trim())}
				saveTransform={(value) => value.trim()}
				onChange={(value) => setTokenFieldValue(data, field, value, onChange)}
			/>
			{field.description && <Text as="p" className="blablablocks-popup-token-field__help">{field.description}</Text>}
		</Stack>
	);
}

function SingularTypeSelect({ data, onChange }) {
	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Type', 'blablablocks-popup')}
			value={data.includeSingularType || 'post'}
			options={[
				{ value: 'post', label: __('Post', 'blablablocks-popup') },
				{ value: 'page', label: __('Page', 'blablablocks-popup') },
			]}
			onChange={(value) => onChange({
				includeSingularType: value,
				includeSingularIds: '',
			})}
		/>
	);
}

/**
 * Token field backed by posts or pages based on the selected singular type.
 */
function SingularValuesField({ data, field, onChange }) {
	const endpoint = singularEndpoints[data.includeSingularType || 'post'] || singularEndpoints.post;
	const [suggestions, setSuggestions] = useState([]);
	const [labels, setLabels] = useState({});
	const tokens = normalizeTokenIds(field.getValue({ item: data }));

	const updateOptions = async (search = '', ids = []) => {
		const items = await fetchSuggestions(endpoint, search, ids);
		const nextLabels = Object.fromEntries(items.map((item) => [String(item.id), itemLabel(item)]));

		setLabels((current) => ({ ...current, ...nextLabels }));
		setSuggestions(items.map((item) => String(item.id)));
	};

	useEffect(() => {
		updateOptions('', tokens);
	}, [endpoint, field.id, field.getValue({ item: data })]);

	return (
		<Stack className="blablablocks-popup-condition-singular-row" direction="row" gap="md" align="top">
			<View className="blablablocks-popup-condition-singular-row__type">
				<SingularTypeSelect data={data} onChange={onChange} />
			</View>
			<View className="blablablocks-popup-condition-singular-row__values">
				<FormTokenField
					__next40pxDefaultSize
					label={field.label}
					placeholder={field.placeholder}
					value={tokens}
					suggestions={suggestions}
					displayTransform={(token) => labels[token] || token}
					__experimentalRenderItem={({ item }) => labels[item] || item}
					__experimentalExpandOnFocus
					__experimentalValidateInput={(value) => /^\d+$/.test(value.trim())}
					onInputChange={(value) => updateOptions(value)}
					onChange={(value) => setTokenFieldValue(data, field, value, onChange)}
				/>
			</View>
		</Stack>
	);
}

/**
 * Token field backed by category and tag archives.
 */
function ArchiveValuesField({ data, field, onChange }) {
	const [suggestions, setSuggestions] = useState([]);
	const [labels, setLabels] = useState({});
	const tokens = normalizeTokenIds(field.getValue({ item: data }));

	const updateOptions = async (search = '', ids = []) => {
		const groups = await Promise.all(
			archiveEndpoints.map((endpoint) => fetchSuggestions(endpoint, search, ids))
		);
		const items = groups.flatMap((group, index) => (
			group.map((item) => ({ ...item, source: 0 === index ? 'Category' : 'Tag' }))
		));
		const nextLabels = Object.fromEntries(items.map((item) => [String(item.id), itemLabel(item, item.source)]));

		setLabels((current) => ({ ...current, ...nextLabels }));
		setSuggestions(items.map((item) => String(item.id)));
	};

	useEffect(() => {
		updateOptions('', tokens);
	}, [field.id, field.getValue({ item: data })]);

	const displayLabels = useMemo(() => labels, [labels]);

	return (
		<FormTokenField
			__next40pxDefaultSize
			label={field.label}
			placeholder={field.placeholder}
			value={tokens}
			suggestions={suggestions}
			displayTransform={(token) => displayLabels[token] || token}
			__experimentalRenderItem={({ item }) => displayLabels[item] || item}
			__experimentalExpandOnFocus
			__experimentalValidateInput={(value) => /^\d+$/.test(value.trim())}
			onInputChange={(value) => updateOptions(value)}
			onChange={(value) => setTokenFieldValue(data, field, value, onChange)}
		/>
	);
}

/**
 * Decimal seconds renderer for animation duration.
 */
function AnimationDurationField({ data, field, onChange }) {
	const value = normalizeAnimationDuration(field.getValue({ item: data }));

	return (
		<NumberControl
			__next40pxDefaultSize
			label={field.label}
			help={field.description}
			min={0}
			step={0.1}
			value={value}
			disabled={field.isDisabled({ item: data, field })}
			onChange={(nextValue) => onChange(field.setValue({ item: data, value: normalizeAnimationDuration(nextValue, 0) }))}
		/>
	);
}

/**
 * DataForm fields enhanced with WordPress component renderers.
 */
export const popupSettingsFields = settingsFields
	.filter((field) => field.id !== 'title')
	.map((field) => {
		if (field.type === 'boolean') {
			return { ...field, Edit: ToggleField };
		}

		if (field.id === 'includeSingularIds') {
			return { ...field, Edit: SingularValuesField };
		}

		if (field.id === 'includeArchiveIds') {
			return { ...field, Edit: ArchiveValuesField };
		}

		if (tokenFieldIds.includes(field.id)) {
			return { ...field, Edit: TokenField };
		}

		if (field.id === 'animationDuration') {
			return { ...field, Edit: AnimationDurationField };
		}

		return field;
	});
