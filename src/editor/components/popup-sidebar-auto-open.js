/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	SIDEBAR_ELEMENT_ID,
	SIDEBAR_IDENTIFIER,
} from '../config/constants';

/**
 * Focus the selected popup inspector tab when no modal owns focus.
 */
const focusPopupSidebar = () => {
	if (
		window.document.querySelector(
			'.blablablocks-popup-variation-modal'
		)
	) {
		return false;
	}

	const selectedTab = window.document
		.getElementById(SIDEBAR_ELEMENT_ID)
		?.querySelector(
			'.blablablocks-popup-editor-inspector-tab[aria-selected="true"]'
		);

	return !!selectedTab;
};

/**
 * Open the popup sidebar when the editor loads and move focus into it.
 */
export function PopupSidebarAutoOpen() {
	const isEditorReady = useSelect(
		(select) =>
			select('core/editor').__unstableIsEditorReady(),
		[]
	);
	const isSidebarActive = useSelect(
		(select) =>
			select('core/interface').getActiveComplementaryArea('core') ===
			SIDEBAR_IDENTIFIER,
		[]
	);
	const { openGeneralSidebar } = useDispatch('core/edit-post');
	const hasOpenedSidebar = useRef(false);

	useEffect(() => {
		if (!isEditorReady || hasOpenedSidebar.current) {
			return undefined;
		}

		let frameId = window.requestAnimationFrame(() => {
			frameId = window.requestAnimationFrame(() => {
				openGeneralSidebar(SIDEBAR_IDENTIFIER);
				hasOpenedSidebar.current = true;
			});
		});

		return () => window.cancelAnimationFrame(frameId);
	}, [isEditorReady, openGeneralSidebar]);

	useEffect(() => {
		if (!isSidebarActive) {
			return undefined;
		}

		let frameId = 0;
		const observer = new window.MutationObserver(() => {
			window.cancelAnimationFrame(frameId);
			frameId = window.requestAnimationFrame(() => {
				if (focusPopupSidebar()) {
					observer.disconnect();
				}
			});
		});

		observer.observe(window.document.body, {
			childList: true,
			subtree: true,
		});
		frameId = window.requestAnimationFrame(() => {
			if (focusPopupSidebar()) {
				observer.disconnect();
			}
		});

		return () => {
			observer.disconnect();
			window.cancelAnimationFrame(frameId);
		};
	}, [isSidebarActive]);

	return null;
}
