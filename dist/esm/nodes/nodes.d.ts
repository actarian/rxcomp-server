import { ILocation } from '../location/location';
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
export declare class RxSelector {
    selector: string;
    type: SelectorType;
    negate: boolean;
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
export declare class RxStyle {
    [key: string]: any;
    item(index: number): string | undefined;
    getPropertyPriority(key: string): string;
    getPropertyValue(key: string): string;
    setProperty(key: string, value: string, important: 'important' | '' | undefined): void;
    removeProperty(key: string): void;
    private serialize_;
    init(): void;
    constructor(node: RxElement);
}
export declare class RxClassList extends Array<string> {
    node: RxElement;
    item(index: number): string;
    contains(name: string): boolean;
    add(...names: string[]): void;
    remove(...names: string[]): void;
    toggle(name: string, force?: boolean): boolean;
    replace(oldClass: string, newClass: string): void;
    private serialize_;
    init(): void;
    constructor(node: RxElement);
}
export declare class RxElement extends RxNode {
    nodeName: string;
    childNodes: RxNode[];
    attributes: {
        [key: string]: string | null;
    };
    style: RxStyle;
    classList: RxClassList;
    get children(): RxElement[];
    get childElementCount(): number;
    get firstChild(): RxNode | null;
    get firstElementChild(): RxElement | null;
    get lastChild(): RxNode | null;
    get lastElementChild(): RxElement | null;
    get previousSibling(): RxNode | null;
    get nextSibling(): RxNode | null;
    get wholeText(): string | null | undefined;
    get outerHTML(): string | null;
    set innerText(nodeValue: string | null);
    get innerText(): string | null;
    set textContent(nodeValue: string | null);
    get textContent(): string | null;
    get innerHTML(): string;
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
    removeChild(child: RxNode): RxNode;
    insertBefore(newNode: RxNode, referenceNode?: RxNode | null): RxNode;
    cloneNode(deep?: boolean): RxNode;
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
export declare class RxDocumentFragment extends RxElement {
    constructor();
}
export interface IDocument extends Document {
}
export declare class RxDocument extends RxElement {
    private location_;
    get location(): ILocation;
    get URL(): string;
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
    createComment(nodeValue: string): RxComment;
    createDocumentFragment(): RxDocumentFragment;
    createElement(nodeName: string): RxElement;
    createElementNS(nodeName: string): RxElement;
    createEvent(): void;
    createNodeIterator(): void;
    createProcessingInstruction(nodeValue: string): RxProcessingInstruction;
    createRange(): void;
    createTextNode(nodeValue: string): RxText;
    createTouchList(): void;
    createTreeWalker(): void;
    serialize(): string;
}
export declare function isRxElement(x: RxNode): x is RxElement;
export declare function isRxText(x: RxNode): x is RxText;
export declare function isRxComment(x: RxNode): x is RxComment;
export declare function isRxDocument(x: RxNode): x is RxDocument;
export declare function isRxDocumentFragment(x: RxNode): x is RxDocumentFragment;
export declare function isRxDocumentType(x: RxNode): x is RxDocumentType;
export declare function isRxProcessingInstruction(x: RxNode): x is RxProcessingInstruction;
export declare function parse(html: string): RxDocument;
export declare function getQueries(selector: string): RxQuery[];
export declare function matchSelector(child: RxElement, selector: RxSelector): boolean;
export declare function matchSelectors(child: RxElement, selectors: RxSelector[]): boolean;
export declare function querySelectorAll(queries: RxQuery[], childNodes: RxNode[], query?: RxQuery | null, nodes?: RxElement[]): RxElement[] | null;
export declare function querySelector(queries: RxQuery[], childNodes: RxNode[], query?: RxQuery | null): RxElement | null;
export declare function cloneNode(source: RxNode, deep?: boolean, parentNode?: RxElement | null): RxNode;
