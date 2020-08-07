import { isPlatformServer, Module, Platform } from 'rxcomp';
import { parse, RxDocument, RxElement, RxText } from '../nodes/nodes';

export default class Server extends Platform {

	/**
	 * @param moduleFactory
	 * @description This method returns a Server compiled module
	 */
	static bootstrap(moduleFactory?: typeof Module, html?: string) {
		if (!isPlatformServer) {
			throw 'missing platform server, node process not found';
		}
		if (!moduleFactory) {
			throw 'missing moduleFactory';
		}
		if (!moduleFactory.meta) {
			throw 'missing moduleFactory meta';
		}
		if (!moduleFactory.meta.bootstrap) {
			throw 'missing bootstrap';
		}
		if (!moduleFactory.meta.bootstrap.meta) {
			throw 'missing bootstrap meta';
		}
		if (!moduleFactory.meta.bootstrap.meta.selector) {
			throw 'missing bootstrap meta selector';
		}
		if (!html) {
			throw 'missing html template';
		}
		const document = this.resolveGlobals(html);
		const meta = this.resolveMeta(moduleFactory);
		if (meta.node instanceof RxElement) {
			const node: RxElement = meta.node as RxElement;
			const nodeInnerHTML = meta.nodeInnerHTML;
			const rxcomp_hydrate_ = {
				selector: moduleFactory.meta.bootstrap.meta.selector,
				innerHTML: nodeInnerHTML,
			};
			const scriptNode = new RxElement(null, 'script');
			const scriptText = new RxText(null, `var rxcomp_hydrate_ = ${JSON.stringify(rxcomp_hydrate_)};`);
			scriptNode.append(scriptText);
			node.parentNode?.insertBefore(scriptNode, node);
		}
		const module = new moduleFactory();
		module.meta = meta;
		const instances = module.compile(meta.node, { document } as Window);
		module.instances = instances;
		const root = instances[0];
		root.pushChanges();
		return module;
	}

	static serialize(): string {
		console.log('Server.serialize');
		if (this.document instanceof RxDocument) {
			const serialized = this.document.serialize();
			// console.log('serialized', serialized);
			return serialized;
		} else {
			throw ('document is not an instance of RxDocument');
		}
	}

	protected static document: Document | RxDocument;

	protected static resolveGlobals(documentOrHtml: Document | string): Document | RxDocument {
		const document: Document | RxDocument = typeof documentOrHtml === 'string' ? parse(documentOrHtml) : documentOrHtml;
		this.document = document as Document;
		global.document = this.document;
		return this.document;
	}

}
