import { Parser } from 'htmlparser2';
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
export var RxNodeType;
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
export var SelectorType;
(function (SelectorType) {
    SelectorType[SelectorType["None"] = -1] = "None";
    SelectorType[SelectorType["Id"] = 0] = "Id";
    SelectorType[SelectorType["Class"] = 1] = "Class";
    SelectorType[SelectorType["Attribute"] = 2] = "Attribute";
    SelectorType[SelectorType["TagName"] = 3] = "TagName";
})(SelectorType || (SelectorType = {}));
export function isRxElement(x) {
    return x.nodeType === RxNodeType.ELEMENT_NODE;
}
export function isRxText(x) {
    return x.nodeType === RxNodeType.TEXT_NODE;
}
export function isRxComment(x) {
    return x.nodeType === RxNodeType.COMMENT_NODE;
}
export function isRxDocument(x) {
    return x.nodeType === RxNodeType.DOCUMENT_NODE;
}
export function isRxDocumentFragment(x) {
    return x.nodeType === RxNodeType.DOCUMENT_FRAGMENT_NODE;
}
export function isRxDocumentType(x) {
    return x.nodeType === RxNodeType.DOCUMENT_TYPE_NODE;
}
export function isRxProcessingInstruction(x) {
    return x.nodeType === RxNodeType.PROCESSING_INSTRUCTION_NODE;
}
export function parse(html) {
    const doc = new RxDocument();
    let parentNode = doc, node;
    const parser = new Parser({
        onopentag: (nodeName, attributes) => {
            // console.log(nodeName);
            node = new RxElement(parentNode, nodeName, attributes);
            parentNode.childNodes.push(node);
            parentNode = node;
            // if (NO_CHILDS.indexOf(nodeName) === -1) {
            //	console.log(nodeName);
            //	parentNode = node;
            // }
        },
        onclosetag: (nodeName) => {
            if (parentNode.parentNode) {
                parentNode = parentNode.parentNode;
            }
        },
        ontext: (nodeValue) => {
            // console.log('ontext', nodeValue);
            // if (nodeValue.length) {
            const textNode = new RxText(parentNode, nodeValue);
            parentNode.childNodes.push(textNode);
            // }
        },
        onprocessinginstruction: (nodeName, nodeValue) => {
            // console.log('onprocessinginstruction', nodeName, nodeValue);
            if (nodeName === '!doctype') {
                node = new RxDocumentType(parentNode, nodeValue);
            }
            else {
                node = new RxProcessingInstruction(parentNode, nodeValue);
            }
            parentNode.childNodes.push(node);
        },
        oncomment: nodeValue => {
            // console.log('oncomment', nodeValue);
            node = new RxComment(parentNode, nodeValue);
            parentNode.childNodes.push(node);
            // parentNode = node;
        },
        oncommentend: () => {
            // console.log('oncommentend');
            // parentNode = parentNode.parentNode;
        },
        oncdatastart: () => {
            console.log('oncdatastart');
        },
        oncdataend: () => {
            console.log('oncdataend');
        },
        onerror: error => {
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
export function getQueries(selector) {
    const queries = [];
    selector
        .trim()
        .split(' ')
        .forEach((x) => {
        x.trim()
            .split('>')
            .forEach((x, i) => {
            const regex = /\.([^\.[]+)|\[([^\.\[]+)\]|([^\.\[\]]+)/g;
            /*eslint no-useless-escape: "off"*/
            // const regex = new RegExp(`\.([^\.[]+)|\[([^\.\[]+)\]|([^\.\[\]]+)`, 'g');
            const selectors = [];
            const matches = x.matchAll(regex);
            for (const match of matches) {
                if (match[1]) {
                    selectors.push({ selector: match[1], type: SelectorType.Class });
                }
                else if (match[2]) {
                    selectors.push({
                        selector: match[2],
                        type: SelectorType.Attribute,
                    });
                }
                else if (match[3]) {
                    selectors.push({
                        selector: match[3],
                        type: SelectorType.TagName,
                    });
                }
                // console.log('match', match);
            }
            const selector = i > 0
                ? { selector: x, selectors, inner: true }
                : { selector: x, selectors, inner: false };
            queries.push.call(queries, selector);
        });
    });
    return queries;
}
export function querySelectorAll(queries, childNodes, nodes = []) {
    return null;
}
export function querySelector(queries, childNodes, query = null) {
    let node = null;
    const match = (child, selector) => {
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
        for (let child of childNodes) {
            if (child instanceof RxElement) {
                let has = query.selectors.reduce((p, selector, i) => {
                    return p && match(child, selector);
                }, true);
                if (has) {
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
    return node;
}
export function cloneNode(source, deep = false, parentNode = null) {
    let node;
    if (isRxElement(source)) {
        const nodeElement = new RxElement(parentNode, source.nodeName, Object.assign({}, source.attributes));
        if (deep) {
            nodeElement.childNodes = source.childNodes.map(x => cloneNode.apply(x, [x, deep, nodeElement]));
        }
        node = nodeElement;
    }
    else if (isRxDocumentFragment(source)) {
        const nodeDocumentFragment = new RxDocumentFragment();
        if (deep) {
            nodeDocumentFragment.childNodes = source.childNodes.map(x => cloneNode.apply(x, [x, deep, nodeDocumentFragment]));
        }
        node = nodeDocumentFragment;
    }
    else if (isRxText(source)) {
        node = new RxText(parentNode, source.nodeValue);
    }
    else if (isRxComment(source)) {
        node = new RxComment(parentNode, source.nodeValue);
    }
    else if (isRxDocument(source)) {
        const documentElement = new RxDocument();
        if (deep) {
            documentElement.childNodes = source.childNodes.map(x => cloneNode.apply(x, [x, deep, documentElement]));
        }
        node = documentElement;
    }
    else {
        throw ('Invalid node type');
    }
    return node;
}
export class RxSelector {
    constructor(options) {
        this.selector = '';
        this.type = SelectorType.None;
        if (options) {
            Object.assign(this, options);
        }
    }
}
export class RxQuery {
    constructor(options) {
        this.selector = '';
        this.selectors = [];
        this.inner = false;
        if (options) {
            Object.assign(this, options);
        }
    }
}
export class RxNode {
    constructor(parentNode = null) {
        this.nodeValue = null;
        this.parentNode = parentNode;
        this.nodeType = -1;
    }
    cloneNode(deep = false) {
        return cloneNode.apply(this, [this, deep]);
    }
    serialize() {
        return ``;
    }
}
export class RxElement extends RxNode {
    constructor(parentNode = null, nodeName, attributes = null) {
        super(parentNode);
        this.nodeType = RxNodeType.ELEMENT_NODE;
        this.nodeName = nodeName;
        this.attributes = attributes || {};
        this.childNodes = [];
        /*
            if (SKIP.indexOf(nodeName) === -1) {
                console.log(parentNode.nodeName, '>', nodeName);
        }
        */
    }
    get children() {
        let children = [], i = 0, node, nodes = this.childNodes;
        node = nodes[i++];
        while (node) {
            node = nodes[i++];
            if (node.nodeType === RxNodeType.ELEMENT_NODE) {
                children.push(node);
            }
        }
        return children;
    }
    get childElementCount() {
        let i = 0, count = 0, node, nodes = this.childNodes;
        node = nodes[i++];
        while (node) {
            if (node.nodeType === RxNodeType.ELEMENT_NODE) {
                count++;
            }
            node = nodes[i++];
        }
        return count;
    }
    get firstChild() {
        let node = null;
        if (this.childNodes.length) {
            node = this.childNodes[0];
        }
        return node;
    }
    get firstElementChild() {
        for (let node of this.childNodes) {
            if (isRxElement(node)) {
                return node;
            }
        }
        return null;
    }
    get lastElementChild() {
        const nodes = this.childNodes;
        for (let i = nodes.length - 1; i > -1; i--) {
            const node = nodes[i];
            if (isRxElement(node)) {
                return node;
            }
        }
        return null;
    }
    get previousSibling() {
        let node = null;
        if (this.parentNode) {
            const index = this.parentNode.childNodes.indexOf(this);
            if (index > 0) {
                node = this.parentNode.childNodes[index - 1];
            }
        }
        return node;
    }
    get nextSibling() {
        let node = null;
        if (this.parentNode) {
            const index = this.parentNode.childNodes.indexOf(this);
            if (index !== -1 && index < this.parentNode.childNodes.length - 1) {
                node = this.parentNode.childNodes[index];
            }
        }
        return node;
    }
    get wholeText() {
        let nodeValue;
        if (this.nodeType === RxNodeType.TEXT_NODE) {
            return this.nodeValue;
        }
        return nodeValue;
    }
    get outerHTML() {
        let html = null;
        if (this.parentNode) {
            html = this.parentNode.serialize();
        }
        return html;
    }
    get classList() {
        const classList = this.attributes.class
            ? this.attributes.class.split(' ').map(c => c.trim())
            : [];
        return classList;
    }
    set innerText(nodeValue) {
        this.childNodes = [new RxText(this, nodeValue)];
    }
    get innerText() {
        // return this.childNodes.filter((n): n is RxText => isRxText(n)).map(n => n.innerText).join('');
        return this.childNodes.filter((n) => isRxText(n) || isRxElement(n)).map(n => n.innerText).join('');
    }
    set textContent(nodeValue) {
        this.innerText = String(nodeValue);
    }
    get textContent() {
        return this.innerText;
    }
    set innerHTML(html) {
        const doc = parse(html);
        const childNodes = doc.childNodes.map(n => {
            n.parentNode = this;
            return n;
        });
        this.childNodes = childNodes;
    }
    append(...nodesOrDOMStrings) {
        nodesOrDOMStrings = nodesOrDOMStrings.map(nodeOrDomString => {
            let node;
            if (typeof nodeOrDomString === 'string') {
                node = new RxText(this, nodeOrDomString);
            }
            else {
                node = nodeOrDomString;
                node.parentNode = this;
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
    }
    prepend(...nodesOrDOMStrings) {
        nodesOrDOMStrings = nodesOrDOMStrings.map(nodeOrDomString => {
            let node;
            if (typeof nodeOrDomString === 'string') {
                node = new RxText(this, nodeOrDomString);
            }
            else {
                node = nodeOrDomString;
                node.parentNode = this;
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
    }
    replaceChildren(...nodesOrDOMStrings) {
        const nodes = nodesOrDOMStrings.map((nodeOrDomString) => {
            let node;
            if (typeof nodeOrDomString === 'string') {
                node = new RxText(this, nodeOrDomString);
            }
            else {
                node = nodeOrDomString;
                node.parentNode = this;
            }
            return node;
        });
        this.childNodes = nodes;
    }
    querySelectorAll(selector) {
        const queries = getQueries(selector);
        const nodes = this.childNodes.filter(x => {
            return true;
        });
        console.log(queries);
        return nodes.length ? nodes : null;
    }
    querySelector(selector) {
        const queries = getQueries(selector);
        const node = querySelector(queries, this.childNodes);
        return node;
    }
    hasAttribute(attribute) {
        return Object.keys(this.attributes).indexOf(attribute.toLowerCase()) !== -1;
    }
    getAttribute(attribute) {
        return this.attributes[attribute.toLowerCase()] || null;
    }
    setAttribute(attribute, value) {
        this.attributes[attribute.toLowerCase()] = value.toString();
    }
    removeAttribute(attribute) {
        delete this.attributes[attribute];
    }
    replaceChild(newChild, oldChild) {
        const index = this.childNodes.indexOf(oldChild);
        if (index !== -1) {
            this.childNodes[index] = newChild;
            newChild.parentNode = this;
        }
        // console.log('replaceChild', this, newChild, oldChild);
        return oldChild;
    }
    removeChild(child) {
        if (!(child instanceof RxNode)) {
            throw (`Uncaught TypeError: Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'.`);
        }
        const index = this.childNodes.indexOf(child);
        if (index === -1) {
            throw (`Uncaught NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.`);
        }
        this.childNodes.splice(index, 1);
        // console.log('removeChild', this.childNodes.length);
        return child;
    }
    insertBefore(newNode, referenceNode = null) {
        const index = referenceNode
            ? this.childNodes.indexOf(referenceNode)
            : this.childNodes.length;
        if (index !== -1) {
            this.childNodes.splice(index, 0, newNode);
            newNode.parentNode = this;
        }
        // console.log('insertBefore', this, newNode, referenceNode);
        return newNode;
    }
    cloneNode(deep = false) {
        return cloneNode.apply(this, [this, deep]);
    }
    addListener(eventName, handler) { }
    removeListener(eventName, handler) { }
    serialize() {
        return `<${this.nodeName}${this.serializeAttributes()}>${this.childNodes
            .map(x => x.serialize())
            .join('')}</${this.nodeName}>`;
    }
    serializeAttributes() {
        let attributes = '';
        const keys = Object.keys(this.attributes);
        if (keys.length) {
            attributes =
                ' ' +
                    keys
                        .map(k => {
                        return `${k}="${this.attributes[k]}"`;
                    })
                        .join(' ');
        }
        return attributes;
    }
}
export class RxText extends RxNode {
    constructor(parentNode = null, nodeValue) {
        super(parentNode);
        this.nodeType = RxNodeType.TEXT_NODE;
        this.nodeValue = String(nodeValue);
        // console.log('RxText', nodeValue);
    }
    get outerHTML() {
        let html = null;
        if (this.parentNode) {
            html = this.parentNode.serialize();
        }
        return html;
    }
    get wholeText() {
        return this.nodeValue;
    }
    set innerText(nodeValue) {
        this.nodeValue = String(nodeValue);
    }
    get innerText() {
        return this.nodeValue;
    }
    set textContent(nodeValue) {
        this.nodeValue = String(nodeValue);
    }
    get textContent() {
        return this.nodeValue;
    }
    serialize() {
        return this.nodeValue;
    }
}
export class RxCData extends RxNode {
    constructor(parentNode = null, nodeValue) {
        super(parentNode);
        this.nodeType = RxNodeType.CDATA_SECTION_NODE;
        this.nodeValue = String(nodeValue);
    }
    get outerHTML() {
        let html = null;
        if (this.parentNode) {
            html = this.parentNode.serialize();
        }
        return html;
    }
    get wholeText() {
        return this.nodeValue;
    }
    set innerText(nodeValue) {
        this.nodeValue = String(nodeValue);
    }
    get innerText() {
        return this.nodeValue;
    }
    set textContent(nodeValue) {
        this.nodeValue = String(nodeValue);
    }
    get textContent() {
        return this.nodeValue;
    }
    serialize() {
        return this.nodeValue;
    }
}
export class RxComment extends RxNode {
    constructor(parentNode = null, nodeValue) {
        super(parentNode);
        this.nodeType = RxNodeType.COMMENT_NODE;
        this.nodeValue = String(nodeValue);
    }
    get outerHTML() {
        let html = null;
        if (this.parentNode) {
            html = this.parentNode.serialize();
        }
        return html;
    }
    get wholeText() {
        return this.nodeValue;
    }
    set innerText(nodeValue) {
        this.nodeValue = String(nodeValue);
    }
    get innerText() {
        return this.nodeValue;
    }
    set textContent(nodeValue) {
        this.nodeValue = String(nodeValue);
    }
    get textContent() {
        return this.nodeValue;
    }
    serialize() {
        return `<!--${this.nodeValue}-->`;
    }
}
export class RxProcessingInstruction extends RxNode {
    constructor(parentNode = null, nodeValue) {
        super(parentNode);
        this.nodeType = RxNodeType.PROCESSING_INSTRUCTION_NODE;
        this.nodeValue = String(nodeValue);
    }
    serialize() {
        return `<${this.nodeValue}>`;
    }
}
export class RxDocumentType extends RxNode {
    constructor(parentNode = null, nodeValue) {
        super(parentNode);
        this.nodeType = RxNodeType.DOCUMENT_TYPE_NODE;
        this.nodeValue = String(nodeValue);
    }
    serialize() {
        return `<${this.nodeValue}>`;
    }
}
export class RxDocumentFragment extends RxElement {
    constructor() {
        super(null, '#document-fragment');
        this.nodeType = RxNodeType.DOCUMENT_FRAGMENT_NODE;
        this.childNodes = [];
    }
}
export class RxDocument extends RxElement {
    get hidden() {
        return true;
    }
    get visibilityState() {
        return 'prerender';
    }
    get doctype() {
        return this.childNodes.find(x => isRxDocumentType(x));
    }
    get body() {
        return this.childNodes.find(x => isRxElement(x) && x.nodeName === 'body');
    }
    get head() {
        return this.childNodes.find(x => isRxElement(x) && x.nodeName === 'head');
    }
    get title() {
        const title = this.childNodes.find(x => isRxElement(x) && x.nodeName === 'title');
        if (title) {
            return title.innerText;
        }
        else {
            return null;
        }
    }
    set title(nodeValue) {
        const title = this.childNodes.find(x => isRxElement(x) && x.nodeName === 'title');
        if (title) {
            title.innerText = nodeValue;
        }
    }
    get documentElement() {
        return this.firstElementChild;
    }
    constructor() {
        super(null, '#document');
        this.nodeType = RxNodeType.DOCUMENT_NODE;
        this.childNodes = [];
    }
    createAttribute() { }
    // Creates a new Attr object and returns it.
    createAttributeNS() { }
    // Creates a new attribute node in a given namespace and returns it.
    createCDATASection() { }
    // Creates a new CDATA node and returns it.
    createComment(nodeValue) {
        return new RxComment(null, nodeValue);
    }
    // Creates a new comment node and returns it.
    createDocumentFragment() {
        return new RxDocumentFragment();
    }
    // Creates a new document fragment.
    createElement(nodeName) {
        return new RxElement(null, nodeName);
    }
    // Creates a new element with the given tag name.
    createElementNS(nodeName) {
        return new RxElement(null, nodeName);
    }
    // Creates a new element with the given tag name and namespace URI.
    createEvent() { }
    // Creates an event object.
    createNodeIterator() { }
    // Creates a NodeIterator object.
    createProcessingInstruction(nodeValue) {
        return new RxProcessingInstruction(null, nodeValue);
    }
    // Creates a new ProcessingInstruction object.
    createRange() { }
    // Creates a Range object.
    createTextNode(nodeValue) {
        return new RxText(null, nodeValue);
    }
    // Creates a text node.
    createTouchList() { }
    // Creates a TouchList object.
    createTreeWalker() { }
    // Creates a TreeWalker object.
    serialize() {
        return `${this.childNodes.map(x => x.serialize()).join('')}`;
    }
}
