import { Parser } from 'htmlparser2';
import { RxLocation } from '../location/location';
// export const NO_CHILDS = ['title','base','meta','link','img','br','input',];
// const SKIP = ['html','head','title','base','meta','script','link','body',];
// document.createComment = nodeValue => { return new RxComment(null, nodeValue); };
// document.createTextNode = nodeValue => { return new RxText(null, nodeValue); };
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
export class RxSelector {
    constructor(options) {
        this.selector = '';
        this.type = SelectorType.None;
        this.negate = false;
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
export class RxStyle {
    item(index) {
        const keys = Object.keys(this);
        if (keys.length > index) {
            return keys[index];
        }
        else {
            return undefined;
        }
    }
    getPropertyPriority(key) {
        const value = this[key];
        if (value && value.indexOf('!important')) {
            return 'important';
        }
        else {
            return '';
        }
    }
    getPropertyValue(key) {
        return this[key];
    }
    setProperty(key, value, important) {
        this[key] = value + (important === 'important' ? '!important' : '');
        this.serialize_();
    }
    removeProperty(key) {
        delete this[key];
        this.serialize_();
    }
    serialize_() {
        this.node.attributes.style = Object.keys(this).map(key => {
            return `${key}: ${this[key]};`;
        }).join(' ');
    }
    init() {
        var _a;
        const keys = Object.keys(this);
        keys.forEach(key => delete this[key]);
        if ((_a = this.node.attributes) === null || _a === void 0 ? void 0 : _a.style) {
            const regex = /([^:]+):([^;]+);?\s*/gm;
            const matches = [...this.node.attributes.style.matchAll(regex)];
            matches.forEach((match) => {
                const key = match[1];
                const value = match[2];
                this[key] = value;
            });
        }
    }
    constructor(node) {
        Object.defineProperty(this, 'node', {
            value: node,
            writable: false,
            enumerable: false
        });
        this.init();
    }
}
export class RxClassList extends Array {
    constructor(node) {
        super();
        this.node = node;
        this.init();
    }
    item(index) {
        return this[index];
    }
    contains(name) {
        return this.indexOf(name) !== -1;
    }
    add(...names) {
        names.forEach(name => {
            if (this.indexOf(name) !== -1) {
                this.push(name);
            }
        });
        this.serialize_();
    }
    remove(...names) {
        names.forEach(name => {
            const index = this.indexOf(name);
            if (index !== -1) {
                this.splice(index, 1);
            }
        });
        this.serialize_();
    }
    toggle(name, force) {
        const index = this.indexOf(name);
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
    }
    replace(oldClass, newClass) {
        const index = this.indexOf(oldClass);
        if (index !== -1) {
            this.splice(index, 1);
        }
        this.push(newClass);
        this.serialize_();
    }
    serialize_() {
        this.node.attributes.class = this.join(' ');
    }
    init() {
        var _a;
        this.length = 0;
        if ((_a = this.node.attributes) === null || _a === void 0 ? void 0 : _a.class) {
            Array.prototype.push.apply(this, this.node.attributes.class.split(' ').map(name => name.trim()));
        }
    }
}
export class RxElement extends RxNode {
    constructor(parentNode = null, nodeName, attributes = null) {
        super(parentNode);
        this.attributes = {};
        this.nodeType = RxNodeType.ELEMENT_NODE;
        this.nodeName = nodeName;
        if (attributes && typeof attributes === 'object') {
            this.attributes = attributes;
        }
        this.style = new RxStyle(this);
        this.classList = new RxClassList(this);
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
    get lastChild() {
        let node = null;
        if (this.childNodes.length) {
            node = this.childNodes[this.childNodes.length - 1];
        }
        return node;
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
    get innerHTML() {
        return this.childNodes.map(x => x.serialize()).join('');
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
        if (attribute === 'style') {
            this.style.init();
        }
        else if (attribute === 'class') {
            this.classList.init();
        }
    }
    removeAttribute(attribute) {
        delete this.attributes[attribute];
        if (attribute === 'style') {
            this.style.init();
        }
        else if (attribute === 'class') {
            this.classList.init();
        }
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
            throw new Error(`Uncaught TypeError: Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'.`);
        }
        const index = this.childNodes.indexOf(child);
        if (index === -1) {
            throw new Error(`Uncaught NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.`);
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
    constructor() {
        super(null, '#document');
        this.location_ = RxLocation.location;
        this.nodeType = RxNodeType.DOCUMENT_NODE;
        this.childNodes = [];
    }
    get location() {
        return this.location_;
    }
    get URL() {
        return this.location_.href;
    }
    get hidden() {
        return true;
    }
    get visibilityState() {
        return 'prerender';
    }
    get doctype() {
        return this.childNodes.find(x => isRxDocumentType(x));
    }
    get head() {
        console.log('childNodes', this.childNodes);
        let head = this.documentElement.childNodes.find(x => isRxElement(x) && x.nodeName === 'head');
        if (!head) {
            head = new RxElement(this.documentElement, 'head');
            this.documentElement.append(head);
        }
        return head;
    }
    get body() {
        let body = this.childNodes.find(x => isRxElement(x) && x.nodeName === 'body');
        if (!body) {
            body = new RxElement(this.documentElement, 'body');
            this.documentElement.append(body);
        }
        return body;
    }
    get title() {
        const title = this.head.childNodes.find(x => isRxElement(x) && x.nodeName === 'title');
        if (title) {
            return title.innerText;
        }
        else {
            return null;
        }
    }
    set title(nodeValue) {
        let title = this.head.childNodes.find(x => isRxElement(x) && x.nodeName === 'title');
        if (!title) {
            title = new RxElement(this.head, 'title');
        }
        title.innerText = nodeValue;
    }
    get documentElement() {
        let element = this.firstElementChild;
        if (!element) {
            element = new RxElement(this, 'html');
        }
        return element;
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
            // const regex = /\.([^\.[]+)|\[([^\.\[]+)\]|([^\.\[\]]+)/g;
            // const regex = /\#([^\.[#]+)|\.([^\.[#]+)|\[([^\.\[#]+)\]|([^\.\[#\]]+)/g;
            const regex = /\:not\(\#([^\.[#:]+)\)|\:not\(\.([^\.[#:]+)\)|\:not\(\[([^\.\[#:]+)\]\)|\:not\(([^\.\[#:\]]+)\)|\#([^\.[#:]+)|\.([^\.[#:]+)|\[([^\.\[#:]+)\]|([^\.\[#:\]]+)/g;
            /* eslint no-useless-escape: "off" */
            const selectors = [];
            const matches = x.matchAll(regex);
            for (const match of matches) {
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
            const selector = i > 0
                ? { selector: x, selectors, inner: true }
                : { selector: x, selectors, inner: false };
            queries.push.call(queries, selector);
        });
    });
    return queries;
}
export function matchSelector(child, selector) {
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
export function matchSelectors(child, selectors) {
    return selectors.reduce(function (p, selector) {
        return p && matchSelector(child, selector);
    }, true);
}
export function querySelectorAll(queries, childNodes, query = null, nodes = []) {
    if (query || queries.length) {
        query = query || queries.shift();
        for (let child of childNodes) {
            if (child instanceof RxElement) {
                if (matchSelectors(child, query.selectors)) {
                    // console.log(query);
                    if (queries.length) {
                        const results = querySelectorAll(queries, child.childNodes);
                        if (results) {
                            Array.prototype.push.apply(nodes, results);
                        }
                    }
                    else {
                        nodes.push(child);
                    }
                }
                else if (!query.inner) {
                    const results = querySelectorAll(queries, child.childNodes, query);
                    if (results) {
                        Array.prototype.push.apply(nodes, results);
                    }
                }
            }
        }
    }
    return nodes.length ? nodes : null;
}
export function querySelector(queries, childNodes, query = null) {
    let node = null;
    if (query || queries.length) {
        query = query || queries.shift();
        for (let child of childNodes) {
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
        throw new Error('Invalid node type');
    }
    return node;
}
