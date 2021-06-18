'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _utils = require('./lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /* eslint-disable */


exports.default = _postcss2.default.plugin('postcss-atrule-bem', function (opts) {
  var _VALID_CHILDREN;

  var OPTIONS = Object.assign({}, {
    strict: true,
    warn: true,
    shortcuts: false,
    separators: {
      element: '__',
      modifier: '--'
    }
  }, opts);

  if (OPTIONS.separators.element === undefined) {
    OPTIONS.separators.element = '__';
  }

  if (OPTIONS.separators.modifier === undefined) {
    OPTIONS.separators.modifier = '--';
  }

  var BLOCK = OPTIONS.shortcuts ? 'b' : 'block';
  var ELEMENT = OPTIONS.shortcuts ? 'e' : 'element';
  var MODIFIER = OPTIONS.shortcuts ? 'm' : 'modifier';
  var VALID_RULES = [BLOCK, ELEMENT, MODIFIER];
  var VALID_CHILDREN = (_VALID_CHILDREN = {}, _defineProperty(_VALID_CHILDREN, BLOCK, [ELEMENT, MODIFIER]), _defineProperty(_VALID_CHILDREN, ELEMENT, [MODIFIER]), _defineProperty(_VALID_CHILDREN, MODIFIER, [ELEMENT, MODIFIER]), _VALID_CHILDREN);

  function recursiveWalker(container, previousSelector, parent, options, result, BLOCK_SELECTOR) {
    return function (node) {
      if (node.parent !== parent) return;
      if (VALID_RULES.indexOf(node.name) === -1) return;
      if (options.strict && !(0, _utils.childValidated)(node, node.parent, VALID_CHILDREN)) {
        node.__atrulebem__ = { valid: false };
        if (options.warn) {
          container.warn(result, 'Type ' + String(node.name) + ' cannot have child of ' + String(node.parent.name));
        }

        return;
      }

      var SELECTOR = (0, _utils.prependAonB)(previousSelector, (0, _utils.generateSelector)(node, ELEMENT, MODIFIER, OPTIONS, BLOCK_SELECTOR));

      container.append(new _postcss.rule({
        selector: SELECTOR.join(','),
        nodes: node.nodes
      }));

      if (node.nodes.length) {
        node.walkAtRules(recursiveWalker(container, SELECTOR, node, options, result, BLOCK_SELECTOR));
      }
    };
  }

  return function atruleBEM(root, result) {
    root.walkAtRules(BLOCK, function (blockAtRule) {
      var CONTAINER = new _postcss.root();
      var BLOCK_SELECTOR = (0, _utils.generateSelector)(blockAtRule, ELEMENT, MODIFIER, OPTIONS);

      CONTAINER.append(new _postcss.rule({
        selector: BLOCK_SELECTOR.join(','),
        nodes: blockAtRule.nodes
      }));

      blockAtRule.walkAtRules(recursiveWalker(CONTAINER, BLOCK_SELECTOR, blockAtRule, OPTIONS, result, BLOCK_SELECTOR));
      blockAtRule.replaceWith((0, _utils.cleanChildren)(CONTAINER, VALID_RULES));
    });
  };
});