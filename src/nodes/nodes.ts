import { Parser } from 'htmlparser2';
import { ILocation, RxLocation } from '../location/location';

// export const NO_CHILDS = ['title','base','meta','link','img','br','input',];
// const SKIP = ['html','head','title','base','meta','script','link','body',];
// document.createComment = nodeValue => { return new RxComment(null, nodeValue); };
// document.createTextNode = nodeValue => { return new RxText(null, nodeValue); };

export enum RxNodeType {
	ELEMENT_NODE = 1, //	Un nodo Element come <p> o <div>.
	TEXT_NODE = 3, //	L'attuale Text dentro un Element o Attr.
	CDATA_SECTION_NODE = 4, //	Una CDATASection, ad esempio <!CDATA[[ … ]]>.
	PROCESSING_INSTRUCTION_NODE = 7, //	Una ProcessingInstruction di un documento XML, come <?xml-stylesheet … ?>.
	COMMENT_NODE = 8, //	Un nodo Comment, come <!-- … -->.
	DOCUMENT_NODE = 9, //	Un nodo Document.
	DOCUMENT_TYPE_NODE = 10, //	Un nodo DocumentType, come <!DOCTYPE html>.
	DOCUMENT_FRAGMENT_NODE = 11, //	Un nodo DocumentFragment.
}

export enum SelectorType {
	None = -1,
	Id = 0,
	Class = 1,
	Attribute = 2,
	TagName = 3,
}

export class RxSelector {
	selector: string = '';
	type: SelectorType = SelectorType.None;
	negate: boolean = false;
	constructor(options: RxSelector) {
		if (options) {
			Object.assign(this, options);
		}
	}
}

export class RxQuery {
	selector: string = '';
	selectors: RxSelector[] = [];
	inner: boolean = false;
	constructor(options: RxQuery) {
		if (options) {
			Object.assign(this, options);
		}
	}
}

export class RxNode {
	parentNode: RxElement | null;
	nodeType: RxNodeType;
	nodeValue: string | null = null;

	constructor(parentNode: RxElement | null = null) {
		this.parentNode = parentNode;
		this.nodeType = -1;
	}
	cloneNode(deep: boolean = false) {
		return cloneNode.apply(this, [this, deep]);
	}
	serialize(): string {
		return ``;
	}
}

export class RxStyle {
	[key: string]: any;
	constructor(node: RxElement) {
		Object.defineProperty(this, 'node', {
			value: node,
			writable: false,
			enumerable: false
		});
		this.init();
	}
	init() {
		const keys = Object.keys(this);
		keys.forEach(key => delete this[key]);
		if (this.node.attributes?.style) {
			const regex: RegExp = /([^:]+):([^;]+);?\s*/gm
			const matches: RegExpMatchArray[] = [...this.node.attributes.style.matchAll(regex)];
			matches.forEach((match: RegExpMatchArray) => {
				const key: string = match[1];
				const value: string = match[2];
				this[key] = value;
			});
		}
	}
	item(index: number): string | undefined {
		const keys = Object.keys(this);
		if (keys.length > index) {
			return keys[index];
		} else {
			return undefined;
		}
	}
	getPropertyPriority(key: string): string {
		const value = this[key];
		if (value && value.indexOf('!important')) {
			return 'important';
		} else {
			return '';
		}
	}
	getPropertyValue(key: string): string {
		return this[key];
	}
	setProperty(key: string, value: string, important: 'important' | '' | undefined) {
		this[key] = value + (important === 'important' ? '!important' : '');
		this.serialize_();
	}
	removeProperty(key: string) {
		delete this[key];
		this.serialize_();
	}
	private serialize_() {
		this.node.attributes.style = Object.keys(this).map(key => {
			return `${key}: ${this[key]};`;
		}).join(' ');
	}
}

export class RxClassList extends Array<string> {
	private node_!: RxElement;
	get node(): RxElement {
		return this.node_;
	}
	set node(node) {
		if (this.node_ !== node) {
			this.node_ = node;
			this.init();
		}
	}
	constructor(...args: any[]) {
		super(...args);
	}
	init() {
		this.length = 0;
		// console.log('RxClassList.node', this.node);
		if (this.node.hasAttribute('class')) {
			Array.prototype.push.apply(this, this.node.getAttribute('class')!.split(' ').map(name => name.trim()));
		}
	}
	slice(start?: number, end?: number): RxClassList {
		const length = this.length;
		start = start || 0;
		start = (start >= 0) ? start : Math.max(0, length + start);
		end = (typeof end !== 'undefined') ? end : length;
		end = (end >= 0) ? Math.min(end, length) : length + end;
		const size: number = end - start;
		const classList: RxClassList = size > 0 ? new RxClassList(size) : new RxClassList();
		let i: number;
		for (i = 0; i < size; i++) {
			classList[i] = this[start + i];
		}
		classList.node = this.node;
		/*
		// !!! from string ?
		if (this.charAt) {
			for (i = 0; i < size; i++) {
				classList[i] = this.charAt(from + i);
			}
		}
		*/
		return classList;
	}
	item(index: number) {
		return this[index];
	}
	contains(name: string): boolean {
		return this.indexOf(name) !== -1;
	}
	add(...names: string[]) {
		names.forEach(name => {
			if (this.indexOf(name) === -1) {
				this.push(name);
			}
		});
		this.serialize_();
		// console.log('RxClasslist.add', `[${this.join(', ')}]`, this.node.attributes.class, names);
	}
	remove(...names: string[]) {
		names.forEach(name => {
			const index: number = this.indexOf(name);
			if (index !== -1) {
				this.splice(index, 1);
			}
		});
		this.serialize_();
	}
	toggle(name: string, force?: boolean): boolean {
		const index: number = this.indexOf(name);
		if (force === false) {
			this.splice(index, 1);
			this.serialize_();
			return false;
		} else if (force === true) {
			this.push(name);
			this.serialize_();
			return true;
		} else if (index !== -1) {
			this.splice(index, 1);
			this.serialize_();
			return false;
		} else {
			this.push(name);
			this.serialize_();
			return true;
		}
	}
	replace(oldClass: string, newClass: string) {
		const index: number = this.indexOf(oldClass);
		if (index !== -1) {
			this.splice(index, 1);
		}
		this.push(newClass);
		this.serialize_();
	}
	private serialize_() {
		this.node.setAttribute('class', this.join(' '));
	}
}

