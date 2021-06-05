'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function childValidated(child, parent, VALID_CHILDREN) {
  return VALID_CHILDREN[parent.name].indexOf(child.name) !== -1;
}

function cleanChildren(container, VALID_RULES) {
  var clone = container.clone();

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var rule = _step.value;

      rule.nodes.reduce(function (a, c) {
        if (c.type !== 'atrule') return a;
        if (c.__atrulebem__ && !c.__atrulebem__.valid) return a;
        if (VALID_RULES.indexOf(c.name) === -1) return a;

        a.push(c);

        return a;
      }, []).forEach(function (_) {
        return rule.removeChild(_);
      });
    };

    for (var _iterator = clone.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return clone;
}

function getPrefix(type, ELEMENT, MODIFIER, OPTIONS) {
  switch (type) {
    case ELEMENT:
      return OPTIONS.separators.element;
    case MODIFIER:
      return OPTIONS.separators.modifier;
    default:
      return '.';
  }
}

function generateSelector(_ref, ELEMENT, MODIFIER, OPTIONS, BLOCK_SELECTOR) {
  var name = _ref.name,
      parent = _ref.parent,
      params = _ref.params;

  var prefix = getPrefix(name, ELEMENT, MODIFIER, OPTIONS);

  /* If using an element inside a modifier, apply the modifier to the block selector. */
  if (name === 'e' && parent && parent.name === 'm') {
    prefix = ' ' + BLOCK_SELECTOR[0] + prefix;
  }

  return params.split(',').reduce(function (all, curr) {
    return [].concat(all, '' + prefix + curr.trim());
  }, []);
}

function prependAonB(a, b) {
  var MERGED = [];
  var aL = a.length;
  var bL = b.length;
  var aC = 0;

  for (; aC < aL; aC++) {
    var aCurr = a[aC];
    var bC = 0;

    for (; bC < bL; bC++) {
      var bCurr = b[bC];

      MERGED.push('' + aCurr + bCurr);
    }
  }

  return MERGED;
}

exports.cleanChildren = cleanChildren;
exports.childValidated = childValidated;
exports.generateSelector = generateSelector;
exports.prependAonB = prependAonB;