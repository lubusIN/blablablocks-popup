/**
 * WordPress dependencies
 */
import { drafts, notAllowed, pending, published, scheduled, trash } from '@wordpress/icons';

/**
 * WordPress-provided globals for the admin app.
 *
 * PHP injects this object before the admin bundle is loaded. Keeping it in one
 * module makes the rest of the app easier to test and prevents direct reads
 * from `window` throughout the codebase.
 */
export const config = window.BlaBlaBlocksPopupAdmin || {};

/**
 * DataViews status icons keyed by WordPress post status.
 */
export const statusIcons = {
	draft: drafts,
	pending,
	publish: published,
	future: scheduled,
	private: notAllowed,
	trash,
};
