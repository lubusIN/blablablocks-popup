/**
 * Admin app constants.
 */
export const ADMIN_ROOT_ID = 'blablablocks-popup-admin';
export const ADMIN_APP_TITLE = 'BlaBlaBlocks Popup';
export const REST_POPUPS_PATH = '/blablablocks-popup/v1/popups';
export const REST_SAMPLE_POPUPS_PATH = `${ REST_POPUPS_PATH }/samples`;
export const SNACKBAR_ID_PREFIX = 'blablablocks-popup-snackbar';
export {
	VARIATION_QUERY_PARAM,
	VARIATION_SESSION_KEY,
} from '../../shared/variation';

export const DEFAULT_VIEW = {
	type: 'table',
	page: 1,
	perPage: 10,
	search: '',
	sort: { field: 'date', direction: 'desc' },
	fields: [
		'title',
		'status',
		'authorName',
		'triggersSummary',
		'conditionsSummary',
		'date',
	],
};
