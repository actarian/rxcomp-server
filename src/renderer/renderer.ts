import { parse, RxDocument, RxNode } from './node';

export default class Renderer {
	static document: Document | RxDocument;
	static bootstrap(documentOrHtml: Document | string) {
		if (typeof documentOrHtml === 'string') {
			this.document = parse(documentOrHtml);
		} else {
			this.document = documentOrHtml;
		}
		if (typeof process !== 'undefined') {
			global.document = this.document as Document;
		}
	}

	static querySelector(selector: string): RxNode | Element | null {
		return this.document.querySelector(selector);
	}
}
