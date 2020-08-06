/**
 * @license rxcomp-server v1.0.0-beta.12
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxcomp'), require('htmlparser2')) :
  typeof define === 'function' && define.amd ? define(['exports', 'rxcomp', 'htmlparser2'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.rxcomp = global.rxcomp || {}, global.rxcomp.server = {}), global.rxcomp, global.htmlparser2));
}(this, (function (exports, rxcomp, htmlparser2) { 'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        return function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    it = o[Symbol.iterator]();
    return it.next.bind(it);
  }

  (function (RxNodeType) {
    RxNodeType[RxNodeType["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
    RxNodeType[RxNodeType["TEXT_NODE"] = 3] = "TEXT_NODE";
    RxNodeType[RxNodeType["CDATA_SECTION_NODE"] = 4] = "CDATA_SECTION_NODE";
    RxNodeType[RxNodeType["PROCESSING_INSTRUCTION_NODE"] = 7] = "PROCESSING_INSTRUCTION_NODE";
    RxNodeType[RxNodeType["COMMENT_NODE"] = 8] = "COMMENT_NODE";
    RxNodeType[RxNodeType["DOCUMENT_NODE"] = 9] = "DOCUMENT_NODE";
    RxNodeType[RxNodeType["DOCUMENT_TYPE_NODE"] = 10] = "DOCUMENT_TYPE_NODE";
    RxNodeType[RxNodeType["DOCUMENT_FRAGMENT_NODE"] = 11] = "DOCUMENT_FRAGMENT_NODE";
  })(exports.RxNodeType || (exports.RxNodeType = {}));

  (function (SelectorType) {
    SelectorType[SelectorType["None"] = -1] = "None";
    SelectorType[SelectorType["Id"] = 0] = "Id";
    SelectorType[SelectorType["Class"] = 1] = "Class";
    SelectorType[SelectorType["Attribute"] = 2] = "Attribute";
    SelectorType[SelectorType["TagName"] = 3] = "TagName";
  })(exports.SelectorType || (exports.SelectorType = {}));

  function isRxElement(x) {
    return x.nodeType === exports.RxNodeType.ELEMENT_NODE;
  }
  function isRxText(x) {
    return x.nodeType === exports.RxNodeType.TEXT_NODE;
  }
  function isRxComment(x) {
    return x.nodeType === exports.RxNodeType.COMMENT_NODE;
  }
  function isRxDocument(x) {
    return x.nodeType === exports.RxNodeType.DOCUMENT_NODE;
  }
  function isRxDocumentType(x) {
    return x.nodeType === exports.RxNodeType.DOCUMENT_TYPE_NODE;
  }
  function isRxProcessingInstruction(x) {
    return x.nodeType === exports.RxNodeType.PROCESSING_INSTRUCTION_NODE;
  }
  function parse(html) {
    var doc = new RxDocument();
    var parentNode = doc,
        node;
    var parser = new htmlparser2.Parser({
      onopentag: function onopentag(nodeName, attributes) {
        // console.log(nodeName);
        node = new RxElement(parentNode, nodeName, attributes);
        parentNode.childNodes.push(node);
        parentNode = node; // if (NO_CHILDS.indexOf(nodeName) === -1) {
        //	console.log(nodeName);
        //	parentNode = node;
        // }
      },
      onclosetag: function onclosetag(nodeName) {
        if (parentNode.parentNode) {
          parentNode = parentNode.parentNode;
        }
      },
      ontext: function ontext(nodeValue) {
        if (nodeValue.length) {
          var textNode = new RxText(parentNode, nodeValue);
          parentNode.childNodes.push(textNode);
        }
      },
      onprocessinginstruction: function onprocessinginstruction(nodeName, nodeValue) {
        // console.log('onprocessinginstruction', nodeName, nodeValue);
        if (nodeName === '!doctype') {
          node = new RxDocumentType(parentNode, nodeValue);
        } else {
          node = new RxProcessingInstruction(parentNode, nodeValue);
        }

        parentNode.childNodes.push(node);
      },
      oncomment: function oncomment(nodeValue) {
        // console.log('oncomment', nodeValue);
        node = new RxComment(parentNode, nodeValue);
        parentNode.childNodes.push(node); // parentNode = node;
      },
      oncommentend: function oncommentend() {// console.log('oncommentend');
        // parentNode = parentNode.parentNode;
      },
      oncdatastart: function oncdatastart() {
        console.log('oncdatastart');
      },
      oncdataend: function oncdataend() {
        console.log('oncdataend');
      },
      onerror: function onerror(error) {
        console.log('error', error);
      }
    }, {
      decodeEntities: false,
      lowerCaseTags: true
    });
    parser.write(html);
    parser.end();
    return doc;
  }
  function getQueries(selector) {
    var queries = [];
    selector.trim().split(' ').forEach(function (x) {
      x.trim().split('>').forEach(function (x, i) {
        var regex = /\.([^\.[]+)|\[([^\.\[]+)\]|([^\.\[\]]+)/g;
        /*eslint no-useless-escape: "off"*/
        // const regex = new RegExp(`\.([^\.[]+)|\[([^\.\[]+)\]|([^\.\[\]]+)`, 'g');

        var selectors = [];
        var matches = x.matchAll(regex);

        for (var _iterator = _createForOfIteratorHelperLoose(matches), _step; !(_step = _iterator()).done;) {
          var match = _step.value;

          if (match[1]) {
            selectors.push({
              selector: match[1],
              type: exports.SelectorType.Class
            });
          } else if (match[2]) {
            selectors.push({
              selector: match[2],
              type: exports.SelectorType.Attribute
            });
          } else if (match[3]) {
            selectors.push({
              selector: match[3],
              type: exports.SelectorType.TagName
            });
          } // console.log('match', match);

        }

        var selector = i > 0 ? {
          selector: x,
          selectors: selectors,
          inner: true
        } : {
          selector: x,
          selectors: selectors,
          inner: false
        };
        queries.push.call(queries, selector);
      });
    });
    return queries;
  }
  function querySelectorAll(queries, childNodes, nodes) {

    return null;
  }

  function _querySelector(queries, childNodes, query) {
    if (query === void 0) {
      query = null;
    }

    var node = null;

    var match = function match(child, selector) {
      switch (selector.type) {
        case exports.SelectorType.Class:
          return child.classList.indexOf(selector.selector) !== -1;

        case exports.SelectorType.Attribute:
          return Object.keys(child.attributes).indexOf(selector.selector) !== -1;

        case exports.SelectorType.TagName:
          return child.nodeName === selector.selector;

        default:
          return false;
      }
    };

    if (query || queries.length) {
      query = query || queries.shift();

      var _loop = function _loop() {
        var child = _step2.value;

        if (child instanceof RxElement) {
          var has = query.selectors.reduce(function (p, selector, i) {
            return p && match(child, selector);
          }, true);

          if (has) {
            // console.log(query);
            if (queries.length) {
              return {
                v: _querySelector(queries, child.childNodes)
              };
            } else {
              return {
                v: child
              };
            }
          } else if (!query.inner) {
            node = _querySelector(queries, child.childNodes, query);
          }
        }
      };

      for (var _iterator2 = _createForOfIteratorHelperLoose(childNodes), _step2; !(_step2 = _iterator2()).done;) {
        var _ret = _loop();

        if (typeof _ret === "object") return _ret.v;
      }
    }

    return node;
  }

  function _cloneNode(source, deep, parentNode) {
    if (deep === void 0) {
      deep = false;
    }

    if (parentNode === void 0) {
      parentNode = null;
    }

    var node;

    if (isRxElement(source)) {
      var nodeElement = new RxElement(parentNode, source.nodeName, Object.assign({}, source.attributes));

      if (deep) {
        nodeElement.childNodes = source.childNodes.map(function (x) {
          return _cloneNode.apply(x, [nodeElement, deep]);
        });
      }

      node = nodeElement;
    } else if (isRxText(source)) {
      node = new RxText(parentNode, source.nodeValue);
    } else if (isRxComment(source)) {
      node = new RxComment(parentNode, source.nodeValue);
    } else if (isRxDocument(source)) {
      var documentElement = new RxDocument();

      if (deep) {
        documentElement.childNodes = source.childNodes.map(function (x) {
          return _cloneNode.apply(x, [documentElement, deep]);
        });
      }

      node = documentElement;
    } else {
      throw 'Invalid node type';
    }

    return node;
  }
  var RxSelector = function RxSelector(options) {
    this.selector = '';
    this.type = exports.SelectorType.None;

    if (options) {
      Object.assign(this, options);
    }
  };
  var RxQuery = function RxQuery(options) {
    this.selector = '';
    this.selectors = [];
    this.inner = false;

    if (options) {
      Object.assign(this, options);
    }
  };
  var RxNode = /*#__PURE__*/function () {
    function RxNode(parentNode) {
      if (parentNode === void 0) {
        parentNode = null;
      }

      this.nodeValue = null;
      this.parentNode = parentNode;
      this.nodeType = -1;
    }

    var _proto = RxNode.prototype;

    _proto.cloneNode = function cloneNode(deep) {
      if (deep === void 0) {
        deep = false;
      }

      return _cloneNode.apply(this, [this, deep]);
    };

    _proto.serialize = function serialize() {
      return "";
    };

    return RxNode;
  }();
  var RxElement = /*#__PURE__*/function (_RxNode) {
    _inheritsLoose(RxElement, _RxNode);

    function RxElement(parentNode, nodeName, attributes) {
      var _this;

      if (parentNode === void 0) {
        parentNode = null;
      }

      if (attributes === void 0) {
        attributes = null;
      }

      _this = _RxNode.call(this, parentNode) || this;
      _this.nodeType = exports.RxNodeType.ELEMENT_NODE;
      _this.nodeName = nodeName;
      _this.attributes = attributes || {};
      _this.childNodes = [];
      /*
          if (SKIP.indexOf(nodeName) === -1) {
              console.log(parentNode.nodeName, '>', nodeName);
      }
      */

      return _this;
    }

    var _proto2 = RxElement.prototype;

    _proto2.append = function append() {
      var _this2 = this;

      for (var _len = arguments.length, nodesOrDOMStrings = new Array(_len), _key = 0; _key < _len; _key++) {
        nodesOrDOMStrings[_key] = arguments[_key];
      }

      nodesOrDOMStrings = nodesOrDOMStrings.map(function (nodeOrDomString) {
        var node;

        if (typeof nodeOrDomString === 'string') {
          node = new RxText(_this2, nodeOrDomString);
        } else {
          node = nodeOrDomString;
          node.parentNode = _this2;
        }

        return node;
      });
      Array.prototype.push.apply(this.childNodes, nodesOrDOMStrings);
      /*
      for (let nodeOrDomString of nodesOrDOMStrings) {
              let node;
              if (typeof nodeOrDomString === 'string') {
                  node = new RxText(this, nodeOrDomString);
              } else {
                  node = nodeOrDomString;
              }
              this.childNodes.push(node);
      }
      */
    };

    _proto2.prepend = function prepend() {
      var _this3 = this;

      for (var _len2 = arguments.length, nodesOrDOMStrings = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        nodesOrDOMStrings[_key2] = arguments[_key2];
      }

      nodesOrDOMStrings = nodesOrDOMStrings.map(function (nodeOrDomString) {
        var node;

        if (typeof nodeOrDomString === 'string') {
          node = new RxText(_this3, nodeOrDomString);
        } else {
          node = nodeOrDomString;
          node.parentNode = _this3;
        }

        return node;
      });
      Array.prototype.unshift.apply(this.childNodes, nodesOrDOMStrings);
      /*
          for (let nodeOrDomString of nodesOrDOMStrings) {
              let node;
              if (typeof nodeOrDomString === 'string') {
                  node = new RxText(this, nodeOrDomString);
              } else {
                  node = nodeOrDomString;
              }
              this.childNodes.unshift(node);
      }
      */
    };

    _proto2.replaceChildren = function replaceChildren() {
      var _this4 = this;

      for (var _len3 = arguments.length, nodesOrDOMStrings = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        nodesOrDOMStrings[_key3] = arguments[_key3];
      }

      var nodes = nodesOrDOMStrings.map(function (nodeOrDomString) {
        var node;

        if (typeof nodeOrDomString === 'string') {
          node = new RxText(_this4, nodeOrDomString);
        } else {
          node = nodeOrDomString;
          node.parentNode = _this4;
        }

        return node;
      });
      this.childNodes = nodes;
    };

    _proto2.querySelectorAll = function querySelectorAll(selector) {
      var queries = getQueries(selector);
      var nodes = this.childNodes.filter(function (x) {
        return true;
      });
      console.log(queries);
      return nodes.length ? nodes : null;
    };

    _proto2.querySelector = function querySelector(selector) {
      var queries = getQueries(selector);

      var node = _querySelector(queries, this.childNodes);

      return node;
    };

    _proto2.hasAttribute = function hasAttribute(attribute) {
      return Object.keys(this.attributes).indexOf(attribute.toLowerCase()) !== -1;
    };

    _proto2.getAttribute = function getAttribute(attribute) {
      return this.attributes[attribute.toLowerCase()] || null;
    };

    _proto2.setAttribute = function setAttribute(attribute, value) {
      this.attributes[attribute.toLowerCase()] = value.toString();
    };

    _proto2.removeAttribute = function removeAttribute(attribute) {
      delete this.attributes[attribute];
    };

    _proto2.replaceChild = function replaceChild(newChild, oldChild) {
      var index = this.childNodes.indexOf(oldChild);

      if (index !== -1) {
        this.childNodes[index] = newChild;
        newChild.parentNode = this;
      }

      return oldChild;
    };

    _proto2.insertBefore = function insertBefore(newNode, referenceNode) {
      if (referenceNode === void 0) {
        referenceNode = null;
      }

      var index = referenceNode ? this.childNodes.indexOf(referenceNode) : this.childNodes.length;

      if (index !== -1) {
        this.childNodes.splice(index, 0, newNode);
        newNode.parentNode = this;
      }

      return newNode;
    };

    _proto2.addListener = function addListener(eventName, handler) {};

    _proto2.removeListener = function removeListener(eventName, handler) {};

    _proto2.serialize = function serialize() {
      return "<" + this.nodeName + this.serializeAttributes() + ">" + this.childNodes.map(function (x) {
        return x.serialize();
      }).join('') + "</" + this.nodeName + ">";
    };

    _proto2.serializeAttributes = function serializeAttributes() {
      var _this5 = this;

      var attributes = '';
      var keys = Object.keys(this.attributes);

      if (keys.length) {
        attributes = ' ' + keys.map(function (k) {
          return k + "=\"" + _this5.attributes[k] + "\"";
        }).join(' ');
      }

      return attributes;
    };

    _createClass(RxElement, [{
      key: "children",
      get: function get() {
        var children = [],
            i = 0,
            node,
            nodes = this.childNodes;
        node = nodes[i++];

        while (node) {
          node = nodes[i++];

          if (node.nodeType === exports.RxNodeType.ELEMENT_NODE) {
            children.push(node);
          }
        }

        return children;
      }
    }, {
      key: "childElementCount",
      get: function get() {
        var i = 0,
            count = 0,
            node,
            nodes = this.childNodes;
        node = nodes[i++];

        while (node) {
          if (node.nodeType === exports.RxNodeType.ELEMENT_NODE) {
            count++;
          }

          node = nodes[i++];
        }

        return count;
      }
    }, {
      key: "firstChild",
      get: function get() {
        var node = null;

        if (this.childNodes.length) {
          node = this.childNodes[0];
        }

        return node;
      }
    }, {
      key: "firstElementChild",
      get: function get() {
        for (var _iterator3 = _createForOfIteratorHelperLoose(this.childNodes), _step3; !(_step3 = _iterator3()).done;) {
          var node = _step3.value;

          if (isRxElement(node)) {
            return node;
          }
        }

        return null;
      }
    }, {
      key: "lastElementChild",
      get: function get() {
        var nodes = this.childNodes;

        for (var i = nodes.length - 1; i > -1; i--) {
          var node = nodes[i];

          if (isRxElement(node)) {
            return node;
          }
        }

        return null;
      }
    }, {
      key: "previousSibling",
      get: function get() {
        var node = null;

        if (this.parentNode) {
          var index = this.parentNode.childNodes.indexOf(this);

          if (index > 0) {
            node = this.parentNode.childNodes[index - 1];
          }
        }

        return node;
      }
    }, {
      key: "nextSibling",
      get: function get() {
        var node = null;

        if (this.parentNode) {
          var index = this.parentNode.childNodes.indexOf(this);

          if (index !== -1 && index < this.parentNode.childNodes.length - 1) {
            node = this.parentNode.childNodes[index];
          }
        }

        return node;
      }
    }, {
      key: "outerHTML",
      get: function get() {
        var html = null;

        if (this.parentNode) {
          html = this.parentNode.serialize();
        }

        return html;
      }
    }, {
      key: "wholeText",
      get: function get() {
        var nodeValue = null;

        if (isRxText(this)) {
          nodeValue = this.nodeValue;
        }

        return nodeValue;
      }
    }, {
      key: "classList",
      get: function get() {
        var classList = this.attributes.class ? this.attributes.class.split(' ').map(function (c) {
          return c.trim();
        }) : [];
        return classList;
      }
    }, {
      key: "innerText",
      set: function set(nodeValue) {
        this.childNodes = [new RxText(this, nodeValue)];
      },
      get: function get() {
        return this.childNodes.filter(function (n) {
          return isRxText(n);
        }).map(function (n) {
          return n.innerText;
        }).join('');
      }
    }, {
      key: "textContent",
      set: function set(nodeValue) {
        this.innerText = String(nodeValue);
      },
      get: function get() {
        return this.innerText;
      }
    }, {
      key: "innerHTML",
      set: function set(html) {
        var _this6 = this;

        var doc = parse(html);
        var childNodes = doc.childNodes.map(function (n) {
          n.parentNode = _this6;
          return n;
        });
        this.childNodes = childNodes;
      }
    }]);

    return RxElement;
  }(RxNode);
  var RxText = /*#__PURE__*/function (_RxNode2) {
    _inheritsLoose(RxText, _RxNode2);

    function RxText(parentNode, nodeValue) {
      var _this7;

      if (parentNode === void 0) {
        parentNode = null;
      }

      _this7 = _RxNode2.call(this, parentNode) || this;
      _this7.nodeType = exports.RxNodeType.TEXT_NODE;
      _this7.nodeValue = String(nodeValue);
      return _this7;
    }

    var _proto3 = RxText.prototype;

    _proto3.serialize = function serialize() {
      return this.nodeValue;
    };

    _createClass(RxText, [{
      key: "outerHTML",
      get: function get() {
        var html = null;

        if (this.parentNode) {
          html = this.parentNode.serialize();
        }

        return html;
      }
    }, {
      key: "wholeText",
      get: function get() {
        return this.nodeValue;
      }
    }, {
      key: "innerText",
      set: function set(nodeValue) {
        this.nodeValue = String(nodeValue);
      },
      get: function get() {
        return this.nodeValue;
      }
    }, {
      key: "textContent",
      set: function set(nodeValue) {
        this.nodeValue = String(nodeValue);
      },
      get: function get() {
        return this.nodeValue;
      }
    }]);

    return RxText;
  }(RxNode);
  var RxCData = /*#__PURE__*/function (_RxNode3) {
    _inheritsLoose(RxCData, _RxNode3);

    function RxCData(parentNode, nodeValue) {
      var _this8;

      if (parentNode === void 0) {
        parentNode = null;
      }

      _this8 = _RxNode3.call(this, parentNode) || this;
      _this8.nodeType = exports.RxNodeType.CDATA_SECTION_NODE;
      _this8.nodeValue = String(nodeValue);
      return _this8;
    }

    var _proto4 = RxCData.prototype;

    _proto4.serialize = function serialize() {
      return this.nodeValue;
    };

    _createClass(RxCData, [{
      key: "outerHTML",
      get: function get() {
        var html = null;

        if (this.parentNode) {
          html = this.parentNode.serialize();
        }

        return html;
      }
    }, {
      key: "wholeText",
      get: function get() {
        return this.nodeValue;
      }
    }, {
      key: "innerText",
      set: function set(nodeValue) {
        this.nodeValue = String(nodeValue);
      },
      get: function get() {
        return this.nodeValue;
      }
    }, {
      key: "textContent",
      set: function set(nodeValue) {
        this.nodeValue = String(nodeValue);
      },
      get: function get() {
        return this.nodeValue;
      }
    }]);

    return RxCData;
  }(RxNode);
  var RxComment = /*#__PURE__*/function (_RxNode4) {
    _inheritsLoose(RxComment, _RxNode4);

    function RxComment(parentNode, nodeValue) {
      var _this9;

      if (parentNode === void 0) {
        parentNode = null;
      }

      _this9 = _RxNode4.call(this, parentNode) || this;
      _this9.nodeType = exports.RxNodeType.COMMENT_NODE;
      _this9.nodeValue = String(nodeValue);
      return _this9;
    }

    var _proto5 = RxComment.prototype;

    _proto5.serialize = function serialize() {
      return "<!--" + this.nodeValue + "-->";
    };

    _createClass(RxComment, [{
      key: "outerHTML",
      get: function get() {
        var html = null;

        if (this.parentNode) {
          html = this.parentNode.serialize();
        }

        return html;
      }
    }, {
      key: "wholeText",
      get: function get() {
        return this.nodeValue;
      }
    }, {
      key: "innerText",
      set: function set(nodeValue) {
        this.nodeValue = String(nodeValue);
      },
      get: function get() {
        return this.nodeValue;
      }
    }, {
      key: "textContent",
      set: function set(nodeValue) {
        this.nodeValue = String(nodeValue);
      },
      get: function get() {
        return this.nodeValue;
      }
    }]);

    return RxComment;
  }(RxNode);
  var RxProcessingInstruction = /*#__PURE__*/function (_RxNode5) {
    _inheritsLoose(RxProcessingInstruction, _RxNode5);

    function RxProcessingInstruction(parentNode, nodeValue) {
      var _this10;

      if (parentNode === void 0) {
        parentNode = null;
      }

      _this10 = _RxNode5.call(this, parentNode) || this;
      _this10.nodeType = exports.RxNodeType.PROCESSING_INSTRUCTION_NODE;
      _this10.nodeValue = String(nodeValue);
      return _this10;
    }

    var _proto6 = RxProcessingInstruction.prototype;

    _proto6.serialize = function serialize() {
      return "<" + this.nodeValue + ">";
    };

    return RxProcessingInstruction;
  }(RxNode);
  var RxDocumentType = /*#__PURE__*/function (_RxNode6) {
    _inheritsLoose(RxDocumentType, _RxNode6);

    function RxDocumentType(parentNode, nodeValue) {
      var _this11;

      if (parentNode === void 0) {
        parentNode = null;
      }

      _this11 = _RxNode6.call(this, parentNode) || this;
      _this11.nodeType = exports.RxNodeType.DOCUMENT_TYPE_NODE;
      _this11.nodeValue = String(nodeValue);
      return _this11;
    }

    var _proto7 = RxDocumentType.prototype;

    _proto7.serialize = function serialize() {
      return "<" + this.nodeValue + ">";
    };

    return RxDocumentType;
  }(RxNode);
  var RxDocument = /*#__PURE__*/function (_RxElement) {
    _inheritsLoose(RxDocument, _RxElement);

    _createClass(RxDocument, [{
      key: "hidden",
      get: function get() {
        return true;
      }
    }, {
      key: "visibilityState",
      get: function get() {
        return 'prerender';
      }
    }, {
      key: "doctype",
      get: function get() {
        return this.childNodes.find(function (x) {
          return isRxDocumentType(x);
        });
      }
    }, {
      key: "body",
      get: function get() {
        return this.childNodes.find(function (x) {
          return isRxElement(x) && x.nodeName === 'body';
        });
      }
    }, {
      key: "head",
      get: function get() {
        return this.childNodes.find(function (x) {
          return isRxElement(x) && x.nodeName === 'head';
        });
      }
    }, {
      key: "title",
      get: function get() {
        var title = this.childNodes.find(function (x) {
          return isRxElement(x) && x.nodeName === 'title';
        });

        if (title) {
          return title.innerText;
        } else {
          return null;
        }
      },
      set: function set(nodeValue) {
        var title = this.childNodes.find(function (x) {
          return isRxElement(x) && x.nodeName === 'title';
        });

        if (title) {
          title.innerText = nodeValue;
        }
      }
    }, {
      key: "documentElement",
      get: function get() {
        return this.firstElementChild;
      }
    }]);

    function RxDocument() {
      var _this12;

      _this12 = _RxElement.call(this, null, '#document') || this;
      _this12.nodeType = exports.RxNodeType.DOCUMENT_NODE;
      _this12.childNodes = [];
      return _this12;
    }

    var _proto8 = RxDocument.prototype;

    _proto8.createAttribute = function createAttribute() {} // Creates a new Attr object and returns it.
    ;

    _proto8.createAttributeNS = function createAttributeNS() {} // Creates a new attribute node in a given namespace and returns it.
    ;

    _proto8.createCDATASection = function createCDATASection() {} // Creates a new CDATA node and returns it.
    ;

    _proto8.createComment = function createComment() {} // Creates a new comment node and returns it.
    ;

    _proto8.createDocumentFragment = function createDocumentFragment() {} // Creates a new document fragment.
    ;

    _proto8.createElement = function createElement(nodeName) {
      return new RxElement(null, nodeName);
    } // Creates a new element with the given tag name.
    ;

    _proto8.createElementNS = function createElementNS() {} // Creates a new element with the given tag name and namespace URI.
    ;

    _proto8.createEvent = function createEvent() {} // Creates an event object.
    ;

    _proto8.createNodeIterator = function createNodeIterator() {} // Creates a NodeIterator object.
    ;

    _proto8.createProcessingInstruction = function createProcessingInstruction() {} // Creates a new ProcessingInstruction object.
    ;

    _proto8.createRange = function createRange() {} // Creates a Range object.
    ;

    _proto8.createTextNode = function createTextNode(nodeValue) {
      return new RxText(null, nodeValue);
    } // Creates a text node.
    ;

    _proto8.createTouchList = function createTouchList() {} // Creates a TouchList object.
    ;

    _proto8.createTreeWalker = function createTreeWalker() {} // Creates a TreeWalker object.
    ;

    _proto8.serialize = function serialize() {
      return "" + this.childNodes.map(function (x) {
        return x.serialize();
      }).join('');
    };

    return RxDocument;
  }(RxElement);

  var Renderer = /*#__PURE__*/function () {
    function Renderer() {}

    Renderer.bootstrap = function bootstrap(documentOrHtml) {
      if (typeof documentOrHtml === 'string') {
        this.document = parse(documentOrHtml);
      } else {
        this.document = documentOrHtml;
      }
    };

    Renderer.querySelector = function querySelector(selector) {
      return this.document.querySelector(selector);
    };

    return Renderer;
  }();

  var Server = /*#__PURE__*/function (_Platform) {
    _inheritsLoose(Server, _Platform);

    function Server() {
      return _Platform.apply(this, arguments) || this;
    }

    Server.bootstrap = function bootstrap(moduleFactory, html) {
      if (!html) {
        throw 'missing html template';
      }

      Renderer.bootstrap(html);

      if (!moduleFactory) {
        throw 'missing moduleFactory';
      }

      if (!moduleFactory.meta) {
        throw 'missing moduleFactory meta';
      }

      if (!moduleFactory.meta.bootstrap) {
        throw 'missing bootstrap';
      }

      if (!moduleFactory.meta.bootstrap.meta) {
        throw 'missing bootstrap meta';
      }

      if (!moduleFactory.meta.bootstrap.meta.selector) {
        throw 'missing bootstrap meta selector';
      }

      var meta = this.resolveMeta(moduleFactory);
      var module = new moduleFactory();
      module.meta = meta;
      var instances = module.compile(meta.node, window);
      module.instances = instances;
      var root = instances[0];
      root.pushChanges();
      return module;
    };

    Server.querySelector = function querySelector(selector) {
      return Renderer.document.querySelector(selector);
    };

    return Server;
  }(rxcomp.Platform);

  var factories = [];
  var pipes = [];
  /**
   *  ServerModule Class.
   * @example
   * export default class AppModule extends Module {}
   *
   * AppModule.meta = {
   *  imports: [
   *   CoreModule,
   *    ServerModule
   *  ],
   *  declarations: [
   *   ErrorsComponent
   *  ],
   *  bootstrap: AppComponent,
   * };
   * @extends Module
   */

  var ServerModule = /*#__PURE__*/function (_Module) {
    _inheritsLoose(ServerModule, _Module);

    function ServerModule() {
      return _Module.apply(this, arguments) || this;
    }

    return ServerModule;
  }(rxcomp.Module);
  ServerModule.meta = {
    declarations: [].concat(factories, pipes),
    exports: [].concat(factories, pipes)
  };

  exports.Renderer = Renderer;
  exports.RxCData = RxCData;
  exports.RxComment = RxComment;
  exports.RxDocument = RxDocument;
  exports.RxDocumentType = RxDocumentType;
  exports.RxElement = RxElement;
  exports.RxNode = RxNode;
  exports.RxProcessingInstruction = RxProcessingInstruction;
  exports.RxQuery = RxQuery;
  exports.RxSelector = RxSelector;
  exports.RxText = RxText;
  exports.Server = Server;
  exports.ServerModule = ServerModule;
  exports.cloneNode = _cloneNode;
  exports.getQueries = getQueries;
  exports.isRxComment = isRxComment;
  exports.isRxDocument = isRxDocument;
  exports.isRxDocumentType = isRxDocumentType;
  exports.isRxElement = isRxElement;
  exports.isRxProcessingInstruction = isRxProcessingInstruction;
  exports.isRxText = isRxText;
  exports.parse = parse;
  exports.querySelector = _querySelector;
  exports.querySelectorAll = querySelectorAll;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=rxcomp-server.js.map
