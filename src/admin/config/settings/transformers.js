/**
 * Internal dependencies
 */
import { normalizeAnimationDuration } from '../../../shared/animation';
import { mergePopupSettings } from '../../../shared/settings';
import { defaults } from './defaults';
import { fromCsv, toCsv } from './tokens';

/**
 * Flatten grouped popup settings into DataForm's single-record shape.
 *
 * The settings modal only edits behavior tabs now, but style fields remain in
 * this mapping so saving the modal preserves existing design values.
 *
 * @param {Object} settings Grouped popup settings.
 * @return {Object} Flat settings.
 */
export const flattenSettings = ( settings = defaults ) => {
	const merged = mergePopupSettings( defaults, settings );

	return {
		width: merged.layout.width,
		height: merged.layout.height,
		horizontal: merged.layout.horizontal,
		vertical: merged.layout.vertical,
		overlay: merged.layout.overlay,
		closeButton: merged.layout.closeButton,
		entranceAnimation: merged.layout.entranceAnimation,
		exitAnimation: merged.layout.exitAnimation,
		animationDuration: normalizeAnimationDuration(
			merged.layout.animationDuration
		),
		popupBackground: merged.style.popupBackground,
		overlayBackground: merged.style.overlayBackground,
		border: merged.style.border,
		borderType: merged.style.borderType,
		borderColor: merged.style.borderColor,
		borderWidth: merged.style.borderWidth,
		borderRadius: merged.style.borderRadius,
		boxShadow: merged.style.boxShadow,
		closeColor: merged.style.closeColor,
		closeBackground: merged.style.closeBackground,
		closeSize: merged.style.closeSize,
		margin: merged.style.margin,
		padding: merged.style.padding,
		customClass: merged.style.customClass,
		closeDelay: merged.advanced.closeDelay,
		autoClose: merged.advanced.autoClose,
		preventOverlayClose: merged.advanced.preventOverlayClose,
		preventEscClose: merged.advanced.preventEscClose,
		disableScroll: merged.advanced.disableScroll,
		avoidMultiple: merged.advanced.avoidMultiple,
		openSelectors: merged.advanced.openSelectors,
		includeEntireSite: merged.conditions.includeEntireSite,
		includeFrontPage: merged.conditions.includeFrontPage,
		includeSingular: merged.conditions.includeSingular,
		includeSingularType: merged.conditions.includeSingularType,
		includeSingularIds: toCsv( merged.conditions.includeSingularIds ),
		includeArchives: merged.conditions.includeArchives,
		includeArchiveIds: toCsv( merged.conditions.includeArchiveIds ),
		includeIds: toCsv( merged.conditions.includeIds ),
		excludeFrontPage: merged.conditions.excludeFrontPage,
		excludeIds: toCsv( merged.conditions.excludeIds ),
		pageLoad: merged.triggers.pageLoad,
		pageLoadDelay: merged.triggers.pageLoadDelay,
		scroll: merged.triggers.scroll,
		scrollDirection: merged.triggers.scrollDirection,
		scrollAmount: merged.triggers.scrollAmount,
		scrollElement: merged.triggers.scrollElement,
		scrollSelector: merged.triggers.scrollSelector,
		click: merged.triggers.click,
		clickCount: merged.triggers.clickCount,
		inactivity: merged.triggers.inactivity,
		inactivitySeconds: merged.triggers.inactivitySeconds,
		exitIntent: merged.triggers.exitIntent,
		pageViews: merged.rules.pageViews,
		pageViewsCount: merged.rules.pageViewsCount,
		sessions: merged.rules.sessions,
		sessionsCount: merged.rules.sessionsCount,
		maxDisplays: merged.rules.maxDisplays,
		maxDisplaysCount: merged.rules.maxDisplaysCount,
		countMode: merged.rules.countMode,
		referrerUrl: merged.rules.referrerUrl,
		referrerMode: merged.rules.referrerMode,
		referrerPattern: merged.rules.referrerPattern,
		referrerRegex: merged.rules.referrerRegex,
		arrivingFrom: toCsv( merged.rules.arrivingFrom ),
		hideLoggedIn: merged.rules.hideLoggedIn,
		hideRoles: toCsv( merged.rules.hideRoles ),
		devices: toCsv( merged.rules.devices ),
	};
};

