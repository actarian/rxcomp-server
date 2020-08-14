import { isPlatformServer, Module, ModuleError, Platform } from 'rxcomp';
import { from, Observable, Observer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Vars } from '../../test/js/vars';
import CacheService from '../cache/cache.service';
import { parse, RxDocument, RxElement, RxText } from '../nodes/nodes';
const fs = require('fs');

export interface IServerRequest {
	url: string;
	template: string;
	host?: string;
	charset?: string;
}

export interface IServerResponse extends IServerRequest {
	serialize: () => string;
	body?: string;
	statusCode?: number;
	statusMessage?: string;
}

export interface IServerErrorResponse extends IServerRequest {
	error: Error;
	statusCode?: number;
	statusMessage?: string;
}

export class ServerResponse implements IServerResponse {
	template!: string;
	url!: string;
	host?: string;
	charset?: string;
	serialize!: () => string;
	body!: string;
	statusCode?: number;
	statusMessage?: string;
	constructor(options?: IServerResponse) {
		if (options) {
			Object.assign(this, options);
		}
	}
}

export class ServerErrorResponse implements IServerErrorResponse {
	template!: string;
	url!: string;
	host?: string;
	charset?: string;
	error!: Error;
	statusCode?: number;
	statusMessage?: string;
	constructor(options?: IServerErrorResponse) {
		if (options) {
			Object.assign(this, options);
		}
	}
}

export default class Server extends Platform {

	/**
	 * @param moduleFactory
	 * @description This method returns a Server compiled module
	 */
	static bootstrap(moduleFactory?: typeof Module, template?: string) {
		if (!isPlatformServer) {
			throw new ModuleError('missing platform server, node process not found');
		}
		if (!moduleFactory) {
			throw new ModuleError('missing moduleFactory');
		}
		if (!moduleFactory.meta) {
			throw new ModuleError('missing moduleFactory meta');
		}
		if (!moduleFactory.meta.bootstrap) {
			throw new ModuleError('missing bootstrap');
		}
		if (!moduleFactory.meta.bootstrap.meta) {
			throw new ModuleError('missing bootstrap meta');
		}
		if (!moduleFactory.meta.bootstrap.meta.selector) {
			throw new ModuleError('missing bootstrap meta selector');
		}
		if (!template) {
			throw new ModuleError('missing template');
		}
		/*
		if (typeof ((ReadableStream.prototype as any)[Symbol.asyncIterator]) === 'undefined') {
			(ReadableStream.prototype as any)[Symbol.asyncIterator] = async function* () {
				const reader = this.getReader()
				while (1) {
					const r = await reader.read();
					if (r.done) {
						return r.value;
					}
					yield r.value;
				}
			}
		}
		*/
		const document = this.resolveGlobals(template);
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
		meta.imports.forEach((moduleFactory: typeof Module) => {
			moduleFactory.prototype.constructor.call(module);
		});
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
			throw new ModuleError('document is not an instance of RxDocument');
		}
	}

	protected static document: Document | RxDocument;

	protected static resolveGlobals(documentOrHtml: Document | string): Document | RxDocument {
		const document: Document | RxDocument = typeof documentOrHtml === 'string' ? parse(documentOrHtml) : documentOrHtml;
		this.document = document as Document;
		global.document = this.document;
		return this.document;
	}

	static bootstrap$ = bootstrap$;
	static render$ = render$;
	static template$ = template$;

}

export function bootstrap$(moduleFactory: typeof Module, request?: IServerRequest): Observable<ServerResponse> {
	if (request && request.host) {
		Vars.host = request.host;
	}
	return from(new Promise<ServerResponse>((resolve, reject) => {
		if (!request?.template) {
			return reject(new Error('ServerError: missing template'));
		}
		try {
			// const module = Server.bootstrap(moduleFactory, request.template);
			Server.bootstrap(moduleFactory, request.template);
			const serialize = () => Server.serialize();
			resolve(new ServerResponse(Object.assign({ serialize }, request) as IServerResponse));
		} catch (error) {
			reject(new ServerErrorResponse(Object.assign({ error }, request) as IServerErrorResponse));
		}
	}));
}

export function render$(request: IServerRequest, renderRequest$: (request?: IServerRequest) => Observable<ServerResponse>): Observable<ServerResponse> {
	return Observable.create(function (observer: Observer<ServerResponse>) {
		const cached = CacheService.get('cached', request.url);
		console.log('cached', !!cached);
		if (cached) {
			observer.next(cached);
			return observer.complete();
		}
		template$(request).pipe(
			switchMap((template: string) => {
				// console.log('template!', template);
				request.template = template;
				return renderRequest$(request);
			})
		).subscribe(
			(success) => {
				CacheService.set('cached', request.url, success, 3600);
				observer.next(success);
				observer.complete();
			},
			(error) => {
				observer.error(error);
			}
		);
	});
}

export function template$(request: IServerRequest): Observable<string> {
	return Observable.create(function (observer: Observer<string>) {
		const template = CacheService.get('template', request.template);
		console.log('template', !!template);
		if (template) {
			observer.next(template);
			observer.complete();
		}
		fs.readFile(request.template, request.charset, function (error: NodeJS.ErrnoException, template: string) {
			if (error) {
				observer.error(error);
			} else {
				CacheService.set('template', request.template, template);
				observer.next(template);
				observer.complete();
			}
		});
	});
}
