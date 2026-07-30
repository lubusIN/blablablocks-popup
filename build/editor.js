/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js"
/*!***********************************************************************************!*\
  !*** ./node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js ***!
  \***********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createCache)
/* harmony export */ });
/* harmony import */ var _emotion_sheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/sheet */ "./node_modules/@emotion/sheet/dist/emotion-sheet.development.esm.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Parser.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Tokenizer.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Serializer.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Middleware.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js");
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js");





var identifierWithPointTracking = function identifierWithPointTracking(begin, points, index) {
  var previous = 0;
  var character = 0;

  while (true) {
    previous = character;
    character = (0,stylis__WEBPACK_IMPORTED_MODULE_4__.peek)(); // &\f

    if (previous === 38 && character === 12) {
      points[index] = 1;
    }

    if ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.token)(character)) {
      break;
    }

    (0,stylis__WEBPACK_IMPORTED_MODULE_4__.next)();
  }

  return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.slice)(begin, stylis__WEBPACK_IMPORTED_MODULE_4__.position);
};

var toRules = function toRules(parsed, points) {
  // pretend we've started with a comma
  var index = -1;
  var character = 44;

  do {
    switch ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.token)(character)) {
      case 0:
        // &\f
        if (character === 38 && (0,stylis__WEBPACK_IMPORTED_MODULE_4__.peek)() === 12) {
          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
          // and when it should just concatenate the outer and inner selectors
          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
          points[index] = 1;
        }

        parsed[index] += identifierWithPointTracking(stylis__WEBPACK_IMPORTED_MODULE_4__.position - 1, points, index);
        break;

      case 2:
        parsed[index] += (0,stylis__WEBPACK_IMPORTED_MODULE_4__.delimit)(character);
        break;

      case 4:
        // comma
        if (character === 44) {
          // colon
          parsed[++index] = (0,stylis__WEBPACK_IMPORTED_MODULE_4__.peek)() === 58 ? '&\f' : '';
          points[index] = parsed[index].length;
          break;
        }

      // fallthrough

      default:
        parsed[index] += (0,stylis__WEBPACK_IMPORTED_MODULE_2__.from)(character);
    }
  } while (character = (0,stylis__WEBPACK_IMPORTED_MODULE_4__.next)());

  return parsed;
};

var getRules = function getRules(value, points) {
  return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.dealloc)(toRules((0,stylis__WEBPACK_IMPORTED_MODULE_4__.alloc)(value), points));
}; // WeakSet would be more appropriate, but only WeakMap is supported in IE11


var fixedElements = /* #__PURE__ */new WeakMap();
var compat = function compat(element) {
  if (element.type !== 'rule' || !element.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  element.length < 1) {
    return;
  }

  var value = element.value;
  var parent = element.parent;
  var isImplicitRule = element.column === parent.column && element.line === parent.line;

  while (parent.type !== 'rule') {
    parent = parent.parent;
    if (!parent) return;
  } // short-circuit for the simplest case


  if (element.props.length === 1 && value.charCodeAt(0) !== 58
  /* colon */
  && !fixedElements.get(parent)) {
    return;
  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"


  if (isImplicitRule) {
    return;
  }

  fixedElements.set(element, true);
  var points = [];
  var rules = getRules(value, points);
  var parentRules = parent.props;

  for (var i = 0, k = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k++) {
      element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
    }
  }
};
var removeLabel = function removeLabel(element) {
  if (element.type === 'decl') {
    var value = element.value;

    if ( // charcode for l
    value.charCodeAt(0) === 108 && // charcode for b
    value.charCodeAt(2) === 98) {
      // this ignores label
      element["return"] = '';
      element.value = '';
    }
  }
};
var ignoreFlag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';

var isIgnoringComment = function isIgnoringComment(element) {
  return element.type === 'comm' && element.children.indexOf(ignoreFlag) > -1;
};

var createUnsafeSelectorsAlarm = function createUnsafeSelectorsAlarm(cache) {
  return function (element, index, children) {
    if (element.type !== 'rule' || cache.compat) return;
    var unsafePseudoClasses = element.value.match(/(:first|:nth|:nth-last)-child/g);

    if (unsafePseudoClasses) {
      var isNested = !!element.parent; // in nested rules comments become children of the "auto-inserted" rule and that's always the `element.parent`
      //
      // considering this input:
      // .a {
      //   .b /* comm */ {}
      //   color: hotpink;
      // }
      // we get output corresponding to this:
      // .a {
      //   & {
      //     /* comm */
      //     color: hotpink;
      //   }
      //   .b {}
      // }

      var commentContainer = isNested ? element.parent.children : // global rule at the root level
      children;

      for (var i = commentContainer.length - 1; i >= 0; i--) {
        var node = commentContainer[i];

        if (node.line < element.line) {
          break;
        } // it is quite weird but comments are *usually* put at `column: element.column - 1`
        // so we seek *from the end* for the node that is earlier than the rule's `element` and check that
        // this will also match inputs like this:
        // .a {
        //   /* comm */
        //   .b {}
        // }
        //
        // but that is fine
        //
        // it would be the easiest to change the placement of the comment to be the first child of the rule:
        // .a {
        //   .b { /* comm */ }
        // }
        // with such inputs we wouldn't have to search for the comment at all
        // TODO: consider changing this comment placement in the next major version


        if (node.column < element.column) {
          if (isIgnoringComment(node)) {
            return;
          }

          break;
        }
      }

      unsafePseudoClasses.forEach(function (unsafePseudoClass) {
        console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
      });
    }
  };
};

var isImportRule = function isImportRule(element) {
  return element.type.charCodeAt(1) === 105 && element.type.charCodeAt(0) === 64;
};

var isPrependedWithRegularRules = function isPrependedWithRegularRules(index, children) {
  for (var i = index - 1; i >= 0; i--) {
    if (!isImportRule(children[i])) {
      return true;
    }
  }

  return false;
}; // use this to remove incorrect elements from further processing
// so they don't get handed to the `sheet` (or anything else)
// as that could potentially lead to additional logs which in turn could be overhelming to the user


var nullifyElement = function nullifyElement(element) {
  element.type = '';
  element.value = '';
  element["return"] = '';
  element.children = '';
  element.props = '';
};

var incorrectImportAlarm = function incorrectImportAlarm(element, index, children) {
  if (!isImportRule(element)) {
    return;
  }

  if (element.parent) {
    console.error("`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles.");
    nullifyElement(element);
  } else if (isPrependedWithRegularRules(index, children)) {
    console.error("`@import` rules can't be after other rules. Please put your `@import` rules before your other rules.");
    nullifyElement(element);
  }
};

/* eslint-disable no-fallthrough */

function prefix(value, length) {
  switch ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.hash)(value, length)) {
    // color-adjust
    case 5103:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'print-' + value + value;
    // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)

    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921: // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break

    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005: // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,

    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855: // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)

    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + value;
    // appearance, user-select, transform, hyphens, text-size-adjust

    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MOZ + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + value + value;
    // flex, flex-direction

    case 6828:
    case 4268:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + value + value;
    // order

    case 6165:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-' + value + value;
    // align-items

    case 5187:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(\w+).+(:[^]+)/, stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-$1$2' + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-$1$2') + value;
    // align-self

    case 5443:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-item-' + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /flex-|-self/, '') + value;
    // align-content

    case 4675:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-line-pack' + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /align-content|flex-|-self/, '') + value;
    // flex-shrink

    case 5548:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, 'shrink', 'negative') + value;
    // flex-basis

    case 5292:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, 'basis', 'preferred-size') + value;
    // flex-grow

    case 6060:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-' + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, '-grow', '') + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, 'grow', 'positive') + value;
    // transition

    case 4554:
      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /([^-])(transform)/g, '$1' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2') + value;
    // cursor

    case 6187:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)((0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)((0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(zoom-|grab)/, stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1'), /(image-set)/, stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1'), value, '') + value;
    // background, background-image

    case 5495:
    case 3959:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(image-set\([^]*)/, stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1' + '$`$1');
    // justify-content

    case 4968:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)((0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(.+:)(flex-)?(.*)/, stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-pack:$3' + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + value;
    // (margin|padding)-inline-(start|end)

    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(.+)-inline(.+)/, stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1$2') + value;
    // (min|max)?(width|height|inline-size|block-size)

    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      // stretch, max-content, min-content, fill-available
      if ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.strlen)(value) - 1 - length > 6) switch ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, length + 1)) {
        // (m)ax-content, (m)in-content
        case 109:
          // -
          if ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, length + 4) !== 45) break;
        // (f)ill-available, (f)it-content

        case 102:
          return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(.+:)(.+)-([^]+)/, '$1' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2-$3' + '$1' + stylis__WEBPACK_IMPORTED_MODULE_1__.MOZ + ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, length + 3) == 108 ? '$3' : '$2-$3')) + value;
        // (s)tretch

        case 115:
          return ~(0,stylis__WEBPACK_IMPORTED_MODULE_2__.indexof)(value, 'stretch') ? prefix((0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, 'stretch', 'fill-available'), length) + value : value;
      }
      break;
    // position: sticky

    case 4949:
      // (s)ticky?
      if ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, length + 1) !== 115) break;
    // display: (flex|inline-flex)

    case 6444:
      switch ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, (0,stylis__WEBPACK_IMPORTED_MODULE_2__.strlen)(value) - 3 - (~(0,stylis__WEBPACK_IMPORTED_MODULE_2__.indexof)(value, '!important') && 10))) {
        // stic(k)y
        case 107:
          return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, ':', ':' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT) + value;
        // (inline-)?fl(e)x

        case 101:
          return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /(.+:)([^;!]+)(;|!.+)?/, '$1' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2$3' + '$1' + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + '$2box$3') + value;
      }

      break;
    // writing-mode

    case 5936:
      switch ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.charat)(value, length + 11)) {
        // vertical-l(r)
        case 114:
          return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb') + value;
        // vertical-r(l)

        case 108:
          return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value;
        // horizontal(-)tb

        case 45:
          return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /[svh]\w+-[tblr]{2}/, 'lr') + value;
      }

      return stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_1__.MS + value + value;
  }

  return value;
}

var prefixer = function prefixer(element, index, children, callback) {
  if (element.length > -1) if (!element["return"]) switch (element.type) {
    case stylis__WEBPACK_IMPORTED_MODULE_1__.DECLARATION:
      element["return"] = prefix(element.value, element.length);
      break;

    case stylis__WEBPACK_IMPORTED_MODULE_1__.KEYFRAMES:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_5__.serialize)([(0,stylis__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {
        value: (0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(element.value, '@', '@' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT)
      })], callback);

    case stylis__WEBPACK_IMPORTED_MODULE_1__.RULESET:
      if (element.length) return (0,stylis__WEBPACK_IMPORTED_MODULE_2__.combine)(element.props, function (value) {
        switch ((0,stylis__WEBPACK_IMPORTED_MODULE_2__.match)(value, /(::plac\w+|:read-\w+)/)) {
          // :read-(only|write)
          case ':read-only':
          case ':read-write':
            return (0,stylis__WEBPACK_IMPORTED_MODULE_5__.serialize)([(0,stylis__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /:(read-\w+)/, ':' + stylis__WEBPACK_IMPORTED_MODULE_1__.MOZ + '$1')]
            })], callback);
          // :placeholder

          case '::placeholder':
            return (0,stylis__WEBPACK_IMPORTED_MODULE_5__.serialize)([(0,stylis__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /:(plac\w+)/, ':' + stylis__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'input-$1')]
            }), (0,stylis__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /:(plac\w+)/, ':' + stylis__WEBPACK_IMPORTED_MODULE_1__.MOZ + '$1')]
            }), (0,stylis__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_2__.replace)(value, /:(plac\w+)/, stylis__WEBPACK_IMPORTED_MODULE_1__.MS + 'input-$1')]
            })], callback);
        }

        return '';
      });
  }
};

var defaultStylisPlugins = [prefixer];
var getSourceMap;

{
  var sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;

  getSourceMap = function getSourceMap(styles) {
    var matches = styles.match(sourceMapPattern);
    if (!matches) return;
    return matches[matches.length - 1];
  };
}

var createCache = function createCache(options) {
  var key = options.key;

  if (!key) {
    throw new Error("You have to configure `key` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.\n" + "If multiple caches share the same key they might \"fight\" for each other's style elements.");
  }

  if (key === 'css') {
    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])"); // get SSRed styles out of the way of React's hydration
    // document.head is a safe place to move them to(though note document.head is not necessarily the last place they will be)
    // note this very very intentionally targets all style elements regardless of the key to ensure
    // that creating a cache works inside of render of a React component

    Array.prototype.forEach.call(ssrStyles, function (node) {
      // we want to only move elements which have a space in the data-emotion attribute value
      // because that indicates that it is an Emotion 11 server-side rendered style elements
      // while we will already ignore Emotion 11 client-side inserted styles because of the :not([data-s]) part in the selector
      // Emotion 10 client-side inserted styles did not have data-s (but importantly did not have a space in their data-emotion attributes)
      // so checking for the space ensures that loading Emotion 11 after Emotion 10 has inserted some styles
      // will not result in the Emotion 10 styles being destroyed
      var dataEmotionAttribute = node.getAttribute('data-emotion');

      if (dataEmotionAttribute.indexOf(' ') === -1) {
        return;
      }

      document.head.appendChild(node);
      node.setAttribute('data-s', '');
    });
  }

  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;

  {
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {};
  var container;
  var nodesToHydrate = [];

  {
    container = options.container || document.head;
    Array.prototype.forEach.call( // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll("style[data-emotion^=\"" + key + " \"]"), function (node) {
      var attrib = node.getAttribute("data-emotion").split(' ');

      for (var i = 1; i < attrib.length; i++) {
        inserted[attrib[i]] = true;
      }

      nodesToHydrate.push(node);
    });
  }

  var _insert;

  var omnipresentPlugins = [compat, removeLabel];

  {
    omnipresentPlugins.push(createUnsafeSelectorsAlarm({
      get compat() {
        return cache.compat;
      }

    }), incorrectImportAlarm);
  }

  {
    var currentSheet;
    var finalizingPlugins = [stylis__WEBPACK_IMPORTED_MODULE_5__.stringify, function (element) {
      if (!element.root) {
        if (element["return"]) {
          currentSheet.insert(element["return"]);
        } else if (element.value && element.type !== stylis__WEBPACK_IMPORTED_MODULE_1__.COMMENT) {
          // insert empty rule in non-production environments
          // so @emotion/jest can grab `key` from the (JS)DOM for caches without any rules inserted yet
          currentSheet.insert(element.value + "{}");
        }
      }
    } ];
    var serializer = (0,stylis__WEBPACK_IMPORTED_MODULE_6__.middleware)(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));

    var stylis = function stylis(styles) {
      return (0,stylis__WEBPACK_IMPORTED_MODULE_5__.serialize)((0,stylis__WEBPACK_IMPORTED_MODULE_3__.compile)(styles), serializer);
    };

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet;

      if (getSourceMap) {
        var sourceMap = getSourceMap(serialized.styles);

        if (sourceMap) {
          currentSheet = {
            insert: function insert(rule) {
              sheet.insert(rule + sourceMap);
            }
          };
        }
      }

      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);

      if (shouldCache) {
        cache.inserted[serialized.name] = true;
      }
    };
  }

  var cache = {
    key: key,
    sheet: new _emotion_sheet__WEBPACK_IMPORTED_MODULE_0__.StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend,
      insertionPoint: options.insertionPoint
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  cache.sheet.hydrate(nodesToHydrate);
  return cache;
};




/***/ },

/***/ "./node_modules/@emotion/hash/dist/emotion-hash.esm.js"
/*!*************************************************************!*\
  !*** ./node_modules/@emotion/hash/dist/emotion-hash.esm.js ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ murmur2)
/* harmony export */ });
/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}




/***/ },

/***/ "./node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js"
/*!*******************************************************************************!*\
  !*** ./node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js ***!
  \*******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isPropValid)
/* harmony export */ });
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js");


// eslint-disable-next-line no-undef
var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|popover|popoverTarget|popoverTargetAction|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var isPropValid = /* #__PURE__ */(0,_emotion_memoize__WEBPACK_IMPORTED_MODULE_0__["default"])(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);




/***/ },

/***/ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js"
/*!*******************************************************************!*\
  !*** ./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ memoize)
/* harmony export */ });
function memoize(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}




/***/ },

/***/ "./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js"
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js ***!
  \*****************************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ hoistNonReactStatics)
/* harmony export */ });
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__);


// this file isolates this package that is not tree-shakeable
// and if this module doesn't actually contain any logic of its own
// then Rollup just use 'hoist-non-react-statics' directly in other chunks

var hoistNonReactStatics = (function (targetComponent, sourceComponent) {
  return hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default()(targetComponent, sourceComponent);
});




/***/ },

/***/ "./node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js"
/*!**********************************************************************************************!*\
  !*** ./node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js ***!
  \**********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ CacheProvider),
/* harmony export */   E: () => (/* binding */ Emotion$1),
/* harmony export */   T: () => (/* binding */ ThemeContext),
/* harmony export */   _: () => (/* binding */ __unsafe_useEmotionCache),
/* harmony export */   a: () => (/* binding */ ThemeProvider),
/* harmony export */   b: () => (/* binding */ withTheme),
/* harmony export */   c: () => (/* binding */ createEmotionProps),
/* harmony export */   h: () => (/* binding */ hasOwn),
/* harmony export */   u: () => (/* binding */ useTheme),
/* harmony export */   w: () => (/* binding */ withEmotionCache)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js");
/* harmony import */ var _isolated_hnrs_dist_emotion_react_isolated_hnrs_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js */ "./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js");
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js");
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js");
/* harmony import */ var _emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @emotion/use-insertion-effect-with-fallbacks */ "./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js");










var EmotionCacheContext = /* #__PURE__ */react__WEBPACK_IMPORTED_MODULE_0__.createContext( // we're doing this to avoid preconstruct's dead code elimination in this one case
// because this module is primarily intended for the browser and node
// but it's also required in react native and similar environments sometimes
// and we could have a special build just for that
// but this is much easier and the native packages
// might use a different theme context in the future anyway
typeof HTMLElement !== 'undefined' ? /* #__PURE__ */(0,_emotion_cache__WEBPACK_IMPORTED_MODULE_1__["default"])({
  key: 'css'
}) : null);

{
  EmotionCacheContext.displayName = 'EmotionCacheContext';
}

var CacheProvider = EmotionCacheContext.Provider;
var __unsafe_useEmotionCache = function useEmotionCache() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(EmotionCacheContext);
};

var withEmotionCache = function withEmotionCache(func) {
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function (props, ref) {
    // the cache will never be null in the browser
    var cache = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(EmotionCacheContext);
    return func(props, cache, ref);
  });
};

var ThemeContext = /* #__PURE__ */react__WEBPACK_IMPORTED_MODULE_0__.createContext({});

{
  ThemeContext.displayName = 'EmotionThemeContext';
}

var useTheme = function useTheme() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext);
};

var getTheme = function getTheme(outerTheme, theme) {
  if (typeof theme === 'function') {
    var mergedTheme = theme(outerTheme);

    if ((mergedTheme == null || typeof mergedTheme !== 'object' || Array.isArray(mergedTheme))) {
      throw new Error('[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!');
    }

    return mergedTheme;
  }

  if ((theme == null || typeof theme !== 'object' || Array.isArray(theme))) {
    throw new Error('[ThemeProvider] Please make your theme prop a plain object');
  }

  return (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({}, outerTheme, theme);
};

var createCacheWithTheme = /* #__PURE__ */(0,_emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__["default"])(function (outerTheme) {
  return (0,_emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__["default"])(function (theme) {
    return getTheme(outerTheme, theme);
  });
});
var ThemeProvider = function ThemeProvider(props) {
  var theme = react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext);

  if (props.theme !== theme) {
    theme = createCacheWithTheme(theme)(props.theme);
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ThemeContext.Provider, {
    value: theme
  }, props.children);
};
function withTheme(Component) {
  var componentName = Component.displayName || Component.name || 'Component';
  var WithTheme = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function render(props, ref) {
    var theme = react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({
      theme: theme,
      ref: ref
    }, props));
  });
  WithTheme.displayName = "WithTheme(" + componentName + ")";
  return (0,_isolated_hnrs_dist_emotion_react_isolated_hnrs_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_4__["default"])(WithTheme, Component);
}

var hasOwn = {}.hasOwnProperty;

var getLastPart = function getLastPart(functionName) {
  // The match may be something like 'Object.createEmotionProps' or
  // 'Loader.prototype.render'
  var parts = functionName.split('.');
  return parts[parts.length - 1];
};

var getFunctionNameFromStackTraceLine = function getFunctionNameFromStackTraceLine(line) {
  // V8
  var match = /^\s+at\s+([A-Za-z0-9$.]+)\s/.exec(line);
  if (match) return getLastPart(match[1]); // Safari / Firefox

  match = /^([A-Za-z0-9$.]+)@/.exec(line);
  if (match) return getLastPart(match[1]);
  return undefined;
};

var internalReactFunctionNames = /* #__PURE__ */new Set(['renderWithHooks', 'processChild', 'finishClassComponent', 'renderToString']); // These identifiers come from error stacks, so they have to be valid JS
// identifiers, thus we only need to replace what is a valid character for JS,
// but not for CSS.

var sanitizeIdentifier = function sanitizeIdentifier(identifier) {
  return identifier.replace(/\$/g, '-');
};

var getLabelFromStackTrace = function getLabelFromStackTrace(stackTrace) {
  if (!stackTrace) return undefined;
  var lines = stackTrace.split('\n');

  for (var i = 0; i < lines.length; i++) {
    var functionName = getFunctionNameFromStackTraceLine(lines[i]); // The first line of V8 stack traces is just "Error"

    if (!functionName) continue; // If we reach one of these, we have gone too far and should quit

    if (internalReactFunctionNames.has(functionName)) break; // The component name is the first function in the stack that starts with an
    // uppercase letter

    if (/^[A-Z]/.test(functionName)) return sanitizeIdentifier(functionName);
  }

  return undefined;
};

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
var labelPropName = '__EMOTION_LABEL_PLEASE_DO_NOT_USE__';
var createEmotionProps = function createEmotionProps(type, props) {
  if (typeof props.css === 'string' && // check if there is a css declaration
  props.css.indexOf(':') !== -1) {
    throw new Error("Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/react' like this: css`" + props.css + "`");
  }

  var newProps = {};

  for (var _key in props) {
    if (hasOwn.call(props, _key)) {
      newProps[_key] = props[_key];
    }
  }

  newProps[typePropName] = type; // Runtime labeling is an opt-in feature because:
  // - It causes hydration warnings when using Safari and SSR
  // - It can degrade performance if there are a huge number of elements
  //
  // Even if the flag is set, we still don't compute the label if it has already
  // been determined by the Babel plugin.

  if (typeof globalThis !== 'undefined' && !!globalThis.EMOTION_RUNTIME_AUTO_LABEL && !!props.css && (typeof props.css !== 'object' || !('name' in props.css) || typeof props.css.name !== 'string' || props.css.name.indexOf('-') === -1)) {
    var label = getLabelFromStackTrace(new Error().stack);
    if (label) newProps[labelPropName] = label;
  }

  return newProps;
};

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serialized = _ref.serialized,
      isStringTag = _ref.isStringTag;
  (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_5__.registerStyles)(cache, serialized, isStringTag);
  (0,_emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_7__.useInsertionEffectAlwaysWithSyncFallback)(function () {
    return (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_5__.insertStyles)(cache, serialized, isStringTag);
  });

  return null;
};

var Emotion = /* #__PURE__ */withEmotionCache(function (props, cache, ref) {
  var cssProp = props.css; // so that using `css` from `emotion` and passing the result to the css prop works
  // not passing the registered cache to serializeStyles because it would
  // make certain babel optimisations not possible

  if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
    cssProp = cache.registered[cssProp];
  }

  var WrappedComponent = props[typePropName];
  var registeredStyles = [cssProp];
  var className = '';

  if (typeof props.className === 'string') {
    className = (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_5__.getRegisteredStyles)(cache.registered, registeredStyles, props.className);
  } else if (props.className != null) {
    className = props.className + " ";
  }

  var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_6__.serializeStyles)(registeredStyles, undefined, react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext));

  if (serialized.name.indexOf('-') === -1) {
    var labelFromStack = props[labelPropName];

    if (labelFromStack) {
      serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_6__.serializeStyles)([serialized, 'label:' + labelFromStack + ';']);
    }
  }

  className += cache.key + "-" + serialized.name;
  var newProps = {};

  for (var _key2 in props) {
    if (hasOwn.call(props, _key2) && _key2 !== 'css' && _key2 !== typePropName && (_key2 !== labelPropName)) {
      newProps[_key2] = props[_key2];
    }
  }

  newProps.className = className;

  if (ref) {
    newProps.ref = ref;
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Insertion, {
    cache: cache,
    serialized: serialized,
    isStringTag: typeof WrappedComponent === 'string'
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(WrappedComponent, newProps));
});

{
  Emotion.displayName = 'EmotionCssPropInternal';
}

var Emotion$1 = Emotion;




/***/ },

/***/ "./node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js"
/*!***********************************************************************************!*\
  !*** ./node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js ***!
  \***********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   serializeStyles: () => (/* binding */ serializeStyles)
/* harmony export */ });
/* harmony import */ var _emotion_hash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/hash */ "./node_modules/@emotion/hash/dist/emotion-hash.esm.js");
/* harmony import */ var _emotion_unitless__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/unitless */ "./node_modules/@emotion/unitless/dist/emotion-unitless.esm.js");
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js");




var isDevelopment = true;

var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = /* #__PURE__ */(0,_emotion_memoize__WEBPACK_IMPORTED_MODULE_2__["default"])(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (_emotion_unitless__WEBPACK_IMPORTED_MODULE_1__["default"][key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

{
  var contentValuePattern = /(var|attr|counters?|url|element|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
  var contentValues = ['normal', 'none', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);

    if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, _char) {
        return _char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

var noComponentSelectorMessage = 'Component selectors can only be used in conjunction with ' + '@emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware ' + 'compiler transform.';

function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return '';
  }

  var componentSelector = interpolation;

  if (componentSelector.__emotion_styles !== undefined) {
    if (String(componentSelector) === 'NO_COMPONENT_SELECTOR') {
      throw new Error(noComponentSelectorMessage);
    }

    return componentSelector;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        var keyframes = interpolation;

        if (keyframes.anim === 1) {
          cursor = {
            name: keyframes.name,
            styles: keyframes.styles,
            next: cursor
          };
          return keyframes.name;
        }

        var serializedStyles = interpolation;

        if (serializedStyles.styles !== undefined) {
          var next = serializedStyles.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = serializedStyles.styles + ";";
          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        } else {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        break;
      }

    case 'string':
      {
        var matched = [];
        var replaced = interpolation.replace(animationRegex, function (_match, _p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
          return "${" + fakeVarName + "}";
        });

        if (matched.length) {
          console.error("`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\nInstead of doing this:\n\n" + [].concat(matched, ["`" + replaced + "`"]).join('\n') + "\n\nYou should wrap it with `css` like this:\n\ncss`" + replaced + "`");
        }
      }

      break;
  } // finalize string values (regular strings and functions interpolated into css calls)


  var asString = interpolation;

  if (registered == null) {
    return asString;
  }

  var cached = registered[asString];
  return cached !== undefined ? cached : asString;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var key in obj) {
      var value = obj[key];

      if (typeof value !== 'object') {
        var asString = value;

        if (registered != null && registered[asString] !== undefined) {
          string += key + "{" + registered[asString] + "}";
        } else if (isProcessableValue(asString)) {
          string += processStyleName(key) + ":" + processStyleValue(key, asString) + ";";
        }
      } else {
        if (key === 'NO_COMPONENT_SELECTOR' && isDevelopment) {
          throw new Error(noComponentSelectorMessage);
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(key) + ":" + processStyleValue(key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);

          switch (key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                if (key === 'undefined') {
                  console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
                }

                string += key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;{]+)\s*(;|$)/g; // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list

var cursor;
function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings);
  } else {
    var asTemplateStringsArr = strings;

    if (asTemplateStringsArr[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
    }

    styles += asTemplateStringsArr[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i]);

    if (stringMode) {
      var templateStringsArr = strings;

      if (templateStringsArr[i] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles += templateStringsArr[i];
    }
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + match[1];
  }

  var name = (0,_emotion_hash__WEBPACK_IMPORTED_MODULE_0__["default"])(styles) + identifierName;

  {
    var devStyles = {
      name: name,
      styles: styles,
      next: cursor,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }
    };
    return devStyles;
  }
}




/***/ },

/***/ "./node_modules/@emotion/sheet/dist/emotion-sheet.development.esm.js"
/*!***************************************************************************!*\
  !*** ./node_modules/@emotion/sheet/dist/emotion-sheet.development.esm.js ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StyleSheet: () => (/* binding */ StyleSheet)
/* harmony export */ });
var isDevelopment = true;

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/

function sheetForTag(tag) {
  if (tag.sheet) {
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i];
    }
  } // this function should always return with a value
  // TS can't understand it though so we make it stop complaining here


  return undefined;
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  tag.setAttribute('data-s', '');
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  // Using Node instead of HTMLElement since container may be a ShadowRoot
  function StyleSheet(options) {
    var _this = this;

    this._insertTag = function (tag) {
      var before;

      if (_this.tags.length === 0) {
        if (_this.insertionPoint) {
          before = _this.insertionPoint.nextSibling;
        } else if (_this.prepend) {
          before = _this.container.firstChild;
        } else {
          before = _this.before;
        }
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }

      _this.container.insertBefore(tag, before);

      _this.tags.push(tag);
    };

    this.isSpeedy = options.speedy === undefined ? !isDevelopment : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.insertionPoint = options.insertionPoint;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      this._insertTag(createStyleElement(this));
    }

    var tag = this.tags[this.tags.length - 1];

    {
      var isImportRule = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105;

      if (isImportRule && this._alreadyInsertedOrderInsensitiveRule) {
        // this would only cause problem in speedy mode
        // but we don't want enabling speedy to affect the observable behavior
        // so we report this error at all times
        console.error("You're attempting to insert the following rule:\n" + rule + '\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules.');
      }

      this._alreadyInsertedOrderInsensitiveRule = this._alreadyInsertedOrderInsensitiveRule || !isImportRule;
    }

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
        if (!/:(-moz-placeholder|-moz-focus-inner|-moz-focusring|-ms-input-placeholder|-moz-read-write|-moz-read-only|-ms-clear|-ms-expand|-ms-reveal){/.test(rule)) {
          console.error("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    this.tags.forEach(function (tag) {
      var _tag$parentNode;

      return (_tag$parentNode = tag.parentNode) == null ? void 0 : _tag$parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;

    {
      this._alreadyInsertedOrderInsensitiveRule = false;
    }
  };

  return StyleSheet;
}();




/***/ },

/***/ "./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.development.esm.js"
/*!***********************************************************************************************!*\
  !*** ./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.development.esm.js ***!
  \***********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createStyled)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js");
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js");
/* harmony import */ var _emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/use-insertion-effect-with-fallbacks */ "./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js");
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @emotion/is-prop-valid */ "./node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js");








var isDevelopment = true;

var testOmitPropsOnStringTag = _emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_6__["default"];

var testOmitPropsOnComponent = function testOmitPropsOnComponent(key) {
  return key !== 'theme';
};

var getDefaultShouldForwardProp = function getDefaultShouldForwardProp(tag) {
  return typeof tag === 'string' && // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
};
var composeShouldForwardProps = function composeShouldForwardProps(tag, options, isReal) {
  var shouldForwardProp;

  if (options) {
    var optionsShouldForwardProp = options.shouldForwardProp;
    shouldForwardProp = tag.__emotion_forwardProp && optionsShouldForwardProp ? function (propName) {
      return tag.__emotion_forwardProp(propName) && optionsShouldForwardProp(propName);
    } : optionsShouldForwardProp;
  }

  if (typeof shouldForwardProp !== 'function' && isReal) {
    shouldForwardProp = tag.__emotion_forwardProp;
  }

  return shouldForwardProp;
};

var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serialized = _ref.serialized,
      isStringTag = _ref.isStringTag;
  (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_4__.registerStyles)(cache, serialized, isStringTag);
  (0,_emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_3__.useInsertionEffectAlwaysWithSyncFallback)(function () {
    return (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_4__.insertStyles)(cache, serialized, isStringTag);
  });

  return null;
};

var createStyled = function createStyled(tag, options) {
  {
    if (tag === undefined) {
      throw new Error('You are trying to create a styled element with an undefined component.\nYou may have forgotten to import it.');
    }
  }

  var isReal = tag.__emotion_real === tag;
  var baseTag = isReal && tag.__emotion_base || tag;
  var identifierName;
  var targetClassName;

  if (options !== undefined) {
    identifierName = options.label;
    targetClassName = options.target;
  }

  var shouldForwardProp = composeShouldForwardProps(tag, options, isReal);
  var defaultShouldForwardProp = shouldForwardProp || getDefaultShouldForwardProp(baseTag);
  var shouldUseAs = !defaultShouldForwardProp('as');
  return function () {
    // eslint-disable-next-line prefer-rest-params
    var args = arguments;
    var styles = isReal && tag.__emotion_styles !== undefined ? tag.__emotion_styles.slice(0) : [];

    if (identifierName !== undefined) {
      styles.push("label:" + identifierName + ";");
    }

    if (args[0] == null || args[0].raw === undefined) {
      // eslint-disable-next-line prefer-spread
      styles.push.apply(styles, args);
    } else {
      var templateStringsArr = args[0];

      if (templateStringsArr[0] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles.push(templateStringsArr[0]);
      var len = args.length;
      var i = 1;

      for (; i < len; i++) {
        if (templateStringsArr[i] === undefined) {
          console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
        }

        styles.push(args[i], templateStringsArr[i]);
      }
    }

    var Styled = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_1__.w)(function (props, cache, ref) {
      var FinalTag = shouldUseAs && props.as || baseTag;
      var className = '';
      var classInterpolations = [];
      var mergedProps = props;

      if (props.theme == null) {
        mergedProps = {};

        for (var key in props) {
          mergedProps[key] = props[key];
        }

        mergedProps.theme = react__WEBPACK_IMPORTED_MODULE_5__.useContext(_emotion_react__WEBPACK_IMPORTED_MODULE_1__.T);
      }

      if (typeof props.className === 'string') {
        className = (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_4__.getRegisteredStyles)(cache.registered, classInterpolations, props.className);
      } else if (props.className != null) {
        className = props.className + " ";
      }

      var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_2__.serializeStyles)(styles.concat(classInterpolations), cache.registered, mergedProps);
      className += cache.key + "-" + serialized.name;

      if (targetClassName !== undefined) {
        className += " " + targetClassName;
      }

      var finalShouldForwardProp = shouldUseAs && shouldForwardProp === undefined ? getDefaultShouldForwardProp(FinalTag) : defaultShouldForwardProp;
      var newProps = {};

      for (var _key in props) {
        if (shouldUseAs && _key === 'as') continue;

        if (finalShouldForwardProp(_key)) {
          newProps[_key] = props[_key];
        }
      }

      newProps.className = className;

      if (ref) {
        newProps.ref = ref;
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(react__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(Insertion, {
        cache: cache,
        serialized: serialized,
        isStringTag: typeof FinalTag === 'string'
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5__.createElement(FinalTag, newProps));
    });
    Styled.displayName = identifierName !== undefined ? identifierName : "Styled(" + (typeof baseTag === 'string' ? baseTag : baseTag.displayName || baseTag.name || 'Component') + ")";
    Styled.defaultProps = tag.defaultProps;
    Styled.__emotion_real = Styled;
    Styled.__emotion_base = baseTag;
    Styled.__emotion_styles = styles;
    Styled.__emotion_forwardProp = shouldForwardProp;
    Object.defineProperty(Styled, 'toString', {
      value: function value() {
        if (targetClassName === undefined && isDevelopment) {
          return 'NO_COMPONENT_SELECTOR';
        }

        return "." + targetClassName;
      }
    });

    Styled.withComponent = function (nextTag, nextOptions) {
      var newStyled = createStyled(nextTag, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, options, nextOptions, {
        shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
      }));
      return newStyled.apply(void 0, styles);
    };

    return Styled;
  };
};




/***/ },

/***/ "./node_modules/@emotion/unitless/dist/emotion-unitless.esm.js"
/*!*********************************************************************!*\
  !*** ./node_modules/@emotion/unitless/dist/emotion-unitless.esm.js ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ unitlessKeys)
/* harmony export */ });
var unitlessKeys = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  scale: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};




/***/ },

/***/ "./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js"
/*!***********************************************************************************************************************************!*\
  !*** ./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js ***!
  \***********************************************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useInsertionEffectAlwaysWithSyncFallback: () => (/* binding */ useInsertionEffectAlwaysWithSyncFallback),
/* harmony export */   useInsertionEffectWithLayoutFallback: () => (/* binding */ useInsertionEffectWithLayoutFallback)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var syncFallback = function syncFallback(create) {
  return create();
};

var useInsertionEffect = react__WEBPACK_IMPORTED_MODULE_0__['useInsertion' + 'Effect'] ? react__WEBPACK_IMPORTED_MODULE_0__['useInsertion' + 'Effect'] : false;
var useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect || syncFallback;
var useInsertionEffectWithLayoutFallback = useInsertionEffect || react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect;




/***/ },

/***/ "./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js"
/*!***********************************************************************!*\
  !*** ./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRegisteredStyles: () => (/* binding */ getRegisteredStyles),
/* harmony export */   insertStyles: () => (/* binding */ insertStyles),
/* harmony export */   registerStyles: () => (/* binding */ registerStyles)
/* harmony export */ });
var isBrowser = true;

function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className] + ";");
    } else if (className) {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var registerStyles = function registerStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser === false ) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }
};
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  registerStyles(cache, serialized, isStringTag);
  var className = cache.key + "-" + serialized.name;

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      cache.insert(serialized === current ? "." + className : '', current, cache.sheet, true);

      current = current.next;
    } while (current !== undefined);
  }
};




/***/ },

/***/ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js"
/*!*****************************************************************************!*\
  !*** ./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js ***!
  \*****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ weakMemoize)
/* harmony export */ });
var weakMemoize = function weakMemoize(func) {
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // Use non-null assertion because we just checked that the cache `has` it
      // This allows us to remove `undefined` from the return value
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};




/***/ },

/***/ "./src/editor/components/animation-panel.js"
/*!**************************************************!*\
  !*** ./src/editor/components/animation-panel.js ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnimationPanel: () => (/* binding */ AnimationPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_wordpress__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/wordpress */ "./src/editor/config/wordpress.js");
/* harmony import */ var _shared_animation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/animation */ "./src/shared/animation.js");
/* harmony import */ var _shared_animation_options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/animation-options */ "./src/shared/animation-options.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */




/**
 * Animation controls shown below layout settings.
 */

function AnimationPanel({
  layout,
  onChangeLayout,
  onResetLayout
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanel, {
    className: "blablablocks-popup-editor-tools-panel",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation', 'blablablocks-popup'),
    resetAll: () => onResetLayout({
      entranceAnimation: _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.layout?.entranceAnimation || 'fade',
      exitAnimation: _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.layout?.exitAnimation || 'fade',
      animationDuration: (0,_shared_animation__WEBPACK_IMPORTED_MODULE_3__.normalizeAnimationDuration)(_config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.layout?.animationDuration || _shared_animation__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_ANIMATION_DURATION)
    }),
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
      hasValue: () => layout.entranceAnimation !== _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.layout?.entranceAnimation,
      isShownByDefault: true,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Entrance animation', 'blablablocks-popup'),
      onDeselect: () => onChangeLayout('entranceAnimation', _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.layout?.entranceAnimation || 'fade'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Entrance animation', 'blablablocks-popup'),
        value: layout.entranceAnimation,
        options: _shared_animation_options__WEBPACK_IMPORTED_MODULE_4__.ANIMATION_CHOICES,
        onChange: value => onChangeLayout('entranceAnimation', value)
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
      hasValue: () => layout.exitAnimation !== _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.layout?.exitAnimation,
      isShownByDefault: true,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exit animation', 'blablablocks-popup'),
      onDeselect: () => onChangeLayout('exitAnimation', _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.layout?.exitAnimation || 'fade'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exit animation', 'blablablocks-popup'),
        value: layout.exitAnimation,
        options: _shared_animation_options__WEBPACK_IMPORTED_MODULE_4__.ANIMATION_CHOICES,
        onChange: value => onChangeLayout('exitAnimation', value)
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
      hasValue: () => layout.animationDuration !== _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.layout?.animationDuration,
      isShownByDefault: true,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation duration', 'blablablocks-popup'),
      onDeselect: () => onChangeLayout('animationDuration', (0,_shared_animation__WEBPACK_IMPORTED_MODULE_3__.normalizeAnimationDuration)(_config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.layout?.animationDuration || _shared_animation__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_ANIMATION_DURATION)),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalNumberControl, {
        __next40pxDefaultSize: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation duration', 'blablablocks-popup'),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Seconds.', 'blablablocks-popup'),
        min: 0,
        step: 0.1,
        value: (0,_shared_animation__WEBPACK_IMPORTED_MODULE_3__.normalizeAnimationDuration)(layout.animationDuration),
        onChange: value => onChangeLayout('animationDuration', (0,_shared_animation__WEBPACK_IMPORTED_MODULE_3__.normalizeAnimationDuration)(value, 0))
      })
    })]
  });
}

/***/ },

/***/ "./src/editor/components/canvas-preview.js"
/*!*************************************************!*\
  !*** ./src/editor/components/canvas-preview.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CanvasPreview: () => (/* binding */ CanvasPreview)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_wordpress__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/wordpress */ "./src/editor/config/wordpress.js");
/* harmony import */ var _utils_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/settings */ "./src/editor/utils/settings.js");
/* harmony import */ var _utils_canvas_preview__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/canvas-preview */ "./src/editor/utils/canvas-preview.js");
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */



const canvasClassName = 'blablablocks-popup-editor-canvas';
const animatingCanvasClassName = 'blablablocks-popup-editor-canvas--animating';
const getEditorCanvases = document => {
  const canvases = [];
  if (document.body?.classList.contains('editor-styles-wrapper')) {
    canvases.push(document.body);
  }
  document.querySelectorAll('.editor-styles-wrapper').forEach(element => {
    if (!canvases.includes(element)) {
      canvases.push(element);
    }
  });
  return canvases;
};
const getEditorDocuments = () => {
  const documents = [window.document];
  const iframes = window.document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    if (iframe.contentDocument) {
      documents.push(iframe.contentDocument);
    }
  });
  return documents;
};
const applyPreviewVariables = (canvas, variables, settings) => {
  canvas.classList.add(canvasClassName);
  canvas.dataset.popupEntranceAnimation = settings.layout?.entranceAnimation || 'fade';
  Object.entries(variables).forEach(([property, value]) => {
    canvas.style.setProperty(property, value);
  });
};
const clearPreviewVariables = canvas => {
  canvas.classList.remove(canvasClassName);
  canvas.classList.remove(animatingCanvasClassName);
  delete canvas.dataset.popupEntranceAnimation;
  _utils_canvas_preview__WEBPACK_IMPORTED_MODULE_4__.canvasPreviewVariables.forEach(property => {
    canvas.style.removeProperty(property);
  });
};
const replayPreviewAnimation = (canvas, settings) => {
  const duration = Number(settings.layout?.animationDuration || 0.3) * 1000;
  canvas.classList.remove(animatingCanvasClassName);
  void canvas.offsetHeight; // Force a style flush so changing controls can replay the preview.
  canvas.classList.add(animatingCanvasClassName);
  window.setTimeout(() => {
    canvas.classList.remove(animatingCanvasClassName);
  }, Math.max(120, duration + 100));
};

/**
 * Keeps the block editor canvas visually aligned with the popup settings.
 */
function CanvasPreview() {
  const lastAnimationSignature = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)('');
  const postType = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => select('core/editor').getCurrentPostType(), []);
  const meta = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => select('core/editor').getEditedPostAttribute('meta') || {}, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (postType !== _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.config.postType) {
      return undefined;
    }
    const settings = (0,_utils_settings__WEBPACK_IMPORTED_MODULE_3__.mergeSettings)(meta[_config_wordpress__WEBPACK_IMPORTED_MODULE_2__.metaKey]);
    const variables = (0,_utils_canvas_preview__WEBPACK_IMPORTED_MODULE_4__.getCanvasPreviewVariables)(settings);
    const animationSignature = [settings.layout?.entranceAnimation || 'fade', settings.layout?.animationDuration || 0.3].join(':');
    const shouldReplayAnimation = animationSignature !== lastAnimationSignature.current;
    let hasReplayedAnimation = false;
    lastAnimationSignature.current = animationSignature;
    const appliedCanvases = new Set();
    const syncPreview = () => {
      getEditorDocuments().flatMap(getEditorCanvases).forEach(canvas => {
        appliedCanvases.add(canvas);
        applyPreviewVariables(canvas, variables, settings);
        if (shouldReplayAnimation && !hasReplayedAnimation) {
          replayPreviewAnimation(canvas, settings);
        }
      });
      hasReplayedAnimation = hasReplayedAnimation || shouldReplayAnimation;
    };
    syncPreview();
    const observer = new window.MutationObserver(syncPreview);
    observer.observe(window.document.body, {
      childList: true,
      subtree: true
    });
    const interval = window.setInterval(syncPreview, 500);
    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      appliedCanvases.forEach(clearPreviewVariables);
    };
  }, [meta, postType]);
  return null;
}

/***/ },

/***/ "./src/editor/components/dimension-control.js"
/*!****************************************************!*\
  !*** ./src/editor/components/dimension-control.js ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PopupDimensionControl: () => (/* binding */ PopupDimensionControl)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/ui */ "./node_modules/@wordpress/ui/build-module/stack/stack.mjs");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_wordpress__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config/wordpress */ "./src/editor/config/wordpress.js");
/* harmony import */ var _utils_layout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/layout */ "./src/editor/utils/layout.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */



const dimensionUnits = [{
  value: 'px',
  label: 'px',
  step: 1
}, {
  value: 'em',
  label: 'em',
  step: 0.1
}, {
  value: 'rem',
  label: 'rem',
  step: 0.1
}, {
  value: '%',
  label: '%',
  step: 1
}, {
  value: 'vw',
  label: 'vw',
  step: 1
}, {
  value: 'vh',
  label: 'vh',
  step: 1
}];
const dimensionHelp = {
  fit: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fit contents.', 'blablablocks-popup'),
  grow: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Stretch to fill available space.', 'blablablocks-popup'),
  fixed: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Specify a fixed size.', 'blablablocks-popup')
};

/**
 * Width/height control that matches WordPress layout sizing semantics.
 */
function PopupDimensionControl({
  label,
  type,
  value,
  onChange
}) {
  const mode = (0,_utils_layout__WEBPACK_IMPORTED_MODULE_4__.getDimensionMode)(value, type);
  const fixedValue = (0,_utils_layout__WEBPACK_IMPORTED_MODULE_4__.getFixedDimensionValue)(value, type);
  const updateMode = nextMode => {
    onChange((0,_utils_layout__WEBPACK_IMPORTED_MODULE_4__.getDimensionValue)(nextMode, fixedValue, type));
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    className: "blablablocks-popup-editor-dimension-control",
    direction: "column",
    gap: "sm",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToggleGroupControl, {
      __next40pxDefaultSize: true,
      isBlock: true,
      label: label,
      help: dimensionHelp[mode],
      value: mode,
      onChange: updateMode,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToggleGroupControlOption, {
        value: "fit",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fit', 'blablablocks-popup')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToggleGroupControlOption, {
        value: "grow",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Grow', 'blablablocks-popup')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToggleGroupControlOption, {
        value: "fixed",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fixed', 'blablablocks-popup')
      })]
    }), 'fixed' === mode && _config_wordpress__WEBPACK_IMPORTED_MODULE_3__.UnitControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_config_wordpress__WEBPACK_IMPORTED_MODULE_3__.UnitControl, {
      __next40pxDefaultSize: true,
      hideLabelFromVision: true,
      className: "blablablocks-popup-editor-dimension-control__unit",
      label: label,
      min: 0,
      size: "__unstable-large",
      units: dimensionUnits,
      value: fixedValue,
      onChange: onChange
    })]
  });
}

/***/ },

/***/ "./src/editor/components/layout-panel.js"
/*!***********************************************!*\
  !*** ./src/editor/components/layout-panel.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LayoutPanel: () => (/* binding */ LayoutPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/ui */ "./node_modules/@wordpress/ui/build-module/stack/stack.mjs");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _dimension_control__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dimension-control */ "./src/editor/components/dimension-control.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */


/**
 * Popup placement, sizing, overlay, and close-button controls.
 */

function LayoutPanel({
  layout,
  position,
  style,
  onChangeLayout,
  onChangePosition,
  onChangeStyle
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout', 'blablablocks-popup'),
    initialOpen: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_dimension_control__WEBPACK_IMPORTED_MODULE_3__.PopupDimensionControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Width', 'blablablocks-popup'),
      type: "width",
      value: layout.width,
      onChange: value => onChangeLayout('width', value)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_dimension_control__WEBPACK_IMPORTED_MODULE_3__.PopupDimensionControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Height', 'blablablocks-popup'),
      type: "height",
      value: layout.height,
      onChange: value => onChangeLayout('height', value)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
      className: "blablablocks-popup-editor-position-control",
      direction: "column",
      gap: "sm",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalText, {
        className: "blablablocks-popup-editor-position-control__label",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Position', 'blablablocks-popup')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.AlignmentMatrixControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Popup position', 'blablablocks-popup'),
        value: position,
        onChange: onChangePosition
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      __nextHasNoMarginBottom: true,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show overlay', 'blablablocks-popup'),
      checked: !!layout.overlay,
      onChange: value => onChangeLayout('overlay', !!value)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      __nextHasNoMarginBottom: true,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show close button', 'blablablocks-popup'),
      checked: !!layout.closeButton,
      onChange: value => onChangeLayout('closeButton', !!value)
    }), layout.closeButton && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalNumberControl, {
      __next40pxDefaultSize: true,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Close size', 'blablablocks-popup'),
      min: 12,
      step: 1,
      value: style.closeSize,
      onChange: value => onChangeStyle('closeSize', Number(value) || 0)
    })]
  });
}

/***/ },

/***/ "./src/editor/components/popup-inspector-panel.js"
/*!********************************************************!*\
  !*** ./src/editor/components/popup-inspector-panel.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PopupInspectorPanel: () => (/* binding */ PopupInspectorPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/cog.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/navigation-overlay.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/styles.mjs");
/* harmony import */ var _node_modules_wordpress_components_build_module_tabs_index_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../node_modules/@wordpress/components/build-module/tabs/index.mjs */ "./node_modules/@wordpress/components/build-module/tabs/index.mjs");
/* harmony import */ var _animation_panel__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./animation-panel */ "./src/editor/components/animation-panel.js");
/* harmony import */ var _layout_panel__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./layout-panel */ "./src/editor/components/layout-panel.js");
/* harmony import */ var _style_panel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./style-panel */ "./src/editor/components/style-panel.js");
/* harmony import */ var _summary_card__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./summary-card */ "./src/editor/components/summary-card.js");
/* harmony import */ var _config_wordpress__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../config/wordpress */ "./src/editor/config/wordpress.js");
/* harmony import */ var _config_constants__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../config/constants */ "./src/editor/config/constants.js");
/* harmony import */ var _utils_border__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../utils/border */ "./src/editor/utils/border.js");
/* harmony import */ var _utils_layout__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../utils/layout */ "./src/editor/utils/layout.js");
/* harmony import */ var _utils_settings__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../utils/settings */ "./src/editor/utils/settings.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__);
/**
 * WordPress dependencies
 */






/**
 * Internal dependencies
 */










/**
 * BlaBlaBlocks Popup block editor sidebar.
 */

function PopupInspectorPanel() {
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(_config_constants__WEBPACK_IMPORTED_MODULE_13__.TAB_SETTINGS);
  const postType = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => select('core/editor').getCurrentPostType(), []);
  const meta = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => select('core/editor').getEditedPostAttribute('meta') || {}, []);
  const {
    editPost
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useDispatch)('core/editor');
  const colorGradientSettings = (0,_config_wordpress__WEBPACK_IMPORTED_MODULE_12__.useMultipleOriginColorsAndGradients)();
  if (postType !== _config_wordpress__WEBPACK_IMPORTED_MODULE_12__.config.postType || !_config_wordpress__WEBPACK_IMPORTED_MODULE_12__.PluginSidebar) {
    return null;
  }
  const settings = (0,_utils_settings__WEBPACK_IMPORTED_MODULE_16__.mergeSettings)(meta[_config_wordpress__WEBPACK_IMPORTED_MODULE_12__.metaKey]);
  const layout = settings.layout;
  const style = settings.style;
  const updateGroup = (group, key, value) => {
    editPost({
      meta: {
        ...meta,
        [_config_wordpress__WEBPACK_IMPORTED_MODULE_12__.metaKey]: {
          ...settings,
          [group]: {
            ...settings[group],
            [key]: value
          }
        }
      }
    });
  };
  const updatePosition = value => {
    editPost({
      meta: {
        ...meta,
        [_config_wordpress__WEBPACK_IMPORTED_MODULE_12__.metaKey]: {
          ...settings,
          layout: {
            ...layout,
            ...(0,_utils_layout__WEBPACK_IMPORTED_MODULE_15__.parsePositionValue)(value)
          }
        }
      }
    });
  };
  const updateLayoutValues = values => {
    editPost({
      meta: {
        ...meta,
        [_config_wordpress__WEBPACK_IMPORTED_MODULE_12__.metaKey]: {
          ...settings,
          layout: {
            ...layout,
            ...values
          }
        }
      }
    });
  };
  const updateStyleValues = values => {
    editPost({
      meta: {
        ...meta,
        [_config_wordpress__WEBPACK_IMPORTED_MODULE_12__.metaKey]: {
          ...settings,
          style: {
            ...style,
            ...values
          }
        }
      }
    });
  };
  const updateBorder = value => {
    updateStyleValues({
      border: value || {},
      ...(0,_utils_border__WEBPACK_IMPORTED_MODULE_14__.borderToLegacyValues)(value, style)
    });
  };
  const colorSettings = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Popup background', 'blablablocks-popup'),
    value: style.popupBackground,
    onChange: value => updateGroup('style', 'popupBackground', value)
  }, layout.overlay && {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Overlay background', 'blablablocks-popup'),
    value: style.overlayBackground,
    onChange: value => updateGroup('style', 'overlayBackground', value)
  }, layout.closeButton && {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Close color', 'blablablocks-popup'),
    value: style.closeColor,
    onChange: value => updateGroup('style', 'closeColor', value)
  }, layout.closeButton && {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Close background', 'blablablocks-popup'),
    value: style.closeBackground,
    onChange: value => updateGroup('style', 'closeBackground', value)
  }].filter(Boolean);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(_config_wordpress__WEBPACK_IMPORTED_MODULE_12__.PluginSidebar, {
    name: _config_constants__WEBPACK_IMPORTED_MODULE_13__.SIDEBAR_NAME,
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Popup', 'blablablocks-popup'),
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"],
    className: "blablablocks-popup-editor-sidebar",
    isActiveByDefault: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_summary_card__WEBPACK_IMPORTED_MODULE_11__.SummaryCard, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(_node_modules_wordpress_components_build_module_tabs_index_mjs__WEBPACK_IMPORTED_MODULE_7__.Tabs, {
      selectedTabId: activeTab,
      onSelect: setActiveTab,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(_node_modules_wordpress_components_build_module_tabs_index_mjs__WEBPACK_IMPORTED_MODULE_7__.Tabs.TabList, {
        className: "blablablocks-popup-editor-inspector-tabs",
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Popup inspector tabs', 'blablablocks-popup'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_node_modules_wordpress_components_build_module_tabs_index_mjs__WEBPACK_IMPORTED_MODULE_7__.Tabs.Tab, {
          className: "blablablocks-popup-editor-inspector-tab",
          tabId: _config_constants__WEBPACK_IMPORTED_MODULE_13__.TAB_SETTINGS,
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Settings', 'blablablocks-popup'),
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Settings', 'blablablocks-popup'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"], {
            icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
            size: 24
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_node_modules_wordpress_components_build_module_tabs_index_mjs__WEBPACK_IMPORTED_MODULE_7__.Tabs.Tab, {
          className: "blablablocks-popup-editor-inspector-tab",
          tabId: _config_constants__WEBPACK_IMPORTED_MODULE_13__.TAB_STYLES,
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Styles', 'blablablocks-popup'),
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Styles', 'blablablocks-popup'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"], {
            icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
            size: 24
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(_node_modules_wordpress_components_build_module_tabs_index_mjs__WEBPACK_IMPORTED_MODULE_7__.Tabs.TabPanel, {
        tabId: _config_constants__WEBPACK_IMPORTED_MODULE_13__.TAB_SETTINGS,
        focusable: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_layout_panel__WEBPACK_IMPORTED_MODULE_9__.LayoutPanel, {
          layout: layout,
          position: (0,_utils_layout__WEBPACK_IMPORTED_MODULE_15__.getPositionValue)(layout),
          style: style,
          onChangeLayout: (key, value) => updateGroup('layout', key, value),
          onChangePosition: updatePosition,
          onChangeStyle: (key, value) => updateGroup('style', key, value)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_animation_panel__WEBPACK_IMPORTED_MODULE_8__.AnimationPanel, {
          layout: layout,
          onChangeLayout: (key, value) => updateGroup('layout', key, value),
          onResetLayout: updateLayoutValues
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_node_modules_wordpress_components_build_module_tabs_index_mjs__WEBPACK_IMPORTED_MODULE_7__.Tabs.TabPanel, {
        tabId: _config_constants__WEBPACK_IMPORTED_MODULE_13__.TAB_STYLES,
        focusable: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_style_panel__WEBPACK_IMPORTED_MODULE_10__.StylePanel, {
          colorGradientSettings: colorGradientSettings,
          colorSettings: colorSettings,
          style: style,
          onChangeStyle: (key, value) => updateGroup('style', key, value),
          onChangeStyleValues: updateStyleValues,
          onChangeBorder: updateBorder
        })
      })]
    })]
  });
}

/***/ },

/***/ "./src/editor/components/popup-settings-status-action.js"
/*!***************************************************************!*\
  !*** ./src/editor/components/popup-settings-status-action.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PopupSettingsStatusAction: () => (/* binding */ PopupSettingsStatusAction)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config/constants */ "./src/editor/config/constants.js");
/* harmony import */ var _config_wordpress__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config/wordpress */ "./src/editor/config/wordpress.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */



/**
 * Open the popup settings sidebar from the post status panel.
 */

function PopupSettingsStatusAction() {
  const {
    openGeneralSidebar
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)('core/edit-post');
  if (!_config_wordpress__WEBPACK_IMPORTED_MODULE_4__.PluginPostStatusInfo) {
    return null;
  }
  const openSettingsSidebar = () => {
    openGeneralSidebar(_config_constants__WEBPACK_IMPORTED_MODULE_3__.SIDEBAR_IDENTIFIER);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_config_wordpress__WEBPACK_IMPORTED_MODULE_4__.PluginPostStatusInfo, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      __next40pxDefaultSize: true,
      className: "blablablocks-popup-editor-settings-button",
      variant: "primary",
      onClick: openSettingsSidebar,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Popup settings', 'blablablocks-popup')
    })
  });
}

/***/ },

/***/ "./src/editor/components/popup-sidebar-auto-open.js"
/*!**********************************************************!*\
  !*** ./src/editor/components/popup-sidebar-auto-open.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PopupSidebarAutoOpen: () => (/* binding */ PopupSidebarAutoOpen)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/constants */ "./src/editor/config/constants.js");
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */


/**
 * Focus the selected popup inspector tab when no modal owns focus.
 */
const focusPopupSidebar = () => {
  if (window.document.querySelector('.blablablocks-popup-variation-modal')) {
    return false;
  }
  const selectedTab = window.document.getElementById(_config_constants__WEBPACK_IMPORTED_MODULE_2__.SIDEBAR_ELEMENT_ID)?.querySelector('.blablablocks-popup-editor-inspector-tab[aria-selected="true"]');
  return !!selectedTab;
};

/**
 * Open the popup sidebar when the editor loads and move focus into it.
 */
function PopupSidebarAutoOpen() {
  const isEditorReady = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => select('core/editor').__unstableIsEditorReady(), []);
  const isSidebarActive = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => select('core/interface').getActiveComplementaryArea('core') === _config_constants__WEBPACK_IMPORTED_MODULE_2__.SIDEBAR_IDENTIFIER, []);
  const {
    openGeneralSidebar
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useDispatch)('core/edit-post');
  const hasOpenedSidebar = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (!isEditorReady || hasOpenedSidebar.current) {
      return undefined;
    }
    let frameId = window.requestAnimationFrame(() => {
      frameId = window.requestAnimationFrame(() => {
        openGeneralSidebar(_config_constants__WEBPACK_IMPORTED_MODULE_2__.SIDEBAR_IDENTIFIER);
        hasOpenedSidebar.current = true;
      });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [isEditorReady, openGeneralSidebar]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
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
      subtree: true
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

/***/ },

/***/ "./src/editor/components/style-panel.js"
/*!**********************************************!*\
  !*** ./src/editor/components/style-panel.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StylePanel: () => (/* binding */ StylePanel)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_wordpress__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/wordpress */ "./src/editor/config/wordpress.js");
/* harmony import */ var _utils_border__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/border */ "./src/editor/utils/border.js");
/* harmony import */ var _utils_spacing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/spacing */ "./src/editor/utils/spacing.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */




/**
 * Design controls for popup color, spacing, and border.
 */

function StylePanel({
  colorGradientSettings,
  colorSettings,
  style,
  onChangeStyle,
  onChangeStyleValues,
  onChangeBorder
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [_config_wordpress__WEBPACK_IMPORTED_MODULE_2__.PanelColorSettings && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_config_wordpress__WEBPACK_IMPORTED_MODULE_2__.PanelColorSettings, {
      __experimentalIsRenderedInSidebar: true,
      className: "blablablocks-popup-editor-tools-panel",
      colorSettings: colorSettings,
      enableAlpha: true,
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Color', 'blablablocks-popup')
    }), _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.SpacingSizesControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanel, {
      className: "blablablocks-popup-editor-tools-panel",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Dimensions', 'blablablocks-popup'),
      resetAll: () => onChangeStyleValues({
        margin: _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.style?.margin || '24px',
        padding: _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.style?.padding || '32px'
      }),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
        hasValue: () => style.padding !== _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.style?.padding,
        isShownByDefault: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Padding', 'blablablocks-popup'),
        onDeselect: () => onChangeStyle('padding', _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.style?.padding || '32px'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_config_wordpress__WEBPACK_IMPORTED_MODULE_2__.SpacingSizesControl, {
          allowReset: false,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Padding', 'blablablocks-popup'),
          onChange: value => onChangeStyle('padding', (0,_utils_spacing__WEBPACK_IMPORTED_MODULE_4__.spacingValuesToCssBox)(value)),
          sides: _utils_spacing__WEBPACK_IMPORTED_MODULE_4__.spacingSides,
          values: (0,_utils_spacing__WEBPACK_IMPORTED_MODULE_4__.cssBoxToSpacingValues)(style.padding)
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
        hasValue: () => style.margin !== _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.style?.margin,
        isShownByDefault: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Margin', 'blablablocks-popup'),
        onDeselect: () => onChangeStyle('margin', _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.style?.margin || '24px'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_config_wordpress__WEBPACK_IMPORTED_MODULE_2__.SpacingSizesControl, {
          allowReset: false,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Margin', 'blablablocks-popup'),
          onChange: value => onChangeStyle('margin', (0,_utils_spacing__WEBPACK_IMPORTED_MODULE_4__.spacingValuesToCssBox)(value)),
          sides: _utils_spacing__WEBPACK_IMPORTED_MODULE_4__.spacingSides,
          values: (0,_utils_spacing__WEBPACK_IMPORTED_MODULE_4__.cssBoxToSpacingValues)(style.margin)
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanel, {
      className: "blablablocks-popup-editor-tools-panel",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border', 'blablablocks-popup'),
      resetAll: () => onChangeStyleValues({
        border: {},
        borderType: _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.style?.borderType || 'none',
        borderColor: _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.style?.borderColor || '#dcdcde',
        borderWidth: _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.style?.borderWidth || '1px',
        borderRadius: _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.style?.borderRadius || '8px'
      }),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
        hasValue: () => (0,_utils_border__WEBPACK_IMPORTED_MODULE_3__.hasBorderValue)((0,_utils_border__WEBPACK_IMPORTED_MODULE_3__.getBorderControlValue)(style)),
        isShownByDefault: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border', 'blablablocks-popup'),
        onDeselect: () => onChangeBorder(undefined),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.BorderBoxControl, {
          __experimentalIsRenderedInSidebar: true,
          __next40pxDefaultSize: true,
          enableAlpha: true,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border', 'blablablocks-popup'),
          onChange: onChangeBorder,
          popoverOffset: 36,
          popoverPlacement: "left-start",
          value: (0,_utils_border__WEBPACK_IMPORTED_MODULE_3__.getBorderControlValue)(style),
          ...colorGradientSettings
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
        hasValue: () => style.borderRadius !== _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.style?.borderRadius,
        isShownByDefault: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Radius', 'blablablocks-popup'),
        onDeselect: () => onChangeStyle('borderRadius', _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.defaults.style?.borderRadius || '8px'),
        children: _config_wordpress__WEBPACK_IMPORTED_MODULE_2__.BorderRadiusControl ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_config_wordpress__WEBPACK_IMPORTED_MODULE_2__.BorderRadiusControl, {
          __next40pxDefaultSize: true,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Radius', 'blablablocks-popup'),
          values: (0,_utils_border__WEBPACK_IMPORTED_MODULE_3__.cssRadiusToBorderRadiusValues)(style.borderRadius),
          onChange: value => onChangeStyle('borderRadius', (0,_utils_border__WEBPACK_IMPORTED_MODULE_3__.borderRadiusValuesToCss)(value))
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
          __next40pxDefaultSize: true,
          __nextHasNoMarginBottom: true,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Radius', 'blablablocks-popup'),
          value: style.borderRadius,
          onChange: value => onChangeStyle('borderRadius', value)
        })
      })]
    })]
  });
}

/***/ },

/***/ "./src/editor/components/summary-card.js"
/*!***********************************************!*\
  !*** ./src/editor/components/summary-card.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SummaryCard: () => (/* binding */ SummaryCard)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/navigation-overlay.mjs");
/* harmony import */ var _wordpress_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/ui */ "./node_modules/@wordpress/ui/build-module/stack/stack.mjs");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _config_wordpress__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../config/wordpress */ "./src/editor/config/wordpress.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * WordPress dependencies
 */





/**
 * Internal dependencies
 */


/**
 * Block-card style summary shown at the top of the popup sidebar.
 */

function SummaryCard() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    className: "block-editor-block-card blablablocks-popup-editor-summary",
    direction: "row",
    gap: "md",
    align: "flex-start",
    justify: "flex-start",
    children: [_config_wordpress__WEBPACK_IMPORTED_MODULE_5__.BlockIcon ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_config_wordpress__WEBPACK_IMPORTED_MODULE_5__.BlockIcon, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
      showColors: true
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalView, {
      as: "span",
      className: "block-editor-block-icon",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
        size: 24
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
      direction: "column",
      gap: "xs",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalHeading, {
        level: 2,
        className: "block-editor-block-card__title",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalText, {
          as: "span",
          className: "block-editor-block-card__name",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Popup', 'blablablocks-popup')
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalText, {
        className: "block-editor-block-card__description",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Configure how this popup appears, opens, and closes.', 'blablablocks-popup')
      })]
    })]
  });
}

/***/ },

/***/ "./src/editor/components/variation-chooser-modal.js"
/*!**********************************************************!*\
  !*** ./src/editor/components/variation-chooser-modal.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VariationChooserModal: () => (/* binding */ VariationChooserModal)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _config_wordpress__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../config/wordpress */ "./src/editor/config/wordpress.js");
/* harmony import */ var _config_constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../config/constants */ "./src/editor/config/constants.js");
/* harmony import */ var _config_variations__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../config/variations */ "./src/editor/config/variations.js");
/* harmony import */ var _utils_settings__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/settings */ "./src/editor/utils/settings.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * WordPress dependencies
 */






/**
 * Internal dependencies
 */





const removeVariationQueryParam = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete(_config_constants__WEBPACK_IMPORTED_MODULE_6__.VARIATION_QUERY_PARAM);
  window.history.replaceState({}, '', url.toString());
};
const getStoredVariationPostId = () => {
  try {
    return window.sessionStorage.getItem(_config_constants__WEBPACK_IMPORTED_MODULE_6__.VARIATION_SESSION_KEY);
  } catch (error) {
    return null;
  }
};
const clearStoredVariationPostId = () => {
  try {
    window.sessionStorage.removeItem(_config_constants__WEBPACK_IMPORTED_MODULE_6__.VARIATION_SESSION_KEY);
  } catch (error) {}
};
const createBlocksFromTemplate = blocks => blocks.map(block => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.createBlock)(block.name, block.attributes || {}, createBlocksFromTemplate(block.innerBlocks || [])));

/**
 * First-run starter layout chooser shown after creating a popup.
 */
function VariationChooserModal() {
  const [isOpen, setIsOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const [applyingVariation, setApplyingVariation] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const meta = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => select('core/editor').getEditedPostAttribute('meta') || {}, []);
  const settings = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => (0,_utils_settings__WEBPACK_IMPORTED_MODULE_8__.mergeSettings)(meta[_config_wordpress__WEBPACK_IMPORTED_MODULE_5__.metaKey]), [meta]);
  const {
    editPost,
    savePost
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)('core/editor');
  const {
    resetBlocks
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)('core/block-editor');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const params = new URLSearchParams(window.location.search);
    const storedPostId = getStoredVariationPostId();
    const currentPostId = String(_config_wordpress__WEBPACK_IMPORTED_MODULE_5__.config.postId || '');
    if (params.get(_config_constants__WEBPACK_IMPORTED_MODULE_6__.VARIATION_QUERY_PARAM) === '1' || currentPostId && storedPostId === currentPostId) {
      setIsOpen(true);
    }
  }, []);
  const closeModal = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useCallback)(() => {
    setIsOpen(false);
    removeVariationQueryParam();
    clearStoredVariationPostId();
  }, []);
  const applyVariation = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async variation => {
    const blocks = createBlocksFromTemplate(variation.template);
    const nextSettings = {
      ...settings,
      layout: {
        ...settings.layout,
        ...(variation.settings.layout || {})
      },
      style: {
        ...settings.style,
        ...(variation.settings.style || {})
      }
    };
    setApplyingVariation(variation.id);
    setError('');
    try {
      resetBlocks(blocks);
      editPost({
        content: (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.serialize)(blocks),
        meta: {
          ...meta,
          [_config_wordpress__WEBPACK_IMPORTED_MODULE_5__.metaKey]: nextSettings
        }
      });
      await savePost();
      closeModal();
    } catch (saveError) {
      setError(saveError?.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The selected popup type could not be saved.', 'blablablocks-popup'));
    } finally {
      setApplyingVariation('');
    }
  }, [closeModal, editPost, meta, resetBlocks, savePost, settings]);
  if (!isOpen) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Modal, {
    className: "blablablocks-popup-variation-modal",
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose popup type', 'blablablocks-popup'),
    size: "fill",
    onRequestClose: closeModal,
    children: [error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Notice, {
      status: "error",
      isDismissible: false,
      children: error
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalView, {
      className: "blablablocks-popup-variation-modal__intro",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalText, {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select a starting layout. You can still change the design, position, and behavior after it is added.', 'blablablocks-popup')
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalView, {
      className: "blablablocks-popup-variation-grid",
      children: _config_variations__WEBPACK_IMPORTED_MODULE_7__.POPUP_VARIATIONS.map(variation => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
        className: "blablablocks-popup-variation-card",
        onClick: () => applyVariation(variation),
        disabled: !!applyingVariation,
        isBusy: applyingVariation === variation.id,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalView, {
          as: "span",
          className: "blablablocks-popup-variation-card__image",
          "aria-hidden": "true",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalView, {
            as: "img",
            src: variation.image,
            alt: ""
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalView, {
          as: "span",
          className: "blablablocks-popup-variation-card__content",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalText, {
            as: "span",
            className: "blablablocks-popup-variation-card__title",
            children: variation.label
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalText, {
            as: "span",
            className: "blablablocks-popup-variation-card__description",
            children: variation.description
          })]
        })]
      }, variation.id))
    })]
  });
}

/***/ },

/***/ "./src/editor/config/constants.js"
/*!****************************************!*\
  !*** ./src/editor/config/constants.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SIDEBAR_ELEMENT_ID: () => (/* binding */ SIDEBAR_ELEMENT_ID),
/* harmony export */   SIDEBAR_IDENTIFIER: () => (/* binding */ SIDEBAR_IDENTIFIER),
/* harmony export */   SIDEBAR_NAME: () => (/* binding */ SIDEBAR_NAME),
/* harmony export */   SIDEBAR_PLUGIN_NAME: () => (/* binding */ SIDEBAR_PLUGIN_NAME),
/* harmony export */   TAB_SETTINGS: () => (/* binding */ TAB_SETTINGS),
/* harmony export */   TAB_STYLES: () => (/* binding */ TAB_STYLES),
/* harmony export */   VARIATION_QUERY_PARAM: () => (/* binding */ VARIATION_QUERY_PARAM),
/* harmony export */   VARIATION_SESSION_KEY: () => (/* binding */ VARIATION_SESSION_KEY)
/* harmony export */ });
/**
 * Editor sidebar constants.
 */
const SIDEBAR_PLUGIN_NAME = 'blablablocks-popup-inspector';
const SIDEBAR_NAME = 'blablablocks-popup-sidebar';
const SIDEBAR_IDENTIFIER = `${SIDEBAR_PLUGIN_NAME}/${SIDEBAR_NAME}`;
const SIDEBAR_ELEMENT_ID = SIDEBAR_IDENTIFIER.replace('/', ':');
const TAB_SETTINGS = 'settings';
const TAB_STYLES = 'styles';
const VARIATION_QUERY_PARAM = 'blablablocks_popup_variations';
const VARIATION_SESSION_KEY = 'blablablocks-popup-created-post';

/***/ },

/***/ "./src/editor/config/variations.js"
/*!*****************************************!*\
  !*** ./src/editor/config/variations.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   POPUP_VARIATIONS: () => (/* binding */ POPUP_VARIATIONS)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wordpress */ "./src/editor/config/wordpress.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */

const variationImage = filename => `${_wordpress__WEBPACK_IMPORTED_MODULE_1__.pluginUrl}assets/variations/${filename}`;
const heading = content => ({
  name: 'core/heading',
  attributes: {
    content,
    level: 2
  }
});
const paragraph = content => ({
  name: 'core/paragraph',
  attributes: {
    content
  }
});
const button = text => ({
  name: 'core/buttons',
  innerBlocks: [{
    name: 'core/button',
    attributes: {
      text
    }
  }]
});
const group = (innerBlocks, attributes = {}) => ({
  name: 'core/group',
  attributes: {
    layout: {
      type: 'constrained'
    },
    ...attributes
  },
  innerBlocks
});

/**
 * Starter popup variations shown once after creating a popup.
 */
const POPUP_VARIATIONS = [{
  id: 'modal',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Modal Popup', 'blablablocks-popup'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Centered announcement, offer, or form prompt.', 'blablablocks-popup'),
  image: variationImage('modal.png'),
  settings: {
    layout: {
      width: '640px',
      height: 'auto',
      horizontal: 'center',
      vertical: 'center',
      overlay: true,
      closeButton: true,
      entranceAnimation: 'zoom',
      exitAnimation: 'zoom',
      animationDuration: 0.3
    },
    style: {
      padding: '32px',
      borderRadius: '8px'
    }
  },
  template: [group([heading((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Popup headline', 'blablablocks-popup')), paragraph((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add your popup message, form, offer, or call to action.', 'blablablocks-popup')), button((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Get started', 'blablablocks-popup'))])]
}, {
  id: 'slide-in',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slide-in Popup', 'blablablocks-popup'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('A side panel for offers, signups, or contextual prompts.', 'blablablocks-popup'),
  image: variationImage('slide-in.png'),
  settings: {
    layout: {
      width: '420px',
      height: 'auto',
      horizontal: 'right',
      vertical: 'center',
      overlay: true,
      closeButton: true,
      entranceAnimation: 'slide-left',
      exitAnimation: 'slide-right',
      animationDuration: 0.35
    },
    style: {
      padding: '28px',
      borderRadius: '8px'
    }
  },
  template: [group([heading((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Limited-time offer', 'blablablocks-popup')), paragraph((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use this space for a focused message that slides in without taking over the page.', 'blablablocks-popup')), button((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('View offer', 'blablablocks-popup'))])]
}, {
  id: 'floating-bar',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Floating Bar', 'blablablocks-popup'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('A compact top or bottom bar for site-wide notices.', 'blablablocks-popup'),
  image: variationImage('floating-bar.png'),
  settings: {
    layout: {
      width: '100%',
      height: 'auto',
      horizontal: 'center',
      vertical: 'top',
      overlay: false,
      closeButton: true,
      entranceAnimation: 'slide-down',
      exitAnimation: 'slide-up',
      animationDuration: 0.3
    },
    style: {
      padding: '16px 24px',
      borderRadius: '0px'
    }
  },
  template: [group([paragraph((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Announce shipping updates, discounts, or important news in a floating bar.', 'blablablocks-popup'))], {
    layout: {
      type: 'flex',
      justifyContent: 'center'
    }
  })]
}, {
  id: 'fullscreen',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fullscreen Popup', 'blablablocks-popup'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('A full-canvas takeover for launches, gates, or campaigns.', 'blablablocks-popup'),
  image: variationImage('fullscreen.png'),
  settings: {
    layout: {
      width: '100%',
      height: '100%',
      horizontal: 'center',
      vertical: 'center',
      overlay: true,
      closeButton: true,
      entranceAnimation: 'fade',
      exitAnimation: 'fade',
      animationDuration: 0.35
    },
    style: {
      padding: '48px',
      borderRadius: '0px'
    }
  },
  template: [group([heading((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Make a bigger announcement', 'blablablocks-popup')), paragraph((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use a fullscreen popup for high-priority campaigns, gated content, or product launches.', 'blablablocks-popup')), button((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Continue', 'blablablocks-popup'))])]
}, {
  id: 'toast',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Toast / Small Notification', 'blablablocks-popup'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('A small notification for short messages and reminders.', 'blablablocks-popup'),
  image: variationImage('toast.png'),
  settings: {
    layout: {
      width: '360px',
      height: 'auto',
      horizontal: 'right',
      vertical: 'bottom',
      overlay: false,
      closeButton: true,
      entranceAnimation: 'slide-up',
      exitAnimation: 'slide-down',
      animationDuration: 0.3
    },
    style: {
      padding: '20px',
      borderRadius: '8px'
    }
  },
  template: [group([heading((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Quick update', 'blablablocks-popup')), paragraph((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Share a brief notification without interrupting the page.', 'blablablocks-popup'))])]
}];

/***/ },

/***/ "./src/editor/config/wordpress.js"
/*!****************************************!*\
  !*** ./src/editor/config/wordpress.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BlockIcon: () => (/* binding */ BlockIcon),
/* harmony export */   BorderRadiusControl: () => (/* binding */ BorderRadiusControl),
/* harmony export */   PanelColorSettings: () => (/* binding */ PanelColorSettings),
/* harmony export */   PluginPostStatusInfo: () => (/* binding */ PluginPostStatusInfo),
/* harmony export */   PluginSidebar: () => (/* binding */ PluginSidebar),
/* harmony export */   SpacingSizesControl: () => (/* binding */ SpacingSizesControl),
/* harmony export */   UnitControl: () => (/* binding */ UnitControl),
/* harmony export */   config: () => (/* binding */ config),
/* harmony export */   defaults: () => (/* binding */ defaults),
/* harmony export */   metaKey: () => (/* binding */ metaKey),
/* harmony export */   pluginUrl: () => (/* binding */ pluginUrl),
/* harmony export */   registerPlugin: () => (/* binding */ registerPlugin),
/* harmony export */   useMultipleOriginColorsAndGradients: () => (/* binding */ useMultipleOriginColorsAndGradients)
/* harmony export */ });
/**
 * WordPress globals and PHP-injected editor configuration.
 */
const config = window.BlaBlaBlocksPopupEditor || {};
const defaults = config.defaults || {};
const metaKey = config.metaKey || '_popup_block_settings';
const pluginUrl = config.pluginUrl || '';
const PluginSidebar = window.wp?.editor?.PluginSidebar || window.wp?.editPost?.PluginSidebar;
const PluginPostStatusInfo = window.wp?.editor?.PluginPostStatusInfo || window.wp?.editPost?.PluginPostStatusInfo;
const registerPlugin = window.wp?.plugins?.registerPlugin;
const BlockIcon = window.wp?.blockEditor?.BlockIcon;
const PanelColorSettings = window.wp?.blockEditor?.PanelColorSettings;
const BorderRadiusControl = window.wp?.blockEditor?.__experimentalBorderRadiusControl;
const SpacingSizesControl = window.wp?.blockEditor?.__experimentalSpacingSizesControl;
const UnitControl = window.wp?.blockEditor?.__experimentalUnitControl || window.wp?.components?.__experimentalUnitControl;
const useMultipleOriginColorsAndGradients = window.wp?.blockEditor?.__experimentalUseMultipleOriginColorsAndGradients || (() => ({}));

/***/ },

/***/ "./src/editor/index.js"
/*!*****************************!*\
  !*** ./src/editor/index.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/navigation-overlay.mjs");
/* harmony import */ var _config_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config/constants */ "./src/editor/config/constants.js");
/* harmony import */ var _config_wordpress__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config/wordpress */ "./src/editor/config/wordpress.js");
/* harmony import */ var _components_canvas_preview__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/canvas-preview */ "./src/editor/components/canvas-preview.js");
/* harmony import */ var _components_popup_inspector_panel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/popup-inspector-panel */ "./src/editor/components/popup-inspector-panel.js");
/* harmony import */ var _components_popup_sidebar_auto_open__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/popup-sidebar-auto-open */ "./src/editor/components/popup-sidebar-auto-open.js");
/* harmony import */ var _components_popup_settings_status_action__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/popup-settings-status-action */ "./src/editor/components/popup-settings-status-action.js");
/* harmony import */ var _components_variation_chooser_modal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/variation-chooser-modal */ "./src/editor/components/variation-chooser-modal.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */








function PopupEditorPlugin() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_canvas_preview__WEBPACK_IMPORTED_MODULE_4__.CanvasPreview, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_popup_inspector_panel__WEBPACK_IMPORTED_MODULE_5__.PopupInspectorPanel, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_popup_sidebar_auto_open__WEBPACK_IMPORTED_MODULE_6__.PopupSidebarAutoOpen, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_popup_settings_status_action__WEBPACK_IMPORTED_MODULE_7__.PopupSettingsStatusAction, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_variation_chooser_modal__WEBPACK_IMPORTED_MODULE_8__.VariationChooserModal, {})]
  });
}

/**
 * Register the BlaBlaBlocks Popup editor plugin.
 */
if (_config_wordpress__WEBPACK_IMPORTED_MODULE_3__.registerPlugin) {
  (0,_config_wordpress__WEBPACK_IMPORTED_MODULE_3__.registerPlugin)(_config_constants__WEBPACK_IMPORTED_MODULE_2__.SIDEBAR_PLUGIN_NAME, {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
    render: PopupEditorPlugin
  });
}

/***/ },

/***/ "./src/editor/utils/border.js"
/*!************************************!*\
  !*** ./src/editor/utils/border.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   borderRadiusValuesToCss: () => (/* binding */ borderRadiusValuesToCss),
/* harmony export */   borderToLegacyValues: () => (/* binding */ borderToLegacyValues),
/* harmony export */   cssRadiusToBorderRadiusValues: () => (/* binding */ cssRadiusToBorderRadiusValues),
/* harmony export */   getBorderControlValue: () => (/* binding */ getBorderControlValue),
/* harmony export */   hasBorderValue: () => (/* reexport safe */ _shared_border__WEBPACK_IMPORTED_MODULE_0__.hasBorderValue)
/* harmony export */ });
/* harmony import */ var _shared_border__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/border */ "./src/shared/border.js");
/**
 * Internal dependencies
 */


/**
 * Convert CSS border-radius shorthand into BorderRadiusControl corner values.
 *
 * @param {string|Object} value CSS shorthand or existing corner values.
 * @return {Object|undefined} Border radius corner values.
 */
const cssRadiusToBorderRadiusValues = value => {
  if (value && typeof value === 'object') {
    return value;
  }
  const parts = String(value || '').split('/')[0].trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return undefined;
  }
  const [topLeft, topRight = topLeft, bottomRight = topLeft, bottomLeft = topRight] = parts;
  return {
    topLeft,
    topRight,
    bottomRight,
    bottomLeft
  };
};

/**
 * Convert BorderRadiusControl corner values back to CSS shorthand.
 *
 * @param {string|Object} values Border radius corner values.
 * @return {string} CSS border-radius shorthand.
 */
const borderRadiusValuesToCss = values => {
  if (typeof values === 'string') {
    return values;
  }
  if (!values || typeof values !== 'object') {
    return '';
  }
  const topLeft = values.topLeft || '';
  const topRight = values.topRight || '';
  const bottomRight = values.bottomRight || '';
  const bottomLeft = values.bottomLeft || '';
  if (!topLeft && !topRight && !bottomRight && !bottomLeft) {
    return '';
  }
  if (topLeft === topRight && topLeft === bottomRight && topLeft === bottomLeft) {
    return topLeft;
  }
  if (topLeft === bottomRight && topRight === bottomLeft) {
    return `${topLeft} ${topRight}`;
  }
  if (topRight === bottomLeft) {
    return `${topLeft} ${topRight} ${bottomRight}`;
  }
  return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
};
const getFlatBorder = border => {
  const value = {
    color: border?.color,
    style: border?.style,
    width: border?.width
  };
  return (0,_shared_border__WEBPACK_IMPORTED_MODULE_0__.hasFlatBorderValue)(value) ? value : undefined;
};
const getSplitBorder = border => {
  if (!border || typeof border !== 'object') {
    return undefined;
  }
  const value = _shared_border__WEBPACK_IMPORTED_MODULE_0__.CSS_BOX_SIDES.reduce((sides, side) => {
    if ((0,_shared_border__WEBPACK_IMPORTED_MODULE_0__.hasFlatBorderValue)(border[side])) {
      sides[side] = border[side];
    }
    return sides;
  }, {});
  return Object.keys(value).length ? value : undefined;
};


/**
 * Normalize legacy border settings into BorderBoxControl's value shape.
 *
 * @param {Object} style Popup style settings.
 * @return {Object|undefined} BorderBoxControl border value.
 */
const getBorderControlValue = style => {
  const splitBorder = getSplitBorder(style.border);
  if (splitBorder) {
    return splitBorder;
  }
  const flatBorder = getFlatBorder(style.border);
  if (flatBorder) {
    return flatBorder;
  }
  if (style.borderType && 'none' !== style.borderType) {
    return {
      color: style.borderColor,
      style: style.borderType,
      width: style.borderWidth
    };
  }
  return undefined;
};

/**
 * Mirror BorderBoxControl values into legacy flat keys for runtime fallback.
 *
 * @param {Object} border BorderBoxControl border value.
 * @param {Object} style  Current popup style settings.
 * @return {Object} Legacy border settings.
 */
const borderToLegacyValues = (border, style) => {
  if (!(0,_shared_border__WEBPACK_IMPORTED_MODULE_0__.hasBorderValue)(border)) {
    return {
      borderType: 'none',
      borderColor: style.borderColor,
      borderWidth: style.borderWidth
    };
  }
  const values = (0,_shared_border__WEBPACK_IMPORTED_MODULE_0__.isBorderSide)(Object.keys(border)[0]) ? Object.values(border).find(value => value && typeof value === 'object' && (0,_shared_border__WEBPACK_IMPORTED_MODULE_0__.hasBorderValue)(value)) : border;
  return {
    borderType: values?.style || 'solid',
    borderColor: values?.color || style.borderColor,
    borderWidth: values?.width || style.borderWidth
  };
};

/***/ },

/***/ "./src/editor/utils/canvas-preview.js"
/*!********************************************!*\
  !*** ./src/editor/utils/canvas-preview.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canvasPreviewVariables: () => (/* binding */ canvasPreviewVariables),
/* harmony export */   getCanvasPreviewVariables: () => (/* binding */ getCanvasPreviewVariables)
/* harmony export */ });
/**
 * CSS variables controlled by popup settings in the editor preview.
 */
const canvasPreviewVariables = ['--blablablocks-popup-editor-width', '--blablablocks-popup-editor-height', '--blablablocks-popup-editor-align-x', '--blablablocks-popup-editor-align-y', '--blablablocks-popup-editor-overlay-background', '--blablablocks-popup-editor-background', '--blablablocks-popup-editor-border', '--blablablocks-popup-editor-radius', '--blablablocks-popup-editor-margin', '--blablablocks-popup-editor-padding', '--blablablocks-popup-editor-close-display', '--blablablocks-popup-editor-close-size', '--blablablocks-popup-editor-close-color', '--blablablocks-popup-editor-close-background', '--blablablocks-popup-editor-duration'];
const resolveCssValue = value => String(value || '').replace(/var:preset\|(color|gradient|spacing)\|([a-zA-Z0-9_-]+)/g, 'var(--wp--preset--$1--$2)');
const safeCssValue = (value, fallback) => {
  const resolved = resolveCssValue(value || fallback);
  return /^[#a-zA-Z0-9\s.,%()+*\/_-]+$/.test(resolved) ? resolved : fallback;
};
const getFlexAlignment = value => {
  if ('left' === value || 'top' === value) {
    return 'flex-start';
  }
  if ('right' === value || 'bottom' === value) {
    return 'flex-end';
  }
  return 'center';
};
const getBorder = style => {
  if (!style.borderType || 'none' === style.borderType) {
    return '0 solid transparent';
  }
  const width = safeCssValue(style.borderWidth, '1px');
  const type = ['solid', 'dashed', 'dotted', 'double'].includes(style.borderType) ? style.borderType : 'solid';
  const color = safeCssValue(style.borderColor, '#dcdcde');
  return `${width} ${type} ${color}`;
};

/**
 * Convert popup settings into preview CSS custom properties.
 */
const getCanvasPreviewVariables = settings => {
  const layout = settings.layout || {};
  const style = settings.style || {};
  const width = safeCssValue(layout.width, '640px');
  const closeSize = `${Math.max(12, Number(style.closeSize || 28))}px`;
  return {
    '--blablablocks-popup-editor-width': '100%' === width ? 'min(100%, 960px)' : width,
    '--blablablocks-popup-editor-height': safeCssValue(layout.height, 'auto'),
    '--blablablocks-popup-editor-align-x': getFlexAlignment(layout.horizontal),
    '--blablablocks-popup-editor-align-y': getFlexAlignment(layout.vertical),
    '--blablablocks-popup-editor-overlay-background': layout.overlay ? safeCssValue(style.overlayBackground, 'rgba(0,0,0,.55)') : '#f0f0f0',
    '--blablablocks-popup-editor-background': safeCssValue(style.popupBackground, '#ffffff'),
    '--blablablocks-popup-editor-border': getBorder(style),
    '--blablablocks-popup-editor-radius': safeCssValue(style.borderRadius, '8px'),
    '--blablablocks-popup-editor-margin': safeCssValue(style.margin, '24px'),
    '--blablablocks-popup-editor-padding': safeCssValue(style.padding, '32px'),
    '--blablablocks-popup-editor-close-display': layout.closeButton ? 'flex' : 'none',
    '--blablablocks-popup-editor-close-size': closeSize,
    '--blablablocks-popup-editor-close-color': safeCssValue(style.closeColor, '#1e1e1e'),
    '--blablablocks-popup-editor-close-background': safeCssValue(style.closeBackground, 'transparent'),
    '--blablablocks-popup-editor-duration': `${Number(layout.animationDuration || 0.3)}s`
  };
};

/***/ },

/***/ "./src/editor/utils/layout.js"
/*!************************************!*\
  !*** ./src/editor/utils/layout.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDimensionMode: () => (/* binding */ getDimensionMode),
/* harmony export */   getDimensionValue: () => (/* binding */ getDimensionValue),
/* harmony export */   getFixedDimensionValue: () => (/* binding */ getFixedDimensionValue),
/* harmony export */   getPositionValue: () => (/* binding */ getPositionValue),
/* harmony export */   parsePositionValue: () => (/* binding */ parsePositionValue)
/* harmony export */ });
/**
 * Convert layout settings into AlignmentMatrixControl's expected value.
 */
const getPositionValue = layout => {
  const vertical = layout.vertical || 'center';
  const horizontal = layout.horizontal || 'center';
  return `${vertical} ${horizontal}`;
};

/**
 * Convert AlignmentMatrixControl's value back into layout settings.
 */
const parsePositionValue = value => {
  const [vertical = 'center', horizontal = 'center'] = String(value || 'center center').split(' ');
  return {
    horizontal,
    vertical
  };
};
const getDimensionMode = (value, type) => {
  if ('height' === type && (!value || 'auto' === value)) {
    return 'fit';
  }
  if ('width' === type && (!value || 'fit-content' === value || 'auto' === value)) {
    return 'fit';
  }
  if ('100%' === value) {
    return 'grow';
  }
  return 'fixed';
};
const getFixedDimensionValue = (value, type) => {
  if ('fixed' === getDimensionMode(value, type)) {
    return value;
  }
  return 'height' === type ? '480px' : '640px';
};
const getDimensionValue = (mode, fixedValue, type) => {
  if ('fit' === mode) {
    return 'height' === type ? 'auto' : 'fit-content';
  }
  if ('grow' === mode) {
    return '100%';
  }
  return fixedValue;
};

/***/ },

/***/ "./src/editor/utils/settings.js"
/*!**************************************!*\
  !*** ./src/editor/utils/settings.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeSettings: () => (/* binding */ mergeSettings)
/* harmony export */ });
/* harmony import */ var _config_wordpress__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/wordpress */ "./src/editor/config/wordpress.js");
/* harmony import */ var _shared_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/animation */ "./src/shared/animation.js");
/* harmony import */ var _shared_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/settings */ "./src/shared/settings.js");
/**
 * Internal dependencies
 */




/**
 * Merge stored popup settings with the server-provided default shape.
 *
 * @param {Object|null} settings Stored popup settings.
 * @return {Object} Complete settings object.
 */
const mergeSettings = settings => {
  const merged = (0,_shared_settings__WEBPACK_IMPORTED_MODULE_2__.mergePopupSettings)(_config_wordpress__WEBPACK_IMPORTED_MODULE_0__.defaults, settings);
  return {
    ...merged,
    layout: {
      ...merged.layout,
      animationDuration: (0,_shared_animation__WEBPACK_IMPORTED_MODULE_1__.normalizeAnimationDuration)(merged.layout.animationDuration)
    }
  };
};

/***/ },

/***/ "./src/editor/utils/spacing.js"
/*!*************************************!*\
  !*** ./src/editor/utils/spacing.js ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cssBoxToSpacingValues: () => (/* binding */ cssBoxToSpacingValues),
/* harmony export */   spacingSides: () => (/* binding */ spacingSides),
/* harmony export */   spacingValuesToCssBox: () => (/* binding */ spacingValuesToCssBox)
/* harmony export */ });
/* harmony import */ var _shared_border__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/border */ "./src/shared/border.js");
/**
 * Internal dependencies
 */

const spacingSides = _shared_border__WEBPACK_IMPORTED_MODULE_0__.CSS_BOX_SIDES;

/**
 * Convert CSS spacing shorthand into SpacingSizesControl side values.
 *
 * @param {string|Object} value CSS shorthand or existing side values.
 * @return {Object} Spacing values by side.
 */
const cssBoxToSpacingValues = value => {
  if (value && typeof value === 'object') {
    return value;
  }
  const parts = String(value || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return {};
  }
  const [top, right = top, bottom = top, left = right] = parts;
  return {
    top,
    right,
    bottom,
    left
  };
};

/**
 * Convert SpacingSizesControl side values back to CSS shorthand.
 *
 * @param {Object} values Spacing values by side.
 * @return {string} CSS spacing shorthand.
 */
const spacingValuesToCssBox = values => {
  if (!values || typeof values !== 'object') {
    return '';
  }
  const top = values.top || values.vertical || '';
  const right = values.right || values.horizontal || '';
  const bottom = values.bottom || values.vertical || '';
  const left = values.left || values.horizontal || '';
  if (!top && !right && !bottom && !left) {
    return '';
  }
  if (top === right && top === bottom && top === left) {
    return top;
  }
  if (top === bottom && right === left) {
    return `${top} ${right}`;
  }
  if (right === left) {
    return `${top} ${right} ${bottom}`;
  }
  return `${top} ${right} ${bottom} ${left}`;
};

/***/ },

/***/ "./src/shared/animation-options.js"
/*!*****************************************!*\
  !*** ./src/shared/animation-options.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANIMATION_CHOICES: () => (/* binding */ ANIMATION_CHOICES)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/**
 * Animation choices shared by admin DataForm and editor controls.
 */
const ANIMATION_CHOICES = [{
  value: 'fade',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade', 'blablablocks-popup')
}, {
  value: 'zoom',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Zoom', 'blablablocks-popup')
}, {
  value: 'zoom-out',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Zoom out', 'blablablocks-popup')
}, {
  value: 'slide-up',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slide up', 'blablablocks-popup')
}, {
  value: 'slide-down',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slide down', 'blablablocks-popup')
}, {
  value: 'slide-left',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slide left', 'blablablocks-popup')
}, {
  value: 'slide-right',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slide right', 'blablablocks-popup')
}, {
  value: 'flip-up',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Flip up', 'blablablocks-popup')
}, {
  value: 'flip-down',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Flip down', 'blablablocks-popup')
}, {
  value: 'none',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('None', 'blablablocks-popup')
}];

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

/***/ "./src/shared/settings.js"
/*!********************************!*\
  !*** ./src/shared/settings.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergePopupSettings: () => (/* binding */ mergePopupSettings)
/* harmony export */ });
const SETTINGS_GROUPS = ['layout', 'style', 'advanced', 'conditions', 'triggers', 'rules'];
const clone = value => JSON.parse(JSON.stringify(value || {}));

/**
 * Merge stored popup settings into a complete default settings shape.
 *
 * @param {Object} defaults Default popup settings.
 * @param {Object} settings Stored popup settings.
 * @return {Object} Complete popup settings.
 */
const mergePopupSettings = (defaults, settings) => {
  const base = clone(defaults);
  const overrides = settings && typeof settings === 'object' ? clone(settings) : {};
  const merged = {
    ...base,
    ...overrides
  };
  SETTINGS_GROUPS.forEach(group => {
    merged[group] = {
      ...(base[group] || {}),
      ...(overrides[group] || {})
    };
  });
  return merged;
};

/***/ },

/***/ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js ***!
  \**********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {



var reactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

function getStatics(component) {
  // React v16.11 and below
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  } // React v16.12 and above


  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }
  }

  return targetComponent;
}

module.exports = hoistNonReactStatics;


/***/ },

/***/ "./src/editor/styles.scss"
/*!********************************!*\
  !*** ./src/editor/styles.scss ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./node_modules/react-is/cjs/react-is.development.js"
/*!***********************************************************!*\
  !*** ./node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************/
(__unused_webpack_module, exports) {

/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ },

/***/ "./node_modules/react-is/index.js"
/*!****************************************!*\
  !*** ./node_modules/react-is/index.js ***!
  \****************************************/
(module, __unused_webpack_exports, __webpack_require__) {



if (false) // removed by dead control flow
{} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/react-is/cjs/react-is.development.js");
}


/***/ },

/***/ "./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js"
/*!**********************************************************************************************!*\
  !*** ./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js ***!
  \**********************************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


 true &&
  (function () {
    function is(x, y) {
      return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
    }
    function useSyncExternalStore$2(subscribe, getSnapshot) {
      didWarnOld18Alpha ||
        void 0 === React.startTransition ||
        ((didWarnOld18Alpha = !0),
        console.error(
          "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
        ));
      var value = getSnapshot();
      if (!didWarnUncachedGetSnapshot) {
        var cachedValue = getSnapshot();
        objectIs(value, cachedValue) ||
          (console.error(
            "The result of getSnapshot should be cached to avoid an infinite loop"
          ),
          (didWarnUncachedGetSnapshot = !0));
      }
      cachedValue = useState({
        inst: { value: value, getSnapshot: getSnapshot }
      });
      var inst = cachedValue[0].inst,
        forceUpdate = cachedValue[1];
      useLayoutEffect(
        function () {
          inst.value = value;
          inst.getSnapshot = getSnapshot;
          checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
        },
        [subscribe, value, getSnapshot]
      );
      useEffect(
        function () {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
          return subscribe(function () {
            checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
          });
        },
        [subscribe]
      );
      useDebugValue(value);
      return value;
    }
    function checkIfSnapshotChanged(inst) {
      var latestGetSnapshot = inst.getSnapshot;
      inst = inst.value;
      try {
        var nextValue = latestGetSnapshot();
        return !objectIs(inst, nextValue);
      } catch (error) {
        return !0;
      }
    }
    function useSyncExternalStore$1(subscribe, getSnapshot) {
      return getSnapshot();
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
      "function" ===
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart &&
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __webpack_require__(/*! react */ "react"),
      objectIs = "function" === typeof Object.is ? Object.is : is,
      useState = React.useState,
      useEffect = React.useEffect,
      useLayoutEffect = React.useLayoutEffect,
      useDebugValue = React.useDebugValue,
      didWarnOld18Alpha = !1,
      didWarnUncachedGetSnapshot = !1,
      shim =
        "undefined" === typeof window ||
        "undefined" === typeof window.document ||
        "undefined" === typeof window.document.createElement
          ? useSyncExternalStore$1
          : useSyncExternalStore$2;
    exports.useSyncExternalStore =
      void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
      "function" ===
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop &&
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })();


/***/ },

/***/ "./node_modules/use-sync-external-store/shim/index.js"
/*!************************************************************!*\
  !*** ./node_modules/use-sync-external-store/shim/index.js ***!
  \************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {



if (false) // removed by dead control flow
{} else {
  module.exports = __webpack_require__(/*! ../cjs/use-sync-external-store-shim.development.js */ "./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js");
}


/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

module.exports = window["React"];

/***/ },

/***/ "react-dom"
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
(module) {

module.exports = window["ReactDOM"];

/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/compose"
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["compose"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "@wordpress/primitives"
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["primitives"];

/***/ },

/***/ "@wordpress/warning"
/*!*********************************!*\
  !*** external ["wp","warning"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["warning"];

/***/ },

/***/ "./node_modules/@ariakit/components/dist/collection/collection-store.js"
/*!******************************************************************************!*\
  !*** ./node_modules/@ariakit/components/dist/collection/collection-store.js ***!
  \******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCollectionStore: () => (/* binding */ createCollectionStore)
/* harmony export */ });
/* harmony import */ var _ariakit_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/store */ "./node_modules/@ariakit/store/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");


//#region src/collection/collection-store.ts
function getCommonParent(items) {
	const firstItem = items.find((item) => !!item.element);
	const lastElement = [...items].reverse().find((item) => !!item.element)?.element;
	let parentElement = firstItem?.element?.parentElement;
	if (!lastElement) return (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_1__.getDocument)(parentElement).body;
	while (parentElement) {
		if (parentElement.contains(lastElement)) return parentElement;
		parentElement = parentElement.parentElement;
	}
	return (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_1__.getDocument)(parentElement).body;
}
function getPrivateStore(store) {
	return store?.__unstablePrivateStore;
}
/**
* Creates a collection store.
*/
function createCollectionStore(props = {}) {
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.throwOnConflictingProps)(props, props.store);
	const syncState = props.store?.getState();
	const items = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_1__.defaultValue)(props.items, syncState?.items, props.defaultItems, []);
	const itemsMap = new Map(items.map((item) => [item.id, item]));
	const initialState = {
		items,
		renderedItems: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_1__.defaultValue)(syncState?.renderedItems, [])
	};
	const syncPrivateStore = getPrivateStore(props.store);
	const privateStore = (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.createStore)({
		items,
		renderedItems: initialState.renderedItems
	}, syncPrivateStore);
	const collection = (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.createStore)(initialState, props.store);
	const sortItems = (renderedItems) => {
		const sortedItems = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_1__.sortBasedOnDOMPosition)(renderedItems, (i) => i.element);
		privateStore.setState("renderedItems", sortedItems);
		collection.setState("renderedItems", sortedItems);
	};
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.setup)(collection, () => (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.init)(privateStore));
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.setup)(privateStore, () => {
		return (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.batch)(privateStore, ["items"], (state) => {
			collection.setState("items", state.items);
		});
	});
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.setup)(privateStore, () => {
		return (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.batch)(privateStore, ["renderedItems"], (state) => {
			let firstRun = true;
			let raf = requestAnimationFrame(() => {
				const { renderedItems } = collection.getState();
				if (state.renderedItems === renderedItems) return;
				sortItems(state.renderedItems);
			});
			if (typeof IntersectionObserver !== "function") return () => cancelAnimationFrame(raf);
			const ioCallback = () => {
				if (firstRun) {
					firstRun = false;
					return;
				}
				cancelAnimationFrame(raf);
				raf = requestAnimationFrame(() => sortItems(state.renderedItems));
			};
			const root = getCommonParent(state.renderedItems);
			const observer = new IntersectionObserver(ioCallback, { root });
			for (const item of state.renderedItems) {
				if (!item.element) continue;
				observer.observe(item.element);
			}
			return () => {
				cancelAnimationFrame(raf);
				observer.disconnect();
			};
		});
	});
	const mergeItem = (item, setItems, canDeleteFromMap = false) => {
		let prevItem;
		setItems((items) => {
			const index = items.findIndex(({ id }) => id === item.id);
			const nextItems = items.slice();
			if (index !== -1) {
				prevItem = items[index];
				const nextItem = {
					...prevItem,
					...item
				};
				nextItems[index] = nextItem;
				itemsMap.set(item.id, nextItem);
			} else {
				nextItems.push(item);
				itemsMap.set(item.id, item);
			}
			return nextItems;
		});
		const unmergeItem = () => {
			setItems((items) => {
				if (!prevItem) {
					if (canDeleteFromMap) itemsMap.delete(item.id);
					return items.filter(({ id }) => id !== item.id);
				}
				const index = items.findIndex(({ id }) => id === item.id);
				if (index === -1) return items;
				const nextItems = items.slice();
				nextItems[index] = prevItem;
				itemsMap.set(item.id, prevItem);
				return nextItems;
			});
		};
		return unmergeItem;
	};
	const registerItem = (item) => mergeItem(item, (getItems) => privateStore.setState("items", getItems), true);
	return {
		...collection,
		registerItem,
		renderItem: (item) => (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_1__.chain)(registerItem(item), mergeItem(item, (getItems) => privateStore.setState("renderedItems", getItems))),
		item: (id) => {
			if (!id) return null;
			let item = itemsMap.get(id);
			if (!item) {
				const { items } = privateStore.getState();
				item = items.find((item) => item.id === id);
				if (item) itemsMap.set(id, item);
			}
			return item || null;
		},
		__unstablePrivateStore: privateStore
	};
}
//#endregion


//# sourceMappingURL=collection-store.js.map

/***/ },

/***/ "./node_modules/@ariakit/components/dist/composite/composite-store.js"
/*!****************************************************************************!*\
  !*** ./node_modules/@ariakit/components/dist/composite/composite-store.js ***!
  \****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NULL_ITEM: () => (/* binding */ NULL_ITEM),
/* harmony export */   createCompositeStore: () => (/* binding */ createCompositeStore),
/* harmony export */   findFirstEnabledItem: () => (/* binding */ findFirstEnabledItem),
/* harmony export */   flipItems: () => (/* binding */ flipItems),
/* harmony export */   groupItemsByRows: () => (/* binding */ groupItemsByRows)
/* harmony export */ });
/* harmony import */ var _collection_collection_store_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../collection/collection-store.js */ "./node_modules/@ariakit/components/dist/collection/collection-store.js");
/* harmony import */ var _ariakit_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/store */ "./node_modules/@ariakit/store/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");



//#region src/composite/composite-store.ts
const NULL_ITEM = { id: null };
/**
* Finds the first enabled item.
*/
function findFirstEnabledItem(items, excludeId) {
	return items.find((item) => {
		if (excludeId) return !item.disabled && item.id !== excludeId;
		return !item.disabled;
	});
}
function getEnabledItems(items, excludeId) {
	return items.filter((item) => {
		if (excludeId) return !item.disabled && item.id !== excludeId;
		return !item.disabled;
	});
}
function getItemsInRow(items, rowId) {
	return items.filter((item) => item.rowId === rowId);
}
function findEnabledItemId({ items, fromIndex, step, rowId, excludeId }) {
	for (let i = fromIndex; i >= 0 && i < items.length; i += step) {
		const item = items[i];
		if (!item) continue;
		if (item.rowId !== rowId) continue;
		if (item.disabled) continue;
		if (excludeId != null && item.id === excludeId) continue;
		return item.id;
	}
}
/**
* Moves all the items before the passed `id` to the end of the array. This is
* useful when we want to loop through the items in the same row or column as
* the first items will be placed after the last items.
*
* The null item that's inserted when `shouldInsertNullItem` is set to `true`
* represents the composite container itself. When the active item is null, the
* composite container has focus.
*/
function flipItems(items, activeId, shouldInsertNullItem = false) {
	const index = items.findIndex((item) => item.id === activeId);
	return [
		...items.slice(index + 1),
		...shouldInsertNullItem ? [NULL_ITEM] : [],
		...items.slice(0, index)
	];
}
/**
* Creates a two-dimensional array with items grouped by their rowId's.
*/
function groupItemsByRows(items) {
	const rows = [];
	for (const item of items) {
		const row = rows.find((currentRow) => currentRow[0]?.rowId === item.rowId);
		if (row) row.push(item);
		else rows.push([item]);
	}
	return rows;
}
function getMaxRowLength(array) {
	let maxLength = 0;
	for (const { length } of array) if (length > maxLength) maxLength = length;
	return maxLength;
}
function createEmptyItem(rowId) {
	return {
		id: "__EMPTY_ITEM__",
		disabled: true,
		rowId
	};
}
function normalizeRows(rows, activeId, focusShift) {
	const maxLength = getMaxRowLength(rows);
	for (const row of rows) for (let i = 0; i < maxLength; i += 1) {
		const item = row[i];
		if (!item || focusShift && item.disabled) {
			const previousItem = i === 0 && focusShift ? findFirstEnabledItem(row) : row[i - 1];
			row[i] = previousItem && activeId !== previousItem.id && focusShift ? previousItem : createEmptyItem(previousItem?.rowId);
		}
	}
	return rows;
}
function verticalizeItems(items) {
	const rows = groupItemsByRows(items);
	const maxLength = getMaxRowLength(rows);
	const verticalized = [];
	for (let i = 0; i < maxLength; i += 1) for (const row of rows) {
		const item = row[i];
		if (item) verticalized.push({
			...item,
			rowId: item.rowId ? `${i}` : void 0
		});
	}
	return verticalized;
}
/**
* Creates a composite store.
*/
function createCompositeStore(props = {}) {
	const syncState = props.store?.getState();
	const collection = (0,_collection_collection_store_js__WEBPACK_IMPORTED_MODULE_0__.createCollectionStore)(props);
	const activeId = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.defaultValue)(props.activeId, syncState?.activeId, props.defaultActiveId);
	const composite = (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_1__.createStore)({
		...collection.getState(),
		id: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.defaultValue)(props.id, syncState?.id) ?? `id-${Math.random().toString(36).slice(2, 8)}`,
		activeId,
		baseElement: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.defaultValue)(syncState?.baseElement, null),
		includesBaseElement: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.defaultValue)(props.includesBaseElement, syncState?.includesBaseElement, activeId === null),
		moves: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.defaultValue)(syncState?.moves, 0),
		orientation: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.defaultValue)(props.orientation, syncState?.orientation, "both"),
		rtl: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.defaultValue)(props.rtl, syncState?.rtl, false),
		virtualFocus: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.defaultValue)(props.virtualFocus, syncState?.virtualFocus, false),
		focusLoop: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.defaultValue)(props.focusLoop, syncState?.focusLoop, false),
		focusWrap: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.defaultValue)(props.focusWrap, syncState?.focusWrap, false),
		focusShift: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.defaultValue)(props.focusShift, syncState?.focusShift, false)
	}, collection, props.store);
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_1__.setup)(composite, () => (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_1__.sync)(composite, ["renderedItems", "activeId"], (state) => {
		composite.setState("activeId", (activeId) => {
			if (activeId !== void 0) return activeId;
			return findFirstEnabledItem(state.renderedItems)?.id;
		});
	}));
	const getNextId = (direction = "next", options = {}) => {
		const defaultState = composite.getState();
		const { skip = 0, activeId = defaultState.activeId, focusShift = defaultState.focusShift, focusLoop = defaultState.focusLoop, focusWrap = defaultState.focusWrap, includesBaseElement = defaultState.includesBaseElement, renderedItems = defaultState.renderedItems, rtl = defaultState.rtl } = options;
		const isVerticalDirection = direction === "up" || direction === "down";
		const isNextDirection = direction === "next" || direction === "down";
		const canReverse = isNextDirection ? rtl && !isVerticalDirection : !rtl || isVerticalDirection;
		const canShift = focusShift && !skip;
		if (!skip && !focusWrap && !includesBaseElement && activeId != null) {
			if (!isVerticalDirection ? true : !canShift && !renderedItems.some((item) => item.rowId != null)) {
				const activeIndex = renderedItems.findIndex((item) => item.id === activeId);
				const activeItem = renderedItems[activeIndex];
				if (activeItem) {
					const step = canReverse ? -1 : 1;
					const nextId = findEnabledItemId({
						items: renderedItems,
						fromIndex: activeIndex + step,
						step,
						rowId: activeItem.rowId,
						excludeId: activeId
					});
					if (nextId !== void 0) return nextId;
					if (!(focusLoop && (isVerticalDirection ? focusLoop !== "horizontal" : focusLoop !== "vertical"))) return void 0;
					return findEnabledItemId({
						items: renderedItems,
						fromIndex: step === 1 ? 0 : renderedItems.length - 1,
						step,
						rowId: activeItem.rowId,
						excludeId: activeId
					});
				}
			}
		}
		let items = !isVerticalDirection ? renderedItems : (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.flatten2DArray)(normalizeRows(groupItemsByRows(renderedItems), activeId, canShift));
		items = canReverse ? (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.reverseArray)(items) : items;
		items = isVerticalDirection ? verticalizeItems(items) : items;
		if (activeId == null) return findFirstEnabledItem(items)?.id;
		const activeItem = items.find((item) => item.id === activeId);
		if (!activeItem) return findFirstEnabledItem(items)?.id;
		const isGrid = items.some((item) => item.rowId);
		const activeIndex = items.indexOf(activeItem);
		const nextItems = items.slice(activeIndex + 1);
		const nextItemsInRow = getItemsInRow(nextItems, activeItem.rowId);
		if (skip) {
			const nextEnabledItemsInRow = getEnabledItems(nextItemsInRow, activeId);
			return (nextEnabledItemsInRow.slice(skip)[0] || nextEnabledItemsInRow[nextEnabledItemsInRow.length - 1])?.id;
		}
		const canLoop = focusLoop && (isVerticalDirection ? focusLoop !== "horizontal" : focusLoop !== "vertical");
		const canWrap = isGrid && focusWrap && (isVerticalDirection ? focusWrap !== "horizontal" : focusWrap !== "vertical");
		const hasNullItem = isNextDirection ? (!isGrid || isVerticalDirection) && canLoop && includesBaseElement : isVerticalDirection ? includesBaseElement : false;
		if (canLoop) return findFirstEnabledItem(flipItems(canWrap && !hasNullItem ? items : getItemsInRow(items, activeItem.rowId), activeId, hasNullItem), activeId)?.id;
		if (canWrap) {
			const nextItem = findFirstEnabledItem(hasNullItem ? nextItemsInRow : nextItems, activeId);
			return hasNullItem ? nextItem?.id || null : nextItem?.id;
		}
		const nextItem = findFirstEnabledItem(nextItemsInRow, activeId);
		if (!nextItem && hasNullItem) return null;
		return nextItem?.id;
	};
	const getNextIdFromOptions = (direction, options) => {
		if (typeof options === "number") return getNextId(direction, { skip: options });
		return getNextId(direction, options);
	};
	return {
		...collection,
		...composite,
		setBaseElement: (element) => composite.setState("baseElement", element),
		setActiveId: (id) => composite.setState("activeId", id),
		move: (id) => {
			if (id === void 0) return;
			composite.setState("activeId", id);
			composite.setState("moves", (moves) => moves + 1);
		},
		first: () => findFirstEnabledItem(composite.getState().renderedItems)?.id,
		last: () => findFirstEnabledItem((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.reverseArray)(composite.getState().renderedItems))?.id,
		next: (options) => getNextIdFromOptions("next", options),
		previous: (options) => getNextIdFromOptions("previous", options),
		down: (options) => getNextIdFromOptions("down", options),
		up: (options) => getNextIdFromOptions("up", options)
	};
}
//#endregion


//# sourceMappingURL=composite-store.js.map

/***/ },

/***/ "./node_modules/@ariakit/components/dist/disclosure/disclosure-store.js"
/*!******************************************************************************!*\
  !*** ./node_modules/@ariakit/components/dist/disclosure/disclosure-store.js ***!
  \******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDisclosureStore: () => (/* binding */ createDisclosureStore)
/* harmony export */ });
/* harmony import */ var _ariakit_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/store */ "./node_modules/@ariakit/store/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");


//#region src/disclosure/disclosure-store.ts
/**
* Creates a disclosure store.
*/
function createDisclosureStore(props = {}) {
	const store = (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.mergeStore)(props.store, (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.omit)(props.disclosure, ["contentElement", "disclosureElement"]));
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.throwOnConflictingProps)(props, store);
	const syncState = store?.getState();
	const open = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_1__.defaultValue)(props.open, syncState?.open, props.defaultOpen, false);
	const animated = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_1__.defaultValue)(props.animated, syncState?.animated, false);
	const disclosure = (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.createStore)({
		open,
		animated,
		animating: !!animated && open,
		mounted: open,
		contentElement: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_1__.defaultValue)(syncState?.contentElement, null),
		disclosureElement: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_1__.defaultValue)(syncState?.disclosureElement, null)
	}, store);
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.setup)(disclosure, () => (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.sync)(disclosure, ["animated", "animating"], (state) => {
		if (state.animated) return;
		disclosure.setState("animating", false);
	}));
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.setup)(disclosure, () => (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.subscribe)(disclosure, ["open"], () => {
		if (!disclosure.getState().animated) return;
		disclosure.setState("animating", true);
	}));
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.setup)(disclosure, () => (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_0__.sync)(disclosure, ["open", "animating"], (state) => {
		disclosure.setState("mounted", state.open || state.animating);
	}));
	return {
		...disclosure,
		disclosure: props.disclosure,
		setOpen: (value) => disclosure.setState("open", value),
		show: () => disclosure.setState("open", true),
		hide: () => disclosure.setState("open", false),
		toggle: () => disclosure.setState("open", (open) => !open),
		stopAnimation: () => disclosure.setState("animating", false),
		setContentElement: (value) => disclosure.setState("contentElement", value),
		setDisclosureElement: (value) => disclosure.setState("disclosureElement", value)
	};
}
//#endregion


//# sourceMappingURL=disclosure-store.js.map

/***/ },

/***/ "./node_modules/@ariakit/components/dist/tab/tab-store.js"
/*!****************************************************************!*\
  !*** ./node_modules/@ariakit/components/dist/tab/tab-store.js ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTabStore: () => (/* binding */ createTabStore)
/* harmony export */ });
/* harmony import */ var _collection_collection_store_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../collection/collection-store.js */ "./node_modules/@ariakit/components/dist/collection/collection-store.js");
/* harmony import */ var _composite_composite_store_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../composite/composite-store.js */ "./node_modules/@ariakit/components/dist/composite/composite-store.js");
/* harmony import */ var _ariakit_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/store */ "./node_modules/@ariakit/store/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");




//#region src/tab/tab-store.ts
function getFocusedTab(items) {
	const activeElement = items[0]?.element?.ownerDocument.activeElement;
	if (!activeElement) return;
	return items.find((item) => item.element === activeElement);
}
function getTabById(items, id) {
	if (id == null) return;
	return items.find((item) => item.id === id);
}
function isEnabledTab(item) {
	if (!item) return false;
	if (item.disabled) return false;
	if (item.dimmed) return false;
	return true;
}
function createPanelsStore() {
	const panels = (0,_collection_collection_store_js__WEBPACK_IMPORTED_MODULE_0__.createCollectionStore)();
	const panelsByTabId = /* @__PURE__ */ new Map();
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.sync)(panels, ["items"], (state) => {
		panelsByTabId.clear();
		for (const panel of state.items) {
			const { tabId } = panel;
			if (tabId == null) continue;
			if (panelsByTabId.has(tabId)) continue;
			panelsByTabId.set(tabId, panel);
		}
	});
	return {
		panels,
		panel: (tabId) => {
			if (tabId == null) return null;
			return panelsByTabId.get(tabId) || null;
		}
	};
}
function createTabStore({ composite: parentComposite, combobox, ...props } = {}) {
	const independentKeys = [
		"items",
		"renderedItems",
		"moves",
		"orientation",
		"virtualFocus",
		"includesBaseElement",
		"baseElement",
		"focusLoop",
		"focusShift",
		"focusWrap"
	];
	const store = (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.mergeStore)(props.store, (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.omit)(parentComposite, independentKeys), (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.omit)(combobox, independentKeys));
	const syncState = store?.getState();
	const composite = (0,_composite_composite_store_js__WEBPACK_IMPORTED_MODULE_1__.createCompositeStore)({
		...props,
		store,
		includesBaseElement: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.defaultValue)(props.includesBaseElement, syncState?.includesBaseElement, false),
		orientation: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.defaultValue)(props.orientation, syncState?.orientation, "horizontal"),
		focusLoop: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.defaultValue)(props.focusLoop, syncState?.focusLoop, true)
	});
	const { panels, panel } = createPanelsStore();
	const tab = (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.createStore)({
		...composite.getState(),
		selectedId: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.defaultValue)(props.selectedId, syncState?.selectedId, props.defaultSelectedId),
		selectOnMove: (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.defaultValue)(props.selectOnMove, syncState?.selectOnMove, true)
	}, composite, store);
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.setup)(tab, () => (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.sync)(tab, ["moves"], () => {
		const { activeId, selectOnMove } = tab.getState();
		if (!selectOnMove) return;
		if (!activeId) return;
		const tabItem = composite.item(activeId);
		if (!isEnabledTab(tabItem)) return;
		tab.setState("selectedId", tabItem.id);
	}));
	let pendingRestore = false;
	let restoredSelectedId;
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.setup)(tab, () => {
		pendingRestore = false;
		return (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.batch)(tab, ["selectedId"], (state, prev) => {
			if (pendingRestore) {
				pendingRestore = false;
				if (state.selectedId === restoredSelectedId) return;
			}
			if (parentComposite && state.selectedId === prev.selectedId) return;
			const { activeId, renderedItems } = tab.getState();
			const focusedTab = getFocusedTab(renderedItems);
			const selectedTab = getTabById(renderedItems, state.selectedId);
			if (focusedTab && isEnabledTab(selectedTab) && activeId !== selectedTab.id) {
				composite.move(selectedTab.id);
				return;
			}
			tab.setState("activeId", state.selectedId);
		});
	});
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.setup)(tab, () => (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.sync)(tab, ["selectedId", "renderedItems"], (state) => {
		if (state.selectedId !== void 0) return;
		const { activeId, renderedItems } = tab.getState();
		const tabItem = composite.item(activeId);
		if (isEnabledTab(tabItem)) tab.setState("selectedId", tabItem.id);
		else {
			const tabItem = renderedItems.find(isEnabledTab);
			tab.setState("selectedId", tabItem?.id);
		}
	}));
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.setup)(tab, () => (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.sync)(tab, ["renderedItems"], (state) => {
		const tabs = state.renderedItems;
		if (!tabs.length) return;
		return (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.sync)(panels, ["renderedItems"], (state) => {
			const items = state.renderedItems;
			if (!items.some((panel) => !panel.tabId)) return;
			items.forEach((panel, i) => {
				if (panel.tabId) return;
				const tabItem = tabs[i];
				if (!tabItem) return;
				panels.renderItem({
					...panel,
					tabId: tabItem.id
				});
			});
		});
	}));
	let selectedIdFromSelectedValue = null;
	(0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.setup)(tab, () => {
		const backupSelectedId = () => {
			selectedIdFromSelectedValue = tab.getState().selectedId;
		};
		const restoreSelectedId = () => {
			const { selectedId } = tab.getState();
			if (selectedId === selectedIdFromSelectedValue) return;
			pendingRestore = true;
			restoredSelectedId = selectedIdFromSelectedValue;
			tab.setState("selectedId", selectedIdFromSelectedValue);
		};
		if (parentComposite && "setSelectElement" in parentComposite) return (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.chain)((0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.sync)(parentComposite, ["value"], backupSelectedId), (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.sync)(parentComposite, ["mounted"], restoreSelectedId));
		if (!combobox) return;
		return (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.chain)((0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.sync)(combobox, ["selectedValue"], backupSelectedId), (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_2__.sync)(combobox, ["mounted"], restoreSelectedId));
	});
	return {
		...composite,
		...tab,
		panels,
		panel,
		setSelectedId: (id) => tab.setState("selectedId", id),
		select: (id) => {
			tab.setState("selectedId", id);
			composite.move(id);
		}
	};
}
//#endregion


//# sourceMappingURL=tab-store.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/collection/collection-context.js"
/*!**************************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/collection/collection-context.js ***!
  \**************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CollectionContextProvider: () => (/* binding */ CollectionContextProvider),
/* harmony export */   CollectionScopedContextProvider: () => (/* binding */ CollectionScopedContextProvider),
/* harmony export */   useCollectionContext: () => (/* binding */ useCollectionContext),
/* harmony export */   useCollectionProviderContext: () => (/* binding */ useCollectionProviderContext),
/* harmony export */   useCollectionScopedContext: () => (/* binding */ useCollectionScopedContext)
/* harmony export */ });
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
"use client";

//#region src/collection/collection-context.tsx
const ctx = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__.createStoreContext)();
/**
* Returns the collection store from the nearest collection container.
* @example
* function CollectionItem() {
*   const store = useCollectionContext();
*
*   if (!store) {
*     throw new Error("CollectionItem must be wrapped in CollectionProvider");
*   }
*
*   // Use the store...
* }
*/
const useCollectionContext = ctx.useContext;
const useCollectionScopedContext = ctx.useScopedContext;
const useCollectionProviderContext = ctx.useProviderContext;
const CollectionContextProvider = ctx.ContextProvider;
const CollectionScopedContextProvider = ctx.ScopedContextProvider;
//#endregion


//# sourceMappingURL=collection-context.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/collection/collection-item.js"
/*!***********************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/collection/collection-item.js ***!
  \***********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CollectionItem: () => (/* binding */ CollectionItem),
/* harmony export */   useCollectionItem: () => (/* binding */ useCollectionItem)
/* harmony export */ });
/* harmony import */ var _collection_context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./collection-context.js */ "./node_modules/@ariakit/react-components/dist/collection/collection-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
"use client";




//#region src/collection/collection-item.tsx
const TagName = "div";
/**
* Returns props to create a `CollectionItem` component. This hook will register
* the item in the collection store. If this hook is used in a component that is
* wrapped by `Collection` or a component that implements `useCollection`,
* there's no need to explicitly pass the `store` prop.
* @see https://ariakit.com/components/collection
* @example
* ```jsx
* const store = useCollectionStore();
* const props = useCollectionItem({ store });
* <Role {...props}>Item</Role>
* ```
*/
const useCollectionItem = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.createHook)(function useCollectionItem({ store, shouldRegisterItem = true, getItem = _ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.identity, element, ...props }) {
	const context = (0,_collection_context_js__WEBPACK_IMPORTED_MODULE_0__.useCollectionContext)();
	store = store || context;
	const id = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useId)(props.id);
	const ref = (0,react__WEBPACK_IMPORTED_MODULE_3__.useRef)(element);
	(0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
		const element = ref.current;
		if (!id) return;
		if (!element) return;
		if (!shouldRegisterItem) return;
		const item = getItem({
			id,
			element
		});
		return store?.renderItem(item);
	}, [
		id,
		shouldRegisterItem,
		getItem,
		store
	]);
	props = {
		...props,
		ref: (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useMergeRefs)(ref, props.ref)
	};
	return (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.removeUndefinedValues)(props);
});
/**
* Renders an item in a collection. The collection store can be passed
* explicitly through the
* [`store`](https://ariakit.com/reference/collection-item#store) prop or
* implicitly through the parent
* [`Collection`](https://ariakit.com/reference/collection) component.
* @see https://ariakit.com/components/collection
* @example
* ```jsx
* const store = useCollectionStore();
* <CollectionItem store={store}>Item 1</CollectionItem>
* <CollectionItem store={store}>Item 2</CollectionItem>
* <CollectionItem store={store}>Item 3</CollectionItem>
* ```
*/
const CollectionItem = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(function CollectionItem(props) {
	return (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.createElement)(TagName, useCollectionItem(props));
});
//#endregion


//# sourceMappingURL=collection-item.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/collection/collection-store.js"
/*!************************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/collection/collection-store.js ***!
  \************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCollectionStore: () => (/* binding */ useCollectionStore),
/* harmony export */   useCollectionStoreProps: () => (/* binding */ useCollectionStoreProps)
/* harmony export */ });
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_react_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/react-store */ "./node_modules/@ariakit/react-store/dist/index.js");
/* harmony import */ var _ariakit_components_collection_collection_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/components/collection/collection-store */ "./node_modules/@ariakit/components/dist/collection/collection-store.js");
"use client";



//#region src/collection/collection-store.ts
function useCollectionStoreProps(store, update, props) {
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__.useUpdateEffect)(update, [props.store]);
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_1__.useStoreProps)(store, props, "items", "setItems");
	return store;
}
function useCollectionStore(props = {}) {
	const [store, update] = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_1__.useStore)(_ariakit_components_collection_collection_store__WEBPACK_IMPORTED_MODULE_2__.createCollectionStore, props);
	return useCollectionStoreProps(store, update, props);
}
//#endregion


//# sourceMappingURL=collection-store.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/combobox/combobox-context.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/combobox/combobox-context.js ***!
  \**********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComboboxContextProvider: () => (/* binding */ ComboboxContextProvider),
/* harmony export */   ComboboxItemCheckedContext: () => (/* binding */ ComboboxItemCheckedContext),
/* harmony export */   ComboboxItemValueContext: () => (/* binding */ ComboboxItemValueContext),
/* harmony export */   ComboboxListRoleContext: () => (/* binding */ ComboboxListRoleContext),
/* harmony export */   ComboboxScopedContextProvider: () => (/* binding */ ComboboxScopedContextProvider),
/* harmony export */   useComboboxContext: () => (/* binding */ useComboboxContext),
/* harmony export */   useComboboxProviderContext: () => (/* binding */ useComboboxProviderContext),
/* harmony export */   useComboboxScopedContext: () => (/* binding */ useComboboxScopedContext)
/* harmony export */ });
/* harmony import */ var _composite_composite_context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composite/composite-context.js */ "./node_modules/@ariakit/react-components/dist/composite/composite-context.js");
/* harmony import */ var _popover_popover_context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../popover/popover-context.js */ "./node_modules/@ariakit/react-components/dist/popover/popover-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
"use client";




//#region src/combobox/combobox-context.tsx
const ComboboxListRoleContext = (0,react__WEBPACK_IMPORTED_MODULE_3__.createContext)(void 0);
const ctx = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.createStoreContext)([_popover_popover_context_js__WEBPACK_IMPORTED_MODULE_1__.PopoverContextProvider, _composite_composite_context_js__WEBPACK_IMPORTED_MODULE_0__.CompositeContextProvider], [_popover_popover_context_js__WEBPACK_IMPORTED_MODULE_1__.PopoverScopedContextProvider, _composite_composite_context_js__WEBPACK_IMPORTED_MODULE_0__.CompositeScopedContextProvider]);
/**
* Returns the combobox store from the nearest combobox container.
* @example
* function Combobox() {
*   const store = useComboboxContext();
*
*   if (!store) {
*     throw new Error("Combobox must be wrapped in ComboboxProvider");
*   }
*
*   // Use the store...
* }
*/
const useComboboxContext = ctx.useContext;
const useComboboxScopedContext = ctx.useScopedContext;
const useComboboxProviderContext = ctx.useProviderContext;
const ComboboxContextProvider = ctx.ContextProvider;
const ComboboxScopedContextProvider = ctx.ScopedContextProvider;
const ComboboxItemValueContext = (0,react__WEBPACK_IMPORTED_MODULE_3__.createContext)(void 0);
const ComboboxItemCheckedContext = (0,react__WEBPACK_IMPORTED_MODULE_3__.createContext)(false);
//#endregion


//# sourceMappingURL=combobox-context.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/command/command.js"
/*!************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/command/command.js ***!
  \************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Command: () => (/* binding */ Command),
/* harmony export */   useCommand: () => (/* binding */ useCommand)
/* harmony export */ });
/* harmony import */ var _focusable_focusable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../focusable/focusable.js */ "./node_modules/@ariakit/react-components/dist/focusable/focusable.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
"use client";




//#region src/command/command.tsx
const TagName = "button";
function isNativeClick(event) {
	if (!event.isTrusted) return false;
	// istanbul ignore next: can't test trusted events yet
	const element = event.currentTarget;
	if (event.key === "Enter") return (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isButton)(element) || element.tagName === "SUMMARY" || element.tagName === "A";
	if (event.key === " ") return (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isButton)(element) || element.tagName === "SUMMARY" || element.tagName === "INPUT" || element.tagName === "SELECT";
	return false;
}
const symbol = Symbol("command");
/**
* Returns props to create a `Command` component. If the element is not a native
* clickable element (like a button), this hook will return additional props to
* make sure it's accessible.
* @see https://ariakit.com/components/command
* @example
* ```jsx
* const props = useCommand({ render: <div /> });
* <Role {...props}>Accessible button</Role>
* ```
*/
const useCommand = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.createHook)(function useCommand({ clickOnEnter = true, clickOnSpace = true, ...props }) {
	const ref = (0,react__WEBPACK_IMPORTED_MODULE_3__.useRef)(null);
	const [isNativeButton, setIsNativeButton] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
	(0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
		if (!ref.current) return;
		setIsNativeButton((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isButton)(ref.current));
	}, []);
	const [active, setActive] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
	const activeRef = (0,react__WEBPACK_IMPORTED_MODULE_3__.useRef)(false);
	const disabled = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.disabledFromProps)(props);
	const [isDuplicate, metadataProps] = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useMetadataProps)(props, symbol, true);
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useSafeLayoutEffect)(() => {
		if (!disabled) return;
		activeRef.current = false;
		setActive(false);
	}, [disabled]);
	const onKeyDownProp = props.onKeyDown;
	const onKeyDown = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useEvent)((event) => {
		onKeyDownProp?.(event);
		const element = event.currentTarget;
		if (event.defaultPrevented) return;
		if (isDuplicate) return;
		if (disabled) return;
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isSelfTarget)(event)) return;
		if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isTextField)(element)) return;
		if (element.isContentEditable) return;
		const isEnter = clickOnEnter && event.key === "Enter";
		const isSpace = clickOnSpace && event.key === " ";
		const shouldPreventEnter = event.key === "Enter" && !clickOnEnter;
		const shouldPreventSpace = event.key === " " && !clickOnSpace;
		if (shouldPreventEnter || shouldPreventSpace) {
			event.preventDefault();
			return;
		}
		if (isEnter || isSpace) {
			const nativeClick = isNativeClick(event);
			if (isEnter) {
				if (!nativeClick) {
					event.preventDefault();
					const { view, ...eventInit } = event;
					const click = () => (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.fireClickEvent)(element, eventInit);
					if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isFirefox)()) (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.queueBeforeEvent)(element, "keyup", click);
					else queueMicrotask(click);
				}
			} else if (isSpace) {
				activeRef.current = true;
				if (!nativeClick) {
					event.preventDefault();
					setActive(true);
				}
			}
		}
	});
	const onKeyUpProp = props.onKeyUp;
	const onKeyUp = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useEvent)((event) => {
		onKeyUpProp?.(event);
		if (isDuplicate) return;
		const isSpace = clickOnSpace && event.key === " ";
		if (!activeRef.current || !isSpace) return;
		const nativeClick = isNativeClick(event);
		activeRef.current = false;
		if (!nativeClick) setActive(false);
		if (event.defaultPrevented) return;
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isSelfTarget)(event)) return;
		if (disabled) return;
		if (event.metaKey) return;
		if (nativeClick) return;
		event.preventDefault();
		const element = event.currentTarget;
		const { view, ...eventInit } = event;
		queueMicrotask(() => (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.fireClickEvent)(element, eventInit));
	});
	const onBlurProp = props.onBlur;
	const onBlur = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useEvent)((event) => {
		onBlurProp?.(event);
		if (!activeRef.current) return;
		activeRef.current = false;
		setActive(false);
	});
	props = {
		"data-active": active || void 0,
		type: isNativeButton ? "button" : void 0,
		...metadataProps,
		...props,
		ref: (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useMergeRefs)(ref, props.ref),
		onKeyDown,
		onKeyUp,
		onBlur
	};
	props = (0,_focusable_focusable_js__WEBPACK_IMPORTED_MODULE_0__.useFocusable)(props);
	return props;
});
/**
* Renders a clickable element, which is a `button` by default, and inherits
* features from the [`Focusable`](https://ariakit.com/reference/focusable)
* component.
*
* If the base element isn't a native clickable one, this component will provide
* extra attributes and event handlers to ensure accessibility. It can be
* activated with the keyboard using the
* [`clickOnEnter`](https://ariakit.com/reference/command#clickonenter) and
* [`clickOnSpace`](https://ariakit.com/reference/command#clickonspace)
* props. Both are set to `true` by default.
* @see https://ariakit.com/components/command
* @example
* ```jsx
* <Command>Button</Command>
* ```
*/
const Command = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(function Command(props) {
	return (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.createElement)(TagName, useCommand(props));
});
//#endregion


//# sourceMappingURL=command.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/composite/composite-context.js"
/*!************************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/composite/composite-context.js ***!
  \************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CompositeContextProvider: () => (/* binding */ CompositeContextProvider),
/* harmony export */   CompositeItemContext: () => (/* binding */ CompositeItemContext),
/* harmony export */   CompositeRowContext: () => (/* binding */ CompositeRowContext),
/* harmony export */   CompositeScopedContextProvider: () => (/* binding */ CompositeScopedContextProvider),
/* harmony export */   useCompositeContext: () => (/* binding */ useCompositeContext),
/* harmony export */   useCompositeProviderContext: () => (/* binding */ useCompositeProviderContext),
/* harmony export */   useCompositeScopedContext: () => (/* binding */ useCompositeScopedContext)
/* harmony export */ });
/* harmony import */ var _collection_collection_context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../collection/collection-context.js */ "./node_modules/@ariakit/react-components/dist/collection/collection-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
"use client";



//#region src/composite/composite-context.tsx
const ctx = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.createStoreContext)([_collection_collection_context_js__WEBPACK_IMPORTED_MODULE_0__.CollectionContextProvider], [_collection_collection_context_js__WEBPACK_IMPORTED_MODULE_0__.CollectionScopedContextProvider]);
/**
* Returns the composite store from the nearest composite container.
* @example
* function CompositeItem() {
*   const store = useCompositeContext();
*
*   if (!store) {
*     throw new Error("CompositeItem must be wrapped in CompositeProvider");
*   }
*
*   // Use the store...
* }
*/
const useCompositeContext = ctx.useContext;
const useCompositeScopedContext = ctx.useScopedContext;
const useCompositeProviderContext = ctx.useProviderContext;
const CompositeContextProvider = ctx.ContextProvider;
const CompositeScopedContextProvider = ctx.ScopedContextProvider;
const CompositeItemContext = (0,react__WEBPACK_IMPORTED_MODULE_2__.createContext)(void 0);
const CompositeRowContext = (0,react__WEBPACK_IMPORTED_MODULE_2__.createContext)(void 0);
//#endregion


//# sourceMappingURL=composite-context.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/composite/composite-item.js"
/*!*********************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/composite/composite-item.js ***!
  \*********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CompositeItem: () => (/* binding */ CompositeItem),
/* harmony export */   useCompositeItem: () => (/* binding */ useCompositeItem)
/* harmony export */ });
/* harmony import */ var _command_command_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../command/command.js */ "./node_modules/@ariakit/react-components/dist/command/command.js");
/* harmony import */ var _collection_collection_item_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../collection/collection-item.js */ "./node_modules/@ariakit/react-components/dist/collection/collection-item.js");
/* harmony import */ var _composite_context_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./composite-context.js */ "./node_modules/@ariakit/react-components/dist/composite/composite-context.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@ariakit/react-components/dist/composite/utils.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var _ariakit_react_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ariakit/react-store */ "./node_modules/@ariakit/react-store/dist/index.js");
/* harmony import */ var _ariakit_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ariakit/store */ "./node_modules/@ariakit/store/dist/index.js");
"use client";










//#region src/composite/composite-item.tsx
const TagName = "button";
function isEditableElement(element) {
	if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.isTextbox)(element)) return true;
	return element.tagName === "INPUT" && !(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.isButton)(element);
}
function getNextPageOffset(scrollingElement, pageUp = false) {
	const height = scrollingElement.clientHeight;
	const { top } = scrollingElement.getBoundingClientRect();
	const pageSize = Math.max(height * .875, height - 40) * 1.5;
	const pageOffset = pageUp ? height - pageSize + top : pageSize + top;
	if (scrollingElement.tagName === "HTML") return pageOffset + scrollingElement.scrollTop;
	return pageOffset;
}
function getItemOffset(itemElement, pageUp = false) {
	const { top } = itemElement.getBoundingClientRect();
	if (pageUp) return top + itemElement.clientHeight;
	return top;
}
function findNextPageItemId(element, store, next, pageUp = false) {
	if (!store) return;
	if (!next) return;
	const { renderedItems } = store.getState();
	const scrollingElement = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.getScrollingElement)(element);
	if (!scrollingElement) return;
	const nextPageOffset = getNextPageOffset(scrollingElement, pageUp);
	let id;
	let prevDifference;
	for (let i = 0; i < renderedItems.length; i += 1) {
		const previousId = id;
		id = next(i);
		if (!id) break;
		if (id === previousId) continue;
		const itemElement = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.getEnabledItem)(store, id)?.element;
		if (!itemElement) continue;
		const difference = getItemOffset(itemElement, pageUp) - nextPageOffset;
		const absDifference = Math.abs(difference);
		if (pageUp && difference <= 0 || !pageUp && difference >= 0) {
			if (prevDifference !== void 0 && prevDifference < absDifference) id = previousId;
			break;
		}
		prevDifference = absDifference;
	}
	return id;
}
function targetIsAnotherItem(event, store) {
	if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.isSelfTarget)(event)) return false;
	return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isItem)(store, event.target);
}
/**
* Returns props to create a `CompositeItem` component.
* @see https://ariakit.com/components/composite
* @example
* ```jsx
* const store = useCompositeStore();
* const props = useCompositeItem({ store });
* <Role {...props}>Item 1</Role>
* ```
*/
const useCompositeItem = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__.createHook)(function useCompositeItem({ store, rowId: rowIdProp, preventScrollOnKeyDown = false, moveOnKeyPress = true, tabbable = false, getItem: getItemProp, "aria-setsize": ariaSetSizeProp, "aria-posinset": ariaPosInSetProp, ...props }) {
	const context = (0,_composite_context_js__WEBPACK_IMPORTED_MODULE_2__.useCompositeScopedContext)();
	store = store || context;
	const id = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__.useId)(props.id);
	const ref = (0,react__WEBPACK_IMPORTED_MODULE_6__.useRef)(null);
	const row = (0,react__WEBPACK_IMPORTED_MODULE_6__.useContext)(_composite_context_js__WEBPACK_IMPORTED_MODULE_2__.CompositeRowContext);
	const trulyDisabled = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.disabledFromProps)(props) && !props.accessibleWhenDisabled;
	const shouldRegisterItem = props.shouldRegisterItem;
	const getRowId = (state) => {
		if (rowIdProp) return rowIdProp;
		if (!state) return;
		if (!row?.baseElement) return;
		if (row.baseElement !== state.baseElement) return;
		return row.id;
	};
	const { rowId, baseElement, isActiveItem, ariaSetSize, ariaPosInSet, isTabbable } = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_8__.useStoreStateObject)(store, {
		rowId: getRowId,
		baseElement(state) {
			return state?.baseElement || void 0;
		},
		isActiveItem(state) {
			return !!state && state.activeId === id;
		},
		ariaSetSize(state) {
			if (ariaSetSizeProp != null) return ariaSetSizeProp;
			if (!state) return;
			if (!row?.ariaSetSize) return;
			if (row.baseElement !== state.baseElement) return;
			return row.ariaSetSize;
		},
		ariaPosInSet(state) {
			if (ariaPosInSetProp != null) return ariaPosInSetProp;
			if (!state) return;
			if (!row?.ariaPosInSet) return;
			if (row.baseElement !== state.baseElement) return;
			const rowId = getRowId(state);
			const itemsInRow = state.renderedItems.filter((item) => item.rowId === rowId);
			return row.ariaPosInSet + itemsInRow.findIndex((item) => item.id === id);
		},
		isTabbable(state) {
			if (!state?.renderedItems.length) return true;
			if (state.virtualFocus) return false;
			if (tabbable) return true;
			if (state.activeId === null) return false;
			const item = store?.item(state.activeId);
			if (item?.disabled) return true;
			if (!item?.element) return true;
			return state.activeId === id;
		}
	});
	const getItem = (0,react__WEBPACK_IMPORTED_MODULE_6__.useCallback)((item) => {
		const nextItem = {
			...item,
			id: id || item.id,
			rowId,
			disabled: trulyDisabled,
			children: item.element?.textContent
		};
		if (getItemProp) return getItemProp(nextItem);
		return nextItem;
	}, [
		id,
		rowId,
		trulyDisabled,
		getItemProp
	]);
	const onFocusProp = props.onFocus;
	const hasFocusedComposite = (0,react__WEBPACK_IMPORTED_MODULE_6__.useRef)(false);
	const cancelScheduledFocusRedirectRef = (0,react__WEBPACK_IMPORTED_MODULE_6__.useRef)(null);
	const onFocus = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__.useEvent)((event) => {
		onFocusProp?.(event);
		if (event.defaultPrevented) return;
		if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.isPortalEvent)(event)) return;
		if (!id) return;
		if (!store) return;
		if (targetIsAnotherItem(event, store)) return;
		const { virtualFocus, baseElement } = store.getState();
		store.setActiveId(id);
		if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.isTextbox)(event.currentTarget)) (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.selectTextField)(event.currentTarget);
		if (!virtualFocus) return;
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.isSelfTarget)(event)) return;
		if (isEditableElement(event.currentTarget)) return;
		const redirectFocusToBaseElement = (currentTarget, relatedTarget, baseElement) => {
			if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.isSafari)() && currentTarget.hasAttribute("data-autofocus")) currentTarget.scrollIntoView({
				block: "nearest",
				inline: "nearest"
			});
			hasFocusedComposite.current = true;
			if (relatedTarget === baseElement || (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isItem)(store, relatedTarget)) (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.focusSilently)(baseElement);
			else baseElement.focus();
		};
		if (baseElement?.isConnected) {
			redirectFocusToBaseElement(event.currentTarget, event.relatedTarget, baseElement);
			return;
		}
		if (shouldRegisterItem === false) return;
		const { currentTarget, relatedTarget } = event;
		const cancelScheduledFocusRedirect = () => {
			cancelScheduledFocusRedirectRef.current?.();
			cancelScheduledFocusRedirectRef.current = null;
		};
		cancelScheduledFocusRedirect();
		cancelScheduledFocusRedirectRef.current = (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_9__.subscribe)(store, null, () => {
			if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.getActiveElement)(currentTarget) !== currentTarget) {
				cancelScheduledFocusRedirect();
				return;
			}
			const state = store.getState();
			const nextBaseElement = state.baseElement;
			if (!nextBaseElement?.isConnected) return;
			cancelScheduledFocusRedirect();
			if (!state.virtualFocus) return;
			redirectFocusToBaseElement(currentTarget, relatedTarget, nextBaseElement);
		});
	});
	const onBlurCaptureProp = props.onBlurCapture;
	const onBlurCapture = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__.useEvent)((event) => {
		onBlurCaptureProp?.(event);
		if (event.defaultPrevented) return;
		if ((store?.getState())?.virtualFocus && hasFocusedComposite.current) {
			hasFocusedComposite.current = false;
			event.preventDefault();
			event.stopPropagation();
		}
	});
	const onKeyDownProp = props.onKeyDown;
	const preventScrollOnKeyDownProp = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__.useBooleanEvent)(preventScrollOnKeyDown);
	const moveOnKeyPressProp = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__.useBooleanEvent)(moveOnKeyPress);
	const onKeyDown = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__.useEvent)((event) => {
		onKeyDownProp?.(event);
		if (event.defaultPrevented) return;
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.isSelfTarget)(event)) return;
		if (!store) return;
		const { currentTarget } = event;
		const state = store.getState();
		const isGrid = !!store.item(id)?.rowId;
		const isVertical = state.orientation !== "horizontal";
		const isHorizontal = state.orientation !== "vertical";
		const canHomeEnd = () => {
			if (isGrid) return true;
			if (isHorizontal) return true;
			if (!state.baseElement) return true;
			if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.isTextField)(state.baseElement)) return true;
			return false;
		};
		const action = {
			ArrowUp: (isGrid || isVertical) && store.up,
			ArrowRight: (isGrid || isHorizontal) && store.next,
			ArrowDown: (isGrid || isVertical) && store.down,
			ArrowLeft: (isGrid || isHorizontal) && store.previous,
			Home: () => {
				if (!canHomeEnd()) return;
				if (!isGrid || event.ctrlKey) return store?.first();
				return store?.previous(-1);
			},
			End: () => {
				if (!canHomeEnd()) return;
				if (!isGrid || event.ctrlKey) return store?.last();
				return store?.next(-1);
			},
			PageUp: () => {
				return findNextPageItemId(currentTarget, store, store?.up, true);
			},
			PageDown: () => {
				return findNextPageItemId(currentTarget, store, store?.down);
			}
		}[event.key];
		if (action) {
			if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.isTextbox)(currentTarget)) {
				const selection = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.getTextboxSelection)(currentTarget);
				const isLeft = isHorizontal && event.key === "ArrowLeft";
				const isRight = isHorizontal && event.key === "ArrowRight";
				const isUp = isVertical && event.key === "ArrowUp";
				const isDown = isVertical && event.key === "ArrowDown";
				if (isRight || isDown) {
					const { length: valueLength } = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.getTextboxValue)(currentTarget);
					if (selection.end !== valueLength) return;
				} else if ((isLeft || isUp) && selection.start !== 0) return;
			}
			const nextId = action();
			if (preventScrollOnKeyDownProp(event) || nextId !== void 0) {
				if (!moveOnKeyPressProp(event)) return;
				event.preventDefault();
				store.move(nextId);
			}
		}
	});
	const providerValue = (0,react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => ({
		id,
		baseElement
	}), [id, baseElement]);
	props = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__.useWrapElement)(props, (element) => /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_composite_context_js__WEBPACK_IMPORTED_MODULE_2__.CompositeItemContext.Provider, {
		value: providerValue,
		children: element
	}), [providerValue]);
	props = {
		"data-active-item": isActiveItem || void 0,
		...props,
		id,
		ref: (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__.useMergeRefs)(ref, props.ref),
		tabIndex: isTabbable ? props.tabIndex : -1,
		onFocus,
		onBlurCapture,
		onKeyDown
	};
	props = (0,_command_command_js__WEBPACK_IMPORTED_MODULE_0__.useCommand)(props);
	props = (0,_collection_collection_item_js__WEBPACK_IMPORTED_MODULE_1__.useCollectionItem)({
		store,
		...props,
		getItem,
		shouldRegisterItem: id ? shouldRegisterItem : false
	});
	return (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_5__.removeUndefinedValues)({
		...props,
		"aria-setsize": ariaSetSize,
		"aria-posinset": ariaPosInSet
	});
});
/**
* Renders a focusable item as part of a composite widget. The `tabindex`
* attribute is automatically managed by this component based on the
* [`virtualFocus`](https://ariakit.com/reference/composite-provider#virtualfocus)
* option.
*
* When this component receives DOM focus or is virtually focused (when the
* [`virtualFocus`](https://ariakit.com/reference/composite-provider#virtualfocus)
* option is set to `true`), the element will automatically receive the
* [`data-active-item`](https://ariakit.com/guide/styling#data-active-item)
* attribute. This can be used to style the focused item, no matter the focus
* approach employed.
* @see https://ariakit.com/components/composite
* @example
* ```jsx {3-5}
* <CompositeProvider>
*   <Composite>
*     <CompositeItem>Item 1</CompositeItem>
*     <CompositeItem>Item 2</CompositeItem>
*     <CompositeItem>Item 3</CompositeItem>
*   </Composite>
* </CompositeProvider>
* ```
*/
const CompositeItem = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__.memo)((0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__.forwardRef)(function CompositeItem(props) {
	return (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_4__.createElement)(TagName, useCompositeItem(props));
}));
//#endregion


//# sourceMappingURL=composite-item.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/composite/composite-store.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/composite/composite-store.js ***!
  \**********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCompositeStore: () => (/* binding */ useCompositeStore),
/* harmony export */   useCompositeStoreOptions: () => (/* binding */ useCompositeStoreOptions),
/* harmony export */   useCompositeStoreProps: () => (/* binding */ useCompositeStoreProps)
/* harmony export */ });
/* harmony import */ var _collection_collection_store_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../collection/collection-store.js */ "./node_modules/@ariakit/react-components/dist/collection/collection-store.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_react_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/react-store */ "./node_modules/@ariakit/react-store/dist/index.js");
/* harmony import */ var _ariakit_components_composite_composite_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ariakit/components/composite/composite-store */ "./node_modules/@ariakit/components/dist/composite/composite-store.js");
"use client";




//#region src/composite/composite-store.ts
function useCompositeStoreOptions(props) {
	return {
		id: (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useId)(props.id),
		...props
	};
}
function useCompositeStoreProps(store, update, props) {
	store = (0,_collection_collection_store_js__WEBPACK_IMPORTED_MODULE_0__.useCollectionStoreProps)(store, update, props);
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_2__.useStoreProps)(store, props, "activeId", "setActiveId");
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_2__.useStoreProps)(store, props, "includesBaseElement");
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_2__.useStoreProps)(store, props, "virtualFocus");
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_2__.useStoreProps)(store, props, "orientation");
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_2__.useStoreProps)(store, props, "rtl");
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_2__.useStoreProps)(store, props, "focusLoop");
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_2__.useStoreProps)(store, props, "focusWrap");
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_2__.useStoreProps)(store, props, "focusShift");
	return store;
}
function useCompositeStore(props = {}) {
	props = useCompositeStoreOptions(props);
	const [store, update] = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_2__.useStore)(_ariakit_components_composite_composite_store__WEBPACK_IMPORTED_MODULE_3__.createCompositeStore, props);
	return useCompositeStoreProps(store, update, props);
}
//#endregion


//# sourceMappingURL=composite-store.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/composite/composite.js"
/*!****************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/composite/composite.js ***!
  \****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Composite: () => (/* binding */ Composite),
/* harmony export */   useComposite: () => (/* binding */ useComposite)
/* harmony export */ });
/* harmony import */ var _focusable_focusable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../focusable/focusable.js */ "./node_modules/@ariakit/react-components/dist/focusable/focusable.js");
/* harmony import */ var _composite_context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./composite-context.js */ "./node_modules/@ariakit/react-components/dist/composite/composite-context.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@ariakit/react-components/dist/composite/utils.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var _ariakit_react_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ariakit/react-store */ "./node_modules/@ariakit/react-store/dist/index.js");
"use client";








//#region src/composite/composite.tsx
const TagName = "div";
function isGrid(items) {
	return items.some((item) => !!item.rowId);
}
function isPrintableKey(event) {
	const target = event.target;
	if (target && !(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.isTextField)(target)) return false;
	return event.key.length === 1 && !event.ctrlKey && !event.metaKey;
}
function isModifierKey(event) {
	return event.key === "Shift" || event.key === "Control" || event.key === "Alt" || event.key === "Meta";
}
function useKeyboardEventProxy(store, onKeyboardEvent, previousElementRef) {
	return (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useEvent)((event) => {
		onKeyboardEvent?.(event);
		if (event.defaultPrevented) return;
		if (event.isPropagationStopped()) return;
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.isSelfTarget)(event)) return;
		if (isModifierKey(event)) return;
		if (isPrintableKey(event)) return;
		const activeElement = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getEnabledItem)(store, store.getState().activeId)?.element;
		if (!activeElement) return;
		const { view, ...eventInit } = event;
		if (activeElement !== previousElementRef?.current) activeElement.focus();
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.fireKeyboardEvent)(activeElement, event.type, eventInit)) event.preventDefault();
		if (event.currentTarget.contains(activeElement)) event.stopPropagation();
	});
}
function findFirstEnabledItemInTheLastRow(items) {
	return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.findFirstEnabledItem)((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.flatten2DArray)((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.reverseArray)((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.groupItemsByRows)(items))));
}
function withBaseScrollPreserved(store, callback) {
	const { virtualFocus, baseElement } = store.getState();
	if (!virtualFocus || !baseElement || !(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.isTextField)(baseElement)) {
		callback();
		return;
	}
	const savedScrollLeft = baseElement.scrollLeft;
	const savedScrollTop = baseElement.scrollTop;
	callback();
	baseElement.scrollLeft = savedScrollLeft;
	baseElement.scrollTop = savedScrollTop;
}
function useScheduleFocus(store) {
	const [scheduled, setScheduled] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
	const schedule = (0,react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(() => setScheduled(true), []);
	const activeItem = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_7__.useStoreState)(store, (state) => scheduled ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getEnabledItem)(store, state.activeId) : null);
	(0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
		const activeElement = activeItem?.element;
		if (!scheduled) return;
		if (!activeElement) return;
		setScheduled(false);
		withBaseScrollPreserved(store, () => {
			activeElement.focus({ preventScroll: true });
		});
	}, [
		store,
		activeItem,
		scheduled
	]);
	return schedule;
}
/**
* Renders nothing and reacts to the `moves` state by focusing on the active
* item. This lives in a separate memoized component so moving through items
* doesn't re-render the whole composite component, and composite re-renders
* don't re-render this component. It's only rendered when the `composite` prop
* is enabled, so the `moves` subscription doesn't run for non-composite
* widgets.
*/
const CompositeFocusOnMove = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.memo)(function CompositeFocusOnMove({ store, focusOnMove, previousElementRef }) {
	const moves = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_7__.useStoreState)(store, "moves");
	const baseElement = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_7__.useStoreState)(store, "baseElement");
	(0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
		if (!moves) return;
		if (!focusOnMove) return;
		const { activeId } = store.getState();
		const itemElement = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getEnabledItem)(store, activeId)?.element;
		if (!itemElement) return;
		withBaseScrollPreserved(store, () => (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.focusIntoView)(itemElement));
	}, [
		store,
		moves,
		focusOnMove
	]);
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useSafeLayoutEffect)(() => {
		if (!moves) return;
		if (!baseElement) return;
		const { activeId } = store.getState();
		if (!(activeId === null)) return;
		const previousElement = previousElementRef.current;
		previousElementRef.current = null;
		if (previousElement) (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.fireBlurEvent)(previousElement, { relatedTarget: baseElement });
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.hasFocus)(baseElement)) baseElement.focus();
	}, [
		store,
		moves,
		baseElement
	]);
	return null;
});
/**
* Returns props to create a `Composite` component.
* @see https://ariakit.com/components/composite
* @example
* ```jsx
* const store = useCompositeStore();
* const props = useComposite({ store });
* <Role {...props}>
*   <CompositeItem>Item 1</CompositeItem>
*   <CompositeItem>Item 2</CompositeItem>
* </Role>
* ```
*/
const useComposite = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.createHook)(function useComposite({ store, composite = true, focusOnMove = composite, moveOnKeyPress = true, ...props }) {
	const context = (0,_composite_context_js__WEBPACK_IMPORTED_MODULE_1__.useCompositeProviderContext)();
	store = store || context;
	(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.invariant)(store,  true && "Composite must receive a `store` prop or be wrapped in a CompositeProvider component.");
	const ref = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(null);
	const previousElementRef = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(null);
	const scheduleFocus = useScheduleFocus(store);
	const [, setBaseElement] = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useTransactionState)(composite ? store.setBaseElement : null);
	const virtualFocus = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_7__.useStoreState)(store, "virtualFocus");
	const activeId = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_7__.useStoreState)(store, (state) => state.virtualFocus ? state.activeId : null);
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useSafeLayoutEffect)(() => {
		if (!store) return;
		if (!composite) return;
		if (!virtualFocus) return;
		const previousElement = previousElementRef.current;
		previousElementRef.current = null;
		if (!previousElement) return;
		const relatedTarget = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getEnabledItem)(store, activeId)?.element || (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.getActiveElement)(previousElement);
		if (relatedTarget === previousElement) return;
		(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.fireBlurEvent)(previousElement, { relatedTarget });
	}, [
		store,
		activeId,
		virtualFocus,
		composite
	]);
	const onKeyDownCapture = useKeyboardEventProxy(store, props.onKeyDownCapture, previousElementRef);
	const onKeyUpCapture = useKeyboardEventProxy(store, props.onKeyUpCapture, previousElementRef);
	const onFocusCaptureProp = props.onFocusCapture;
	const onFocusCapture = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useEvent)((event) => {
		onFocusCaptureProp?.(event);
		if (event.defaultPrevented) return;
		if (!store) return;
		const { virtualFocus } = store.getState();
		if (!virtualFocus) return;
		const previousActiveElement = event.relatedTarget;
		const isSilentlyFocused = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.silentlyFocused)(event.currentTarget);
		if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.isSelfTarget)(event) && isSilentlyFocused) {
			event.stopPropagation();
			previousElementRef.current = previousActiveElement;
		}
	});
	const onFocusProp = props.onFocus;
	const onFocus = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useEvent)((event) => {
		onFocusProp?.(event);
		if (event.defaultPrevented) return;
		if (!composite) return;
		if (!store) return;
		const { relatedTarget } = event;
		const { virtualFocus } = store.getState();
		if (virtualFocus) {
			if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.isSelfTarget)(event) && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isItem)(store, relatedTarget)) queueMicrotask(scheduleFocus);
		} else if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.isSelfTarget)(event)) store.setActiveId(null);
	});
	const onBlurCaptureProp = props.onBlurCapture;
	const onBlurCapture = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useEvent)((event) => {
		onBlurCaptureProp?.(event);
		if (event.defaultPrevented) return;
		if (!store) return;
		const { virtualFocus, activeId } = store.getState();
		if (!virtualFocus) return;
		const activeElement = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getEnabledItem)(store, activeId)?.element;
		const nextActiveElement = event.relatedTarget;
		const nextActiveElementIsItem = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isItem)(store, nextActiveElement);
		const previousElement = previousElementRef.current;
		previousElementRef.current = null;
		if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.isSelfTarget)(event) && nextActiveElementIsItem) {
			if (nextActiveElement === activeElement) {
				if (previousElement && previousElement !== nextActiveElement) (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.fireBlurEvent)(previousElement, event);
			} else if (activeElement) (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.fireBlurEvent)(activeElement, event);
			else if (previousElement) (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.fireBlurEvent)(previousElement, event);
			event.stopPropagation();
		} else if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isItem)(store, event.target) && activeElement) (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.fireBlurEvent)(activeElement, event);
	});
	const onKeyDownProp = props.onKeyDown;
	const moveOnKeyPressProp = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useBooleanEvent)(moveOnKeyPress);
	const onKeyDown = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useEvent)((event) => {
		onKeyDownProp?.(event);
		if (event.nativeEvent.isComposing) return;
		if (event.defaultPrevented) return;
		if (!store) return;
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.isSelfTarget)(event)) return;
		const { orientation, renderedItems, activeId, rtl } = store.getState();
		if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getEnabledItem)(store, activeId)?.element?.isConnected) return;
		const isVertical = orientation !== "horizontal";
		const isHorizontal = orientation !== "vertical";
		const grid = isGrid(renderedItems);
		if ((event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Home" || event.key === "End") && (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_4__.isTextField)(event.currentTarget)) return;
		const up = () => {
			if (grid) return findFirstEnabledItemInTheLastRow(renderedItems)?.id;
			return store?.last();
		};
		const action = {
			ArrowUp: (grid || isVertical) && up,
			ArrowRight: (grid || isHorizontal) && (rtl ? store.last : store.first),
			ArrowDown: (grid || isVertical) && store.first,
			ArrowLeft: (grid || isHorizontal) && (rtl ? store.first : store.last),
			Home: store.first,
			End: store.last,
			PageUp: store.first,
			PageDown: store.last
		}[event.key];
		if (action) {
			const id = action();
			if (id !== void 0) {
				if (!moveOnKeyPressProp(event)) return;
				event.preventDefault();
				store.move(id);
			}
		}
	});
	props = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useWrapElement)(props, (element) => /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_composite_context_js__WEBPACK_IMPORTED_MODULE_1__.CompositeScopedContextProvider, {
		value: store,
		children: [element, composite && /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(CompositeFocusOnMove, {
			store,
			focusOnMove,
			previousElementRef
		})]
	}), [
		store,
		composite,
		focusOnMove
	]);
	props = {
		"aria-activedescendant": (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_7__.useStoreState)(store, (state) => {
			if (!store) return;
			if (!composite) return;
			if (!state.virtualFocus) return;
			return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getEnabledItem)(store, state.activeId)?.id;
		}),
		...props,
		ref: (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useMergeRefs)(ref, setBaseElement, props.ref),
		onKeyDownCapture,
		onKeyUpCapture,
		onFocusCapture,
		onFocus,
		onBlurCapture,
		onKeyDown
	};
	props = (0,_focusable_focusable_js__WEBPACK_IMPORTED_MODULE_0__.useFocusable)({
		focusable: (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_7__.useStoreState)(store, (state) => composite && (state.virtualFocus || state.activeId === null)),
		...props
	});
	return props;
});
/**
* Renders a composite widget.
* @see https://ariakit.com/components/composite
* @example
* ```jsx
* const composite = useCompositeStore();
* <Composite store={composite}>
*   <CompositeItem>Item 1</CompositeItem>
*   <CompositeItem>Item 2</CompositeItem>
* </Composite>
* ```
*/
const Composite = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.forwardRef)(function Composite(props) {
	return (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.createElement)(TagName, useComposite(props));
});
//#endregion


//# sourceMappingURL=composite.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/composite/utils.js"
/*!************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/composite/utils.js ***!
  \************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findFirstEnabledItem: () => (/* binding */ findFirstEnabledItem),
/* harmony export */   flipItems: () => (/* binding */ flipItems),
/* harmony export */   focusSilently: () => (/* binding */ focusSilently),
/* harmony export */   getEnabledItem: () => (/* binding */ getEnabledItem),
/* harmony export */   groupItemsByRows: () => (/* binding */ groupItemsByRows),
/* harmony export */   isItem: () => (/* binding */ isItem),
/* harmony export */   selectTextField: () => (/* binding */ selectTextField),
/* harmony export */   silentlyFocused: () => (/* binding */ silentlyFocused)
/* harmony export */ });
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");
/* harmony import */ var _ariakit_components_composite_composite_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/components/composite/composite-store */ "./node_modules/@ariakit/components/dist/composite/composite-store.js");
"use client";


//#region src/composite/utils.ts
const flipItems = _ariakit_components_composite_composite_store__WEBPACK_IMPORTED_MODULE_1__.flipItems;
const findFirstEnabledItem = _ariakit_components_composite_composite_store__WEBPACK_IMPORTED_MODULE_1__.findFirstEnabledItem;
const groupItemsByRows = _ariakit_components_composite_composite_store__WEBPACK_IMPORTED_MODULE_1__.groupItemsByRows;
/**
* Returns the store item with the given id (enabled or not), or `null`.
*/
function getEnabledItem(store, id) {
	if (!id) return null;
	return store.item(id) || null;
}
/**
* Selects text field contents even if it's a content editable element.
*/
function selectTextField(element, collapseToEnd = false) {
	if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.isTextField)(element)) element.setSelectionRange(collapseToEnd ? element.value.length : 0, element.value.length);
	else if (element.isContentEditable) {
		const selection = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.getDocument)(element).getSelection();
		selection?.selectAllChildren(element);
		if (collapseToEnd) selection?.collapseToEnd();
	}
}
const FOCUS_SILENTLY = Symbol("FOCUS_SILENTLY");
/**
* Focus an element with a flag. The `silentlyFocused` function needs to be
* called later to check if the focus was silenced and to reset this state.
*/
function focusSilently(element) {
	element[FOCUS_SILENTLY] = true;
	element.focus({ preventScroll: true });
}
/**
* Checks whether the element has been focused with the `focusSilently` function
* and resets the state.
*/
function silentlyFocused(element) {
	const isSilentlyFocused = element[FOCUS_SILENTLY];
	delete element[FOCUS_SILENTLY];
	return isSilentlyFocused;
}
/**
* Determines whether the element is a composite item.
*/
function isItem(store, element, exclude) {
	if (!element) return false;
	if (element === exclude) return false;
	const item = store.item(element.id);
	if (!item) return false;
	if (exclude && item.element === exclude) return false;
	return true;
}
//#endregion


//# sourceMappingURL=utils.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/dialog/dialog-context.js"
/*!******************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/dialog/dialog-context.js ***!
  \******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DialogContextProvider: () => (/* binding */ DialogContextProvider),
/* harmony export */   DialogDescriptionContext: () => (/* binding */ DialogDescriptionContext),
/* harmony export */   DialogHeadingContext: () => (/* binding */ DialogHeadingContext),
/* harmony export */   DialogScopedContextProvider: () => (/* binding */ DialogScopedContextProvider),
/* harmony export */   useDialogContext: () => (/* binding */ useDialogContext),
/* harmony export */   useDialogProviderContext: () => (/* binding */ useDialogProviderContext),
/* harmony export */   useDialogScopedContext: () => (/* binding */ useDialogScopedContext)
/* harmony export */ });
/* harmony import */ var _disclosure_disclosure_context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../disclosure/disclosure-context.js */ "./node_modules/@ariakit/react-components/dist/disclosure/disclosure-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
"use client";



//#region src/dialog/dialog-context.tsx
const ctx = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.createStoreContext)([_disclosure_disclosure_context_js__WEBPACK_IMPORTED_MODULE_0__.DisclosureContextProvider], [_disclosure_disclosure_context_js__WEBPACK_IMPORTED_MODULE_0__.DisclosureScopedContextProvider]);
/**
* Returns the dialog store from the nearest dialog container.
* @example
* function Dialog() {
*   const store = useDialogContext();
*
*   if (!store) {
*     throw new Error("Dialog must be wrapped in DialogProvider");
*   }
*
*   // Use the store...
* }
*/
const useDialogContext = ctx.useContext;
const useDialogScopedContext = ctx.useScopedContext;
const useDialogProviderContext = ctx.useProviderContext;
const DialogContextProvider = ctx.ContextProvider;
const DialogScopedContextProvider = ctx.ScopedContextProvider;
const DialogHeadingContext = (0,react__WEBPACK_IMPORTED_MODULE_2__.createContext)(void 0);
const DialogDescriptionContext = (0,react__WEBPACK_IMPORTED_MODULE_2__.createContext)(void 0);
//#endregion


//# sourceMappingURL=dialog-context.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/disclosure/disclosure-content.js"
/*!**************************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/disclosure/disclosure-content.js ***!
  \**************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DisclosureContent: () => (/* binding */ DisclosureContent),
/* harmony export */   isHidden: () => (/* binding */ isHidden),
/* harmony export */   useDisclosureContent: () => (/* binding */ useDisclosureContent)
/* harmony export */ });
/* harmony import */ var _disclosure_context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disclosure-context.js */ "./node_modules/@ariakit/react-components/dist/disclosure/disclosure-context.js");
/* harmony import */ var _dialog_dialog_context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dialog/dialog-context.js */ "./node_modules/@ariakit/react-components/dist/dialog/dialog-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var _ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ariakit/react-store */ "./node_modules/@ariakit/react-store/dist/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-dom */ "react-dom");
"use client";








//#region src/disclosure/disclosure-content.tsx
const TagName = "div";
function afterTimeout(timeoutMs, cb) {
	const timeoutId = setTimeout(cb, timeoutMs);
	return () => clearTimeout(timeoutId);
}
function parseCSSTime(time) {
	const value = time?.trim() || "0s";
	const multiplier = value.endsWith("ms") ? 1 : 1e3;
	const parsed = Number.parseFloat(value) * multiplier;
	return Number.isNaN(parsed) ? 0 : parsed;
}
function getEndTime(names, delays, durations) {
	const nameList = names.split(",");
	const delayList = delays.split(",");
	const durationList = durations.split(",");
	let endTime = 0;
	for (const [index, name] of nameList.entries()) {
		if (name.trim() === "none") continue;
		const delay = parseCSSTime(delayList[index % delayList.length]);
		const duration = parseCSSTime(durationList[index % durationList.length]);
		endTime = Math.max(endTime, delay + duration);
	}
	return endTime;
}
function getElementEndTime(element) {
	const { transitionProperty, transitionDuration, transitionDelay, animationName, animationDuration, animationDelay } = getComputedStyle(element);
	return Math.max(getEndTime(transitionProperty, transitionDelay, transitionDuration), getEndTime(animationName, animationDelay, animationDuration));
}
function isHidden(mounted, hidden, alwaysVisible) {
	return !alwaysVisible && hidden !== false && (!mounted || !!hidden);
}
/**
* Returns props to create a `DislosureContent` component.
* @see https://ariakit.com/components/disclosure
* @example
* ```jsx
* const store = useDisclosureStore();
* const props = useDisclosureContent({ store });
* <Disclosure store={store}>Disclosure</Disclosure>
* <Role {...props}>Content</Role>
* ```
*/
const useDisclosureContent = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.createHook)(function useDisclosureContent({ store, alwaysVisible, unstable_otherElementRef: otherElementRef, ...props }) {
	const context = (0,_disclosure_context_js__WEBPACK_IMPORTED_MODULE_0__.useDisclosureProviderContext)();
	store = store || context;
	(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.invariant)(store,  true && "DisclosureContent must receive a `store` prop or be wrapped in a DisclosureProvider component.");
	const ref = (0,react__WEBPACK_IMPORTED_MODULE_4__.useRef)(null);
	const id = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.useId)(props.id);
	const [transition, setTransition] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(null);
	const open = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__.useStoreState)(store, "open");
	const mounted = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__.useStoreState)(store, "mounted");
	const animated = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__.useStoreState)(store, "animated");
	const contentElement = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__.useStoreState)(store, "contentElement");
	const otherElement = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__.useStoreState)(store.disclosure, "contentElement");
	const hasClosedRef = (0,react__WEBPACK_IMPORTED_MODULE_4__.useRef)(false);
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.useSafeLayoutEffect)(() => {
		if (!ref.current) return;
		store?.setContentElement(ref.current);
	}, [store]);
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.useSafeLayoutEffect)(() => {
		let previousAnimated;
		store?.setState("animated", (animated) => {
			previousAnimated = animated;
			return true;
		});
		return () => {
			if (previousAnimated === void 0) return;
			store?.setState("animated", previousAnimated);
		};
	}, [store]);
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.useSafeLayoutEffect)(() => {
		if (!animated) {
			if (!open) {
				hasClosedRef.current = true;
				setTransition(null);
			} else if (hasClosedRef.current) {
				hasClosedRef.current = false;
				setTransition("enter");
			}
			return;
		}
		if (!contentElement?.isConnected) {
			setTransition(null);
			return;
		}
		return (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.afterPaint)(() => {
			setTransition(open ? "enter" : mounted ? "leave" : null);
		});
	}, [
		animated,
		contentElement,
		open,
		mounted
	]);
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.useSafeLayoutEffect)(() => {
		if (!store) return;
		if (!animated) return;
		if (!transition) return;
		if (!contentElement) return;
		const stopAnimation = () => store?.setState("animating", false);
		const stopAnimationSync = () => (0,react_dom__WEBPACK_IMPORTED_MODULE_7__.flushSync)(stopAnimation);
		if (transition === "leave" && open) return;
		if (transition === "enter" && !open) return;
		if (typeof animated === "number") return afterTimeout(animated, stopAnimationSync);
		const elements = [contentElement];
		if (otherElement) elements.push(otherElement);
		const relatedElement = otherElementRef?.current;
		if (relatedElement) elements.push(relatedElement);
		const timeout = Math.max(...elements.map(getElementEndTime));
		if (!timeout) {
			if (transition === "enter") store.setState("animated", false);
			stopAnimation();
			return;
		}
		return afterTimeout(Math.max(timeout - 1e3 / 60, 0), stopAnimationSync);
	}, [
		store,
		animated,
		contentElement,
		otherElement,
		otherElementRef,
		open,
		transition
	]);
	props = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.useWrapElement)(props, (element) => /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_dialog_dialog_context_js__WEBPACK_IMPORTED_MODULE_1__.DialogScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	const hidden = isHidden(mounted, props.hidden, alwaysVisible);
	const styleProp = props.style;
	const style = (0,react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
		if (hidden) return {
			...styleProp,
			display: "none"
		};
		return styleProp;
	}, [hidden, styleProp]);
	props = {
		"data-open": open || void 0,
		"data-enter": transition === "enter" || void 0,
		"data-leave": transition === "leave" || void 0,
		hidden,
		...props,
		id,
		ref: (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.useMergeRefs)(id ? store.setContentElement : null, ref, props.ref),
		style
	};
	return (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.removeUndefinedValues)(props);
});
const DisclosureContentImpl = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(function DisclosureContentImpl(props) {
	return (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.createElement)(TagName, useDisclosureContent(props));
});
/**
* Renders an element that can be shown or hidden by a
* [`Disclosure`](https://ariakit.com/components/disclosure) component.
* @see https://ariakit.com/components/disclosure
* @example
* ```jsx {3}
* <DisclosureProvider>
*   <Disclosure>Disclosure</Disclosure>
*   <DisclosureContent>Content</DisclosureContent>
* </DisclosureProvider>
* ```
*/
const DisclosureContent = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(function DisclosureContent({ unmountOnHide, ...props }) {
	const context = (0,_disclosure_context_js__WEBPACK_IMPORTED_MODULE_0__.useDisclosureProviderContext)();
	if ((0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__.useStoreState)(props.store || context, (state) => !unmountOnHide || state?.mounted) === false) return null;
	return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(DisclosureContentImpl, { ...props });
});
//#endregion


//# sourceMappingURL=disclosure-content.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/disclosure/disclosure-context.js"
/*!**************************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/disclosure/disclosure-context.js ***!
  \**************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DisclosureContextProvider: () => (/* binding */ DisclosureContextProvider),
/* harmony export */   DisclosureScopedContextProvider: () => (/* binding */ DisclosureScopedContextProvider),
/* harmony export */   useDisclosureContext: () => (/* binding */ useDisclosureContext),
/* harmony export */   useDisclosureProviderContext: () => (/* binding */ useDisclosureProviderContext),
/* harmony export */   useDisclosureScopedContext: () => (/* binding */ useDisclosureScopedContext)
/* harmony export */ });
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
"use client";

//#region src/disclosure/disclosure-context.tsx
const ctx = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__.createStoreContext)();
/**
* Returns the disclosure store from the nearest disclosure container.
* @example
* function Disclosure() {
*   const store = useDisclosureContext();
*
*   if (!store) {
*     throw new Error("Disclosure must be wrapped in DisclosureProvider");
*   }
*
*   // Use the store...
* }
*/
const useDisclosureContext = ctx.useContext;
const useDisclosureScopedContext = ctx.useScopedContext;
const useDisclosureProviderContext = ctx.useProviderContext;
const DisclosureContextProvider = ctx.ContextProvider;
const DisclosureScopedContextProvider = ctx.ScopedContextProvider;
//#endregion


//# sourceMappingURL=disclosure-context.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/disclosure/disclosure-store.js"
/*!************************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/disclosure/disclosure-store.js ***!
  \************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDisclosureStore: () => (/* binding */ useDisclosureStore),
/* harmony export */   useDisclosureStoreProps: () => (/* binding */ useDisclosureStoreProps)
/* harmony export */ });
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_react_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/react-store */ "./node_modules/@ariakit/react-store/dist/index.js");
/* harmony import */ var _ariakit_components_disclosure_disclosure_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/components/disclosure/disclosure-store */ "./node_modules/@ariakit/components/dist/disclosure/disclosure-store.js");
"use client";



//#region src/disclosure/disclosure-store.ts
function useDisclosureStoreProps(store, update, props) {
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__.useUpdateEffect)(update, [props.store, props.disclosure]);
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_1__.useStoreProps)(store, props, "open", "setOpen");
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_1__.useStoreProps)(store, props, "mounted", "setMounted");
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_1__.useStoreProps)(store, props, "animated");
	return Object.assign(store, { disclosure: props.disclosure });
}
/**
* Creates a disclosure store to control the state of
* [Disclosure](https://ariakit.com/components/disclosure) components.
* @see https://ariakit.com/components/disclosure
* @example
* ```jsx
* const disclosure = useDisclosureStore();
*
* <Disclosure store={disclosure}>Disclosure</Disclosure>
* <DisclosureContent store={disclosure}>Content</DisclosureContent>
* ```
*/
function useDisclosureStore(props = {}) {
	const [store, update] = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_1__.useStore)(_ariakit_components_disclosure_disclosure_store__WEBPACK_IMPORTED_MODULE_2__.createDisclosureStore, props);
	return useDisclosureStoreProps(store, update, props);
}
//#endregion


//# sourceMappingURL=disclosure-store.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/focusable/focusable-context.js"
/*!************************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/focusable/focusable-context.js ***!
  \************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FocusableContext: () => (/* binding */ FocusableContext)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
"use client";

//#region src/focusable/focusable-context.tsx
const FocusableContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(true);
//#endregion


//# sourceMappingURL=focusable-context.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/focusable/focusable.js"
/*!****************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/focusable/focusable.js ***!
  \****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Focusable: () => (/* binding */ Focusable),
/* harmony export */   useFocusable: () => (/* binding */ useFocusable)
/* harmony export */ });
/* harmony import */ var _focusable_context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./focusable-context.js */ "./node_modules/@ariakit/react-components/dist/focusable/focusable-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
"use client";




//#region src/focusable/focusable.tsx
const TagName = "div";
const accessibleWhenDisabledSymbol = Symbol("accessibleWhenDisabled");
const isSafariBrowser = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isSafari)();
const alwaysFocusVisibleInputTypes = [
	"text",
	"search",
	"url",
	"tel",
	"email",
	"password",
	"number",
	"date",
	"month",
	"week",
	"time",
	"datetime",
	"datetime-local"
];
function isAlwaysFocusVisible(element) {
	const { tagName, readOnly, type } = element;
	if (tagName === "TEXTAREA" && !readOnly) return true;
	if (tagName === "SELECT" && !readOnly) return true;
	if (tagName === "INPUT" && !readOnly) return alwaysFocusVisibleInputTypes.includes(type);
	if (element.isContentEditable) return true;
	if (element.getAttribute("role") === "combobox" && element.dataset.name) return true;
	return false;
}
function isNativeTabbable(tagName) {
	if (!tagName) return true;
	return tagName === "button" || tagName === "summary" || tagName === "input" || tagName === "select" || tagName === "textarea" || tagName === "a";
}
function supportsDisabledAttribute(tagName) {
	if (!tagName) return true;
	return tagName === "button" || tagName === "input" || tagName === "select" || tagName === "textarea";
}
function isNativeSubmitControl(element) {
	if (element.tagName === "BUTTON") {
		const { type } = element;
		return type === "submit";
	}
	if (element.tagName === "INPUT") {
		const { type } = element;
		return type === "submit" || type === "image";
	}
	return false;
}
function getTabIndex({ focusable, trulyDisabled, nativeTabbable, supportsDisabled, safariTabIndex, tabIndexProp }) {
	if (!focusable) return tabIndexProp;
	if (trulyDisabled) {
		if (nativeTabbable && !supportsDisabled) return -1;
		return;
	}
	if (nativeTabbable) {
		if (safariTabIndex && tabIndexProp == null) return 0;
		return tabIndexProp;
	}
	return tabIndexProp ?? 0;
}
function useDisableEvent(onEvent, disabled) {
	return (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useEvent)((event) => {
		onEvent?.(event);
		if (event.defaultPrevented) return;
		if (disabled) {
			event.stopPropagation();
			event.preventDefault();
		}
	});
}
let hasInstalledGlobalEventListeners = false;
let isKeyboardModality = true;
function onGlobalMouseDown(event) {
	const target = event.target;
	if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isElement)(target) && !target.hasAttribute("data-focus-visible")) isKeyboardModality = false;
}
function onGlobalKeyDown(event) {
	if (event.metaKey) return;
	if (event.ctrlKey) return;
	if (event.altKey) return;
	isKeyboardModality = true;
}
/**
* Returns props to create a `Focusable` component.
* @see https://ariakit.com/components/focusable
* @example
* ```jsx
* const props = useFocusable();
* <Role {...props}>Focusable</Role>
* ```
*/
const useFocusable = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.createHook)(function useFocusable({ focusable = true, accessibleWhenDisabled, autoFocus, onFocusVisible, ...props }) {
	const ref = (0,react__WEBPACK_IMPORTED_MODULE_3__.useRef)(null);
	const [parentAccessibleWhenDisabled, metadataProps] = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useMetadataProps)(props, accessibleWhenDisabledSymbol, accessibleWhenDisabled);
	accessibleWhenDisabled ??= parentAccessibleWhenDisabled;
	(0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
		if (!focusable) return;
		if (hasInstalledGlobalEventListeners) return;
		(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.addGlobalEventListener)("mousedown", onGlobalMouseDown, true);
		(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.addGlobalEventListener)("keydown", onGlobalKeyDown, true);
		hasInstalledGlobalEventListeners = true;
	}, [focusable]);
	const disabled = focusable && (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.disabledFromProps)(props);
	const trulyDisabled = disabled && !accessibleWhenDisabled;
	const [focusVisible, setFocusVisible] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
	const focusVisibleRef = (0,react__WEBPACK_IMPORTED_MODULE_3__.useRef)(false);
	const nativeSubmitObserverCleanupRef = (0,react__WEBPACK_IMPORTED_MODULE_3__.useRef)(null);
	const cleanupFocusVisible = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useEvent)((element) => {
		nativeSubmitObserverCleanupRef.current?.();
		nativeSubmitObserverCleanupRef.current = null;
		focusVisibleRef.current = false;
		element?.removeAttribute("data-focus-visible");
	});
	(0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
		if (!focusable) return;
		if (!trulyDisabled) return;
		cleanupFocusVisible(ref.current);
		if (focusVisible) setFocusVisible(false);
	}, [
		focusable,
		trulyDisabled,
		focusVisible,
		cleanupFocusVisible
	]);
	(0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
		if (!focusable) return;
		if (!focusVisible) return;
		const element = ref.current;
		if (!element) return;
		if (typeof IntersectionObserver === "undefined") return;
		const observer = new IntersectionObserver(() => {
			if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isFocusable)(element)) {
				focusVisibleRef.current = false;
				setFocusVisible(false);
			}
		});
		observer.observe(element);
		return () => observer.disconnect();
	}, [focusable, focusVisible]);
	(0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
		return () => nativeSubmitObserverCleanupRef.current?.();
	}, []);
	const onKeyPressCapture = useDisableEvent(props.onKeyPressCapture, disabled);
	const onMouseDownCapture = useDisableEvent(props.onMouseDownCapture, disabled);
	const onClickCapture = useDisableEvent(props.onClickCapture, disabled);
	const handleFocusVisible = (event, currentTarget) => {
		if (currentTarget) event.currentTarget = currentTarget;
		if (!focusable) return;
		const element = event.currentTarget;
		if (!element) return;
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.hasFocus)(element)) return;
		onFocusVisible?.(event);
		if (event.defaultPrevented) return;
		element.dataset.focusVisible = "true";
		focusVisibleRef.current = true;
		if (isNativeSubmitControl(element)) {
			nativeSubmitObserverCleanupRef.current?.();
			nativeSubmitObserverCleanupRef.current = null;
			if (typeof IntersectionObserver !== "undefined") {
				const observer = new IntersectionObserver(() => {
					if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isFocusable)(element)) return;
					cleanupFocusVisible(element);
				});
				observer.observe(element);
				nativeSubmitObserverCleanupRef.current = () => observer.disconnect();
			}
			return;
		}
		setFocusVisible(true);
	};
	const onKeyDownCaptureProp = props.onKeyDownCapture;
	const onKeyDownCapture = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useEvent)((event) => {
		onKeyDownCaptureProp?.(event);
		if (event.defaultPrevented) return;
		if (!focusable) return;
		if (focusVisible) return;
		if (focusVisibleRef.current) return;
		if (event.metaKey) return;
		if (event.altKey) return;
		if (event.ctrlKey) return;
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isSelfTarget)(event)) return;
		const element = event.currentTarget;
		const applyFocusVisible = () => handleFocusVisible(event, element);
		(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.queueBeforeEvent)(element, "focusout", applyFocusVisible);
	});
	const onFocusCaptureProp = props.onFocusCapture;
	const onFocusCapture = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useEvent)((event) => {
		onFocusCaptureProp?.(event);
		if (event.defaultPrevented) return;
		if (!focusable) return;
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isSelfTarget)(event)) {
			setFocusVisible(false);
			return;
		}
		const element = event.currentTarget;
		const applyFocusVisible = () => handleFocusVisible(event, element);
		if (isKeyboardModality || isAlwaysFocusVisible(event.target)) (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.queueBeforeEvent)(event.target, "focusout", applyFocusVisible);
		else setFocusVisible(false);
	});
	const onBlurProp = props.onBlur;
	const onBlur = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useEvent)((event) => {
		onBlurProp?.(event);
		if (!focusable) return;
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isFocusEventOutside)(event)) return;
		cleanupFocusVisible(event.currentTarget);
		setFocusVisible(false);
	});
	const autoFocusOnShow = (0,react__WEBPACK_IMPORTED_MODULE_3__.useContext)(_focusable_context_js__WEBPACK_IMPORTED_MODULE_0__.FocusableContext);
	const autoFocusRef = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useEvent)((element) => {
		if (!focusable) return;
		if (!autoFocus) return;
		if (!element) return;
		if (!autoFocusOnShow) return;
		queueMicrotask(() => {
			if ((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.hasFocus)(element)) return;
			if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isFocusable)(element)) return;
			element.focus();
		});
	});
	const tagName = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useTagName)(ref);
	const nativeTabbable = focusable && isNativeTabbable(tagName);
	const supportsDisabled = focusable && supportsDisabledAttribute(tagName);
	const [safariTabIndex, setSafariTabIndex] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
	if (isSafariBrowser) (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
		if (!focusable) return;
		const element = ref.current;
		if (!element) return;
		const { type } = element;
		const isNativeCheckboxOrRadio = element.tagName === "INPUT" && (type === "checkbox" || type === "radio");
		setSafariTabIndex((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.isButton)(element) || isNativeCheckboxOrRadio);
	}, [focusable]);
	const styleProp = props.style;
	const style = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
		if (trulyDisabled) return {
			pointerEvents: "none",
			...styleProp
		};
		return styleProp;
	}, [trulyDisabled, styleProp]);
	props = {
		"data-focus-visible": focusable && focusVisible || void 0,
		"data-autofocus": autoFocus || void 0,
		"aria-disabled": disabled || void 0,
		...props,
		...metadataProps,
		ref: (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.useMergeRefs)(ref, autoFocusRef, props.ref),
		style,
		tabIndex: getTabIndex({
			focusable,
			trulyDisabled,
			nativeTabbable,
			supportsDisabled,
			safariTabIndex,
			tabIndexProp: props.tabIndex
		}),
		disabled: supportsDisabled && trulyDisabled ? true : void 0,
		contentEditable: disabled ? void 0 : props.contentEditable,
		onKeyPressCapture,
		onClickCapture,
		onMouseDownCapture,
		onKeyDownCapture,
		onFocusCapture,
		onBlur
	};
	return (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.removeUndefinedValues)(props);
});
/**
* Renders a focusable element. When this element gains keyboard focus, it gets
* a
* [`data-focus-visible`](https://ariakit.com/guide/styling#data-focus-visible)
* attribute and triggers the
* [`onFocusVisible`](https://ariakit.com/reference/focusable#onfocusvisible)
* prop.
*
* The `Focusable` component supports the
* [`disabled`](https://ariakit.com/reference/focusable#disabled) prop for all
* elements, even those not supporting the native `disabled` attribute. Disabled
* elements using the `Focusable` component may be still accessible via keyboard
* by using the the
* [`accessibleWhenDisabled`](https://ariakit.com/reference/focusable#accessiblewhendisabled)
* prop.
* @see https://ariakit.com/components/focusable
* @example
* ```jsx
* <Focusable>Focusable</Focusable>
* ```
*/
const Focusable = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(function Focusable(props) {
	return (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.createElement)(TagName, useFocusable(props));
});
//#endregion


//# sourceMappingURL=focusable.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/popover/popover-context.js"
/*!********************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/popover/popover-context.js ***!
  \********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PopoverContextProvider: () => (/* binding */ PopoverContextProvider),
/* harmony export */   PopoverScopedContextProvider: () => (/* binding */ PopoverScopedContextProvider),
/* harmony export */   usePopoverContext: () => (/* binding */ usePopoverContext),
/* harmony export */   usePopoverProviderContext: () => (/* binding */ usePopoverProviderContext),
/* harmony export */   usePopoverScopedContext: () => (/* binding */ usePopoverScopedContext)
/* harmony export */ });
/* harmony import */ var _dialog_dialog_context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dialog/dialog-context.js */ "./node_modules/@ariakit/react-components/dist/dialog/dialog-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
"use client";


//#region src/popover/popover-context.tsx
const ctx = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.createStoreContext)([_dialog_dialog_context_js__WEBPACK_IMPORTED_MODULE_0__.DialogContextProvider], [_dialog_dialog_context_js__WEBPACK_IMPORTED_MODULE_0__.DialogScopedContextProvider]);
/**
* Returns the popover store from the nearest popover container.
* @example
* function Popover() {
*   const store = usePopoverContext();
*
*   if (!store) {
*     throw new Error("Popover must be wrapped in PopoverProvider");
*   }
*
*   // Use the store...
* }
*/
const usePopoverContext = ctx.useContext;
const usePopoverScopedContext = ctx.useScopedContext;
const usePopoverProviderContext = ctx.useProviderContext;
const PopoverContextProvider = ctx.ContextProvider;
const PopoverScopedContextProvider = ctx.ScopedContextProvider;
//#endregion


//# sourceMappingURL=popover-context.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/select/select-context.js"
/*!******************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/select/select-context.js ***!
  \******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SelectContextProvider: () => (/* binding */ SelectContextProvider),
/* harmony export */   SelectHeadingContext: () => (/* binding */ SelectHeadingContext),
/* harmony export */   SelectItemCheckedContext: () => (/* binding */ SelectItemCheckedContext),
/* harmony export */   SelectScopedContextProvider: () => (/* binding */ SelectScopedContextProvider),
/* harmony export */   useSelectContext: () => (/* binding */ useSelectContext),
/* harmony export */   useSelectProviderContext: () => (/* binding */ useSelectProviderContext),
/* harmony export */   useSelectScopedContext: () => (/* binding */ useSelectScopedContext)
/* harmony export */ });
/* harmony import */ var _composite_composite_context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composite/composite-context.js */ "./node_modules/@ariakit/react-components/dist/composite/composite-context.js");
/* harmony import */ var _popover_popover_context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../popover/popover-context.js */ "./node_modules/@ariakit/react-components/dist/popover/popover-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
"use client";




//#region src/select/select-context.tsx
const ctx = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.createStoreContext)([_popover_popover_context_js__WEBPACK_IMPORTED_MODULE_1__.PopoverContextProvider, _composite_composite_context_js__WEBPACK_IMPORTED_MODULE_0__.CompositeContextProvider], [_popover_popover_context_js__WEBPACK_IMPORTED_MODULE_1__.PopoverScopedContextProvider, _composite_composite_context_js__WEBPACK_IMPORTED_MODULE_0__.CompositeScopedContextProvider]);
/**
* Returns the select store from the nearest select container.
* @example
* function Select() {
*   const store = useSelectContext();
*
*   if (!store) {
*     throw new Error("Select must be wrapped in SelectProvider");
*   }
*
*   // Use the store...
* }
*/
const useSelectContext = ctx.useContext;
const useSelectScopedContext = ctx.useScopedContext;
const useSelectProviderContext = ctx.useProviderContext;
const SelectContextProvider = ctx.ContextProvider;
const SelectScopedContextProvider = ctx.ScopedContextProvider;
const SelectItemCheckedContext = (0,react__WEBPACK_IMPORTED_MODULE_3__.createContext)(false);
const SelectHeadingContext = (0,react__WEBPACK_IMPORTED_MODULE_3__.createContext)(null);
//#endregion


//# sourceMappingURL=select-context.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/tab/tab-context.js"
/*!************************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/tab/tab-context.js ***!
  \************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TabContextProvider: () => (/* binding */ TabContextProvider),
/* harmony export */   TabScopedContextProvider: () => (/* binding */ TabScopedContextProvider),
/* harmony export */   useTabContext: () => (/* binding */ useTabContext),
/* harmony export */   useTabProviderContext: () => (/* binding */ useTabProviderContext),
/* harmony export */   useTabScopedContext: () => (/* binding */ useTabScopedContext)
/* harmony export */ });
/* harmony import */ var _composite_composite_context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composite/composite-context.js */ "./node_modules/@ariakit/react-components/dist/composite/composite-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
"use client";


//#region src/tab/tab-context.tsx
const ctx = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_1__.createStoreContext)([_composite_composite_context_js__WEBPACK_IMPORTED_MODULE_0__.CompositeContextProvider], [_composite_composite_context_js__WEBPACK_IMPORTED_MODULE_0__.CompositeScopedContextProvider]);
/**
* Returns the tab store from the nearest tab container.
* @example
* function Tab() {
*   const store = useTabContext();
*
*   if (!store) {
*     throw new Error("Tab must be wrapped in TabProvider");
*   }
*
*   // Use the store...
* }
*/
const useTabContext = ctx.useContext;
const useTabScopedContext = ctx.useScopedContext;
const useTabProviderContext = ctx.useProviderContext;
const TabContextProvider = ctx.ContextProvider;
const TabScopedContextProvider = ctx.ScopedContextProvider;
//#endregion


//# sourceMappingURL=tab-context.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/tab/tab-list.js"
/*!*********************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/tab/tab-list.js ***!
  \*********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TabList: () => (/* binding */ TabList),
/* harmony export */   useTabList: () => (/* binding */ useTabList)
/* harmony export */ });
/* harmony import */ var _composite_composite_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composite/composite.js */ "./node_modules/@ariakit/react-components/dist/composite/composite.js");
/* harmony import */ var _tab_context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tab-context.js */ "./node_modules/@ariakit/react-components/dist/tab/tab-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var _ariakit_react_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ariakit/react-store */ "./node_modules/@ariakit/react-store/dist/index.js");
"use client";






//#region src/tab/tab-list.tsx
const TagName = "div";
/**
* Returns props to create a `TabList` component.
* @see https://ariakit.com/components/tab
* @example
* ```jsx
* const store = useTabStore();
* const props = useTabList({ store });
* <Role {...props}>
*   <Tab>Tab 1</Tab>
*   <Tab>Tab 2</Tab>
* </Role>
* <TabPanel store={store}>Panel 1</TabPanel>
* <TabPanel store={store}>Panel 2</TabPanel>
* ```
*/
const useTabList = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.createHook)(function useTabList({ store, ...props }) {
	const context = (0,_tab_context_js__WEBPACK_IMPORTED_MODULE_1__.useTabProviderContext)();
	store = store || context;
	(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.invariant)(store,  true && "TabList must receive a `store` prop or be wrapped in a TabProvider component.");
	const orientation = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_5__.useStoreState)(store, (state) => state.orientation === "both" ? void 0 : state.orientation);
	props = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.useWrapElement)(props, (element) => /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tab_context_js__WEBPACK_IMPORTED_MODULE_1__.TabScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	if (store.composite) props = {
		focusable: false,
		...props
	};
	props = {
		role: "tablist",
		"aria-orientation": orientation,
		...props
	};
	props = (0,_composite_composite_js__WEBPACK_IMPORTED_MODULE_0__.useComposite)({
		store,
		...props
	});
	return props;
});
/**
* Renders a composite tab list wrapper for
* [`Tab`](https://ariakit.com/reference/tab) elements.
* @see https://ariakit.com/components/tab
* @example
* ```jsx {2-5}
* <TabProvider>
*   <TabList>
*     <Tab>Tab 1</Tab>
*     <Tab>Tab 2</Tab>
*   </TabList>
*   <TabPanel>Panel 1</TabPanel>
*   <TabPanel>Panel 2</TabPanel>
* </TabProvider>
* ```
*/
const TabList = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(function TabList(props) {
	return (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.createElement)(TagName, useTabList(props));
});
//#endregion


//# sourceMappingURL=tab-list.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/tab/tab-panel.js"
/*!**********************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/tab/tab-panel.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TabPanel: () => (/* binding */ TabPanel),
/* harmony export */   useTabPanel: () => (/* binding */ useTabPanel)
/* harmony export */ });
/* harmony import */ var _focusable_focusable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../focusable/focusable.js */ "./node_modules/@ariakit/react-components/dist/focusable/focusable.js");
/* harmony import */ var _collection_collection_item_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../collection/collection-item.js */ "./node_modules/@ariakit/react-components/dist/collection/collection-item.js");
/* harmony import */ var _disclosure_disclosure_content_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../disclosure/disclosure-content.js */ "./node_modules/@ariakit/react-components/dist/disclosure/disclosure-content.js");
/* harmony import */ var _disclosure_disclosure_store_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../disclosure/disclosure-store.js */ "./node_modules/@ariakit/react-components/dist/disclosure/disclosure-store.js");
/* harmony import */ var _tab_context_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tab-context.js */ "./node_modules/@ariakit/react-components/dist/tab/tab-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var _ariakit_react_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ariakit/react-store */ "./node_modules/@ariakit/react-store/dist/index.js");
"use client";










//#region src/tab/tab-panel.tsx
const TagName = "div";
/**
* Returns props to create a `TabPanel` component.
* @see https://ariakit.com/components/tab
* @example
* ```jsx
* const store = useTabStore();
* const props = useTabPanel({ store });
* <TabList store={store}>
*   <Tab>Tab 1</Tab>
* </TabList>
* <Role {...props}>Panel 1</Role>
* ```
*/
const useTabPanel = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_5__.createHook)(function useTabPanel({ store, unmountOnHide, tabId: tabIdProp, getItem: getItemProp, scrollRestoration, scrollElement, ...props }) {
	const context = (0,_tab_context_js__WEBPACK_IMPORTED_MODULE_4__.useTabProviderContext)();
	store = store || context;
	(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_6__.invariant)(store,  true && "TabPanel must receive a `store` prop or be wrapped in a TabProvider component.");
	const ref = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(null);
	const id = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_5__.useId)(props.id);
	const tabId = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_9__.useStoreState)(store.panels, () => tabIdProp || store?.panels.item(id)?.tabId);
	const disclosure = (0,_disclosure_disclosure_store_js__WEBPACK_IMPORTED_MODULE_3__.useDisclosureStore)({ open: (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_9__.useStoreState)(store, (state) => !!tabId && state.selectedId === tabId) });
	const mounted = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_9__.useStoreState)(disclosure, "mounted");
	const scrollPositionRef = (0,react__WEBPACK_IMPORTED_MODULE_7__.useRef)(/* @__PURE__ */ new Map());
	const getScrollElement = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_5__.useEvent)(() => {
		const panelElement = ref.current;
		if (!panelElement) return null;
		if (!scrollElement) return panelElement;
		if (typeof scrollElement === "function") return scrollElement(panelElement);
		if ("current" in scrollElement) return scrollElement.current;
		return scrollElement;
	});
	(0,react__WEBPACK_IMPORTED_MODULE_7__.useEffect)(() => {
		if (!scrollRestoration) return;
		if (!mounted) return;
		const element = getScrollElement();
		if (!element) return;
		if (scrollRestoration === "reset") {
			element.scroll(0, 0);
			return;
		}
		if (!tabId) return;
		const position = scrollPositionRef.current.get(tabId);
		element.scroll(position?.x ?? 0, position?.y ?? 0);
		const onScroll = () => {
			scrollPositionRef.current.set(tabId, {
				x: element.scrollLeft,
				y: element.scrollTop
			});
		};
		element.addEventListener("scroll", onScroll);
		return () => {
			element.removeEventListener("scroll", onScroll);
		};
	}, [
		scrollRestoration,
		mounted,
		tabId,
		getScrollElement
	]);
	const [hasTabbableChildren, setHasTabbableChildren] = (0,react__WEBPACK_IMPORTED_MODULE_7__.useState)(false);
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_5__.useSafeLayoutEffect)(() => {
		if (!mounted) return;
		const element = ref.current;
		if (!element) return;
		setHasTabbableChildren(!!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_6__.getFirstTabbableIn)(element));
	}, [mounted, tabId]);
	const getItem = (0,react__WEBPACK_IMPORTED_MODULE_7__.useCallback)((item) => {
		const nextItem = {
			...item,
			id: id || item.id,
			tabId: tabIdProp
		};
		if (getItemProp) return getItemProp(nextItem);
		return nextItem;
	}, [
		id,
		tabIdProp,
		getItemProp
	]);
	const onKeyDownProp = props.onKeyDown;
	const onKeyDown = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_5__.useEvent)((event) => {
		onKeyDownProp?.(event);
		if (event.defaultPrevented) return;
		if (!store?.composite) return;
		const action = {
			ArrowLeft: store.previous,
			ArrowRight: store.next,
			Home: store.first,
			End: store.last
		}[event.key];
		if (!action) return;
		const { selectedId } = store.getState();
		const nextId = action({ activeId: selectedId });
		if (!nextId) return;
		event.preventDefault();
		store.move(nextId);
	});
	props = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_5__.useWrapElement)(props, (element) => /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_tab_context_js__WEBPACK_IMPORTED_MODULE_4__.TabScopedContextProvider, {
		value: store,
		children: element
	}), [store]);
	props = {
		role: "tabpanel",
		"aria-labelledby": props["aria-label"] != null ? void 0 : tabId || void 0,
		...props,
		id,
		children: unmountOnHide && !mounted ? null : props.children,
		ref: (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_5__.useMergeRefs)(ref, props.ref),
		onKeyDown
	};
	props = (0,_focusable_focusable_js__WEBPACK_IMPORTED_MODULE_0__.useFocusable)({
		focusable: !store.composite && !hasTabbableChildren,
		...props
	});
	props = (0,_disclosure_disclosure_content_js__WEBPACK_IMPORTED_MODULE_2__.useDisclosureContent)({
		store: disclosure,
		...props
	});
	props = (0,_collection_collection_item_js__WEBPACK_IMPORTED_MODULE_1__.useCollectionItem)({
		store: store.panels,
		...props,
		getItem
	});
	return props;
});
/**
* Renders a tab panel element that's controlled by a
* [`Tab`](https://ariakit.com/reference/tab) component.
*
* If the [`tabId`](https://ariakit.com/reference/tab-panel#tabid) prop isn't
* provided, the tab panel will automatically associate with a
* [`Tab`](https://ariakit.com/reference/tab) based on its position in the DOM.
* Alternatively, you can render a single tab panel with a dynamic
* [`tabId`](https://ariakit.com/reference/tab-panel#tabid) value pointing to
* the selected tab.
* @see https://ariakit.com/components/tab
* @example
* ```jsx {6,7}
* <TabProvider>
*   <TabList>
*     <Tab>Tab 1</Tab>
*     <Tab>Tab 2</Tab>
*   </TabList>
*   <TabPanel>Panel 1</TabPanel>
*   <TabPanel>Panel 2</TabPanel>
* </TabProvider>
* ```
*/
const TabPanel = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_5__.forwardRef)(function TabPanel(props) {
	return (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_5__.createElement)(TagName, useTabPanel(props));
});
//#endregion


//# sourceMappingURL=tab-panel.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/tab/tab-store.js"
/*!**********************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/tab/tab-store.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useTabStore: () => (/* binding */ useTabStore),
/* harmony export */   useTabStoreProps: () => (/* binding */ useTabStoreProps)
/* harmony export */ });
/* harmony import */ var _combobox_combobox_context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../combobox/combobox-context.js */ "./node_modules/@ariakit/react-components/dist/combobox/combobox-context.js");
/* harmony import */ var _composite_composite_store_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../composite/composite-store.js */ "./node_modules/@ariakit/react-components/dist/composite/composite-store.js");
/* harmony import */ var _select_select_context_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../select/select-context.js */ "./node_modules/@ariakit/react-components/dist/select/select-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _ariakit_react_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ariakit/react-store */ "./node_modules/@ariakit/react-store/dist/index.js");
/* harmony import */ var _ariakit_components_tab_tab_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ariakit/components/tab/tab-store */ "./node_modules/@ariakit/components/dist/tab/tab-store.js");
"use client";







//#region src/tab/tab-store.ts
function useTabStoreProps(store, update, props) {
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useUpdateEffect)(update, [props.composite, props.combobox]);
	store = (0,_composite_composite_store_js__WEBPACK_IMPORTED_MODULE_1__.useCompositeStoreProps)(store, update, props);
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_5__.useStoreProps)(store, props, "selectedId", "setSelectedId");
	(0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_5__.useStoreProps)(store, props, "selectOnMove");
	const [panels, updatePanels] = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_5__.useStore)(() => store.panels, {});
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_3__.useUpdateEffect)(updatePanels, [store, updatePanels]);
	return Object.assign((0,react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => ({
		...store,
		panels
	}), [store, panels]), {
		composite: props.composite,
		combobox: props.combobox
	});
}
/**
* Creates a tab store to control the state of
* [Tab](https://ariakit.com/components/tab) components.
* @see https://ariakit.com/components/tab
* @example
* ```jsx
* const tab = useTabStore();
*
* <TabList store={tab}>
*   <Tab>Tab 1</Tab>
*   <Tab>Tab 2</Tab>
* </TabList>
* <TabPanel store={tab}>Panel 1</TabPanel>
* <TabPanel store={tab}>Panel 2</TabPanel>
* ```
*/
function useTabStore(props = {}) {
	const combobox = (0,_combobox_combobox_context_js__WEBPACK_IMPORTED_MODULE_0__.useComboboxContext)();
	const composite = (0,_select_select_context_js__WEBPACK_IMPORTED_MODULE_2__.useSelectContext)() || combobox;
	props = {
		...props,
		composite: props.composite !== void 0 ? props.composite : composite,
		combobox: props.combobox !== void 0 ? props.combobox : combobox
	};
	const [store, update] = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_5__.useStore)(_ariakit_components_tab_tab_store__WEBPACK_IMPORTED_MODULE_6__.createTabStore, props);
	return useTabStoreProps(store, update, props);
}
//#endregion


//# sourceMappingURL=tab-store.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-components/dist/tab/tab.js"
/*!****************************************************************!*\
  !*** ./node_modules/@ariakit/react-components/dist/tab/tab.js ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tab: () => (/* binding */ Tab),
/* harmony export */   useTab: () => (/* binding */ useTab)
/* harmony export */ });
/* harmony import */ var _composite_composite_item_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composite/composite-item.js */ "./node_modules/@ariakit/react-components/dist/composite/composite-item.js");
/* harmony import */ var _tab_context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tab-context.js */ "./node_modules/@ariakit/react-components/dist/tab/tab-context.js");
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var _ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ariakit/react-store */ "./node_modules/@ariakit/react-store/dist/index.js");
"use client";







//#region src/tab/tab.tsx
const TagName = "button";
/**
* Returns props to create a `Tab` component.
* @see https://ariakit.com/components/tab
* @example
* ```jsx
* const store = useTabStore();
* const props = useTab({ store });
* <TabList store={store}>
*   <Role {...props}>Tab 1</Role>
* </TabList>
* <TabPanel store={store}>Panel 1</TabPanel>
* ```
*/
const useTab = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.createHook)(function useTab({ store, getItem: getItemProp, ...props }) {
	const context = (0,_tab_context_js__WEBPACK_IMPORTED_MODULE_1__.useTabScopedContext)();
	store = store || context;
	(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.invariant)(store,  true && "Tab must be wrapped in a TabList component.");
	const defaultId = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.useId)();
	const id = props.id || defaultId;
	const dimmed = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_3__.disabledFromProps)(props);
	const getItem = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)((item) => {
		const nextItem = {
			...item,
			dimmed
		};
		if (getItemProp) return getItemProp(nextItem);
		return nextItem;
	}, [dimmed, getItemProp]);
	const onClickProp = props.onClick;
	const onClick = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.useEvent)((event) => {
		onClickProp?.(event);
		if (event.defaultPrevented) return;
		store?.setSelectedId(id);
	});
	const panelId = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__.useStoreState)(store.panels, () => store.panel(id)?.id);
	const shouldRegisterItem = defaultId ? props.shouldRegisterItem : false;
	const isActive = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__.useStoreState)(store, (state) => !!id && state.activeId === id);
	const selected = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__.useStoreState)(store, (state) => !!id && state.selectedId === id);
	const hasActiveItem = (0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__.useStoreState)(store, (state) => !!store.item(state.activeId));
	const canRegisterComposedItem = isActive || selected && !hasActiveItem;
	const accessibleWhenDisabled = selected || (props.accessibleWhenDisabled ?? true);
	if ((0,_ariakit_react_store__WEBPACK_IMPORTED_MODULE_6__.useStoreState)(store.combobox || store.composite, "virtualFocus")) props = {
		...props,
		tabIndex: -1
	};
	props = {
		role: "tab",
		"aria-selected": selected,
		"aria-controls": panelId || void 0,
		...props,
		id,
		onClick
	};
	if (store.composite) {
		const defaultProps = {
			id,
			accessibleWhenDisabled,
			store: store.composite,
			shouldRegisterItem: canRegisterComposedItem && shouldRegisterItem,
			rowId: props.rowId,
			render: props.render
		};
		props = {
			...props,
			render: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_composite_composite_item_js__WEBPACK_IMPORTED_MODULE_0__.CompositeItem, {
				...defaultProps,
				render: store.combobox && store.composite !== store.combobox ? /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_composite_composite_item_js__WEBPACK_IMPORTED_MODULE_0__.CompositeItem, {
					...defaultProps,
					store: store.combobox
				}) : defaultProps.render
			})
		};
	}
	props = (0,_composite_composite_item_js__WEBPACK_IMPORTED_MODULE_0__.useCompositeItem)({
		store,
		...props,
		accessibleWhenDisabled,
		getItem,
		shouldRegisterItem
	});
	return props;
});
/**
* Renders a tab element inside a
* [`TabList`](https://ariakit.com/reference/tab-list) wrapper.
* @see https://ariakit.com/components/tab
* @example
* ```jsx {3,4}
* <TabProvider>
*   <TabList>
*     <Tab>Tab 1</Tab>
*     <Tab>Tab 2</Tab>
*   </TabList>
*   <TabPanel>Panel 1</TabPanel>
*   <TabPanel>Panel 2</TabPanel>
* </TabProvider>
* ```
*/
const Tab = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.memo)((0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(function Tab(props) {
	return (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_2__.createElement)(TagName, useTab(props));
}));
//#endregion


//# sourceMappingURL=tab.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-store/dist/index.js"
/*!*********************************************************!*\
  !*** ./node_modules/@ariakit/react-store/dist/index.js ***!
  \*********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useStore: () => (/* binding */ useStore),
/* harmony export */   useStoreProps: () => (/* binding */ useStoreProps),
/* harmony export */   useStoreState: () => (/* binding */ useStoreState),
/* harmony export */   useStoreStateObject: () => (/* binding */ useStoreStateObject)
/* harmony export */ });
/* harmony import */ var _ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/react-utils */ "./node_modules/@ariakit/react-utils/dist/index.js");
/* harmony import */ var _ariakit_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/store */ "./node_modules/@ariakit/store/dist/index.js");
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var use_sync_external_store_shim__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! use-sync-external-store/shim */ "./node_modules/use-sync-external-store/shim/index.js");
"use client";





//#region src/index.tsx
const noopSubscribe = () => () => {};
function useStoreState(store, keyOrSelector = _ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.identity) {
	const storeSubscribe = react__WEBPACK_IMPORTED_MODULE_3__.useCallback((callback) => {
		if (!store) return noopSubscribe();
		return (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_1__.subscribe)(store, null, callback);
	}, [store]);
	const getSnapshot = () => {
		const key = typeof keyOrSelector === "string" ? keyOrSelector : null;
		const selector = typeof keyOrSelector === "function" ? keyOrSelector : null;
		const state = store?.getState();
		if (selector) return selector(state);
		if (!state) return;
		if (!key) return;
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(state, key)) return;
		return state[key];
	};
	return (0,use_sync_external_store_shim__WEBPACK_IMPORTED_MODULE_4__.useSyncExternalStore)(storeSubscribe, getSnapshot, getSnapshot);
}
function useStoreStateObject(store, object) {
	const objRef = react__WEBPACK_IMPORTED_MODULE_3__.useRef({});
	const storeSubscribe = react__WEBPACK_IMPORTED_MODULE_3__.useCallback((callback) => {
		if (!store) return noopSubscribe();
		return (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_1__.subscribe)(store, null, callback);
	}, [store]);
	const getSnapshot = () => {
		const state = store?.getState();
		let updated = false;
		const obj = objRef.current;
		for (const prop in object) {
			const keyOrSelector = object[prop];
			if (typeof keyOrSelector === "function") {
				const value = keyOrSelector(state);
				if (!Object.is(value, obj[prop])) {
					obj[prop] = value;
					updated = true;
				}
			}
			if (typeof keyOrSelector === "string") {
				if (!state) continue;
				if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(state, keyOrSelector)) continue;
				const value = state[keyOrSelector];
				if (!Object.is(value, obj[prop])) {
					obj[prop] = value;
					updated = true;
				}
			}
		}
		if (updated) objRef.current = { ...obj };
		return objRef.current;
	};
	return (0,use_sync_external_store_shim__WEBPACK_IMPORTED_MODULE_4__.useSyncExternalStore)(storeSubscribe, getSnapshot, getSnapshot);
}
/**
* Synchronizes the store with the props, including parent store props.
* @param store The store to synchronize.
* @param props The props to synchronize with.
* @param key The key of the value prop.
* @param setKey The key of the setValue prop.
*/
function useStoreProps(store, props, key, setKey) {
	const value = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_2__.hasOwnProperty)(props, key) ? props[key] : void 0;
	const propsRef = (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__.useLiveRef)({
		value,
		setValue: setKey ? props[setKey] : void 0
	});
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__.useSafeLayoutEffect)(() => {
		return (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_1__.sync)(store, [key], (state, prev) => {
			const { value, setValue } = propsRef.current;
			if (!setValue) return;
			if (state[key] === prev[key]) return;
			if (state[key] === value) return;
			setValue(state[key]);
		});
	}, [store, key]);
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__.useSafeLayoutEffect)(() => {
		if (value === void 0) return;
		store.setState(key, value);
		return (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_1__.batch)(store, [key], () => {
			if (value === void 0) return;
			store.setState(key, value);
		});
	});
}
/**
* Creates a React store from a core store object and returns a tuple with the
* store and a function to update the store.
* @param createStore A function that receives the props and returns a core
* store object.
* @param props The props to pass to the createStore function.
*/
function useStore(createStore, props) {
	const [store, setStore] = react__WEBPACK_IMPORTED_MODULE_3__.useState(() => createStore(props));
	(0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__.useSafeLayoutEffect)(() => (0,_ariakit_store__WEBPACK_IMPORTED_MODULE_1__.init)(store), [store]);
	const useState = react__WEBPACK_IMPORTED_MODULE_3__.useCallback((keyOrSelector) => useStoreState(store, keyOrSelector), [store]);
	return [react__WEBPACK_IMPORTED_MODULE_3__.useMemo(() => ({
		...store,
		useState
	}), [store, useState]), (0,_ariakit_react_utils__WEBPACK_IMPORTED_MODULE_0__.useEvent)(() => {
		setStore((store) => createStore({
			...props,
			...store.getState()
		}));
	})];
}
//#endregion


//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@ariakit/react-utils/dist/index.js"
/*!*********************************************************!*\
  !*** ./node_modules/@ariakit/react-utils/dist/index.js ***!
  \*********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

var react__WEBPACK_IMPORTED_MODULE_1___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   createHook: () => (/* binding */ createHook),
/* harmony export */   createStoreContext: () => (/* binding */ createStoreContext),
/* harmony export */   forwardRef: () => (/* binding */ forwardRef),
/* harmony export */   getRefProperty: () => (/* binding */ getRefProperty),
/* harmony export */   isValidElementWithRef: () => (/* binding */ isValidElementWithRef),
/* harmony export */   memo: () => (/* binding */ memo),
/* harmony export */   mergeProps: () => (/* binding */ mergeProps),
/* harmony export */   setRef: () => (/* binding */ setRef),
/* harmony export */   useAttribute: () => (/* binding */ useAttribute),
/* harmony export */   useBooleanEvent: () => (/* binding */ useBooleanEvent),
/* harmony export */   useDeferredValue: () => (/* binding */ useDeferredValue),
/* harmony export */   useEvent: () => (/* binding */ useEvent),
/* harmony export */   useForceUpdate: () => (/* binding */ useForceUpdate),
/* harmony export */   useId: () => (/* binding */ useId),
/* harmony export */   useInitialValue: () => (/* binding */ useInitialValue),
/* harmony export */   useIsMouseMoving: () => (/* binding */ useIsMouseMoving),
/* harmony export */   useLiveRef: () => (/* binding */ useLiveRef),
/* harmony export */   useMergeRefs: () => (/* binding */ useMergeRefs),
/* harmony export */   useMetadataProps: () => (/* binding */ useMetadataProps),
/* harmony export */   usePortalRef: () => (/* binding */ usePortalRef),
/* harmony export */   useSafeLayoutEffect: () => (/* binding */ useSafeLayoutEffect),
/* harmony export */   useTagName: () => (/* binding */ useTagName),
/* harmony export */   useTransactionState: () => (/* binding */ useTransactionState),
/* harmony export */   useUpdateEffect: () => (/* binding */ useUpdateEffect),
/* harmony export */   useUpdateLayoutEffect: () => (/* binding */ useUpdateLayoutEffect),
/* harmony export */   useWrapElement: () => (/* binding */ useWrapElement)
/* harmony export */ });
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
"use client";




//#region src/misc.ts
/**
* Helpers for working with refs, elements, and props.
* @module General utilities
*/
/**
* Sets both a function and object React ref.
*
* Returns a callback ref cleanup function when one is provided.
*/
function setRef(ref, value) {
	if (typeof ref === "function") {
		const cleanup = ref(value);
		if (typeof cleanup === "function") return cleanup;
	} else if (ref) ref.current = value;
}
/**
* Checks if an element is a valid React element with a ref.
*/
function isValidElementWithRef(element) {
	if (!element) return false;
	if (!(0,react__WEBPACK_IMPORTED_MODULE_1__.isValidElement)(element)) return false;
	if ("ref" in element.props) return true;
	if ("ref" in element) return true;
	return false;
}
/**
* Gets the ref property from a React element.
*/
function getRefProperty(element) {
	if (!isValidElementWithRef(element)) return null;
	return { ...element.props }.ref || element.ref;
}
/**
* Merges two sets of props.
*/
function mergeProps(base, overrides) {
	const props = { ...base };
	for (const key in overrides) {
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwnProperty)(overrides, key)) continue;
		if (key === "className") {
			const prop = "className";
			const baseClass = base[prop];
			const overrideClass = overrides[prop];
			if (baseClass && overrideClass) props[prop] = `${baseClass} ${overrideClass}`;
			else props[prop] = overrideClass || baseClass;
			continue;
		}
		if (key === "style") {
			const prop = "style";
			props[prop] = base[prop] ? {
				...base[prop],
				...overrides[prop]
			} : overrides[prop];
			continue;
		}
		const overrideValue = overrides[key];
		if (key.startsWith("on")) {
			if (typeof overrideValue !== "function") continue;
			const baseValue = base[key];
			if (typeof baseValue === "function") {
				props[key] = (...args) => {
					overrideValue(...args);
					baseValue(...args);
				};
				continue;
			}
		}
		props[key] = overrideValue;
	}
	return props;
}
//#endregion
//#region src/hooks.ts
/**
* React hooks for refs, events, ids, effects, and element metadata.
* @module Hooks
*/
const _React = { .../*#__PURE__*/ (react__WEBPACK_IMPORTED_MODULE_1___namespace_cache || (react__WEBPACK_IMPORTED_MODULE_1___namespace_cache = __webpack_require__.t(react__WEBPACK_IMPORTED_MODULE_1__, 2))) };
const useReactId = _React.useId;
const useReactDeferredValue = _React.useDeferredValue;
const useReactInsertionEffect = _React.useInsertionEffect;
/**
* `React.useLayoutEffect` that fallbacks to `React.useEffect` on server side.
*/
const useSafeLayoutEffect = _ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.canUseDOM ? react__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_1__.useEffect;
/**
* Returns a value that never changes even if the argument is updated.
* @example
* function Component({ prop }) {
*   const initialProp = useInitialValue(prop);
* }
*/
function useInitialValue(value) {
	const [initialValue] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(value);
	return initialValue;
}
/**
* Creates a `React.RefObject` that is constantly updated with the incoming
* value.
* @example
* function Component({ prop }) {
*   const propRef = useLiveRef(prop);
* }
*/
function useLiveRef(value) {
	const ref = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(value);
	useSafeLayoutEffect(() => {
		ref.current = value;
	});
	return ref;
}
/**
* Creates a stable callback function that has access to the latest state and
* can be used within event handlers and effect callbacks. Throws when used in
* the render phase.
* @example
* function Component(props) {
*   const onClick = useEvent(props.onClick);
*   React.useEffect(() => {}, [onClick]);
* }
*/
function useEvent(callback) {
	const ref = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(() => {
		throw new Error("Cannot call an event handler while rendering.");
	});
	if (useReactInsertionEffect) useReactInsertionEffect(() => {
		ref.current = callback;
	});
	else ref.current = callback;
	return (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((...args) => ref.current?.(...args), []);
}
/**
* Creates a React state that calls a callback function whenever the state
* changes and rolls back to the previous state on cleanup.
*/
function useTransactionState(callback) {
	const [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
	useSafeLayoutEffect(() => {
		if (state == null) return;
		if (!callback) return;
		let prevState = null;
		callback((prev) => {
			prevState = prev;
			return state;
		});
		return () => {
			callback(prevState);
		};
	}, [state, callback]);
	return [state, setState];
}
/**
* Merges React Refs into a single memoized function ref so you can pass it to
* an element.
* @example
* const Component = React.forwardRef((props, ref) => {
*   const internalRef = React.useRef();
*   return <div {...props} ref={useMergeRefs(internalRef, ref)} />;
* });
*/
function useMergeRefs(...refs) {
	return (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
		if (!refs.some(Boolean)) return;
		return (value) => {
			const refEffects = [];
			for (const ref of refs) {
				if (!ref) continue;
				const cleanup = setRef(ref, value);
				refEffects.push({
					ref,
					cleanup: typeof cleanup === "function" ? cleanup : void 0
				});
			}
			if (!refEffects.some((effect) => effect.cleanup)) return;
			return () => {
				for (const { ref, cleanup } of refEffects) if (cleanup) cleanup();
				else setRef(ref, null);
			};
		};
	}, refs);
}
/**
* Generates a unique ID. Uses React's useId if available.
*/
function useId(defaultId) {
	if (useReactId) {
		const reactId = useReactId();
		if (defaultId) return defaultId;
		return reactId;
	}
	const [id, setId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(defaultId);
	useSafeLayoutEffect(() => {
		if (defaultId || id) return;
		setId(`id-${Math.random().toString(36).slice(2, 8)}`);
	}, [defaultId, id]);
	return defaultId || id;
}
/**
* Uses React's useDeferredValue if available.
*/
function useDeferredValue(value) {
	if (useReactDeferredValue) return useReactDeferredValue(value);
	const [deferredValue, setDeferredValue] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(value);
	(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
		const raf = requestAnimationFrame(() => setDeferredValue(value));
		return () => cancelAnimationFrame(raf);
	}, [value]);
	return deferredValue;
}
/**
* Returns the tag name by parsing an element ref.
* @example
* function Component(props) {
*   const ref = React.useRef();
*   const tagName = useTagName(ref, "button"); // div
*   return <div ref={ref} {...props} />;
* }
*/
function useTagName(refOrElement, type) {
	const stringOrUndefined = (type) => {
		if (typeof type !== "string") return;
		return type;
	};
	const [tagName, setTagName] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(() => stringOrUndefined(type));
	useSafeLayoutEffect(() => {
		setTagName((refOrElement && "current" in refOrElement ? refOrElement.current : refOrElement)?.tagName.toLowerCase() || stringOrUndefined(type));
	}, [refOrElement, type]);
	return tagName;
}
/**
* Returns the attribute value of an element.
* @example
* function Component(props) {
*   const ref = React.useRef();
*   const role = useAttribute(ref, "role", props.role);
*   return <div ref={ref} {...props} />;
* }
*/
function useAttribute(refOrElement, attributeName, defaultValue) {
	const initialValue = useInitialValue(defaultValue);
	const [attribute, setAttribute] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialValue);
	(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
		const element = refOrElement && "current" in refOrElement ? refOrElement.current : refOrElement;
		if (!element) return;
		const callback = () => {
			const value = element.getAttribute(attributeName);
			setAttribute(value == null ? initialValue : value);
		};
		const observer = new MutationObserver(callback);
		observer.observe(element, { attributeFilter: [attributeName] });
		callback();
		return () => observer.disconnect();
	}, [
		refOrElement,
		attributeName,
		initialValue
	]);
	return attribute;
}
/**
* A `React.useEffect` that will not run on the first render.
*/
function useUpdateEffect(effect, deps) {
	const mounted = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
	(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
		if (mounted.current) return effect();
		mounted.current = true;
	}, deps);
	(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => () => {
		mounted.current = false;
	}, []);
}
/**
* A `React.useLayoutEffect` that will not run on the first render.
*/
function useUpdateLayoutEffect(effect, deps) {
	const mounted = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
	useSafeLayoutEffect(() => {
		if (mounted.current) return effect();
		mounted.current = true;
	}, deps);
	useSafeLayoutEffect(() => () => {
		mounted.current = false;
	}, []);
}
/**
* A React hook similar to `useState` and `useReducer`, but with the only
* purpose of re-rendering the component.
*/
function useForceUpdate() {
	return (0,react__WEBPACK_IMPORTED_MODULE_1__.useReducer)(() => [], []);
}
/**
* Returns an event callback similar to `useEvent`, but this also accepts a
* boolean value, which will be turned into a function.
*/
function useBooleanEvent(booleanOrCallback) {
	return useEvent(typeof booleanOrCallback === "function" ? booleanOrCallback : () => booleanOrCallback);
}
/**
* Returns props with an additional `wrapElement` prop.
*/
function useWrapElement(props, callback, deps = []) {
	const wrapElement = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((element) => {
		if (props.wrapElement) element = props.wrapElement(element);
		return callback(element);
	}, [...deps, props.wrapElement]);
	return {
		...props,
		wrapElement
	};
}
/**
* Merges the portalRef prop and returns a `domReady` to be used in the
* components that use Portal underneath.
*/
function usePortalRef(portalProp = false, portalRefProp) {
	const [portalNode, setPortalNode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
	return {
		portalRef: useMergeRefs(setPortalNode, portalRefProp),
		portalNode,
		domReady: !portalProp || portalNode
	};
}
/**
* A hook that passes metadata props around without leaking them to the DOM.
*/
function useMetadataProps(props, key, value) {
	const parent = props.onLoadedMetadataCapture;
	const onLoadedMetadataCapture = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
		return Object.assign(() => {}, parent, ...value !== void 0 ? [{ [key]: value }] : []);
	}, [
		parent,
		key,
		value
	]);
	return [parent?.[key], { onLoadedMetadataCapture }];
}
let hasInstalledGlobalEventListeners = false;
/**
* Returns a function that checks whether the mouse is moving.
*/
function useIsMouseMoving() {
	(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
		if (hasInstalledGlobalEventListeners) return;
		(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.addGlobalEventListener)("mousemove", setMouseMoving, true);
		(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.addGlobalEventListener)("mousedown", resetMouseMoving, true);
		(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.addGlobalEventListener)("mouseup", resetMouseMoving, true);
		(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.addGlobalEventListener)("keydown", resetMouseMoving, true);
		(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.addGlobalEventListener)("scroll", resetMouseMoving, true);
		hasInstalledGlobalEventListeners = true;
	}, []);
	return useEvent(() => mouseMoving);
}
let mouseMoving = false;
let previousScreenX = 0;
let previousScreenY = 0;
function hasMouseMovement(event) {
	const movementX = event.movementX || event.screenX - previousScreenX;
	const movementY = event.movementY || event.screenY - previousScreenY;
	previousScreenX = event.screenX;
	previousScreenY = event.screenY;
	return movementX || movementY || "development" === "test";
}
function setMouseMoving(event) {
	if (!hasMouseMovement(event)) return;
	mouseMoving = true;
}
function resetMouseMoving() {
	mouseMoving = false;
}
//#endregion
//#region src/system.tsx
/**
* The same as `React.forwardRef` but passes the `ref` as a prop and returns a
* component with the same generic type.
*/
function forwardRef(render) {
	const Role = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef((props, ref) => render({
		...props,
		ref
	}));
	Role.displayName = render.displayName || render.name;
	return Role;
}
/**
* The same as `React.memo` but returns a component with the same generic type.
*/
function memo(Component, propsAreEqual) {
	return react__WEBPACK_IMPORTED_MODULE_1__.memo(Component, propsAreEqual);
}
/**
* Creates a React element that supports the `render` and `wrapElement` props.
*/
function createElement(Type, props) {
	const { wrapElement, render, ...rest } = props;
	const mergedRef = useMergeRefs(props.ref, getRefProperty(render));
	let element;
	if (react__WEBPACK_IMPORTED_MODULE_1__.isValidElement(render)) {
		const renderProps = {
			...render.props,
			ref: mergedRef
		};
		element = react__WEBPACK_IMPORTED_MODULE_1__.cloneElement(render, mergeProps(rest, renderProps));
	} else if (render) element = render(rest);
	else element = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Type, { ...rest });
	if (wrapElement) return wrapElement(element);
	return element;
}
/**
* Creates a component hook that accepts props and returns props so they can be
* passed to a React element.
*/
function createHook(useProps) {
	const useRole = (props = {}) => {
		return useProps(props);
	};
	useRole.displayName = useProps.name;
	return useRole;
}
/**
* Creates an Ariakit store context with hooks and provider components.
*/
function createStoreContext(providers = [], scopedProviders = []) {
	const context = react__WEBPACK_IMPORTED_MODULE_1__.createContext(void 0);
	const scopedContext = react__WEBPACK_IMPORTED_MODULE_1__.createContext(void 0);
	const useContext = () => react__WEBPACK_IMPORTED_MODULE_1__.useContext(context);
	const useScopedContext = (onlyScoped = false) => {
		const scoped = react__WEBPACK_IMPORTED_MODULE_1__.useContext(scopedContext);
		const store = useContext();
		if (onlyScoped) return scoped;
		return scoped || store;
	};
	const useProviderContext = () => {
		const scoped = react__WEBPACK_IMPORTED_MODULE_1__.useContext(scopedContext);
		const store = useContext();
		if (scoped && scoped === store) return;
		return store;
	};
	const ContextProvider = (props) => {
		return providers.reduceRight((children, Provider) => /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Provider, {
			...props,
			children
		}), /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(context.Provider, { ...props }));
	};
	const ScopedContextProvider = (props) => {
		return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ContextProvider, {
			...props,
			children: scopedProviders.reduceRight((children, Provider) => /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Provider, {
				...props,
				children
			}), /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(scopedContext.Provider, { ...props }))
		});
	};
	return {
		context,
		scopedContext,
		useContext,
		useScopedContext,
		useProviderContext,
		ContextProvider,
		ScopedContextProvider
	};
}
//#endregion


//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@ariakit/store/dist/index.js"
/*!***************************************************!*\
  !*** ./node_modules/@ariakit/store/dist/index.js ***!
  \***************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   batch: () => (/* binding */ batch),
/* harmony export */   createStore: () => (/* binding */ createStore),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   mergeStore: () => (/* binding */ mergeStore),
/* harmony export */   omit: () => (/* binding */ omit),
/* harmony export */   pick: () => (/* binding */ pick),
/* harmony export */   setup: () => (/* binding */ setup),
/* harmony export */   subscribe: () => (/* binding */ subscribe),
/* harmony export */   sync: () => (/* binding */ sync),
/* harmony export */   throwOnConflictingProps: () => (/* binding */ throwOnConflictingProps)
/* harmony export */ });
/* harmony import */ var _ariakit_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/utils */ "./node_modules/@ariakit/utils/dist/index.js");

//#region src/index.ts
function getInternal(store, key) {
	const internals = store.__unstableInternals;
	(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.invariant)(internals, "Invalid store");
	return internals[key];
}
function hasUpdatedKey(keys, updatedKey) {
	if (!keys) return true;
	for (const currentKey of keys) if (updatedKey instanceof Set) {
		if (updatedKey.has(currentKey)) return true;
	} else if (currentKey === updatedKey) return true;
	return false;
}
function isSameValue(value, other) {
	return value === other || value !== value && other !== other;
}
function getCleanupPrevState(prevState, state, stateBeforeCleanup, updatedKey) {
	let cleanupPrevState;
	for (const key of (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.getKeys)(state)) {
		if (isSameValue(state[key], stateBeforeCleanup[key])) continue;
		if (updatedKey !== void 0 && hasUpdatedKey([key], updatedKey)) continue;
		cleanupPrevState ??= { ...prevState };
		cleanupPrevState[key] = state[key];
	}
	return cleanupPrevState;
}
const MAX_REPAIR_PASSES = 100;
function addKeyedListener(map, keys, listener) {
	if (!keys) return;
	for (const key of keys) {
		let listeners = map.get(key);
		if (!listeners) {
			listeners = /* @__PURE__ */ new Set();
			map.set(key, listeners);
		}
		listeners.add(listener);
	}
}
function deleteKeyedListener(map, keys, listener) {
	if (!map) return;
	if (!keys) return;
	for (const key of keys) {
		const listeners = map.get(key);
		if (!listeners) continue;
		listeners.delete(listener);
		if (!listeners.size) map.delete(key);
	}
}
function getFastPathNotifiedListeners(frame) {
	const notifiedListeners = /* @__PURE__ */ new Set();
	const currentListener = frame.currentListener;
	if (!currentListener) return notifiedListeners;
	for (const listener of frame.keyedListeners) {
		notifiedListeners.add(listener);
		if (listener === currentListener) return notifiedListeners;
	}
	notifiedListeners.clear();
	notifiedListeners.add(currentListener);
	return notifiedListeners;
}
function preserveFastPathNotifiedListeners(frame) {
	frame.notifiedListeners ??= getFastPathNotifiedListeners(frame);
}
function hasFastPathPassedListener(frame, listener) {
	if (!frame.currentListener) return false;
	let foundCurrentKeyedListener = false;
	for (const currentListener of frame.keyedListeners) {
		if (currentListener === frame.currentListener) {
			foundCurrentKeyedListener = true;
			continue;
		}
		if (!foundCurrentKeyedListener) continue;
		if (currentListener === listener) return false;
	}
	let foundListener = false;
	for (const currentListener of frame.group.listeners) {
		if (currentListener === frame.currentListener) return foundListener;
		if (currentListener === listener) foundListener = true;
	}
	return false;
}
function preserveFastPathFrames(fastPathFrames, group, listener) {
	for (const frame of fastPathFrames) {
		if (frame.group !== group) continue;
		if (frame.recovering) continue;
		if (listener && !frame.keyedListeners.has(listener)) continue;
		preserveFastPathNotifiedListeners(frame);
		for (const currentListener of frame.group.listeners) {
			if (currentListener === frame.currentListener) break;
			if (!hasFastPathPassedListener(frame, currentListener)) continue;
			frame.notifiedListeners?.add(currentListener);
		}
	}
}
function preserveFastPathPassedListeners(fastPathFrames, group, listener) {
	for (const frame of fastPathFrames) {
		if (frame.group !== group) continue;
		if (frame.recovering) continue;
		if (!hasFastPathPassedListener(frame, listener)) continue;
		preserveFastPathNotifiedListeners(frame);
		frame.notifiedListeners?.add(listener);
	}
}
function preserveFastPathPassedKeyedListeners({ fastPathFrames, group, keys, listener }) {
	const wasRegistered = group.listeners.has(listener);
	for (const frame of fastPathFrames) {
		if (frame.group !== group) continue;
		if (frame.recovering) continue;
		if (!keys.includes(frame.updatedKey)) continue;
		if (hasFastPathPassedListener(frame, listener)) {
			preserveFastPathNotifiedListeners(frame);
			frame.notifiedListeners?.add(listener);
		} else if (wasRegistered) {
			preserveFastPathNotifiedListeners(frame);
			frame.recoverToLive = true;
		}
	}
}
function clearFastPathNotifiedListener(fastPathFrames, group, listener) {
	for (const frame of fastPathFrames) {
		if (frame.group !== group) continue;
		frame.notifiedListeners?.delete(listener);
	}
}
function addFastPathKeyedListener({ fastPathFrames, group, keys, listener }) {
	for (const frame of fastPathFrames) {
		if (frame.group !== group) continue;
		if (frame.recovering) continue;
		if (!keys.includes(frame.updatedKey)) continue;
		frame.keyedListeners.add(listener);
	}
}
function runPendingCleanup(group, listener) {
	if (!group.disposables.size) return;
	const cleanup = group.disposables.get(listener);
	if (!cleanup) return;
	group.disposables.delete(listener);
	cleanup();
}
function setListenerCleanup(group, listener, cleanup) {
	const currentCleanup = group.disposables.get(listener);
	if (!currentCleanup) {
		group.disposables.set(listener, cleanup);
		return;
	}
	group.disposables.set(listener, () => {
		currentCleanup();
		cleanup();
	});
}
function notifyStoreListener(group, listener, state, prevState, getState, updatedKey) {
	if (group.suspendCounts?.has(listener)) return;
	const { disposables } = group;
	const cleanup = disposables.size ? disposables.get(listener) : void 0;
	if (cleanup) {
		disposables.delete(listener);
		const stateBeforeCleanup = state;
		cleanup();
		state = getState?.() ?? state;
		if (state !== stateBeforeCleanup) prevState = getCleanupPrevState(prevState, state, stateBeforeCleanup, updatedKey) ?? prevState;
	}
	const result = listener(state, prevState);
	if (result) setListenerCleanup(group, listener, result);
}
function runLiveListeners({ group, getState, prevState, updatedKey, notifiedListeners }) {
	const allKeysListeners = group.allKeysListeners;
	for (const listener of group.listeners) {
		if (notifiedListeners?.has(listener)) continue;
		if (!allKeysListeners?.has(listener)) {
			if (!hasUpdatedKey(group.listenerKeys.get(listener), updatedKey)) continue;
		}
		notifiedListeners?.add(listener);
		notifyStoreListener(group, listener, getState(), prevState, getState, updatedKey);
	}
}
/**
* Creates a store.
* @param initialState Initial state.
* @param stores Stores to extend.
*/
function createStore(initialState, ...stores) {
	let state = initialState;
	let prevStateBatch = state;
	let destroy = _ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.noop;
	let batchPending = false;
	let inDispatch = false;
	let updatedKeys = /* @__PURE__ */ new Set();
	const instances = /* @__PURE__ */ new Set();
	const setups = /* @__PURE__ */ new Set();
	const syncListenerGroup = {
		listeners: /* @__PURE__ */ new Set(),
		disposables: /* @__PURE__ */ new Map(),
		listenerKeys: /* @__PURE__ */ new WeakMap()
	};
	const batchListenerGroup = {
		listeners: /* @__PURE__ */ new Set(),
		disposables: /* @__PURE__ */ new Map(),
		listenerKeys: /* @__PURE__ */ new WeakMap()
	};
	const storeSetup = (callback) => {
		setups.add(callback);
		return () => setups.delete(callback);
	};
	const storeInit = () => {
		const initializedInstances = instances.size;
		const instance = Symbol();
		instances.add(instance);
		const maybeDestroy = () => {
			if (!instances.delete(instance)) return;
			if (instances.size) return;
			destroy();
		};
		if (initializedInstances) return maybeDestroy;
		const stateKeys = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.getKeys)(state);
		const desyncs = [];
		for (const store of stores) {
			const storeState = store?.getState?.();
			if (!storeState) continue;
			const keys = stateKeys.filter((key) => (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwnProperty)(storeState, key));
			if (!keys.length) continue;
			if (stores.length === 1 || keys.length === stateKeys.length) {
				for (const key of keys) desyncs.push(sync(store, [key], (state) => {
					setState(key, state[key], true);
				}));
				continue;
			}
			desyncs.push(subscribe(store, keys, (state, prevState) => {
				for (const key of keys) {
					if (state[key] === prevState[key]) continue;
					setState(key, state[key], true);
				}
			}));
			for (const key of keys) {
				const liveState = store?.getState?.();
				if (!liveState) continue;
				setState(key, liveState[key], true);
			}
		}
		const teardowns = [];
		for (const setup of setups) teardowns.push(setup());
		const cleanups = stores.map(init);
		destroy = (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.chain)(...desyncs, ...teardowns, ...cleanups);
		return maybeDestroy;
	};
	const deleteListenerIndexes = (group, listener, keys) => {
		if (keys === void 0) return;
		if (keys) deleteKeyedListener(group.listenersByKey, keys, listener);
		else group.allKeysListeners?.delete(listener);
	};
	const fastPathFrames = [];
	const registerListener = (keys, listener, group = syncListenerGroup) => {
		const listenerKeysValue = keys ? [...keys] : null;
		const wasRegistered = group.listeners.has(listener);
		if (!wasRegistered) clearFastPathNotifiedListener(fastPathFrames, group, listener);
		if (!listenerKeysValue) {
			if (wasRegistered) preserveFastPathFrames(fastPathFrames, group);
			preserveFastPathPassedListeners(fastPathFrames, group, listener);
		} else preserveFastPathPassedKeyedListeners({
			fastPathFrames,
			group,
			keys: listenerKeysValue,
			listener
		});
		if (wasRegistered) {
			preserveFastPathFrames(fastPathFrames, group, listener);
			deleteListenerIndexes(group, listener, group.listenerKeys.get(listener));
		}
		group.listeners.add(listener);
		if (listenerKeysValue) {
			group.listenersByKey ??= /* @__PURE__ */ new Map();
			addKeyedListener(group.listenersByKey, listenerKeysValue, listener);
			addFastPathKeyedListener({
				fastPathFrames,
				group,
				keys: listenerKeysValue,
				listener
			});
		} else {
			group.allKeysListeners ??= /* @__PURE__ */ new Set();
			group.allKeysListeners.add(listener);
		}
		group.listenerKeys.set(listener, listenerKeysValue);
		return () => {
			const cleanup = group.disposables.get(listener);
			group.disposables.delete(listener);
			preserveFastPathFrames(fastPathFrames, group, listener);
			const currentKeys = group.listenerKeys.get(listener);
			deleteListenerIndexes(group, listener, listenerKeysValue);
			if (currentKeys !== listenerKeysValue) deleteListenerIndexes(group, listener, currentKeys);
			group.listenerKeys.delete(listener);
			group.listeners.delete(listener);
			cleanup?.();
		};
	};
	const storeSubscribe = (keys, listener) => registerListener(keys, listener);
	const runInitialListener = (group, listener, prevState) => {
		const shouldSuspend = group.listeners.has(listener);
		if (shouldSuspend) {
			group.suspendCounts ??= /* @__PURE__ */ new Map();
			const count = group.suspendCounts.get(listener) ?? 0;
			group.suspendCounts.set(listener, count + 1);
		}
		let cleanupPrevState;
		try {
			const stateBeforeCleanups = state;
			runPendingCleanup(group, listener);
			if (state !== stateBeforeCleanups) cleanupPrevState = getCleanupPrevState(prevState, state, stateBeforeCleanups);
			const cleanup = listener(state, cleanupPrevState ?? prevState);
			if (cleanup) setListenerCleanup(group, listener, cleanup);
		} finally {
			if (shouldSuspend) {
				const suspendCounts = group.suspendCounts;
				const count = suspendCounts?.get(listener);
				if (count && count > 1) suspendCounts?.set(listener, count - 1);
				else suspendCounts?.delete(listener);
				if (!suspendCounts?.size) delete group.suspendCounts;
			}
		}
	};
	const storeSync = (keys, listener) => {
		runInitialListener(syncListenerGroup, listener, state);
		return registerListener(keys, listener);
	};
	const storeBatch = (keys, listener) => {
		if (!batchListenerGroup.listeners.size && !inDispatch) prevStateBatch = state;
		runInitialListener(batchListenerGroup, listener, prevStateBatch);
		return registerListener(keys, listener, batchListenerGroup);
	};
	const storePick = (keys) => createStore((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.pick)(state, keys), finalStore);
	const storeOmit = (keys) => createStore((0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.omit)(state, keys), finalStore);
	const getState = () => state;
	const runListeners = (group, prevState, updatedKey) => {
		if (!(updatedKey instanceof Set) && !group.allKeysListeners?.size) {
			const keyedListeners = group.listenersByKey?.get(updatedKey);
			if (!keyedListeners) return;
			const frame = {
				group,
				keyedListeners,
				updatedKey,
				currentListener: null
			};
			fastPathFrames.push(frame);
			try {
				for (const listener of keyedListeners) {
					if (frame.notifiedListeners?.has(listener)) continue;
					frame.currentListener = listener;
					frame.notifiedListeners?.add(listener);
					notifyStoreListener(group, listener, state, prevState, getState, updatedKey);
					if (!group.allKeysListeners?.size && !frame.recoverToLive) continue;
					const notifiedListeners = frame.notifiedListeners ?? getFastPathNotifiedListeners(frame);
					frame.notifiedListeners = notifiedListeners;
					frame.recovering = true;
					runLiveListeners({
						group,
						getState,
						prevState,
						updatedKey,
						notifiedListeners
					});
					return;
				}
			} finally {
				fastPathFrames.pop();
			}
			return;
		}
		runLiveListeners({
			group,
			getState,
			prevState,
			updatedKey
		});
	};
	const setState = (key, value, fromStores = false) => {
		if (!(0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwnProperty)(state, key)) return;
		const currentValue = state[key];
		const nextValue = typeof value === "function" ? value(currentValue) : value;
		if (isSameValue(nextValue, currentValue)) return;
		const wasInDispatch = inDispatch;
		inDispatch = true;
		const prevState = state;
		const nextState = {
			...state,
			[key]: nextValue
		};
		state = nextState;
		let superseded = false;
		try {
			if (!fromStores && stores.length) {
				for (const store of stores) {
					store?.setState?.(key, nextValue);
					if (isSameValue(state[key], nextValue)) continue;
					superseded = true;
					break;
				}
				if (superseded) {
					let pass = 0;
					for (; pass < MAX_REPAIR_PASSES; pass += 1) {
						let changed = false;
						for (const store of stores) {
							const previousValue = state[key];
							store?.setState?.(key, previousValue);
							if (!isSameValue(state[key], previousValue)) changed = true;
						}
						if (!changed) break;
					}
					if ( true && pass === MAX_REPAIR_PASSES) console.warn("Parent stores did not converge after a superseded fan-out; a parent listener may be rewriting this key in a cycle.");
				}
			}
			if (!superseded) runListeners(syncListenerGroup, state === nextState ? prevState : {
				...state,
				[key]: prevState[key]
			}, key);
		} finally {
			inDispatch = wasInDispatch;
		}
		if (!batchListenerGroup.listeners.size) {
			if (!inDispatch) prevStateBatch = state;
			return;
		}
		updatedKeys.add(key);
		if (batchPending) return;
		batchPending = true;
		queueMicrotask(() => {
			batchPending = false;
			const snapshot = state;
			const updatedKeysSnapshot = updatedKeys;
			updatedKeys = /* @__PURE__ */ new Set();
			const prevStateBatchBefore = prevStateBatch;
			runListeners(batchListenerGroup, prevStateBatchBefore, updatedKeysSnapshot);
			if (prevStateBatch === prevStateBatchBefore) prevStateBatch = snapshot;
		});
	};
	const finalStore = {
		getState,
		setState,
		__unstableInternals: {
			setup: storeSetup,
			init: storeInit,
			subscribe: storeSubscribe,
			sync: storeSync,
			batch: storeBatch,
			pick: storePick,
			omit: storeOmit
		}
	};
	return finalStore;
}
/**
* Register a callback function that's called when the store is initialized.
*/
function setup(store, ...args) {
	if (!store) return;
	return getInternal(store, "setup")(...args);
}
/**
* Function that should be called when the store is initialized.
*/
function init(store, ...args) {
	if (!store) return;
	return getInternal(store, "init")(...args);
}
/**
* Registers a listener function that's called after state changes in the store.
*/
function subscribe(store, ...args) {
	if (!store) return;
	return getInternal(store, "subscribe")(...args);
}
/**
* Registers a listener function that's called immediately and synchronously
* whenever the store state changes.
*/
function sync(store, ...args) {
	if (!store) return;
	return getInternal(store, "sync")(...args);
}
/**
* Registers a listener function that's called immediately and after a batch
* of state changes in the store.
*/
function batch(store, ...args) {
	if (!store) return;
	return getInternal(store, "batch")(...args);
}
/**
* Creates a new store with a subset of the current store state and keeps them
* in sync.
*/
function omit(store, ...args) {
	if (!store) return;
	return getInternal(store, "omit")(...args);
}
/**
* Creates a new store with a subset of the current store state and keeps them
* in sync.
*/
function pick(store, ...args) {
	if (!store) return;
	return getInternal(store, "pick")(...args);
}
/**
* Merges multiple stores into a single store.
*/
function mergeStore(...stores) {
	const initialState = {};
	for (const store of stores) {
		const nextState = store?.getState?.();
		if (nextState) Object.assign(initialState, nextState);
	}
	const store = createStore(initialState, ...stores);
	return Object.assign({}, ...stores, store);
}
/**
* Throws when a store prop is passed in conjunction with a default state.
*/
function throwOnConflictingProps(props, store) {
	if (false) // removed by dead control flow
{}
	if (!store) return;
	const defaultKeys = Object.entries(props).filter(([key, value]) => key.startsWith("default") && value !== void 0).map(([key]) => {
		const stateKey = key.replace("default", "");
		return `${stateKey[0]?.toLowerCase() || ""}${stateKey.slice(1)}`;
	});
	if (!defaultKeys.length) return;
	const storeState = store.getState();
	if (!defaultKeys.filter((key) => (0,_ariakit_utils__WEBPACK_IMPORTED_MODULE_0__.hasOwnProperty)(storeState, key)).length) return;
	throw new Error(`Passing a store prop in conjunction with a default state is not supported.

const store = useSelectStore();
<SelectProvider store={store} defaultValue="Apple" />
                ^             ^

Instead, pass the default state to the topmost store:

const store = useSelectStore({ defaultValue: "Apple" });
<SelectProvider store={store} />

See https://github.com/ariakit/ariakit/pull/2745 for more details.

If there's a particular need for this, please submit a feature request at https://github.com/ariakit/ariakit
`);
}
//#endregion


//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@ariakit/utils/dist/index.js"
/*!***************************************************!*\
  !*** ./node_modules/@ariakit/utils/dist/index.js ***!
  \***************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UndoManager: () => (/* binding */ UndoManager),
/* harmony export */   addGlobalEventListener: () => (/* binding */ addGlobalEventListener),
/* harmony export */   addItemToArray: () => (/* binding */ addItemToArray),
/* harmony export */   afterPaint: () => (/* binding */ afterPaint),
/* harmony export */   applyState: () => (/* binding */ applyState),
/* harmony export */   beforePaint: () => (/* binding */ beforePaint),
/* harmony export */   canUseDOM: () => (/* binding */ canUseDOM),
/* harmony export */   chain: () => (/* binding */ chain),
/* harmony export */   contains: () => (/* binding */ contains),
/* harmony export */   createUndoManager: () => (/* binding */ createUndoManager),
/* harmony export */   cx: () => (/* binding */ cx),
/* harmony export */   defaultValue: () => (/* binding */ defaultValue),
/* harmony export */   disableFocus: () => (/* binding */ disableFocus),
/* harmony export */   disableFocusIn: () => (/* binding */ disableFocusIn),
/* harmony export */   disabledFromElement: () => (/* binding */ disabledFromElement),
/* harmony export */   disabledFromProps: () => (/* binding */ disabledFromProps),
/* harmony export */   fireBlurEvent: () => (/* binding */ fireBlurEvent),
/* harmony export */   fireClickEvent: () => (/* binding */ fireClickEvent),
/* harmony export */   fireEvent: () => (/* binding */ fireEvent),
/* harmony export */   fireFocusEvent: () => (/* binding */ fireFocusEvent),
/* harmony export */   fireKeyboardEvent: () => (/* binding */ fireKeyboardEvent),
/* harmony export */   flatten2DArray: () => (/* binding */ flatten2DArray),
/* harmony export */   focusIfNeeded: () => (/* binding */ focusIfNeeded),
/* harmony export */   focusIntoView: () => (/* binding */ focusIntoView),
/* harmony export */   getActiveElement: () => (/* binding */ getActiveElement),
/* harmony export */   getAllFocusable: () => (/* binding */ getAllFocusable),
/* harmony export */   getAllFocusableIn: () => (/* binding */ getAllFocusableIn),
/* harmony export */   getAllTabbable: () => (/* binding */ getAllTabbable),
/* harmony export */   getAllTabbableIn: () => (/* binding */ getAllTabbableIn),
/* harmony export */   getClosestFocusable: () => (/* binding */ getClosestFocusable),
/* harmony export */   getDocument: () => (/* binding */ getDocument),
/* harmony export */   getFirstFocusable: () => (/* binding */ getFirstFocusable),
/* harmony export */   getFirstFocusableIn: () => (/* binding */ getFirstFocusableIn),
/* harmony export */   getFirstTabbable: () => (/* binding */ getFirstTabbable),
/* harmony export */   getFirstTabbableIn: () => (/* binding */ getFirstTabbableIn),
/* harmony export */   getInputType: () => (/* binding */ getInputType),
/* harmony export */   getItemRoleByPopupRole: () => (/* binding */ getItemRoleByPopupRole),
/* harmony export */   getKeys: () => (/* binding */ getKeys),
/* harmony export */   getLastTabbable: () => (/* binding */ getLastTabbable),
/* harmony export */   getLastTabbableIn: () => (/* binding */ getLastTabbableIn),
/* harmony export */   getNextTabbable: () => (/* binding */ getNextTabbable),
/* harmony export */   getNextTabbableIn: () => (/* binding */ getNextTabbableIn),
/* harmony export */   getPopupItemRole: () => (/* binding */ getPopupItemRole),
/* harmony export */   getPopupRole: () => (/* binding */ getPopupRole),
/* harmony export */   getPreviousTabbable: () => (/* binding */ getPreviousTabbable),
/* harmony export */   getPreviousTabbableIn: () => (/* binding */ getPreviousTabbableIn),
/* harmony export */   getScrollingElement: () => (/* binding */ getScrollingElement),
/* harmony export */   getTextboxSelection: () => (/* binding */ getTextboxSelection),
/* harmony export */   getTextboxValue: () => (/* binding */ getTextboxValue),
/* harmony export */   getWindow: () => (/* binding */ getWindow),
/* harmony export */   hasFocus: () => (/* binding */ hasFocus),
/* harmony export */   hasFocusWithin: () => (/* binding */ hasFocusWithin),
/* harmony export */   hasOwnProperty: () => (/* binding */ hasOwnProperty),
/* harmony export */   identity: () => (/* binding */ identity),
/* harmony export */   invariant: () => (/* binding */ invariant),
/* harmony export */   isApple: () => (/* binding */ isApple),
/* harmony export */   isButton: () => (/* binding */ isButton),
/* harmony export */   isDownloading: () => (/* binding */ isDownloading),
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isEmpty: () => (/* binding */ isEmpty),
/* harmony export */   isFalsyBooleanCallback: () => (/* binding */ isFalsyBooleanCallback),
/* harmony export */   isFirefox: () => (/* binding */ isFirefox),
/* harmony export */   isFocusEventOutside: () => (/* binding */ isFocusEventOutside),
/* harmony export */   isFocusable: () => (/* binding */ isFocusable),
/* harmony export */   isFrame: () => (/* binding */ isFrame),
/* harmony export */   isInputEvent: () => (/* binding */ isInputEvent),
/* harmony export */   isInteger: () => (/* binding */ isInteger),
/* harmony export */   isMac: () => (/* binding */ isMac),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isOpeningInNewTab: () => (/* binding */ isOpeningInNewTab),
/* harmony export */   isPartiallyHidden: () => (/* binding */ isPartiallyHidden),
/* harmony export */   isPortalEvent: () => (/* binding */ isPortalEvent),
/* harmony export */   isSafari: () => (/* binding */ isSafari),
/* harmony export */   isSelfTarget: () => (/* binding */ isSelfTarget),
/* harmony export */   isTabbable: () => (/* binding */ isTabbable),
/* harmony export */   isTextField: () => (/* binding */ isTextField),
/* harmony export */   isTextbox: () => (/* binding */ isTextbox),
/* harmony export */   isTouchDevice: () => (/* binding */ isTouchDevice),
/* harmony export */   isVisible: () => (/* binding */ isVisible),
/* harmony export */   noop: () => (/* binding */ noop),
/* harmony export */   normalizeString: () => (/* binding */ normalizeString),
/* harmony export */   omit: () => (/* binding */ omit),
/* harmony export */   pick: () => (/* binding */ pick),
/* harmony export */   queueBeforeEvent: () => (/* binding */ queueBeforeEvent),
/* harmony export */   removeUndefinedValues: () => (/* binding */ removeUndefinedValues),
/* harmony export */   restoreFocusIn: () => (/* binding */ restoreFocusIn),
/* harmony export */   reverseArray: () => (/* binding */ reverseArray),
/* harmony export */   scrollIntoViewIfNeeded: () => (/* binding */ scrollIntoViewIfNeeded),
/* harmony export */   setSelectionRange: () => (/* binding */ setSelectionRange),
/* harmony export */   shallowEqual: () => (/* binding */ shallowEqual),
/* harmony export */   sortBasedOnDOMPosition: () => (/* binding */ sortBasedOnDOMPosition),
/* harmony export */   toArray: () => (/* binding */ toArray)
/* harmony export */ });
//#region src/array.ts
/**
* Array helpers used by Ariakit packages.
* @module Array utilities
*/
/**
* Transforms `arg` into an array if it's not already.
* @example
* toArray("a"); // ["a"]
* toArray(["a"]); // ["a"]
*/
function toArray(arg) {
	if (Array.isArray(arg)) return arg;
	return typeof arg !== "undefined" ? [arg] : [];
}
/**
* Immutably adds an item to an array.
* @example
* addItemToArray(["a", "b", "d"], "c", 2); // ["a", "b", "c", "d"]
* @returns {Array} A new array with the item in the passed array index.
*/
function addItemToArray(array, item, index = -1) {
	if (!(index in array)) return [...array, item];
	return [
		...array.slice(0, index),
		item,
		...array.slice(index)
	];
}
/**
* Flattens a 2D array into a one-dimensional array.
* @example
* flatten2DArray([["a"], ["b"], ["c"]]); // ["a", "b", "c"]
*
* @returns {Array} A one-dimensional array.
*/
function flatten2DArray(array) {
	const flattened = [];
	for (const row of array) flattened.push(...row);
	return flattened;
}
/**
* Immutably reverses an array.
* @example
* reverseArray(["a", "b", "c"]); // ["c", "b", "a"]
* @returns {Array} Reversed array.
*/
function reverseArray(array) {
	return array.slice().reverse();
}
//#endregion
//#region src/misc.ts
/**
* Empty function.
*/
function noop(..._) {}
/**
* Compares two objects.
* @example
* shallowEqual({ a: "a" }, {}); // false
* shallowEqual({ a: "a" }, { b: "b" }); // false
* shallowEqual({ a: "a" }, { a: "a" }); // true
* shallowEqual({ a: "a" }, { a: "a", b: "b" }); // false
*/
function shallowEqual(a, b) {
	if (a === b) return true;
	if (!a) return false;
	if (!b) return false;
	if (typeof a !== "object") return false;
	if (typeof b !== "object") return false;
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	const { length } = aKeys;
	if (bKeys.length !== length) return false;
	for (const key of aKeys) if (a[key] !== b[key]) return false;
	return true;
}
/**
* Receives a `setState` argument and calls it with `currentValue` if it's a
* function. Otherwise return the argument as the new value.
* @example
* applyState((value) => value + 1, 1); // 2
* applyState(2, 1); // 2
*/
function applyState(argument, currentValue) {
	if (isUpdater(argument)) return argument(isLazyValue(currentValue) ? currentValue() : currentValue);
	return argument;
}
function isUpdater(argument) {
	return typeof argument === "function";
}
function isLazyValue(value) {
	return typeof value === "function";
}
/**
* Checks whether `arg` is an object or not.
* @returns {boolean}
*/
function isObject(arg) {
	return typeof arg === "object" && arg != null;
}
/**
* Checks whether `arg` is empty or not.
* @example
* isEmpty([]); // true
* isEmpty(["a"]); // false
* isEmpty({}); // true
* isEmpty({ a: "a" }); // false
* isEmpty(); // true
* isEmpty(null); // true
* isEmpty(undefined); // true
* isEmpty(""); // true
*/
function isEmpty(arg) {
	if (Array.isArray(arg)) return !arg.length;
	if (isObject(arg)) return !Object.keys(arg).length;
	if (arg == null) return true;
	if (arg === "") return true;
	return false;
}
/**
* Checks whether `arg` is an integer or not.
* @example
* isInteger(1); // true
* isInteger(1.5); // false
* isInteger("1"); // true
* isInteger("1.5"); // false
*/
function isInteger(arg) {
	if (typeof arg === "number") return Math.floor(arg) === arg;
	return String(Math.floor(Number(arg))) === arg;
}
/**
* Checks whether `prop` is an own property of `obj` or not.
*/
function hasOwnProperty(object, prop) {
	if (typeof Object.hasOwn === "function") return Object.hasOwn(object, prop);
	return Object.prototype.hasOwnProperty.call(object, prop);
}
/**
* Receives functions as arguments and returns a new function that calls all.
*/
function chain(...fns) {
	return (...args) => {
		for (const fn of fns) if (typeof fn === "function") fn(...args);
	};
}
/**
* Returns a string with the truthy values of `args` separated by space.
*/
function cx(...args) {
	return args.filter(Boolean).join(" ") || void 0;
}
/**
* Removes diacritics from a string.
*/
function normalizeString(str) {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
/**
* Omits specific keys from an object.
* @example
* omit({ a: "a", b: "b" }, ["a"]); // { b: "b" }
*/
function omit(object, keys) {
	const result = { ...object };
	for (const key of keys) if (hasOwnProperty(result, key)) delete result[key];
	return result;
}
/**
* Picks specific keys from an object.
* @example
* pick({ a: "a", b: "b" }, ["a"]); // { a: "a" }
*/
function pick(object, paths) {
	const result = {};
	for (const key of paths) if (hasOwnProperty(object, key)) result[key] = object[key];
	return result;
}
/**
* Returns the same argument.
*/
function identity(value) {
	return value;
}
/**
* Runs right before the next paint.
*/
function beforePaint(cb = noop) {
	const raf = requestAnimationFrame(cb);
	return () => cancelAnimationFrame(raf);
}
/**
* Runs after the next paint.
*/
function afterPaint(cb = noop) {
	let raf = requestAnimationFrame(() => {
		raf = requestAnimationFrame(cb);
	});
	return () => cancelAnimationFrame(raf);
}
/**
* Asserts that a condition is true, otherwise throws an error.
* @example
* invariant(
*   condition,
*   process.env.NODE_ENV !== "production" && "Invariant failed"
* );
*/
function invariant(condition, message) {
	if (condition) return;
	if (typeof message !== "string") throw new Error("Invariant failed");
	throw new Error(message);
}
/**
* Similar to `Object.keys` but returns a type-safe array of keys.
*/
function getKeys(obj) {
	return Object.keys(obj);
}
/**
* Checks whether a boolean event prop (e.g., hideOnInteractOutside) was
* intentionally set to false, either with a boolean value or a callback that
* returns false.
*/
function isFalsyBooleanCallback(booleanOrCallback, ...args) {
	const result = typeof booleanOrCallback === "function" ? booleanOrCallback(...args) : booleanOrCallback;
	if (result == null) return false;
	return !result;
}
/**
* Checks whether something is disabled or not based on its props.
*/
function disabledFromProps(props) {
	return props.disabled || props["aria-disabled"] === true || props["aria-disabled"] === "true";
}
/**
* Checks whether something is disabled or not based on its DOM attributes.
*/
function disabledFromElement(element) {
	if (element.getAttribute("aria-disabled") === "true") return true;
	if ("disabled" in element && element.disabled === true) return true;
	return false;
}
/**
* Removes undefined values from an object.
*/
function removeUndefinedValues(obj) {
	const result = {};
	for (const key in obj) if (obj[key] !== void 0) result[key] = obj[key];
	return result;
}
function defaultValue(...values) {
	for (const value of values) if (value !== void 0) return value;
}
//#endregion
//#region src/dom.ts
/**
* DOM helpers for browser, iframe, text input, popup, and scrolling behavior.
* @module DOM utilities
*/
/**
* It's `true` if it is running in a browser environment or `false` if it is not
* (SSR).
* @example
* const title = canUseDOM ? document.title : "";
*/
const canUseDOM = checkIsBrowser();
function checkIsBrowser() {
	return typeof window !== "undefined" && !!window.document?.createElement;
}
/**
* Returns `element.ownerDocument || document`.
*/
function getDocument(node) {
	if (!node) return document;
	if ("self" in node) return node.document;
	return node.ownerDocument || document;
}
/**
* Returns `element.ownerDocument.defaultView || window`.
*/
function getWindow(node) {
	if (!node) return self;
	if ("self" in node) return node.self;
	return getDocument(node).defaultView || window;
}
/**
* Returns `element.ownerDocument.activeElement`.
*/
function getActiveElement(node, activeDescendant = false) {
	const { activeElement } = getDocument(node);
	if (!activeElement?.nodeName) return null;
	if (isFrame(activeElement) && activeElement.contentDocument?.body) return getActiveElement(activeElement.contentDocument.body, activeDescendant);
	if (activeDescendant) {
		const id = activeElement.getAttribute("aria-activedescendant");
		if (id) {
			const element = getDocument(activeElement).getElementById(id);
			if (element) return element;
		}
	}
	return activeElement;
}
/**
* Similar to `Element.prototype.contains`, but a little bit faster when
* `element` is the same as `child`.
* @example
* contains(
*   document.getElementById("parent"),
*   document.getElementById("child")
* );
*/
function contains(parent, child) {
	return parent === child || parent.contains(child);
}
/**
* Checks whether the given event target is an element.
*
* `event.target` and `event.relatedTarget` are `EventTarget`s, which aren't
* necessarily elements — for example `window` or an `XMLHttpRequest` when an
* event is dispatched programmatically. Calling `Element`-only methods such as
* `hasAttribute` on those throws, so guard with this before treating them as
* elements. When you only need a `Node` — for example to call `contains` — use
* `isNode` instead.
*
* It tests `nodeType` rather than `instanceof Element` so that elements coming
* from same-origin child frames (which `addGlobalEventListener` also listens
* on) aren't wrongly rejected for belonging to a different realm.
* @example
* if (isElement(event.target)) {
*   event.target.hasAttribute("data-active");
* }
*/
function isElement(target) {
	return target?.nodeType === 1;
}
/**
* Checks whether the given event target is a node.
*
* Like `isElement`, but only requires the target to be a `Node` rather than an
* element — useful before calling `contains`, which accepts any node. It still
* rejects non-node `EventTarget`s (such as `window` or an `XMLHttpRequest`)
* that would make `contains` throw.
* @example
* if (isNode(event.target)) {
*   contains(element, event.target);
* }
*/
function isNode(target) {
	return typeof target?.nodeType === "number";
}
/**
* Checks whether `element` is a frame element.
*/
function isFrame(element) {
	return element.tagName === "IFRAME";
}
/**
* Checks whether `element` is a native HTML button element.
* @example
* isButton(document.querySelector("button")); // true
* isButton(document.querySelector("input[type='button']")); // true
* isButton(document.querySelector("div")); // false
* isButton(document.querySelector("input[type='text']")); // false
* isButton(document.querySelector("div[role='button']")); // false
*/
function isButton(element) {
	const tagName = element.tagName.toLowerCase();
	if (tagName === "button") return true;
	if (tagName === "input" && element.type) return buttonInputTypes.indexOf(element.type) !== -1;
	return false;
}
const buttonInputTypes = [
	"button",
	"color",
	"file",
	"image",
	"reset",
	"submit"
];
/**
* Checks if the element is visible or not.
*/
function isVisible(element) {
	if (typeof element.checkVisibility === "function") return element.checkVisibility();
	const htmlElement = element;
	return htmlElement.offsetWidth > 0 || htmlElement.offsetHeight > 0 || element.getClientRects().length > 0;
}
/**
* Check whether the given element is a text field, where text field is defined
* by the ability to select within the input.
* @example
* isTextField(document.querySelector("div")); // false
* isTextField(document.querySelector("input")); // true
* isTextField(document.querySelector("input[type='button']")); // false
* isTextField(document.querySelector("textarea")); // true
*/
function isTextField(element) {
	try {
		if (element.tagName === "TEXTAREA") return true;
		if (element.tagName !== "INPUT") return false;
		return element.selectionStart !== null;
	} catch (_error) {
		return false;
	}
}
/**
* Check whether the given element is a text field or a content editable
* element.
*/
function isTextbox(element) {
	return element.isContentEditable || isTextField(element);
}
/**
* Returns the value of the text field or content editable element as a string.
*/
function getTextboxValue(element) {
	if (isTextField(element)) return element.value;
	if (element.isContentEditable) {
		const range = getDocument(element).createRange();
		range.selectNodeContents(element);
		return range.toString();
	}
	return "";
}
/**
* Returns the start and end offsets of the selection in the element.
*/
function getTextboxSelection(element) {
	let start = 0;
	let end = 0;
	if (isTextField(element)) {
		start = element.selectionStart || 0;
		end = element.selectionEnd || 0;
	} else if (element.isContentEditable) {
		const selection = getDocument(element).getSelection();
		if (selection?.rangeCount && selection.anchorNode && contains(element, selection.anchorNode) && selection.focusNode && contains(element, selection.focusNode)) {
			const range = selection.getRangeAt(0);
			const nextRange = range.cloneRange();
			nextRange.selectNodeContents(element);
			nextRange.setEnd(range.startContainer, range.startOffset);
			start = nextRange.toString().length;
			nextRange.setEnd(range.endContainer, range.endOffset);
			end = nextRange.toString().length;
		}
	}
	return {
		start,
		end
	};
}
const allowedPopupRoles = [
	"dialog",
	"menu",
	"listbox",
	"tree",
	"grid"
];
const itemRoleByPopupRole = {
	menu: "menuitem",
	listbox: "option",
	tree: "treeitem"
};
/**
* Returns the popup role from the element's role attribute, if it has one.
*/
function getPopupRole(element, fallback) {
	const role = element?.getAttribute("role");
	if (role && allowedPopupRoles.indexOf(role) !== -1) return role;
	return fallback;
}
/**
* Returns the item role based on the popup role.
*/
function getItemRoleByPopupRole(popupRole) {
	if (popupRole == null) return;
	if (!hasOwnProperty(itemRoleByPopupRole, popupRole)) return;
	return itemRoleByPopupRole[popupRole];
}
/**
* Returns the item role attribute based on the popup's role.
*/
function getPopupItemRole(element, fallback) {
	const popupRole = getPopupRole(element);
	if (typeof popupRole !== "string") return fallback;
	return getItemRoleByPopupRole(popupRole) ?? fallback;
}
/**
* Calls `element.scrollIntoView()` if the element is hidden or partly hidden in
* the viewport.
*/
function scrollIntoViewIfNeeded(element, arg) {
	if (isPartiallyHidden(element) && "scrollIntoView" in element) element.scrollIntoView(arg);
}
/**
* Returns the scrolling container element of a given element.
*/
function getScrollingElement(element) {
	if (!element) return null;
	const isScrollableOverflow = (overflow) => {
		if (overflow === "auto") return true;
		if (overflow === "scroll") return true;
		return false;
	};
	if (element.clientHeight && element.scrollHeight > element.clientHeight) {
		const { overflowY } = getComputedStyle(element);
		if (isScrollableOverflow(overflowY)) return element;
	} else if (element.clientWidth && element.scrollWidth > element.clientWidth) {
		const { overflowX } = getComputedStyle(element);
		if (isScrollableOverflow(overflowX)) return element;
	}
	const doc = getDocument(element);
	return getScrollingElement(element.parentElement) || doc.scrollingElement || doc.body;
}
/**
* Determines whether an element is hidden or partially hidden in the viewport.
*/
function isPartiallyHidden(element) {
	const elementRect = element.getBoundingClientRect();
	const scroller = getScrollingElement(element);
	if (!scroller) return false;
	const scrollerRect = scroller.getBoundingClientRect();
	const isHTML = scroller.tagName === "HTML";
	const scrollerTop = isHTML ? scrollerRect.top + scroller.scrollTop : scrollerRect.top;
	const scrollerBottom = isHTML ? scroller.clientHeight : scrollerRect.bottom;
	const scrollerLeft = isHTML ? scrollerRect.left + scroller.scrollLeft : scrollerRect.left;
	const scrollerRight = isHTML ? scroller.clientWidth : scrollerRect.right;
	const top = elementRect.top < scrollerTop;
	const left = elementRect.left < scrollerLeft;
	const bottom = elementRect.bottom > scrollerBottom;
	const right = elementRect.right > scrollerRight;
	return top || left || bottom || right;
}
/**
* SelectionRange only works on a few types of input. Calling
* `setSelectionRange` on an unsupported input type may throw an error on
* certain browsers. To avoid it, we check if its type supports SelectionRange
* first. It will be a noop to non-supported types until we find a workaround.
*
* @see
* https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
*/
function setSelectionRange(element, ...args) {
	if (/text|search|password|tel|url/i.test(element.type)) element.setSelectionRange(...args);
}
/**
* Sort the items based on their DOM position.
*/
function sortBasedOnDOMPosition(items, getElement) {
	const pairs = items.map((item, index) => [index, item]);
	let isOrderDifferent = false;
	pairs.sort(([indexA, a], [indexB, b]) => {
		const elementA = getElement(a);
		const elementB = getElement(b);
		if (elementA === elementB) return 0;
		if (!elementA || !elementB) return 0;
		if (isElementPreceding(elementA, elementB)) {
			if (indexA > indexB) isOrderDifferent = true;
			return -1;
		}
		if (indexA < indexB) isOrderDifferent = true;
		return 1;
	});
	if (isOrderDifferent) return pairs.map(([_, item]) => item);
	return items;
}
function isElementPreceding(a, b) {
	return Boolean(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
}
//#endregion
//#region src/platform.ts
/**
* Browser and platform detection helpers.
* @module Platform utilities
*/
/**
* Detects if the device has touch capabilities.
*/
function isTouchDevice() {
	return canUseDOM && !!navigator.maxTouchPoints;
}
/**
* Detects Apple device.
*/
function isApple() {
	if (!canUseDOM) return false;
	return /mac|iphone|ipad|ipod/i.test(navigator.platform);
}
/**
* Detects Safari browser.
*/
function isSafari() {
	return canUseDOM && isApple() && /apple/i.test(navigator.vendor);
}
/**
* Detects Firefox browser.
*/
function isFirefox() {
	return canUseDOM && /firefox\//i.test(navigator.userAgent);
}
/**
* Detects Mac computer.
*/
function isMac() {
	return canUseDOM && navigator.platform.startsWith("Mac") && !isTouchDevice();
}
//#endregion
//#region src/events.ts
/**
* Event helpers for dispatching and interpreting browser events.
* @module Event utilities
*/
/**
* Returns `true` if `event` has been fired within a React Portal element.
*/
function isPortalEvent(event) {
	const { currentTarget, target } = event;
	if (!currentTarget) return false;
	if (!isNode(target)) return true;
	return !contains(currentTarget, target);
}
/**
* Returns `true` if `event.target` and `event.currentTarget` are the same.
*/
function isSelfTarget(event) {
	return event.target === event.currentTarget;
}
function isActivatableNavigationTarget(element) {
	if (!isElement(element)) return false;
	const target = element;
	const tagName = target.tagName.toLowerCase();
	if (tagName === "a") return true;
	if (tagName === "button" && target.type === "submit") return true;
	if (tagName === "input" && target.type === "submit") return true;
	return false;
}
/**
* Checks whether the user event is triggering a page navigation in a new tab.
*/
function isOpeningInNewTab(event) {
	const isAppleDevice = isApple();
	if (isAppleDevice && !event.metaKey) return false;
	if (!isAppleDevice && !event.ctrlKey) return false;
	return isActivatableNavigationTarget(event.currentTarget);
}
/**
* Checks whether the user event is triggering a download.
*/
function isDownloading(event) {
	if (!event.altKey) return false;
	return isActivatableNavigationTarget(event.currentTarget);
}
/**
* Creates and dispatches an event.
* @example
* fireEvent(document.getElementById("id"), "blur", {
*   bubbles: true,
*   cancelable: true,
* });
*/
function fireEvent(element, type, eventInit) {
	const event = new Event(type, eventInit);
	return element.dispatchEvent(event);
}
/**
* Creates and dispatches a blur event.
* @example
* fireBlurEvent(document.getElementById("id"));
*/
function fireBlurEvent(element, eventInit) {
	const event = new FocusEvent("blur", eventInit);
	const defaultAllowed = element.dispatchEvent(event);
	const bubbleInit = {
		...eventInit,
		bubbles: true
	};
	element.dispatchEvent(new FocusEvent("focusout", bubbleInit));
	return defaultAllowed;
}
/**
* Creates and dispatches a focus event.
* @example
* fireFocusEvent(document.getElementById("id"));
*/
function fireFocusEvent(element, eventInit) {
	const event = new FocusEvent("focus", eventInit);
	const defaultAllowed = element.dispatchEvent(event);
	const bubbleInit = {
		...eventInit,
		bubbles: true
	};
	element.dispatchEvent(new FocusEvent("focusin", bubbleInit));
	return defaultAllowed;
}
/**
* Creates and dispatches a keyboard event.
* @example
* fireKeyboardEvent(document.getElementById("id"), "keydown", {
*   key: "ArrowDown",
*   shiftKey: true,
* });
*/
function fireKeyboardEvent(element, type, eventInit) {
	const event = new KeyboardEvent(type, eventInit);
	return element.dispatchEvent(event);
}
/**
* Creates and dispatches a click event.
* @example
* fireClickEvent(document.getElementById("id"));
*/
function fireClickEvent(element, eventInit) {
	const event = new MouseEvent("click", eventInit);
	return element.dispatchEvent(event);
}
/**
* Checks whether the focus/blur event is happening from/to outside of the
* container element.
* @example
* const element = document.getElementById("id");
* element.addEventListener("blur", (event) => {
*   if (isFocusEventOutside(event)) {
*     // ...
*   }
* });
*/
function isFocusEventOutside(event, container) {
	const containerElement = container || event.currentTarget;
	const relatedTarget = event.relatedTarget;
	return !isNode(relatedTarget) || !contains(containerElement, relatedTarget);
}
/**
* Returns the `inputType` property of the event, if available.
*/
function getInputType(event) {
	const nativeEvent = "nativeEvent" in event ? event.nativeEvent : event;
	if (!nativeEvent) return;
	if (!("inputType" in nativeEvent)) return;
	if (typeof nativeEvent.inputType !== "string") return;
	return nativeEvent.inputType;
}
/**
* Checks whether the event is an input event.
*/
function isInputEvent(event) {
	return event.type === "input";
}
/**
* Runs a callback on the next animation frame, but before a certain event.
*/
function queueBeforeEvent(element, type, callback, timeout) {
	const createTimer = (callback) => {
		if (timeout) {
			const timerId = setTimeout(callback, timeout);
			return () => clearTimeout(timerId);
		}
		const timerId = requestAnimationFrame(callback);
		return () => cancelAnimationFrame(timerId);
	};
	const cancelTimer = createTimer(() => {
		element.removeEventListener(type, callSync, true);
		callback();
	});
	const callSync = () => {
		cancelTimer();
		callback();
	};
	element.addEventListener(type, callSync, {
		once: true,
		capture: true
	});
	return () => {
		cancelTimer();
		element.removeEventListener(type, callSync, true);
	};
}
/**
* Adds a global event listener, including on child frames.
*/
function addGlobalEventListener(type, listener, options, scope = window) {
	const children = [];
	try {
		scope.document.addEventListener(type, listener, options);
		for (const frame of Array.from(scope.frames)) children.push(addGlobalEventListener(type, listener, options, frame));
	} catch {}
	const removeEventListener = () => {
		try {
			scope.document.removeEventListener(type, listener, options);
		} catch {}
		for (const remove of children) remove();
	};
	return removeEventListener;
}
//#endregion
//#region src/focus.ts
/**
* Focus management helpers for focusable and tabbable elements.
* @module Focus utilities
*/
const selector = "input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], button:not([disabled]), [tabindex], summary, iframe, object, embed, area[href], audio[controls], video[controls], [contenteditable]:not([contenteditable='false'])";
function hasNegativeTabIndex(element) {
	return Number.parseInt(element.getAttribute("tabindex") || "0", 10) < 0;
}
/**
* Checks whether `element` is focusable or not.
* @example
* isFocusable(document.querySelector("input")); // true
* isFocusable(document.querySelector("input[tabindex='-1']")); // true
* isFocusable(document.querySelector("input[hidden]")); // false
* isFocusable(document.querySelector("input:disabled")); // false
*/
function isFocusable(element) {
	if (!element.matches(selector)) return false;
	if (!isVisible(element)) return false;
	if (element.closest("[inert]")) return false;
	return true;
}
/**
* Checks whether `element` is tabbable or not.
* @example
* isTabbable(document.querySelector("input")); // true
* isTabbable(document.querySelector("input[tabindex='-1']")); // false
* isTabbable(document.querySelector("input[hidden]")); // false
* isTabbable(document.querySelector("input:disabled")); // false
*/
function isTabbable(element) {
	if (!isFocusable(element)) return false;
	if (hasNegativeTabIndex(element)) return false;
	if (!("form" in element)) return true;
	if (!element.form) return true;
	if (element.checked) return true;
	if (element.type !== "radio") return true;
	const radioGroup = element.form.elements.namedItem(element.name);
	if (!radioGroup) return true;
	if (!("length" in radioGroup)) return true;
	const activeElement = getActiveElement(element);
	if (!activeElement) return true;
	if (activeElement === element) return true;
	if (!("form" in activeElement)) return true;
	if (activeElement.form !== element.form) return true;
	if (activeElement.name !== element.name) return true;
	return false;
}
/**
* Returns all the focusable elements in `container`.
*/
function getAllFocusableIn(container, includeContainer) {
	const elements = Array.from(container.querySelectorAll(selector));
	if (includeContainer) elements.unshift(container);
	const focusableElements = elements.filter(isFocusable);
	focusableElements.forEach((element, i) => {
		if (!isFrame(element)) return;
		const frameBody = element.contentDocument?.body;
		if (!frameBody) return;
		focusableElements.splice(i, 1, ...getAllFocusableIn(frameBody));
	});
	return focusableElements;
}
/**
* Returns all the focusable elements in the document.
*/
function getAllFocusable(includeBody) {
	return getAllFocusableIn(document.body, includeBody);
}
/**
* Returns the first focusable element in `container`.
*/
function getFirstFocusableIn(container, includeContainer) {
	const [first] = getAllFocusableIn(container, includeContainer);
	return first || null;
}
/**
* Returns the first focusable element in the document.
*/
function getFirstFocusable(includeBody) {
	return getFirstFocusableIn(document.body, includeBody);
}
/**
* Returns all the tabbable elements in `container`, including the container
* itself.
*/
function getAllTabbableIn(container, includeContainer, fallbackToFocusable) {
	const tabbableElements = Array.from(container.querySelectorAll(selector)).filter(isTabbable);
	if (includeContainer && isTabbable(container)) tabbableElements.unshift(container);
	tabbableElements.forEach((element, i) => {
		if (!isFrame(element)) return;
		const frameBody = element.contentDocument?.body;
		if (!frameBody) return;
		const allFrameTabbable = getAllTabbableIn(frameBody, false, fallbackToFocusable);
		tabbableElements.splice(i, 1, ...allFrameTabbable);
	});
	if (!tabbableElements.length && fallbackToFocusable) return getAllFocusableIn(container);
	return tabbableElements;
}
/**
* Returns all the tabbable elements in the document.
*/
function getAllTabbable(fallbackToFocusable) {
	return getAllTabbableIn(document.body, false, fallbackToFocusable);
}
/**
* Returns the first tabbable element in `container`, including the container
* itself if it's tabbable.
*/
function getFirstTabbableIn(container, includeContainer, fallbackToFocusable) {
	if (includeContainer && isTabbable(container)) {
		if (!isFrame(container)) return container;
		const containerFrameBody = container.contentDocument?.body;
		if (!containerFrameBody) return container;
		const frameTabbable = getFirstTabbableIn(containerFrameBody, false, fallbackToFocusable);
		if (frameTabbable) return frameTabbable;
	}
	const elements = container.querySelectorAll(selector);
	for (const element of elements) {
		if (!isTabbable(element)) continue;
		if (isFrame(element)) {
			const frameBody = element.contentDocument?.body;
			if (!frameBody) return element;
			const frameTabbable = getFirstTabbableIn(frameBody, false, fallbackToFocusable);
			if (frameTabbable) return frameTabbable;
			continue;
		}
		return element;
	}
	if (fallbackToFocusable) return getFirstFocusableIn(container);
	return null;
}
/**
* Returns the first tabbable element in the document.
*/
function getFirstTabbable(fallbackToFocusable) {
	return getFirstTabbableIn(document.body, false, fallbackToFocusable);
}
/**
* Returns the last tabbable element in `container`, including the container
* itself if it's tabbable.
*/
function getLastTabbableIn(container, includeContainer, fallbackToFocusable) {
	const allTabbable = getAllTabbableIn(container, includeContainer, fallbackToFocusable);
	return allTabbable[allTabbable.length - 1] || null;
}
/**
* Returns the last tabbable element in the document.
*/
function getLastTabbable(fallbackToFocusable) {
	return getLastTabbableIn(document.body, false, fallbackToFocusable);
}
function getTabbableInDirection({ container, includeContainer, reverse, fallbackToEdge, fallbackToFocusable }) {
	const activeElement = getActiveElement(container);
	const allFocusable = getAllFocusableIn(container, includeContainer);
	if (reverse) allFocusable.reverse();
	const activeIndex = allFocusable.indexOf(activeElement);
	const candidates = allFocusable.slice(activeIndex + 1);
	return candidates.find(isTabbable) || (fallbackToEdge ? allFocusable.find(isTabbable) : null) || (fallbackToFocusable ? candidates[0] : null) || null;
}
/**
* Returns the next tabbable element in `container`.
*/
function getNextTabbableIn(container, includeContainer, fallbackToFirst, fallbackToFocusable) {
	return getTabbableInDirection({
		container,
		includeContainer,
		fallbackToEdge: fallbackToFirst,
		fallbackToFocusable
	});
}
/**
* Returns the next tabbable element in the document.
*/
function getNextTabbable(fallbackToFirst, fallbackToFocusable) {
	return getNextTabbableIn(document.body, false, fallbackToFirst, fallbackToFocusable);
}
/**
* Returns the previous tabbable element in `container`.
*
*/
function getPreviousTabbableIn(container, includeContainer, fallbackToLast, fallbackToFocusable) {
	return getTabbableInDirection({
		container,
		includeContainer,
		reverse: true,
		fallbackToEdge: fallbackToLast,
		fallbackToFocusable
	});
}
/**
* Returns the previous tabbable element in the document.
*/
function getPreviousTabbable(fallbackToLast, fallbackToFocusable) {
	return getPreviousTabbableIn(document.body, false, fallbackToLast, fallbackToFocusable);
}
/**
* Returns the closest focusable element.
*/
function getClosestFocusable(element) {
	while (element && !isFocusable(element)) element = element.parentElement?.closest(selector) ?? null;
	return element || null;
}
/**
* Checks if `element` has focus. Elements that are referenced by
* `aria-activedescendant` are also considered.
* @example
* hasFocus(document.getElementById("id"));
*/
function hasFocus(element) {
	const activeElement = getActiveElement(element);
	if (!activeElement) return false;
	if (activeElement === element) return true;
	const activeDescendant = activeElement.getAttribute("aria-activedescendant");
	if (!activeDescendant) return false;
	return activeDescendant === element.id;
}
/**
* Checks if `element` has focus within. Elements that are referenced by
* `aria-activedescendant` are also considered.
* @example
* hasFocusWithin(document.getElementById("id"));
*/
function hasFocusWithin(element) {
	const activeElement = getActiveElement(element);
	if (!activeElement) return false;
	if (contains(element, activeElement)) return true;
	const activeDescendant = activeElement.getAttribute("aria-activedescendant");
	if (!activeDescendant) return false;
	if (!("id" in element)) return false;
	if (activeDescendant === element.id) return true;
	return !!element.querySelector(`#${CSS.escape(activeDescendant)}`);
}
/**
* Focus on an element only if it's not already focused.
*/
function focusIfNeeded(element) {
	if (!hasFocusWithin(element) && isFocusable(element)) element.focus();
}
/**
* Disable focus on `element`.
*/
function disableFocus(element) {
	const currentTabindex = element.getAttribute("tabindex") ?? "";
	element.setAttribute("data-tabindex", currentTabindex);
	element.setAttribute("tabindex", "-1");
}
/**
* Makes elements inside container not tabbable.
*/
function disableFocusIn(container, includeContainer) {
	const tabbableElements = getAllTabbableIn(container, includeContainer);
	for (const element of tabbableElements) disableFocus(element);
}
/**
* Restores tabbable elements inside container that were affected by
* disableFocusIn.
*/
function restoreFocusIn(container) {
	const elements = container.querySelectorAll("[data-tabindex]");
	const restoreTabIndex = (element) => {
		const tabindex = element.getAttribute("data-tabindex");
		element.removeAttribute("data-tabindex");
		if (tabindex) element.setAttribute("tabindex", tabindex);
		else element.removeAttribute("tabindex");
	};
	if (container.hasAttribute("data-tabindex")) restoreTabIndex(container);
	for (const element of elements) restoreTabIndex(element);
}
/**
* Focus on element and scroll into view.
*/
function focusIntoView(element, options) {
	if (!("scrollIntoView" in element)) element.focus();
	else {
		element.focus({ preventScroll: true });
		element.scrollIntoView({
			block: "nearest",
			inline: "nearest",
			...options
		});
	}
}
//#endregion
//#region src/undo.ts
function createUndoCallback(callback) {
	return async () => {
		const redo = await callback?.();
		return createUndoCallback(async () => {
			await redo?.();
			return callback;
		});
	};
}
/**
* Shared undo manager instance.
*/
const UndoManager = createUndoManager();
/**
* Creates an undo manager with undo and redo stacks.
*/
function createUndoManager({ limit = 100 } = {}) {
	const undoStack = [];
	let redoStack = [];
	let currentGroup = null;
	const canUndo = () => undoStack.length > 0;
	const canRedo = () => redoStack.length > 0;
	const undo = async () => {
		if (!canUndo()) return;
		currentGroup = null;
		redoStack.push(await undoStack.pop()?.());
	};
	const redo = async () => {
		if (!canRedo()) return;
		currentGroup = null;
		undoStack.push(await redoStack.pop()?.());
	};
	const execute = async (callback, group) => {
		if (!callback) return;
		const sameGroup = group === currentGroup;
		currentGroup = group ?? null;
		const nextIndex = sameGroup ? Math.max(0, undoStack.length - 1) : undoStack.length;
		const undoCallback = await callback();
		if (!undoCallback) return;
		redoStack = [];
		const currentUndo = undoStack[nextIndex];
		undoStack[nextIndex] = createUndoCallback(async () => {
			await undoCallback?.();
			const currentRedo = await currentUndo?.();
			return async () => {
				await currentRedo?.();
				await callback?.();
			};
		});
		while (undoStack.length > limit) undoStack.shift();
	};
	return {
		canUndo,
		canRedo,
		undo,
		redo,
		execute
	};
}
//#endregion


//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js"
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}


/***/ },

/***/ "./node_modules/@base-ui/react/internals/getStateAttributesProps.mjs"
/*!***************************************************************************!*\
  !*** ./node_modules/@base-ui/react/internals/getStateAttributesProps.mjs ***!
  \***************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getStateAttributesProps: () => (/* binding */ getStateAttributesProps)
/* harmony export */ });
function getStateAttributesProps(state, customMapping) {
  const props = {};

  /* eslint-disable-next-line guard-for-in */
  for (const key in state) {
    const value = state[key];
    if (customMapping?.hasOwnProperty(key)) {
      const customProps = customMapping[key](value);
      if (customProps != null) {
        Object.assign(props, customProps);
      }
      continue;
    }
    if (value === true) {
      props[`data-${key.toLowerCase()}`] = '';
    } else if (value) {
      props[`data-${key.toLowerCase()}`] = value.toString();
    }
  }
  return props;
}

/***/ },

/***/ "./node_modules/@base-ui/react/internals/useRenderElement.mjs"
/*!********************************************************************!*\
  !*** ./node_modules/@base-ui/react/internals/useRenderElement.mjs ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useRenderElement: () => (/* binding */ useRenderElement)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _base_ui_utils_useMergedRefs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @base-ui/utils/useMergedRefs */ "./node_modules/@base-ui/utils/useMergedRefs.mjs");
/* harmony import */ var _base_ui_utils_getReactElementRef__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @base-ui/utils/getReactElementRef */ "./node_modules/@base-ui/utils/getReactElementRef.mjs");
/* harmony import */ var _base_ui_utils_mergeObjects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @base-ui/utils/mergeObjects */ "./node_modules/@base-ui/utils/mergeObjects.mjs");
/* harmony import */ var _base_ui_utils_warn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @base-ui/utils/warn */ "./node_modules/@base-ui/utils/warn.mjs");
/* harmony import */ var _base_ui_utils_empty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @base-ui/utils/empty */ "./node_modules/@base-ui/utils/empty.mjs");
/* harmony import */ var _getStateAttributesProps_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getStateAttributesProps.mjs */ "./node_modules/@base-ui/react/internals/getStateAttributesProps.mjs");
/* harmony import */ var _utils_resolveClassName_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/resolveClassName.mjs */ "./node_modules/@base-ui/react/utils/resolveClassName.mjs");
/* harmony import */ var _utils_resolveStyle_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/resolveStyle.mjs */ "./node_modules/@base-ui/react/utils/resolveStyle.mjs");
/* harmony import */ var _merge_props_index_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../merge-props/index.mjs */ "./node_modules/@base-ui/react/merge-props/mergeProps.mjs");












/**
 * Renders a Base UI element.
 *
 * @param element The default HTML element to render. Can be overridden by the `render` prop.
 * @param componentProps An object containing the `render` and `className` props to be used for element customization. Other props are ignored.
 * @param params Additional parameters for rendering the element.
 */
function useRenderElement(element, componentProps, params = {}) {
  const renderProp = componentProps.render;
  const outProps = useRenderElementProps(componentProps, params);
  if (params.enabled === false) {
    return null;
  }
  const state = params.state ?? _base_ui_utils_empty__WEBPACK_IMPORTED_MODULE_5__.EMPTY_OBJECT;
  return evaluateRenderProp(element, renderProp, outProps, state);
}

/**
 * Computes render element final props.
 */
function useRenderElementProps(componentProps, params = {}) {
  const {
    className: classNameProp,
    style: styleProp,
    render: renderProp
  } = componentProps;
  const {
    state = _base_ui_utils_empty__WEBPACK_IMPORTED_MODULE_5__.EMPTY_OBJECT,
    ref,
    props,
    stateAttributesMapping,
    enabled = true
  } = params;
  const className = enabled ? (0,_utils_resolveClassName_mjs__WEBPACK_IMPORTED_MODULE_7__.resolveClassName)(classNameProp, state) : undefined;
  const style = enabled ? (0,_utils_resolveStyle_mjs__WEBPACK_IMPORTED_MODULE_8__.resolveStyle)(styleProp, state) : undefined;
  const stateProps = enabled ? (0,_getStateAttributesProps_mjs__WEBPACK_IMPORTED_MODULE_6__.getStateAttributesProps)(state, stateAttributesMapping) : _base_ui_utils_empty__WEBPACK_IMPORTED_MODULE_5__.EMPTY_OBJECT;
  const resolvedProps = enabled && props ? resolveRenderFunctionProps(props) : undefined;

  // Ensure outProps is always a new mutable object when enabled, never EMPTY_OBJECT.
  // This prevents potential TypeError when setting ref, className, or style properties,
  // since EMPTY_OBJECT is frozen and mutations would fail in strict mode.
  const outProps = enabled ? (0,_base_ui_utils_mergeObjects__WEBPACK_IMPORTED_MODULE_3__.mergeObjects)(stateProps, resolvedProps) ?? {} : _base_ui_utils_empty__WEBPACK_IMPORTED_MODULE_5__.EMPTY_OBJECT;

  // SAFETY: The `useMergedRefs` functions use a single hook to store the same value,
  // switching between them at runtime is safe. If this assertion fails, React will
  // throw at runtime anyway.
  // This also skips the `useMergedRefs` call on the server, which is fine because
  // refs are not used on the server side.
  /* eslint-disable react-hooks/rules-of-hooks */
  if (typeof document !== 'undefined') {
    if (!enabled) {
      (0,_base_ui_utils_useMergedRefs__WEBPACK_IMPORTED_MODULE_1__.useMergedRefs)(null, null);
    } else if (Array.isArray(ref)) {
      outProps.ref = (0,_base_ui_utils_useMergedRefs__WEBPACK_IMPORTED_MODULE_1__.useMergedRefsN)([outProps.ref, (0,_base_ui_utils_getReactElementRef__WEBPACK_IMPORTED_MODULE_2__.getReactElementRef)(renderProp), ...ref]);
    } else {
      outProps.ref = (0,_base_ui_utils_useMergedRefs__WEBPACK_IMPORTED_MODULE_1__.useMergedRefs)(outProps.ref, (0,_base_ui_utils_getReactElementRef__WEBPACK_IMPORTED_MODULE_2__.getReactElementRef)(renderProp), ref);
    }
  }
  if (!enabled) {
    return _base_ui_utils_empty__WEBPACK_IMPORTED_MODULE_5__.EMPTY_OBJECT;
  }
  if (className !== undefined) {
    outProps.className = (0,_merge_props_index_mjs__WEBPACK_IMPORTED_MODULE_9__.mergeClassNames)(outProps.className, className);
  }
  if (style !== undefined) {
    outProps.style = (0,_base_ui_utils_mergeObjects__WEBPACK_IMPORTED_MODULE_3__.mergeObjects)(outProps.style, style);
  }
  return outProps;
}
function resolveRenderFunctionProps(props) {
  if (Array.isArray(props)) {
    return (0,_merge_props_index_mjs__WEBPACK_IMPORTED_MODULE_9__.mergePropsN)(props);
  }
  return (0,_merge_props_index_mjs__WEBPACK_IMPORTED_MODULE_9__.mergeProps)(undefined, props);
}

// The symbol React uses internally for lazy components
// https://github.com/facebook/react/blob/a0566250b210499b4c5677f5ac2eedbd71d51a1b/packages/shared/ReactSymbols.js#L31
//
// TODO delete once https://github.com/facebook/react/issues/32392 is fixed
const REACT_LAZY_TYPE = Symbol.for('react.lazy');
const COMPONENT_IDENTIFIER_PATTERN = /^[A-Z][A-Za-z0-9$]*$/;
const LOWERCASE_CHARACTER_PATTERN = /[a-z]/;
function evaluateRenderProp(element, render, props, state) {
  if (render) {
    if (typeof render === 'function') {
      if (true) {
        warnIfRenderPropLooksLikeComponent(render);
      }
      return render(props, state);
    }
    const mergedProps = (0,_merge_props_index_mjs__WEBPACK_IMPORTED_MODULE_9__.mergeProps)(props, render.props);
    mergedProps.ref = props.ref;
    let newElement = render;

    // Workaround for https://github.com/facebook/react/issues/32392
    // This works because the toArray() logic unwrap lazy element type in
    // https://github.com/facebook/react/blob/a0566250b210499b4c5677f5ac2eedbd71d51a1b/packages/react/src/ReactChildren.js#L186
    if (newElement?.$$typeof === REACT_LAZY_TYPE) {
      const children = react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(render);
      newElement = children[0];
    }

    // There is a high number of indirections, the error message thrown by React.cloneElement() is
    // hard to use for developers, this logic provides a better context.
    //
    // Our general guideline is to never change the control flow depending on the environment.
    // However, React.cloneElement() throws if React.isValidElement() is false,
    // so we can throw before with custom message.
    if (true) {
      if (! /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement)) {
        // TODO: fix mui/no-guarded-throw
        // eslint-disable-next-line mui/no-guarded-throw
        throw new Error(['Base UI: The `render` prop was provided an invalid React element as `React.isValidElement(render)` is `false`.', 'A valid React element must be provided to the `render` prop because it is cloned with props to replace the default element.', 'https://base-ui.com/r/invalid-render-prop'].join('\n'));
      }
    }
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(newElement, mergedProps);
  }
  if (element) {
    if (typeof element === 'string') {
      return renderTag(element, props);
    }
  }
  // Unreachable, but the typings on `useRenderElement` need to be reworked
  // to annotate it correctly.
  throw new Error( true ? 'Base UI: Render element or function are not defined.' : 0);
}
function warnIfRenderPropLooksLikeComponent(renderFn) {
  const functionName = renderFn.name;
  if (functionName.length === 0) {
    return;
  }
  if (!COMPONENT_IDENTIFIER_PATTERN.test(functionName)) {
    return;
  }
  if (!LOWERCASE_CHARACTER_PATTERN.test(functionName)) {
    return;
  }
  (0,_base_ui_utils_warn__WEBPACK_IMPORTED_MODULE_4__.warn)(`The \`render\` prop received a function named \`${functionName}\` that starts with an uppercase letter.`, 'This usually means a React component was passed directly as `render={Component}`.', 'Base UI calls `render` as a plain function, which can break the Rules of Hooks during reconciliation.', 'If this is an intentional render callback, rename it to start with a lowercase letter.', 'Use `render={<Component />}` or `render={(props) => <Component {...props} />}` instead.', 'https://base-ui.com/r/invalid-render-prop');
}
function renderTag(Tag, props) {
  if (Tag === 'button') {
    return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      type: "button",
      ...props,
      key: props.key
    });
  }
  if (Tag === 'img') {
    return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      alt: "",
      ...props,
      key: props.key
    });
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Tag, props);
}

/***/ },

/***/ "./node_modules/@base-ui/react/merge-props/mergeProps.mjs"
/*!****************************************************************!*\
  !*** ./node_modules/@base-ui/react/merge-props/mergeProps.mjs ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeEventPreventable: () => (/* binding */ makeEventPreventable),
/* harmony export */   mergeClassNames: () => (/* binding */ mergeClassNames),
/* harmony export */   mergeProps: () => (/* binding */ mergeProps),
/* harmony export */   mergePropsN: () => (/* binding */ mergePropsN)
/* harmony export */ });
/* harmony import */ var _base_ui_utils_mergeObjects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @base-ui/utils/mergeObjects */ "./node_modules/@base-ui/utils/mergeObjects.mjs");

const EMPTY_PROPS = {};

/* eslint-disable id-denylist */
/**
 * Merges multiple sets of React props. It follows the Object.assign pattern where the rightmost object's fields overwrite
 * the conflicting ones from others. This doesn't apply to event handlers, `className` and `style` props.
 *
 * Event handlers are merged and called in right-to-left order (rightmost handler executes first, leftmost last).
 * For React synthetic events, the rightmost handler can prevent prior (left-positioned) handlers from executing
 * by calling `event.preventBaseUIHandler()`. For non-synthetic events (custom events with primitive/object values),
 * all handlers always execute without prevention capability.
 *
 * The `className` prop is merged by concatenating classes in right-to-left order (rightmost class appears first in the string).
 * The `style` prop is merged with rightmost styles overwriting the prior ones.
 *
 * Props can either be provided as objects or as functions that take the previous props as an argument.
 * The function will receive the merged props up to that point (going from left to right):
 * so in the case of `(obj1, obj2, fn, obj3)`, `fn` will receive the merged props of `obj1` and `obj2`.
 * The function is responsible for chaining event handlers if needed (that is, we don't run the merge logic).
 *
 * Event handlers returned by the functions are not automatically prevented when `preventBaseUIHandler` is called.
 * They must check `event.baseUIHandlerPrevented` themselves and bail out if it's true.
 *
 * @important **`ref` is not merged.**
 * @param a Props object to merge.
 * @param b Props object to merge. The function will overwrite conflicting props from `a`.
 * @param c Props object to merge. The function will overwrite conflicting props from previous parameters.
 * @param d Props object to merge. The function will overwrite conflicting props from previous parameters.
 * @param e Props object to merge. The function will overwrite conflicting props from previous parameters.
 * @returns The merged props.
 * @public
 */

function mergeProps(a, b, c, d, e) {
  if (!c && !d && !e && !a) {
    return createInitialMergedProps(b);
  }

  // We need to mutably own `merged`.
  let merged = createInitialMergedProps(a);
  if (b) {
    merged = mergeInto(merged, b);
  }
  if (c) {
    merged = mergeInto(merged, c);
  }
  if (d) {
    merged = mergeInto(merged, d);
  }
  if (e) {
    merged = mergeInto(merged, e);
  }
  return merged;
}
/* eslint-enable id-denylist */

/**
 * Merges an arbitrary number of React props using the same logic as {@link mergeProps}.
 * This function accepts an array of props instead of individual arguments.
 *
 * This has slightly lower performance than {@link mergeProps} due to accepting an array
 * instead of a fixed number of arguments. Prefer {@link mergeProps} when merging 5 or
 * fewer prop sets for better performance.
 *
 * @param props Array of props to merge.
 * @returns The merged props.
 * @see mergeProps
 * @public
 */
function mergePropsN(props) {
  if (props.length === 0) {
    return EMPTY_PROPS;
  }
  if (props.length === 1) {
    return createInitialMergedProps(props[0]);
  }

  // We need to mutably own `merged`.
  let merged = createInitialMergedProps(props[0]);
  for (let i = 1; i < props.length; i += 1) {
    merged = mergeInto(merged, props[i]);
  }
  return merged;
}
function createInitialMergedProps(inputProps) {
  if (isPropsGetter(inputProps)) {
    // Getter-returned handlers intentionally keep their existing semantics.
    return {
      ...resolvePropsGetter(inputProps, EMPTY_PROPS)
    };
  }
  return copyInitialProps(inputProps);
}
function mergeInto(merged, inputProps) {
  if (isPropsGetter(inputProps)) {
    return resolvePropsGetter(inputProps, merged);
  }
  return mutablyMergeInto(merged, inputProps);
}
function copyInitialProps(inputProps) {
  const copiedProps = {
    ...inputProps
  };

  // `copiedProps` is our fresh own-object copy, so iterating with `for...in` is safe here.
  // eslint-disable-next-line guard-for-in
  for (const propName in copiedProps) {
    const propValue = copiedProps[propName];
    if (isEventHandler(propName, propValue)) {
      copiedProps[propName] = wrapEventHandler(propValue);
    }
  }
  return copiedProps;
}

/**
 * Merges two sets of props. In case of conflicts, the external props take precedence.
 */
function mutablyMergeInto(mergedProps, externalProps) {
  if (!externalProps) {
    return mergedProps;
  }

  // eslint-disable-next-line guard-for-in
  for (const propName in externalProps) {
    const externalPropValue = externalProps[propName];
    switch (propName) {
      case 'style':
        {
          mergedProps[propName] = (0,_base_ui_utils_mergeObjects__WEBPACK_IMPORTED_MODULE_0__.mergeObjects)(mergedProps.style, externalPropValue);
          break;
        }
      case 'className':
        {
          mergedProps[propName] = mergeClassNames(mergedProps.className, externalPropValue);
          break;
        }
      default:
        {
          if (isEventHandler(propName, externalPropValue)) {
            mergedProps[propName] = mergeEventHandlers(mergedProps[propName], externalPropValue);
          } else {
            mergedProps[propName] = externalPropValue;
          }
        }
    }
  }
  return mergedProps;
}
function isEventHandler(key, value) {
  // This approach is more efficient than using a regex.
  const code0 = key.charCodeAt(0);
  const code1 = key.charCodeAt(1);
  const code2 = key.charCodeAt(2);
  return code0 === 111 /* o */ && code1 === 110 /* n */ && code2 >= 65 /* A */ && code2 <= 90 /* Z */ && (typeof value === 'function' || typeof value === 'undefined');
}
function isPropsGetter(inputProps) {
  return typeof inputProps === 'function';
}
function resolvePropsGetter(inputProps, previousProps) {
  if (isPropsGetter(inputProps)) {
    return inputProps(previousProps);
  }
  return inputProps ?? EMPTY_PROPS;
}
function mergeEventHandlers(ourHandler, theirHandler) {
  if (!theirHandler) {
    return ourHandler;
  }
  if (!ourHandler) {
    return wrapEventHandler(theirHandler);
  }
  return (...args) => {
    const event = args[0];
    if (isSyntheticEvent(event)) {
      const baseUIEvent = event;
      makeEventPreventable(baseUIEvent);
      const result = theirHandler(...args);
      if (!baseUIEvent.baseUIHandlerPrevented) {
        ourHandler?.(...args);
      }
      return result;
    }
    const result = theirHandler(...args);
    ourHandler?.(...args);
    return result;
  };
}
function wrapEventHandler(handler) {
  if (!handler) {
    return handler;
  }
  return (...args) => {
    const event = args[0];
    if (isSyntheticEvent(event)) {
      makeEventPreventable(event);
    }
    return handler(...args);
  };
}
function makeEventPreventable(event) {
  event.preventBaseUIHandler = () => {
    event.baseUIHandlerPrevented = true;
  };
  return event;
}
function mergeClassNames(ourClassName, theirClassName) {
  if (theirClassName) {
    if (ourClassName) {
      // eslint-disable-next-line prefer-template
      return theirClassName + ' ' + ourClassName;
    }
    return theirClassName;
  }
  return ourClassName;
}
function isSyntheticEvent(event) {
  return event != null && typeof event === 'object' && 'nativeEvent' in event;
}

/***/ },

/***/ "./node_modules/@base-ui/react/use-render/useRender.mjs"
/*!**************************************************************!*\
  !*** ./node_modules/@base-ui/react/use-render/useRender.mjs ***!
  \**************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useRender: () => (/* binding */ useRender)
/* harmony export */ });
/* harmony import */ var _internals_useRenderElement_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../internals/useRenderElement.mjs */ "./node_modules/@base-ui/react/internals/useRenderElement.mjs");

/**
 * Renders a Base UI element.
 *
 * @public
 */
function useRender(params) {
  return (0,_internals_useRenderElement_mjs__WEBPACK_IMPORTED_MODULE_0__.useRenderElement)(params.defaultTagName ?? 'div', params, params);
}

/***/ },

/***/ "./node_modules/@base-ui/react/utils/resolveClassName.mjs"
/*!****************************************************************!*\
  !*** ./node_modules/@base-ui/react/utils/resolveClassName.mjs ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   resolveClassName: () => (/* binding */ resolveClassName)
/* harmony export */ });
/**
 * If the provided className is a string, it will be returned as is.
 * Otherwise, the function will call the className function with the state as the first argument.
 *
 * @param className
 * @param state
 */
function resolveClassName(className, state) {
  return typeof className === 'function' ? className(state) : className;
}

/***/ },

/***/ "./node_modules/@base-ui/react/utils/resolveStyle.mjs"
/*!************************************************************!*\
  !*** ./node_modules/@base-ui/react/utils/resolveStyle.mjs ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   resolveStyle: () => (/* binding */ resolveStyle)
/* harmony export */ });
/**
 * If the provided style is an object, it will be returned as is.
 * Otherwise, the function will call the style function with the state as the first argument.
 *
 * @param style
 * @param state
 */
function resolveStyle(style, state) {
  return typeof style === 'function' ? style(state) : style;
}

/***/ },

/***/ "./node_modules/@base-ui/utils/empty.mjs"
/*!***********************************************!*\
  !*** ./node_modules/@base-ui/utils/empty.mjs ***!
  \***********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EMPTY_ARRAY: () => (/* binding */ EMPTY_ARRAY),
/* harmony export */   EMPTY_OBJECT: () => (/* binding */ EMPTY_OBJECT),
/* harmony export */   NOOP: () => (/* binding */ NOOP)
/* harmony export */ });
function NOOP() {}
const EMPTY_ARRAY = Object.freeze([]);
const EMPTY_OBJECT = Object.freeze({});

/***/ },

/***/ "./node_modules/@base-ui/utils/getReactElementRef.mjs"
/*!************************************************************!*\
  !*** ./node_modules/@base-ui/utils/getReactElementRef.mjs ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getReactElementRef: () => (/* binding */ getReactElementRef)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _reactVersion_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reactVersion.mjs */ "./node_modules/@base-ui/utils/reactVersion.mjs");



/**
 * Extracts the `ref` from a React element, handling different React versions.
 */
function getReactElementRef(element) {
  if (! /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(element)) {
    return null;
  }
  const reactElement = element;
  const propsWithRef = reactElement.props;
  return ((0,_reactVersion_mjs__WEBPACK_IMPORTED_MODULE_1__.isReactVersionAtLeast)(19) ? propsWithRef?.ref : reactElement.ref) ?? null;
}

/***/ },

/***/ "./node_modules/@base-ui/utils/mergeObjects.mjs"
/*!******************************************************!*\
  !*** ./node_modules/@base-ui/utils/mergeObjects.mjs ***!
  \******************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeObjects: () => (/* binding */ mergeObjects)
/* harmony export */ });
function mergeObjects(a, b) {
  if (a && !b) {
    return a;
  }
  if (!a && b) {
    return b;
  }
  if (a || b) {
    return {
      ...a,
      ...b
    };
  }
  return undefined;
}

/***/ },

/***/ "./node_modules/@base-ui/utils/reactVersion.mjs"
/*!******************************************************!*\
  !*** ./node_modules/@base-ui/utils/reactVersion.mjs ***!
  \******************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isReactVersionAtLeast: () => (/* binding */ isReactVersionAtLeast)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

const majorVersion = parseInt(react__WEBPACK_IMPORTED_MODULE_0__.version, 10);
function isReactVersionAtLeast(reactVersionToCheck) {
  return majorVersion >= reactVersionToCheck;
}

/***/ },

/***/ "./node_modules/@base-ui/utils/useMergedRefs.mjs"
/*!*******************************************************!*\
  !*** ./node_modules/@base-ui/utils/useMergedRefs.mjs ***!
  \*******************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useMergedRefs: () => (/* binding */ useMergedRefs),
/* harmony export */   useMergedRefsN: () => (/* binding */ useMergedRefsN)
/* harmony export */ });
/* harmony import */ var _useRefWithInit_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useRefWithInit.mjs */ "./node_modules/@base-ui/utils/useRefWithInit.mjs");


/**
 * Merges refs into a single memoized callback ref or `null`.
 * This makes sure multiple refs are updated together and have the same value.
 *
 * This function accepts up to four refs. If you need to merge more, or have an unspecified number of refs to merge,
 * use `useMergedRefsN` instead.
 */

function useMergedRefs(a, b, c, d) {
  const forkRef = (0,_useRefWithInit_mjs__WEBPACK_IMPORTED_MODULE_0__.useRefWithInit)(createForkRef).current;
  if (didChange(forkRef, a, b, c, d)) {
    update(forkRef, [a, b, c, d]);
  }
  return forkRef.callback;
}

/**
 * Merges an array of refs into a single memoized callback ref or `null`.
 *
 * If you need to merge a fixed number (up to four) of refs, use `useMergedRefs` instead for better performance.
 */
function useMergedRefsN(refs) {
  const forkRef = (0,_useRefWithInit_mjs__WEBPACK_IMPORTED_MODULE_0__.useRefWithInit)(createForkRef).current;
  if (didChangeN(forkRef, refs)) {
    update(forkRef, refs);
  }
  return forkRef.callback;
}
function createForkRef() {
  return {
    callback: null,
    cleanup: null,
    refs: []
  };
}
function didChange(forkRef, a, b, c, d) {
  // prettier-ignore
  return forkRef.refs[0] !== a || forkRef.refs[1] !== b || forkRef.refs[2] !== c || forkRef.refs[3] !== d;
}
function didChangeN(forkRef, newRefs) {
  return forkRef.refs.length !== newRefs.length || forkRef.refs.some((ref, index) => ref !== newRefs[index]);
}
function update(forkRef, refs) {
  forkRef.refs = refs;
  if (refs.every(ref => ref == null)) {
    forkRef.callback = null;
    return;
  }
  forkRef.callback = instance => {
    if (forkRef.cleanup) {
      forkRef.cleanup();
      forkRef.cleanup = null;
    }
    if (instance != null) {
      const cleanupCallbacks = Array(refs.length).fill(null);
      for (let i = 0; i < refs.length; i += 1) {
        const ref = refs[i];
        if (ref == null) {
          continue;
        }
        switch (typeof ref) {
          case 'function':
            {
              const refCleanup = ref(instance);
              if (typeof refCleanup === 'function') {
                cleanupCallbacks[i] = refCleanup;
              }
              break;
            }
          case 'object':
            {
              ref.current = instance;
              break;
            }
          default:
        }
      }
      forkRef.cleanup = () => {
        for (let i = 0; i < refs.length; i += 1) {
          const ref = refs[i];
          if (ref == null) {
            continue;
          }
          switch (typeof ref) {
            case 'function':
              {
                const cleanupCallback = cleanupCallbacks[i];
                if (typeof cleanupCallback === 'function') {
                  cleanupCallback();
                } else {
                  ref(null);
                }
                break;
              }
            case 'object':
              {
                ref.current = null;
                break;
              }
            default:
          }
        }
      };
    }
  };
}

/***/ },

/***/ "./node_modules/@base-ui/utils/useRefWithInit.mjs"
/*!********************************************************!*\
  !*** ./node_modules/@base-ui/utils/useRefWithInit.mjs ***!
  \********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useRefWithInit: () => (/* binding */ useRefWithInit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
'use client';


const UNINITIALIZED = {};

/**
 * A React.useRef() that is initialized with a function. Note that it accepts an optional
 * initialization argument, so the initialization function doesn't need to be an inline closure.
 *
 * @usage
 *   const ref = useRefWithInit(sortColumns, columns)
 */

function useRefWithInit(init, initArg) {
  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(UNINITIALIZED);
  if (ref.current === UNINITIALIZED) {
    ref.current = init(initArg);
  }
  return ref;
}

/***/ },

/***/ "./node_modules/@base-ui/utils/warn.mjs"
/*!**********************************************!*\
  !*** ./node_modules/@base-ui/utils/warn.mjs ***!
  \**********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   warn: () => (/* binding */ warn)
/* harmony export */ });
let set;
if (true) {
  set = new Set();
}
function warn(...messages) {
  if (true) {
    const messageKey = messages.join(' ');
    if (!set.has(messageKey)) {
      set.add(messageKey);
      console.warn(`Base UI: ${messageKey}`);
    }
  }
}

/***/ },

/***/ "./node_modules/@wordpress/components/build-module/dashicon/index.mjs"
/*!****************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/dashicon/index.mjs ***!
  \****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dashicon_default)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/components/src/dashicon/index.tsx

function Dashicon({
  icon,
  className,
  size = 20,
  style = {},
  ...extraProps
}) {
  const iconClass = ["dashicon", "dashicons", "dashicons-" + icon, className].filter(Boolean).join(" ");
  const sizeStyles = (
    // using `!=` to catch both 20 and "20"
    // eslint-disable-next-line eqeqeq
    20 != size ? {
      fontSize: `${size}px`,
      width: `${size}px`,
      height: `${size}px`
    } : {}
  );
  const styles = {
    ...sizeStyles,
    ...style
  };
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
    className: iconClass,
    style: styles,
    ...extraProps
  });
}
var dashicon_default = Dashicon;

//# sourceMappingURL=index.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/icon/index.mjs"
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/icon/index.mjs ***!
  \************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ icon_default)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _dashicon_index_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dashicon/index.mjs */ "./node_modules/@wordpress/components/build-module/dashicon/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/components/src/icon/index.tsx




function Icon({
  icon = null,
  size = "string" === typeof icon ? 20 : 24,
  ...additionalProps
}) {
  if ("string" === typeof icon) {
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_dashicon_index_mjs__WEBPACK_IMPORTED_MODULE_2__["default"], {
      icon,
      size,
      ...additionalProps
    });
  }
  if ((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(icon) && _dashicon_index_mjs__WEBPACK_IMPORTED_MODULE_2__["default"] === icon.type) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(icon, {
      ...additionalProps
    });
  }
  if ("function" === typeof icon) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(icon, {
      size,
      ...additionalProps
    });
  }
  if (icon && (icon.type === "svg" || icon.type === _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG)) {
    const appliedProps = {
      ...icon.props,
      width: size,
      height: size,
      ...additionalProps
    };
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
      ...appliedProps
    });
  }
  if ((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(icon)) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(icon, {
      // @ts-ignore Just forwarding the size prop along
      size,
      width: size,
      height: size,
      ...additionalProps
    });
  }
  return icon;
}
var icon_default = Icon;

//# sourceMappingURL=index.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/tabs/context.mjs"
/*!**************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/tabs/context.mjs ***!
  \**************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TabsContext: () => (/* binding */ TabsContext),
/* harmony export */   useTabsContext: () => (/* binding */ useTabsContext)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
// packages/components/src/tabs/context.ts

var TabsContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)(void 0);
TabsContext.displayName = "TabsContext";
var useTabsContext = () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(TabsContext);

//# sourceMappingURL=context.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/tabs/index.mjs"
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/tabs/index.mjs ***!
  \************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tabs: () => (/* binding */ Tabs)
/* harmony export */ });
/* harmony import */ var _ariakit_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/react */ "./node_modules/@ariakit/react-components/dist/tab/tab-store.js");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _context_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./context.mjs */ "./node_modules/@wordpress/components/build-module/tabs/context.mjs");
/* harmony import */ var _tab_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tab.mjs */ "./node_modules/@wordpress/components/build-module/tabs/tab.mjs");
/* harmony import */ var _tablist_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tablist.mjs */ "./node_modules/@wordpress/components/build-module/tabs/tablist.mjs");
/* harmony import */ var _tabpanel_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./tabpanel.mjs */ "./node_modules/@wordpress/components/build-module/tabs/tabpanel.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/components/src/tabs/index.tsx









function externalToInternalTabId(externalId, instanceId) {
  return externalId && `${instanceId}-${externalId}`;
}
function internalToExternalTabId(internalId, instanceId) {
  return typeof internalId === "string" ? internalId.replace(`${instanceId}-`, "") : internalId;
}
var Tabs = Object.assign(function Tabs2({
  selectOnMove = true,
  defaultTabId,
  orientation = "horizontal",
  onSelect,
  children,
  selectedTabId,
  activeTabId,
  defaultActiveTabId,
  onActiveTabIdChange
}) {
  const instanceId = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.useInstanceId)(Tabs2, "tabs");
  const store = _ariakit_react__WEBPACK_IMPORTED_MODULE_0__.useTabStore({
    selectOnMove,
    orientation,
    defaultSelectedId: externalToInternalTabId(defaultTabId, instanceId),
    setSelectedId: (newSelectedId) => {
      onSelect?.(internalToExternalTabId(newSelectedId, instanceId));
    },
    selectedId: externalToInternalTabId(selectedTabId, instanceId),
    defaultActiveId: externalToInternalTabId(defaultActiveTabId, instanceId),
    setActiveId: (newActiveId) => {
      onActiveTabIdChange?.(internalToExternalTabId(newActiveId, instanceId));
    },
    activeId: externalToInternalTabId(activeTabId, instanceId),
    rtl: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.isRTL)()
  });
  const contextValue = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
    store,
    instanceId
  }), [store, instanceId]);
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_context_mjs__WEBPACK_IMPORTED_MODULE_4__.TabsContext.Provider, {
    value: contextValue,
    children
  });
}, {
  /**
   * Renders a single tab.
   *
   * The currently active tab receives default styling that can be
   * overridden with CSS targeting `[aria-selected="true"]`.
   */
  Tab: Object.assign(_tab_mjs__WEBPACK_IMPORTED_MODULE_5__.Tab, {
    displayName: "Tabs.Tab"
  }),
  /**
   * A wrapper component for the `Tab` components.
   *
   * It is responsible for rendering the list of tabs.
   */
  TabList: Object.assign(_tablist_mjs__WEBPACK_IMPORTED_MODULE_6__.TabList, {
    displayName: "Tabs.TabList"
  }),
  /**
   * Renders the content to display for a single tab once that tab is selected.
   */
  TabPanel: Object.assign(_tabpanel_mjs__WEBPACK_IMPORTED_MODULE_7__.TabPanel, {
    displayName: "Tabs.TabPanel"
  }),
  Context: Object.assign(_context_mjs__WEBPACK_IMPORTED_MODULE_4__.TabsContext, {
    displayName: "Tabs.Context"
  })
});

//# sourceMappingURL=index.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/tabs/styles.mjs"
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/tabs/styles.mjs ***!
  \*************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StyledTabList: () => (/* binding */ StyledTabList),
/* harmony export */   Tab: () => (/* binding */ Tab2),
/* harmony export */   TabChevron: () => (/* binding */ TabChevron),
/* harmony export */   TabChildren: () => (/* binding */ TabChildren),
/* harmony export */   TabPanel: () => (/* binding */ TabPanel2)
/* harmony export */ });
/* harmony import */ var _emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/styled/base */ "./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.development.esm.js");
/* harmony import */ var _ariakit_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ariakit/react */ "./node_modules/@ariakit/react-components/dist/tab/tab.js");
/* harmony import */ var _ariakit_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ariakit/react */ "./node_modules/@ariakit/react-components/dist/tab/tab-list.js");
/* harmony import */ var _ariakit_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ariakit/react */ "./node_modules/@ariakit/react-components/dist/tab/tab-panel.js");
/* harmony import */ var _utils_index_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/index.mjs */ "./node_modules/@wordpress/components/build-module/utils/font.mjs");
/* harmony import */ var _utils_index_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/index.mjs */ "./node_modules/@wordpress/components/build-module/utils/config-values.mjs");
/* harmony import */ var _utils_index_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/index.mjs */ "./node_modules/@wordpress/components/build-module/utils/colors-values.mjs");
/* harmony import */ var _utils_space_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/space.mjs */ "./node_modules/@wordpress/components/build-module/utils/space.mjs");
/* harmony import */ var _icon_index_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../icon/index.mjs */ "./node_modules/@wordpress/components/build-module/icon/index.mjs");
// packages/components/src/tabs/styles.ts





function _EMOTION_STRINGIFIED_CSS_ERROR__() {
  return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
}
var StyledTabList = /* @__PURE__ */ (0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])(_ariakit_react__WEBPACK_IMPORTED_MODULE_2__.TabList,  false ? 0 : {
  target: "enfox0g4",
  label: "StyledTabList"
})("display:flex;align-items:stretch;overflow-x:auto;&[aria-orientation='vertical']{flex-direction:column;}:where( [aria-orientation='horizontal'] ){width:fit-content;}--direction-factor:1;--direction-start:left;--direction-end:right;--selected-start:var( --selected-left, 0 );&:dir( rtl ){--direction-factor:-1;--direction-start:right;--direction-end:left;--selected-start:var( --selected-right, 0 );}@media not ( prefers-reduced-motion ){&[data-indicator-animated]::before{transition-property:transform,border-radius,border-block;transition-duration:0.2s;transition-timing-function:ease-out;}}position:relative;&::before{content:'';position:absolute;pointer-events:none;transform-origin:var( --direction-start ) top;outline:2px solid transparent;outline-offset:-1px;}--antialiasing-factor:100;&[aria-orientation='horizontal']{--fade-width:64px;--fade-gradient-base:transparent 0%,black var( --fade-width );--fade-gradient-composed:var( --fade-gradient-base ),black 60%,transparent 50%;&.is-overflowing-first{mask-image:linear-gradient(\n				to var( --direction-end ),\n				var( --fade-gradient-base )\n			);}&.is-overflowing-last{mask-image:linear-gradient(\n				to var( --direction-start ),\n				var( --fade-gradient-base )\n			);}&.is-overflowing-first.is-overflowing-last{mask-image:linear-gradient(\n					to right,\n					var( --fade-gradient-composed )\n				),linear-gradient( to left, var( --fade-gradient-composed ) );}&::before{bottom:0;height:0;width:calc( var( --antialiasing-factor ) * 1px );transform:translateX(\n					calc(\n						var( --selected-start ) * var( --direction-factor ) *\n							1px\n					)\n				) scaleX(\n					calc(\n						var( --selected-width, 0 ) /\n							var( --antialiasing-factor )\n					)\n				);border-bottom:var( --wp-admin-border-width-focus ) solid ", _utils_index_mjs__WEBPACK_IMPORTED_MODULE_6__.COLORS.theme.gray[700], ";}}&[aria-orientation='vertical']{&::before{border-radius:", _utils_index_mjs__WEBPACK_IMPORTED_MODULE_5__["default"].radiusSmall, "/calc(\n					", _utils_index_mjs__WEBPACK_IMPORTED_MODULE_5__["default"].radiusSmall, " /\n						(\n							var( --selected-height, 0 ) /\n								var( --antialiasing-factor )\n						)\n				);top:0;left:0;width:100%;height:calc( var( --antialiasing-factor ) * 1px );transform:translateY( calc( var( --selected-top, 0 ) * 1px ) ) scaleY(\n					calc(\n						var( --selected-height, 0 ) /\n							var( --antialiasing-factor )\n					)\n				);background-color:", _utils_index_mjs__WEBPACK_IMPORTED_MODULE_6__.COLORS.theme.gray[100], ";}&[data-select-on-move='true']:has(\n				:is( :focus-visible, [data-focus-visible] )\n			)::before{box-sizing:border-box;border:var( --wp-admin-border-width-focus ) solid ", _utils_index_mjs__WEBPACK_IMPORTED_MODULE_6__.COLORS.theme.accent, ";border-block-width:calc(\n				var( --wp-admin-border-width-focus, 1px ) /\n					(\n						var( --selected-height, 0 ) /\n							var( --antialiasing-factor )\n					)\n			);}}" + ( false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFhc0QiLCJmaWxlIjoic3R5bGVzLnRzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBFeHRlcm5hbCBkZXBlbmRlbmNpZXNcbiAqL1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0ICogYXMgQXJpYWtpdCBmcm9tICdAYXJpYWtpdC9yZWFjdCc7XG5cbi8qKlxuICogSW50ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IENPTE9SUywgQ09ORklHLCBmb250IH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgc3BhY2UgfSBmcm9tICcuLi91dGlscy9zcGFjZSc7XG5pbXBvcnQgSWNvbiBmcm9tICcuLi9pY29uJztcblxuZXhwb3J0IGNvbnN0IFN0eWxlZFRhYkxpc3QgPSBzdHlsZWQoIEFyaWFraXQuVGFiTGlzdCApYFxuXHRkaXNwbGF5OiBmbGV4O1xuXHRhbGlnbi1pdGVtczogc3RyZXRjaDtcblx0b3ZlcmZsb3cteDogYXV0bztcblxuXHQmW2FyaWEtb3JpZW50YXRpb249J3ZlcnRpY2FsJ10ge1xuXHRcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cdH1cblxuXHQ6d2hlcmUoIFthcmlhLW9yaWVudGF0aW9uPSdob3Jpem9udGFsJ10gKSB7XG5cdFx0d2lkdGg6IGZpdC1jb250ZW50O1xuXHR9XG5cblx0LS1kaXJlY3Rpb24tZmFjdG9yOiAxO1xuXHQtLWRpcmVjdGlvbi1zdGFydDogbGVmdDtcblx0LS1kaXJlY3Rpb24tZW5kOiByaWdodDtcblx0LS1zZWxlY3RlZC1zdGFydDogdmFyKCAtLXNlbGVjdGVkLWxlZnQsIDAgKTtcblx0JjpkaXIoIHJ0bCApIHtcblx0XHQtLWRpcmVjdGlvbi1mYWN0b3I6IC0xO1xuXHRcdC0tZGlyZWN0aW9uLXN0YXJ0OiByaWdodDtcblx0XHQtLWRpcmVjdGlvbi1lbmQ6IGxlZnQ7XG5cdFx0LS1zZWxlY3RlZC1zdGFydDogdmFyKCAtLXNlbGVjdGVkLXJpZ2h0LCAwICk7XG5cdH1cblxuXHRAbWVkaWEgbm90ICggcHJlZmVycy1yZWR1Y2VkLW1vdGlvbiApIHtcblx0XHQmW2RhdGEtaW5kaWNhdG9yLWFuaW1hdGVkXTo6YmVmb3JlIHtcblx0XHRcdHRyYW5zaXRpb24tcHJvcGVydHk6IHRyYW5zZm9ybSwgYm9yZGVyLXJhZGl1cywgYm9yZGVyLWJsb2NrO1xuXHRcdFx0dHJhbnNpdGlvbi1kdXJhdGlvbjogMC4ycztcblx0XHRcdHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcblx0XHR9XG5cdH1cblx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHQmOjpiZWZvcmUge1xuXHRcdGNvbnRlbnQ6ICcnO1xuXHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0XHR0cmFuc2Zvcm0tb3JpZ2luOiB2YXIoIC0tZGlyZWN0aW9uLXN0YXJ0ICkgdG9wO1xuXG5cdFx0Ly8gV2luZG93cyBoaWdoIGNvbnRyYXN0IG1vZGUuXG5cdFx0b3V0bGluZTogMnB4IHNvbGlkIHRyYW5zcGFyZW50O1xuXHRcdG91dGxpbmUtb2Zmc2V0OiAtMXB4O1xuXHR9XG5cblx0LyogVXNpbmcgYSBsYXJnZSB2YWx1ZSB0byBhdm9pZCBhbnRpYWxpYXNpbmcgcm91bmRpbmcgaXNzdWVzXG5cdFx0XHR3aGVuIHNjYWxpbmcgaW4gdGhlIHRyYW5zZm9ybSwgc2VlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTIxNTkxMjMgKi9cblx0LS1hbnRpYWxpYXNpbmctZmFjdG9yOiAxMDA7XG5cdCZbYXJpYS1vcmllbnRhdGlvbj0naG9yaXpvbnRhbCddIHtcblx0XHQtLWZhZGUtd2lkdGg6IDY0cHg7XG5cdFx0LS1mYWRlLWdyYWRpZW50LWJhc2U6IHRyYW5zcGFyZW50IDAlLCBibGFjayB2YXIoIC0tZmFkZS13aWR0aCApO1xuXHRcdC0tZmFkZS1ncmFkaWVudC1jb21wb3NlZDogdmFyKCAtLWZhZGUtZ3JhZGllbnQtYmFzZSApLCBibGFjayA2MCUsXG5cdFx0XHR0cmFuc3BhcmVudCA1MCU7XG5cdFx0Ji5pcy1vdmVyZmxvd2luZy1maXJzdCB7XG5cdFx0XHRtYXNrLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoXG5cdFx0XHRcdHRvIHZhciggLS1kaXJlY3Rpb24tZW5kICksXG5cdFx0XHRcdHZhciggLS1mYWRlLWdyYWRpZW50LWJhc2UgKVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0Ji5pcy1vdmVyZmxvd2luZy1sYXN0IHtcblx0XHRcdG1hc2staW1hZ2U6IGxpbmVhci1ncmFkaWVudChcblx0XHRcdFx0dG8gdmFyKCAtLWRpcmVjdGlvbi1zdGFydCApLFxuXHRcdFx0XHR2YXIoIC0tZmFkZS1ncmFkaWVudC1iYXNlIClcblx0XHRcdCk7XG5cdFx0fVxuXHRcdCYuaXMtb3ZlcmZsb3dpbmctZmlyc3QuaXMtb3ZlcmZsb3dpbmctbGFzdCB7XG5cdFx0XHRtYXNrLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoXG5cdFx0XHRcdFx0dG8gcmlnaHQsXG5cdFx0XHRcdFx0dmFyKCAtLWZhZGUtZ3JhZGllbnQtY29tcG9zZWQgKVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRsaW5lYXItZ3JhZGllbnQoIHRvIGxlZnQsIHZhciggLS1mYWRlLWdyYWRpZW50LWNvbXBvc2VkICkgKTtcblx0XHR9XG5cblx0XHQmOjpiZWZvcmUge1xuXHRcdFx0Ym90dG9tOiAwO1xuXHRcdFx0aGVpZ2h0OiAwO1xuXHRcdFx0d2lkdGg6IGNhbGMoIHZhciggLS1hbnRpYWxpYXNpbmctZmFjdG9yICkgKiAxcHggKTtcblx0XHRcdHRyYW5zZm9ybTogdHJhbnNsYXRlWChcblx0XHRcdFx0XHRjYWxjKFxuXHRcdFx0XHRcdFx0dmFyKCAtLXNlbGVjdGVkLXN0YXJ0ICkgKiB2YXIoIC0tZGlyZWN0aW9uLWZhY3RvciApICpcblx0XHRcdFx0XHRcdFx0MXB4XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHRcdHNjYWxlWChcblx0XHRcdFx0XHRjYWxjKFxuXHRcdFx0XHRcdFx0dmFyKCAtLXNlbGVjdGVkLXdpZHRoLCAwICkgL1xuXHRcdFx0XHRcdFx0XHR2YXIoIC0tYW50aWFsaWFzaW5nLWZhY3RvciApXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpO1xuXHRcdFx0Ym9yZGVyLWJvdHRvbTogdmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cyApIHNvbGlkXG5cdFx0XHRcdCR7IENPTE9SUy50aGVtZS5ncmF5WyA3MDAgXSB9O1xuXHRcdH1cblx0fVxuXHQmW2FyaWEtb3JpZW50YXRpb249J3ZlcnRpY2FsJ10ge1xuXHRcdCY6OmJlZm9yZSB7XG5cdFx0XHQvKiBBZGp1c3RpbmcgdGhlIGJvcmRlciByYWRpdXMgdG8gbWF0Y2ggdGhlIHNjYWxpbmcgaW4gdGhlIHkgYXhpcy4gKi9cblx0XHRcdGJvcmRlci1yYWRpdXM6ICR7IENPTkZJRy5yYWRpdXNTbWFsbCB9IC9cblx0XHRcdFx0Y2FsYyhcblx0XHRcdFx0XHQkeyBDT05GSUcucmFkaXVzU21hbGwgfSAvXG5cdFx0XHRcdFx0XHQoXG5cdFx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC1oZWlnaHQsIDAgKSAvXG5cdFx0XHRcdFx0XHRcdFx0dmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHQpO1xuXHRcdFx0dG9wOiAwO1xuXHRcdFx0bGVmdDogMDtcblx0XHRcdHdpZHRoOiAxMDAlO1xuXHRcdFx0aGVpZ2h0OiBjYWxjKCB2YXIoIC0tYW50aWFsaWFzaW5nLWZhY3RvciApICogMXB4ICk7XG5cdFx0XHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoIGNhbGMoIHZhciggLS1zZWxlY3RlZC10b3AsIDAgKSAqIDFweCApIClcblx0XHRcdFx0c2NhbGVZKFxuXHRcdFx0XHRcdGNhbGMoXG5cdFx0XHRcdFx0XHR2YXIoIC0tc2VsZWN0ZWQtaGVpZ2h0LCAwICkgL1xuXHRcdFx0XHRcdFx0XHR2YXIoIC0tYW50aWFsaWFzaW5nLWZhY3RvciApXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpO1xuXHRcdFx0YmFja2dyb3VuZC1jb2xvcjogJHsgQ09MT1JTLnRoZW1lLmdyYXlbIDEwMCBdIH07XG5cdFx0fVxuXHRcdCZbZGF0YS1zZWxlY3Qtb24tbW92ZT0ndHJ1ZSddOmhhcyhcblx0XHRcdFx0OmlzKCA6Zm9jdXMtdmlzaWJsZSwgW2RhdGEtZm9jdXMtdmlzaWJsZV0gKVxuXHRcdFx0KTo6YmVmb3JlIHtcblx0XHRcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cdFx0XHRib3JkZXI6IHZhciggLS13cC1hZG1pbi1ib3JkZXItd2lkdGgtZm9jdXMgKSBzb2xpZFxuXHRcdFx0XHQkeyBDT0xPUlMudGhlbWUuYWNjZW50IH07XG5cdFx0XHQvKiBBZGp1c3RpbmcgdGhlIGJvcmRlciB3aWR0aCB0byBtYXRjaCB0aGUgc2NhbGluZyBpbiB0aGUgeSBheGlzLiAqL1xuXHRcdFx0Ym9yZGVyLWJsb2NrLXdpZHRoOiBjYWxjKFxuXHRcdFx0XHR2YXIoIC0td3AtYWRtaW4tYm9yZGVyLXdpZHRoLWZvY3VzLCAxcHggKSAvXG5cdFx0XHRcdFx0KFxuXHRcdFx0XHRcdFx0dmFyKCAtLXNlbGVjdGVkLWhlaWdodCwgMCApIC9cblx0XHRcdFx0XHRcdFx0dmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKVxuXHRcdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5gO1xuXG5leHBvcnQgY29uc3QgVGFiID0gc3R5bGVkKCBBcmlha2l0LlRhYiApYFxuXHQmIHtcblx0XHQvKiBSZXNldHMgKi9cblx0XHRib3JkZXItcmFkaXVzOiAwO1xuXHRcdGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuXHRcdGJvcmRlcjogbm9uZTtcblx0XHRib3gtc2hhZG93OiBub25lO1xuXG5cdFx0ZmxleDogMSAwIGF1dG87XG5cdFx0d2hpdGUtc3BhY2U6IG5vd3JhcDtcblx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdGxpbmUtaGVpZ2h0OiAxLjI7IC8vIENoYXJhY3RlcnMgaW4gc29tZSBsYW5ndWFnZXMgKGUuZy4gSmFwYW5lc2UpIG1heSBoYXZlIGEgbmF0aXZlIGhpZ2hlciBsaW5lLWhlaWdodC5cblx0XHRmb250LWZhbWlseTogJHsgZm9udCggJ2RlZmF1bHQuZm9udEZhbWlseScgKSB9O1xuXHRcdGZvbnQtd2VpZ2h0OiA0MDA7XG5cdFx0Zm9udC1zaXplOiAkeyBmb250KCAnZGVmYXVsdC5mb250U2l6ZScgKSB9O1xuXHRcdGNvbG9yOiAkeyBDT0xPUlMudGhlbWUuZm9yZWdyb3VuZCB9O1xuXG5cdFx0JlthcmlhLWRpc2FibGVkPSd0cnVlJ10ge1xuXHRcdFx0Y3Vyc29yOiBkZWZhdWx0O1xuXHRcdFx0Y29sb3I6ICR7IENPTE9SUy51aS50ZXh0RGlzYWJsZWQgfTtcblx0XHR9XG5cblx0XHQmOm5vdCggW2FyaWEtZGlzYWJsZWQ9J3RydWUnXSApOmlzKCA6aG92ZXIsIFtkYXRhLWZvY3VzLXZpc2libGVdICkge1xuXHRcdFx0Y29sb3I6ICR7IENPTE9SUy50aGVtZS5mb3JlZ3JvdW5kIH07XG5cdFx0fVxuXG5cdFx0Jjpmb2N1czpub3QoIDpkaXNhYmxlZCApIHtcblx0XHRcdGJveC1zaGFkb3c6IG5vbmU7XG5cdFx0XHRvdXRsaW5lOiBub25lO1xuXHRcdH1cblxuXHRcdC8vIEZvY3VzIGluZGljYXRvci5cblx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdFx0Jjo6YWZ0ZXIge1xuXHRcdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdFx0cG9pbnRlci1ldmVudHM6IG5vbmU7XG5cblx0XHRcdC8vIERyYXcgdGhlIGluZGljYXRvci5cblx0XHRcdC8vIE91dGxpbmUgd29ya3MgZm9yIFdpbmRvd3MgaGlnaCBjb250cmFzdCBtb2RlIGFzIHdlbGwuXG5cdFx0XHRvdXRsaW5lOiB2YXIoIC0td3AtYWRtaW4tYm9yZGVyLXdpZHRoLWZvY3VzICkgc29saWRcblx0XHRcdFx0JHsgQ09MT1JTLnRoZW1lLmFjY2VudCB9O1xuXHRcdFx0Ym9yZGVyLXJhZGl1czogJHsgQ09ORklHLnJhZGl1c1NtYWxsIH07XG5cblx0XHRcdC8vIEFuaW1hdGlvblxuXHRcdFx0b3BhY2l0eTogMDtcblxuXHRcdFx0QG1lZGlhIG5vdCAoIHByZWZlcnMtcmVkdWNlZC1tb3Rpb24gKSB7XG5cdFx0XHRcdHRyYW5zaXRpb246IG9wYWNpdHkgMC4xcyBsaW5lYXI7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0JltkYXRhLWZvY3VzLXZpc2libGVdOjphZnRlciB7XG5cdFx0XHRvcGFjaXR5OiAxO1xuXHRcdH1cblx0fVxuXG5cdFthcmlhLW9yaWVudGF0aW9uPSdob3Jpem9udGFsJ10gJiB7XG5cdFx0cGFkZGluZy1pbmxpbmU6ICR7IHNwYWNlKCA0ICkgfTtcblx0XHRoZWlnaHQ6ICR7IHNwYWNlKCAxMiApIH07XG5cdFx0c2Nyb2xsLW1hcmdpbjogMjRweDtcblxuXHRcdCY6OmFmdGVyIHtcblx0XHRcdGNvbnRlbnQ6ICcnO1xuXHRcdFx0aW5zZXQ6ICR7IHNwYWNlKCAzICkgfTtcblx0XHR9XG5cdH1cblxuXHRbYXJpYS1vcmllbnRhdGlvbj0ndmVydGljYWwnXSAmIHtcblx0XHRwYWRkaW5nOiAkeyBzcGFjZSggMiApIH0gJHsgc3BhY2UoIDMgKSB9O1xuXHRcdG1pbi1oZWlnaHQ6ICR7IHNwYWNlKCAxMCApIH07XG5cblx0XHQmW2FyaWEtc2VsZWN0ZWQ9J3RydWUnXSB7XG5cdFx0XHRmaWxsOiBjdXJyZW50Q29sb3I7XG5cdFx0fVxuXHR9XG5cdFthcmlhLW9yaWVudGF0aW9uPSd2ZXJ0aWNhbCddW2RhdGEtc2VsZWN0LW9uLW1vdmU9J2ZhbHNlJ10gJjo6YWZ0ZXIge1xuXHRcdGNvbnRlbnQ6ICcnO1xuXHRcdGluc2V0OiB2YXIoIC0td3AtYWRtaW4tYm9yZGVyLXdpZHRoLWZvY3VzICk7XG5cdH1cbmA7XG5cbmV4cG9ydCBjb25zdCBUYWJDaGlsZHJlbiA9IHN0eWxlZC5zcGFuYFxuXHRmbGV4LWdyb3c6IDE7XG5cblx0ZGlzcGxheTogZmxleDtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblxuXHRbYXJpYS1vcmllbnRhdGlvbj0naG9yaXpvbnRhbCddICYge1xuXHRcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHR9XG5cdFthcmlhLW9yaWVudGF0aW9uPSd2ZXJ0aWNhbCddICYge1xuXHRcdGp1c3RpZnktY29udGVudDogc3RhcnQ7XG5cdH1cbmA7XG5cbmV4cG9ydCBjb25zdCBUYWJDaGV2cm9uID0gc3R5bGVkKCBJY29uIClgXG5cdGZsZXgtc2hyaW5rOiAwO1xuXHRtYXJnaW4taW5saW5lLWVuZDogJHsgc3BhY2UoIC0xICkgfTtcblx0W2FyaWEtb3JpZW50YXRpb249J2hvcml6b250YWwnXSAmIHtcblx0XHRkaXNwbGF5OiBub25lO1xuXHR9XG5cdG9wYWNpdHk6IDA7XG5cdFtyb2xlPSd0YWInXTppcyggW2FyaWEtc2VsZWN0ZWQ9J3RydWUnXSwgW2RhdGEtZm9jdXMtdmlzaWJsZV0sIDpob3ZlciApICYge1xuXHRcdG9wYWNpdHk6IDE7XG5cdH1cblx0Ly8gVGhlIGNoZXZyb24gaXMgdHJhbnNpdGlvbmVkIGludG8gZXhpc3RlbmNlIHdoZW4gc2VsZWN0T25Nb3ZlIGlzIGVuYWJsZWQsXG5cdC8vIGJlY2F1c2Ugb3RoZXJ3aXNlIGl0IGxvb2tzIGphcnJpbmcsIGFzIGl0IHNob3dzIHVwIG91dHNpZGUgb2YgdGhlIGZvY3VzXG5cdC8vIGluZGljYXRvciB0aGF0J3MgYmVpbmcgYW5pbWF0ZWQgYXQgdGhlIHNhbWUgdGltZS5cblx0QG1lZGlhIG5vdCAoIHByZWZlcnMtcmVkdWNlZC1tb3Rpb24gKSB7XG5cdFx0W2RhdGEtc2VsZWN0LW9uLW1vdmU9J3RydWUnXVxuXHRcdFx0W3JvbGU9J3RhYiddOmlzKCBbYXJpYS1zZWxlY3RlZD0ndHJ1ZSddLCAgKVxuXHRcdFx0JiB7XG5cdFx0XHR0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMTVzIDAuMTVzIGxpbmVhcjtcblx0XHR9XG5cdH1cblx0JjpkaXIoIHJ0bCApIHtcblx0XHRyb3RhdGU6IDE4MGRlZztcblx0fVxuYDtcblxuZXhwb3J0IGNvbnN0IFRhYlBhbmVsID0gc3R5bGVkKCBBcmlha2l0LlRhYlBhbmVsIClgXG5cdCY6Zm9jdXMge1xuXHRcdGJveC1zaGFkb3c6IG5vbmU7XG5cdFx0b3V0bGluZTogbm9uZTtcblx0fVxuXG5cdCZbZGF0YS1mb2N1cy12aXNpYmxlXSB7XG5cdFx0Ym94LXNoYWRvdzogMCAwIDAgdmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cyApXG5cdFx0XHQkeyBDT0xPUlMudGhlbWUuYWNjZW50IH07XG5cdFx0Ly8gV2luZG93cyBoaWdoIGNvbnRyYXN0IG1vZGUuXG5cdFx0b3V0bGluZTogMnB4IHNvbGlkIHRyYW5zcGFyZW50O1xuXHRcdG91dGxpbmUtb2Zmc2V0OiAwO1xuXHR9XG5gO1xuIl19 */"));
var Tab2 = /* @__PURE__ */ (0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])(_ariakit_react__WEBPACK_IMPORTED_MODULE_1__.Tab,  false ? 0 : {
  target: "enfox0g3",
  label: "Tab"
})("&{border-radius:0;background:transparent;border:none;box-shadow:none;flex:1 0 auto;white-space:nowrap;display:flex;align-items:center;cursor:pointer;line-height:1.2;font-family:", (0,_utils_index_mjs__WEBPACK_IMPORTED_MODULE_4__.font)("default.fontFamily"), ";font-weight:400;font-size:", (0,_utils_index_mjs__WEBPACK_IMPORTED_MODULE_4__.font)("default.fontSize"), ";color:", _utils_index_mjs__WEBPACK_IMPORTED_MODULE_6__.COLORS.theme.foreground, ";position:relative;&[aria-disabled='true']{cursor:default;color:", _utils_index_mjs__WEBPACK_IMPORTED_MODULE_6__.COLORS.ui.textDisabled, ";}&:not( [aria-disabled='true'] ):is( :hover, [data-focus-visible] ){color:", _utils_index_mjs__WEBPACK_IMPORTED_MODULE_6__.COLORS.theme.foreground, ";}&:focus:not( :disabled ){box-shadow:none;outline:none;}&::after{position:absolute;pointer-events:none;outline:var( --wp-admin-border-width-focus ) solid ", _utils_index_mjs__WEBPACK_IMPORTED_MODULE_6__.COLORS.theme.accent, ";border-radius:", _utils_index_mjs__WEBPACK_IMPORTED_MODULE_5__["default"].radiusSmall, ";opacity:0;@media not ( prefers-reduced-motion ){transition:opacity 0.1s linear;}}&[data-focus-visible]::after{opacity:1;}}[aria-orientation='horizontal'] &{padding-inline:", (0,_utils_space_mjs__WEBPACK_IMPORTED_MODULE_7__.space)(4), ";height:", (0,_utils_space_mjs__WEBPACK_IMPORTED_MODULE_7__.space)(12), ";scroll-margin:24px;&::after{content:'';inset:", (0,_utils_space_mjs__WEBPACK_IMPORTED_MODULE_7__.space)(3), ";}}[aria-orientation='vertical'] &{padding:", (0,_utils_space_mjs__WEBPACK_IMPORTED_MODULE_7__.space)(2), " ", (0,_utils_space_mjs__WEBPACK_IMPORTED_MODULE_7__.space)(3), ";min-height:", (0,_utils_space_mjs__WEBPACK_IMPORTED_MODULE_7__.space)(10), ";&[aria-selected='true']{fill:currentColor;}}[aria-orientation='vertical'][data-select-on-move='false'] &::after{content:'';inset:var( --wp-admin-border-width-focus );}" + ( false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrSndDIiwiZmlsZSI6InN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRXh0ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcbmltcG9ydCAqIGFzIEFyaWFraXQgZnJvbSAnQGFyaWFraXQvcmVhY3QnO1xuXG4vKipcbiAqIEludGVybmFsIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgeyBDT0xPUlMsIENPTkZJRywgZm9udCB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IHNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvc3BhY2UnO1xuaW1wb3J0IEljb24gZnJvbSAnLi4vaWNvbic7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRUYWJMaXN0ID0gc3R5bGVkKCBBcmlha2l0LlRhYkxpc3QgKWBcblx0ZGlzcGxheTogZmxleDtcblx0YWxpZ24taXRlbXM6IHN0cmV0Y2g7XG5cdG92ZXJmbG93LXg6IGF1dG87XG5cblx0JlthcmlhLW9yaWVudGF0aW9uPSd2ZXJ0aWNhbCddIHtcblx0XHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHR9XG5cblx0OndoZXJlKCBbYXJpYS1vcmllbnRhdGlvbj0naG9yaXpvbnRhbCddICkge1xuXHRcdHdpZHRoOiBmaXQtY29udGVudDtcblx0fVxuXG5cdC0tZGlyZWN0aW9uLWZhY3RvcjogMTtcblx0LS1kaXJlY3Rpb24tc3RhcnQ6IGxlZnQ7XG5cdC0tZGlyZWN0aW9uLWVuZDogcmlnaHQ7XG5cdC0tc2VsZWN0ZWQtc3RhcnQ6IHZhciggLS1zZWxlY3RlZC1sZWZ0LCAwICk7XG5cdCY6ZGlyKCBydGwgKSB7XG5cdFx0LS1kaXJlY3Rpb24tZmFjdG9yOiAtMTtcblx0XHQtLWRpcmVjdGlvbi1zdGFydDogcmlnaHQ7XG5cdFx0LS1kaXJlY3Rpb24tZW5kOiBsZWZ0O1xuXHRcdC0tc2VsZWN0ZWQtc3RhcnQ6IHZhciggLS1zZWxlY3RlZC1yaWdodCwgMCApO1xuXHR9XG5cblx0QG1lZGlhIG5vdCAoIHByZWZlcnMtcmVkdWNlZC1tb3Rpb24gKSB7XG5cdFx0JltkYXRhLWluZGljYXRvci1hbmltYXRlZF06OmJlZm9yZSB7XG5cdFx0XHR0cmFuc2l0aW9uLXByb3BlcnR5OiB0cmFuc2Zvcm0sIGJvcmRlci1yYWRpdXMsIGJvcmRlci1ibG9jaztcblx0XHRcdHRyYW5zaXRpb24tZHVyYXRpb246IDAuMnM7XG5cdFx0XHR0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XG5cdFx0fVxuXHR9XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0Jjo6YmVmb3JlIHtcblx0XHRjb250ZW50OiAnJztcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0cG9pbnRlci1ldmVudHM6IG5vbmU7XG5cdFx0dHJhbnNmb3JtLW9yaWdpbjogdmFyKCAtLWRpcmVjdGlvbi1zdGFydCApIHRvcDtcblxuXHRcdC8vIFdpbmRvd3MgaGlnaCBjb250cmFzdCBtb2RlLlxuXHRcdG91dGxpbmU6IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcblx0XHRvdXRsaW5lLW9mZnNldDogLTFweDtcblx0fVxuXG5cdC8qIFVzaW5nIGEgbGFyZ2UgdmFsdWUgdG8gYXZvaWQgYW50aWFsaWFzaW5nIHJvdW5kaW5nIGlzc3Vlc1xuXHRcdFx0d2hlbiBzY2FsaW5nIGluIHRoZSB0cmFuc2Zvcm0sIHNlZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzUyMTU5MTIzICovXG5cdC0tYW50aWFsaWFzaW5nLWZhY3RvcjogMTAwO1xuXHQmW2FyaWEtb3JpZW50YXRpb249J2hvcml6b250YWwnXSB7XG5cdFx0LS1mYWRlLXdpZHRoOiA2NHB4O1xuXHRcdC0tZmFkZS1ncmFkaWVudC1iYXNlOiB0cmFuc3BhcmVudCAwJSwgYmxhY2sgdmFyKCAtLWZhZGUtd2lkdGggKTtcblx0XHQtLWZhZGUtZ3JhZGllbnQtY29tcG9zZWQ6IHZhciggLS1mYWRlLWdyYWRpZW50LWJhc2UgKSwgYmxhY2sgNjAlLFxuXHRcdFx0dHJhbnNwYXJlbnQgNTAlO1xuXHRcdCYuaXMtb3ZlcmZsb3dpbmctZmlyc3Qge1xuXHRcdFx0bWFzay1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxuXHRcdFx0XHR0byB2YXIoIC0tZGlyZWN0aW9uLWVuZCApLFxuXHRcdFx0XHR2YXIoIC0tZmFkZS1ncmFkaWVudC1iYXNlIClcblx0XHRcdCk7XG5cdFx0fVxuXHRcdCYuaXMtb3ZlcmZsb3dpbmctbGFzdCB7XG5cdFx0XHRtYXNrLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoXG5cdFx0XHRcdHRvIHZhciggLS1kaXJlY3Rpb24tc3RhcnQgKSxcblx0XHRcdFx0dmFyKCAtLWZhZGUtZ3JhZGllbnQtYmFzZSApXG5cdFx0XHQpO1xuXHRcdH1cblx0XHQmLmlzLW92ZXJmbG93aW5nLWZpcnN0LmlzLW92ZXJmbG93aW5nLWxhc3Qge1xuXHRcdFx0bWFzay1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxuXHRcdFx0XHRcdHRvIHJpZ2h0LFxuXHRcdFx0XHRcdHZhciggLS1mYWRlLWdyYWRpZW50LWNvbXBvc2VkIClcblx0XHRcdFx0KSxcblx0XHRcdFx0bGluZWFyLWdyYWRpZW50KCB0byBsZWZ0LCB2YXIoIC0tZmFkZS1ncmFkaWVudC1jb21wb3NlZCApICk7XG5cdFx0fVxuXG5cdFx0Jjo6YmVmb3JlIHtcblx0XHRcdGJvdHRvbTogMDtcblx0XHRcdGhlaWdodDogMDtcblx0XHRcdHdpZHRoOiBjYWxjKCB2YXIoIC0tYW50aWFsaWFzaW5nLWZhY3RvciApICogMXB4ICk7XG5cdFx0XHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoXG5cdFx0XHRcdFx0Y2FsYyhcblx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC1zdGFydCApICogdmFyKCAtLWRpcmVjdGlvbi1mYWN0b3IgKSAqXG5cdFx0XHRcdFx0XHRcdDFweFxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0XHRzY2FsZVgoXG5cdFx0XHRcdFx0Y2FsYyhcblx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC13aWR0aCwgMCApIC9cblx0XHRcdFx0XHRcdFx0dmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdGJvcmRlci1ib3R0b206IHZhciggLS13cC1hZG1pbi1ib3JkZXItd2lkdGgtZm9jdXMgKSBzb2xpZFxuXHRcdFx0XHQkeyBDT0xPUlMudGhlbWUuZ3JheVsgNzAwIF0gfTtcblx0XHR9XG5cdH1cblx0JlthcmlhLW9yaWVudGF0aW9uPSd2ZXJ0aWNhbCddIHtcblx0XHQmOjpiZWZvcmUge1xuXHRcdFx0LyogQWRqdXN0aW5nIHRoZSBib3JkZXIgcmFkaXVzIHRvIG1hdGNoIHRoZSBzY2FsaW5nIGluIHRoZSB5IGF4aXMuICovXG5cdFx0XHRib3JkZXItcmFkaXVzOiAkeyBDT05GSUcucmFkaXVzU21hbGwgfSAvXG5cdFx0XHRcdGNhbGMoXG5cdFx0XHRcdFx0JHsgQ09ORklHLnJhZGl1c1NtYWxsIH0gL1xuXHRcdFx0XHRcdFx0KFxuXHRcdFx0XHRcdFx0XHR2YXIoIC0tc2VsZWN0ZWQtaGVpZ2h0LCAwICkgL1xuXHRcdFx0XHRcdFx0XHRcdHZhciggLS1hbnRpYWxpYXNpbmctZmFjdG9yIClcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdHRvcDogMDtcblx0XHRcdGxlZnQ6IDA7XG5cdFx0XHR3aWR0aDogMTAwJTtcblx0XHRcdGhlaWdodDogY2FsYyggdmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKSAqIDFweCApO1xuXHRcdFx0dHJhbnNmb3JtOiB0cmFuc2xhdGVZKCBjYWxjKCB2YXIoIC0tc2VsZWN0ZWQtdG9wLCAwICkgKiAxcHggKSApXG5cdFx0XHRcdHNjYWxlWShcblx0XHRcdFx0XHRjYWxjKFxuXHRcdFx0XHRcdFx0dmFyKCAtLXNlbGVjdGVkLWhlaWdodCwgMCApIC9cblx0XHRcdFx0XHRcdFx0dmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdGJhY2tncm91bmQtY29sb3I6ICR7IENPTE9SUy50aGVtZS5ncmF5WyAxMDAgXSB9O1xuXHRcdH1cblx0XHQmW2RhdGEtc2VsZWN0LW9uLW1vdmU9J3RydWUnXTpoYXMoXG5cdFx0XHRcdDppcyggOmZvY3VzLXZpc2libGUsIFtkYXRhLWZvY3VzLXZpc2libGVdIClcblx0XHRcdCk6OmJlZm9yZSB7XG5cdFx0XHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXHRcdFx0Ym9yZGVyOiB2YXIoIC0td3AtYWRtaW4tYm9yZGVyLXdpZHRoLWZvY3VzICkgc29saWRcblx0XHRcdFx0JHsgQ09MT1JTLnRoZW1lLmFjY2VudCB9O1xuXHRcdFx0LyogQWRqdXN0aW5nIHRoZSBib3JkZXIgd2lkdGggdG8gbWF0Y2ggdGhlIHNjYWxpbmcgaW4gdGhlIHkgYXhpcy4gKi9cblx0XHRcdGJvcmRlci1ibG9jay13aWR0aDogY2FsYyhcblx0XHRcdFx0dmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cywgMXB4ICkgL1xuXHRcdFx0XHRcdChcblx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC1oZWlnaHQsIDAgKSAvXG5cdFx0XHRcdFx0XHRcdHZhciggLS1hbnRpYWxpYXNpbmctZmFjdG9yIClcblx0XHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuYDtcblxuZXhwb3J0IGNvbnN0IFRhYiA9IHN0eWxlZCggQXJpYWtpdC5UYWIgKWBcblx0JiB7XG5cdFx0LyogUmVzZXRzICovXG5cdFx0Ym9yZGVyLXJhZGl1czogMDtcblx0XHRiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcblx0XHRib3JkZXI6IG5vbmU7XG5cdFx0Ym94LXNoYWRvdzogbm9uZTtcblxuXHRcdGZsZXg6IDEgMCBhdXRvO1xuXHRcdHdoaXRlLXNwYWNlOiBub3dyYXA7XG5cdFx0ZGlzcGxheTogZmxleDtcblx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRsaW5lLWhlaWdodDogMS4yOyAvLyBDaGFyYWN0ZXJzIGluIHNvbWUgbGFuZ3VhZ2VzIChlLmcuIEphcGFuZXNlKSBtYXkgaGF2ZSBhIG5hdGl2ZSBoaWdoZXIgbGluZS1oZWlnaHQuXG5cdFx0Zm9udC1mYW1pbHk6ICR7IGZvbnQoICdkZWZhdWx0LmZvbnRGYW1pbHknICkgfTtcblx0XHRmb250LXdlaWdodDogNDAwO1xuXHRcdGZvbnQtc2l6ZTogJHsgZm9udCggJ2RlZmF1bHQuZm9udFNpemUnICkgfTtcblx0XHRjb2xvcjogJHsgQ09MT1JTLnRoZW1lLmZvcmVncm91bmQgfTtcblxuXHRcdCZbYXJpYS1kaXNhYmxlZD0ndHJ1ZSddIHtcblx0XHRcdGN1cnNvcjogZGVmYXVsdDtcblx0XHRcdGNvbG9yOiAkeyBDT0xPUlMudWkudGV4dERpc2FibGVkIH07XG5cdFx0fVxuXG5cdFx0Jjpub3QoIFthcmlhLWRpc2FibGVkPSd0cnVlJ10gKTppcyggOmhvdmVyLCBbZGF0YS1mb2N1cy12aXNpYmxlXSApIHtcblx0XHRcdGNvbG9yOiAkeyBDT0xPUlMudGhlbWUuZm9yZWdyb3VuZCB9O1xuXHRcdH1cblxuXHRcdCY6Zm9jdXM6bm90KCA6ZGlzYWJsZWQgKSB7XG5cdFx0XHRib3gtc2hhZG93OiBub25lO1xuXHRcdFx0b3V0bGluZTogbm9uZTtcblx0XHR9XG5cblx0XHQvLyBGb2N1cyBpbmRpY2F0b3IuXG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdCY6OmFmdGVyIHtcblx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHRcdHBvaW50ZXItZXZlbnRzOiBub25lO1xuXG5cdFx0XHQvLyBEcmF3IHRoZSBpbmRpY2F0b3IuXG5cdFx0XHQvLyBPdXRsaW5lIHdvcmtzIGZvciBXaW5kb3dzIGhpZ2ggY29udHJhc3QgbW9kZSBhcyB3ZWxsLlxuXHRcdFx0b3V0bGluZTogdmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cyApIHNvbGlkXG5cdFx0XHRcdCR7IENPTE9SUy50aGVtZS5hY2NlbnQgfTtcblx0XHRcdGJvcmRlci1yYWRpdXM6ICR7IENPTkZJRy5yYWRpdXNTbWFsbCB9O1xuXG5cdFx0XHQvLyBBbmltYXRpb25cblx0XHRcdG9wYWNpdHk6IDA7XG5cblx0XHRcdEBtZWRpYSBub3QgKCBwcmVmZXJzLXJlZHVjZWQtbW90aW9uICkge1xuXHRcdFx0XHR0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMXMgbGluZWFyO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCZbZGF0YS1mb2N1cy12aXNpYmxlXTo6YWZ0ZXIge1xuXHRcdFx0b3BhY2l0eTogMTtcblx0XHR9XG5cdH1cblxuXHRbYXJpYS1vcmllbnRhdGlvbj0naG9yaXpvbnRhbCddICYge1xuXHRcdHBhZGRpbmctaW5saW5lOiAkeyBzcGFjZSggNCApIH07XG5cdFx0aGVpZ2h0OiAkeyBzcGFjZSggMTIgKSB9O1xuXHRcdHNjcm9sbC1tYXJnaW46IDI0cHg7XG5cblx0XHQmOjphZnRlciB7XG5cdFx0XHRjb250ZW50OiAnJztcblx0XHRcdGluc2V0OiAkeyBzcGFjZSggMyApIH07XG5cdFx0fVxuXHR9XG5cblx0W2FyaWEtb3JpZW50YXRpb249J3ZlcnRpY2FsJ10gJiB7XG5cdFx0cGFkZGluZzogJHsgc3BhY2UoIDIgKSB9ICR7IHNwYWNlKCAzICkgfTtcblx0XHRtaW4taGVpZ2h0OiAkeyBzcGFjZSggMTAgKSB9O1xuXG5cdFx0JlthcmlhLXNlbGVjdGVkPSd0cnVlJ10ge1xuXHRcdFx0ZmlsbDogY3VycmVudENvbG9yO1xuXHRcdH1cblx0fVxuXHRbYXJpYS1vcmllbnRhdGlvbj0ndmVydGljYWwnXVtkYXRhLXNlbGVjdC1vbi1tb3ZlPSdmYWxzZSddICY6OmFmdGVyIHtcblx0XHRjb250ZW50OiAnJztcblx0XHRpbnNldDogdmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cyApO1xuXHR9XG5gO1xuXG5leHBvcnQgY29uc3QgVGFiQ2hpbGRyZW4gPSBzdHlsZWQuc3BhbmBcblx0ZmxleC1ncm93OiAxO1xuXG5cdGRpc3BsYXk6IGZsZXg7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cblx0W2FyaWEtb3JpZW50YXRpb249J2hvcml6b250YWwnXSAmIHtcblx0XHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0fVxuXHRbYXJpYS1vcmllbnRhdGlvbj0ndmVydGljYWwnXSAmIHtcblx0XHRqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xuXHR9XG5gO1xuXG5leHBvcnQgY29uc3QgVGFiQ2hldnJvbiA9IHN0eWxlZCggSWNvbiApYFxuXHRmbGV4LXNocmluazogMDtcblx0bWFyZ2luLWlubGluZS1lbmQ6ICR7IHNwYWNlKCAtMSApIH07XG5cdFthcmlhLW9yaWVudGF0aW9uPSdob3Jpem9udGFsJ10gJiB7XG5cdFx0ZGlzcGxheTogbm9uZTtcblx0fVxuXHRvcGFjaXR5OiAwO1xuXHRbcm9sZT0ndGFiJ106aXMoIFthcmlhLXNlbGVjdGVkPSd0cnVlJ10sIFtkYXRhLWZvY3VzLXZpc2libGVdLCA6aG92ZXIgKSAmIHtcblx0XHRvcGFjaXR5OiAxO1xuXHR9XG5cdC8vIFRoZSBjaGV2cm9uIGlzIHRyYW5zaXRpb25lZCBpbnRvIGV4aXN0ZW5jZSB3aGVuIHNlbGVjdE9uTW92ZSBpcyBlbmFibGVkLFxuXHQvLyBiZWNhdXNlIG90aGVyd2lzZSBpdCBsb29rcyBqYXJyaW5nLCBhcyBpdCBzaG93cyB1cCBvdXRzaWRlIG9mIHRoZSBmb2N1c1xuXHQvLyBpbmRpY2F0b3IgdGhhdCdzIGJlaW5nIGFuaW1hdGVkIGF0IHRoZSBzYW1lIHRpbWUuXG5cdEBtZWRpYSBub3QgKCBwcmVmZXJzLXJlZHVjZWQtbW90aW9uICkge1xuXHRcdFtkYXRhLXNlbGVjdC1vbi1tb3ZlPSd0cnVlJ11cblx0XHRcdFtyb2xlPSd0YWInXTppcyggW2FyaWEtc2VsZWN0ZWQ9J3RydWUnXSwgIClcblx0XHRcdCYge1xuXHRcdFx0dHJhbnNpdGlvbjogb3BhY2l0eSAwLjE1cyAwLjE1cyBsaW5lYXI7XG5cdFx0fVxuXHR9XG5cdCY6ZGlyKCBydGwgKSB7XG5cdFx0cm90YXRlOiAxODBkZWc7XG5cdH1cbmA7XG5cbmV4cG9ydCBjb25zdCBUYWJQYW5lbCA9IHN0eWxlZCggQXJpYWtpdC5UYWJQYW5lbCApYFxuXHQmOmZvY3VzIHtcblx0XHRib3gtc2hhZG93OiBub25lO1xuXHRcdG91dGxpbmU6IG5vbmU7XG5cdH1cblxuXHQmW2RhdGEtZm9jdXMtdmlzaWJsZV0ge1xuXHRcdGJveC1zaGFkb3c6IDAgMCAwIHZhciggLS13cC1hZG1pbi1ib3JkZXItd2lkdGgtZm9jdXMgKVxuXHRcdFx0JHsgQ09MT1JTLnRoZW1lLmFjY2VudCB9O1xuXHRcdC8vIFdpbmRvd3MgaGlnaCBjb250cmFzdCBtb2RlLlxuXHRcdG91dGxpbmU6IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcblx0XHRvdXRsaW5lLW9mZnNldDogMDtcblx0fVxuYDtcbiJdfQ== */"));
var TabChildren = /* @__PURE__ */ (0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])("span",  false ? 0 : {
  target: "enfox0g2",
  label: "TabChildren"
})( false ? 0 : {
  name: "9at4z3",
  styles: "flex-grow:1;display:flex;align-items:center;[aria-orientation='horizontal'] &{justify-content:center;}[aria-orientation='vertical'] &{justify-content:start;}/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFxT3NDIiwiZmlsZSI6InN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRXh0ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcbmltcG9ydCAqIGFzIEFyaWFraXQgZnJvbSAnQGFyaWFraXQvcmVhY3QnO1xuXG4vKipcbiAqIEludGVybmFsIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgeyBDT0xPUlMsIENPTkZJRywgZm9udCB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IHNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvc3BhY2UnO1xuaW1wb3J0IEljb24gZnJvbSAnLi4vaWNvbic7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRUYWJMaXN0ID0gc3R5bGVkKCBBcmlha2l0LlRhYkxpc3QgKWBcblx0ZGlzcGxheTogZmxleDtcblx0YWxpZ24taXRlbXM6IHN0cmV0Y2g7XG5cdG92ZXJmbG93LXg6IGF1dG87XG5cblx0JlthcmlhLW9yaWVudGF0aW9uPSd2ZXJ0aWNhbCddIHtcblx0XHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHR9XG5cblx0OndoZXJlKCBbYXJpYS1vcmllbnRhdGlvbj0naG9yaXpvbnRhbCddICkge1xuXHRcdHdpZHRoOiBmaXQtY29udGVudDtcblx0fVxuXG5cdC0tZGlyZWN0aW9uLWZhY3RvcjogMTtcblx0LS1kaXJlY3Rpb24tc3RhcnQ6IGxlZnQ7XG5cdC0tZGlyZWN0aW9uLWVuZDogcmlnaHQ7XG5cdC0tc2VsZWN0ZWQtc3RhcnQ6IHZhciggLS1zZWxlY3RlZC1sZWZ0LCAwICk7XG5cdCY6ZGlyKCBydGwgKSB7XG5cdFx0LS1kaXJlY3Rpb24tZmFjdG9yOiAtMTtcblx0XHQtLWRpcmVjdGlvbi1zdGFydDogcmlnaHQ7XG5cdFx0LS1kaXJlY3Rpb24tZW5kOiBsZWZ0O1xuXHRcdC0tc2VsZWN0ZWQtc3RhcnQ6IHZhciggLS1zZWxlY3RlZC1yaWdodCwgMCApO1xuXHR9XG5cblx0QG1lZGlhIG5vdCAoIHByZWZlcnMtcmVkdWNlZC1tb3Rpb24gKSB7XG5cdFx0JltkYXRhLWluZGljYXRvci1hbmltYXRlZF06OmJlZm9yZSB7XG5cdFx0XHR0cmFuc2l0aW9uLXByb3BlcnR5OiB0cmFuc2Zvcm0sIGJvcmRlci1yYWRpdXMsIGJvcmRlci1ibG9jaztcblx0XHRcdHRyYW5zaXRpb24tZHVyYXRpb246IDAuMnM7XG5cdFx0XHR0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XG5cdFx0fVxuXHR9XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0Jjo6YmVmb3JlIHtcblx0XHRjb250ZW50OiAnJztcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0cG9pbnRlci1ldmVudHM6IG5vbmU7XG5cdFx0dHJhbnNmb3JtLW9yaWdpbjogdmFyKCAtLWRpcmVjdGlvbi1zdGFydCApIHRvcDtcblxuXHRcdC8vIFdpbmRvd3MgaGlnaCBjb250cmFzdCBtb2RlLlxuXHRcdG91dGxpbmU6IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcblx0XHRvdXRsaW5lLW9mZnNldDogLTFweDtcblx0fVxuXG5cdC8qIFVzaW5nIGEgbGFyZ2UgdmFsdWUgdG8gYXZvaWQgYW50aWFsaWFzaW5nIHJvdW5kaW5nIGlzc3Vlc1xuXHRcdFx0d2hlbiBzY2FsaW5nIGluIHRoZSB0cmFuc2Zvcm0sIHNlZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzUyMTU5MTIzICovXG5cdC0tYW50aWFsaWFzaW5nLWZhY3RvcjogMTAwO1xuXHQmW2FyaWEtb3JpZW50YXRpb249J2hvcml6b250YWwnXSB7XG5cdFx0LS1mYWRlLXdpZHRoOiA2NHB4O1xuXHRcdC0tZmFkZS1ncmFkaWVudC1iYXNlOiB0cmFuc3BhcmVudCAwJSwgYmxhY2sgdmFyKCAtLWZhZGUtd2lkdGggKTtcblx0XHQtLWZhZGUtZ3JhZGllbnQtY29tcG9zZWQ6IHZhciggLS1mYWRlLWdyYWRpZW50LWJhc2UgKSwgYmxhY2sgNjAlLFxuXHRcdFx0dHJhbnNwYXJlbnQgNTAlO1xuXHRcdCYuaXMtb3ZlcmZsb3dpbmctZmlyc3Qge1xuXHRcdFx0bWFzay1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxuXHRcdFx0XHR0byB2YXIoIC0tZGlyZWN0aW9uLWVuZCApLFxuXHRcdFx0XHR2YXIoIC0tZmFkZS1ncmFkaWVudC1iYXNlIClcblx0XHRcdCk7XG5cdFx0fVxuXHRcdCYuaXMtb3ZlcmZsb3dpbmctbGFzdCB7XG5cdFx0XHRtYXNrLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoXG5cdFx0XHRcdHRvIHZhciggLS1kaXJlY3Rpb24tc3RhcnQgKSxcblx0XHRcdFx0dmFyKCAtLWZhZGUtZ3JhZGllbnQtYmFzZSApXG5cdFx0XHQpO1xuXHRcdH1cblx0XHQmLmlzLW92ZXJmbG93aW5nLWZpcnN0LmlzLW92ZXJmbG93aW5nLWxhc3Qge1xuXHRcdFx0bWFzay1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxuXHRcdFx0XHRcdHRvIHJpZ2h0LFxuXHRcdFx0XHRcdHZhciggLS1mYWRlLWdyYWRpZW50LWNvbXBvc2VkIClcblx0XHRcdFx0KSxcblx0XHRcdFx0bGluZWFyLWdyYWRpZW50KCB0byBsZWZ0LCB2YXIoIC0tZmFkZS1ncmFkaWVudC1jb21wb3NlZCApICk7XG5cdFx0fVxuXG5cdFx0Jjo6YmVmb3JlIHtcblx0XHRcdGJvdHRvbTogMDtcblx0XHRcdGhlaWdodDogMDtcblx0XHRcdHdpZHRoOiBjYWxjKCB2YXIoIC0tYW50aWFsaWFzaW5nLWZhY3RvciApICogMXB4ICk7XG5cdFx0XHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoXG5cdFx0XHRcdFx0Y2FsYyhcblx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC1zdGFydCApICogdmFyKCAtLWRpcmVjdGlvbi1mYWN0b3IgKSAqXG5cdFx0XHRcdFx0XHRcdDFweFxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0XHRzY2FsZVgoXG5cdFx0XHRcdFx0Y2FsYyhcblx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC13aWR0aCwgMCApIC9cblx0XHRcdFx0XHRcdFx0dmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdGJvcmRlci1ib3R0b206IHZhciggLS13cC1hZG1pbi1ib3JkZXItd2lkdGgtZm9jdXMgKSBzb2xpZFxuXHRcdFx0XHQkeyBDT0xPUlMudGhlbWUuZ3JheVsgNzAwIF0gfTtcblx0XHR9XG5cdH1cblx0JlthcmlhLW9yaWVudGF0aW9uPSd2ZXJ0aWNhbCddIHtcblx0XHQmOjpiZWZvcmUge1xuXHRcdFx0LyogQWRqdXN0aW5nIHRoZSBib3JkZXIgcmFkaXVzIHRvIG1hdGNoIHRoZSBzY2FsaW5nIGluIHRoZSB5IGF4aXMuICovXG5cdFx0XHRib3JkZXItcmFkaXVzOiAkeyBDT05GSUcucmFkaXVzU21hbGwgfSAvXG5cdFx0XHRcdGNhbGMoXG5cdFx0XHRcdFx0JHsgQ09ORklHLnJhZGl1c1NtYWxsIH0gL1xuXHRcdFx0XHRcdFx0KFxuXHRcdFx0XHRcdFx0XHR2YXIoIC0tc2VsZWN0ZWQtaGVpZ2h0LCAwICkgL1xuXHRcdFx0XHRcdFx0XHRcdHZhciggLS1hbnRpYWxpYXNpbmctZmFjdG9yIClcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdHRvcDogMDtcblx0XHRcdGxlZnQ6IDA7XG5cdFx0XHR3aWR0aDogMTAwJTtcblx0XHRcdGhlaWdodDogY2FsYyggdmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKSAqIDFweCApO1xuXHRcdFx0dHJhbnNmb3JtOiB0cmFuc2xhdGVZKCBjYWxjKCB2YXIoIC0tc2VsZWN0ZWQtdG9wLCAwICkgKiAxcHggKSApXG5cdFx0XHRcdHNjYWxlWShcblx0XHRcdFx0XHRjYWxjKFxuXHRcdFx0XHRcdFx0dmFyKCAtLXNlbGVjdGVkLWhlaWdodCwgMCApIC9cblx0XHRcdFx0XHRcdFx0dmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdGJhY2tncm91bmQtY29sb3I6ICR7IENPTE9SUy50aGVtZS5ncmF5WyAxMDAgXSB9O1xuXHRcdH1cblx0XHQmW2RhdGEtc2VsZWN0LW9uLW1vdmU9J3RydWUnXTpoYXMoXG5cdFx0XHRcdDppcyggOmZvY3VzLXZpc2libGUsIFtkYXRhLWZvY3VzLXZpc2libGVdIClcblx0XHRcdCk6OmJlZm9yZSB7XG5cdFx0XHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXHRcdFx0Ym9yZGVyOiB2YXIoIC0td3AtYWRtaW4tYm9yZGVyLXdpZHRoLWZvY3VzICkgc29saWRcblx0XHRcdFx0JHsgQ09MT1JTLnRoZW1lLmFjY2VudCB9O1xuXHRcdFx0LyogQWRqdXN0aW5nIHRoZSBib3JkZXIgd2lkdGggdG8gbWF0Y2ggdGhlIHNjYWxpbmcgaW4gdGhlIHkgYXhpcy4gKi9cblx0XHRcdGJvcmRlci1ibG9jay13aWR0aDogY2FsYyhcblx0XHRcdFx0dmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cywgMXB4ICkgL1xuXHRcdFx0XHRcdChcblx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC1oZWlnaHQsIDAgKSAvXG5cdFx0XHRcdFx0XHRcdHZhciggLS1hbnRpYWxpYXNpbmctZmFjdG9yIClcblx0XHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuYDtcblxuZXhwb3J0IGNvbnN0IFRhYiA9IHN0eWxlZCggQXJpYWtpdC5UYWIgKWBcblx0JiB7XG5cdFx0LyogUmVzZXRzICovXG5cdFx0Ym9yZGVyLXJhZGl1czogMDtcblx0XHRiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcblx0XHRib3JkZXI6IG5vbmU7XG5cdFx0Ym94LXNoYWRvdzogbm9uZTtcblxuXHRcdGZsZXg6IDEgMCBhdXRvO1xuXHRcdHdoaXRlLXNwYWNlOiBub3dyYXA7XG5cdFx0ZGlzcGxheTogZmxleDtcblx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRsaW5lLWhlaWdodDogMS4yOyAvLyBDaGFyYWN0ZXJzIGluIHNvbWUgbGFuZ3VhZ2VzIChlLmcuIEphcGFuZXNlKSBtYXkgaGF2ZSBhIG5hdGl2ZSBoaWdoZXIgbGluZS1oZWlnaHQuXG5cdFx0Zm9udC1mYW1pbHk6ICR7IGZvbnQoICdkZWZhdWx0LmZvbnRGYW1pbHknICkgfTtcblx0XHRmb250LXdlaWdodDogNDAwO1xuXHRcdGZvbnQtc2l6ZTogJHsgZm9udCggJ2RlZmF1bHQuZm9udFNpemUnICkgfTtcblx0XHRjb2xvcjogJHsgQ09MT1JTLnRoZW1lLmZvcmVncm91bmQgfTtcblxuXHRcdCZbYXJpYS1kaXNhYmxlZD0ndHJ1ZSddIHtcblx0XHRcdGN1cnNvcjogZGVmYXVsdDtcblx0XHRcdGNvbG9yOiAkeyBDT0xPUlMudWkudGV4dERpc2FibGVkIH07XG5cdFx0fVxuXG5cdFx0Jjpub3QoIFthcmlhLWRpc2FibGVkPSd0cnVlJ10gKTppcyggOmhvdmVyLCBbZGF0YS1mb2N1cy12aXNpYmxlXSApIHtcblx0XHRcdGNvbG9yOiAkeyBDT0xPUlMudGhlbWUuZm9yZWdyb3VuZCB9O1xuXHRcdH1cblxuXHRcdCY6Zm9jdXM6bm90KCA6ZGlzYWJsZWQgKSB7XG5cdFx0XHRib3gtc2hhZG93OiBub25lO1xuXHRcdFx0b3V0bGluZTogbm9uZTtcblx0XHR9XG5cblx0XHQvLyBGb2N1cyBpbmRpY2F0b3IuXG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdCY6OmFmdGVyIHtcblx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHRcdHBvaW50ZXItZXZlbnRzOiBub25lO1xuXG5cdFx0XHQvLyBEcmF3IHRoZSBpbmRpY2F0b3IuXG5cdFx0XHQvLyBPdXRsaW5lIHdvcmtzIGZvciBXaW5kb3dzIGhpZ2ggY29udHJhc3QgbW9kZSBhcyB3ZWxsLlxuXHRcdFx0b3V0bGluZTogdmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cyApIHNvbGlkXG5cdFx0XHRcdCR7IENPTE9SUy50aGVtZS5hY2NlbnQgfTtcblx0XHRcdGJvcmRlci1yYWRpdXM6ICR7IENPTkZJRy5yYWRpdXNTbWFsbCB9O1xuXG5cdFx0XHQvLyBBbmltYXRpb25cblx0XHRcdG9wYWNpdHk6IDA7XG5cblx0XHRcdEBtZWRpYSBub3QgKCBwcmVmZXJzLXJlZHVjZWQtbW90aW9uICkge1xuXHRcdFx0XHR0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMXMgbGluZWFyO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCZbZGF0YS1mb2N1cy12aXNpYmxlXTo6YWZ0ZXIge1xuXHRcdFx0b3BhY2l0eTogMTtcblx0XHR9XG5cdH1cblxuXHRbYXJpYS1vcmllbnRhdGlvbj0naG9yaXpvbnRhbCddICYge1xuXHRcdHBhZGRpbmctaW5saW5lOiAkeyBzcGFjZSggNCApIH07XG5cdFx0aGVpZ2h0OiAkeyBzcGFjZSggMTIgKSB9O1xuXHRcdHNjcm9sbC1tYXJnaW46IDI0cHg7XG5cblx0XHQmOjphZnRlciB7XG5cdFx0XHRjb250ZW50OiAnJztcblx0XHRcdGluc2V0OiAkeyBzcGFjZSggMyApIH07XG5cdFx0fVxuXHR9XG5cblx0W2FyaWEtb3JpZW50YXRpb249J3ZlcnRpY2FsJ10gJiB7XG5cdFx0cGFkZGluZzogJHsgc3BhY2UoIDIgKSB9ICR7IHNwYWNlKCAzICkgfTtcblx0XHRtaW4taGVpZ2h0OiAkeyBzcGFjZSggMTAgKSB9O1xuXG5cdFx0JlthcmlhLXNlbGVjdGVkPSd0cnVlJ10ge1xuXHRcdFx0ZmlsbDogY3VycmVudENvbG9yO1xuXHRcdH1cblx0fVxuXHRbYXJpYS1vcmllbnRhdGlvbj0ndmVydGljYWwnXVtkYXRhLXNlbGVjdC1vbi1tb3ZlPSdmYWxzZSddICY6OmFmdGVyIHtcblx0XHRjb250ZW50OiAnJztcblx0XHRpbnNldDogdmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cyApO1xuXHR9XG5gO1xuXG5leHBvcnQgY29uc3QgVGFiQ2hpbGRyZW4gPSBzdHlsZWQuc3BhbmBcblx0ZmxleC1ncm93OiAxO1xuXG5cdGRpc3BsYXk6IGZsZXg7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cblx0W2FyaWEtb3JpZW50YXRpb249J2hvcml6b250YWwnXSAmIHtcblx0XHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0fVxuXHRbYXJpYS1vcmllbnRhdGlvbj0ndmVydGljYWwnXSAmIHtcblx0XHRqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xuXHR9XG5gO1xuXG5leHBvcnQgY29uc3QgVGFiQ2hldnJvbiA9IHN0eWxlZCggSWNvbiApYFxuXHRmbGV4LXNocmluazogMDtcblx0bWFyZ2luLWlubGluZS1lbmQ6ICR7IHNwYWNlKCAtMSApIH07XG5cdFthcmlhLW9yaWVudGF0aW9uPSdob3Jpem9udGFsJ10gJiB7XG5cdFx0ZGlzcGxheTogbm9uZTtcblx0fVxuXHRvcGFjaXR5OiAwO1xuXHRbcm9sZT0ndGFiJ106aXMoIFthcmlhLXNlbGVjdGVkPSd0cnVlJ10sIFtkYXRhLWZvY3VzLXZpc2libGVdLCA6aG92ZXIgKSAmIHtcblx0XHRvcGFjaXR5OiAxO1xuXHR9XG5cdC8vIFRoZSBjaGV2cm9uIGlzIHRyYW5zaXRpb25lZCBpbnRvIGV4aXN0ZW5jZSB3aGVuIHNlbGVjdE9uTW92ZSBpcyBlbmFibGVkLFxuXHQvLyBiZWNhdXNlIG90aGVyd2lzZSBpdCBsb29rcyBqYXJyaW5nLCBhcyBpdCBzaG93cyB1cCBvdXRzaWRlIG9mIHRoZSBmb2N1c1xuXHQvLyBpbmRpY2F0b3IgdGhhdCdzIGJlaW5nIGFuaW1hdGVkIGF0IHRoZSBzYW1lIHRpbWUuXG5cdEBtZWRpYSBub3QgKCBwcmVmZXJzLXJlZHVjZWQtbW90aW9uICkge1xuXHRcdFtkYXRhLXNlbGVjdC1vbi1tb3ZlPSd0cnVlJ11cblx0XHRcdFtyb2xlPSd0YWInXTppcyggW2FyaWEtc2VsZWN0ZWQ9J3RydWUnXSwgIClcblx0XHRcdCYge1xuXHRcdFx0dHJhbnNpdGlvbjogb3BhY2l0eSAwLjE1cyAwLjE1cyBsaW5lYXI7XG5cdFx0fVxuXHR9XG5cdCY6ZGlyKCBydGwgKSB7XG5cdFx0cm90YXRlOiAxODBkZWc7XG5cdH1cbmA7XG5cbmV4cG9ydCBjb25zdCBUYWJQYW5lbCA9IHN0eWxlZCggQXJpYWtpdC5UYWJQYW5lbCApYFxuXHQmOmZvY3VzIHtcblx0XHRib3gtc2hhZG93OiBub25lO1xuXHRcdG91dGxpbmU6IG5vbmU7XG5cdH1cblxuXHQmW2RhdGEtZm9jdXMtdmlzaWJsZV0ge1xuXHRcdGJveC1zaGFkb3c6IDAgMCAwIHZhciggLS13cC1hZG1pbi1ib3JkZXItd2lkdGgtZm9jdXMgKVxuXHRcdFx0JHsgQ09MT1JTLnRoZW1lLmFjY2VudCB9O1xuXHRcdC8vIFdpbmRvd3MgaGlnaCBjb250cmFzdCBtb2RlLlxuXHRcdG91dGxpbmU6IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcblx0XHRvdXRsaW5lLW9mZnNldDogMDtcblx0fVxuYDtcbiJdfQ== */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});
var TabChevron = /* @__PURE__ */ (0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])(_icon_index_mjs__WEBPACK_IMPORTED_MODULE_8__["default"],  false ? 0 : {
  target: "enfox0g1",
  label: "TabChevron"
})("flex-shrink:0;margin-inline-end:", (0,_utils_space_mjs__WEBPACK_IMPORTED_MODULE_7__.space)(-1), ";[aria-orientation='horizontal'] &{display:none;}opacity:0;[role='tab']:is( [aria-selected='true'], [data-focus-visible], :hover ) &{opacity:1;}@media not ( prefers-reduced-motion ){[data-select-on-move='true'] [role='tab']:is( [aria-selected='true'],  ) &{transition:opacity 0.15s 0.15s linear;}}&:dir( rtl ){rotate:180deg;}" + ( false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFtUHdDIiwiZmlsZSI6InN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRXh0ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcbmltcG9ydCAqIGFzIEFyaWFraXQgZnJvbSAnQGFyaWFraXQvcmVhY3QnO1xuXG4vKipcbiAqIEludGVybmFsIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgeyBDT0xPUlMsIENPTkZJRywgZm9udCB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IHNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvc3BhY2UnO1xuaW1wb3J0IEljb24gZnJvbSAnLi4vaWNvbic7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRUYWJMaXN0ID0gc3R5bGVkKCBBcmlha2l0LlRhYkxpc3QgKWBcblx0ZGlzcGxheTogZmxleDtcblx0YWxpZ24taXRlbXM6IHN0cmV0Y2g7XG5cdG92ZXJmbG93LXg6IGF1dG87XG5cblx0JlthcmlhLW9yaWVudGF0aW9uPSd2ZXJ0aWNhbCddIHtcblx0XHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHR9XG5cblx0OndoZXJlKCBbYXJpYS1vcmllbnRhdGlvbj0naG9yaXpvbnRhbCddICkge1xuXHRcdHdpZHRoOiBmaXQtY29udGVudDtcblx0fVxuXG5cdC0tZGlyZWN0aW9uLWZhY3RvcjogMTtcblx0LS1kaXJlY3Rpb24tc3RhcnQ6IGxlZnQ7XG5cdC0tZGlyZWN0aW9uLWVuZDogcmlnaHQ7XG5cdC0tc2VsZWN0ZWQtc3RhcnQ6IHZhciggLS1zZWxlY3RlZC1sZWZ0LCAwICk7XG5cdCY6ZGlyKCBydGwgKSB7XG5cdFx0LS1kaXJlY3Rpb24tZmFjdG9yOiAtMTtcblx0XHQtLWRpcmVjdGlvbi1zdGFydDogcmlnaHQ7XG5cdFx0LS1kaXJlY3Rpb24tZW5kOiBsZWZ0O1xuXHRcdC0tc2VsZWN0ZWQtc3RhcnQ6IHZhciggLS1zZWxlY3RlZC1yaWdodCwgMCApO1xuXHR9XG5cblx0QG1lZGlhIG5vdCAoIHByZWZlcnMtcmVkdWNlZC1tb3Rpb24gKSB7XG5cdFx0JltkYXRhLWluZGljYXRvci1hbmltYXRlZF06OmJlZm9yZSB7XG5cdFx0XHR0cmFuc2l0aW9uLXByb3BlcnR5OiB0cmFuc2Zvcm0sIGJvcmRlci1yYWRpdXMsIGJvcmRlci1ibG9jaztcblx0XHRcdHRyYW5zaXRpb24tZHVyYXRpb246IDAuMnM7XG5cdFx0XHR0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XG5cdFx0fVxuXHR9XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0Jjo6YmVmb3JlIHtcblx0XHRjb250ZW50OiAnJztcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0cG9pbnRlci1ldmVudHM6IG5vbmU7XG5cdFx0dHJhbnNmb3JtLW9yaWdpbjogdmFyKCAtLWRpcmVjdGlvbi1zdGFydCApIHRvcDtcblxuXHRcdC8vIFdpbmRvd3MgaGlnaCBjb250cmFzdCBtb2RlLlxuXHRcdG91dGxpbmU6IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcblx0XHRvdXRsaW5lLW9mZnNldDogLTFweDtcblx0fVxuXG5cdC8qIFVzaW5nIGEgbGFyZ2UgdmFsdWUgdG8gYXZvaWQgYW50aWFsaWFzaW5nIHJvdW5kaW5nIGlzc3Vlc1xuXHRcdFx0d2hlbiBzY2FsaW5nIGluIHRoZSB0cmFuc2Zvcm0sIHNlZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzUyMTU5MTIzICovXG5cdC0tYW50aWFsaWFzaW5nLWZhY3RvcjogMTAwO1xuXHQmW2FyaWEtb3JpZW50YXRpb249J2hvcml6b250YWwnXSB7XG5cdFx0LS1mYWRlLXdpZHRoOiA2NHB4O1xuXHRcdC0tZmFkZS1ncmFkaWVudC1iYXNlOiB0cmFuc3BhcmVudCAwJSwgYmxhY2sgdmFyKCAtLWZhZGUtd2lkdGggKTtcblx0XHQtLWZhZGUtZ3JhZGllbnQtY29tcG9zZWQ6IHZhciggLS1mYWRlLWdyYWRpZW50LWJhc2UgKSwgYmxhY2sgNjAlLFxuXHRcdFx0dHJhbnNwYXJlbnQgNTAlO1xuXHRcdCYuaXMtb3ZlcmZsb3dpbmctZmlyc3Qge1xuXHRcdFx0bWFzay1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxuXHRcdFx0XHR0byB2YXIoIC0tZGlyZWN0aW9uLWVuZCApLFxuXHRcdFx0XHR2YXIoIC0tZmFkZS1ncmFkaWVudC1iYXNlIClcblx0XHRcdCk7XG5cdFx0fVxuXHRcdCYuaXMtb3ZlcmZsb3dpbmctbGFzdCB7XG5cdFx0XHRtYXNrLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoXG5cdFx0XHRcdHRvIHZhciggLS1kaXJlY3Rpb24tc3RhcnQgKSxcblx0XHRcdFx0dmFyKCAtLWZhZGUtZ3JhZGllbnQtYmFzZSApXG5cdFx0XHQpO1xuXHRcdH1cblx0XHQmLmlzLW92ZXJmbG93aW5nLWZpcnN0LmlzLW92ZXJmbG93aW5nLWxhc3Qge1xuXHRcdFx0bWFzay1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxuXHRcdFx0XHRcdHRvIHJpZ2h0LFxuXHRcdFx0XHRcdHZhciggLS1mYWRlLWdyYWRpZW50LWNvbXBvc2VkIClcblx0XHRcdFx0KSxcblx0XHRcdFx0bGluZWFyLWdyYWRpZW50KCB0byBsZWZ0LCB2YXIoIC0tZmFkZS1ncmFkaWVudC1jb21wb3NlZCApICk7XG5cdFx0fVxuXG5cdFx0Jjo6YmVmb3JlIHtcblx0XHRcdGJvdHRvbTogMDtcblx0XHRcdGhlaWdodDogMDtcblx0XHRcdHdpZHRoOiBjYWxjKCB2YXIoIC0tYW50aWFsaWFzaW5nLWZhY3RvciApICogMXB4ICk7XG5cdFx0XHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoXG5cdFx0XHRcdFx0Y2FsYyhcblx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC1zdGFydCApICogdmFyKCAtLWRpcmVjdGlvbi1mYWN0b3IgKSAqXG5cdFx0XHRcdFx0XHRcdDFweFxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0XHRzY2FsZVgoXG5cdFx0XHRcdFx0Y2FsYyhcblx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC13aWR0aCwgMCApIC9cblx0XHRcdFx0XHRcdFx0dmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdGJvcmRlci1ib3R0b206IHZhciggLS13cC1hZG1pbi1ib3JkZXItd2lkdGgtZm9jdXMgKSBzb2xpZFxuXHRcdFx0XHQkeyBDT0xPUlMudGhlbWUuZ3JheVsgNzAwIF0gfTtcblx0XHR9XG5cdH1cblx0JlthcmlhLW9yaWVudGF0aW9uPSd2ZXJ0aWNhbCddIHtcblx0XHQmOjpiZWZvcmUge1xuXHRcdFx0LyogQWRqdXN0aW5nIHRoZSBib3JkZXIgcmFkaXVzIHRvIG1hdGNoIHRoZSBzY2FsaW5nIGluIHRoZSB5IGF4aXMuICovXG5cdFx0XHRib3JkZXItcmFkaXVzOiAkeyBDT05GSUcucmFkaXVzU21hbGwgfSAvXG5cdFx0XHRcdGNhbGMoXG5cdFx0XHRcdFx0JHsgQ09ORklHLnJhZGl1c1NtYWxsIH0gL1xuXHRcdFx0XHRcdFx0KFxuXHRcdFx0XHRcdFx0XHR2YXIoIC0tc2VsZWN0ZWQtaGVpZ2h0LCAwICkgL1xuXHRcdFx0XHRcdFx0XHRcdHZhciggLS1hbnRpYWxpYXNpbmctZmFjdG9yIClcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdHRvcDogMDtcblx0XHRcdGxlZnQ6IDA7XG5cdFx0XHR3aWR0aDogMTAwJTtcblx0XHRcdGhlaWdodDogY2FsYyggdmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKSAqIDFweCApO1xuXHRcdFx0dHJhbnNmb3JtOiB0cmFuc2xhdGVZKCBjYWxjKCB2YXIoIC0tc2VsZWN0ZWQtdG9wLCAwICkgKiAxcHggKSApXG5cdFx0XHRcdHNjYWxlWShcblx0XHRcdFx0XHRjYWxjKFxuXHRcdFx0XHRcdFx0dmFyKCAtLXNlbGVjdGVkLWhlaWdodCwgMCApIC9cblx0XHRcdFx0XHRcdFx0dmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdGJhY2tncm91bmQtY29sb3I6ICR7IENPTE9SUy50aGVtZS5ncmF5WyAxMDAgXSB9O1xuXHRcdH1cblx0XHQmW2RhdGEtc2VsZWN0LW9uLW1vdmU9J3RydWUnXTpoYXMoXG5cdFx0XHRcdDppcyggOmZvY3VzLXZpc2libGUsIFtkYXRhLWZvY3VzLXZpc2libGVdIClcblx0XHRcdCk6OmJlZm9yZSB7XG5cdFx0XHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXHRcdFx0Ym9yZGVyOiB2YXIoIC0td3AtYWRtaW4tYm9yZGVyLXdpZHRoLWZvY3VzICkgc29saWRcblx0XHRcdFx0JHsgQ09MT1JTLnRoZW1lLmFjY2VudCB9O1xuXHRcdFx0LyogQWRqdXN0aW5nIHRoZSBib3JkZXIgd2lkdGggdG8gbWF0Y2ggdGhlIHNjYWxpbmcgaW4gdGhlIHkgYXhpcy4gKi9cblx0XHRcdGJvcmRlci1ibG9jay13aWR0aDogY2FsYyhcblx0XHRcdFx0dmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cywgMXB4ICkgL1xuXHRcdFx0XHRcdChcblx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC1oZWlnaHQsIDAgKSAvXG5cdFx0XHRcdFx0XHRcdHZhciggLS1hbnRpYWxpYXNpbmctZmFjdG9yIClcblx0XHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuYDtcblxuZXhwb3J0IGNvbnN0IFRhYiA9IHN0eWxlZCggQXJpYWtpdC5UYWIgKWBcblx0JiB7XG5cdFx0LyogUmVzZXRzICovXG5cdFx0Ym9yZGVyLXJhZGl1czogMDtcblx0XHRiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcblx0XHRib3JkZXI6IG5vbmU7XG5cdFx0Ym94LXNoYWRvdzogbm9uZTtcblxuXHRcdGZsZXg6IDEgMCBhdXRvO1xuXHRcdHdoaXRlLXNwYWNlOiBub3dyYXA7XG5cdFx0ZGlzcGxheTogZmxleDtcblx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRsaW5lLWhlaWdodDogMS4yOyAvLyBDaGFyYWN0ZXJzIGluIHNvbWUgbGFuZ3VhZ2VzIChlLmcuIEphcGFuZXNlKSBtYXkgaGF2ZSBhIG5hdGl2ZSBoaWdoZXIgbGluZS1oZWlnaHQuXG5cdFx0Zm9udC1mYW1pbHk6ICR7IGZvbnQoICdkZWZhdWx0LmZvbnRGYW1pbHknICkgfTtcblx0XHRmb250LXdlaWdodDogNDAwO1xuXHRcdGZvbnQtc2l6ZTogJHsgZm9udCggJ2RlZmF1bHQuZm9udFNpemUnICkgfTtcblx0XHRjb2xvcjogJHsgQ09MT1JTLnRoZW1lLmZvcmVncm91bmQgfTtcblxuXHRcdCZbYXJpYS1kaXNhYmxlZD0ndHJ1ZSddIHtcblx0XHRcdGN1cnNvcjogZGVmYXVsdDtcblx0XHRcdGNvbG9yOiAkeyBDT0xPUlMudWkudGV4dERpc2FibGVkIH07XG5cdFx0fVxuXG5cdFx0Jjpub3QoIFthcmlhLWRpc2FibGVkPSd0cnVlJ10gKTppcyggOmhvdmVyLCBbZGF0YS1mb2N1cy12aXNpYmxlXSApIHtcblx0XHRcdGNvbG9yOiAkeyBDT0xPUlMudGhlbWUuZm9yZWdyb3VuZCB9O1xuXHRcdH1cblxuXHRcdCY6Zm9jdXM6bm90KCA6ZGlzYWJsZWQgKSB7XG5cdFx0XHRib3gtc2hhZG93OiBub25lO1xuXHRcdFx0b3V0bGluZTogbm9uZTtcblx0XHR9XG5cblx0XHQvLyBGb2N1cyBpbmRpY2F0b3IuXG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdCY6OmFmdGVyIHtcblx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHRcdHBvaW50ZXItZXZlbnRzOiBub25lO1xuXG5cdFx0XHQvLyBEcmF3IHRoZSBpbmRpY2F0b3IuXG5cdFx0XHQvLyBPdXRsaW5lIHdvcmtzIGZvciBXaW5kb3dzIGhpZ2ggY29udHJhc3QgbW9kZSBhcyB3ZWxsLlxuXHRcdFx0b3V0bGluZTogdmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cyApIHNvbGlkXG5cdFx0XHRcdCR7IENPTE9SUy50aGVtZS5hY2NlbnQgfTtcblx0XHRcdGJvcmRlci1yYWRpdXM6ICR7IENPTkZJRy5yYWRpdXNTbWFsbCB9O1xuXG5cdFx0XHQvLyBBbmltYXRpb25cblx0XHRcdG9wYWNpdHk6IDA7XG5cblx0XHRcdEBtZWRpYSBub3QgKCBwcmVmZXJzLXJlZHVjZWQtbW90aW9uICkge1xuXHRcdFx0XHR0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMXMgbGluZWFyO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCZbZGF0YS1mb2N1cy12aXNpYmxlXTo6YWZ0ZXIge1xuXHRcdFx0b3BhY2l0eTogMTtcblx0XHR9XG5cdH1cblxuXHRbYXJpYS1vcmllbnRhdGlvbj0naG9yaXpvbnRhbCddICYge1xuXHRcdHBhZGRpbmctaW5saW5lOiAkeyBzcGFjZSggNCApIH07XG5cdFx0aGVpZ2h0OiAkeyBzcGFjZSggMTIgKSB9O1xuXHRcdHNjcm9sbC1tYXJnaW46IDI0cHg7XG5cblx0XHQmOjphZnRlciB7XG5cdFx0XHRjb250ZW50OiAnJztcblx0XHRcdGluc2V0OiAkeyBzcGFjZSggMyApIH07XG5cdFx0fVxuXHR9XG5cblx0W2FyaWEtb3JpZW50YXRpb249J3ZlcnRpY2FsJ10gJiB7XG5cdFx0cGFkZGluZzogJHsgc3BhY2UoIDIgKSB9ICR7IHNwYWNlKCAzICkgfTtcblx0XHRtaW4taGVpZ2h0OiAkeyBzcGFjZSggMTAgKSB9O1xuXG5cdFx0JlthcmlhLXNlbGVjdGVkPSd0cnVlJ10ge1xuXHRcdFx0ZmlsbDogY3VycmVudENvbG9yO1xuXHRcdH1cblx0fVxuXHRbYXJpYS1vcmllbnRhdGlvbj0ndmVydGljYWwnXVtkYXRhLXNlbGVjdC1vbi1tb3ZlPSdmYWxzZSddICY6OmFmdGVyIHtcblx0XHRjb250ZW50OiAnJztcblx0XHRpbnNldDogdmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cyApO1xuXHR9XG5gO1xuXG5leHBvcnQgY29uc3QgVGFiQ2hpbGRyZW4gPSBzdHlsZWQuc3BhbmBcblx0ZmxleC1ncm93OiAxO1xuXG5cdGRpc3BsYXk6IGZsZXg7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cblx0W2FyaWEtb3JpZW50YXRpb249J2hvcml6b250YWwnXSAmIHtcblx0XHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0fVxuXHRbYXJpYS1vcmllbnRhdGlvbj0ndmVydGljYWwnXSAmIHtcblx0XHRqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xuXHR9XG5gO1xuXG5leHBvcnQgY29uc3QgVGFiQ2hldnJvbiA9IHN0eWxlZCggSWNvbiApYFxuXHRmbGV4LXNocmluazogMDtcblx0bWFyZ2luLWlubGluZS1lbmQ6ICR7IHNwYWNlKCAtMSApIH07XG5cdFthcmlhLW9yaWVudGF0aW9uPSdob3Jpem9udGFsJ10gJiB7XG5cdFx0ZGlzcGxheTogbm9uZTtcblx0fVxuXHRvcGFjaXR5OiAwO1xuXHRbcm9sZT0ndGFiJ106aXMoIFthcmlhLXNlbGVjdGVkPSd0cnVlJ10sIFtkYXRhLWZvY3VzLXZpc2libGVdLCA6aG92ZXIgKSAmIHtcblx0XHRvcGFjaXR5OiAxO1xuXHR9XG5cdC8vIFRoZSBjaGV2cm9uIGlzIHRyYW5zaXRpb25lZCBpbnRvIGV4aXN0ZW5jZSB3aGVuIHNlbGVjdE9uTW92ZSBpcyBlbmFibGVkLFxuXHQvLyBiZWNhdXNlIG90aGVyd2lzZSBpdCBsb29rcyBqYXJyaW5nLCBhcyBpdCBzaG93cyB1cCBvdXRzaWRlIG9mIHRoZSBmb2N1c1xuXHQvLyBpbmRpY2F0b3IgdGhhdCdzIGJlaW5nIGFuaW1hdGVkIGF0IHRoZSBzYW1lIHRpbWUuXG5cdEBtZWRpYSBub3QgKCBwcmVmZXJzLXJlZHVjZWQtbW90aW9uICkge1xuXHRcdFtkYXRhLXNlbGVjdC1vbi1tb3ZlPSd0cnVlJ11cblx0XHRcdFtyb2xlPSd0YWInXTppcyggW2FyaWEtc2VsZWN0ZWQ9J3RydWUnXSwgIClcblx0XHRcdCYge1xuXHRcdFx0dHJhbnNpdGlvbjogb3BhY2l0eSAwLjE1cyAwLjE1cyBsaW5lYXI7XG5cdFx0fVxuXHR9XG5cdCY6ZGlyKCBydGwgKSB7XG5cdFx0cm90YXRlOiAxODBkZWc7XG5cdH1cbmA7XG5cbmV4cG9ydCBjb25zdCBUYWJQYW5lbCA9IHN0eWxlZCggQXJpYWtpdC5UYWJQYW5lbCApYFxuXHQmOmZvY3VzIHtcblx0XHRib3gtc2hhZG93OiBub25lO1xuXHRcdG91dGxpbmU6IG5vbmU7XG5cdH1cblxuXHQmW2RhdGEtZm9jdXMtdmlzaWJsZV0ge1xuXHRcdGJveC1zaGFkb3c6IDAgMCAwIHZhciggLS13cC1hZG1pbi1ib3JkZXItd2lkdGgtZm9jdXMgKVxuXHRcdFx0JHsgQ09MT1JTLnRoZW1lLmFjY2VudCB9O1xuXHRcdC8vIFdpbmRvd3MgaGlnaCBjb250cmFzdCBtb2RlLlxuXHRcdG91dGxpbmU6IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcblx0XHRvdXRsaW5lLW9mZnNldDogMDtcblx0fVxuYDtcbiJdfQ== */"));
var TabPanel2 = /* @__PURE__ */ (0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])(_ariakit_react__WEBPACK_IMPORTED_MODULE_3__.TabPanel,  false ? 0 : {
  target: "enfox0g0",
  label: "TabPanel"
})("&:focus{box-shadow:none;outline:none;}&[data-focus-visible]{box-shadow:0 0 0 var( --wp-admin-border-width-focus ) ", _utils_index_mjs__WEBPACK_IMPORTED_MODULE_6__.COLORS.theme.accent, ";outline:2px solid transparent;outline-offset:0;}" + ( false ? 0 : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0eWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE0UWtEIiwiZmlsZSI6InN0eWxlcy50cyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRXh0ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcbmltcG9ydCAqIGFzIEFyaWFraXQgZnJvbSAnQGFyaWFraXQvcmVhY3QnO1xuXG4vKipcbiAqIEludGVybmFsIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgeyBDT0xPUlMsIENPTkZJRywgZm9udCB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IHNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvc3BhY2UnO1xuaW1wb3J0IEljb24gZnJvbSAnLi4vaWNvbic7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRUYWJMaXN0ID0gc3R5bGVkKCBBcmlha2l0LlRhYkxpc3QgKWBcblx0ZGlzcGxheTogZmxleDtcblx0YWxpZ24taXRlbXM6IHN0cmV0Y2g7XG5cdG92ZXJmbG93LXg6IGF1dG87XG5cblx0JlthcmlhLW9yaWVudGF0aW9uPSd2ZXJ0aWNhbCddIHtcblx0XHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHR9XG5cblx0OndoZXJlKCBbYXJpYS1vcmllbnRhdGlvbj0naG9yaXpvbnRhbCddICkge1xuXHRcdHdpZHRoOiBmaXQtY29udGVudDtcblx0fVxuXG5cdC0tZGlyZWN0aW9uLWZhY3RvcjogMTtcblx0LS1kaXJlY3Rpb24tc3RhcnQ6IGxlZnQ7XG5cdC0tZGlyZWN0aW9uLWVuZDogcmlnaHQ7XG5cdC0tc2VsZWN0ZWQtc3RhcnQ6IHZhciggLS1zZWxlY3RlZC1sZWZ0LCAwICk7XG5cdCY6ZGlyKCBydGwgKSB7XG5cdFx0LS1kaXJlY3Rpb24tZmFjdG9yOiAtMTtcblx0XHQtLWRpcmVjdGlvbi1zdGFydDogcmlnaHQ7XG5cdFx0LS1kaXJlY3Rpb24tZW5kOiBsZWZ0O1xuXHRcdC0tc2VsZWN0ZWQtc3RhcnQ6IHZhciggLS1zZWxlY3RlZC1yaWdodCwgMCApO1xuXHR9XG5cblx0QG1lZGlhIG5vdCAoIHByZWZlcnMtcmVkdWNlZC1tb3Rpb24gKSB7XG5cdFx0JltkYXRhLWluZGljYXRvci1hbmltYXRlZF06OmJlZm9yZSB7XG5cdFx0XHR0cmFuc2l0aW9uLXByb3BlcnR5OiB0cmFuc2Zvcm0sIGJvcmRlci1yYWRpdXMsIGJvcmRlci1ibG9jaztcblx0XHRcdHRyYW5zaXRpb24tZHVyYXRpb246IDAuMnM7XG5cdFx0XHR0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XG5cdFx0fVxuXHR9XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0Jjo6YmVmb3JlIHtcblx0XHRjb250ZW50OiAnJztcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0cG9pbnRlci1ldmVudHM6IG5vbmU7XG5cdFx0dHJhbnNmb3JtLW9yaWdpbjogdmFyKCAtLWRpcmVjdGlvbi1zdGFydCApIHRvcDtcblxuXHRcdC8vIFdpbmRvd3MgaGlnaCBjb250cmFzdCBtb2RlLlxuXHRcdG91dGxpbmU6IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcblx0XHRvdXRsaW5lLW9mZnNldDogLTFweDtcblx0fVxuXG5cdC8qIFVzaW5nIGEgbGFyZ2UgdmFsdWUgdG8gYXZvaWQgYW50aWFsaWFzaW5nIHJvdW5kaW5nIGlzc3Vlc1xuXHRcdFx0d2hlbiBzY2FsaW5nIGluIHRoZSB0cmFuc2Zvcm0sIHNlZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzUyMTU5MTIzICovXG5cdC0tYW50aWFsaWFzaW5nLWZhY3RvcjogMTAwO1xuXHQmW2FyaWEtb3JpZW50YXRpb249J2hvcml6b250YWwnXSB7XG5cdFx0LS1mYWRlLXdpZHRoOiA2NHB4O1xuXHRcdC0tZmFkZS1ncmFkaWVudC1iYXNlOiB0cmFuc3BhcmVudCAwJSwgYmxhY2sgdmFyKCAtLWZhZGUtd2lkdGggKTtcblx0XHQtLWZhZGUtZ3JhZGllbnQtY29tcG9zZWQ6IHZhciggLS1mYWRlLWdyYWRpZW50LWJhc2UgKSwgYmxhY2sgNjAlLFxuXHRcdFx0dHJhbnNwYXJlbnQgNTAlO1xuXHRcdCYuaXMtb3ZlcmZsb3dpbmctZmlyc3Qge1xuXHRcdFx0bWFzay1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxuXHRcdFx0XHR0byB2YXIoIC0tZGlyZWN0aW9uLWVuZCApLFxuXHRcdFx0XHR2YXIoIC0tZmFkZS1ncmFkaWVudC1iYXNlIClcblx0XHRcdCk7XG5cdFx0fVxuXHRcdCYuaXMtb3ZlcmZsb3dpbmctbGFzdCB7XG5cdFx0XHRtYXNrLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoXG5cdFx0XHRcdHRvIHZhciggLS1kaXJlY3Rpb24tc3RhcnQgKSxcblx0XHRcdFx0dmFyKCAtLWZhZGUtZ3JhZGllbnQtYmFzZSApXG5cdFx0XHQpO1xuXHRcdH1cblx0XHQmLmlzLW92ZXJmbG93aW5nLWZpcnN0LmlzLW92ZXJmbG93aW5nLWxhc3Qge1xuXHRcdFx0bWFzay1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxuXHRcdFx0XHRcdHRvIHJpZ2h0LFxuXHRcdFx0XHRcdHZhciggLS1mYWRlLWdyYWRpZW50LWNvbXBvc2VkIClcblx0XHRcdFx0KSxcblx0XHRcdFx0bGluZWFyLWdyYWRpZW50KCB0byBsZWZ0LCB2YXIoIC0tZmFkZS1ncmFkaWVudC1jb21wb3NlZCApICk7XG5cdFx0fVxuXG5cdFx0Jjo6YmVmb3JlIHtcblx0XHRcdGJvdHRvbTogMDtcblx0XHRcdGhlaWdodDogMDtcblx0XHRcdHdpZHRoOiBjYWxjKCB2YXIoIC0tYW50aWFsaWFzaW5nLWZhY3RvciApICogMXB4ICk7XG5cdFx0XHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoXG5cdFx0XHRcdFx0Y2FsYyhcblx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC1zdGFydCApICogdmFyKCAtLWRpcmVjdGlvbi1mYWN0b3IgKSAqXG5cdFx0XHRcdFx0XHRcdDFweFxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0XHRzY2FsZVgoXG5cdFx0XHRcdFx0Y2FsYyhcblx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC13aWR0aCwgMCApIC9cblx0XHRcdFx0XHRcdFx0dmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdGJvcmRlci1ib3R0b206IHZhciggLS13cC1hZG1pbi1ib3JkZXItd2lkdGgtZm9jdXMgKSBzb2xpZFxuXHRcdFx0XHQkeyBDT0xPUlMudGhlbWUuZ3JheVsgNzAwIF0gfTtcblx0XHR9XG5cdH1cblx0JlthcmlhLW9yaWVudGF0aW9uPSd2ZXJ0aWNhbCddIHtcblx0XHQmOjpiZWZvcmUge1xuXHRcdFx0LyogQWRqdXN0aW5nIHRoZSBib3JkZXIgcmFkaXVzIHRvIG1hdGNoIHRoZSBzY2FsaW5nIGluIHRoZSB5IGF4aXMuICovXG5cdFx0XHRib3JkZXItcmFkaXVzOiAkeyBDT05GSUcucmFkaXVzU21hbGwgfSAvXG5cdFx0XHRcdGNhbGMoXG5cdFx0XHRcdFx0JHsgQ09ORklHLnJhZGl1c1NtYWxsIH0gL1xuXHRcdFx0XHRcdFx0KFxuXHRcdFx0XHRcdFx0XHR2YXIoIC0tc2VsZWN0ZWQtaGVpZ2h0LCAwICkgL1xuXHRcdFx0XHRcdFx0XHRcdHZhciggLS1hbnRpYWxpYXNpbmctZmFjdG9yIClcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdHRvcDogMDtcblx0XHRcdGxlZnQ6IDA7XG5cdFx0XHR3aWR0aDogMTAwJTtcblx0XHRcdGhlaWdodDogY2FsYyggdmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKSAqIDFweCApO1xuXHRcdFx0dHJhbnNmb3JtOiB0cmFuc2xhdGVZKCBjYWxjKCB2YXIoIC0tc2VsZWN0ZWQtdG9wLCAwICkgKiAxcHggKSApXG5cdFx0XHRcdHNjYWxlWShcblx0XHRcdFx0XHRjYWxjKFxuXHRcdFx0XHRcdFx0dmFyKCAtLXNlbGVjdGVkLWhlaWdodCwgMCApIC9cblx0XHRcdFx0XHRcdFx0dmFyKCAtLWFudGlhbGlhc2luZy1mYWN0b3IgKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdGJhY2tncm91bmQtY29sb3I6ICR7IENPTE9SUy50aGVtZS5ncmF5WyAxMDAgXSB9O1xuXHRcdH1cblx0XHQmW2RhdGEtc2VsZWN0LW9uLW1vdmU9J3RydWUnXTpoYXMoXG5cdFx0XHRcdDppcyggOmZvY3VzLXZpc2libGUsIFtkYXRhLWZvY3VzLXZpc2libGVdIClcblx0XHRcdCk6OmJlZm9yZSB7XG5cdFx0XHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXHRcdFx0Ym9yZGVyOiB2YXIoIC0td3AtYWRtaW4tYm9yZGVyLXdpZHRoLWZvY3VzICkgc29saWRcblx0XHRcdFx0JHsgQ09MT1JTLnRoZW1lLmFjY2VudCB9O1xuXHRcdFx0LyogQWRqdXN0aW5nIHRoZSBib3JkZXIgd2lkdGggdG8gbWF0Y2ggdGhlIHNjYWxpbmcgaW4gdGhlIHkgYXhpcy4gKi9cblx0XHRcdGJvcmRlci1ibG9jay13aWR0aDogY2FsYyhcblx0XHRcdFx0dmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cywgMXB4ICkgL1xuXHRcdFx0XHRcdChcblx0XHRcdFx0XHRcdHZhciggLS1zZWxlY3RlZC1oZWlnaHQsIDAgKSAvXG5cdFx0XHRcdFx0XHRcdHZhciggLS1hbnRpYWxpYXNpbmctZmFjdG9yIClcblx0XHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuYDtcblxuZXhwb3J0IGNvbnN0IFRhYiA9IHN0eWxlZCggQXJpYWtpdC5UYWIgKWBcblx0JiB7XG5cdFx0LyogUmVzZXRzICovXG5cdFx0Ym9yZGVyLXJhZGl1czogMDtcblx0XHRiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcblx0XHRib3JkZXI6IG5vbmU7XG5cdFx0Ym94LXNoYWRvdzogbm9uZTtcblxuXHRcdGZsZXg6IDEgMCBhdXRvO1xuXHRcdHdoaXRlLXNwYWNlOiBub3dyYXA7XG5cdFx0ZGlzcGxheTogZmxleDtcblx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRsaW5lLWhlaWdodDogMS4yOyAvLyBDaGFyYWN0ZXJzIGluIHNvbWUgbGFuZ3VhZ2VzIChlLmcuIEphcGFuZXNlKSBtYXkgaGF2ZSBhIG5hdGl2ZSBoaWdoZXIgbGluZS1oZWlnaHQuXG5cdFx0Zm9udC1mYW1pbHk6ICR7IGZvbnQoICdkZWZhdWx0LmZvbnRGYW1pbHknICkgfTtcblx0XHRmb250LXdlaWdodDogNDAwO1xuXHRcdGZvbnQtc2l6ZTogJHsgZm9udCggJ2RlZmF1bHQuZm9udFNpemUnICkgfTtcblx0XHRjb2xvcjogJHsgQ09MT1JTLnRoZW1lLmZvcmVncm91bmQgfTtcblxuXHRcdCZbYXJpYS1kaXNhYmxlZD0ndHJ1ZSddIHtcblx0XHRcdGN1cnNvcjogZGVmYXVsdDtcblx0XHRcdGNvbG9yOiAkeyBDT0xPUlMudWkudGV4dERpc2FibGVkIH07XG5cdFx0fVxuXG5cdFx0Jjpub3QoIFthcmlhLWRpc2FibGVkPSd0cnVlJ10gKTppcyggOmhvdmVyLCBbZGF0YS1mb2N1cy12aXNpYmxlXSApIHtcblx0XHRcdGNvbG9yOiAkeyBDT0xPUlMudGhlbWUuZm9yZWdyb3VuZCB9O1xuXHRcdH1cblxuXHRcdCY6Zm9jdXM6bm90KCA6ZGlzYWJsZWQgKSB7XG5cdFx0XHRib3gtc2hhZG93OiBub25lO1xuXHRcdFx0b3V0bGluZTogbm9uZTtcblx0XHR9XG5cblx0XHQvLyBGb2N1cyBpbmRpY2F0b3IuXG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdCY6OmFmdGVyIHtcblx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHRcdHBvaW50ZXItZXZlbnRzOiBub25lO1xuXG5cdFx0XHQvLyBEcmF3IHRoZSBpbmRpY2F0b3IuXG5cdFx0XHQvLyBPdXRsaW5lIHdvcmtzIGZvciBXaW5kb3dzIGhpZ2ggY29udHJhc3QgbW9kZSBhcyB3ZWxsLlxuXHRcdFx0b3V0bGluZTogdmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cyApIHNvbGlkXG5cdFx0XHRcdCR7IENPTE9SUy50aGVtZS5hY2NlbnQgfTtcblx0XHRcdGJvcmRlci1yYWRpdXM6ICR7IENPTkZJRy5yYWRpdXNTbWFsbCB9O1xuXG5cdFx0XHQvLyBBbmltYXRpb25cblx0XHRcdG9wYWNpdHk6IDA7XG5cblx0XHRcdEBtZWRpYSBub3QgKCBwcmVmZXJzLXJlZHVjZWQtbW90aW9uICkge1xuXHRcdFx0XHR0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMXMgbGluZWFyO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCZbZGF0YS1mb2N1cy12aXNpYmxlXTo6YWZ0ZXIge1xuXHRcdFx0b3BhY2l0eTogMTtcblx0XHR9XG5cdH1cblxuXHRbYXJpYS1vcmllbnRhdGlvbj0naG9yaXpvbnRhbCddICYge1xuXHRcdHBhZGRpbmctaW5saW5lOiAkeyBzcGFjZSggNCApIH07XG5cdFx0aGVpZ2h0OiAkeyBzcGFjZSggMTIgKSB9O1xuXHRcdHNjcm9sbC1tYXJnaW46IDI0cHg7XG5cblx0XHQmOjphZnRlciB7XG5cdFx0XHRjb250ZW50OiAnJztcblx0XHRcdGluc2V0OiAkeyBzcGFjZSggMyApIH07XG5cdFx0fVxuXHR9XG5cblx0W2FyaWEtb3JpZW50YXRpb249J3ZlcnRpY2FsJ10gJiB7XG5cdFx0cGFkZGluZzogJHsgc3BhY2UoIDIgKSB9ICR7IHNwYWNlKCAzICkgfTtcblx0XHRtaW4taGVpZ2h0OiAkeyBzcGFjZSggMTAgKSB9O1xuXG5cdFx0JlthcmlhLXNlbGVjdGVkPSd0cnVlJ10ge1xuXHRcdFx0ZmlsbDogY3VycmVudENvbG9yO1xuXHRcdH1cblx0fVxuXHRbYXJpYS1vcmllbnRhdGlvbj0ndmVydGljYWwnXVtkYXRhLXNlbGVjdC1vbi1tb3ZlPSdmYWxzZSddICY6OmFmdGVyIHtcblx0XHRjb250ZW50OiAnJztcblx0XHRpbnNldDogdmFyKCAtLXdwLWFkbWluLWJvcmRlci13aWR0aC1mb2N1cyApO1xuXHR9XG5gO1xuXG5leHBvcnQgY29uc3QgVGFiQ2hpbGRyZW4gPSBzdHlsZWQuc3BhbmBcblx0ZmxleC1ncm93OiAxO1xuXG5cdGRpc3BsYXk6IGZsZXg7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cblx0W2FyaWEtb3JpZW50YXRpb249J2hvcml6b250YWwnXSAmIHtcblx0XHRqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblx0fVxuXHRbYXJpYS1vcmllbnRhdGlvbj0ndmVydGljYWwnXSAmIHtcblx0XHRqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xuXHR9XG5gO1xuXG5leHBvcnQgY29uc3QgVGFiQ2hldnJvbiA9IHN0eWxlZCggSWNvbiApYFxuXHRmbGV4LXNocmluazogMDtcblx0bWFyZ2luLWlubGluZS1lbmQ6ICR7IHNwYWNlKCAtMSApIH07XG5cdFthcmlhLW9yaWVudGF0aW9uPSdob3Jpem9udGFsJ10gJiB7XG5cdFx0ZGlzcGxheTogbm9uZTtcblx0fVxuXHRvcGFjaXR5OiAwO1xuXHRbcm9sZT0ndGFiJ106aXMoIFthcmlhLXNlbGVjdGVkPSd0cnVlJ10sIFtkYXRhLWZvY3VzLXZpc2libGVdLCA6aG92ZXIgKSAmIHtcblx0XHRvcGFjaXR5OiAxO1xuXHR9XG5cdC8vIFRoZSBjaGV2cm9uIGlzIHRyYW5zaXRpb25lZCBpbnRvIGV4aXN0ZW5jZSB3aGVuIHNlbGVjdE9uTW92ZSBpcyBlbmFibGVkLFxuXHQvLyBiZWNhdXNlIG90aGVyd2lzZSBpdCBsb29rcyBqYXJyaW5nLCBhcyBpdCBzaG93cyB1cCBvdXRzaWRlIG9mIHRoZSBmb2N1c1xuXHQvLyBpbmRpY2F0b3IgdGhhdCdzIGJlaW5nIGFuaW1hdGVkIGF0IHRoZSBzYW1lIHRpbWUuXG5cdEBtZWRpYSBub3QgKCBwcmVmZXJzLXJlZHVjZWQtbW90aW9uICkge1xuXHRcdFtkYXRhLXNlbGVjdC1vbi1tb3ZlPSd0cnVlJ11cblx0XHRcdFtyb2xlPSd0YWInXTppcyggW2FyaWEtc2VsZWN0ZWQ9J3RydWUnXSwgIClcblx0XHRcdCYge1xuXHRcdFx0dHJhbnNpdGlvbjogb3BhY2l0eSAwLjE1cyAwLjE1cyBsaW5lYXI7XG5cdFx0fVxuXHR9XG5cdCY6ZGlyKCBydGwgKSB7XG5cdFx0cm90YXRlOiAxODBkZWc7XG5cdH1cbmA7XG5cbmV4cG9ydCBjb25zdCBUYWJQYW5lbCA9IHN0eWxlZCggQXJpYWtpdC5UYWJQYW5lbCApYFxuXHQmOmZvY3VzIHtcblx0XHRib3gtc2hhZG93OiBub25lO1xuXHRcdG91dGxpbmU6IG5vbmU7XG5cdH1cblxuXHQmW2RhdGEtZm9jdXMtdmlzaWJsZV0ge1xuXHRcdGJveC1zaGFkb3c6IDAgMCAwIHZhciggLS13cC1hZG1pbi1ib3JkZXItd2lkdGgtZm9jdXMgKVxuXHRcdFx0JHsgQ09MT1JTLnRoZW1lLmFjY2VudCB9O1xuXHRcdC8vIFdpbmRvd3MgaGlnaCBjb250cmFzdCBtb2RlLlxuXHRcdG91dGxpbmU6IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcblx0XHRvdXRsaW5lLW9mZnNldDogMDtcblx0fVxuYDtcbiJdfQ== */"));

//# sourceMappingURL=styles.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/tabs/tab.mjs"
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/tabs/tab.mjs ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tab: () => (/* binding */ Tab)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_warning__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/warning */ "@wordpress/warning");
/* harmony import */ var _context_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./context.mjs */ "./node_modules/@wordpress/components/build-module/tabs/context.mjs");
/* harmony import */ var _styles_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles.mjs */ "./node_modules/@wordpress/components/build-module/tabs/styles.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/chevron-right.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/components/src/tabs/tab.tsx






var Tab = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function Tab2({
  children,
  tabId,
  disabled,
  render,
  ...otherProps
}, ref) {
  const {
    store,
    instanceId
  } = (0,_context_mjs__WEBPACK_IMPORTED_MODULE_2__.useTabsContext)() ?? {};
  if (!store) {
     true ? _wordpress_warning__WEBPACK_IMPORTED_MODULE_1__("`Tabs.Tab` must be wrapped in a `Tabs` component.") : 0;
    return null;
  }
  const instancedTabId = `${instanceId}-${tabId}`;
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_styles_mjs__WEBPACK_IMPORTED_MODULE_3__.Tab, {
    ref,
    store,
    id: instancedTabId,
    disabled,
    render,
    ...otherProps,
    children: [/* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_styles_mjs__WEBPACK_IMPORTED_MODULE_3__.TabChildren, {
      children
    }), /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_styles_mjs__WEBPACK_IMPORTED_MODULE_3__.TabChevron, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"]
    })]
  });
});

//# sourceMappingURL=tab.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/tabs/tablist.mjs"
/*!**************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/tabs/tablist.mjs ***!
  \**************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TabList: () => (/* binding */ TabList)
/* harmony export */ });
/* harmony import */ var _ariakit_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/react */ "./node_modules/@ariakit/react-store/dist/index.js");
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var _wordpress_warning__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/warning */ "@wordpress/warning");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _context_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./context.mjs */ "./node_modules/@wordpress/components/build-module/tabs/context.mjs");
/* harmony import */ var _styles_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./styles.mjs */ "./node_modules/@wordpress/components/build-module/tabs/styles.mjs");
/* harmony import */ var _utils_element_rect_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/element-rect.mjs */ "./node_modules/@wordpress/components/build-module/utils/element-rect.mjs");
/* harmony import */ var _use_track_overflow_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./use-track-overflow.mjs */ "./node_modules/@wordpress/components/build-module/tabs/use-track-overflow.mjs");
/* harmony import */ var _utils_hooks_use_animated_offset_rect_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/hooks/use-animated-offset-rect.mjs */ "./node_modules/@wordpress/components/build-module/utils/hooks/use-animated-offset-rect.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/components/src/tabs/tablist.tsx











var DEFAULT_SCROLL_MARGIN = 24;
function useScrollRectIntoView(parent, rect, {
  margin = DEFAULT_SCROLL_MARGIN
} = {}) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useLayoutEffect)(() => {
    if (!parent || !rect) {
      return;
    }
    const {
      scrollLeft: parentScroll
    } = parent;
    const parentWidth = parent.getBoundingClientRect().width;
    const {
      left: childLeft,
      width: childWidth
    } = rect;
    const parentRightEdge = parentScroll + parentWidth;
    const childRightEdge = childLeft + childWidth;
    const rightOverflow = childRightEdge + margin - parentRightEdge;
    const leftOverflow = parentScroll - (childLeft - margin);
    let scrollLeft = null;
    if (leftOverflow > 0) {
      scrollLeft = parentScroll - leftOverflow;
    } else if (rightOverflow > 0) {
      scrollLeft = parentScroll + rightOverflow;
    }
    if (scrollLeft !== null) {
      parent.scroll?.({
        left: scrollLeft
      });
    }
  }, [margin, parent, rect]);
}
var TabList = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.forwardRef)(function TabList2({
  children,
  ...otherProps
}, ref) {
  const {
    store
  } = (0,_context_mjs__WEBPACK_IMPORTED_MODULE_5__.useTabsContext)() ?? {};
  const selectedId = (0,_ariakit_react__WEBPACK_IMPORTED_MODULE_0__.useStoreState)(store, "selectedId");
  const selectOnMove = (0,_ariakit_react__WEBPACK_IMPORTED_MODULE_0__.useStoreState)(store, "selectOnMove");
  const items = (0,_ariakit_react__WEBPACK_IMPORTED_MODULE_0__.useStoreState)(store, "items");
  const [parent, setParent] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)();
  const refs = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__.useMergeRefs)([ref, setParent]);
  const selectedItem = store?.item(selectedId);
  const renderedItems = (0,_ariakit_react__WEBPACK_IMPORTED_MODULE_0__.useStoreState)(store, "renderedItems");
  const selectedItemIndex = renderedItems && selectedItem ? renderedItems.indexOf(selectedItem) : -1;
  const selectedRect = (0,_utils_element_rect_mjs__WEBPACK_IMPORTED_MODULE_7__.useTrackElementOffsetRect)(selectedItem?.element, [selectedItemIndex]);
  const overflow = (0,_use_track_overflow_mjs__WEBPACK_IMPORTED_MODULE_8__.useTrackOverflow)(parent, {
    first: items?.at(0)?.element,
    last: items?.at(-1)?.element
  });
  (0,_utils_hooks_use_animated_offset_rect_mjs__WEBPACK_IMPORTED_MODULE_9__.useAnimatedOffsetRect)(parent, selectedRect, {
    prefix: "selected",
    dataAttribute: "indicator-animated",
    transitionEndFilter: (event) => event.pseudoElement === "::before",
    roundRect: true
  });
  useScrollRectIntoView(parent, selectedRect);
  if (!store) {
     true ? _wordpress_warning__WEBPACK_IMPORTED_MODULE_2__("`Tabs.TabList` must be wrapped in a `Tabs` component.") : 0;
    return null;
  }
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_styles_mjs__WEBPACK_IMPORTED_MODULE_6__.StyledTabList, {
    ref: refs,
    store,
    render: (props) => /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      ...props,
      // Fallback to -1 to prevent browsers from making the tablist
      // tabbable when it is a scrolling container.
      tabIndex: props.tabIndex ?? -1
    }),
    "data-select-on-move": selectOnMove ? "true" : "false",
    ...otherProps,
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])(overflow.first && "is-overflowing-first", overflow.last && "is-overflowing-last", otherProps.className),
    children
  });
});

//# sourceMappingURL=tablist.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/tabs/tabpanel.mjs"
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/tabs/tabpanel.mjs ***!
  \***************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TabPanel: () => (/* binding */ TabPanel)
/* harmony export */ });
/* harmony import */ var _ariakit_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ariakit/react */ "./node_modules/@ariakit/react-store/dist/index.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _styles_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles.mjs */ "./node_modules/@wordpress/components/build-module/tabs/styles.mjs");
/* harmony import */ var _wordpress_warning__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/warning */ "@wordpress/warning");
/* harmony import */ var _context_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./context.mjs */ "./node_modules/@wordpress/components/build-module/tabs/context.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/components/src/tabs/tabpanel.tsx






var TabPanel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(function TabPanel2({
  children,
  tabId,
  focusable = true,
  ...otherProps
}, ref) {
  const context = (0,_context_mjs__WEBPACK_IMPORTED_MODULE_4__.useTabsContext)();
  const selectedId = (0,_ariakit_react__WEBPACK_IMPORTED_MODULE_0__.useStoreState)(context?.store, "selectedId");
  if (!context) {
     true ? _wordpress_warning__WEBPACK_IMPORTED_MODULE_3__("`Tabs.TabPanel` must be wrapped in a `Tabs` component.") : 0;
    return null;
  }
  const {
    store,
    instanceId
  } = context;
  const instancedTabId = `${instanceId}-${tabId}`;
  return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_styles_mjs__WEBPACK_IMPORTED_MODULE_2__.TabPanel, {
    ref,
    store,
    id: `${instancedTabId}-view`,
    tabId: instancedTabId,
    focusable,
    ...otherProps,
    children: selectedId === instancedTabId && children
  });
});

//# sourceMappingURL=tabpanel.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/tabs/use-track-overflow.mjs"
/*!*************************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/tabs/use-track-overflow.mjs ***!
  \*************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useTrackOverflow: () => (/* binding */ useTrackOverflow)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
// packages/components/src/tabs/use-track-overflow.ts


function useTrackOverflow(parent, children) {
  const [first, setFirst] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [last, setLast] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [observer, setObserver] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const callback = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.useEvent)((entries) => {
    for (const entry of entries) {
      if (entry.target === children.first) {
        setFirst(!entry.isIntersecting);
      }
      if (entry.target === children.last) {
        setLast(!entry.isIntersecting);
      }
    }
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!parent || !window.IntersectionObserver) {
      return;
    }
    const newObserver = new IntersectionObserver(callback, {
      root: parent,
      threshold: 0.9
    });
    setObserver(newObserver);
    return () => newObserver.disconnect();
  }, [callback, parent]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!observer) {
      return;
    }
    if (children.first) {
      observer.observe(children.first);
    }
    if (children.last) {
      observer.observe(children.last);
    }
    return () => {
      if (children.first) {
        observer.unobserve(children.first);
      }
      if (children.last) {
        observer.unobserve(children.last);
      }
    };
  }, [children.first, children.last, observer]);
  return {
    first,
    last
  };
}

//# sourceMappingURL=use-track-overflow.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/utils/colors-values.mjs"
/*!*********************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/utils/colors-values.mjs ***!
  \*********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COLORS: () => (/* binding */ COLORS),
/* harmony export */   "default": () => (/* binding */ colors_values_default)
/* harmony export */ });
// packages/components/src/utils/colors-values.js
var white = "#fff";
var GRAY = {
  900: "#1e1e1e",
  800: "#2f2f2f",
  /** Meets 4.6:1 text contrast against white. */
  700: "#757575",
  /** Meets 3:1 UI or large text contrast against white. */
  600: "#949494",
  400: "#ccc",
  /** Used for most borders. */
  300: "#ddd",
  /** Used sparingly for light borders. */
  200: "#e0e0e0",
  /** Used for light gray backgrounds. */
  100: "#f0f0f0"
};
var ALERT = {
  yellow: "#f0b849",
  red: "#d94f4f",
  green: "#4ab866"
};
var THEME = {
  accent: `var(--wp-components-color-accent, var(--wp-admin-theme-color, #3858e9))`,
  accentDarker10: `var(--wp-components-color-accent-darker-10, var(--wp-admin-theme-color-darker-10, #2145e6))`,
  accentDarker20: `var(--wp-components-color-accent-darker-20, var(--wp-admin-theme-color-darker-20, #183ad6))`,
  /** Used when placing text on the accent color. */
  accentInverted: `var(--wp-components-color-accent-inverted, var(--wpds-color-foreground-interactive-brand-strong, #fff))`,
  background: `var(--wp-components-color-background, var(--wpds-color-background-surface-neutral-strong, #fff))`,
  foreground: `var(--wp-components-color-foreground, var(--wpds-color-foreground-content-neutral, #1e1e1e))`,
  /** Used when placing text on the foreground color. */
  foregroundInverted: `var(--wp-components-color-foreground-inverted, var(--wpds-color-background-surface-neutral, #fcfcfc))`,
  gray: {
    /** @deprecated Use `COLORS.theme.foreground` instead. */
    900: `var(--wp-components-color-foreground, var(--wpds-color-foreground-content-neutral, #1e1e1e))`,
    800: `var(--wp-components-color-gray-800, var(--wpds-color-foreground-content-neutral, #1e1e1e))`,
    700: `var(--wp-components-color-gray-700, var(--wpds-color-foreground-content-neutral-weak, #707070))`,
    600: `var(--wp-components-color-gray-600, var(--wpds-color-stroke-interactive-neutral, #8d8d8d))`,
    400: `var(--wp-components-color-gray-400, var(--wpds-color-stroke-interactive-neutral, #8d8d8d))`,
    300: `var(--wp-components-color-gray-300, var(--wpds-color-stroke-surface-neutral, #dbdbdb))`,
    200: `var(--wp-components-color-gray-200, var(--wpds-color-stroke-surface-neutral, #dbdbdb))`,
    100: `var(--wp-components-color-gray-100, var(--wpds-color-background-surface-neutral, #fcfcfc))`
  }
};
var UI = {
  background: THEME.background,
  backgroundDisabled: THEME.gray[100],
  border: THEME.gray[600],
  borderHover: THEME.gray[700],
  borderFocus: THEME.accent,
  borderDisabled: THEME.gray[400],
  textDisabled: THEME.gray[600],
  // Matches @wordpress/base-styles
  darkGrayPlaceholder: `color-mix(in srgb, ${THEME.foreground}, transparent 38%)`,
  lightGrayPlaceholder: `color-mix(in srgb, ${THEME.background}, transparent 35%)`
};
var COLORS = Object.freeze({
  /**
   * The main gray color object.
   *
   * @deprecated Use semantic aliases in `COLORS.ui` or theme-ready variables in `COLORS.theme.gray`.
   */
  gray: GRAY,
  // TODO: Stop exporting this when everything is migrated to `theme` or `ui`
  /**
   * @deprecated Prefer theme-ready variables in `COLORS.theme`.
   */
  white,
  alert: ALERT,
  /**
   * Theme-ready variables with fallbacks.
   *
   * Prefer semantic aliases in `COLORS.ui` when applicable.
   */
  theme: THEME,
  /**
   * Semantic aliases (prefer these over raw variables when applicable).
   */
  ui: UI
});
var colors_values_default = COLORS;

//# sourceMappingURL=colors-values.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/utils/config-values.mjs"
/*!*********************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/utils/config-values.mjs ***!
  \*********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ config_values_default)
/* harmony export */ });
/* harmony import */ var _colors_values_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colors-values.mjs */ "./node_modules/@wordpress/components/build-module/utils/colors-values.mjs");
// packages/components/src/utils/config-values.js

var CONTROL_HEIGHT = "36px";
var CONTROL_PROPS = {
  // These values should be shared with TextControl.
  controlPaddingX: 12,
  controlPaddingXSmall: 8,
  controlPaddingXLarge: 12 * 1.3334,
  // TODO: Deprecate
  controlBoxShadowFocus: `0 0 0 0.5px ${_colors_values_mjs__WEBPACK_IMPORTED_MODULE_0__.COLORS.theme.accent}`,
  controlHeight: CONTROL_HEIGHT,
  controlHeightXSmall: `calc( ${CONTROL_HEIGHT} * 0.6 )`,
  controlHeightSmall: `calc( ${CONTROL_HEIGHT} * 0.8 )`,
  controlHeightLarge: `calc( ${CONTROL_HEIGHT} * 1.2 )`,
  controlHeightXLarge: `calc( ${CONTROL_HEIGHT} * 1.4 )`
};
var config_values_default = Object.assign({}, CONTROL_PROPS, {
  colorDivider: "rgba(0, 0, 0, 0.1)",
  colorScrollbarThumb: "rgba(0, 0, 0, 0.2)",
  colorScrollbarThumbHover: "rgba(0, 0, 0, 0.5)",
  colorScrollbarTrack: "rgba(0, 0, 0, 0.04)",
  elevationIntensity: 1,
  radiusXSmall: "1px",
  radiusSmall: "2px",
  radiusMedium: "4px",
  radiusLarge: "8px",
  radiusFull: "9999px",
  radiusRound: "50%",
  borderWidth: "1px",
  borderWidthFocus: "1.5px",
  borderWidthTab: "4px",
  spinnerSize: 16,
  fontSize: "13px",
  fontSizeH1: "calc(2.44 * 13px)",
  fontSizeH2: "calc(1.95 * 13px)",
  fontSizeH3: "calc(1.56 * 13px)",
  fontSizeH4: "calc(1.25 * 13px)",
  fontSizeH5: "13px",
  fontSizeH6: "calc(0.8 * 13px)",
  fontSizeInputMobile: "16px",
  fontSizeMobile: "15px",
  fontSizeSmall: "calc(0.92 * 13px)",
  fontSizeXSmall: "calc(0.75 * 13px)",
  fontLineHeightBase: "1.4",
  fontWeight: "normal",
  fontWeightMedium: "499",
  // ensures fallback to 400 (instead of 600)
  fontWeightHeading: "600",
  gridBase: "4px",
  elevationXSmall: `0 1px 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02), 0 3px 3px rgba(0, 0, 0, 0.02), 0 4px 4px rgba(0, 0, 0, 0.01)`,
  elevationSmall: `0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 3px rgba(0, 0, 0, 0.04), 0 6px 6px rgba(0, 0, 0, 0.03), 0 8px 8px rgba(0, 0, 0, 0.02)`,
  elevationMedium: `0 2px 3px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 0.04), 0 12px 12px rgba(0, 0, 0, 0.03), 0 16px 16px rgba(0, 0, 0, 0.02)`,
  elevationLarge: `0 5px 15px rgba(0, 0, 0, 0.08), 0 15px 27px rgba(0, 0, 0, 0.07), 0 30px 36px rgba(0, 0, 0, 0.04), 0 50px 43px rgba(0, 0, 0, 0.02)`,
  surfaceBackgroundColor: _colors_values_mjs__WEBPACK_IMPORTED_MODULE_0__.COLORS.white,
  surfaceBackgroundSubtleColor: "#F3F3F3",
  surfaceBackgroundTintColor: "#F5F5F5",
  surfaceBorderColor: "rgba(0, 0, 0, 0.1)",
  surfaceBorderBoldColor: "rgba(0, 0, 0, 0.15)",
  surfaceBorderSubtleColor: "rgba(0, 0, 0, 0.05)",
  surfaceBackgroundTertiaryColor: _colors_values_mjs__WEBPACK_IMPORTED_MODULE_0__.COLORS.white,
  surfaceColor: _colors_values_mjs__WEBPACK_IMPORTED_MODULE_0__.COLORS.white,
  // Modal exit animation: `use-modal-exit-animation` parses this for the
  // `animationend` timeout race; keep the numeric duration equal to the WPDS
  // `motion-duration-md` token on `.components-modal__frame` in modal/style.scss.
  transitionDuration: "200ms",
  transitionDurationFast: "160ms",
  transitionDurationFaster: "120ms",
  transitionDurationFastest: "100ms",
  transitionTimingFunction: "cubic-bezier(0.08, 0.52, 0.52, 1)",
  transitionTimingFunctionControl: "cubic-bezier(0.12, 0.8, 0.32, 1)"
});

//# sourceMappingURL=config-values.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/utils/element-rect.mjs"
/*!********************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/utils/element-rect.mjs ***!
  \********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NULL_ELEMENT_OFFSET_RECT: () => (/* binding */ NULL_ELEMENT_OFFSET_RECT),
/* harmony export */   getElementOffsetRect: () => (/* binding */ getElementOffsetRect),
/* harmony export */   useTrackElementOffsetRect: () => (/* binding */ useTrackElementOffsetRect)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
// packages/components/src/utils/element-rect.ts


var NULL_ELEMENT_OFFSET_RECT = {
  element: void 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0
};
function getElementOffsetRect(element) {
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return;
  }
  const offsetParent = element.offsetParent;
  const offsetParentRect = offsetParent?.getBoundingClientRect() ?? NULL_ELEMENT_OFFSET_RECT;
  const offsetParentScrollX = offsetParent?.scrollLeft ?? 0;
  const offsetParentScrollY = offsetParent?.scrollTop ?? 0;
  const computedWidth = parseFloat(getComputedStyle(element).width);
  const computedHeight = parseFloat(getComputedStyle(element).height);
  const scaleX = computedWidth / rect.width;
  const scaleY = computedHeight / rect.height;
  return {
    element,
    // To obtain the adjusted values for the position:
    // 1. Compute the element's position relative to the offset parent.
    // 2. Correct for the scale factor.
    // 3. Adjust for the scroll position of the offset parent.
    top: (rect.top - offsetParentRect?.top) * scaleY + offsetParentScrollY,
    right: (offsetParentRect?.right - rect.right) * scaleX - offsetParentScrollX,
    bottom: (offsetParentRect?.bottom - rect.bottom) * scaleY - offsetParentScrollY,
    left: (rect.left - offsetParentRect?.left) * scaleX + offsetParentScrollX,
    // Computed dimensions don't need any adjustments.
    width: computedWidth,
    height: computedHeight
  };
}
var POLL_RATE = 100;
function useTrackElementOffsetRect(targetElement, deps = []) {
  const [indicatorPosition, setIndicatorPosition] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(NULL_ELEMENT_OFFSET_RECT);
  const intervalRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(void 0);
  const measure = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.useEvent)(() => {
    if (targetElement && targetElement.isConnected) {
      const elementOffsetRect = getElementOffsetRect(targetElement);
      if (elementOffsetRect) {
        setIndicatorPosition(elementOffsetRect);
        clearInterval(intervalRef.current);
        return true;
      }
    } else {
      clearInterval(intervalRef.current);
    }
    return false;
  });
  const setElement = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.useResizeObserver)(() => {
    if (!measure()) {
      requestAnimationFrame(() => {
        if (!measure()) {
          intervalRef.current = setInterval(measure, POLL_RATE);
        }
      });
    }
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    setElement(targetElement);
    if (!targetElement) {
      setIndicatorPosition(NULL_ELEMENT_OFFSET_RECT);
    }
  }, [setElement, targetElement]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    measure();
  }, deps);
  return indicatorPosition;
}

//# sourceMappingURL=element-rect.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/utils/font-values.mjs"
/*!*******************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/utils/font-values.mjs ***!
  \*******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ font_values_default)
/* harmony export */ });
// packages/components/src/utils/font-values.js
var font_values_default = {
  "default.fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
  "default.fontSize": "13px",
  "helpText.fontSize": "12px",
  mobileTextMinFontSize: "16px"
};

//# sourceMappingURL=font-values.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/utils/font.mjs"
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/utils/font.mjs ***!
  \************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   font: () => (/* binding */ font)
/* harmony export */ });
/* harmony import */ var _font_values_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./font-values.mjs */ "./node_modules/@wordpress/components/build-module/utils/font-values.mjs");
// packages/components/src/utils/font.js

function font(value) {
  return _font_values_mjs__WEBPACK_IMPORTED_MODULE_0__["default"][value] ?? "";
}

//# sourceMappingURL=font.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/utils/hooks/use-animated-offset-rect.mjs"
/*!**************************************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/utils/hooks/use-animated-offset-rect.mjs ***!
  \**************************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useAnimatedOffsetRect: () => (/* binding */ useAnimatedOffsetRect)
/* harmony export */ });
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _use_on_value_update_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./use-on-value-update.mjs */ "./node_modules/@wordpress/components/build-module/utils/hooks/use-on-value-update.mjs");
// packages/components/src/utils/hooks/use-animated-offset-rect.ts



function useAnimatedOffsetRect(container, rect, {
  prefix = "subelement",
  dataAttribute = `${prefix}-animated`,
  transitionEndFilter = () => true,
  roundRect = false
} = {}) {
  const setProperties = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_0__.useEvent)(() => {
    Object.keys(rect).forEach((property) => property !== "element" && container?.style.setProperty(`--${prefix}-${property}`, String(roundRect ? Math.floor(rect[property]) : rect[property])));
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(() => {
    setProperties();
  }, [rect, setProperties]);
  (0,_use_on_value_update_mjs__WEBPACK_IMPORTED_MODULE_2__.useOnValueUpdate)(rect.element, ({
    previousValue
  }) => {
    if (rect.element && previousValue) {
      container?.setAttribute(`data-${dataAttribute}`, "");
    }
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(() => {
    function onTransitionEnd(event) {
      if (transitionEndFilter(event)) {
        container?.removeAttribute(`data-${dataAttribute}`);
      }
    }
    container?.addEventListener("transitionend", onTransitionEnd);
    return () => container?.removeEventListener("transitionend", onTransitionEnd);
  }, [dataAttribute, container, transitionEndFilter]);
}

//# sourceMappingURL=use-animated-offset-rect.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/utils/hooks/use-on-value-update.mjs"
/*!*********************************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/utils/hooks/use-on-value-update.mjs ***!
  \*********************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useOnValueUpdate: () => (/* binding */ useOnValueUpdate)
/* harmony export */ });
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
// packages/components/src/utils/hooks/use-on-value-update.ts


function useOnValueUpdate(value, onUpdate) {
  const previousValueRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)(value);
  const updateCallbackEvent = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_0__.useEvent)(onUpdate);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(() => {
    if (previousValueRef.current !== value) {
      updateCallbackEvent({
        previousValue: previousValueRef.current
      });
      previousValueRef.current = value;
    }
  }, [updateCallbackEvent, value]);
}

//# sourceMappingURL=use-on-value-update.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/components/build-module/utils/space.mjs"
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/components/build-module/utils/space.mjs ***!
  \*************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   space: () => (/* binding */ space)
/* harmony export */ });
// packages/components/src/utils/space.ts
var GRID_BASE = "4px";
function space(value) {
  if (typeof value === "undefined") {
    return void 0;
  }
  if (!value) {
    return "0";
  }
  const asInt = typeof value === "number" ? value : Number(value);
  if (typeof window !== "undefined" && window.CSS?.supports?.("margin", value.toString()) || Number.isNaN(asInt)) {
    return value.toString();
  }
  return `calc(${GRID_BASE} * ${value})`;
}

//# sourceMappingURL=space.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/icon/index.mjs"
/*!*******************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/icon/index.mjs ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ icon_default)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
// packages/icons/src/icon/index.ts

var icon_default = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
  ({ icon, size = 24, ...props }, ref) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(icon, {
      width: size,
      height: size,
      ...props,
      ref
    });
  }
);

//# sourceMappingURL=index.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/chevron-right.mjs"
/*!******************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/chevron-right.mjs ***!
  \******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ chevron_right_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/chevron-right.tsx


var chevron_right_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M10.6 6L9.4 7l4.6 5-4.6 5 1.2 1 5.4-6z" }) });

//# sourceMappingURL=chevron-right.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/cog.mjs"
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/cog.mjs ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ cog_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/cog.tsx


var cog_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { fillRule: "evenodd", clipRule: "evenodd", d: "M10.289 4.836A1 1 0 0111.275 4h1.306a1 1 0 01.987.836l.244 1.466c.787.26 1.503.679 2.108 1.218l1.393-.522a1 1 0 011.216.437l.653 1.13a1 1 0 01-.23 1.273l-1.148.944a6.025 6.025 0 010 2.435l1.149.946a1 1 0 01.23 1.272l-.653 1.13a1 1 0 01-1.216.437l-1.394-.522c-.605.54-1.32.958-2.108 1.218l-.244 1.466a1 1 0 01-.987.836h-1.306a1 1 0 01-.986-.836l-.244-1.466a5.995 5.995 0 01-2.108-1.218l-1.394.522a1 1 0 01-1.217-.436l-.653-1.131a1 1 0 01.23-1.272l1.149-.946a6.026 6.026 0 010-2.435l-1.148-.944a1 1 0 01-.23-1.272l.653-1.131a1 1 0 011.217-.437l1.393.522a5.994 5.994 0 012.108-1.218l.244-1.466zM14.929 12a3 3 0 11-6 0 3 3 0 016 0z" }) });

//# sourceMappingURL=cog.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/navigation-overlay.mjs"
/*!***********************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/navigation-overlay.mjs ***!
  \***********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ navigation_overlay_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/navigation-overlay.tsx


var navigation_overlay_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M18.5 10a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5v-7a1.5 1.5 0 0 1 1.5-1.5zM16 4a2 2 0 0 1 2 2v2h-1.5V6a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0-.5.5v3H8v1.5H5.5V16a.5.5 0 0 0 .5.5h2V18H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" }) });

//# sourceMappingURL=navigation-overlay.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/styles.mjs"
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/styles.mjs ***!
  \***********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ styles_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/styles.tsx


var styles_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { fillRule: "evenodd", clipRule: "evenodd", d: "M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 0 1-6.5 6.5v-13a6.5 6.5 0 0 1 6.5 6.5Z" }) });

//# sourceMappingURL=styles.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/ui/build-module/stack/stack.mjs"
/*!*****************************************************************!*\
  !*** ./node_modules/@wordpress/ui/build-module/stack/stack.mjs ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Stack: () => (/* binding */ Stack)
/* harmony export */ });
/* harmony import */ var _base_ui_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @base-ui/react */ "./node_modules/@base-ui/react/use-render/useRender.mjs");
/* harmony import */ var _base_ui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @base-ui/react */ "./node_modules/@base-ui/react/merge-props/mergeProps.mjs");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
// packages/ui/src/stack/stack.tsx



// packages/style-runtime/src/index.ts
var STYLE_HASH_ATTRIBUTE = "data-wp-hash";
function getRuntime() {
  const globalScope = globalThis;
  if (globalScope.__wpStyleRuntime) {
    return globalScope.__wpStyleRuntime;
  }
  globalScope.__wpStyleRuntime = {
    documents: /* @__PURE__ */ new Map(),
    styles: /* @__PURE__ */ new Map(),
    injectedStyles: /* @__PURE__ */ new WeakMap()
  };
  if (typeof document !== "undefined") {
    registerDocument(document);
  }
  return globalScope.__wpStyleRuntime;
}
function documentContainsStyleHash(targetDocument, hash) {
  if (!targetDocument.head) {
    return false;
  }
  for (const style of targetDocument.head.querySelectorAll(
    `style[${STYLE_HASH_ATTRIBUTE}]`
  )) {
    if (style.getAttribute(STYLE_HASH_ATTRIBUTE) === hash) {
      return true;
    }
  }
  return false;
}
function injectStyle(targetDocument, hash, css) {
  if (!targetDocument.head) {
    return;
  }
  const runtime = getRuntime();
  let injectedStyles = runtime.injectedStyles.get(targetDocument);
  if (!injectedStyles) {
    injectedStyles = /* @__PURE__ */ new Set();
    runtime.injectedStyles.set(targetDocument, injectedStyles);
  }
  if (injectedStyles.has(hash)) {
    return;
  }
  if (documentContainsStyleHash(targetDocument, hash)) {
    injectedStyles.add(hash);
    return;
  }
  const style = targetDocument.createElement("style");
  style.setAttribute(STYLE_HASH_ATTRIBUTE, hash);
  style.appendChild(targetDocument.createTextNode(css));
  targetDocument.head.appendChild(style);
  injectedStyles.add(hash);
}
function registerDocument(targetDocument) {
  const runtime = getRuntime();
  runtime.documents.set(
    targetDocument,
    (runtime.documents.get(targetDocument) ?? 0) + 1
  );
  for (const [hash, css] of runtime.styles) {
    injectStyle(targetDocument, hash, css);
  }
  return () => {
    const count = runtime.documents.get(targetDocument);
    if (count === void 0) {
      return;
    }
    if (count <= 1) {
      runtime.documents.delete(targetDocument);
      return;
    }
    runtime.documents.set(targetDocument, count - 1);
  };
}
function registerStyle(hash, css) {
  const runtime = getRuntime();
  runtime.styles.set(hash, css);
  for (const targetDocument of runtime.documents.keys()) {
    injectStyle(targetDocument, hash, css);
  }
}

// packages/ui/src/stack/style.module.css
if (typeof process === "undefined" || "development" !== "test") {
  registerStyle("32aba35fe1", "@layer wp-ui{@layer utilities, components, compositions, overrides;@layer components{._19ce0419607e1896__stack{display:flex}}}");
}
var style_default = { "stack": "_19ce0419607e1896__stack" };

// packages/ui/src/stack/stack.tsx
var gapTokens = {
  xs: "var(--wpds-dimension-gap-xs, 4px)",
  sm: "var(--wpds-dimension-gap-sm, 8px)",
  md: "var(--wpds-dimension-gap-md, 12px)",
  lg: "var(--wpds-dimension-gap-lg, 16px)",
  xl: "var(--wpds-dimension-gap-xl, 24px)",
  "2xl": "var(--wpds-dimension-gap-2xl, 32px)",
  "3xl": "var(--wpds-dimension-gap-3xl, 40px)"
};
var Stack = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(function Stack2({ direction, gap, align, justify, wrap, render, ...props }, ref) {
  const style = {
    gap: gap && gapTokens[gap],
    alignItems: align,
    justifyContent: justify,
    flexDirection: direction,
    flexWrap: wrap
  };
  const element = (0,_base_ui_react__WEBPACK_IMPORTED_MODULE_0__.useRender)({
    render,
    ref,
    props: (0,_base_ui_react__WEBPACK_IMPORTED_MODULE_1__.mergeProps)(props, { style, className: style_default.stack })
  });
  return element;
});

//# sourceMappingURL=stack.mjs.map


/***/ },

/***/ "./node_modules/clsx/dist/clsx.mjs"
/*!*****************************************!*\
  !*** ./node_modules/clsx/dist/clsx.mjs ***!
  \*****************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clsx: () => (/* binding */ clsx),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (clsx);

/***/ },

/***/ "./node_modules/stylis/src/Enum.js"
/*!*****************************************!*\
  !*** ./node_modules/stylis/src/Enum.js ***!
  \*****************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHARSET: () => (/* binding */ CHARSET),
/* harmony export */   COMMENT: () => (/* binding */ COMMENT),
/* harmony export */   COUNTER_STYLE: () => (/* binding */ COUNTER_STYLE),
/* harmony export */   DECLARATION: () => (/* binding */ DECLARATION),
/* harmony export */   DOCUMENT: () => (/* binding */ DOCUMENT),
/* harmony export */   FONT_FACE: () => (/* binding */ FONT_FACE),
/* harmony export */   FONT_FEATURE_VALUES: () => (/* binding */ FONT_FEATURE_VALUES),
/* harmony export */   IMPORT: () => (/* binding */ IMPORT),
/* harmony export */   KEYFRAMES: () => (/* binding */ KEYFRAMES),
/* harmony export */   LAYER: () => (/* binding */ LAYER),
/* harmony export */   MEDIA: () => (/* binding */ MEDIA),
/* harmony export */   MOZ: () => (/* binding */ MOZ),
/* harmony export */   MS: () => (/* binding */ MS),
/* harmony export */   NAMESPACE: () => (/* binding */ NAMESPACE),
/* harmony export */   PAGE: () => (/* binding */ PAGE),
/* harmony export */   RULESET: () => (/* binding */ RULESET),
/* harmony export */   SUPPORTS: () => (/* binding */ SUPPORTS),
/* harmony export */   VIEWPORT: () => (/* binding */ VIEWPORT),
/* harmony export */   WEBKIT: () => (/* binding */ WEBKIT)
/* harmony export */ });
var MS = '-ms-'
var MOZ = '-moz-'
var WEBKIT = '-webkit-'

var COMMENT = 'comm'
var RULESET = 'rule'
var DECLARATION = 'decl'

var PAGE = '@page'
var MEDIA = '@media'
var IMPORT = '@import'
var CHARSET = '@charset'
var VIEWPORT = '@viewport'
var SUPPORTS = '@supports'
var DOCUMENT = '@document'
var NAMESPACE = '@namespace'
var KEYFRAMES = '@keyframes'
var FONT_FACE = '@font-face'
var COUNTER_STYLE = '@counter-style'
var FONT_FEATURE_VALUES = '@font-feature-values'
var LAYER = '@layer'


/***/ },

/***/ "./node_modules/stylis/src/Middleware.js"
/*!***********************************************!*\
  !*** ./node_modules/stylis/src/Middleware.js ***!
  \***********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   middleware: () => (/* binding */ middleware),
/* harmony export */   namespace: () => (/* binding */ namespace),
/* harmony export */   prefixer: () => (/* binding */ prefixer),
/* harmony export */   rulesheet: () => (/* binding */ rulesheet)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Tokenizer.js */ "./node_modules/stylis/src/Tokenizer.js");
/* harmony import */ var _Serializer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Serializer.js */ "./node_modules/stylis/src/Serializer.js");
/* harmony import */ var _Prefixer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Prefixer.js */ "./node_modules/stylis/src/Prefixer.js");






/**
 * @param {function[]} collection
 * @return {function}
 */
function middleware (collection) {
	var length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(collection)

	return function (element, index, children, callback) {
		var output = ''

		for (var i = 0; i < length; i++)
			output += collection[i](element, index, children, callback) || ''

		return output
	}
}

/**
 * @param {function} callback
 * @return {function}
 */
function rulesheet (callback) {
	return function (element) {
		if (!element.root)
			if (element = element.return)
				callback(element)
	}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 */
function prefixer (element, index, children, callback) {
	if (element.length > -1)
		if (!element.return)
			switch (element.type) {
				case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.DECLARATION: element.return = (0,_Prefixer_js__WEBPACK_IMPORTED_MODULE_4__.prefix)(element.value, element.length, children)
					return
				case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.KEYFRAMES:
					return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.copy)(element, {value: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(element.value, '@', '@' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT)})], callback)
				case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.RULESET:
					if (element.length)
						return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.combine)(element.props, function (value) {
							switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(value, /(::plac\w+|:read-\w+)/)) {
								// :read-(only|write)
								case ':read-only': case ':read-write':
									return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /:(read-\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MOZ + '$1')]})], callback)
								// :placeholder
								case '::placeholder':
									return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /:(plac\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + 'input-$1')]}),
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /:(plac\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MOZ + '$1')]}),
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /:(plac\w+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'input-$1')]})
									], callback)
							}

							return ''
						})
			}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 */
function namespace (element) {
	switch (element.type) {
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.RULESET:
			element.props = element.props.map(function (value) {
				return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.combine)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.tokenize)(value), function (value, index, children) {
					switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, 0)) {
						// \f
						case 12:
							return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 1, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(value))
						// \0 ( + > ~
						case 0: case 40: case 43: case 62: case 126:
							return value
						// :
						case 58:
							if (children[++index] === 'global')
								children[index] = '', children[++index] = '\f' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(children[index], index = 1, -1)
						// \s
						case 32:
							return index === 1 ? '' : value
						default:
							switch (index) {
								case 0: element = value
									return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(children) > 1 ? '' : value
								case index = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(children) - 1: case 2:
									return index === 2 ? value + element + element : value + element
								default:
									return value
							}
					}
				})
			})
	}
}


/***/ },

/***/ "./node_modules/stylis/src/Parser.js"
/*!*******************************************!*\
  !*** ./node_modules/stylis/src/Parser.js ***!
  \*******************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   comment: () => (/* binding */ comment),
/* harmony export */   compile: () => (/* binding */ compile),
/* harmony export */   declaration: () => (/* binding */ declaration),
/* harmony export */   parse: () => (/* binding */ parse),
/* harmony export */   ruleset: () => (/* binding */ ruleset)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Tokenizer.js */ "./node_modules/stylis/src/Tokenizer.js");




/**
 * @param {string} value
 * @return {object[]}
 */
function compile (value) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.dealloc)(parse('', null, null, null, [''], value = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.alloc)(value), 0, [0], value))
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {string[]} rule
 * @param {string[]} rules
 * @param {string[]} rulesets
 * @param {number[]} pseudo
 * @param {number[]} points
 * @param {string[]} declarations
 * @return {object}
 */
function parse (value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0
	var offset = 0
	var length = pseudo
	var atrule = 0
	var property = 0
	var previous = 0
	var variable = 1
	var scanning = 1
	var ampersand = 1
	var character = 0
	var type = ''
	var props = rules
	var children = rulesets
	var reference = rule
	var characters = type

	while (scanning)
		switch (previous = character, character = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.next)()) {
			// (
			case 40:
				if (previous != 108 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(characters, length - 1) == 58) {
					if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.indexof)(characters += (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.delimit)(character), '&', '&\f'), '&\f') != -1)
						ampersand = -1
					break
				}
			// " ' [
			case 34: case 39: case 91:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.delimit)(character)
				break
			// \t \n \r \s
			case 9: case 10: case 13: case 32:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.whitespace)(previous)
				break
			// \
			case 92:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.escaping)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.caret)() - 1, 7)
				continue
			// /
			case 47:
				switch ((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.peek)()) {
					case 42: case 47:
						;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(comment((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.commenter)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.next)(), (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.caret)()), root, parent), declarations)
						break
					default:
						characters += '/'
				}
				break
			// {
			case 123 * variable:
				points[index++] = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) * ampersand
			// } ; \0
			case 125 * variable: case 59: case 0:
				switch (character) {
					// \0 }
					case 0: case 125: scanning = 0
					// ;
					case 59 + offset: if (ampersand == -1) characters = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(characters, /\f/g, '')
						if (property > 0 && ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) - length))
							(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(property > 32 ? declaration(characters + ';', rule, parent, length - 1) : declaration((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(characters, ' ', '') + ';', rule, parent, length - 2), declarations)
						break
					// @ ;
					case 59: characters += ';'
					// { rule/at-rule
					default:
						;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length), rulesets)

						if (character === 123)
							if (offset === 0)
								parse(characters, root, reference, reference, props, rulesets, length, points, children)
							else
								switch (atrule === 99 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(characters, 3) === 110 ? 100 : atrule) {
									// d l m s
									case 100: case 108: case 109: case 115:
										parse(value, reference, reference, rule && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length), children), rules, children, length, points, rule ? props : children)
										break
									default:
										parse(characters, reference, reference, reference, [''], children, 0, points, children)
								}
				}

				index = offset = property = 0, variable = ampersand = 1, type = characters = '', length = pseudo
				break
			// :
			case 58:
				length = 1 + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters), property = previous
			default:
				if (variable < 1)
					if (character == 123)
						--variable
					else if (character == 125 && variable++ == 0 && (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.prev)() == 125)
						continue

				switch (characters += (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.from)(character), character * variable) {
					// &
					case 38:
						ampersand = offset > 0 ? 1 : (characters += '\f', -1)
						break
					// ,
					case 44:
						points[index++] = ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) - 1) * ampersand, ampersand = 1
						break
					// @
					case 64:
						// -
						if ((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.peek)() === 45)
							characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.delimit)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.next)())

						atrule = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.peek)(), offset = length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(type = characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.identifier)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.caret)())), character++
						break
					// -
					case 45:
						if (previous === 45 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) == 2)
							variable = 0
				}
		}

	return rulesets
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} index
 * @param {number} offset
 * @param {string[]} rules
 * @param {number[]} points
 * @param {string} type
 * @param {string[]} props
 * @param {string[]} children
 * @param {number} length
 * @return {object}
 */
function ruleset (value, root, parent, index, offset, rules, points, type, props, children, length) {
	var post = offset - 1
	var rule = offset === 0 ? rules : ['']
	var size = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(rule)

	for (var i = 0, j = 0, k = 0; i < index; ++i)
		for (var x = 0, y = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, post + 1, post = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.abs)(j = points[i])), z = value; x < size; ++x)
			if (z = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.trim)(j > 0 ? rule[x] + ' ' + y : (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(y, /&\f/g, rule[x])))
				props[k++] = z

	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.node)(value, root, parent, offset === 0 ? _Enum_js__WEBPACK_IMPORTED_MODULE_0__.RULESET : type, props, children, length)
}

/**
 * @param {number} value
 * @param {object} root
 * @param {object?} parent
 * @return {object}
 */
function comment (value, root, parent) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.node)(value, root, parent, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.COMMENT, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.from)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.char)()), (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 2, -2), 0)
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} length
 * @return {object}
 */
function declaration (value, root, parent, length) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_2__.node)(value, root, parent, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.DECLARATION, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 0, length), (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, length + 1, -1), length)
}


/***/ },

/***/ "./node_modules/stylis/src/Prefixer.js"
/*!*********************************************!*\
  !*** ./node_modules/stylis/src/Prefixer.js ***!
  \*********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");



/**
 * @param {string} value
 * @param {number} length
 * @param {object[]} children
 * @return {string}
 */
function prefix (value, length, children) {
	switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.hash)(value, length)) {
		// color-adjust
		case 5103:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + 'print-' + value + value
		// animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
		case 5737: case 4201: case 3177: case 3433: case 1641: case 4457: case 2921:
		// text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
		case 5572: case 6356: case 5844: case 3191: case 6645: case 3005:
		// mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
		case 6391: case 5879: case 5623: case 6135: case 4599: case 4855:
		// background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
		case 4215: case 6389: case 5109: case 5365: case 5621: case 3829:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + value
		// tab-size
		case 4789:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MOZ + value + value
		// appearance, user-select, transform, hyphens, text-size-adjust
		case 5349: case 4246: case 4810: case 6968: case 2756:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MOZ + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + value + value
		// writing-mode
		case 5936:
			switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, length + 11)) {
				// vertical-l(r)
				case 114:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb') + value
				// vertical-r(l)
				case 108:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value
				// horizontal(-)tb
				case 45:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /[svh]\w+-[tblr]{2}/, 'lr') + value
				// default: fallthrough to below
			}
		// flex, flex-direction, scroll-snap-type, writing-mode
		case 6828: case 4268: case 2903:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + value + value
		// order
		case 6165:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'flex-' + value + value
		// align-items
		case 5187:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(\w+).+(:[^]+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + 'box-$1$2' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'flex-$1$2') + value
		// align-self
		case 5443:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'flex-item-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /flex-|-self/g, '') + (!(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(value, /flex-|baseline/) ? _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'grid-row-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /flex-|-self/g, '') : '') + value
		// align-content
		case 4675:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'flex-line-pack' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /align-content|flex-|-self/g, '') + value
		// flex-shrink
		case 5548:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, 'shrink', 'negative') + value
		// flex-basis
		case 5292:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, 'basis', 'preferred-size') + value
		// flex-grow
		case 6060:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + 'box-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, '-grow', '') + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, 'grow', 'positive') + value
		// transition
		case 4554:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /([^-])(transform)/g, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$2') + value
		// cursor
		case 6187:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(zoom-|grab)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$1'), /(image-set)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$1'), value, '') + value
		// background, background-image
		case 5495: case 3959:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(image-set\([^]*)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$1' + '$`$1')
		// justify-content
		case 4968:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(.+:)(flex-)?(.*)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + 'box-pack:$3' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + value + value
		// justify-self
		case 4200:
			if (!(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(value, /flex-|baseline/)) return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'grid-column-align' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, length) + value
			break
		// grid-template-(columns|rows)
		case 2592: case 3360:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, 'template-', '') + value
		// grid-(row|column)-start
		case 4384: case 3616:
			if (children && children.some(function (element, index) { return length = index, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(element.props, /grid-\w+-end/) })) {
				return ~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.indexof)(value + (children = children[length].value), 'span') ? value : (_Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, '-start', '') + value + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + 'grid-row-span:' + (~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.indexof)(children, 'span') ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(children, /\d+/) : +(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(children, /\d+/) - +(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(value, /\d+/)) + ';')
			}
			return _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, '-start', '') + value
		// grid-(row|column)-end
		case 4896: case 4128:
			return (children && children.some(function (element) { return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.match)(element.props, /grid-\w+-start/) })) ? value : _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, '-end', '-span'), 'span ', '') + value
		// (margin|padding)-inline-(start|end)
		case 4095: case 3583: case 4068: case 2532:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(.+)-inline(.+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$1$2') + value
		// (min|max)?(width|height|inline-size|block-size)
		case 8116: case 7059: case 5753: case 5535:
		case 5445: case 5701: case 4933: case 4677:
		case 5533: case 5789: case 5021: case 4765:
			// stretch, max-content, min-content, fill-available
			if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(value) - 1 - length > 6)
				switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, length + 1)) {
					// (m)ax-content, (m)in-content
					case 109:
						// -
						if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, length + 4) !== 45)
							break
					// (f)ill-available, (f)it-content
					case 102:
						return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(.+:)(.+)-([^]+)/, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$2-$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MOZ + ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, length + 3) == 108 ? '$3' : '$2-$3')) + value
					// (s)tretch
					case 115:
						return ~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.indexof)(value, 'stretch') ? prefix((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, 'stretch', 'fill-available'), length, children) + value : value
				}
			break
		// grid-(column|row)
		case 5152: case 5920:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function (_, a, b, c, d, e, f) { return (_Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + a + ':' + b + f) + (c ? (_Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + a + '-span:' + (d ? e : +e - +b)) + f : '') + value })
		// position: sticky
		case 4949:
			// stick(y)?
			if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, length + 6) === 121)
				return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, ':', ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT) + value
			break
		// display: (flex|inline-flex|grid|inline-grid)
		case 6444:
			switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, 14) === 45 ? 18 : 11)) {
				// (inline-)?fle(x)
				case 120:
					return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.WEBKIT + '$2$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS + '$2box$3') + value
				// (inline-)?gri(d)
				case 100:
					return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, ':', ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_0__.MS) + value
			}
			break
		// scroll-margin, scroll-margin-(top|right|bottom|left)
		case 5719: case 2647: case 2135: case 3927: case 2391:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(value, 'scroll-', 'scroll-snap-') + value
	}

	return value
}


/***/ },

/***/ "./node_modules/stylis/src/Serializer.js"
/*!***********************************************!*\
  !*** ./node_modules/stylis/src/Serializer.js ***!
  \***********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   serialize: () => (/* binding */ serialize),
/* harmony export */   stringify: () => (/* binding */ stringify)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");



/**
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function serialize (children, callback) {
	var output = ''
	var length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(children)

	for (var i = 0; i < length; i++)
		output += callback(children[i], i, children, callback) || ''

	return output
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function stringify (element, index, children, callback) {
	switch (element.type) {
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.LAYER: if (element.children.length) break
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.IMPORT: case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.DECLARATION: return element.return = element.return || element.value
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.COMMENT: return ''
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.KEYFRAMES: return element.return = element.value + '{' + serialize(element.children, callback) + '}'
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.RULESET: element.value = element.props.join(',')
	}

	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(children = serialize(element.children, callback)) ? element.return = element.value + '{' + children + '}' : ''
}


/***/ },

/***/ "./node_modules/stylis/src/Tokenizer.js"
/*!**********************************************!*\
  !*** ./node_modules/stylis/src/Tokenizer.js ***!
  \**********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alloc: () => (/* binding */ alloc),
/* harmony export */   caret: () => (/* binding */ caret),
/* harmony export */   char: () => (/* binding */ char),
/* harmony export */   character: () => (/* binding */ character),
/* harmony export */   characters: () => (/* binding */ characters),
/* harmony export */   column: () => (/* binding */ column),
/* harmony export */   commenter: () => (/* binding */ commenter),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   dealloc: () => (/* binding */ dealloc),
/* harmony export */   delimit: () => (/* binding */ delimit),
/* harmony export */   delimiter: () => (/* binding */ delimiter),
/* harmony export */   escaping: () => (/* binding */ escaping),
/* harmony export */   identifier: () => (/* binding */ identifier),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   line: () => (/* binding */ line),
/* harmony export */   next: () => (/* binding */ next),
/* harmony export */   node: () => (/* binding */ node),
/* harmony export */   peek: () => (/* binding */ peek),
/* harmony export */   position: () => (/* binding */ position),
/* harmony export */   prev: () => (/* binding */ prev),
/* harmony export */   slice: () => (/* binding */ slice),
/* harmony export */   token: () => (/* binding */ token),
/* harmony export */   tokenize: () => (/* binding */ tokenize),
/* harmony export */   tokenizer: () => (/* binding */ tokenizer),
/* harmony export */   whitespace: () => (/* binding */ whitespace)
/* harmony export */ });
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");


var line = 1
var column = 1
var length = 0
var position = 0
var character = 0
var characters = ''

/**
 * @param {string} value
 * @param {object | null} root
 * @param {object | null} parent
 * @param {string} type
 * @param {string[] | string} props
 * @param {object[] | string} children
 * @param {number} length
 */
function node (value, root, parent, type, props, children, length) {
	return {value: value, root: root, parent: parent, type: type, props: props, children: children, line: line, column: column, length: length, return: ''}
}

/**
 * @param {object} root
 * @param {object} props
 * @return {object}
 */
function copy (root, props) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.assign)(node('', null, null, '', null, null, 0), root, {length: -root.length}, props)
}

/**
 * @return {number}
 */
function char () {
	return character
}

/**
 * @return {number}
 */
function prev () {
	character = position > 0 ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, --position) : 0

	if (column--, character === 10)
		column = 1, line--

	return character
}

/**
 * @return {number}
 */
function next () {
	character = position < length ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, position++) : 0

	if (column++, character === 10)
		column = 1, line++

	return character
}

/**
 * @return {number}
 */
function peek () {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, position)
}

/**
 * @return {number}
 */
function caret () {
	return position
}

/**
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function slice (begin, end) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(characters, begin, end)
}

/**
 * @param {number} type
 * @return {number}
 */
function token (type) {
	switch (type) {
		// \0 \t \n \r \s whitespace token
		case 0: case 9: case 10: case 13: case 32:
			return 5
		// ! + , / > @ ~ isolate token
		case 33: case 43: case 44: case 47: case 62: case 64: case 126:
		// ; { } breakpoint token
		case 59: case 123: case 125:
			return 4
		// : accompanied token
		case 58:
			return 3
		// " ' ( [ opening delimit token
		case 34: case 39: case 40: case 91:
			return 2
		// ) ] closing delimit token
		case 41: case 93:
			return 1
	}

	return 0
}

/**
 * @param {string} value
 * @return {any[]}
 */
function alloc (value) {
	return line = column = 1, length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(characters = value), position = 0, []
}

/**
 * @param {any} value
 * @return {any}
 */
function dealloc (value) {
	return characters = '', value
}

/**
 * @param {number} type
 * @return {string}
 */
function delimit (type) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.trim)(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)))
}

/**
 * @param {string} value
 * @return {string[]}
 */
function tokenize (value) {
	return dealloc(tokenizer(alloc(value)))
}

/**
 * @param {number} type
 * @return {string}
 */
function whitespace (type) {
	while (character = peek())
		if (character < 33)
			next()
		else
			break

	return token(type) > 2 || token(character) > 3 ? '' : ' '
}

/**
 * @param {string[]} children
 * @return {string[]}
 */
function tokenizer (children) {
	while (next())
		switch (token(character)) {
			case 0: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(identifier(position - 1), children)
				break
			case 2: ;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(delimit(character), children)
				break
			default: ;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.from)(character), children)
		}

	return children
}

/**
 * @param {number} index
 * @param {number} count
 * @return {string}
 */
function escaping (index, count) {
	while (--count && next())
		// not 0-9 A-F a-f
		if (character < 48 || character > 102 || (character > 57 && character < 65) || (character > 70 && character < 97))
			break

	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32))
}

/**
 * @param {number} type
 * @return {number}
 */
function delimiter (type) {
	while (next())
		switch (character) {
			// ] ) " '
			case type:
				return position
			// " '
			case 34: case 39:
				if (type !== 34 && type !== 39)
					delimiter(character)
				break
			// (
			case 40:
				if (type === 41)
					delimiter(type)
				break
			// \
			case 92:
				next()
				break
		}

	return position
}

/**
 * @param {number} type
 * @param {number} index
 * @return {number}
 */
function commenter (type, index) {
	while (next())
		// //
		if (type + character === 47 + 10)
			break
		// /*
		else if (type + character === 42 + 42 && peek() === 47)
			break

	return '/*' + slice(index, position - 1) + '*' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.from)(type === 47 ? type : next())
}

/**
 * @param {number} index
 * @return {string}
 */
function identifier (index) {
	while (!token(peek()))
		next()

	return slice(index, position)
}


/***/ },

/***/ "./node_modules/stylis/src/Utility.js"
/*!********************************************!*\
  !*** ./node_modules/stylis/src/Utility.js ***!
  \********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   abs: () => (/* binding */ abs),
/* harmony export */   append: () => (/* binding */ append),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   charat: () => (/* binding */ charat),
/* harmony export */   combine: () => (/* binding */ combine),
/* harmony export */   from: () => (/* binding */ from),
/* harmony export */   hash: () => (/* binding */ hash),
/* harmony export */   indexof: () => (/* binding */ indexof),
/* harmony export */   match: () => (/* binding */ match),
/* harmony export */   replace: () => (/* binding */ replace),
/* harmony export */   sizeof: () => (/* binding */ sizeof),
/* harmony export */   strlen: () => (/* binding */ strlen),
/* harmony export */   substr: () => (/* binding */ substr),
/* harmony export */   trim: () => (/* binding */ trim)
/* harmony export */ });
/**
 * @param {number}
 * @return {number}
 */
var abs = Math.abs

/**
 * @param {number}
 * @return {string}
 */
var from = String.fromCharCode

/**
 * @param {object}
 * @return {object}
 */
var assign = Object.assign

/**
 * @param {string} value
 * @param {number} length
 * @return {number}
 */
function hash (value, length) {
	return charat(value, 0) ^ 45 ? (((((((length << 2) ^ charat(value, 0)) << 2) ^ charat(value, 1)) << 2) ^ charat(value, 2)) << 2) ^ charat(value, 3) : 0
}

/**
 * @param {string} value
 * @return {string}
 */
function trim (value) {
	return value.trim()
}

/**
 * @param {string} value
 * @param {RegExp} pattern
 * @return {string?}
 */
function match (value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value
}

/**
 * @param {string} value
 * @param {(string|RegExp)} pattern
 * @param {string} replacement
 * @return {string}
 */
function replace (value, pattern, replacement) {
	return value.replace(pattern, replacement)
}

/**
 * @param {string} value
 * @param {string} search
 * @return {number}
 */
function indexof (value, search) {
	return value.indexOf(search)
}

/**
 * @param {string} value
 * @param {number} index
 * @return {number}
 */
function charat (value, index) {
	return value.charCodeAt(index) | 0
}

/**
 * @param {string} value
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function substr (value, begin, end) {
	return value.slice(begin, end)
}

/**
 * @param {string} value
 * @return {number}
 */
function strlen (value) {
	return value.length
}

/**
 * @param {any[]} value
 * @return {number}
 */
function sizeof (value) {
	return value.length
}

/**
 * @param {any} value
 * @param {any[]} array
 * @return {any}
 */
function append (value, array) {
	return array.push(value), value
}

/**
 * @param {string[]} array
 * @param {function} callback
 * @return {string}
 */
function combine (array, callback) {
	return array.map(callback).join('')
}


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
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
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
/*!***********************!*\
  !*** ./src/editor.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _editor_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./editor/index */ "./src/editor/index.js");
/* harmony import */ var _editor_styles_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./editor/styles.scss */ "./src/editor/styles.scss");
/**
 * Internal dependencies
 */


})();

/******/ })()
;
//# sourceMappingURL=editor.js.map