/**
 * Restore the grouped settings model consumed by PHP and frontend runtime.
 *
 * @param {Object} data Flat DataForm data.
 * @return {Object} Grouped popup settings.
 */
export const unflattenSettings = ( data ) => ( {
	layout: {
		width: data.width,
		height: data.height,
		horizontal: data.horizontal,
		vertical: data.vertical,
		overlay: !! data.overlay,
		closeButton: !! data.closeButton,
		entranceAnimation: data.entranceAnimation,
		exitAnimation: data.exitAnimation,
		animationDuration: normalizeAnimationDuration( data.animationDuration ),
	},
	style: {
		popupBackground: data.popupBackground,
		overlayBackground: data.overlayBackground,
		border: data.border,
		borderType: data.borderType,
		borderColor: data.borderColor,
		borderWidth: data.borderWidth,
		borderRadius: data.borderRadius,
		boxShadow: data.boxShadow,
		closeColor: data.closeColor,
		closeBackground: data.closeBackground,
		closeSize: Number( data.closeSize ) || 0,
		margin: data.margin,
		padding: data.padding,
		customClass: data.customClass,
	},
	advanced: {
		closeDelay: Number( data.closeDelay ) || 0,
		autoClose: Number( data.autoClose ) || 0,
		preventOverlayClose: !! data.preventOverlayClose,
		preventEscClose: !! data.preventEscClose,
		disableScroll: !! data.disableScroll,
		avoidMultiple: !! data.avoidMultiple,
		openSelectors: data.openSelectors,
	},
	conditions: {
		includeEntireSite: !! data.includeEntireSite,
		includeFrontPage: !! data.includeFrontPage,
		includeSingular: !! data.includeSingular,
		includeSingularType: data.includeSingularType || 'post',
		includeSingularIds: fromCsv( data.includeSingularIds, true ),
		includeArchives: !! data.includeArchives,
		includeArchiveIds: fromCsv( data.includeArchiveIds ),
		includeIds: fromCsv( data.includeIds, true ),
		excludeFrontPage: false,
		excludeIds: fromCsv( data.excludeIds, true ),
	},
	triggers: {
		pageLoad: !! data.pageLoad,
		pageLoadDelay: Number( data.pageLoadDelay ) || 0,
		scroll: !! data.scroll,
		scrollDirection: data.scrollDirection,
		scrollAmount: Number( data.scrollAmount ) || 0,
		scrollElement: !! data.scrollElement,
		scrollSelector: data.scrollSelector,
		click: !! data.click,
		clickCount: Number( data.clickCount ) || 0,
		inactivity: !! data.inactivity,
		inactivitySeconds: Number( data.inactivitySeconds ) || 0,
		exitIntent: !! data.exitIntent,
	},
	rules: {
		pageViews: !! data.pageViews,
		pageViewsCount: Number( data.pageViewsCount ) || 0,
		sessions: !! data.sessions,
		sessionsCount: Number( data.sessionsCount ) || 0,
		maxDisplays: !! data.maxDisplays,
		maxDisplaysCount: Number( data.maxDisplaysCount ) || 0,
		countMode: data.countMode,
		referrerUrl: !! data.referrerUrl,
		referrerMode: data.referrerMode,
		referrerPattern: data.referrerPattern,
		referrerRegex: !! data.referrerRegex,
		arrivingFrom: fromCsv( data.arrivingFrom ),
		hideLoggedIn: !! data.hideLoggedIn,
		hideRoles: fromCsv( data.hideRoles ),
		devices: fromCsv( data.devices ),
	},
} );
