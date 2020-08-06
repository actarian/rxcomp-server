export declare enum RxNodeType {
    ELEMENT_NODE = 1,
    TEXT_NODE = 3,
    CDATA_SECTION_NODE = 4,
    PROCESSING_INSTRUCTION_NODE = 7,
    COMMENT_NODE = 8,
    DOCUMENT_NODE = 9,
    DOCUMENT_TYPE_NODE = 10,
    DOCUMENT_FRAGMENT_NODE = 11
}
export declare enum SelectorType {
    None = -1,
    Id = 0,
    Class = 1,
    Attribute = 2,
    TagName = 3
}
export declare function isRxElement(x: RxNode): x is RxElement;
export declare function isRxText(x: RxNode): x is RxText;
export declare function isRxComment(x: RxNode): x is RxComment;
export declare function isRxDocument(x: RxNode): x is RxDocument;
export declare function isRxDocumentType(x: RxNode): x is RxDocumentType;
export declare function isRxProcessingInstruction(x: RxNode): x is RxProcessingInstruction;
export declare function parse(html: string): RxDocument;
export declare function getQueries(selector: string): RxQuery[];
export declare function querySelectorAll(queries: RxQuery[], childNodes: RxNode[], nodes?: never[]): RxElement[] | null;
export declare function querySelector(queries: RxQuery[], childNodes: RxNode[], query?: RxQuery | null): RxElement | null;
export declare function cloneNode(source: RxNode, deep?: boolean, parentNode?: null): RxNode;
export declare class RxSelector {
    selector: string;
    type: SelectorType;
    constructor(options: RxSelector);
}
export declare class RxQuery {
    selector: string;
    selectors: RxSelector[];
    inner: boolean;
    constructor(options: RxQuery);
}
export declare class RxNode {
    parentNode: RxElement | null;
    nodeType: RxNodeType;
    nodeValue: string | null;
    constructor(parentNode?: RxElement | null);
    cloneNode(deep?: boolean): RxNode;
    serialize(): string;
}
export declare class RxElement extends RxNode {
    nodeName: string;
    childNodes: RxNode[];
    attributes: {
        [key: string]: string | null;
    };
    get children(): RxElement[];
    get childElementCount(): number;
    get firstChild(): RxNode | null;
    get firstElementChild(): RxElement | null;
    get lastElementChild(): RxElement | null;
    get previousSibling(): RxNode | null;
    get nextSibling(): RxNode | null;
    get outerHTML(): string | null;
    get wholeText(): string | null;
    get classList(): string[];
    set innerText(nodeValue: string | null);
    get innerText(): string | null;
    set textContent(nodeValue: string | null);
    get textContent(): string | null;
    set innerHTML(html: string);
    constructor(parentNode: RxElement | null | undefined, nodeName: string, attributes?: {
        [key: string]: string | null;
    } | null);
    append(...nodesOrDOMStrings: (RxNode | string)[]): void;
    prepend(...nodesOrDOMStrings: (RxNode | string)[]): void;
    replaceChildren(...nodesOrDOMStrings: (RxNode | string)[]): void;
    querySelectorAll(selector: string): RxNode[] | null;
    querySelector(selector: string): RxNode | null;
    hasAttribute(attribute: string): boolean;
    getAttribute(attribute: string): string | null;
    setAttribute(attribute: string, value: any): void;
    removeAttribute(attribute: string): void;
    replaceChild(newChild: RxNode, oldChild: RxNode): RxNode;
    insertBefore(newNode: RxNode, referenceNode?: RxNode | null): RxNode;
    addListener(eventName: string, handler: (e: any) => {}): void;
    removeListener(eventName: string, handler: (e: any) => {}): void;
    serialize(): string;
    serializeAttributes(): string;
}
export declare class RxText extends RxNode {
    nodeValue: string;
    get outerHTML(): string | null;
    get wholeText(): string | null;
    set innerText(nodeValue: string | null);
    get innerText(): string | null;
    set textContent(nodeValue: string | null);
    get textContent(): string | null;
    constructor(parentNode: RxElement | null | undefined, nodeValue: any);
    serialize(): string;
}
export declare class RxCData extends RxNode {
    nodeValue: string;
    get outerHTML(): string | null;
    get wholeText(): string | null;
    set innerText(nodeValue: string | null);
    get innerText(): string | null;
    set textContent(nodeValue: string | null);
    get textContent(): string | null;
    constructor(parentNode: RxElement | null | undefined, nodeValue: any);
    serialize(): string;
}
export declare class RxComment extends RxNode {
    nodeValue: string;
    get outerHTML(): string | null;
    get wholeText(): string | null;
    set innerText(nodeValue: string | null);
    get innerText(): string | null;
    set textContent(nodeValue: string | null);
    get textContent(): string | null;
    constructor(parentNode: RxElement | null | undefined, nodeValue: any);
    serialize(): string;
}
export declare class RxProcessingInstruction extends RxNode {
    constructor(parentNode: RxElement | null | undefined, nodeValue: any);
    serialize(): string;
}
export declare class RxDocumentType extends RxNode {
    constructor(parentNode: RxElement | null | undefined, nodeValue: any);
    serialize(): string;
}
export declare class RxDocument extends RxElement {
    get hidden(): true;
    get visibilityState(): 'prerender';
    get doctype(): RxDocumentType | null;
    get body(): RxElement | null;
    get head(): RxElement | null;
    get title(): string | null;
    set title(nodeValue: string | null);
    get documentElement(): RxElement | null;
    constructor();
    createAttribute(): void;
    createAttributeNS(): void;
    createCDATASection(): void;
    createComment(): void;
    createDocumentFragment(): void;
    createElement(nodeName: string): RxElement;
    createElementNS(): void;
    createEvent(): void;
    createNodeIterator(): void;
    createProcessingInstruction(): void;
    createRange(): void;
    createTextNode(nodeValue: string): RxText;
    createTouchList(): void;
    createTreeWalker(): void;
    serialize(): string;
}
