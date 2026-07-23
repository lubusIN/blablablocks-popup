/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/frontend/styles.scss"
/*!**********************************!*\
  !*** ./src/frontend/styles.scss ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/viewport"
/*!**********************************!*\
  !*** external ["wp","viewport"] ***!
  \**********************************/
(module) {

module.exports = window["wp"]["viewport"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/frontend.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_viewport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/viewport */ "@wordpress/viewport");
/* harmony import */ var _wordpress_viewport__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_viewport__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _frontend_styles_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./frontend/styles.scss */ "./src/frontend/styles.scss");
/* harmony import */ var _frontend_config_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./frontend/config/constants */ "./src/frontend/config/constants.js");
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */


const {
  isViewportMatch
} = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_wordpress_viewport__WEBPACK_IMPORTED_MODULE_1__.store);

/**
 * Expose the classic viewport selector to the Interactivity script module.
 *
 * WordPress classic script packages cannot currently be imported directly by
 * a script module.
 */
window[_frontend_config_constants__WEBPACK_IMPORTED_MODULE_3__.VIEWPORT_BRIDGE_GLOBAL] = {
  isViewportMatch
};
})();

/******/ })()
;
//# sourceMappingURL=frontend.js.map