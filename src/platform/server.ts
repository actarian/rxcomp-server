import { isPlatformServer, Module, ModuleError, Platform } from 'rxcomp';
import { Observable, Observer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import CacheService, { CacheControlType, CacheMode } from '../cache/cache.service';
import { IHistory, RxHistory } from '../history/history';
import { ILocation, RxLocation } from '../location/location';
import { parse, RxDocument, RxElement, RxText } from '../nodes/nodes';
const fs = require('fs');

export interface IServerVars {
	name?: string;
	host?: string;
	port?: number;
	charset?: string;
	template?: string;
	cacheMode?: CacheMode;
	cache?: string;
	root?: string;
	resource?: string;
	api?: string;
	static?: boolean;
	development?: boolean;
	production?: boolean;
	[key: string]: any;
}

export interface IServerRequest {
	url: string;
	template?: string;
	vars?: IServerVars;
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

export class ServerRequest implements IServerRequest {
	url!: string;
	template!: string;
	vars!: IServerVars;
	constructor(options?: IServerRequest) {
		if (options) {
			Object.assign(this, options);
		}
		this.vars = Object.assign({
			host: 'http://localhost:5000',
			port: 5000,
			charset: 'utf8',
			template: `./index.html`,
			cacheMode: CacheMode.Memory,
			cache: './cache/',
			root: './dist/browser/',
		}, this.vars || {});
	}
}

export class ServerResponse implements IServerResponse {
	url!: string;
	template!: string;
	vars!: IServerVars;
	serialize!: () => string;
	body!: string;
	statusCode?: number;
	statusMessage?: string;
	maxAge?: number;
	cacheControl?: CacheControlType;
	constructor(options?: IServerResponse) {
		if (options) {
			Object.assign(this, options);
		}
	}
}

export class ServerErrorResponse implements IServerErrorResponse {
	url!: string;
	vars!: IServerVars;
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
	static bootstrap(moduleFactory?: typeof Module, request?: ServerRequest) {
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
		if (!request?.template) {
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
		const document = this.resolveGlobals(request);
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
		// console.log('Server.serialize');
		if (this.document instanceof RxDocument) {
			const serialized = this.document.serialize();
			// console.log('serialized', serialized);
			return serialized;
		} else {
			throw new ModuleError('document is not an instance of RxDocument');
		}
	}

	protected static document: Document | RxDocument;

	protected static resolveGlobals(request: ServerRequest): Document | RxDocument {
		const url: string = request.url;
		const location: ILocation = RxLocation.location;
		location.assign(url);
		global.location = location;
		const history: IHistory = RxHistory.history;
		history.replaceState(null, '', location.origin);
		global.history = history;
		const documentOrHtml: Document | string = request.template!;
		const document: Document | RxDocument = typeof documentOrHtml === 'string' ? parse(documentOrHtml) : documentOrHtml;
		this.document = document as unknown as Document; // !!!
		global.document = this.document;
		history.replaceState(null, document.title || '', location.origin);
		return this.document;
	}

	static render$ = render$;
	static template$ = template$;
	static bootstrap$ = bootstrap$;
}

export function render$(iRequest: IServerRequest, renderRequest$: (request: ServerRequest) => Observable<ServerResponse>): Observable<ServerResponse> {
	return Observable.create(function (observer: Observer<ServerResponse>) {
		const request: ServerRequest = new ServerRequest(iRequest);
		if (request.vars.cacheMode) {
			CacheService.mode = request.vars.cacheMode;
		}
		if (request.vars.cache) {
			CacheService.folder = request.vars.cache;
		}
		const render = CacheService.get('render', request.url);
		console.log('Server.render$.fromCache', !!render, request.url);
		if (render) {
			observer.next(render);
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
				CacheService.set('render', request.url, success, 3600);
				observer.next(success);
				observer.complete();
			},
			(error) => {
				observer.error(error);
			}
		);
	});
}

export function template$(request: ServerRequest): Observable<string> {
	return Observable.create(function (observer: Observer<string>) {
		const src = request.vars.template;
		if (src) {
			const template = CacheService.get('template', src);
			console.log('Server.template$.fromCache', !!template, src);
			if (template) {
				observer.next(template);
				observer.complete();
			}
			fs.readFile(src, request.vars.charset, function (error: NodeJS.ErrnoException, template: string) {
				if (error) {
					observer.error(error);
				} else {
					CacheService.set('template', src, template);
					observer.next(template);
					observer.complete();
				}
			});
		} else {
			observer.error(new Error('ServerError: missing template'));
		}
	});
}

export function bootstrap$(moduleFactory: typeof Module, request: ServerRequest): Observable<ServerResponse> {
	// console.log('Server.bootstrap$', request);
	return Observable.create(function (observer: Observer<ServerResponse>) {
		if (!request.template) {
			return observer.error(new Error('ServerError: missing template'));
		}
		try {
			// const module = Server.bootstrap(moduleFactory, request.template);
			Server.bootstrap(moduleFactory, request);
			const serialize = () => Server.serialize();
			observer.next(new ServerResponse(Object.assign({ serialize }, request) as IServerResponse));
			observer.complete();
		} catch (error) {
			observer.error(new ServerErrorResponse(Object.assign({ error }, request) as IServerErrorResponse));
		}
	});
}
