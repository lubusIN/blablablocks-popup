import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "./src/frontend/config/constants.js"
/*!******************************************!*\
  !*** ./src/frontend/config/constants.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CLASS_CLOSING: () => (/* binding */ CLASS_CLOSING),
/* harmony export */   CLASS_HIDDEN: () => (/* binding */ CLASS_HIDDEN),
/* harmony export */   CLASS_OPEN: () => (/* binding */ CLASS_OPEN),
/* harmony export */   CLASS_OVERLAY: () => (/* binding */ CLASS_OVERLAY),
/* harmony export */   CLASS_SCROLL_LOCKED: () => (/* binding */ CLASS_SCROLL_LOCKED),
/* harmony export */   CSS_DURATION_VAR: () => (/* binding */ CSS_DURATION_VAR),
/* harmony export */   SELECTOR_CLOSE: () => (/* binding */ SELECTOR_CLOSE),
/* harmony export */   SELECTOR_CLOSE_BUTTON: () => (/* binding */ SELECTOR_CLOSE_BUTTON),
/* harmony export */   SELECTOR_DIALOG: () => (/* binding */ SELECTOR_DIALOG),
/* harmony export */   SELECTOR_OPEN_POPUP: () => (/* binding */ SELECTOR_OPEN_POPUP),
/* harmony export */   SELECTOR_OVERLAY: () => (/* binding */ SELECTOR_OVERLAY),
/* harmony export */   SELECTOR_POPUP: () => (/* binding */ SELECTOR_POPUP),
/* harmony export */   STATE_CLOSING: () => (/* binding */ STATE_CLOSING),
/* harmony export */   STATE_HIDDEN: () => (/* binding */ STATE_HIDDEN),
/* harmony export */   STATE_OPEN: () => (/* binding */ STATE_OPEN),
/* harmony export */   STATE_OPENING: () => (/* binding */ STATE_OPENING),
/* harmony export */   STORE_NAMESPACE: () => (/* binding */ STORE_NAMESPACE),
/* harmony export */   VIEWPORT_BRIDGE_GLOBAL: () => (/* binding */ VIEWPORT_BRIDGE_GLOBAL)
/* harmony export */ });
/**
 * Frontend runtime selectors and class names.
 */
const STORE_NAMESPACE = 'blablablocks/popup';
const VIEWPORT_BRIDGE_GLOBAL = 'blablablocksPopupViewport';
const SELECTOR_POPUP = '[data-blablablocks-popup]';
const SELECTOR_CLOSE = '[data-popup-close]';
const SELECTOR_OPEN_POPUP = '.blablablocks-popup--open';
const SELECTOR_DIALOG = '.blablablocks-popup__dialog';
const SELECTOR_OVERLAY = '.blablablocks-popup__overlay';
const SELECTOR_CLOSE_BUTTON = '.blablablocks-popup__close';
const CLASS_OPEN = 'blablablocks-popup--open';
const CLASS_HIDDEN = 'blablablocks-popup--hidden';
const CLASS_CLOSING = 'blablablocks-popup--closing';
const CLASS_SCROLL_LOCKED = 'blablablocks-popup-scroll-locked';
const CLASS_OVERLAY = 'blablablocks-popup__overlay';
const CSS_DURATION_VAR = '--blablablocks-popup-duration';
const STATE_HIDDEN = 'hidden';
const STATE_OPENING = 'opening';
const STATE_OPEN = 'open';
const STATE_CLOSING = 'closing';

/***/ },

/***/ "./src/frontend/core/apply-styles.js"
/*!*******************************************!*\
  !*** ./src/frontend/core/apply-styles.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyInlineStyles: () => (/* binding */ applyInlineStyles)
/* harmony export */ });
/* harmony import */ var _config_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/constants */ "./src/frontend/config/constants.js");
/* harmony import */ var _shared_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/animation */ "./src/shared/animation.js");
/* harmony import */ var _shared_border__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/border */ "./src/shared/border.js");
/**
 * Internal dependencies
 */




/**
 * Convert WordPress preset tokens into CSS custom property references.
 *
 * @param {*} value CSS value.
 * @return {*} Resolved CSS value.
 */
