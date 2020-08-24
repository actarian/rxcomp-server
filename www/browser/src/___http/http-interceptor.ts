import { Observable } from 'rxjs';
import { HttpFetchHandler } from './http-fetch.handler';
import { HttpHandler } from './http-handler';
import { HttpRequest } from './http-request';
import { HttpEvent } from './http-response';
import { HttpXhrHandler } from './http-xhr.handler';

export interface HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}

export class HttpInterceptorHandler implements HttpHandler {
	constructor(private next: HttpHandler, private interceptor: HttpInterceptor) { }
	handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
		return this.interceptor.intercept(req, this.next);
	}
}

export const HttpInterceptors: HttpInterceptor[] = [];

export class NoopInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req);
	}
}

export const fetchHandler: HttpHandler = new HttpFetchHandler();
export const xhrHandler: HttpHandler = new HttpXhrHandler();

export class HttpInterceptingHandler implements HttpHandler {
	private chain: HttpHandler | null = null;
	handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
		if (this.chain === null) {
			const interceptors = HttpInterceptors;
			this.chain = interceptors.reduceRight((next, interceptor) => new HttpInterceptorHandler(next, interceptor), fetchHandler);
		}
		return this.chain.handle(req);
	}
}

export function interceptingHandler(handler: HttpHandler, interceptors: HttpInterceptor[] | null = []): HttpHandler {
	if (!interceptors) {
		return handler;
	}
	return interceptors.reduceRight((next, interceptor) => new HttpInterceptorHandler(next, interceptor), handler);
}

export function jsonpCallbackContext(): Object {
	if (typeof window === 'object') {
		return window;
	}
	return {};
}
