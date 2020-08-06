import { IElement, Module, Platform } from 'rxcomp';
import { RxDocument } from '../renderer/node';
import Renderer from '../renderer/renderer';

export default class Server extends Platform {
	static bootstrap(moduleFactory?: typeof Module, html?: string) {
		if (!html) {
			throw 'missing html template';
		}
		Renderer.bootstrap(html);
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
		const meta = this.resolveMeta(moduleFactory);
		const module = new moduleFactory();
		module.meta = meta;
		const instances = module.compile(meta.node, {} as Window);
		module.instances = instances;
		const root = instances[0];
		root.pushChanges();
		return module;
	}

	static querySelector(selector: string): IElement | null {
		return Renderer.document.querySelector(selector) as IElement;
	}

	static serialize(): string {
		console.log('Server.serialize');
		if (Renderer.document instanceof RxDocument) {
			const serialized = Renderer.document.serialize();
			// console.log('serialized', serialized);
			return serialized;
		} else {
			throw ('Renderer.document is not an instance of RxDocument');
		}
	}
}