const resolveCssValue = value => {
  if (typeof value !== 'string') {
    return value;
  }
  return value.replace(/var:preset\|spacing\|([a-zA-Z0-9_-]+)/g, 'var(--wp--preset--spacing--$1)');
};
const applyBorderSide = (dialog, side, border) => {
  const property = side.charAt(0).toUpperCase() + side.slice(1);
  dialog.style[`border${property}Style`] = border?.style || 'solid';
  dialog.style[`border${property}Color`] = border?.color || '#dcdcde';
  dialog.style[`border${property}Width`] = resolveCssValue(border?.width || '1px');
};
const applyBorderStyles = (dialog, style) => {
  const border = style.border || {};
  if ((0,_shared_border__WEBPACK_IMPORTED_MODULE_2__.hasSplitBorderValue)(border)) {
    dialog.style.borderStyle = 'none';
    _shared_border__WEBPACK_IMPORTED_MODULE_2__.CSS_BOX_SIDES.forEach(side => {
      if ((0,_shared_border__WEBPACK_IMPORTED_MODULE_2__.hasFlatBorderValue)(border[side])) {
        applyBorderSide(dialog, side, border[side]);
      }
    });
    return;
  }
  if ((0,_shared_border__WEBPACK_IMPORTED_MODULE_2__.hasFlatBorderValue)(border)) {
    dialog.style.borderStyle = border.style || 'solid';
    dialog.style.borderColor = border.color || '#dcdcde';
    dialog.style.borderWidth = resolveCssValue(border.width || '1px');
    return;
  }
  dialog.style.borderStyle = style.borderType || 'none';
  dialog.style.borderColor = style.borderColor || '#dcdcde';
  dialog.style.borderWidth = style.borderType === 'none' ? '0' : resolveCssValue(style.borderWidth || '1px');
};

/**
 * Apply saved layout and style settings to a rendered popup node.
 *
 * @param {Object} popup Parsed popup runtime record.
 * @return {void}
 */
const applyInlineStyles = popup => {
  const {
    node,
    settings
  } = popup;
  const layout = settings.layout || {};
  const style = settings.style || {};
  const advanced = settings.advanced || {};
  const dialog = node.querySelector(_config_constants__WEBPACK_IMPORTED_MODULE_0__.SELECTOR_DIALOG);
  const overlay = node.querySelector(_config_constants__WEBPACK_IMPORTED_MODULE_0__.SELECTOR_OVERLAY);
  const close = node.querySelector(_config_constants__WEBPACK_IMPORTED_MODULE_0__.SELECTOR_CLOSE_BUTTON);
  node.dataset.horizontal = layout.horizontal || 'center';
  node.dataset.vertical = layout.vertical || 'center';
  node.dataset.entranceAnimation = layout.entranceAnimation || 'fade';
  node.dataset.exitAnimation = layout.exitAnimation || 'fade';
  node.style.setProperty(_config_constants__WEBPACK_IMPORTED_MODULE_0__.CSS_DURATION_VAR, `${(0,_shared_animation__WEBPACK_IMPORTED_MODULE_1__.normalizeAnimationDuration)(layout.animationDuration)}s`);
  if (dialog) {
    dialog.style.width = layout.width || '640px';
    dialog.style.height = layout.height || 'auto';
    dialog.style.background = style.popupBackground || '#fff';
    applyBorderStyles(dialog, style);
    dialog.style.borderRadius = style.borderRadius || '8px';
    dialog.style.boxShadow = style.boxShadow || 'none';
    dialog.style.margin = resolveCssValue(style.margin || '24px');
    dialog.style.padding = resolveCssValue(style.padding || '32px');
  }
  if (overlay) {
    overlay.style.display = layout.overlay ? 'block' : 'none';
    overlay.style.background = style.overlayBackground || 'rgba(0,0,0,0.55)';
  }
  if (close) {
    close.style.color = style.closeColor || '#1e1e1e';
    close.style.background = style.closeBackground || 'transparent';
    close.style.width = `${Number(style.closeSize || 28)}px`;
    close.style.height = `${Number(style.closeSize || 28)}px`;
    if (!layout.closeButton) {
      close.hidden = true;
    } else if (Number(advanced.closeDelay || 0) > 0) {
      close.hidden = true;
      window.setTimeout(() => {
        close.hidden = false;
      }, Number(advanced.closeDelay) * 1000);
    }
  }
};

/***/ },

/***/ "./src/frontend/core/rules.js"
/*!************************************!*\
  !*** ./src/frontend/core/rules.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   passesRules: () => (/* binding */ passesRules)
