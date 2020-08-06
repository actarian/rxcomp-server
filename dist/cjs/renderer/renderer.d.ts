import { RxDocument } from './node';
export default class Renderer {
    static document: Document | RxDocument;
    static bootstrap(documentOrHtml: Document | string): void;
    static querySelector(selector: string): Element | import("./node").RxNode | null;
}