export class RxElement extends RxNode {
	nodeName: string;
	childNodes: RxNode[];
	attributes: { [key: string]: string | null } = {};
	style: RxStyle;
	classList: RxClassList;
	get children(): RxElement[] {
		let children: RxElement[] = [],
			i = 0,
			node,
			nodes = this.childNodes;
		node = nodes[i++];
		while (node) {
			if (node.nodeType === RxNodeType.ELEMENT_NODE) {
				children.push(node as RxElement);
			}
			node = nodes[i++];
		}
		return children;
	}
	get childElementCount(): number {
		let i = 0,
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
	get firstChild(): RxNode | null {
		let node = null;
		if (this.childNodes.length) {
			node = this.childNodes[0];
		}
		return node;
	}
	get firstElementChild(): RxElement | null {
		for (let node of this.childNodes) {
			if (isRxElement(node)) {
				return node;
			}
		}
		return null;
	}
	get lastChild(): RxNode | null {
		let node = null;
		if (this.childNodes.length) {
			node = this.childNodes[this.childNodes.length - 1];
		}
		return node;
	}
	get lastElementChild(): RxElement | null {
		const nodes = this.childNodes;
		for (let i = nodes.length - 1; i > -1; i--) {
			const node = nodes[i];
			if (isRxElement(node)) {
				return node;
			}
		}
		return null;
	}
	get previousSibling(): RxNode | null {
		let node = null;
		if (this.parentNode) {
			const index = this.parentNode.childNodes.indexOf(this);
			if (index > 0) {
				node = this.parentNode.childNodes[index - 1];
			}
		}
		return node;
	}
	get nextSibling(): RxNode | null {
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
	get outerHTML(): string | null {
		let html = null;
		if (this.parentNode) {
			html = this.parentNode.serialize();
		}
		return html;
	}
	set innerText(nodeValue: string | null) {
		this.childNodes = [new RxText(this, nodeValue)];
	}
	get innerText(): string | null {
		// return this.childNodes.filter((n): n is RxText => isRxText(n)).map(n => n.innerText).join('');
		return this.childNodes.filter((n): n is RxText | RxElement => isRxText(n) || isRxElement(n)).map(n => n.innerText).join('');
	}
	set textContent(nodeValue: string | null) {
		this.innerText = String(nodeValue);
	}
	get textContent(): string | null {
		return this.innerText;
	}
	get innerHTML(): string {
		return this.childNodes.map(x => x.serialize()).join('');
	}
	set innerHTML(html: string) {
		const doc = parse(html);
		const childNodes = doc.childNodes.map(n => {
			n.parentNode = this;
			return n;
		});
		this.childNodes = childNodes;
	}
	constructor(parentNode: RxElement | null = null, nodeName: string, attributes: { [key: string]: string | null } | null = null) {
		super(parentNode);
		this.nodeType = RxNodeType.ELEMENT_NODE;
		this.nodeName = nodeName;
		if (attributes && typeof attributes === 'object') {
			this.attributes = attributes;
		}
		// console.log('RxElement.constructor', this);
		this.style = new RxStyle(this);
		const classList = new RxClassList();
		classList.node = this;
		this.classList = classList;
		this.childNodes = [];
		/*
		if (SKIP.indexOf(nodeName) === -1) {
			// console.log(parentNode.nodeName, '>', nodeName);
		}
		*/
	}
	append(...nodesOrDOMStrings: (RxNode | string)[]) {
		nodesOrDOMStrings = nodesOrDOMStrings.map(nodeOrDomString => {
			let node;
			if (typeof nodeOrDomString === 'string') {
				node = new RxText(this, nodeOrDomString);
			} else {
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
	appendChild<T extends RxNode>(newChild: T): T {
		if (newChild.parentNode) {
			newChild.parentNode.removeChild(newChild);
		}
		if (isRxDocumentFragment(newChild)) {
			this.append.apply(this, newChild.childNodes);
		} else {
			this.append(newChild);
		}
		return newChild;
	}
	prepend(...nodesOrDOMStrings: (RxNode | string)[]) {
		nodesOrDOMStrings = nodesOrDOMStrings.map(nodeOrDomString => {
			let node;
			if (typeof nodeOrDomString === 'string') {
				node = new RxText(this, nodeOrDomString);
			} else {
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
	replaceChildren(...nodesOrDOMStrings: (RxNode | string)[]) {
		const nodes: RxNode[] = nodesOrDOMStrings.map((nodeOrDomString) => {
			let node: RxNode;
			if (typeof nodeOrDomString === 'string') {
				node = new RxText(this, nodeOrDomString);
			} else {
				node = nodeOrDomString as RxNode;
				node.parentNode = this;
			}
			return node;
		});
		this.childNodes = nodes;
	}
	querySelectorAll(selector: string): RxNode[] | null {
		const queries = getQueries(selector);
		const nodes = querySelectorAll(queries, this.childNodes);
		return (nodes && nodes.length) ? nodes : null;
	}
	querySelector(selector: string): RxNode | null {
		const queries = getQueries(selector);
		const node = querySelector(queries, this.childNodes);
		return node;
	}
	hasAttribute(attribute: string): boolean {
		return Object.keys(this.attributes).indexOf(attribute.toLowerCase()) !== -1;
	}
	getAttribute(attribute: string): string | null {
		return this.attributes[attribute.toLowerCase()] || null;
	}
	setAttribute(attribute: string, value: any) {
		this.attributes[attribute.toLowerCase()] = value.toString();
		if (attribute === 'style') {
			this.style.init();
		} else if (attribute === 'class') {
			this.classList.init();
		}
	}
	removeAttribute(attribute: string) {
		delete this.attributes[attribute];
		if (attribute === 'style') {
			this.style.init();
		} else if (attribute === 'class') {
			this.classList.init();
		}
	}
	replaceChild(newChild: RxNode, oldChild: RxNode): RxNode {
		const index = this.childNodes.indexOf(oldChild);
		if (index !== -1) {
			this.childNodes[index] = newChild;
			newChild.parentNode = this;
		}
		// console.log('replaceChild', this, newChild, oldChild);
		return oldChild;
	}
	removeChild(child: RxNode): RxNode {
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
	insertBefore(newNode: RxNode, referenceNode: RxNode | null = null): RxNode {
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
	cloneNode(deep: boolean = false): RxNode {
		return cloneNode.apply(this, [this, deep]);
	}
	addListener(eventName: string, handler: (e: any) => {}) { }
	removeListener(eventName: string, handler: (e: any) => {}) { }
	serialize(): string {
		return `<${
			this.nodeName
			}${this.serializeAttributes()}>${this.childNodes
				.map(x => x.serialize())
				.join('')}</${this.nodeName}>`;
	}
	serializeAttributes(): string {
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
	nodeValue: string;
	get outerHTML(): string | null {
		let html = null;
		if (this.parentNode) {
			html = this.parentNode.serialize();
		}
		return html;
	}
	get wholeText(): string | null {
		return this.nodeValue;
	}
	set innerText(nodeValue) {
		this.nodeValue = String(nodeValue);
	}
	get innerText(): string | null {
		return this.nodeValue;
	}
	set textContent(nodeValue) {
		this.nodeValue = String(nodeValue);
	}
	get textContent(): string | null {
		return this.nodeValue;
	}
	constructor(parentNode: RxElement | null = null, nodeValue: any) {
		super(parentNode);
		this.nodeType = RxNodeType.TEXT_NODE;
		this.nodeValue = String(nodeValue);
		// console.log('RxText', nodeValue);
	}
	serialize(): string {
		return this.nodeValue;
	}
}

export class RxCData extends RxNode {
	nodeValue: string;
	get outerHTML(): string | null {
		let html = null;
		if (this.parentNode) {
			html = this.parentNode.serialize();
		}
		return html;
	}
	get wholeText(): string | null {
		return this.nodeValue;
	}
	set innerText(nodeValue) {
		this.nodeValue = String(nodeValue);
	}
	get innerText(): string | null {
		return this.nodeValue;
	}
	set textContent(nodeValue) {
		this.nodeValue = String(nodeValue);
	}
	get textContent(): string | null {
		return this.nodeValue;
	}
	constructor(parentNode: RxElement | null = null, nodeValue: any) {
		super(parentNode);
		this.nodeType = RxNodeType.CDATA_SECTION_NODE;
		this.nodeValue = String(nodeValue);
	}
	serialize(): string {
		return this.nodeValue;
	}
}

export class RxComment extends RxNode {
	nodeValue: string;
	get outerHTML(): string | null {
		let html = null;
		if (this.parentNode) {
			html = this.parentNode.serialize();
		}
		return html;
	}
	get wholeText(): string | null {
		return this.nodeValue;
	}
	set innerText(nodeValue) {
		this.nodeValue = String(nodeValue);
	}
	get innerText(): string | null {
		return this.nodeValue;
	}
	set textContent(nodeValue) {
		this.nodeValue = String(nodeValue);
	}
	get textContent(): string | null {
		return this.nodeValue;
	}
	constructor(parentNode: RxElement | null = null, nodeValue: any) {
		super(parentNode);
		this.nodeType = RxNodeType.COMMENT_NODE;
		this.nodeValue = String(nodeValue);
	}
	serialize(): string {
		return `<!--${this.nodeValue}-->`;
	}
}

export class RxProcessingInstruction extends RxNode {
	constructor(parentNode: RxElement | null = null, nodeValue: any) {
		super(parentNode);
		this.nodeType = RxNodeType.PROCESSING_INSTRUCTION_NODE;
		this.nodeValue = String(nodeValue);
	}
	serialize(): string {
		return `<${this.nodeValue}>`;
	}
}

export class RxDocumentType extends RxNode {
	constructor(parentNode: RxElement | null = null, nodeValue: any) {
		super(parentNode);
		this.nodeType = RxNodeType.DOCUMENT_TYPE_NODE;
		this.nodeValue = String(nodeValue);
	}
	serialize(): string {
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

// !!! TODO
// Any web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree.//
// interface Document extends Node, DocumentAndElementEventHandlers, DocumentOrShadowRoot, GlobalEventHandlers, NonElementParentNode, ParentNode, XPathEvaluatorBase {
export interface IDocument extends Document {
	/*
	readonly URL: string; // Sets or gets the URL for the current document.
	readonly characterSet: string; // Returns document's encoding.
	readonly charset: string; // Gets or sets the character set used to encode the object.
	readonly compatMode: string; // Gets a value that indicates whether standards-compliant mode is switched on for the object.
	readonly contentType: string; // Returns document's content type.
	readonly currentScript: HTMLOrSVGScriptElement | null; // Returns the script element, or the SVG script element, that is currently executing, as long as the element represents a classic script. In the case of reentrant script execution, returns the one that most recently started executing amongst those that have not yet finished executing.
	readonly defaultView: (WindowProxy & typeof globalThis) | null; // Returns null if the Document is not currently executing a script or SVG script element (e.g., because the running script is an event handler, or a timeout), or if the currently executing script or SVG script element represents a module script.
	readonly doctype: DocumentType | null; // Gets an object representing the document type declaration associated with the current document.
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
	body: HTMLElement; // Specifies the beginning and end of the document body.
	cookie: string; // Returns the HTTP cookies that apply to the Document. If there are no cookies or cookies can't be applied to this resource, the empty string will be returned.
	// Can be set, to add a new cookie to the element's set of HTTP cookies.
	// If the contents are sandboxed into a unique origin (e.g. in an iframe with the sandbox attribute), a "SecurityError" DOMException will be thrown on getting and setting.
	designMode: string; // Sets or gets a value that indicates whether the document can be edited.
	dir: string; // Sets or retrieves a value that indicates the reading order of the object.
	domain: string; // Sets or gets the security domain of the document.
	location: Location; // Contains information about the current URL.
	title: string; // Contains the title of the document.
	// METHODS
	onfullscreenchange: ((this: Document, ev: Event) => any) | null;
	onfullscreenerror: ((this: Document, ev: Event) => any) | null;
	onpointerlockchange: ((this: Document, ev: Event) => any) | null;
	onpointerlockerror: ((this: Document, ev: Event) => any) | null;
	onreadystatechange: ((this: Document, ev: Event) => any) | null; // Fires when the state of the object has changed.
	// @param ev The event
	onvisibilitychange: ((this: Document, ev: Event) => any) | null;
	adoptNode<T extends Node>(source: T): T; // Moves node from another document and returns it.
	// If node is a document, throws a "NotSupportedError" DOMException or, if node is a shadow root, throws a "HierarchyRequestError" DOMException.
	caretPositionFromPoint(x: number, y: number): CaretPosition | null;
	close(): void; // Closes an output stream and forces the sent data to display.
	createAttribute(localName: string): Attr; // Creates an attribute object with a specified name.
	// @param name String that sets the attribute object's name.
	createAttributeNS(namespace: string | null, qualifiedName: string): Attr;
	createCDATASection(data: string): CDATASection; // Returns a CDATASection node whose data is data.
	createComment(data: string): Comment; // Creates a comment object with the specified data.
	// @param data Sets the comment object's data.
	createDocumentFragment(): DocumentFragment; // Creates a new document.
	createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K]; // Creates an instance of the element for the specified tag.
	// @param tagName The name of an element.
	createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
	createElementNS(namespaceURI: 'http://www.w3.org/1999/xhtml', qualifiedName: string): HTMLElement;
	createElementNS<K extends keyof SVGElementTagNameMap>(namespaceURI: 'http://www.w3.org/2000/svg', qualifiedName: K): SVGElementTagNameMap[K];
	createElementNS(namespaceURI: 'http://www.w3.org/2000/svg', qualifiedName: string): SVGElement;
	createElementNS(namespaceURI: string | null, qualifiedName: string, options?: ElementCreationOptions): Element;
	createElementNS(namespace: string | null, qualifiedName: string, options?: string | ElementCreationOptions): Element; // Returns an element with namespace namespace. Its namespace prefix will be everything before ":" (U+003E) in qualifiedName or null. Its local name will be everything after ":" (U+003E) in qualifiedName or qualifiedName.
	// If localName does not match the Name production an 'InvalidCharacterError' DOMException will be thrown.
	// If one of the following conditions is true a 'NamespaceError' DOMException will be thrown:
	// localName does not match the QName production.
	// Namespace prefix is not null and namespace is the empty string.
	// Namespace prefix is 'xml' and namespace is not the XML namespace.
	// qualifiedName or namespace prefix is 'xmlns' and namespace is not the XMLNS namespace.
	// namespace is the XMLNS namespace and neither qualifiedName nor namespace prefix is 'xmlns'.
	// When supplied, options's is can be used to create a customized built-in element.
	createEvent(eventInterface: 'AnimationEvent'): AnimationEvent;
	createEvent(eventInterface: 'AnimationPlaybackEvent'): AnimationPlaybackEvent;
	createEvent(eventInterface: 'AudioProcessingEvent'): AudioProcessingEvent;
	createEvent(eventInterface: 'BeforeUnloadEvent'): BeforeUnloadEvent;
	createEvent(eventInterface: 'ClipboardEvent'): ClipboardEvent;
	createEvent(eventInterface: 'CloseEvent'): CloseEvent;
	createEvent(eventInterface: 'CompositionEvent'): CompositionEvent;
	createEvent(eventInterface: 'CustomEvent'): CustomEvent;
	createEvent(eventInterface: 'DeviceLightEvent'): DeviceLightEvent;
	createEvent(eventInterface: 'DeviceMotionEvent'): DeviceMotionEvent;
	createEvent(eventInterface: 'DeviceOrientationEvent'): DeviceOrientationEvent;
	createEvent(eventInterface: 'DragEvent'): DragEvent;
	createEvent(eventInterface: 'ErrorEvent'): ErrorEvent;
	createEvent(eventInterface: 'Event'): Event;
	createEvent(eventInterface: 'Events'): Event;
	createEvent(eventInterface: 'FocusEvent'): FocusEvent;
	createEvent(eventInterface: 'FocusNavigationEvent'): FocusNavigationEvent;
	createEvent(eventInterface: 'GamepadEvent'): GamepadEvent;
	createEvent(eventInterface: 'HashChangeEvent'): HashChangeEvent;
	createEvent(eventInterface: 'IDBVersionChangeEvent'): IDBVersionChangeEvent;
	createEvent(eventInterface: 'InputEvent'): InputEvent;
	createEvent(eventInterface: 'KeyboardEvent'): KeyboardEvent;
	createEvent(eventInterface: 'ListeningStateChangedEvent'): ListeningStateChangedEvent;
	createEvent(eventInterface: 'MSGestureEvent'): MSGestureEvent;
	createEvent(eventInterface: 'MSMediaKeyMessageEvent'): MSMediaKeyMessageEvent;
	createEvent(eventInterface: 'MSMediaKeyNeededEvent'): MSMediaKeyNeededEvent;
	createEvent(eventInterface: 'MSPointerEvent'): MSPointerEvent;
	createEvent(eventInterface: 'MediaEncryptedEvent'): MediaEncryptedEvent;
	createEvent(eventInterface: 'MediaKeyMessageEvent'): MediaKeyMessageEvent;
	createEvent(eventInterface: 'MediaQueryListEvent'): MediaQueryListEvent;
	createEvent(eventInterface: 'MediaStreamErrorEvent'): MediaStreamErrorEvent;
	createEvent(eventInterface: 'MediaStreamEvent'): MediaStreamEvent;
	createEvent(eventInterface: 'MediaStreamTrackEvent'): MediaStreamTrackEvent;
	createEvent(eventInterface: 'MessageEvent'): MessageEvent;
	createEvent(eventInterface: 'MouseEvent'): MouseEvent;
	createEvent(eventInterface: 'MouseEvents'): MouseEvent;
	createEvent(eventInterface: 'MutationEvent'): MutationEvent;
	createEvent(eventInterface: 'MutationEvents'): MutationEvent;
	createEvent(eventInterface: 'OfflineAudioCompletionEvent'): OfflineAudioCompletionEvent;
	createEvent(eventInterface: 'OverflowEvent'): OverflowEvent;
	createEvent(eventInterface: 'PageTransitionEvent'): PageTransitionEvent;
	createEvent(eventInterface: 'PaymentRequestUpdateEvent'): PaymentRequestUpdateEvent;
	createEvent(eventInterface: 'PermissionRequestedEvent'): PermissionRequestedEvent;
	createEvent(eventInterface: 'PointerEvent'): PointerEvent;
	createEvent(eventInterface: 'PopStateEvent'): PopStateEvent;
	createEvent(eventInterface: 'ProgressEvent'): ProgressEvent;
	createEvent(eventInterface: 'PromiseRejectionEvent'): PromiseRejectionEvent;
	createEvent(eventInterface: 'RTCDTMFToneChangeEvent'): RTCDTMFToneChangeEvent;
	createEvent(eventInterface: 'RTCDataChannelEvent'): RTCDataChannelEvent;
	createEvent(eventInterface: 'RTCDtlsTransportStateChangedEvent'): RTCDtlsTransportStateChangedEvent;
	createEvent(eventInterface: 'RTCErrorEvent'): RTCErrorEvent;
	createEvent(eventInterface: 'RTCIceCandidatePairChangedEvent'): RTCIceCandidatePairChangedEvent;
	createEvent(eventInterface: 'RTCIceGathererEvent'): RTCIceGathererEvent;
	createEvent(eventInterface: 'RTCIceTransportStateChangedEvent'): RTCIceTransportStateChangedEvent;
	createEvent(eventInterface: 'RTCPeerConnectionIceErrorEvent'): RTCPeerConnectionIceErrorEvent;
	createEvent(eventInterface: 'RTCPeerConnectionIceEvent'): RTCPeerConnectionIceEvent;
	createEvent(eventInterface: 'RTCSsrcConflictEvent'): RTCSsrcConflictEvent;
	createEvent(eventInterface: 'RTCStatsEvent'): RTCStatsEvent;
	createEvent(eventInterface: 'RTCTrackEvent'): RTCTrackEvent;
	createEvent(eventInterface: 'SVGZoomEvent'): SVGZoomEvent;
	createEvent(eventInterface: 'SVGZoomEvents'): SVGZoomEvent;
	createEvent(eventInterface: 'SecurityPolicyViolationEvent'): SecurityPolicyViolationEvent;
	createEvent(eventInterface: 'ServiceWorkerMessageEvent'): ServiceWorkerMessageEvent;
	createEvent(eventInterface: 'SpeechRecognitionEvent'): SpeechRecognitionEvent;
	createEvent(eventInterface: 'SpeechSynthesisErrorEvent'): SpeechSynthesisErrorEvent;
	createEvent(eventInterface: 'SpeechSynthesisEvent'): SpeechSynthesisEvent;
	createEvent(eventInterface: 'StorageEvent'): StorageEvent;
	createEvent(eventInterface: 'TextEvent'): TextEvent;
	createEvent(eventInterface: 'TouchEvent'): TouchEvent;
	createEvent(eventInterface: 'TrackEvent'): TrackEvent;
	createEvent(eventInterface: 'TransitionEvent'): TransitionEvent;
	createEvent(eventInterface: 'UIEvent'): UIEvent;
	createEvent(eventInterface: 'UIEvents'): UIEvent;
	createEvent(eventInterface: 'VRDisplayEvent'): VRDisplayEvent;
	createEvent(eventInterface: 'VRDisplayEvent '): VRDisplayEvent;
	createEvent(eventInterface: 'WebGLContextEvent'): WebGLContextEvent;
	createEvent(eventInterface: 'WheelEvent'): WheelEvent;
	createEvent(eventInterface: string): Event;
	createNodeIterator(root: Node, whatToShow?: number, filter?: NodeFilter | null): NodeIterator; // Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
	// @param root The root element or node to start traversing on.
	// @param whatToShow The type of nodes or elements to appear in the node list
	// @param filter A custom NodeFilter function to use. For more information, see filter. Use null for no filter.
	// @param entityReferenceExpansion A flag that specifies whether entity reference nodes are expanded.
	createProcessingInstruction(target: string, data: string): ProcessingInstruction; // Returns a ProcessingInstruction node whose target is target and data is data. If target does not match the Name production an 'InvalidCharacterError' DOMException will be thrown. If data contains "?>" an "InvalidCharacterError" DOMException will be thrown.
	createRange(): Range; // Returns an empty range object that has both of its boundary points positioned at the beginning of the document.
	createTextNode(data: string): Text; // Creates a text string from the specified value.
	// @param data String that specifies the nodeValue property of the text node.
	createTreeWalker(root: Node, whatToShow?: number, filter?: NodeFilter | null): TreeWalker; // Creates a TreeWalker object that you can use to traverse filtered lists of nodes or elements in a document.
	// @param root The root element or node to start traversing on.
	// @param whatToShow The type of nodes or elements to appear in the node list. For more information, see whatToShow.
	// @param filter A custom NodeFilter function to use.
	// @param entityReferenceExpansion A flag that specifies whether entity reference nodes are expanded.
	elementFromPoint(x: number, y: number): Element | null; // Returns the element for the specified x coordinate and the specified y coordinate.
	// @param x The x-offset
	// @param y The y-offset
	elementsFromPoint(x: number, y: number): Element[];
	execCommand(commandId: string, showUI?: boolean, value?: string): boolean; // Executes a command on the current document, current selection, or the given range.
	// @param commandId String that specifies the command to execute. This command can be any of the command identifiers that can be executed in script.
	// @param showUI Display the user interface, defaults to false.
	// @param value Value to assign.
	exitFullscreen(): Promise<void>; // Stops document's fullscreen element from being displayed fullscreen and resolves promise when done.
	exitPointerLock(): void;
	getAnimations(): Animation[];
	getElementById(elementId: string): HTMLElement | null; // Returns a reference to the first object with the specified value of the ID or NAME attribute.
	// @param elementId String that specifies the ID value. Case-insensitive.
	getElementsByClassName(classNames: string): HTMLCollectionOf<Element>; // Returns a HTMLCollection of the elements in the object on which the method was invoked (a document or an element) that have all the classes given by classNames. The classNames argument is interpreted as a space-separated list of classes.
	getElementsByName(elementName: string): NodeListOf<HTMLElement>; // Gets a collection of objects based on the value of the NAME or ID attribute.
	// @param elementName Gets a collection of objects based on the value of the NAME or ID attribute.
	getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
	getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>;
	getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>; // Retrieves a collection of objects based on the specified element name.
	// @param name Specifies the name of an element.
	getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/1999/xhtml', localName: string): HTMLCollectionOf<HTMLElement>;
	getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/2000/svg', localName: string): HTMLCollectionOf<SVGElement>;
	getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf<Element>; // If namespace and localName are '*' returns a HTMLCollection of all descendant elements.
	// If only namespace is '*' returns a HTMLCollection of all descendant elements whose local name is localName.
	// If only localName is '*' returns a HTMLCollection of all descendant elements whose namespace is namespace.
	// Otherwise, returns a HTMLCollection of all descendant elements whose namespace is namespace and local name is localName.
	getSelection(): Selection | null; // Returns an object representing the current selection of the document that is loaded into the object displaying a webpage.
	hasFocus(): boolean; // Gets a value indicating whether the object currently has focus.
	importNode<T extends Node>(importedNode: T, deep: boolean): T; // Returns a copy of node. If deep is true, the copy also includes the node's descendants.
	// If node is a document or a shadow root, throws a 'NotSupportedError' DOMException.
	open(url?: string, name?: string, features?: string, replace?: boolean): Document; // Opens a new window and loads a document specified by a given URL. Also, opens a new window that uses the url parameter and the name parameter to collect the output of the write method and the writeln method.
	// @param url Specifies a MIME type for the document.
	// @param name Specifies the name of the window. This name is used as the value for the TARGET attribute on a form or an anchor element.
	// @param features Contains a list of items separated by commas. Each item consists of an option and a value, separated by an equals sign (for example, "fullscreen=yes, toolbar=yes"). The following values are supported.
	// @param replace Specifies whether the existing entry for the document is replaced in the history list.
	queryCommandEnabled(commandId: string): boolean; // Returns a Boolean value that indicates whether a specified command can be successfully executed using execCommand, given the current state of the document.
	// @param commandId Specifies a command identifier.
	queryCommandIndeterm(commandId: string): boolean; // Returns a Boolean value that indicates whether the specified command is in the indeterminate state.
	// @param commandId String that specifies a command identifier.
	queryCommandState(commandId: string): boolean; // Returns a Boolean value that indicates the current state of the command.
	// @param commandId String that specifies a command identifier.
	queryCommandSupported(commandId: string): boolean; // Returns a Boolean value that indicates whether the current command is supported on the current range.
	// @param commandId Specifies a command identifier.
	queryCommandValue(commandId: string): string; // Returns the current value of the document, range, or current selection for the given command.
	// @param commandId String that specifies a command identifier.
	write(...text: string[]): void; // Writes one or more HTML expressions to a document in the specified window.
	// @param content Specifies the text and HTML tags to write.
	writeln(...text: string[]): void; // Writes one or more HTML expressions, followed by a carriage return, to a document in the specified window.
	// @param content The text and HTML tags to write.
	addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
	addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
	removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
	removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
	// DEPRECATED !!!
	// @deprecated
	// createElement<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementDeprecatedTagNameMap[K];
	// @deprecated
	// createTreeWalker(root: Node, whatToShow: number, filter: NodeFilter | null, entityReferenceExpansion?: boolean): TreeWalker;
	// Sets or gets the color of all active links in the document.
	// @deprecated
	// alinkColor: string; // Returns a reference to the collection of elements contained by the object.
	// @deprecated
	// readonly all: HTMLAllCollection; // Retrieves a collection of all a objects that have a name and/or id property. Objects in this collection are in HTML source order.
	// @deprecated
	// readonly anchors: HTMLCollectionOf<HTMLAnchorElement>; // Retrieves a collection of all applet objects in the document.
	// @deprecated
	// readonly applets: HTMLCollectionOf<HTMLAppletElement>; // Deprecated. Sets or retrieves a value that indicates the background color behind the object.
	// @deprecated
	// bgColor: string; // Sets or gets the foreground (text) color of the document.
	// @deprecated
	// fgColor: string; // @deprecated
	// readonly fullscreen: boolean; // Sets or gets the color of the document links.
	// @deprecated
	// linkColor: string; // Sets or gets the color of the links that the user has visited.
	// @deprecated
	// vlinkColor: string; // @deprecated
	// captureEvents(): void; // @deprecated
	// caretRangeFromPoint(x: number, y: number): Range; // @deprecated
	// clear(): void; // @deprecated
	// releaseEvents(): void;
	*/
}

export class RxDocument extends RxElement {
	private location_: ILocation = RxLocation.location;
	get location() {
		return this.location_;
	}
	get URL(): string {
		return this.location_.href;
	}
	get hidden(): true {
		return true;
	}
	get visibilityState(): 'prerender' {
		return 'prerender';
	}
	get doctype(): RxDocumentType | null {
		return this.childNodes.find(x => isRxDocumentType(x)) as RxDocumentType;
	}
	get head(): RxElement {
		// console.log('childNodes', this.childNodes);
		let head: RxElement | null = this.documentElement.childNodes.find(x => isRxElement(x) && x.nodeName === 'head') as RxElement;
		if (!head) {
			head = new RxElement(this.documentElement, 'head');
			this.documentElement.append(head);
		}
		return head;
	}
	get body(): RxElement | null {
		let body: RxElement | null = this.childNodes.find(x => isRxElement(x) && x.nodeName === 'body') as RxElement;
		if (!body) {
			body = new RxElement(this.documentElement, 'body');
			this.documentElement.append(body);
		}
		return body;
	}
	get title(): string | null {
		const title = this.head.childNodes.find(x => isRxElement(x) && x.nodeName === 'title') as RxElement;
		if (title) {
			return title.innerText;
		} else {
			return null;
		}
	}
	set title(nodeValue: string | null) {
		let title: RxElement | null = this.head.childNodes.find(x => isRxElement(x) && x.nodeName === 'title') as RxElement | null;
		if (!title) {
			title = new RxElement(this.head, 'title');
		}
		title.innerText = nodeValue;
	}
	get documentElement(): RxElement {
		let element: RxElement | null = this.firstElementChild;
		if (!element) {
			element = new RxElement(this, 'html');
		}
		return element;
	}

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
		this.nodeType = RxNodeType.DOCUMENT_NODE;
		this.childNodes = [];
	}
	createAttribute() { }
	// Creates a new Attr object and returns it.
	createAttributeNS() { }
	// Creates a new attribute node in a given namespace and returns it.
	createCDATASection() { }
	// Creates a new CDATA node and returns it.
	createComment(nodeValue: string) {
		return new RxComment(null, nodeValue);
	}
	// Creates a new comment node and returns it.
	createDocumentFragment() {
		return new RxDocumentFragment();
	}
	// Creates a new document fragment.
	createElement(nodeName: string): RxElement {
		return new RxElement(null, nodeName);
	}
	// Creates a new element with the given tag name.
	createElementNS(nodeName: string): RxElement {
		return new RxElement(null, nodeName);
	}
	// Creates a new element with the given tag name and namespace URI.
	createEvent() { }
	// Creates an event object.
	createNodeIterator() { }
	// Creates a NodeIterator object.
	createProcessingInstruction(nodeValue: string) {
		return new RxProcessingInstruction(null, nodeValue);
	}
	// Creates a new ProcessingInstruction object.
	createRange() { }
	// Creates a Range object.
	createTextNode(nodeValue: string) {
		return new RxText(null, nodeValue);
	}
	// Creates a text node.
	createTouchList() { }
	// Creates a TouchList object.
	createTreeWalker() { }
	// Creates a TreeWalker object.
	serialize(): string {
		return `${this.childNodes.map(x => x.serialize()).join('')}`;
	}
}

/** A window containing a DOM document; the document property points to the DOM document loaded in that window. */
export interface IWindow { // extends Window
	readonly applicationCache?: ApplicationCache;
	readonly clientInformation?: Navigator;
	readonly closed?: boolean;
	readonly devicePixelRatio?: number;
	readonly doNotTrack?: string;
	readonly document?: Document;
	readonly frameElement?: Element;
	readonly frames?: Window;
	readonly history?: History;
	readonly innerHeight?: number;
	readonly innerWidth?: number;
	readonly length?: number;
	readonly locationbar?: BarProp;
	readonly menubar?: BarProp;
	readonly msContentScript?: ExtensionScriptApis;
	readonly navigator?: Navigator;
	readonly outerHeight?: number;
	readonly outerWidth?: number;
	readonly pageXOffset?: number;
	readonly pageYOffset?: number;
	readonly parent?: Window;
	readonly personalbar?: BarProp;
	readonly screen?: Screen;
	readonly screenLeft?: number;
	readonly screenTop?: number;
	readonly screenX?: number;
	readonly screenY?: number;
	readonly scrollX?: number;
	readonly scrollY?: number;
	readonly scrollbars?: BarProp;
	readonly self?: Window & typeof globalThis;
	readonly speechSynthesis?: SpeechSynthesis;
	readonly statusbar?: BarProp;
	readonly styleMedia?: StyleMedia;
	readonly toolbar?: BarProp;
	readonly top?: Window;
	readonly window?: Window & typeof globalThis;
	customElements?: CustomElementRegistry;
	defaultStatus?: string;
	location?: Location;
	name?: string;
	offscreenBuffering?: string | boolean;
	opener?: any;
	status?: string;
	[index: number]: Window;
	/*
	alert(message?: any): void;
	blur(): void;
	close(): void;
	confirm(message?: string): boolean;
	departFocus(navigationReason: NavigationReason, origin: FocusNavigationOrigin): void;
	focus(): void;
	getComputedStyle(elt: Element, pseudoElt?: string | null): CSSStyleDeclaration;
	getMatchedCSSRules(elt: Element, pseudoElt?: string | null): CSSRuleList;
	getSelection(): Selection | null;
	matchMedia(query: string): MediaQueryList;
	moveBy(x: number, y: number): void;
	moveTo(x: number, y: number): void;
	msWriteProfilerMark(profilerMarkName: string): void;
	open(url?: string, target?: string, features?: string, replace?: boolean): Window | null;
	postMessage(message: any, targetOrigin: string, transfer?: Transferable[]): void;
	print(): void;
	prompt(message?: string, _default?: string): string | null;
	resizeBy(x: number, y: number): void;
	resizeTo(x: number, y: number): void;
	scroll(options?: ScrollToOptions): void;
	scroll(x: number, y: number): void;
	scrollBy(options?: ScrollToOptions): void;
	scrollBy(x: number, y: number): void;
	scrollTo(options?: ScrollToOptions): void;
	scrollTo(x: number, y: number): void;
	stop(): void;
	webkitCancelAnimationFrame(handle: number): void;
	webkitConvertPointFromNodeToPage(node: Node, pt: WebKitPoint): WebKitPoint;
	webkitConvertPointFromPageToNode(node: Node, pt: WebKitPoint): WebKitPoint;
	webkitRequestAnimationFrame(callback: FrameRequestCallback): number;
	addEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, event: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
	addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
	removeEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, event: WindowEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
	removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
	oncompassneedscalibration: ((this: Window, event: Event) => any) | null;
	ondevicelight: ((this: Window, event: DeviceLightEvent) => any) | null;
	ondevicemotion: ((this: Window, event: DeviceMotionEvent) => any) | null;
	ondeviceorientation: ((this: Window, event: DeviceOrientationEvent) => any) | null;
	ondeviceorientationabsolute: ((this: Window, event: DeviceOrientationEvent) => any) | null;
	onmousewheel: ((this: Window, event: Event) => any) | null;
	onmsgesturechange: ((this: Window, event: Event) => any) | null;
	onmsgesturedoubletap: ((this: Window, event: Event) => any) | null;
	onmsgestureend: ((this: Window, event: Event) => any) | null;
	onmsgesturehold: ((this: Window, event: Event) => any) | null;
	onmsgesturestart: ((this: Window, event: Event) => any) | null;
	onmsgesturetap: ((this: Window, event: Event) => any) | null;
	onmsinertiastart: ((this: Window, event: Event) => any) | null;
	onmspointercancel: ((this: Window, event: Event) => any) | null;
	onmspointerdown: ((this: Window, event: Event) => any) | null;
	onmspointerenter: ((this: Window, event: Event) => any) | null;
	onmspointerleave: ((this: Window, event: Event) => any) | null;
	onmspointermove: ((this: Window, event: Event) => any) | null;
	onmspointerout: ((this: Window, event: Event) => any) | null;
	onmspointerover: ((this: Window, event: Event) => any) | null;
	onmspointerup: ((this: Window, event: Event) => any) | null;
	onreadystatechange: ((this: Window, event: ProgressEvent<Window>) => any) | null;
	onvrdisplayactivate: ((this: Window, event: Event) => any) | null;
	onvrdisplayblur: ((this: Window, event: Event) => any) | null;
	onvrdisplayconnect: ((this: Window, event: Event) => any) | null;
	onvrdisplaydeactivate: ((this: Window, event: Event) => any) | null;
	onvrdisplaydisconnect: ((this: Window, event: Event) => any) | null;
	onvrdisplayfocus: ((this: Window, event: Event) => any) | null;
	onvrdisplaypointerrestricted: ((this: Window, event: Event) => any) | null;
	onvrdisplaypointerunrestricted: ((this: Window, event: Event) => any) | null;
	onvrdisplaypresentchange: ((this: Window, event: Event) => any) | null;
	*/
	// DEPRECATED !!!
	// @deprecated
	// readonly event: Event | undefined;
	// @deprecated
	// readonly external: External;
	// @deprecated
	// readonly orientation: string | number;
	// @deprecated
	// captureEvents(): void;
	// @deprecated
	// releaseEvents(): void;
	// @deprecated
	// onorientationchange: ((this: Window, event: Event) => any) | null;
}

export class RxWindow {
	readonly applicationCache!: ApplicationCache;
	readonly clientInformation!: Navigator;
	readonly closed!: boolean;
	readonly devicePixelRatio!: number;
	readonly doNotTrack!: string;
	readonly document!: Document;
	readonly frameElement!: Element;
	readonly frames!: Window;
	readonly history!: History;
	readonly innerHeight!: number;
	readonly innerWidth!: number;
	readonly length!: number;
	readonly locationbar!: BarProp;
	readonly menubar!: BarProp;
	readonly msContentScript!: ExtensionScriptApis;
	readonly navigator!: Navigator;
	readonly outerHeight!: number;
	readonly outerWidth!: number;
	readonly pageXOffset!: number;
	readonly pageYOffset!: number;
	readonly parent!: Window;
	readonly personalbar!: BarProp;
	readonly screen!: Screen;
	readonly screenLeft!: number;
	readonly screenTop!: number;
	readonly screenX!: number;
	readonly screenY!: number;
	readonly scrollX!: number;
	readonly scrollY!: number;
	readonly scrollbars!: BarProp;
	readonly self!: Window & typeof globalThis;
	readonly speechSynthesis!: SpeechSynthesis;
	readonly statusbar!: BarProp;
	readonly styleMedia!: StyleMedia;
	readonly toolbar!: BarProp;
	readonly top!: Window;
	readonly window!: Window & typeof globalThis;
	customElements!: CustomElementRegistry;
	defaultStatus!: string;
	location!: Location;
	name!: string;
	offscreenBuffering!: string | boolean;
	opener!: any;
	status!: string;
	[index: number]: Window;
	constructor(options?: IWindow) {
		if (options) {
			Object.assign(this, options);
		}
	}
	/* tslint:disable:no-unused-variable */
	alert(message?: any): void { }
	blur(): void { }
	close(): void { }
	confirm(message?: string): boolean { return false; }
	departFocus(navigationReason: NavigationReason, origin: FocusNavigationOrigin): void { }
	focus(): void { }
	getComputedStyle(elt: Element, pseudoElt?: string | null): any { } // CSSStyleDeclaration {}
	getMatchedCSSRules(elt: Element, pseudoElt?: string | null): any { } // CSSRuleList {}
	getSelection(): Selection | null { return null; }
	matchMedia(query: string): any { } // MediaQueryList { }
	moveBy(x: number, y: number): void { }
	moveTo(x: number, y: number): void { }
	msWriteProfilerMark(profilerMarkName: string): void { }
	open(url?: string, target?: string, features?: string, replace?: boolean): Window | null { return null; }
	postMessage(message: any, targetOrigin: string, transfer?: Transferable[]): void { }
	print(): void { }
	prompt(message?: string, _default?: string): string | null { return null; }
	resizeBy(x: number, y: number): void { }
	resizeTo(x: number, y: number): void { }
	scroll(...args: any[]): void { }
	scrollBy(...args: any[]): void { }
	scrollTo(...args: any[]): void { }
	stop(): void { }
	webkitCancelAnimationFrame(handle: number): void { }
	webkitConvertPointFromNodeToPage(node: Node, pt: WebKitPoint): any { } // WebKitPoint { }
	webkitConvertPointFromPageToNode(node: Node, pt: WebKitPoint): any { } // WebKitPoint { }
	webkitRequestAnimationFrame(callback: FrameRequestCallback): number { return 0; }
	addEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, event: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
	addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void { }
	removeEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, event: WindowEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
	removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void { }
	oncompassneedscalibration(event: Event): any | null { return null; }
	ondevicelight(event: DeviceLightEvent): any | null { return null; }
	ondevicemotion(event: DeviceMotionEvent): any | null { }
	ondeviceorientation(event: DeviceOrientationEvent): any | null { }
	ondeviceorientationabsolute(event: DeviceOrientationEvent): any | null { }
	onmousewheel(event: Event): any | null { }
	onmsgesturechange(event: Event): any | null { }
	onmsgesturedoubletap(event: Event): any | null { }
	onmsgestureend(event: Event): any | null { }
	onmsgesturehold(event: Event): any | null { }
	onmsgesturestart(event: Event): any | null { }
	onmsgesturetap(event: Event): any | null { }
	onmsinertiastart(event: Event): any | null { }
	onmspointercancel(event: Event): any | null { }
	onmspointerdown(event: Event): any | null { }
	onmspointerenter(event: Event): any | null { }
	onmspointerleave(event: Event): any | null { }
	onmspointermove(event: Event): any | null { }
	onmspointerout(event: Event): any | null { }
	onmspointerover(event: Event): any | null { }
	onmspointerup(event: Event): any | null { }
	onreadystatechange(event: ProgressEvent<Window>): any | null { }
	onvrdisplayactivate(event: Event): any | null { }
	onvrdisplayblur(event: Event): any | null { }
	onvrdisplayconnect(event: Event): any | null { }
	onvrdisplaydeactivate(event: Event): any | null { }
	onvrdisplaydisconnect(event: Event): any | null { }
	onvrdisplayfocus(event: Event): any | null { }
	onvrdisplaypointerrestricted(event: Event): any | null { }
	onvrdisplaypointerunrestricted(event: Event): any | null { }
	onvrdisplaypresentchange(event: Event): any | null { }
	/* tslint:enable:no-unused-variable */
}

/*
global: [Circular],
clearInterval: [Function: clearInterval],
clearTimeout: [Function: clearTimeout],
setInterval: [Function: setInterval],
setTimeout: [Function: setTimeout] { [Symbol(util.promisify.custom)]: [Function] },
queueMicrotask: [Function: queueMicrotask],
clearImmediate: [Function: clearImmediate],
setImmediate: [Function: setImmediate] {
[Symbol(util.promisify.custom)]: [Function]
},
__extends: [Function: __extends],
__assign: [Function: assign],
__rest: [Function: __rest],
__decorate: [Function: __decorate],
__param: [Function: __param],
__metadata: [Function: __metadata],
__awaiter: [Function: __awaiter],
__generator: [Function: __generator],
__exportStar: [Function: __exportStar],
__createBinding: [Function],
__values: [Function: __values],
__read: [Function: __read],
__spread: [Function: __spread],
__spreadArrays: [Function: __spreadArrays],
__await: [Function: __await],
__asyncGenerator: [Function: __asyncGenerator],
__asyncDelegator: [Function: __asyncDelegator],
__asyncValues: [Function: __asyncValues],
__makeTemplateObject: [Function: __makeTemplateObject],
__importStar: [Function: __importStar],
__importDefault: [Function: __importDefault],
__classPrivateFieldGet: [Function: __classPrivateFieldGet],
__classPrivateFieldSet: [Function: __classPrivateFieldSet],
fetch: [Function: bound fetch] { polyfill: true },
Response: undefined,
Headers: undefined,
Request: undefined
*/

export function isRxElement(x: RxNode): x is RxElement {
	return x.nodeType === RxNodeType.ELEMENT_NODE;
}

export function isRxText(x: RxNode): x is RxText {
	return x.nodeType === RxNodeType.TEXT_NODE;
}

export function isRxComment(x: RxNode): x is RxComment {
	return x.nodeType === RxNodeType.COMMENT_NODE;
}

export function isRxDocument(x: RxNode): x is RxDocument {
	return x.nodeType === RxNodeType.DOCUMENT_NODE;
}

export function isRxDocumentFragment(x: RxNode): x is RxDocumentFragment {
	return x.nodeType === RxNodeType.DOCUMENT_FRAGMENT_NODE;
}

export function isRxDocumentType(x: RxNode): x is RxDocumentType {
	return x.nodeType === RxNodeType.DOCUMENT_TYPE_NODE;
}

export function isRxProcessingInstruction(x: RxNode): x is RxProcessingInstruction {
	return x.nodeType === RxNodeType.PROCESSING_INSTRUCTION_NODE;
}

export function parse(html: string) {
	const doc = new RxDocument();
	let parentNode: RxElement = doc,
		node;
	const parser = new Parser(
		{
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
				} else {
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
			/*
			oncdatastart: () => {
				// console.log('oncdatastart');
			},
			oncdataend: () => {
				// console.log('oncdataend');
			},
			onerror: error => {
				// console.log('error', error);
			},
			onopentagname: (name) => {
				// console.log('onopentagname', name);
			},
			onattribute: (name, value) => {
				// console.log('onattribute', name, value);
			},
			onreset: () => {
				// console.log('reset');
			},
			onend: () => {
				// console.log('end');
			},
			*/
		},
		{
			decodeEntities: false,
			lowerCaseTags: true,
		}
	);
	parser.write(html);
	parser.end();
	return doc;
}

export function getQueries(selector: string): RxQuery[] {
	const queries: RxQuery[] = [];
	selector
		.trim()
		.split(' ')
		.forEach((x: string) => {
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
						} else if (match[2]) {
							selectors.push({ selector: match[2], type: SelectorType.Class, negate: true });
						} else if (match[3]) {
							selectors.push({ selector: match[3], type: SelectorType.Attribute, negate: true });
						} else if (match[4]) {
							selectors.push({ selector: match[4], type: SelectorType.TagName, negate: true });
						} else if (match[5]) {
							selectors.push({ selector: match[5], type: SelectorType.Id, negate: false });
						} else if (match[6]) {
							selectors.push({ selector: match[6], type: SelectorType.Class, negate: false });
						} else if (match[7]) {
							selectors.push({ selector: match[7], type: SelectorType.Attribute, negate: false });
						} else if (match[8]) {
							selectors.push({ selector: match[8], type: SelectorType.TagName, negate: false });
						}
						// console.log('match', match);
					}
					const selector =
						i > 0
							? { selector: x, selectors, inner: true }
							: { selector: x, selectors, inner: false };
					queries.push.call(queries, selector);
				});
		});
	return queries;
}

export function matchSelector(child: RxElement, selector: RxSelector): boolean {
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

export function matchSelectors(child: RxElement, selectors: RxSelector[]): boolean {
	return selectors.reduce(function (p: boolean, selector: RxSelector) {
		return p && matchSelector(child, selector);
	}, true);
}

export function querySelectorAll(queries: RxQuery[], childNodes: RxNode[], query: RxQuery | null = null, nodes: RxElement[] = []): RxElement[] | null {
	if (query || queries.length) {
		query = query || queries.shift() as RxQuery;
		for (let child of childNodes) {
			if (child instanceof RxElement) {
				if (matchSelectors(child, query.selectors)) {
					// console.log(query);
					if (queries.length) {
						const results: RxElement[] | null = querySelectorAll(queries, child.childNodes);
						if (results) {
							Array.prototype.push.apply(nodes, results);
						}
					} else {
						nodes.push(child);
					}
				} else if (!query.inner) {
					const results: RxElement[] | null = querySelectorAll(queries, child.childNodes, query);
					if (results) {
						Array.prototype.push.apply(nodes, results);
					}
				}
			}
		}
	}
	return nodes.length ? nodes : null;
}

export function querySelector(queries: RxQuery[], childNodes: RxNode[], query: RxQuery | null = null): RxElement | null {
	let node = null;
	if (query || queries.length) {
		query = query || queries.shift() as RxQuery;
		for (let child of childNodes) {
			if (child instanceof RxElement) {
				if (matchSelectors(child, query.selectors)) {
					// console.log(query);
					if (queries.length) {
						return querySelector(queries, child.childNodes);
					} else {
						return child;
					}
				} else if (!query.inner) {
					node = querySelector(queries, child.childNodes, query);
				}
			}
		}
	}
	return node;
}

export function cloneNode(source: RxNode, deep: boolean = false, parentNode: RxElement | null = null): RxNode {
	let node: RxNode;
	if (isRxElement(source)) {
		const nodeElement: RxElement = new RxElement(
			parentNode,
			source.nodeName,
			Object.assign({}, source.attributes),
		);
		if (deep) {
			nodeElement.childNodes = source.childNodes.map(x => cloneNode.apply(x, [x, deep, nodeElement]));
		}
		node = nodeElement;
	} else if (isRxDocumentFragment(source)) {
		const nodeDocumentFragment: RxDocumentFragment = new RxDocumentFragment();
		if (deep) {
			nodeDocumentFragment.childNodes = source.childNodes.map(x => cloneNode.apply(x, [x, deep, nodeDocumentFragment]));
		}
		node = nodeDocumentFragment;
	} else if (isRxText(source)) {
		node = new RxText(parentNode, source.nodeValue);
	} else if (isRxComment(source)) {
		node = new RxComment(parentNode, source.nodeValue);
	} else if (isRxDocument(source)) {
		const documentElement: RxDocument = new RxDocument();
		if (deep) {
			documentElement.childNodes = source.childNodes.map(x => cloneNode.apply(x, [x, deep, documentElement]));
		}
		node = documentElement;
	} else {
		throw new Error('Invalid node type');
	}
	return node;
}