/* harmony export */ });
/* harmony import */ var _utils_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/storage */ "./src/frontend/utils/storage.js");
/* harmony import */ var _utils_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/browser */ "./src/frontend/utils/browser.js");
/**
 * Internal dependencies
 */


const isSearchReferrer = referrer => /(^|\.)google\.|(^|\.)bing\.|(^|\.)yahoo\.|duckduckgo\.|ecosia\./i.test(referrer);
const isInternalReferrer = referrer => {
  if (!referrer) {
    return false;
  }
  try {
    return new URL(referrer).host === new URL(_utils_browser__WEBPACK_IMPORTED_MODULE_1__.runtime.homeUrl || window.location.origin).host;
  } catch (error) {
    return false;
  }
};
const matchesReferrerPattern = (pattern, referrer, useRegex) => {
  if (!pattern) {
    return true;
  }
  if (useRegex) {
    try {
      return new RegExp(pattern).test(referrer);
    } catch (error) {
      return false;
    }
  }
  return referrer.includes(pattern);
};

/**
 * Evaluate browser-only popup rules before automatic opening.
 */
const passesRules = popup => {
  const {
    id,
    settings
  } = popup;
  const rules = settings.rules || {};
  const referrer = document.referrer || '';
  const arrivingFrom = (0,_utils_browser__WEBPACK_IMPORTED_MODULE_1__.splitList)(rules.arrivingFrom);
  const device = (0,_utils_browser__WEBPACK_IMPORTED_MODULE_1__.getDevice)();
  const devices = (0,_utils_browser__WEBPACK_IMPORTED_MODULE_1__.splitList)(rules.devices);
  if (devices.length && !devices.includes(device)) {
    return false;
  }
  if (rules.hideLoggedIn && _utils_browser__WEBPACK_IMPORTED_MODULE_1__.runtime.isLoggedIn) {
    return false;
  }
  const hideRoles = (0,_utils_browser__WEBPACK_IMPORTED_MODULE_1__.splitList)(rules.hideRoles);
  if (hideRoles.length && Array.isArray(_utils_browser__WEBPACK_IMPORTED_MODULE_1__.runtime.userRoles) && _utils_browser__WEBPACK_IMPORTED_MODULE_1__.runtime.userRoles.some(role => hideRoles.includes(role))) {
    return false;
  }
  if (rules.pageViews && (0,_utils_storage__WEBPACK_IMPORTED_MODULE_0__.getStorageNumber)(localStorage, _utils_storage__WEBPACK_IMPORTED_MODULE_0__.pageKey) < Number(rules.pageViewsCount || 0)) {
    return false;
  }
  if (rules.sessions && (0,_utils_storage__WEBPACK_IMPORTED_MODULE_0__.getStorageNumber)(localStorage, _utils_storage__WEBPACK_IMPORTED_MODULE_0__.sessionsKey) < Number(rules.sessionsCount || 0)) {
    return false;
  }
  if (rules.maxDisplays) {
    const countMode = rules.countMode === 'close' ? 'close' : 'open';
    if ((0,_utils_storage__WEBPACK_IMPORTED_MODULE_0__.getStorageNumber)(localStorage, (0,_utils_storage__WEBPACK_IMPORTED_MODULE_0__.popupCountKey)(id, countMode)) >= Number(rules.maxDisplaysCount || 0)) {
      return false;
    }
  }
  if (rules.referrerUrl) {
    const matched = matchesReferrerPattern(rules.referrerPattern, referrer, rules.referrerRegex);
    if (rules.referrerMode === 'hide' && matched) {
      return false;
    }
    if (rules.referrerMode !== 'hide' && !matched) {
      return false;
    }
  }
  if (arrivingFrom.length) {
    const matchesSource = arrivingFrom.includes('search') && isSearchReferrer(referrer) || arrivingFrom.includes('internal') && isInternalReferrer(referrer) || arrivingFrom.includes('external') && referrer && !isInternalReferrer(referrer) && !isSearchReferrer(referrer);
    if (!matchesSource) {
      return false;
    }
  }
  return true;
};

/***/ },

/***/ "./src/frontend/runtime.js"
/*!*********************************!*\
  !*** ./src/frontend/runtime.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/* harmony import */ var _config_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config/constants */ "./src/frontend/config/constants.js");
