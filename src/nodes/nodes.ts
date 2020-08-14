import { Parser } from 'htmlparser2';

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
			oncdatastart: () => {
				console.log('oncdatastart');
			},
			oncdataend: () => {
				console.log('oncdataend');
			},
			onerror: error => {
				console.log('error', error);
			},
			/*
			onopentagname: (name) => {
				console.log('onopentagname', name);
			},
			onattribute: (name, value) => {
				console.log('onattribute', name, value);
			},
			onreset: () => {
				console.log('reset');
			},
			onend: () => {
				console.log('end');
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
	constructor(node: RxElement) {
		Object.defineProperty(this, 'node', {
			value: node,
			writable: false,
			enumerable: false
		});
		this.init();
	}
}

export class RxClassList extends Array<string> {
	node: RxElement;
	item(index: number) {
		return this[index];
	}
	contains(name: string): boolean {
		return this.indexOf(name) !== -1;
	}
	add(...names: string[]) {
		names.forEach(name => {
			if (this.indexOf(name) !== -1) {
				this.push(name);
			}
		});
		this.serialize_();
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
		this.node.attributes.class = this.join(' ');
	}
	init() {
		this.length = 0;
		if (this.node.attributes?.class) {
			Array.prototype.push.apply(this, this.node.attributes.class.split(' ').map(name => name.trim()));
		}
	}
	constructor(node: RxElement) {
		super();
		this.node = node;
		this.init();
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
			node = nodes[i++];
			if (node.nodeType === RxNodeType.ELEMENT_NODE) {
				children.push(node as RxElement);
			}
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
		this.style = new RxStyle(this);
		this.classList = new RxClassList(this);
		this.childNodes = [];
		/*
			if (SKIP.indexOf(nodeName) === -1) {
				console.log(parentNode.nodeName, '>', nodeName);
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
		const nodes = this.childNodes.filter(x => {
			return true;
		});
		console.log(queries);
		return nodes.length ? nodes : null;
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
	cloneNode(deep: boolean = false) {
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

export class RxDocument extends RxElement {
	get hidden(): true {
		return true;
	}
	get visibilityState(): 'prerender' {
		return 'prerender';
	}
	get doctype(): RxDocumentType | null {
		return this.childNodes.find(x => isRxDocumentType(x)) as RxDocumentType;
	}
	get body(): RxElement | null {
		return this.childNodes.find(x => isRxElement(x) && x.nodeName === 'body') as RxElement;
	}
	get head(): RxElement | null {
		return this.childNodes.find(x => isRxElement(x) && x.nodeName === 'head') as RxElement;
	}
	get title(): string | null {
		const title = this.childNodes.find(x => isRxElement(x) && x.nodeName === 'title') as RxElement;
		if (title) {
			return title.innerText;
		} else {
			return null;
		}
	}
	set title(nodeValue: string | null) {
		const title = this.childNodes.find(x => isRxElement(x) && x.nodeName === 'title') as RxElement;
		if (title) {
			title.innerText = nodeValue;
		}
	}
	get documentElement(): RxElement | null {
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
