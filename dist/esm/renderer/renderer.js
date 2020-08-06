import { parse } from './node';
export default class Renderer {
    static bootstrap(documentOrHtml) {
        if (typeof documentOrHtml === 'string') {
            this.document = parse(documentOrHtml);
        }
        else {
            this.document = documentOrHtml;
        }
        if (typeof process !== 'undefined') {
            global.document = this.document;
        }
    }
    static querySelector(selector) {
        return this.document.querySelector(selector);
    }
}