/* harmony import */ var _core_rules__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/rules */ "./src/frontend/core/rules.js");
/* harmony import */ var _utils_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/storage */ "./src/frontend/utils/storage.js");
/* harmony import */ var _core_apply_styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/apply-styles */ "./src/frontend/core/apply-styles.js");
/* harmony import */ var _utils_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/browser */ "./src/frontend/utils/browser.js");
/* harmony import */ var _shared_animation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shared/animation */ "./src/shared/animation.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */






const registeredPopups = new Map();
let runtimeCountersReady = false;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const {
  state,
  actions
} = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)(_config_constants__WEBPACK_IMPORTED_MODULE_1__.STORE_NAMESPACE, {
  state: {
    hasOpenPopup: false
  },
  actions: {
    openPopupById(id, force = false) {
      openPopupNode(registeredPopups.get(String(id)), force);
    },
    closeCurrentPopup(event) {
      const popup = getCurrentPopup();
      if (!popup) {
        return;
      }
      const advanced = popup.settings.advanced || {};
      if (event?.target?.classList?.contains(_config_constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_OVERLAY) && advanced.preventOverlayClose) {
        return;
      }
      closePopupNode(popup);
    },
    closeOnEscape: (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.withSyncEvent)(event => {
      const popup = getCurrentPopup();
      if (event.key === 'Escape' && popup?.isOpen && !popup.settings.advanced?.preventEscClose) {
        closePopupNode(popup);
      }
    })
  },
  callbacks: {
    initPopup() {
      ensureRuntimeCounters();
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const popup = parsePopup(ref, (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)());
      if (!popup || registeredPopups.has(popup.id)) {
        return;
      }
      registeredPopups.set(popup.id, popup);
      (0,_core_apply_styles__WEBPACK_IMPORTED_MODULE_4__.applyInlineStyles)(popup);
      bindManualSelectors(popup);
      bindTriggers(popup);
    }
  }
});

/**
 * Initialize cross-popup counters once per page load.
 */
const ensureRuntimeCounters = () => {
  if (runtimeCountersReady) {
    return;
  }
  runtimeCountersReady = true;
  (0,_utils_storage__WEBPACK_IMPORTED_MODULE_3__.incrementStorageNumber)(localStorage, _utils_storage__WEBPACK_IMPORTED_MODULE_3__.pageKey);
  if (!sessionStorage.getItem(_utils_storage__WEBPACK_IMPORTED_MODULE_3__.sessionKey)) {
    sessionStorage.setItem(_utils_storage__WEBPACK_IMPORTED_MODULE_3__.sessionKey, '1');
    (0,_utils_storage__WEBPACK_IMPORTED_MODULE_3__.incrementStorageNumber)(localStorage, _utils_storage__WEBPACK_IMPORTED_MODULE_3__.sessionsKey);
  }
};

/**
 * Resolve the popup connected to the current Interactivity context.
 */
const getCurrentPopup = () => {
  const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
  const id = String(context?.id || '');
  return registeredPopups.get(id);
};

/**
 * Keep Interactivity context and DOM state in sync for CSS animation selectors.
 */
const setPopupState = (popup, nextState) => {
  popup.context.animationState = nextState;
  popup.node.dataset.state = nextState;
};

/**
 * Resolve the active animation duration for the current motion preference.
 */
const getAnimationDuration = (popup, phase) => {
  const layout = popup.settings.layout || {};
  const animation = 'opening' === phase ? layout.entranceAnimation : layout.exitAnimation;
  if (reducedMotion.matches || 'none' === animation) {
    return 0;
  }
  return (0,_shared_animation__WEBPACK_IMPORTED_MODULE_6__.normalizeAnimationDuration)(layout.animationDuration, 0) * 1000;
};

/**
 * Clear any pending animation listener or timeout.
 */
const clearAnimationWait = popup => {
  if (popup.animationCleanup) {
    popup.animationCleanup();
    popup.animationCleanup = null;
  }
  window.clearTimeout(popup.animationTimer);
  popup.animationTimer = null;
};

/**
 * Run a callback when the dialog animation ends, with a timeout fallback.
 */
const afterAnimation = (popup, phase, callback) => {
  clearAnimationWait(popup);
  const duration = getAnimationDuration(popup, phase);
  const dialog = popup.node.querySelector(_config_constants__WEBPACK_IMPORTED_MODULE_1__.SELECTOR_DIALOG);
  if (!duration || !dialog) {
    callback();
    return;
  }
  let finished = false;
  const finish = event => {
    if (event && event.target !== dialog) {
      return;
    }
    if (finished) {
      return;
    }
    finished = true;
    clearAnimationWait(popup);
    callback();
  };
  dialog.addEventListener('animationend', finish);
  popup.animationTimer = window.setTimeout(finish, duration + 100);
  popup.animationCleanup = () => dialog.removeEventListener('animationend', finish);
};

