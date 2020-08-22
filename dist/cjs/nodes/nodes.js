"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneNode = exports.querySelector = exports.querySelectorAll = exports.matchSelectors = exports.matchSelector = exports.getQueries = exports.parse = exports.isRxProcessingInstruction = exports.isRxDocumentType = exports.isRxDocumentFragment = exports.isRxDocument = exports.isRxComment = exports.isRxText = exports.isRxElement = exports.RxDocument = exports.RxDocumentFragment = exports.RxDocumentType = exports.RxProcessingInstruction = exports.RxComment = exports.RxCData = exports.RxText = exports.RxElement = exports.RxClassList = exports.RxStyle = exports.RxNode = exports.RxQuery = exports.RxSelector = exports.SelectorType = exports.RxNodeType = void 0;
var tslib_1 = require("tslib");
var htmlparser2_1 = require("htmlparser2");
var location_1 = require("../location/location");
// export const NO_CHILDS = ['title','base','meta','link','img','br','input',];
// const SKIP = ['html','head','title','base','meta','script','link','body',];
// document.createComment = nodeValue => { return new RxComment(null, nodeValue); };
// document.createTextNode = nodeValue => { return new RxText(null, nodeValue); };
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
})(RxNodeType = exports.RxNodeType || (exports.RxNodeType = {}));
var SelectorType;
(function (SelectorType) {
    SelectorType[SelectorType["None"] = -1] = "None";
    SelectorType[SelectorType["Id"] = 0] = "Id";
    SelectorType[SelectorType["Class"] = 1] = "Class";
    SelectorType[SelectorType["Attribute"] = 2] = "Attribute";
    SelectorType[SelectorType["TagName"] = 3] = "TagName";
})(SelectorType = exports.SelectorType || (exports.SelectorType = {}));
var RxSelector = /** @class */ (function () {
    function RxSelector(options) {
        this.selector = '';
        this.type = SelectorType.None;
        this.negate = false;
        if (options) {
            Object.assign(this, options);
        }
    }
    return RxSelector;
}());
exports.RxSelector = RxSelector;
var RxQuery = /** @class */ (function () {
    function RxQuery(options) {
        this.selector = '';
        this.selectors = [];
        this.inner = false;
        if (options) {
            Object.assign(this, options);
        }
    }
    return RxQuery;
}());
exports.RxQuery = RxQuery;
var RxNode = /** @class */ (function () {
    function RxNode(parentNode) {
        if (parentNode === void 0) { parentNode = null; }
        this.nodeValue = null;
        this.parentNode = parentNode;
        this.nodeType = -1;
    }
    RxNode.prototype.cloneNode = function (deep) {
        if (deep === void 0) { deep = false; }
        return cloneNode.apply(this, [this, deep]);
    };
    RxNode.prototype.serialize = function () {
        return "";
    };
    return RxNode;
}());
exports.RxNode = RxNode;
var RxStyle = /** @class */ (function () {
    function RxStyle(node) {
        Object.defineProperty(this, 'node', {
            value: node,
            writable: false,
            enumerable: false
        });
        this.init();
    }
    RxStyle.prototype.item = function (index) {
        var keys = Object.keys(this);
        if (keys.length > index) {
            return keys[index];
        }
        else {
            return undefined;
        }
    };
    RxStyle.prototype.getPropertyPriority = function (key) {
        var value = this[key];
        if (value && value.indexOf('!important')) {
            return 'important';
        }
        else {
            return '';
        }
    };
    RxStyle.prototype.getPropertyValue = function (key) {
        return this[key];
    };
    RxStyle.prototype.setProperty = function (key, value, important) {
        this[key] = value + (important === 'important' ? '!important' : '');
        this.serialize_();
    };
    RxStyle.prototype.removeProperty = function (key) {
        delete this[key];
        this.serialize_();
    };
    RxStyle.prototype.serialize_ = function () {
        var _this = this;
        this.node.attributes.style = Object.keys(this).map(function (key) {
            return key + ": " + _this[key] + ";";
        }).join(' ');
    };
    RxStyle.prototype.init = function () {
        var _this = this;
        var _a;
        var keys = Object.keys(this);
        keys.forEach(function (key) { return delete _this[key]; });
        if ((_a = this.node.attributes) === null || _a === void 0 ? void 0 : _a.style) {
            var regex = /([^:]+):([^;]+);?\s*/gm;
            var matches = tslib_1.__spread(this.node.attributes.style.matchAll(regex));
            matches.forEach(function (match) {
                var key = match[1];
                var value = match[2];
                _this[key] = value;
            });
        }
    };
    return RxStyle;
}());
exports.RxStyle = RxStyle;
var RxClassList = /** @class */ (function (_super) {
    tslib_1.__extends(RxClassList, _super);
    function RxClassList(node) {
        var _this = _super.call(this) || this;
        _this.node = node;
        _this.init();
        return _this;
    }
    RxClassList.prototype.item = function (index) {
        return this[index];
    };
    RxClassList.prototype.contains = function (name) {
        return this.indexOf(name) !== -1;
    };
    RxClassList.prototype.add = function () {
        var _this = this;
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        names.forEach(function (name) {
            if (_this.indexOf(name) !== -1) {
                _this.push(name);
            }
        });
        this.serialize_();
    };
    RxClassList.prototype.remove = function () {
        var _this = this;
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        names.forEach(function (name) {
            var index = _this.indexOf(name);
            if (index !== -1) {
                _this.splice(index, 1);
            }
        });
        this.serialize_();
    };
    RxClassList.prototype.toggle = function (name, force) {
        var index = this.indexOf(name);
        if (force === false) {
            this.splice(index, 1);
            this.serialize_();
            return false;
        }
        else if (force === true) {
            this.push(name);
            this.serialize_();
            return true;
        }
        else if (index !== -1) {
            this.splice(index, 1);
            this.serialize_();
            return false;
        }
        else {
            this.push(name);
            this.serialize_();
            return true;
        }
    };
    RxClassList.prototype.replace = function (oldClass, newClass) {
        var index = this.indexOf(oldClass);
        if (index !== -1) {
            this.splice(index, 1);
        }
        this.push(newClass);
        this.serialize_();
    };
    RxClassList.prototype.serialize_ = function () {
        this.node.attributes.class = this.join(' ');
    };
    RxClassList.prototype.init = function () {
        var _a;
        this.length = 0;
        if ((_a = this.node.attributes) === null || _a === void 0 ? void 0 : _a.class) {
            Array.prototype.push.apply(this, this.node.attributes.class.split(' ').map(function (name) { return name.trim(); }));
        }
    };
    return RxClassList;
}(Array));
exports.RxClassList = RxClassList;
var RxElement = /** @class */ (function (_super) {
    tslib_1.__extends(RxElement, _super);
    function RxElement(parentNode, nodeName, attributes) {
        if (parentNode === void 0) { parentNode = null; }
        if (attributes === void 0) { attributes = null; }
        var _this = _super.call(this, parentNode) || this;
        _this.attributes = {};
        _this.nodeType = RxNodeType.ELEMENT_NODE;
        _this.nodeName = nodeName;
        if (attributes && typeof attributes === 'object') {
            _this.attributes = attributes;
        }
        _this.style = new RxStyle(_this);
        _this.classList = new RxClassList(_this);
        _this.childNodes = [];
        return _this;
        /*
            if (SKIP.indexOf(nodeName) === -1) {
                console.log(parentNode.nodeName, '>', nodeName);
        }
        */
    }
    Object.defineProperty(RxElement.prototype, "children", {
        get: function () {
            var children = [], i = 0, node, nodes = this.childNodes;
            node = nodes[i++];
            while (node) {
                node = nodes[i++];
                if (node.nodeType === RxNodeType.ELEMENT_NODE) {
                    children.push(node);
                }
            }
            return children;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxElement.prototype, "childElementCount", {
        get: function () {
            var i = 0, count = 0, node, nodes = this.childNodes;
            node = nodes[i++];
            while (node) {
                if (node.nodeType === RxNodeType.ELEMENT_NODE) {
                    count++;
                }
                node = nodes[i++];
            }
            return count;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxElement.prototype, "firstChild", {
        get: function () {
            var node = null;
            if (this.childNodes.length) {
                node = this.childNodes[0];
            }
            return node;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxElement.prototype, "firstElementChild", {
        get: function () {
            var e_1, _a;
            try {
                for (var _b = tslib_1.__values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var node = _c.value;
                    if (isRxElement(node)) {
                        return node;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxElement.prototype, "lastChild", {
        get: function () {
            var node = null;
            if (this.childNodes.length) {
                node = this.childNodes[this.childNodes.length - 1];
            }
            return node;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxElement.prototype, "lastElementChild", {
        get: function () {
            var nodes = this.childNodes;
            for (var i = nodes.length - 1; i > -1; i--) {
                var node = nodes[i];
                if (isRxElement(node)) {
                    return node;
                }
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxElement.prototype, "previousSibling", {
        get: function () {
            var node = null;
            if (this.parentNode) {
                var index = this.parentNode.childNodes.indexOf(this);
                if (index > 0) {
                    node = this.parentNode.childNodes[index - 1];
                }
            }
            return node;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxElement.prototype, "nextSibling", {
        get: function () {
            var node = null;
            if (this.parentNode) {
                var index = this.parentNode.childNodes.indexOf(this);
                if (index !== -1 && index < this.parentNode.childNodes.length - 1) {
                    node = this.parentNode.childNodes[index];
                }
            }
            return node;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxElement.prototype, "wholeText", {
        get: function () {
            var nodeValue;
            if (this.nodeType === RxNodeType.TEXT_NODE) {
                return this.nodeValue;
            }
            return nodeValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxElement.prototype, "outerHTML", {
        get: function () {
            var html = null;
            if (this.parentNode) {
                html = this.parentNode.serialize();
            }
            return html;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxElement.prototype, "innerText", {
        get: function () {
            // return this.childNodes.filter((n): n is RxText => isRxText(n)).map(n => n.innerText).join('');
            return this.childNodes.filter(function (n) { return isRxText(n) || isRxElement(n); }).map(function (n) { return n.innerText; }).join('');
        },
        set: function (nodeValue) {
            this.childNodes = [new RxText(this, nodeValue)];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxElement.prototype, "textContent", {
        get: function () {
            return this.innerText;
        },
        set: function (nodeValue) {
            this.innerText = String(nodeValue);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxElement.prototype, "innerHTML", {
        get: function () {
            return this.childNodes.map(function (x) { return x.serialize(); }).join('');
        },
        set: function (html) {
            var _this = this;
            var doc = parse(html);
            var childNodes = doc.childNodes.map(function (n) {
                n.parentNode = _this;
                return n;
            });
            this.childNodes = childNodes;
        },
        enumerable: false,
        configurable: true
    });
    RxElement.prototype.append = function () {
        var _this = this;
        var nodesOrDOMStrings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodesOrDOMStrings[_i] = arguments[_i];
        }
        nodesOrDOMStrings = nodesOrDOMStrings.map(function (nodeOrDomString) {
            var node;
            if (typeof nodeOrDomString === 'string') {
                node = new RxText(_this, nodeOrDomString);
            }
            else {
                node = nodeOrDomString;
                node.parentNode = _this;
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
    RxElement.prototype.prepend = function () {
        var _this = this;
        var nodesOrDOMStrings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodesOrDOMStrings[_i] = arguments[_i];
        }
        nodesOrDOMStrings = nodesOrDOMStrings.map(function (nodeOrDomString) {
            var node;
            if (typeof nodeOrDomString === 'string') {
                node = new RxText(_this, nodeOrDomString);
            }
            else {
                node = nodeOrDomString;
                node.parentNode = _this;
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
    RxElement.prototype.replaceChildren = function () {
        var _this = this;
        var nodesOrDOMStrings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodesOrDOMStrings[_i] = arguments[_i];
        }
        var nodes = nodesOrDOMStrings.map(function (nodeOrDomString) {
            var node;
            if (typeof nodeOrDomString === 'string') {
                node = new RxText(_this, nodeOrDomString);
            }
            else {
                node = nodeOrDomString;
                node.parentNode = _this;
            }
            return node;
        });
        this.childNodes = nodes;
    };
    RxElement.prototype.querySelectorAll = function (selector) {
        var queries = getQueries(selector);
        var nodes = this.childNodes.filter(function (x) {
            return true;
        });
        console.log(queries);
        return nodes.length ? nodes : null;
    };
    RxElement.prototype.querySelector = function (selector) {
        var queries = getQueries(selector);
        var node = querySelector(queries, this.childNodes);
        return node;
    };
    RxElement.prototype.hasAttribute = function (attribute) {
        return Object.keys(this.attributes).indexOf(attribute.toLowerCase()) !== -1;
    };
    RxElement.prototype.getAttribute = function (attribute) {
        return this.attributes[attribute.toLowerCase()] || null;
    };
    RxElement.prototype.setAttribute = function (attribute, value) {
        this.attributes[attribute.toLowerCase()] = value.toString();
        if (attribute === 'style') {
            this.style.init();
        }
        else if (attribute === 'class') {
            this.classList.init();
        }
    };
    RxElement.prototype.removeAttribute = function (attribute) {
        delete this.attributes[attribute];
        if (attribute === 'style') {
            this.style.init();
        }
        else if (attribute === 'class') {
            this.classList.init();
        }
    };
    RxElement.prototype.replaceChild = function (newChild, oldChild) {
        var index = this.childNodes.indexOf(oldChild);
        if (index !== -1) {
            this.childNodes[index] = newChild;
            newChild.parentNode = this;
        }
        // console.log('replaceChild', this, newChild, oldChild);
        return oldChild;
    };
    RxElement.prototype.removeChild = function (child) {
        if (!(child instanceof RxNode)) {
            throw new Error("Uncaught TypeError: Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'.");
        }
        var index = this.childNodes.indexOf(child);
        if (index === -1) {
            throw new Error("Uncaught NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.");
        }
        this.childNodes.splice(index, 1);
        // console.log('removeChild', this.childNodes.length);
        return child;
    };
    RxElement.prototype.insertBefore = function (newNode, referenceNode) {
        if (referenceNode === void 0) { referenceNode = null; }
        var index = referenceNode
            ? this.childNodes.indexOf(referenceNode)
            : this.childNodes.length;
        if (index !== -1) {
            this.childNodes.splice(index, 0, newNode);
            newNode.parentNode = this;
        }
        // console.log('insertBefore', this, newNode, referenceNode);
        return newNode;
    };
    RxElement.prototype.cloneNode = function (deep) {
        if (deep === void 0) { deep = false; }
        return cloneNode.apply(this, [this, deep]);
    };
    RxElement.prototype.addListener = function (eventName, handler) { };
    RxElement.prototype.removeListener = function (eventName, handler) { };
    RxElement.prototype.serialize = function () {
        return "<" + this.nodeName + this.serializeAttributes() + ">" + this.childNodes
            .map(function (x) { return x.serialize(); })
            .join('') + "</" + this.nodeName + ">";
    };
    RxElement.prototype.serializeAttributes = function () {
        var _this = this;
        var attributes = '';
        var keys = Object.keys(this.attributes);
        if (keys.length) {
            attributes =
                ' ' +
                    keys
                        .map(function (k) {
                        return k + "=\"" + _this.attributes[k] + "\"";
                    })
                        .join(' ');
        }
        return attributes;
    };
    return RxElement;
}(RxNode));
exports.RxElement = RxElement;
var RxText = /** @class */ (function (_super) {
    tslib_1.__extends(RxText, _super);
    function RxText(parentNode, nodeValue) {
        if (parentNode === void 0) { parentNode = null; }
        var _this = _super.call(this, parentNode) || this;
        _this.nodeType = RxNodeType.TEXT_NODE;
        _this.nodeValue = String(nodeValue);
        return _this;
        // console.log('RxText', nodeValue);
    }
    Object.defineProperty(RxText.prototype, "outerHTML", {
        get: function () {
            var html = null;
            if (this.parentNode) {
                html = this.parentNode.serialize();
            }
            return html;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxText.prototype, "wholeText", {
        get: function () {
            return this.nodeValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxText.prototype, "innerText", {
        get: function () {
            return this.nodeValue;
        },
        set: function (nodeValue) {
            this.nodeValue = String(nodeValue);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxText.prototype, "textContent", {
        get: function () {
            return this.nodeValue;
        },
        set: function (nodeValue) {
            this.nodeValue = String(nodeValue);
        },
        enumerable: false,
        configurable: true
    });
    RxText.prototype.serialize = function () {
        return this.nodeValue;
    };
    return RxText;
}(RxNode));
exports.RxText = RxText;
var RxCData = /** @class */ (function (_super) {
    tslib_1.__extends(RxCData, _super);
    function RxCData(parentNode, nodeValue) {
        if (parentNode === void 0) { parentNode = null; }
        var _this = _super.call(this, parentNode) || this;
        _this.nodeType = RxNodeType.CDATA_SECTION_NODE;
        _this.nodeValue = String(nodeValue);
        return _this;
    }
    Object.defineProperty(RxCData.prototype, "outerHTML", {
        get: function () {
            var html = null;
            if (this.parentNode) {
                html = this.parentNode.serialize();
            }
            return html;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxCData.prototype, "wholeText", {
        get: function () {
            return this.nodeValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxCData.prototype, "innerText", {
        get: function () {
            return this.nodeValue;
        },
        set: function (nodeValue) {
            this.nodeValue = String(nodeValue);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxCData.prototype, "textContent", {
        get: function () {
            return this.nodeValue;
        },
        set: function (nodeValue) {
            this.nodeValue = String(nodeValue);
        },
        enumerable: false,
        configurable: true
    });
    RxCData.prototype.serialize = function () {
        return this.nodeValue;
    };
    return RxCData;
}(RxNode));
exports.RxCData = RxCData;
var RxComment = /** @class */ (function (_super) {
    tslib_1.__extends(RxComment, _super);
    function RxComment(parentNode, nodeValue) {
        if (parentNode === void 0) { parentNode = null; }
        var _this = _super.call(this, parentNode) || this;
        _this.nodeType = RxNodeType.COMMENT_NODE;
        _this.nodeValue = String(nodeValue);
        return _this;
    }
    Object.defineProperty(RxComment.prototype, "outerHTML", {
        get: function () {
            var html = null;
            if (this.parentNode) {
                html = this.parentNode.serialize();
            }
            return html;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxComment.prototype, "wholeText", {
        get: function () {
            return this.nodeValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxComment.prototype, "innerText", {
        get: function () {
            return this.nodeValue;
        },
        set: function (nodeValue) {
            this.nodeValue = String(nodeValue);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxComment.prototype, "textContent", {
        get: function () {
            return this.nodeValue;
        },
        set: function (nodeValue) {
            this.nodeValue = String(nodeValue);
        },
        enumerable: false,
        configurable: true
    });
    RxComment.prototype.serialize = function () {
        return "<!--" + this.nodeValue + "-->";
    };
    return RxComment;
}(RxNode));
exports.RxComment = RxComment;
var RxProcessingInstruction = /** @class */ (function (_super) {
    tslib_1.__extends(RxProcessingInstruction, _super);
    function RxProcessingInstruction(parentNode, nodeValue) {
        if (parentNode === void 0) { parentNode = null; }
        var _this = _super.call(this, parentNode) || this;
        _this.nodeType = RxNodeType.PROCESSING_INSTRUCTION_NODE;
        _this.nodeValue = String(nodeValue);
        return _this;
    }
    RxProcessingInstruction.prototype.serialize = function () {
        return "<" + this.nodeValue + ">";
    };
    return RxProcessingInstruction;
}(RxNode));
exports.RxProcessingInstruction = RxProcessingInstruction;
var RxDocumentType = /** @class */ (function (_super) {
    tslib_1.__extends(RxDocumentType, _super);
    function RxDocumentType(parentNode, nodeValue) {
        if (parentNode === void 0) { parentNode = null; }
        var _this = _super.call(this, parentNode) || this;
        _this.nodeType = RxNodeType.DOCUMENT_TYPE_NODE;
        _this.nodeValue = String(nodeValue);
        return _this;
    }
    RxDocumentType.prototype.serialize = function () {
        return "<" + this.nodeValue + ">";
    };
    return RxDocumentType;
}(RxNode));
exports.RxDocumentType = RxDocumentType;
var RxDocumentFragment = /** @class */ (function (_super) {
    tslib_1.__extends(RxDocumentFragment, _super);
    function RxDocumentFragment() {
        var _this = _super.call(this, null, '#document-fragment') || this;
        _this.nodeType = RxNodeType.DOCUMENT_FRAGMENT_NODE;
        _this.childNodes = [];
        return _this;
    }
    return RxDocumentFragment;
}(RxElement));
exports.RxDocumentFragment = RxDocumentFragment;
var RxDocument = /** @class */ (function (_super) {
    tslib_1.__extends(RxDocument, _super);
    /*
        readonly characterSet: string; // Returns document's encoding.
        readonly charset: string; // Gets or sets the character set used to encode the object.
        readonly compatMode: string; // Gets a value that indicates whether standards-compliant mode is switched on for the object.
        readonly contentType: string; // Returns document's content type.
        readonly currentScript: HTMLOrSVGScriptElement | null; // Returns the script element, or the SVG script element, that is currently executing, as long as the element represents a classic script. In the case of reentrant script execution, returns the one that most recently started executing amongst those that have not yet finished executing.
        readonly defaultView: (WindowProxy & typeof globalThis) | null; // Returns null if the Document is not currently executing a script or SVG script element (e.g., because the running script is an event handler, or a timeout), or if the currently executing script or SVG script element represents a module script.
        readonly documentElement: HTMLElement; // Gets a reference to the root node of the document.
        readonly documentURI: string; // Returns document's URL.
        readonly embeds: HTMLCollectionOf<HTMLEmbedElement>; // Retrieves a collection of all embed objects in the document.
        readonly forms: HTMLCollectionOf<HTMLFormElement>; // Retrieves a collection, in source order, of all form objects in the document.
        readonly fullscreenEnabled: boolean; // Returns true if document has the ability to display elements fullscreen and fullscreen is supported, or false otherwise.
        readonly head: HTMLHeadElement; // Returns the head element.
        readonly hidden: boolean;
        readonly images: HTMLCollectionOf<HTMLImageElement>; // Retrieves a collection, in source order, of img objects in the document.
        readonly implementation: DOMImplementation; // Gets the implementation object of the current document.
        readonly inputEncoding: string; // Returns the character encoding used to create the webpage that is loaded into the document object.
        readonly lastModified: string; // Gets the date that the page was last modified, if the page supplies one.
        readonly links: HTMLCollectionOf<HTMLAnchorElement | HTMLAreaElement>; // Retrieves a collection of all a objects that specify the href property and all area objects in the document.
        readonly origin: string; // Returns document's origin.
        readonly ownerDocument: null;
        readonly plugins: HTMLCollectionOf<HTMLEmbedElement>; // Return an HTMLCollection of the embed elements in the Document.
        readonly readyState: DocumentReadyState; // Retrieves a value that indicates the current state of the object.
        readonly referrer: string; // Gets the URL of the location that referred the user to the current page.
        readonly scripts: HTMLCollectionOf<HTMLScriptElement>; // Retrieves a collection of all script objects in the document.
        readonly scrollingElement: Element | null;
        readonly timeline: DocumentTimeline;
        readonly visibilityState: VisibilityState;
        */
    function RxDocument() {
        var _this = _super.call(this, null, '#document') || this;
        _this.location_ = location_1.RxLocation.location;
        _this.nodeType = RxNodeType.DOCUMENT_NODE;
        _this.childNodes = [];
        return _this;
    }
    Object.defineProperty(RxDocument.prototype, "location", {
        get: function () {
            return this.location_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxDocument.prototype, "URL", {
        get: function () {
            return this.location_.href;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxDocument.prototype, "hidden", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxDocument.prototype, "visibilityState", {
        get: function () {
            return 'prerender';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxDocument.prototype, "doctype", {
        get: function () {
            return this.childNodes.find(function (x) { return isRxDocumentType(x); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxDocument.prototype, "body", {
        get: function () {
            return this.childNodes.find(function (x) { return isRxElement(x) && x.nodeName === 'body'; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxDocument.prototype, "head", {
        get: function () {
            return this.childNodes.find(function (x) { return isRxElement(x) && x.nodeName === 'head'; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxDocument.prototype, "title", {
        get: function () {
            var title = this.childNodes.find(function (x) { return isRxElement(x) && x.nodeName === 'title'; });
            if (title) {
                return title.innerText;
            }
            else {
                return null;
            }
        },
        set: function (nodeValue) {
            var title = this.childNodes.find(function (x) { return isRxElement(x) && x.nodeName === 'title'; });
            if (title) {
                title.innerText = nodeValue;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxDocument.prototype, "documentElement", {
        get: function () {
            return this.firstElementChild;
        },
        enumerable: false,
        configurable: true
    });
    RxDocument.prototype.createAttribute = function () { };
    // Creates a new Attr object and returns it.
    RxDocument.prototype.createAttributeNS = function () { };
    // Creates a new attribute node in a given namespace and returns it.
    RxDocument.prototype.createCDATASection = function () { };
    // Creates a new CDATA node and returns it.
    RxDocument.prototype.createComment = function (nodeValue) {
        return new RxComment(null, nodeValue);
    };
    // Creates a new comment node and returns it.
    RxDocument.prototype.createDocumentFragment = function () {
        return new RxDocumentFragment();
    };
    // Creates a new document fragment.
    RxDocument.prototype.createElement = function (nodeName) {
        return new RxElement(null, nodeName);
    };
    // Creates a new element with the given tag name.
    RxDocument.prototype.createElementNS = function (nodeName) {
        return new RxElement(null, nodeName);
    };
    // Creates a new element with the given tag name and namespace URI.
    RxDocument.prototype.createEvent = function () { };
    // Creates an event object.
    RxDocument.prototype.createNodeIterator = function () { };
    // Creates a NodeIterator object.
    RxDocument.prototype.createProcessingInstruction = function (nodeValue) {
        return new RxProcessingInstruction(null, nodeValue);
    };
    // Creates a new ProcessingInstruction object.
    RxDocument.prototype.createRange = function () { };
    // Creates a Range object.
    RxDocument.prototype.createTextNode = function (nodeValue) {
        return new RxText(null, nodeValue);
    };
    // Creates a text node.
    RxDocument.prototype.createTouchList = function () { };
    // Creates a TouchList object.
    RxDocument.prototype.createTreeWalker = function () { };
    // Creates a TreeWalker object.
    RxDocument.prototype.serialize = function () {
        return "" + this.childNodes.map(function (x) { return x.serialize(); }).join('');
    };
    return RxDocument;
}(RxElement));
exports.RxDocument = RxDocument;
function isRxElement(x) {
    return x.nodeType === RxNodeType.ELEMENT_NODE;
}
exports.isRxElement = isRxElement;
function isRxText(x) {
    return x.nodeType === RxNodeType.TEXT_NODE;
}
exports.isRxText = isRxText;
function isRxComment(x) {
    return x.nodeType === RxNodeType.COMMENT_NODE;
}
exports.isRxComment = isRxComment;
function isRxDocument(x) {
    return x.nodeType === RxNodeType.DOCUMENT_NODE;
}
exports.isRxDocument = isRxDocument;
function isRxDocumentFragment(x) {
    return x.nodeType === RxNodeType.DOCUMENT_FRAGMENT_NODE;
}
exports.isRxDocumentFragment = isRxDocumentFragment;
function isRxDocumentType(x) {
    return x.nodeType === RxNodeType.DOCUMENT_TYPE_NODE;
}
exports.isRxDocumentType = isRxDocumentType;
function isRxProcessingInstruction(x) {
    return x.nodeType === RxNodeType.PROCESSING_INSTRUCTION_NODE;
}
exports.isRxProcessingInstruction = isRxProcessingInstruction;
function parse(html) {
    var doc = new RxDocument();
    var parentNode = doc, node;
    var parser = new htmlparser2_1.Parser({
        onopentag: function (nodeName, attributes) {
            // console.log(nodeName);
            node = new RxElement(parentNode, nodeName, attributes);
            parentNode.childNodes.push(node);
            parentNode = node;
            // if (NO_CHILDS.indexOf(nodeName) === -1) {
            //	console.log(nodeName);
            //	parentNode = node;
            // }
        },
        onclosetag: function (nodeName) {
            if (parentNode.parentNode) {
                parentNode = parentNode.parentNode;
            }
        },
        ontext: function (nodeValue) {
            // console.log('ontext', nodeValue);
            // if (nodeValue.length) {
            var textNode = new RxText(parentNode, nodeValue);
            parentNode.childNodes.push(textNode);
            // }
        },
        onprocessinginstruction: function (nodeName, nodeValue) {
            // console.log('onprocessinginstruction', nodeName, nodeValue);
            if (nodeName === '!doctype') {
                node = new RxDocumentType(parentNode, nodeValue);
            }
            else {
                node = new RxProcessingInstruction(parentNode, nodeValue);
            }
            parentNode.childNodes.push(node);
        },
        oncomment: function (nodeValue) {
            // console.log('oncomment', nodeValue);
            node = new RxComment(parentNode, nodeValue);
            parentNode.childNodes.push(node);
            // parentNode = node;
        },
        oncommentend: function () {
            // console.log('oncommentend');
            // parentNode = parentNode.parentNode;
        },
        oncdatastart: function () {
            console.log('oncdatastart');
        },
        oncdataend: function () {
            console.log('oncdataend');
        },
        onerror: function (error) {
            console.log('error', error);
        },
    }, {
        decodeEntities: false,
        lowerCaseTags: true,
    });
    parser.write(html);
    parser.end();
    return doc;
}
exports.parse = parse;
function getQueries(selector) {
    var queries = [];
    selector
        .trim()
        .split(' ')
        .forEach(function (x) {
        x.trim()
            .split('>')
            .forEach(function (x, i) {
            var e_2, _a;
            // const regex = /\.([^\.[]+)|\[([^\.\[]+)\]|([^\.\[\]]+)/g;
            // const regex = /\#([^\.[#]+)|\.([^\.[#]+)|\[([^\.\[#]+)\]|([^\.\[#\]]+)/g;
            var regex = /\:not\(\#([^\.[#:]+)\)|\:not\(\.([^\.[#:]+)\)|\:not\(\[([^\.\[#:]+)\]\)|\:not\(([^\.\[#:\]]+)\)|\#([^\.[#:]+)|\.([^\.[#:]+)|\[([^\.\[#:]+)\]|([^\.\[#:\]]+)/g;
            /* eslint no-useless-escape: "off" */
            var selectors = [];
            var matches = x.matchAll(regex);
            try {
                for (var matches_1 = tslib_1.__values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
                    var match = matches_1_1.value;
                    if (match[1]) {
                        selectors.push({ selector: match[1], type: SelectorType.Id, negate: true });
                    }
                    else if (match[2]) {
                        selectors.push({ selector: match[2], type: SelectorType.Class, negate: true });
                    }
                    else if (match[3]) {
                        selectors.push({ selector: match[3], type: SelectorType.Attribute, negate: true });
                    }
                    else if (match[4]) {
                        selectors.push({ selector: match[4], type: SelectorType.TagName, negate: true });
                    }
                    else if (match[5]) {
                        selectors.push({ selector: match[5], type: SelectorType.Id, negate: false });
                    }
                    else if (match[6]) {
                        selectors.push({ selector: match[6], type: SelectorType.Class, negate: false });
                    }
                    else if (match[7]) {
                        selectors.push({ selector: match[7], type: SelectorType.Attribute, negate: false });
                    }
                    else if (match[8]) {
                        selectors.push({ selector: match[8], type: SelectorType.TagName, negate: false });
                    }
                    // console.log('match', match);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (matches_1_1 && !matches_1_1.done && (_a = matches_1.return)) _a.call(matches_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            var selector = i > 0
                ? { selector: x, selectors: selectors, inner: true }
                : { selector: x, selectors: selectors, inner: false };
            queries.push.call(queries, selector);
        });
    });
    return queries;
}
exports.getQueries = getQueries;
function matchSelector(child, selector) {
    switch (selector.type) {
        case SelectorType.Id:
            return (selector.selector !== '' && child.attributes.id === selector.selector) !== selector.negate;
        case SelectorType.Class:
            return (child.classList.indexOf(selector.selector) !== -1) !== selector.negate;
        case SelectorType.Attribute:
            return (Object.keys(child.attributes).indexOf(selector.selector) !== -1) !== selector.negate;
        case SelectorType.TagName:
            return (child.nodeName === selector.selector) !== selector.negate;
        default:
            return false;
    }
}
exports.matchSelector = matchSelector;
function matchSelectors(child, selectors) {
    return selectors.reduce(function (p, selector) {
        return p && matchSelector(child, selector);
    }, true);
}
exports.matchSelectors = matchSelectors;
function querySelectorAll(queries, childNodes, query, nodes) {
    var e_3, _a;
    if (query === void 0) { query = null; }
    if (nodes === void 0) { nodes = []; }
    if (query || queries.length) {
        query = query || queries.shift();
        try {
            for (var childNodes_1 = tslib_1.__values(childNodes), childNodes_1_1 = childNodes_1.next(); !childNodes_1_1.done; childNodes_1_1 = childNodes_1.next()) {
                var child = childNodes_1_1.value;
                if (child instanceof RxElement) {
                    if (matchSelectors(child, query.selectors)) {
                        // console.log(query);
                        if (queries.length) {
                            var results = querySelectorAll(queries, child.childNodes);
                            if (results) {
                                Array.prototype.push.apply(nodes, results);
                            }
                        }
                        else {
                            nodes.push(child);
                        }
                    }
                    else if (!query.inner) {
                        var results = querySelectorAll(queries, child.childNodes, query);
                        if (results) {
                            Array.prototype.push.apply(nodes, results);
                        }
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (childNodes_1_1 && !childNodes_1_1.done && (_a = childNodes_1.return)) _a.call(childNodes_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
    return nodes.length ? nodes : null;
}
exports.querySelectorAll = querySelectorAll;
function querySelector(queries, childNodes, query) {
    var e_4, _a;
    if (query === void 0) { query = null; }
    var node = null;
    if (query || queries.length) {
        query = query || queries.shift();
        try {
            for (var childNodes_2 = tslib_1.__values(childNodes), childNodes_2_1 = childNodes_2.next(); !childNodes_2_1.done; childNodes_2_1 = childNodes_2.next()) {
                var child = childNodes_2_1.value;
                if (child instanceof RxElement) {
                    if (matchSelectors(child, query.selectors)) {
                        // console.log(query);
                        if (queries.length) {
                            return querySelector(queries, child.childNodes);
                        }
                        else {
                            return child;
                        }
                    }
                    else if (!query.inner) {
                        node = querySelector(queries, child.childNodes, query);
                    }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (childNodes_2_1 && !childNodes_2_1.done && (_a = childNodes_2.return)) _a.call(childNodes_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    return node;
}
exports.querySelector = querySelector;
function cloneNode(source, deep, parentNode) {
    if (deep === void 0) { deep = false; }
    if (parentNode === void 0) { parentNode = null; }
    var node;
    if (isRxElement(source)) {
        var nodeElement_1 = new RxElement(parentNode, source.nodeName, Object.assign({}, source.attributes));
        if (deep) {
            nodeElement_1.childNodes = source.childNodes.map(function (x) { return cloneNode.apply(x, [x, deep, nodeElement_1]); });
        }
        node = nodeElement_1;
    }
    else if (isRxDocumentFragment(source)) {
        var nodeDocumentFragment_1 = new RxDocumentFragment();
        if (deep) {
            nodeDocumentFragment_1.childNodes = source.childNodes.map(function (x) { return cloneNode.apply(x, [x, deep, nodeDocumentFragment_1]); });
        }
        node = nodeDocumentFragment_1;
    }
    else if (isRxText(source)) {
        node = new RxText(parentNode, source.nodeValue);
    }
    else if (isRxComment(source)) {
        node = new RxComment(parentNode, source.nodeValue);
    }
    else if (isRxDocument(source)) {
        var documentElement_1 = new RxDocument();
        if (deep) {
            documentElement_1.childNodes = source.childNodes.map(function (x) { return cloneNode.apply(x, [x, deep, documentElement_1]); });
        }
        node = documentElement_1;
    }
    else {
        throw new Error('Invalid node type');
    }
    return node;
}
exports.cloneNode = cloneNode;
