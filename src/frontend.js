/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { store as viewportStore } from '@wordpress/viewport';

/**
 * Internal dependencies
 */
import './frontend/styles.scss';
import { VIEWPORT_BRIDGE_GLOBAL } from './frontend/config/constants';

const { isViewportMatch } = select( viewportStore );

/**
 * Expose the classic viewport selector to the Interactivity script module.
 *
 * WordPress classic script packages cannot currently be imported directly by
 * a script module.
 */
window[ VIEWPORT_BRIDGE_GLOBAL ] = { isViewportMatch };