/**
 * Determine whether a popup is allowed to open at this moment.
 */
const canOpen = (popup, force = false) => {
  if (popup.isOpen) {
    return false;
  }
  if (force) {
    return true;
  }
  if (state.hasOpenPopup && popup.settings.advanced?.avoidMultiple) {
    return false;
  }
  return (0,_core_rules__WEBPACK_IMPORTED_MODULE_2__.passesRules)(popup);
};

/**
 * Open a popup and update runtime display counters.
 */
const openPopupNode = (popup, force = false) => {
  if (!popup) {
    return;
  }
  if (!canOpen(popup, force)) {
    return;
  }
  const {
    node,
    id,
    settings
  } = popup;
  const advanced = settings.advanced || {};
  const rules = settings.rules || {};
  popup.isOpen = true;
  popup.context.isOpen = true;
  state.hasOpenPopup = true;
  clearAnimationWait(popup);
  node.classList.remove(_config_constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_HIDDEN, _config_constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_CLOSING);
  node.classList.add(_config_constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_OPEN);
  node.setAttribute('aria-hidden', 'false');
  setPopupState(popup, _config_constants__WEBPACK_IMPORTED_MODULE_1__.STATE_OPENING);
  if (advanced.disableScroll) {
    document.documentElement.classList.add(_config_constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_SCROLL_LOCKED);
  }
  if (rules.maxDisplays && rules.countMode !== 'close') {
    (0,_utils_storage__WEBPACK_IMPORTED_MODULE_3__.incrementStorageNumber)(localStorage, (0,_utils_storage__WEBPACK_IMPORTED_MODULE_3__.popupCountKey)(id, 'open'));
  }
  const autoClose = Number(advanced.autoClose || 0);
  if (autoClose > 0) {
    window.clearTimeout(popup.autoCloseTimer);
    popup.autoCloseTimer = window.setTimeout(() => closePopupNode(popup), autoClose);
  }
  afterAnimation(popup, 'opening', () => {
    if (popup.isOpen) {
      setPopupState(popup, _config_constants__WEBPACK_IMPORTED_MODULE_1__.STATE_OPEN);
    }
  });
};

/**
 * Close a popup and release scroll locking when no popup remains open.
 */
const closePopupNode = popup => {
  if (!popup.isOpen) {
    return;
  }
  const {
    node,
    id,
    settings
  } = popup;
  const rules = settings.rules || {};
  popup.isOpen = false;
  popup.context.isOpen = false;
  node.classList.add(_config_constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_CLOSING);
  node.classList.remove(_config_constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_OPEN);
  node.setAttribute('aria-hidden', 'true');
  setPopupState(popup, _config_constants__WEBPACK_IMPORTED_MODULE_1__.STATE_CLOSING);
  window.clearTimeout(popup.autoCloseTimer);
  if (rules.maxDisplays && rules.countMode === 'close') {
    (0,_utils_storage__WEBPACK_IMPORTED_MODULE_3__.incrementStorageNumber)(localStorage, (0,_utils_storage__WEBPACK_IMPORTED_MODULE_3__.popupCountKey)(id, 'close'));
  }
  afterAnimation(popup, 'closing', () => {
    node.classList.add(_config_constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_HIDDEN);
    node.classList.remove(_config_constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_CLOSING);
    setPopupState(popup, _config_constants__WEBPACK_IMPORTED_MODULE_1__.STATE_HIDDEN);
    if (!document.querySelector(_config_constants__WEBPACK_IMPORTED_MODULE_1__.SELECTOR_OPEN_POPUP)) {
      document.documentElement.classList.remove(_config_constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_SCROLL_LOCKED);
      state.hasOpenPopup = false;
    }
  });
};

/**
 * Bind manual selector triggers. Manual opens intentionally bypass rules.
 */
const bindManualSelectors = popup => {
  const selectors = (0,_utils_browser__WEBPACK_IMPORTED_MODULE_5__.splitSelectors)(popup.settings.advanced?.openSelectors);
  selectors.forEach(selector => {
    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target.closest(selector) : null;
      if (target) {
        event.preventDefault();
        actions.openPopupById(popup.id, true);
      }
    });
  });
};

