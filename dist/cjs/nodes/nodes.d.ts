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
    constructor(node: RxElement);
    init(): void;
    item(index: number): string | undefined;
    getPropertyPriority(key: string): string;
    getPropertyValue(key: string): string;
    setProperty(key: string, value: string, important: 'important' | '' | undefined): void;
    removeProperty(key: string): void;
    private serialize_;
}
export declare class RxClassList extends Array<string> {
    private node_;
    get node(): RxElement;
    set node(node: RxElement);
    constructor(...args: any[]);
    init(): void;
    slice(start?: number, end?: number): RxClassList;
    item(index: number): string;
    contains(name: string): boolean;
    add(...names: string[]): void;
    remove(...names: string[]): void;
    toggle(name: string, force?: boolean): boolean;
    replace(oldClass: string, newClass: string): void;
    private serialize_;
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
    appendChild<T extends RxNode>(newChild: T): T;
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
    get head(): RxElement;
    get body(): RxElement | null;
    get title(): string | null;
    set title(nodeValue: string | null);
    get documentElement(): RxElement;
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
/** A window containing a DOM document; the document property points to the DOM document loaded in that window. */
export interface IWindow {
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
}
export declare class RxWindow {
    readonly applicationCache: ApplicationCache;
    readonly clientInformation: Navigator;
    readonly closed: boolean;
    readonly devicePixelRatio: number;
    readonly doNotTrack: string;
    readonly document: Document;
    readonly frameElement: Element;
    readonly frames: Window;
    readonly history: History;
    readonly innerHeight: number;
    readonly innerWidth: number;
    readonly length: number;
    readonly locationbar: BarProp;
    readonly menubar: BarProp;
    readonly msContentScript: ExtensionScriptApis;
    readonly navigator: Navigator;
    readonly outerHeight: number;
    readonly outerWidth: number;
    readonly pageXOffset: number;
    readonly pageYOffset: number;
    readonly parent: Window;
    readonly personalbar: BarProp;
    readonly screen: Screen;
    readonly screenLeft: number;
    readonly screenTop: number;
    readonly screenX: number;
    readonly screenY: number;
    readonly scrollX: number;
    readonly scrollY: number;
    readonly scrollbars: BarProp;
    readonly self: Window & typeof globalThis;
    readonly speechSynthesis: SpeechSynthesis;
    readonly statusbar: BarProp;
    readonly styleMedia: StyleMedia;
    readonly toolbar: BarProp;
    readonly top: Window;
    readonly window: Window & typeof globalThis;
    customElements: CustomElementRegistry;
    defaultStatus: string;
    location: Location;
    name: string;
    offscreenBuffering: string | boolean;
    opener: any;
    status: string;
    [index: number]: Window;
    constructor(options?: IWindow);
    alert(message?: any): void;
    blur(): void;
    close(): void;
    confirm(message?: string): boolean;
    departFocus(navigationReason: NavigationReason, origin: FocusNavigationOrigin): void;
    focus(): void;
    getComputedStyle(elt: Element, pseudoElt?: string | null): any;
    getMatchedCSSRules(elt: Element, pseudoElt?: string | null): any;
    getSelection(): Selection | null;
    matchMedia(query: string): any;
    moveBy(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    msWriteProfilerMark(profilerMarkName: string): void;
    open(url?: string, target?: string, features?: string, replace?: boolean): Window | null;
    postMessage(message: any, targetOrigin: string, transfer?: Transferable[]): void;
    print(): void;
    prompt(message?: string, _default?: string): string | null;
    resizeBy(x: number, y: number): void;
    resizeTo(x: number, y: number): void;
    scroll(...args: any[]): void;
    scrollBy(...args: any[]): void;
    scrollTo(...args: any[]): void;
    stop(): void;
    webkitCancelAnimationFrame(handle: number): void;
    webkitConvertPointFromNodeToPage(node: Node, pt: WebKitPoint): any;
    webkitConvertPointFromPageToNode(node: Node, pt: WebKitPoint): any;
    webkitRequestAnimationFrame(callback: FrameRequestCallback): number;
    addEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, event: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, event: WindowEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    oncompassneedscalibration(event: Event): any | null;
    ondevicelight(event: DeviceLightEvent): any | null;
    ondevicemotion(event: DeviceMotionEvent): any | null;
    ondeviceorientation(event: DeviceOrientationEvent): any | null;
    ondeviceorientationabsolute(event: DeviceOrientationEvent): any | null;
    onmousewheel(event: Event): any | null;
    onmsgesturechange(event: Event): any | null;
    onmsgesturedoubletap(event: Event): any | null;
    onmsgestureend(event: Event): any | null;
    onmsgesturehold(event: Event): any | null;
    onmsgesturestart(event: Event): any | null;
    onmsgesturetap(event: Event): any | null;
    onmsinertiastart(event: Event): any | null;
    onmspointercancel(event: Event): any | null;
    onmspointerdown(event: Event): any | null;
    onmspointerenter(event: Event): any | null;
    onmspointerleave(event: Event): any | null;
    onmspointermove(event: Event): any | null;
    onmspointerout(event: Event): any | null;
    onmspointerover(event: Event): any | null;
    onmspointerup(event: Event): any | null;
    onreadystatechange(event: ProgressEvent<Window>): any | null;
    onvrdisplayactivate(event: Event): any | null;
    onvrdisplayblur(event: Event): any | null;
    onvrdisplayconnect(event: Event): any | null;
    onvrdisplaydeactivate(event: Event): any | null;
    onvrdisplaydisconnect(event: Event): any | null;
    onvrdisplayfocus(event: Event): any | null;
    onvrdisplaypointerrestricted(event: Event): any | null;
    onvrdisplaypointerunrestricted(event: Event): any | null;
    onvrdisplaypresentchange(event: Event): any | null;
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
