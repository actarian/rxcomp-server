/**
 * @license rxcomp-server v1.0.0-beta.12
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/operators'), require('rxcomp'), require('htmlparser2'), require('stream'), require('http'), require('url'), require('https'), require('zlib'), require('rxjs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'rxjs/operators', 'rxcomp', 'htmlparser2', 'stream', 'http', 'url', 'https', 'zlib', 'rxjs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.main = global.main || {}, global.main.server = global.main.server || {}, global.main.server.umd = {}), global.rxjs.operators, global.rxcomp, global.htmlparser2, global.Stream, global.http, global.Url, global.https, global.zlib, global.rxjs));
}(this, (function (exports, operators, rxcomp, htmlparser2, Stream, http, Url, https, zlib, rxjs) { 'use strict';

  Stream = Stream && Object.prototype.hasOwnProperty.call(Stream, 'default') ? Stream['default'] : Stream;
  http = http && Object.prototype.hasOwnProperty.call(http, 'default') ? http['default'] : http;
  Url = Url && Object.prototype.hasOwnProperty.call(Url, 'default') ? Url['default'] : Url;
  https = https && Object.prototype.hasOwnProperty.call(https, 'default') ? https['default'] : https;
  zlib = zlib && Object.prototype.hasOwnProperty.call(zlib, 'default') ? zlib['default'] : zlib;

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

  /*
  export const NO_CHILDS = [
      'title',
      'base',
      'meta',
      'link',
      'img',
      'br',
      'input',
  ];

  const SKIP = [
      'html',
      'head',
      'title',
      'base',
      'meta',
      'script',
      'link',
      'body',
  ];
  */
  ///

  /*
  if (true) {
      document.createComment = nodeValue => {
          return new RxComment(null, nodeValue);
      };
      document.createTextNode = nodeValue => {
          return new RxText(null, nodeValue);
      };
  }
  */
  ///

  var RxNodeType;

  (function (RxNodeType) {
    RxNodeType[RxNodeType["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
    RxNodeType[RxNodeType["TEXT_NODE"] = 3] = "TEXT_NODE";
    RxNodeType[RxNodeType["CDATA_SECTION_NODE"] = 4] = "CDATA_SECTION_NODE";
    RxNodeType[RxNodeType["PROCESSING_INSTRUCTION_NODE"] = 7] = "PROCESSING_INSTRUCTION_NODE";
    RxNodeType[RxNodeType["COMMENT_NODE"] = 8] = "COMMENT_NODE";
    RxNodeType[RxNodeType["DOCUMENT_NODE"] = 9] = "DOCUMENT_NODE";
    RxNodeType[RxNodeType["DOCUMENT_TYPE_NODE"] = 10] = "DOCUMENT_TYPE_NODE";
    RxNodeType[RxNodeType["DOCUMENT_FRAGMENT_NODE"] = 11] = "DOCUMENT_FRAGMENT_NODE";
  })(RxNodeType || (RxNodeType = {}));

  var SelectorType;

  (function (SelectorType) {
    SelectorType[SelectorType["None"] = -1] = "None";
    SelectorType[SelectorType["Id"] = 0] = "Id";
    SelectorType[SelectorType["Class"] = 1] = "Class";
    SelectorType[SelectorType["Attribute"] = 2] = "Attribute";
    SelectorType[SelectorType["TagName"] = 3] = "TagName";
  })(SelectorType || (SelectorType = {}));

  function isRxElement(x) {
    return x.nodeType === RxNodeType.ELEMENT_NODE;
  }
  function isRxText(x) {
    return x.nodeType === RxNodeType.TEXT_NODE;
  }
  function isRxComment(x) {
    return x.nodeType === RxNodeType.COMMENT_NODE;
  }
  function isRxDocument(x) {
    return x.nodeType === RxNodeType.DOCUMENT_NODE;
  }
  function isRxDocumentFragment(x) {
    return x.nodeType === RxNodeType.DOCUMENT_FRAGMENT_NODE;
  }
  function isRxDocumentType(x) {
    return x.nodeType === RxNodeType.DOCUMENT_TYPE_NODE;
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
        // console.log('ontext', nodeValue);
        // if (nodeValue.length) {
        var textNode = new RxText(parentNode, nodeValue);
        parentNode.childNodes.push(textNode); // }
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
              type: SelectorType.Class
            });
          } else if (match[2]) {
            selectors.push({
              selector: match[2],
              type: SelectorType.Attribute
            });
          } else if (match[3]) {
            selectors.push({
              selector: match[3],
              type: SelectorType.TagName
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

  function _querySelector(queries, childNodes, query) {
    if (query === void 0) {
      query = null;
    }

    var node = null;

    var match = function match(child, selector) {
      switch (selector.type) {
        case SelectorType.Class:
          return child.classList.indexOf(selector.selector) !== -1;

        case SelectorType.Attribute:
          return Object.keys(child.attributes).indexOf(selector.selector) !== -1;

        case SelectorType.TagName:
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
          return _cloneNode.apply(x, [x, deep, nodeElement]);
        });
      }

      node = nodeElement;
    } else if (isRxDocumentFragment(source)) {
      var nodeDocumentFragment = new RxDocumentFragment();

      if (deep) {
        nodeDocumentFragment.childNodes = source.childNodes.map(function (x) {
          return _cloneNode.apply(x, [x, deep, nodeDocumentFragment]);
        });
      }

      node = nodeDocumentFragment;
    } else if (isRxText(source)) {
      node = new RxText(parentNode, source.nodeValue);
    } else if (isRxComment(source)) {
      node = new RxComment(parentNode, source.nodeValue);
    } else if (isRxDocument(source)) {
      var documentElement = new RxDocument();

      if (deep) {
        documentElement.childNodes = source.childNodes.map(function (x) {
          return _cloneNode.apply(x, [x, deep, documentElement]);
        });
      }

      node = documentElement;
    } else {
      throw 'Invalid node type';
    }

    return node;
  }
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
      _this.nodeType = RxNodeType.ELEMENT_NODE;
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
      } // console.log('replaceChild', this, newChild, oldChild);


      return oldChild;
    };

    _proto2.removeChild = function removeChild(child) {
      if (!(child instanceof RxNode)) {
        throw "Uncaught TypeError: Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'.";
      }

      var index = this.childNodes.indexOf(child);

      if (index === -1) {
        throw "Uncaught NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.";
      }

      this.childNodes.splice(index, 1); // console.log('removeChild', this.childNodes.length);

      return child;
    };

    _proto2.insertBefore = function insertBefore(newNode, referenceNode) {
      if (referenceNode === void 0) {
        referenceNode = null;
      }

      var index = referenceNode ? this.childNodes.indexOf(referenceNode) : this.childNodes.length;

      if (index !== -1) {
        this.childNodes.splice(index, 0, newNode);
        newNode.parentNode = this;
      } // console.log('insertBefore', this, newNode, referenceNode);


      return newNode;
    };

    _proto2.cloneNode = function cloneNode(deep) {
      if (deep === void 0) {
        deep = false;
      }

      return _cloneNode.apply(this, [this, deep]);
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

          if (node.nodeType === RxNodeType.ELEMENT_NODE) {
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
          if (node.nodeType === RxNodeType.ELEMENT_NODE) {
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
      key: "wholeText",
      get: function get() {
        var nodeValue;

        if (this.nodeType === RxNodeType.TEXT_NODE) {
          return this.nodeValue;
        }

        return nodeValue;
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
        // return this.childNodes.filter((n): n is RxText => isRxText(n)).map(n => n.innerText).join('');
        return this.childNodes.filter(function (n) {
          return isRxText(n) || isRxElement(n);
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
      _this7.nodeType = RxNodeType.TEXT_NODE;
      _this7.nodeValue = String(nodeValue); // console.log('RxText', nodeValue);

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
  var RxComment = /*#__PURE__*/function (_RxNode4) {
    _inheritsLoose(RxComment, _RxNode4);

    function RxComment(parentNode, nodeValue) {
      var _this9;

      if (parentNode === void 0) {
        parentNode = null;
      }

      _this9 = _RxNode4.call(this, parentNode) || this;
      _this9.nodeType = RxNodeType.COMMENT_NODE;
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
      _this10.nodeType = RxNodeType.PROCESSING_INSTRUCTION_NODE;
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
      _this11.nodeType = RxNodeType.DOCUMENT_TYPE_NODE;
      _this11.nodeValue = String(nodeValue);
      return _this11;
    }

    var _proto7 = RxDocumentType.prototype;

    _proto7.serialize = function serialize() {
      return "<" + this.nodeValue + ">";
    };

    return RxDocumentType;
  }(RxNode);
  var RxDocumentFragment = /*#__PURE__*/function (_RxElement) {
    _inheritsLoose(RxDocumentFragment, _RxElement);

    function RxDocumentFragment() {
      var _this12;

      _this12 = _RxElement.call(this, null, '#document-fragment') || this;
      _this12.nodeType = RxNodeType.DOCUMENT_FRAGMENT_NODE;
      _this12.childNodes = [];
      return _this12;
    }

    return RxDocumentFragment;
  }(RxElement);
  var RxDocument = /*#__PURE__*/function (_RxElement2) {
    _inheritsLoose(RxDocument, _RxElement2);

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
      var _this13;

      _this13 = _RxElement2.call(this, null, '#document') || this;
      _this13.nodeType = RxNodeType.DOCUMENT_NODE;
      _this13.childNodes = [];
      return _this13;
    }

    var _proto8 = RxDocument.prototype;

    _proto8.createAttribute = function createAttribute() {} // Creates a new Attr object and returns it.
    ;

    _proto8.createAttributeNS = function createAttributeNS() {} // Creates a new attribute node in a given namespace and returns it.
    ;

    _proto8.createCDATASection = function createCDATASection() {} // Creates a new CDATA node and returns it.
    ;

    _proto8.createComment = function createComment(nodeValue) {
      return new RxComment(null, nodeValue);
    } // Creates a new comment node and returns it.
    ;

    _proto8.createDocumentFragment = function createDocumentFragment() {
      return new RxDocumentFragment();
    } // Creates a new document fragment.
    ;

    _proto8.createElement = function createElement(nodeName) {
      return new RxElement(null, nodeName);
    } // Creates a new element with the given tag name.
    ;

    _proto8.createElementNS = function createElementNS(nodeName) {
      return new RxElement(null, nodeName);
    } // Creates a new element with the given tag name and namespace URI.
    ;

    _proto8.createEvent = function createEvent() {} // Creates an event object.
    ;

    _proto8.createNodeIterator = function createNodeIterator() {} // Creates a NodeIterator object.
    ;

    _proto8.createProcessingInstruction = function createProcessingInstruction(nodeValue) {
      return new RxProcessingInstruction(null, nodeValue);
    } // Creates a new ProcessingInstruction object.
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

      if (typeof process !== 'undefined') {
        global.document = this.document;
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
      var instances = module.compile(meta.node, {});
      module.instances = instances;
      var root = instances[0];
      root.pushChanges();
      return module;
    };

    Server.querySelector = function querySelector(selector) {
      return Renderer.document.querySelector(selector);
    };

    Server.serialize = function serialize() {
      console.log('Server.serialize');

      if (Renderer.document instanceof RxDocument) {
        var serialized = Renderer.document.serialize(); // console.log('serialized', serialized);

        return serialized;
      } else {
        throw 'Renderer.document is not an instance of RxDocument';
      }
    };

    return Server;
  }(rxcomp.Platform);

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  	  path: basedir,
  	  exports: {},
  	  require: function (path, base) {
        return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
      }
  	}, fn(module, module.exports), module.exports;
  }

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  // Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

  // fix for "Readable" isn't a named export issue
  const Readable = Stream.Readable;

  const BUFFER = Symbol('buffer');
  const TYPE = Symbol('type');

  class Blob {
  	constructor() {
  		this[TYPE] = '';

  		const blobParts = arguments[0];
  		const options = arguments[1];

  		const buffers = [];
  		let size = 0;

  		if (blobParts) {
  			const a = blobParts;
  			const length = Number(a.length);
  			for (let i = 0; i < length; i++) {
  				const element = a[i];
  				let buffer;
  				if (element instanceof Buffer) {
  					buffer = element;
  				} else if (ArrayBuffer.isView(element)) {
  					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
  				} else if (element instanceof ArrayBuffer) {
  					buffer = Buffer.from(element);
  				} else if (element instanceof Blob) {
  					buffer = element[BUFFER];
  				} else {
  					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
  				}
  				size += buffer.length;
  				buffers.push(buffer);
  			}
  		}

  		this[BUFFER] = Buffer.concat(buffers);

  		let type = options && options.type !== undefined && String(options.type).toLowerCase();
  		if (type && !/[^\u0020-\u007E]/.test(type)) {
  			this[TYPE] = type;
  		}
  	}
  	get size() {
  		return this[BUFFER].length;
  	}
  	get type() {
  		return this[TYPE];
  	}
  	text() {
  		return Promise.resolve(this[BUFFER].toString());
  	}
  	arrayBuffer() {
  		const buf = this[BUFFER];
  		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  		return Promise.resolve(ab);
  	}
  	stream() {
  		const readable = new Readable();
  		readable._read = function () {};
  		readable.push(this[BUFFER]);
  		readable.push(null);
  		return readable;
  	}
  	toString() {
  		return '[object Blob]';
  	}
  	slice() {
  		const size = this.size;

  		const start = arguments[0];
  		const end = arguments[1];
  		let relativeStart, relativeEnd;
  		if (start === undefined) {
  			relativeStart = 0;
  		} else if (start < 0) {
  			relativeStart = Math.max(size + start, 0);
  		} else {
  			relativeStart = Math.min(start, size);
  		}
  		if (end === undefined) {
  			relativeEnd = size;
  		} else if (end < 0) {
  			relativeEnd = Math.max(size + end, 0);
  		} else {
  			relativeEnd = Math.min(end, size);
  		}
  		const span = Math.max(relativeEnd - relativeStart, 0);

  		const buffer = this[BUFFER];
  		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
  		const blob = new Blob([], { type: arguments[2] });
  		blob[BUFFER] = slicedBuffer;
  		return blob;
  	}
  }

  Object.defineProperties(Blob.prototype, {
  	size: { enumerable: true },
  	type: { enumerable: true },
  	slice: { enumerable: true }
  });

  Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
  	value: 'Blob',
  	writable: false,
  	enumerable: false,
  	configurable: true
  });

  /**
   * fetch-error.js
   *
   * FetchError interface for operational errors
   */

  /**
   * Create FetchError instance
   *
   * @param   String      message      Error message for human
   * @param   String      type         Error type for machine
   * @param   String      systemError  For Node.js system error
   * @return  FetchError
   */
  function FetchError(message, type, systemError) {
    Error.call(this, message);

    this.message = message;
    this.type = type;

    // when err.type is `system`, err.code contains system error code
    if (systemError) {
      this.code = this.errno = systemError.code;
    }

    // hide custom error implementation details from end-users
    Error.captureStackTrace(this, this.constructor);
  }

  FetchError.prototype = Object.create(Error.prototype);
  FetchError.prototype.constructor = FetchError;
  FetchError.prototype.name = 'FetchError';

  let convert;
  try {
  	convert = require('encoding').convert;
  } catch (e) {}

  const INTERNALS = Symbol('Body internals');

  // fix an issue where "PassThrough" isn't a named export for node <10
  const PassThrough = Stream.PassThrough;

  /**
   * Body mixin
   *
   * Ref: https://fetch.spec.whatwg.org/#body
   *
   * @param   Stream  body  Readable stream
   * @param   Object  opts  Response options
   * @return  Void
   */
  function Body(body) {
  	var _this = this;

  	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
  	    _ref$size = _ref.size;

  	let size = _ref$size === undefined ? 0 : _ref$size;
  	var _ref$timeout = _ref.timeout;
  	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

  	if (body == null) {
  		// body is undefined or null
  		body = null;
  	} else if (isURLSearchParams(body)) {
  		// body is a URLSearchParams
  		body = Buffer.from(body.toString());
  	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
  		// body is ArrayBuffer
  		body = Buffer.from(body);
  	} else if (ArrayBuffer.isView(body)) {
  		// body is ArrayBufferView
  		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  	} else if (body instanceof Stream) ; else {
  		// none of the above
  		// coerce to string then buffer
  		body = Buffer.from(String(body));
  	}
  	this[INTERNALS] = {
  		body,
  		disturbed: false,
  		error: null
  	};
  	this.size = size;
  	this.timeout = timeout;

  	if (body instanceof Stream) {
  		body.on('error', function (err) {
  			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
  			_this[INTERNALS].error = error;
  		});
  	}
  }

  Body.prototype = {
  	get body() {
  		return this[INTERNALS].body;
  	},

  	get bodyUsed() {
  		return this[INTERNALS].disturbed;
  	},

  	/**
    * Decode response as ArrayBuffer
    *
    * @return  Promise
    */
  	arrayBuffer() {
  		return consumeBody.call(this).then(function (buf) {
  			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  		});
  	},

  	/**
    * Return raw response as Blob
    *
    * @return Promise
    */
  	blob() {
  		let ct = this.headers && this.headers.get('content-type') || '';
  		return consumeBody.call(this).then(function (buf) {
  			return Object.assign(
  			// Prevent copying
  			new Blob([], {
  				type: ct.toLowerCase()
  			}), {
  				[BUFFER]: buf
  			});
  		});
  	},

  	/**
    * Decode response as json
    *
    * @return  Promise
    */
  	json() {
  		var _this2 = this;

  		return consumeBody.call(this).then(function (buffer) {
  			try {
  				return JSON.parse(buffer.toString());
  			} catch (err) {
  				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
  			}
  		});
  	},

  	/**
    * Decode response as text
    *
    * @return  Promise
    */
  	text() {
  		return consumeBody.call(this).then(function (buffer) {
  			return buffer.toString();
  		});
  	},

  	/**
    * Decode response as buffer (non-spec api)
    *
    * @return  Promise
    */
  	buffer() {
  		return consumeBody.call(this);
  	},

  	/**
    * Decode response as text, while automatically detecting the encoding and
    * trying to decode to UTF-8 (non-spec api)
    *
    * @return  Promise
    */
  	textConverted() {
  		var _this3 = this;

  		return consumeBody.call(this).then(function (buffer) {
  			return convertBody(buffer, _this3.headers);
  		});
  	}
  };

  // In browsers, all properties are enumerable.
  Object.defineProperties(Body.prototype, {
  	body: { enumerable: true },
  	bodyUsed: { enumerable: true },
  	arrayBuffer: { enumerable: true },
  	blob: { enumerable: true },
  	json: { enumerable: true },
  	text: { enumerable: true }
  });

  Body.mixIn = function (proto) {
  	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
  		// istanbul ignore else: future proof
  		if (!(name in proto)) {
  			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
  			Object.defineProperty(proto, name, desc);
  		}
  	}
  };

  /**
   * Consume and convert an entire Body to a Buffer.
   *
   * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
   *
   * @return  Promise
   */
  function consumeBody() {
  	var _this4 = this;

  	if (this[INTERNALS].disturbed) {
  		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
  	}

  	this[INTERNALS].disturbed = true;

  	if (this[INTERNALS].error) {
  		return Body.Promise.reject(this[INTERNALS].error);
  	}

  	let body = this.body;

  	// body is null
  	if (body === null) {
  		return Body.Promise.resolve(Buffer.alloc(0));
  	}

  	// body is blob
  	if (isBlob(body)) {
  		body = body.stream();
  	}

  	// body is buffer
  	if (Buffer.isBuffer(body)) {
  		return Body.Promise.resolve(body);
  	}

  	// istanbul ignore if: should never happen
  	if (!(body instanceof Stream)) {
  		return Body.Promise.resolve(Buffer.alloc(0));
  	}

  	// body is stream
  	// get ready to actually consume the body
  	let accum = [];
  	let accumBytes = 0;
  	let abort = false;

  	return new Body.Promise(function (resolve, reject) {
  		let resTimeout;

  		// allow timeout on slow response body
  		if (_this4.timeout) {
  			resTimeout = setTimeout(function () {
  				abort = true;
  				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
  			}, _this4.timeout);
  		}

  		// handle stream errors
  		body.on('error', function (err) {
  			if (err.name === 'AbortError') {
  				// if the request was aborted, reject with this Error
  				abort = true;
  				reject(err);
  			} else {
  				// other errors, such as incorrect content-encoding
  				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
  			}
  		});

  		body.on('data', function (chunk) {
  			if (abort || chunk === null) {
  				return;
  			}

  			if (_this4.size && accumBytes + chunk.length > _this4.size) {
  				abort = true;
  				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
  				return;
  			}

  			accumBytes += chunk.length;
  			accum.push(chunk);
  		});

  		body.on('end', function () {
  			if (abort) {
  				return;
  			}

  			clearTimeout(resTimeout);

  			try {
  				resolve(Buffer.concat(accum, accumBytes));
  			} catch (err) {
  				// handle streams that have accumulated too much data (issue #414)
  				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
  			}
  		});
  	});
  }

  /**
   * Detect buffer encoding and convert to target encoding
   * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
   *
   * @param   Buffer  buffer    Incoming buffer
   * @param   String  encoding  Target encoding
   * @return  String
   */
  function convertBody(buffer, headers) {
  	if (typeof convert !== 'function') {
  		throw new Error('The package `encoding` must be installed to use the textConverted() function');
  	}

  	const ct = headers.get('content-type');
  	let charset = 'utf-8';
  	let res, str;

  	// header
  	if (ct) {
  		res = /charset=([^;]*)/i.exec(ct);
  	}

  	// no charset in content type, peek at response body for at most 1024 bytes
  	str = buffer.slice(0, 1024).toString();

  	// html5
  	if (!res && str) {
  		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
  	}

  	// html4
  	if (!res && str) {
  		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

  		if (res) {
  			res = /charset=(.*)/i.exec(res.pop());
  		}
  	}

  	// xml
  	if (!res && str) {
  		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
  	}

  	// found charset
  	if (res) {
  		charset = res.pop();

  		// prevent decode issues when sites use incorrect encoding
  		// ref: https://hsivonen.fi/encoding-menu/
  		if (charset === 'gb2312' || charset === 'gbk') {
  			charset = 'gb18030';
  		}
  	}

  	// turn raw buffers into a single utf-8 buffer
  	return convert(buffer, 'UTF-8', charset).toString();
  }

  /**
   * Detect a URLSearchParams object
   * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
   *
   * @param   Object  obj     Object to detect by type or brand
   * @return  String
   */
  function isURLSearchParams(obj) {
  	// Duck-typing as a necessary condition.
  	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
  		return false;
  	}

  	// Brand-checking and more duck-typing as optional condition.
  	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
  }

  /**
   * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
   * @param  {*} obj
   * @return {boolean}
   */
  function isBlob(obj) {
  	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
  }

  /**
   * Clone body given Res/Req instance
   *
   * @param   Mixed  instance  Response or Request instance
   * @return  Mixed
   */
  function clone(instance) {
  	let p1, p2;
  	let body = instance.body;

  	// don't allow cloning a used body
  	if (instance.bodyUsed) {
  		throw new Error('cannot clone body after it is used');
  	}

  	// check that body is a stream and not form-data object
  	// note: we can't clone the form-data object without having it as a dependency
  	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
  		// tee instance body
  		p1 = new PassThrough();
  		p2 = new PassThrough();
  		body.pipe(p1);
  		body.pipe(p2);
  		// set instance body to teed body and return the other teed body
  		instance[INTERNALS].body = p1;
  		body = p2;
  	}

  	return body;
  }

  /**
   * Performs the operation "extract a `Content-Type` value from |object|" as
   * specified in the specification:
   * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
   *
   * This function assumes that instance.body is present.
   *
   * @param   Mixed  instance  Any options.body input
   */
  function extractContentType(body) {
  	if (body === null) {
  		// body is null
  		return null;
  	} else if (typeof body === 'string') {
  		// body is string
  		return 'text/plain;charset=UTF-8';
  	} else if (isURLSearchParams(body)) {
  		// body is a URLSearchParams
  		return 'application/x-www-form-urlencoded;charset=UTF-8';
  	} else if (isBlob(body)) {
  		// body is blob
  		return body.type || null;
  	} else if (Buffer.isBuffer(body)) {
  		// body is buffer
  		return null;
  	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
  		// body is ArrayBuffer
  		return null;
  	} else if (ArrayBuffer.isView(body)) {
  		// body is ArrayBufferView
  		return null;
  	} else if (typeof body.getBoundary === 'function') {
  		// detect form data input from form-data module
  		return `multipart/form-data;boundary=${body.getBoundary()}`;
  	} else if (body instanceof Stream) {
  		// body is stream
  		// can't really do much about this
  		return null;
  	} else {
  		// Body constructor defaults other things to string
  		return 'text/plain;charset=UTF-8';
  	}
  }

  /**
   * The Fetch Standard treats this as if "total bytes" is a property on the body.
   * For us, we have to explicitly get it with a function.
   *
   * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
   *
   * @param   Body    instance   Instance of Body
   * @return  Number?            Number of bytes, or null if not possible
   */
  function getTotalBytes(instance) {
  	const body = instance.body;


  	if (body === null) {
  		// body is null
  		return 0;
  	} else if (isBlob(body)) {
  		return body.size;
  	} else if (Buffer.isBuffer(body)) {
  		// body is buffer
  		return body.length;
  	} else if (body && typeof body.getLengthSync === 'function') {
  		// detect form data input from form-data module
  		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
  		body.hasKnownLength && body.hasKnownLength()) {
  			// 2.x
  			return body.getLengthSync();
  		}
  		return null;
  	} else {
  		// body is stream
  		return null;
  	}
  }

  /**
   * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
   *
   * @param   Body    instance   Instance of Body
   * @return  Void
   */
  function writeToStream(dest, instance) {
  	const body = instance.body;


  	if (body === null) {
  		// body is null
  		dest.end();
  	} else if (isBlob(body)) {
  		body.stream().pipe(dest);
  	} else if (Buffer.isBuffer(body)) {
  		// body is buffer
  		dest.write(body);
  		dest.end();
  	} else {
  		// body is stream
  		body.pipe(dest);
  	}
  }

  // expose Promise
  Body.Promise = global.Promise;

  /**
   * headers.js
   *
   * Headers class offers convenient helpers
   */

  const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
  const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

  function validateName(name) {
  	name = `${name}`;
  	if (invalidTokenRegex.test(name) || name === '') {
  		throw new TypeError(`${name} is not a legal HTTP header name`);
  	}
  }

  function validateValue(value) {
  	value = `${value}`;
  	if (invalidHeaderCharRegex.test(value)) {
  		throw new TypeError(`${value} is not a legal HTTP header value`);
  	}
  }

  /**
   * Find the key in the map object given a header name.
   *
   * Returns undefined if not found.
   *
   * @param   String  name  Header name
   * @return  String|Undefined
   */
  function find(map, name) {
  	name = name.toLowerCase();
  	for (const key in map) {
  		if (key.toLowerCase() === name) {
  			return key;
  		}
  	}
  	return undefined;
  }

  const MAP = Symbol('map');
  class Headers {
  	/**
    * Headers class
    *
    * @param   Object  headers  Response headers
    * @return  Void
    */
  	constructor() {
  		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

  		this[MAP] = Object.create(null);

  		if (init instanceof Headers) {
  			const rawHeaders = init.raw();
  			const headerNames = Object.keys(rawHeaders);

  			for (const headerName of headerNames) {
  				for (const value of rawHeaders[headerName]) {
  					this.append(headerName, value);
  				}
  			}

  			return;
  		}

  		// We don't worry about converting prop to ByteString here as append()
  		// will handle it.
  		if (init == null) ; else if (typeof init === 'object') {
  			const method = init[Symbol.iterator];
  			if (method != null) {
  				if (typeof method !== 'function') {
  					throw new TypeError('Header pairs must be iterable');
  				}

  				// sequence<sequence<ByteString>>
  				// Note: per spec we have to first exhaust the lists then process them
  				const pairs = [];
  				for (const pair of init) {
  					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
  						throw new TypeError('Each header pair must be iterable');
  					}
  					pairs.push(Array.from(pair));
  				}

  				for (const pair of pairs) {
  					if (pair.length !== 2) {
  						throw new TypeError('Each header pair must be a name/value tuple');
  					}
  					this.append(pair[0], pair[1]);
  				}
  			} else {
  				// record<ByteString, ByteString>
  				for (const key of Object.keys(init)) {
  					const value = init[key];
  					this.append(key, value);
  				}
  			}
  		} else {
  			throw new TypeError('Provided initializer must be an object');
  		}
  	}

  	/**
    * Return combined header value given name
    *
    * @param   String  name  Header name
    * @return  Mixed
    */
  	get(name) {
  		name = `${name}`;
  		validateName(name);
  		const key = find(this[MAP], name);
  		if (key === undefined) {
  			return null;
  		}

  		return this[MAP][key].join(', ');
  	}

  	/**
    * Iterate over all headers
    *
    * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
    * @param   Boolean   thisArg   `this` context for callback function
    * @return  Void
    */
  	forEach(callback) {
  		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  		let pairs = getHeaders(this);
  		let i = 0;
  		while (i < pairs.length) {
  			var _pairs$i = pairs[i];
  			const name = _pairs$i[0],
  			      value = _pairs$i[1];

  			callback.call(thisArg, value, name, this);
  			pairs = getHeaders(this);
  			i++;
  		}
  	}

  	/**
    * Overwrite header values given name
    *
    * @param   String  name   Header name
    * @param   String  value  Header value
    * @return  Void
    */
  	set(name, value) {
  		name = `${name}`;
  		value = `${value}`;
  		validateName(name);
  		validateValue(value);
  		const key = find(this[MAP], name);
  		this[MAP][key !== undefined ? key : name] = [value];
  	}

  	/**
    * Append a value onto existing header
    *
    * @param   String  name   Header name
    * @param   String  value  Header value
    * @return  Void
    */
  	append(name, value) {
  		name = `${name}`;
  		value = `${value}`;
  		validateName(name);
  		validateValue(value);
  		const key = find(this[MAP], name);
  		if (key !== undefined) {
  			this[MAP][key].push(value);
  		} else {
  			this[MAP][name] = [value];
  		}
  	}

  	/**
    * Check for header name existence
    *
    * @param   String   name  Header name
    * @return  Boolean
    */
  	has(name) {
  		name = `${name}`;
  		validateName(name);
  		return find(this[MAP], name) !== undefined;
  	}

  	/**
    * Delete all header values given name
    *
    * @param   String  name  Header name
    * @return  Void
    */
  	delete(name) {
  		name = `${name}`;
  		validateName(name);
  		const key = find(this[MAP], name);
  		if (key !== undefined) {
  			delete this[MAP][key];
  		}
  	}

  	/**
    * Return raw headers (non-spec api)
    *
    * @return  Object
    */
  	raw() {
  		return this[MAP];
  	}

  	/**
    * Get an iterator on keys.
    *
    * @return  Iterator
    */
  	keys() {
  		return createHeadersIterator(this, 'key');
  	}

  	/**
    * Get an iterator on values.
    *
    * @return  Iterator
    */
  	values() {
  		return createHeadersIterator(this, 'value');
  	}

  	/**
    * Get an iterator on entries.
    *
    * This is the default iterator of the Headers object.
    *
    * @return  Iterator
    */
  	[Symbol.iterator]() {
  		return createHeadersIterator(this, 'key+value');
  	}
  }
  Headers.prototype.entries = Headers.prototype[Symbol.iterator];

  Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
  	value: 'Headers',
  	writable: false,
  	enumerable: false,
  	configurable: true
  });

  Object.defineProperties(Headers.prototype, {
  	get: { enumerable: true },
  	forEach: { enumerable: true },
  	set: { enumerable: true },
  	append: { enumerable: true },
  	has: { enumerable: true },
  	delete: { enumerable: true },
  	keys: { enumerable: true },
  	values: { enumerable: true },
  	entries: { enumerable: true }
  });

  function getHeaders(headers) {
  	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

  	const keys = Object.keys(headers[MAP]).sort();
  	return keys.map(kind === 'key' ? function (k) {
  		return k.toLowerCase();
  	} : kind === 'value' ? function (k) {
  		return headers[MAP][k].join(', ');
  	} : function (k) {
  		return [k.toLowerCase(), headers[MAP][k].join(', ')];
  	});
  }

  const INTERNAL = Symbol('internal');

  function createHeadersIterator(target, kind) {
  	const iterator = Object.create(HeadersIteratorPrototype);
  	iterator[INTERNAL] = {
  		target,
  		kind,
  		index: 0
  	};
  	return iterator;
  }

  const HeadersIteratorPrototype = Object.setPrototypeOf({
  	next() {
  		// istanbul ignore if
  		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
  			throw new TypeError('Value of `this` is not a HeadersIterator');
  		}

  		var _INTERNAL = this[INTERNAL];
  		const target = _INTERNAL.target,
  		      kind = _INTERNAL.kind,
  		      index = _INTERNAL.index;

  		const values = getHeaders(target, kind);
  		const len = values.length;
  		if (index >= len) {
  			return {
  				value: undefined,
  				done: true
  			};
  		}

  		this[INTERNAL].index = index + 1;

  		return {
  			value: values[index],
  			done: false
  		};
  	}
  }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

  Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
  	value: 'HeadersIterator',
  	writable: false,
  	enumerable: false,
  	configurable: true
  });

  /**
   * Export the Headers object in a form that Node.js can consume.
   *
   * @param   Headers  headers
   * @return  Object
   */
  function exportNodeCompatibleHeaders(headers) {
  	const obj = Object.assign({ __proto__: null }, headers[MAP]);

  	// http.request() only supports string as Host header. This hack makes
  	// specifying custom Host header possible.
  	const hostHeaderKey = find(headers[MAP], 'Host');
  	if (hostHeaderKey !== undefined) {
  		obj[hostHeaderKey] = obj[hostHeaderKey][0];
  	}

  	return obj;
  }

  /**
   * Create a Headers object from an object of headers, ignoring those that do
   * not conform to HTTP grammar productions.
   *
   * @param   Object  obj  Object of headers
   * @return  Headers
   */
  function createHeadersLenient(obj) {
  	const headers = new Headers();
  	for (const name of Object.keys(obj)) {
  		if (invalidTokenRegex.test(name)) {
  			continue;
  		}
  		if (Array.isArray(obj[name])) {
  			for (const val of obj[name]) {
  				if (invalidHeaderCharRegex.test(val)) {
  					continue;
  				}
  				if (headers[MAP][name] === undefined) {
  					headers[MAP][name] = [val];
  				} else {
  					headers[MAP][name].push(val);
  				}
  			}
  		} else if (!invalidHeaderCharRegex.test(obj[name])) {
  			headers[MAP][name] = [obj[name]];
  		}
  	}
  	return headers;
  }

  const INTERNALS$1 = Symbol('Response internals');

  // fix an issue where "STATUS_CODES" aren't a named export for node <10
  const STATUS_CODES = http.STATUS_CODES;

  /**
   * Response class
   *
   * @param   Stream  body  Readable stream
   * @param   Object  opts  Response options
   * @return  Void
   */
  class Response {
  	constructor() {
  		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  		Body.call(this, body, opts);

  		const status = opts.status || 200;
  		const headers = new Headers(opts.headers);

  		if (body != null && !headers.has('Content-Type')) {
  			const contentType = extractContentType(body);
  			if (contentType) {
  				headers.append('Content-Type', contentType);
  			}
  		}

  		this[INTERNALS$1] = {
  			url: opts.url,
  			status,
  			statusText: opts.statusText || STATUS_CODES[status],
  			headers,
  			counter: opts.counter
  		};
  	}

  	get url() {
  		return this[INTERNALS$1].url || '';
  	}

  	get status() {
  		return this[INTERNALS$1].status;
  	}

  	/**
    * Convenience property representing if the request ended normally
    */
  	get ok() {
  		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  	}

  	get redirected() {
  		return this[INTERNALS$1].counter > 0;
  	}

  	get statusText() {
  		return this[INTERNALS$1].statusText;
  	}

  	get headers() {
  		return this[INTERNALS$1].headers;
  	}

  	/**
    * Clone this response
    *
    * @return  Response
    */
  	clone() {
  		return new Response(clone(this), {
  			url: this.url,
  			status: this.status,
  			statusText: this.statusText,
  			headers: this.headers,
  			ok: this.ok,
  			redirected: this.redirected
  		});
  	}
  }

  Body.mixIn(Response.prototype);

  Object.defineProperties(Response.prototype, {
  	url: { enumerable: true },
  	status: { enumerable: true },
  	ok: { enumerable: true },
  	redirected: { enumerable: true },
  	statusText: { enumerable: true },
  	headers: { enumerable: true },
  	clone: { enumerable: true }
  });

  Object.defineProperty(Response.prototype, Symbol.toStringTag, {
  	value: 'Response',
  	writable: false,
  	enumerable: false,
  	configurable: true
  });

  const INTERNALS$2 = Symbol('Request internals');

  // fix an issue where "format", "parse" aren't a named export for node <10
  const parse_url = Url.parse;
  const format_url = Url.format;

  const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

  /**
   * Check if a value is an instance of Request.
   *
   * @param   Mixed   input
   * @return  Boolean
   */
  function isRequest(input) {
  	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
  }

  function isAbortSignal(signal) {
  	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
  	return !!(proto && proto.constructor.name === 'AbortSignal');
  }

  /**
   * Request class
   *
   * @param   Mixed   input  Url or Request instance
   * @param   Object  init   Custom options
   * @return  Void
   */
  class Request {
  	constructor(input) {
  		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  		let parsedURL;

  		// normalize input
  		if (!isRequest(input)) {
  			if (input && input.href) {
  				// in order to support Node.js' Url objects; though WHATWG's URL objects
  				// will fall into this branch also (since their `toString()` will return
  				// `href` property anyway)
  				parsedURL = parse_url(input.href);
  			} else {
  				// coerce input to a string before attempting to parse
  				parsedURL = parse_url(`${input}`);
  			}
  			input = {};
  		} else {
  			parsedURL = parse_url(input.url);
  		}

  		let method = init.method || input.method || 'GET';
  		method = method.toUpperCase();

  		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
  			throw new TypeError('Request with GET/HEAD method cannot have body');
  		}

  		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

  		Body.call(this, inputBody, {
  			timeout: init.timeout || input.timeout || 0,
  			size: init.size || input.size || 0
  		});

  		const headers = new Headers(init.headers || input.headers || {});

  		if (inputBody != null && !headers.has('Content-Type')) {
  			const contentType = extractContentType(inputBody);
  			if (contentType) {
  				headers.append('Content-Type', contentType);
  			}
  		}

  		let signal = isRequest(input) ? input.signal : null;
  		if ('signal' in init) signal = init.signal;

  		if (signal != null && !isAbortSignal(signal)) {
  			throw new TypeError('Expected signal to be an instanceof AbortSignal');
  		}

  		this[INTERNALS$2] = {
  			method,
  			redirect: init.redirect || input.redirect || 'follow',
  			headers,
  			parsedURL,
  			signal
  		};

  		// node-fetch-only options
  		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
  		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
  		this.counter = init.counter || input.counter || 0;
  		this.agent = init.agent || input.agent;
  	}

  	get method() {
  		return this[INTERNALS$2].method;
  	}

  	get url() {
  		return format_url(this[INTERNALS$2].parsedURL);
  	}

  	get headers() {
  		return this[INTERNALS$2].headers;
  	}

  	get redirect() {
  		return this[INTERNALS$2].redirect;
  	}

  	get signal() {
  		return this[INTERNALS$2].signal;
  	}

  	/**
    * Clone this request
    *
    * @return  Request
    */
  	clone() {
  		return new Request(this);
  	}
  }

  Body.mixIn(Request.prototype);

  Object.defineProperty(Request.prototype, Symbol.toStringTag, {
  	value: 'Request',
  	writable: false,
  	enumerable: false,
  	configurable: true
  });

  Object.defineProperties(Request.prototype, {
  	method: { enumerable: true },
  	url: { enumerable: true },
  	headers: { enumerable: true },
  	redirect: { enumerable: true },
  	clone: { enumerable: true },
  	signal: { enumerable: true }
  });

  /**
   * Convert a Request to Node.js http request options.
   *
   * @param   Request  A Request instance
   * @return  Object   The options object to be passed to http.request
   */
  function getNodeRequestOptions(request) {
  	const parsedURL = request[INTERNALS$2].parsedURL;
  	const headers = new Headers(request[INTERNALS$2].headers);

  	// fetch step 1.3
  	if (!headers.has('Accept')) {
  		headers.set('Accept', '*/*');
  	}

  	// Basic fetch
  	if (!parsedURL.protocol || !parsedURL.hostname) {
  		throw new TypeError('Only absolute URLs are supported');
  	}

  	if (!/^https?:$/.test(parsedURL.protocol)) {
  		throw new TypeError('Only HTTP(S) protocols are supported');
  	}

  	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
  		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
  	}

  	// HTTP-network-or-cache fetch steps 2.4-2.7
  	let contentLengthValue = null;
  	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
  		contentLengthValue = '0';
  	}
  	if (request.body != null) {
  		const totalBytes = getTotalBytes(request);
  		if (typeof totalBytes === 'number') {
  			contentLengthValue = String(totalBytes);
  		}
  	}
  	if (contentLengthValue) {
  		headers.set('Content-Length', contentLengthValue);
  	}

  	// HTTP-network-or-cache fetch step 2.11
  	if (!headers.has('User-Agent')) {
  		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
  	}

  	// HTTP-network-or-cache fetch step 2.15
  	if (request.compress && !headers.has('Accept-Encoding')) {
  		headers.set('Accept-Encoding', 'gzip,deflate');
  	}

  	let agent = request.agent;
  	if (typeof agent === 'function') {
  		agent = agent(parsedURL);
  	}

  	if (!headers.has('Connection') && !agent) {
  		headers.set('Connection', 'close');
  	}

  	// HTTP-network fetch step 4.2
  	// chunked encoding is handled by Node.js

  	return Object.assign({}, parsedURL, {
  		method: request.method,
  		headers: exportNodeCompatibleHeaders(headers),
  		agent
  	});
  }

  /**
   * abort-error.js
   *
   * AbortError interface for cancelled requests
   */

  /**
   * Create AbortError instance
   *
   * @param   String      message      Error message for human
   * @return  AbortError
   */
  function AbortError(message) {
    Error.call(this, message);

    this.type = 'aborted';
    this.message = message;

    // hide custom error implementation details from end-users
    Error.captureStackTrace(this, this.constructor);
  }

  AbortError.prototype = Object.create(Error.prototype);
  AbortError.prototype.constructor = AbortError;
  AbortError.prototype.name = 'AbortError';

  // fix an issue where "PassThrough", "resolve" aren't a named export for node <10
  const PassThrough$1 = Stream.PassThrough;
  const resolve_url = Url.resolve;

  /**
   * Fetch function
   *
   * @param   Mixed    url   Absolute url or Request instance
   * @param   Object   opts  Fetch options
   * @return  Promise
   */
  function fetch(url, opts) {

  	// allow custom promise
  	if (!fetch.Promise) {
  		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
  	}

  	Body.Promise = fetch.Promise;

  	// wrap http.request into fetch
  	return new fetch.Promise(function (resolve, reject) {
  		// build request object
  		const request = new Request(url, opts);
  		const options = getNodeRequestOptions(request);

  		const send = (options.protocol === 'https:' ? https : http).request;
  		const signal = request.signal;

  		let response = null;

  		const abort = function abort() {
  			let error = new AbortError('The user aborted a request.');
  			reject(error);
  			if (request.body && request.body instanceof Stream.Readable) {
  				request.body.destroy(error);
  			}
  			if (!response || !response.body) return;
  			response.body.emit('error', error);
  		};

  		if (signal && signal.aborted) {
  			abort();
  			return;
  		}

  		const abortAndFinalize = function abortAndFinalize() {
  			abort();
  			finalize();
  		};

  		// send request
  		const req = send(options);
  		let reqTimeout;

  		if (signal) {
  			signal.addEventListener('abort', abortAndFinalize);
  		}

  		function finalize() {
  			req.abort();
  			if (signal) signal.removeEventListener('abort', abortAndFinalize);
  			clearTimeout(reqTimeout);
  		}

  		if (request.timeout) {
  			req.once('socket', function (socket) {
  				reqTimeout = setTimeout(function () {
  					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
  					finalize();
  				}, request.timeout);
  			});
  		}

  		req.on('error', function (err) {
  			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
  			finalize();
  		});

  		req.on('response', function (res) {
  			clearTimeout(reqTimeout);

  			const headers = createHeadersLenient(res.headers);

  			// HTTP fetch step 5
  			if (fetch.isRedirect(res.statusCode)) {
  				// HTTP fetch step 5.2
  				const location = headers.get('Location');

  				// HTTP fetch step 5.3
  				const locationURL = location === null ? null : resolve_url(request.url, location);

  				// HTTP fetch step 5.5
  				switch (request.redirect) {
  					case 'error':
  						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
  						finalize();
  						return;
  					case 'manual':
  						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
  						if (locationURL !== null) {
  							// handle corrupted header
  							try {
  								headers.set('Location', locationURL);
  							} catch (err) {
  								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
  								reject(err);
  							}
  						}
  						break;
  					case 'follow':
  						// HTTP-redirect fetch step 2
  						if (locationURL === null) {
  							break;
  						}

  						// HTTP-redirect fetch step 5
  						if (request.counter >= request.follow) {
  							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
  							finalize();
  							return;
  						}

  						// HTTP-redirect fetch step 6 (counter increment)
  						// Create a new Request object.
  						const requestOpts = {
  							headers: new Headers(request.headers),
  							follow: request.follow,
  							counter: request.counter + 1,
  							agent: request.agent,
  							compress: request.compress,
  							method: request.method,
  							body: request.body,
  							signal: request.signal,
  							timeout: request.timeout
  						};

  						// HTTP-redirect fetch step 9
  						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
  							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
  							finalize();
  							return;
  						}

  						// HTTP-redirect fetch step 11
  						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
  							requestOpts.method = 'GET';
  							requestOpts.body = undefined;
  							requestOpts.headers.delete('content-length');
  						}

  						// HTTP-redirect fetch step 15
  						resolve(fetch(new Request(locationURL, requestOpts)));
  						finalize();
  						return;
  				}
  			}

  			// prepare response
  			res.once('end', function () {
  				if (signal) signal.removeEventListener('abort', abortAndFinalize);
  			});
  			let body = res.pipe(new PassThrough$1());

  			const response_options = {
  				url: request.url,
  				status: res.statusCode,
  				statusText: res.statusMessage,
  				headers: headers,
  				size: request.size,
  				timeout: request.timeout,
  				counter: request.counter
  			};

  			// HTTP-network fetch step 12.1.1.3
  			const codings = headers.get('Content-Encoding');

  			// HTTP-network fetch step 12.1.1.4: handle content codings

  			// in following scenarios we ignore compression support
  			// 1. compression support is disabled
  			// 2. HEAD request
  			// 3. no Content-Encoding header
  			// 4. no content response (204)
  			// 5. content not modified response (304)
  			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
  				response = new Response(body, response_options);
  				resolve(response);
  				return;
  			}

  			// For Node v6+
  			// Be less strict when decoding compressed responses, since sometimes
  			// servers send slightly invalid responses that are still accepted
  			// by common browsers.
  			// Always using Z_SYNC_FLUSH is what cURL does.
  			const zlibOptions = {
  				flush: zlib.Z_SYNC_FLUSH,
  				finishFlush: zlib.Z_SYNC_FLUSH
  			};

  			// for gzip
  			if (codings == 'gzip' || codings == 'x-gzip') {
  				body = body.pipe(zlib.createGunzip(zlibOptions));
  				response = new Response(body, response_options);
  				resolve(response);
  				return;
  			}

  			// for deflate
  			if (codings == 'deflate' || codings == 'x-deflate') {
  				// handle the infamous raw deflate response from old servers
  				// a hack for old IIS and Apache servers
  				const raw = res.pipe(new PassThrough$1());
  				raw.once('data', function (chunk) {
  					// see http://stackoverflow.com/questions/37519828
  					if ((chunk[0] & 0x0F) === 0x08) {
  						body = body.pipe(zlib.createInflate());
  					} else {
  						body = body.pipe(zlib.createInflateRaw());
  					}
  					response = new Response(body, response_options);
  					resolve(response);
  				});
  				return;
  			}

  			// for br
  			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
  				body = body.pipe(zlib.createBrotliDecompress());
  				response = new Response(body, response_options);
  				resolve(response);
  				return;
  			}

  			// otherwise, use response as-is
  			response = new Response(body, response_options);
  			resolve(response);
  		});

  		writeToStream(req, request);
  	});
  }
  /**
   * Redirect code matching
   *
   * @param   Number   code  Status code
   * @return  Boolean
   */
  fetch.isRedirect = function (code) {
  	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
  };

  // expose Promise
  fetch.Promise = global.Promise;

  var lib = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': fetch,
    Headers: Headers,
    Request: Request,
    Response: Response,
    FetchError: FetchError
  });

  var nodeFetch = getCjsExportFromNamespace(lib);

  var nodePonyfill = createCommonjsModule(function (module, exports) {
  var realFetch = nodeFetch.default || nodeFetch;

  var fetch = function (url, options) {
    // Support schemaless URIs on the server for parity with the browser.
    // Ex: //github.com/ -> https://github.com/
    if (/^\/\//.test(url)) {
      url = 'https:' + url;
    }
    return realFetch.call(this, url, options)
  };

  module.exports = exports = fetch;
  exports.fetch = fetch;
  exports.Headers = nodeFetch.Headers;
  exports.Request = nodeFetch.Request;
  exports.Response = nodeFetch.Response;

  // Needed for TypeScript consumers without esModuleInterop.
  exports.default = fetch;
  });

  var HttpResponse = /*#__PURE__*/function () {
    function HttpResponse(response) {
      this.url = '';
      this.status = 0;
      this.statusText = '';
      this.ok = false;
      this.redirected = false;
      this.data = null;

      if (response) {
        this.url = response.url;
        this.status = response.status;
        this.statusText = response.statusText;
        this.ok = response.ok;
        this.redirected = response.redirected;
      }
    }

    _createClass(HttpResponse, [{
      key: "static",
      get: function get() {
        return this.url.indexOf('.json') === this.url.length - 5;
      }
    }]);

    return HttpResponse;
  }();

  var HttpService = /*#__PURE__*/function () {
    function HttpService() {}

    HttpService.http$ = function http$(method, url, data, format) {
      var _this = this;

      if (format === void 0) {
        format = 'json';
      }

      method = url.indexOf('.json') !== -1 ? 'GET' : method;
      var methods = ['POST', 'PUT', 'PATCH'];
      var response_ = null;
      this.pendingRequests$.next(this.pendingRequests$.getValue() + 1);
      return rxjs.from(nodePonyfill(url, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
      }).then(function (response) {
        response_ = new HttpResponse(response);

        if (typeof response[format] === 'function') {
          return response[format]().then(function (json) {
            response_.data = json;

            if (response.ok) {
              return Promise.resolve(response_);
            } else {
              return Promise.reject(response_);
            }
          });
        } else {
          return Promise.reject(response_);
        }
      })).pipe(operators.catchError(function (error) {
        console.log('error', error);
        return rxjs.throwError(_this.getError(error, response_));
      }), operators.finalize(function () {
        _this.pendingRequests$.next(_this.pendingRequests$.getValue() - 1);
      }));
    };

    HttpService.get$ = function get$(url, data, format) {
      var query = this.query(data);
      return this.http$('GET', "" + url + query, undefined, format);
    };

    HttpService.delete$ = function delete$(url) {
      return this.http$('DELETE', url);
    };

    HttpService.post$ = function post$(url, data) {
      return this.http$('POST', url, data);
    };

    HttpService.put$ = function put$(url, data) {
      return this.http$('PUT', url, data);
    };

    HttpService.patch$ = function patch$(url, data) {
      return this.http$('PATCH', url, data);
    };

    HttpService.query = function query(data) {
      return ''; // todo
    };

    HttpService.getError = function getError(object, response) {
      var error = typeof object === 'object' ? object : {};

      if (!error.statusCode) {
        error.statusCode = response ? response.status : 0;
      }

      if (!error.statusMessage) {
        error.statusMessage = response ? response.statusText : object;
      } // console.log('HttpService.getError', error, object);


      return error;
    };

    return HttpService;
  }();
  HttpService.pendingRequests$ = new rxjs.BehaviorSubject(0);

  var AppComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(AppComponent, _Component);

    function AppComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = AppComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.items = new Array(4).fill(0).map(function (x, i) {
        return {
          title: "item " + (i + 1),
          completed: Math.random() > 0.75
        };
      });
      this.flag = true;
      this.active = false; // console.log('AppComponent.onInit', this);

      HttpService.get$('https://jsonplaceholder.typicode.com/users/1/todos').pipe(operators.first()).subscribe(function (response) {
        console.log('AppComponent.items', response);
        _this.items = response.data;

        _this.pushChanges();
      });
    };

    _proto.onClick = function onClick(item) {
      console.log('onClick', item);
    };

    return AppComponent;
  }(rxcomp.Component);
  AppComponent.meta = {
    selector: '[app-component]'
  };

  var AppModule = /*#__PURE__*/function (_Module) {
    _inheritsLoose(AppModule, _Module);

    function AppModule() {
      return _Module.apply(this, arguments) || this;
    }

    return AppModule;
  }(rxcomp.Module);
  AppModule.meta = {
    imports: [rxcomp.CoreModule],
    declarations: [],
    bootstrap: AppComponent
  };

  function renderServer(html) {
    // console.log(html);
    // const doc = Renderer.parse(html);
    // const serialized = doc.serialize();
    // console.log(doc);
    // console.log(serialized);
    // document.getElementById('app').innerHTML = serialized;
    var module = Server.bootstrap(AppModule, html);

    return HttpService.pendingRequests$.pipe(operators.filter(function (x) {
      return x === 0;
    }), operators.map(function (x) {
      return Server.serialize();
    }), operators.first());
  }

  exports.renderServer = renderServer;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=main.server.umd.js.map