/**
 * Register automatic popup triggers.
 */
const bindTriggers = popup => {
  const triggers = popup.settings.triggers || {};
  if (triggers.pageLoad) {
    window.setTimeout(() => actions.openPopupById(popup.id), Number(triggers.pageLoadDelay || 0) * 1000);
  }
  if (triggers.scroll) {
    const onScroll = () => {
      if (popup.isOpen) {
        return;
      }
      if (triggers.scrollDirection === 'up') {
        if (window.scrollY <= Number(triggers.scrollAmount || 0)) {
          actions.openPopupById(popup.id);
          window.removeEventListener('scroll', onScroll);
        }
        return;
      }
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? window.scrollY / scrollable * 100 : 100;
      if (percent >= Number(triggers.scrollAmount || 0)) {
        actions.openPopupById(popup.id);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
  }
  if (triggers.scrollElement && triggers.scrollSelector) {
    const target = document.querySelector(triggers.scrollSelector);
    if (target && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          actions.openPopupById(popup.id);
          observer.disconnect();
        }
      });
      observer.observe(target);
    }
  }
  if (triggers.click) {
    let count = 0;
    document.addEventListener('click', () => {
      count += 1;
      if (count >= Number(triggers.clickCount || 0)) {
        actions.openPopupById(popup.id);
      }
    });
  }
  if (triggers.inactivity) {
    let timer;
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => actions.openPopupById(popup.id), Number(triggers.inactivitySeconds || 0) * 1000);
    };
    ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(eventName => document.addEventListener(eventName, reset, {
      passive: true
    }));
    reset();
  }
  if (triggers.exitIntent) {
    document.addEventListener('mouseout', event => {
      if (event.clientY <= 0 && !event.relatedTarget) {
        actions.openPopupById(popup.id);
      }
    });
  }
};

/**
 * Parse a rendered popup DOM node into runtime state.
 */
const parsePopup = (node, context = {}) => {
  try {
    const id = String(context.id || node.dataset.popupId || '');
    return {
      node,
      id,
      context,
      settings: JSON.parse(node.dataset.settings || '{}'),
      isOpen: false,
      autoCloseTimer: null,
      animationTimer: null,
      animationCleanup: null
    };
  } catch (error) {
    return null;
  }
};

/***/ },

/***/ "./src/frontend/utils/browser.js"
/*!***************************************!*\
  !*** ./src/frontend/utils/browser.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDevice: () => (/* binding */ getDevice),
/* harmony export */   runtime: () => (/* binding */ runtime),
/* harmony export */   splitList: () => (/* binding */ splitList),
/* harmony export */   splitSelectors: () => (/* binding */ splitSelectors)
/* harmony export */ });
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/* harmony import */ var _config_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/constants */ "./src/frontend/config/constants.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */


/**
 * Runtime data injected by PHP when frontend assets are enqueued.
 */
const runtime = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getConfig)(_config_constants__WEBPACK_IMPORTED_MODULE_1__.STORE_NAMESPACE) || {};

/**
 * Split CSS selector lists used for manual popup triggers.
 */
const splitSelectors = value => String(value || '').split(',').map(selector => selector.trim()).filter(Boolean);

/**
 * Normalize comma-separated setting strings and array values to arrays.
 */
const splitList = value => Array.isArray(value) ? value : String(value || '').split(',').map(item => item.trim()).filter(Boolean);

/**
 * Match the responsive device buckets used by popup display rules.
 */
const getDevice = () => {
  const {
    isViewportMatch
  } = window[_config_constants__WEBPACK_IMPORTED_MODULE_1__.VIEWPORT_BRIDGE_GLOBAL] || {};
  if (isViewportMatch?.('< medium')) {
    return 'mobile';
  }
  if (isViewportMatch?.('< large')) {
    return 'tablet';
  }
  return 'desktop';
};

/***/ },

/***/ "./src/frontend/utils/storage.js"
/*!***************************************!*\
  !*** ./src/frontend/utils/storage.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getStorageNumber: () => (/* binding */ getStorageNumber),
/* harmony export */   incrementStorageNumber: () => (/* binding */ incrementStorageNumber),
/* harmony export */   pageKey: () => (/* binding */ pageKey),
/* harmony export */   popupCountKey: () => (/* binding */ popupCountKey),
/* harmony export */   sessionKey: () => (/* binding */ sessionKey),
/* harmony export */   sessionsKey: () => (/* binding */ sessionsKey)
/* harmony export */ });
/**
 * Local and session storage keys used for runtime display rules.
 */
const pageKey = 'blablablocksPopupPageViews';
const sessionKey = 'blablablocksPopupSessionActive';
const sessionsKey = 'blablablocksPopupSessions';

/**
 * Read numeric browser state without leaking NaN into rule checks.
 */
const getStorageNumber = (storage, key) => {
  const value = parseInt(storage.getItem(key) || '0', 10);
  return Number.isNaN(value) ? 0 : value;
};
const setStorageNumber = (storage, key, value) => {
  storage.setItem(key, String(value));
};

/**
 * Increment and persist a numeric browser state counter.
 */
const incrementStorageNumber = (storage, key) => {
  const value = getStorageNumber(storage, key) + 1;
  setStorageNumber(storage, key, value);
  return value;
};
const popupCountKey = (id, mode) => `blablablocksPopup:${id}:${mode}Count`;

/***/ },

/***/ "./src/shared/animation.js"
/*!*********************************!*\
  !*** ./src/shared/animation.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_ANIMATION_DURATION: () => (/* binding */ DEFAULT_ANIMATION_DURATION),
/* harmony export */   normalizeAnimationDuration: () => (/* binding */ normalizeAnimationDuration)
/* harmony export */ });
/**
 * Default animation duration in seconds.
 */
const DEFAULT_ANIMATION_DURATION = 0.3;

/**
 * Convert old millisecond values and invalid inputs to seconds.
 *
 * @param {*}      value    Raw duration.
 * @param {number} fallback Fallback duration in seconds.
 * @return {number} Duration in seconds.
 */
const normalizeAnimationDuration = (value, fallback = DEFAULT_ANIMATION_DURATION) => {
  const duration = Number(value);
  if (!Number.isFinite(duration) || duration < 0) {
    return fallback;
  }
  const seconds = duration > 20 ? duration / 1000 : duration;
  return Math.round(seconds * 1000) / 1000;
};

/***/ },

/***/ "./src/shared/border.js"
/*!******************************!*\
  !*** ./src/shared/border.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSS_BOX_SIDES: () => (/* binding */ CSS_BOX_SIDES),
/* harmony export */   hasBorderValue: () => (/* binding */ hasBorderValue),
/* harmony export */   hasFlatBorderValue: () => (/* binding */ hasFlatBorderValue),
/* harmony export */   hasSplitBorderValue: () => (/* binding */ hasSplitBorderValue),
/* harmony export */   isBorderSide: () => (/* binding */ isBorderSide)
/* harmony export */ });
/**
 * Physical sides used by border and spacing controls.
 */
const CSS_BOX_SIDES = ['top', 'right', 'bottom', 'left'];

/**
 * Determine whether a key identifies an individual border side.
 *
 * @param {string} key Border property key.
 * @return {boolean} Whether the key is a border side.
 */
const isBorderSide = key => CSS_BOX_SIDES.includes(key);

/**
 * Determine whether a flat border object contains a visible value.
 *
 * @param {Object} border Border value.
 * @return {boolean} Whether the border has a color, style, or width.
 */
const hasFlatBorderValue = border => !!border && typeof border === 'object' && [border.color, border.style, border.width].some(Boolean);

/**
 * Determine whether any side of a split border contains a visible value.
 *
 * @param {Object} border Border value.
 * @return {boolean} Whether the border has a configured side.
 */
const hasSplitBorderValue = border => !!border && typeof border === 'object' && CSS_BOX_SIDES.some(side => hasFlatBorderValue(border[side]));

/**
 * Determine whether a flat or split border contains a visible value.
 *
 * @param {Object} border Border value.
 * @return {boolean} Whether the border has a configured value.
 */
const hasBorderValue = border => hasFlatBorderValue(border) || hasSplitBorderValue(border);

/***/ },

/***/ "@wordpress/interactivity"
/*!*******************************************!*\
  !*** external "@wordpress/interactivity" ***!
  \*******************************************/
(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__;

/***/ }

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	if (!(moduleId in __webpack_modules__)) {
/******/ 		delete __webpack_module_cache__[moduleId];
/******/ 		var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 		e.code = 'MODULE_NOT_FOUND';
/******/ 		throw e;
/******/ 	}
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./src/frontend/module.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runtime */ "./src/frontend/runtime.js");
/**
 * Internal dependencies
 */

})();


//# sourceMappingURL=module.js.map