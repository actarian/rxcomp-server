import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, filter, finalize, map } from 'rxjs/operators';
import { HttpErrorResponse, IHttpErrorResponse } from './http-error-response';
import { HttpHeaders } from './http-headers';
import { HttpInterceptingHandler } from './http-interceptor';
import { HttpParams } from './http-params';
import { HttpBodyType, HttpMethodType, HttpRequest, IHttpRequestInit } from './http-request';
import { HttpEvent, HttpResponse } from './http-response';

export default class HttpClient {

	static pendingRequests$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	static incrementPendingRequest() {
		HttpClient.pendingRequests$.next(HttpClient.pendingRequests$.getValue() + 1);
	}

	static decrementPendingRequest() {
		HttpClient.pendingRequests$.next(HttpClient.pendingRequests$.getValue() - 1);
	}

	// static handler: HttpHandler = new HttpFetchHandler();
	static handler: HttpInterceptingHandler = new HttpInterceptingHandler();

	static request$<T>(first: HttpMethodType | HttpRequest<T>, url?: string, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		let request: HttpRequest<T>;
		if (first instanceof HttpRequest) {
			request = first;
		} else {
			let headers: HttpHeaders | undefined = undefined;
			if (options.headers instanceof HttpHeaders) {
				headers = options.headers;
			} else {
				headers = new HttpHeaders(options.headers);
			}
			let params: HttpParams | undefined = undefined;
			if (options.params) {
				params = new HttpParams(options.params);
			}
			request = new HttpRequest(first, url!, (options.body !== undefined ? options.body : null), {
				headers,
				params,
				reportProgress: options.reportProgress,
				responseType: options.responseType || 'json',
				withCredentials: options.withCredentials,
			});
		}
		// console.log('HttpClient.request$', request);
		HttpClient.incrementPendingRequest();
		const events$: Observable<HttpEvent<any>> = of(request).pipe(
			concatMap((request: HttpRequest<T>) => this.handler.handle(request)),
			// tap((response: HttpEvent<any>) => console.log('HttpClient.response', response)),
			finalize(() => HttpClient.decrementPendingRequest())
		);
		if (first instanceof HttpRequest || options.observe === 'events') {
			return events$.pipe(
				catchError(error => {
					console.log('error', error);
					return throwError(this.getError(error, null, request));
				}),
			);
		}
		const response$: Observable<HttpResponse<T>> = <Observable<HttpResponse<T>>>events$.pipe(
			filter((event: HttpEvent<any>) => event instanceof HttpResponse),
		);
		let response_: HttpResponse<T>;
		const observe$: Observable<HttpResponse<T> | HttpBodyType<T>> = response$.pipe(
			map((response: HttpResponse<T>) => {
				response_ = response;
				switch (options.observe || 'body') {
					case 'body':
						switch (request.responseType) {
							case 'arraybuffer':
								if (response.body !== null && !(response.body instanceof ArrayBuffer)) {
									throw new Error('Response is not an ArrayBuffer.');
								}
								return response.body;
							case 'blob':
								if (response.body !== null && !(response.body instanceof Blob)) {
									throw new Error('Response is not a Blob.');
								}
								return response.body;
							case 'text':
								if (response.body !== null && typeof response.body !== 'string') {
									throw new Error('Response is not a string.');
								}
								return response.body;
							case 'json':
							default:
								return response.body;
						}
					case 'response':
						return response;
					default:
						throw new Error(`Unreachable: unhandled observe type ${options.observe}}`);
				}
			}),
			catchError(error => {
				console.log('error', error);
				return throwError(this.getError(error, response_, request));
			}),
		)
		return observe$;
		switch (options.observe || 'body') {
			case 'body':
				switch (request.responseType) {
					case 'arraybuffer':
						return response$.pipe(map((response: HttpResponse<T>) => {
							if (response.body !== null && !(response.body instanceof ArrayBuffer)) {
								throw new Error('Response is not an ArrayBuffer.');
							}
							return response.body;
						}));
					case 'blob':
						return response$.pipe(map((response: HttpResponse<T>) => {
							if (response.body !== null && !(response.body instanceof Blob)) {
								throw new Error('Response is not a Blob.');
							}
							return response.body;
						}));
					case 'text':
						return response$.pipe(map((response: HttpResponse<T>) => {
							if (response.body !== null && typeof response.body !== 'string') {
								throw new Error('Response is not a string.');
							}
							return response.body;
						}));
					case 'json':
					default:
						return response$.pipe(map((response: HttpResponse<T>) => response.body));
				}
			case 'response':
				return response$;
			default:
				throw new Error(`Unreachable: unhandled observe type ${options.observe}}`);
		}
	}

	static delete$<T>(url: string, options?: IHttpRequestInit<T>): Observable<T>;
	static delete$<T>(url: string, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('DELETE', url, options);
	}

	static get$<T>(url: string, options?: IHttpRequestInit<T>): Observable<T>;
	static get$<T>(url: string, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('GET', url, options);
	}

	static head$<T>(url: string, options?: IHttpRequestInit<T>): Observable<T>;
	static head$<T>(url: string, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('HEAD', url, options);
	}

	static jsonp$<T>(url: string, callbackParam: string): Observable<T>;
	static jsonp$<T>(url: string, callbackParam: string): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('JSONP', url, {
			params: new HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
			observe: 'body',
			responseType: 'json',
		});
	}

	static options$<T>(url: string, options?: IHttpRequestInit<T>): Observable<T>;
	static options$<T>(url: string, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('OPTIONS', url, options);
	}

	static patch$<T>(url: string, body: any | null, options?: IHttpRequestInit<T>): Observable<T>;
	static patch$<T>(url: string, body: any | null, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('PATCH', url, optionsWithBody_<T>(options, body));
	}

	static post$<T>(url: string, body: any | null, options?: IHttpRequestInit<T>): Observable<T>;
	static post$<T>(url: string, body: any | null, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('POST', url, optionsWithBody_<T>(options, body));
	}

	static put$<T>(url: string, body: any | null, options?: IHttpRequestInit<T>): Observable<T>;
	static put$<T>(url: string, body: any | null, options: IHttpRequestInit<T> = {}): Observable<HttpEvent<any> | HttpResponse<T> | HttpBodyType<T>> {
		return this.request$<T>('PUT', url, optionsWithBody_<T>(options, body));
	}

	static getError<T>(error: any, response: HttpResponse<T> | null, request: HttpRequest<T> | null): HttpErrorResponse<T> {
		if (!error.status) {
			error.statusCode = response?.status || 0;
		}
		if (!error.statusMessage) {
			error.statusMessage = response?.statusText || 'Unknown Error';
		}
		const options: IHttpErrorResponse<T> = {
			error,
			status: error.status,
			statusText: error.statusText,
			message: error.message,
			request,
		};
		if (response) {
			options.headers = response.headers;
			options.status = options.status || response.status;
			options.statusText = options.statusText || response.statusText;
			options.url = response.url;
		}
		return new HttpErrorResponse<T>(options);
	}

}

function optionsWithBody_<T>(options: IHttpRequestInit<T>, body: T | null): IHttpRequestInit<T> {
	return Object.assign({}, options, { body });
}

/*

export class HttpClient {

	constructor(private handler: HttpHandler) { }

	request<R>(request: HttpRequest<any>): Observable<HttpEvent<R>>;
	request(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<ArrayBuffer>;
	request(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<Blob>;
	request(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<string>;
	request(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		params?: HttpParams | { [param: string]: string | string[] }, observe: 'events',
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpEvent<ArrayBuffer>>;
	request(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Blob>>;
	request(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpEvent<string>>;
	request(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		reportProgress?: boolean, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<any>>;
	request<R>(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		reportProgress?: boolean, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<R>>;
	request(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpResponse<ArrayBuffer>>;
	request(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Blob>>;
	request(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpResponse<string>>;
	request(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		reportProgress?: boolean, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Object>>;
	request<R>(method: string, url: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		reportProgress?: boolean, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<R>>;
	request(method: string, url: string, options?: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		responseType?: 'json',
		reportProgress?: boolean,
		withCredentials?: boolean,
	}): Observable<Object>;
	request<R>(method: string, url: string, options?: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		responseType?: 'json',
		reportProgress?: boolean,
		withCredentials?: boolean,
	}): Observable<R>;
	request(method: string, url: string, options?: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		params?: HttpParams | { [param: string]: string | string[] },
		observe?: HttpObserve,
		reportProgress?: boolean,
		responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
		withCredentials?: boolean,
	}): Observable<any>;
	request(first: string | HttpRequest<any>, url?: string, options: {
		body?: any,
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: HttpObserveType,
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
		withCredentials?: boolean,
	} = {}): Observable<any> {
		let request: HttpRequest<any>;
		if (first instanceof HttpRequest) {
			request = first;
		} else {
			let headers: HttpHeaders | undefined = undefined;
			if (options.headers instanceof HttpHeaders) {
				headers = options.headers;
			} else {
				headers = new HttpHeaders(options.headers);
			}
			let params: HttpParams | undefined = undefined;
			if (!!options.params) {
				if (options.params instanceof HttpParams) {
					params = options.params;
				} else {
					params = new HttpParams({ fromObject: options.params } as HttpParamsOptions);
				}
			}
			request = new HttpRequest(first, url!, (options.body !== undefined ? options.body : null), {
				headers,
				params,
				reportProgress: options.reportProgress,
				responseType: options.responseType || 'json',
				withCredentials: options.withCredentials,
			});
		}
		const events$: Observable<HttpEvent<any>> = of(request).pipe(concatMap((request: HttpRequest<any>) => this.handler.handle(request)));
		if (first instanceof HttpRequest || options.observe === 'events') {
			return events$;
		}
		const response$: Observable<HttpResponse<any>> = <Observable<HttpResponse<any>>>events$.pipe(
			filter((event: HttpEvent<any>) => event instanceof HttpResponse),
		);
		switch (options.observe || 'body') {
			case 'body':
				switch (request.responseType) {
					case 'arraybuffer':
						return response$.pipe(map((res: HttpResponse<any>) => {
							if (res.body !== null && !(res.body instanceof ArrayBuffer)) {
								throw new Error('Response is not an ArrayBuffer.');
							}
							return res.body;
						}));
					case 'blob':
						return response$.pipe(map((res: HttpResponse<any>) => {
							if (res.body !== null && !(res.body instanceof Blob)) {
								throw new Error('Response is not a Blob.');
							}
							return res.body;
						}));
					case 'text':
						return response$.pipe(map((res: HttpResponse<any>) => {
							if (res.body !== null && typeof res.body !== 'string') {
								throw new Error('Response is not a string.');
							}
							return res.body;
						}));
					case 'json':
					default:
						return response$.pipe(map((res: HttpResponse<any>) => res.body));
				}
			case 'response':
				return response$;
			default:
				throw new Error(`Unreachable: unhandled observe type ${options.observe}}`);
		}
	}

	delete(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<ArrayBuffer>;
	delete(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<Blob>;
	delete(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<string>;


	delete(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpEvent<ArrayBuffer>>;


	delete(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Blob>>;

	delete(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpEvent<string>>;

	delete(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Object>>;


	delete<T>(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<T>>;


	delete(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpResponse<ArrayBuffer>>;


	delete(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Blob>>;


	delete(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpResponse<string>>;


	delete(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Object>>;


	delete<T>(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<T>>;


	delete(url: string, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<Object>;


	delete<T>(url: string, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<T>;


	delete(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: HttpObserveType,
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
		withCredentials?: boolean,
	} = {}): Observable<any> {
		return this.request<any>('DELETE', url, options as any);
	}



	get(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<ArrayBuffer>;


	get(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<Blob>;


	get(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<string>;


	get(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpEvent<ArrayBuffer>>;


	get(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Blob>>;


	get(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpEvent<string>>;


	get(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Object>>;


	get<T>(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<T>>;


	get(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpResponse<ArrayBuffer>>;


	get(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Blob>>;


	get(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpResponse<string>>;


	get(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Object>>;


	get<T>(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<T>>;


	get(url: string, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<Object>;


	get<T>(url: string, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<T>;


	get(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: HttpObserveType,
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
		withCredentials?: boolean,
	} = {}): Observable<any> {
		return this.request<any>('GET', url, options as any);
	}



	head(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<ArrayBuffer>;



	head(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<Blob>;


	head(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<string>;


	head(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpEvent<ArrayBuffer>>;


	head(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Blob>>;


	head(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpEvent<string>>;


	head(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Object>>;


	head<T>(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<T>>;


	head(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpResponse<ArrayBuffer>>;


	head(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Blob>>;


	head(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpResponse<string>>;


	head(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Object>>;


	head<T>(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<T>>;


	head(url: string, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<Object>;


	head<T>(url: string, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<T>;


	head(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: HttpObserveType,
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
		withCredentials?: boolean,
	} = {}): Observable<any> {
		return this.request<any>('HEAD', url, options as any);
	}


	jsonp(url: string, callbackParam: string): Observable<Object>;


	jsonp<T>(url: string, callbackParam: string): Observable<T>;


	jsonp<T>(url: string, callbackParam: string): Observable<T> {
		return this.request<any>('JSONP', url, {
			params: new HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
			observe: 'body',
			responseType: 'json',
		});
	}


	options(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<ArrayBuffer>;


	options(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<Blob>;


	options(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<string>;


	options(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpEvent<ArrayBuffer>>;


	options(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Blob>>;


	options(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpEvent<string>>;


	options(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Object>>;


	options<T>(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<T>>;


	options(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpResponse<ArrayBuffer>>;


	options(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Blob>>;


	options(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpResponse<string>>;


	options(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Object>>;


	options<T>(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<T>>;


	options(url: string, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<Object>;


	options<T>(url: string, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<T>;


	options(url: string, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: HttpObserveType,
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
		withCredentials?: boolean,
	} = {}): Observable<any> {
		return this.request<any>('OPTIONS', url, options as any);
	}


	patch$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<ArrayBuffer>;


	patch$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<Blob>;


	patch$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<string>;



	patch$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpEvent<ArrayBuffer>>;


	patch$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Blob>>;


	patch$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpEvent<string>>;


	patch$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Object>>;


	patch<T>(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<T>>;


	patch$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpResponse<ArrayBuffer>>;


	patch$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Blob>>;


	patch$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpResponse<string>>;


	patch$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Object>>;


	patch<T>(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<T>>;


	patch$(url: string, body: any | null, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<Object>;


	patch<T>(url: string, body: any | null, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<T>;


	patch$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: HttpObserveType,
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
		withCredentials?: boolean,
	} = {}): Observable<any> {
		return this.request<any>('PATCH', url, optionsWithBody_<T>(options, body));
	}


	post$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<ArrayBuffer>;


	post$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<Blob>;


	post$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<string>;


	post$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpEvent<ArrayBuffer>>;


	post$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Blob>>;


	post$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpEvent<string>>;


	post$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Object>>;


	post<T>(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<T>>;


	post$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpResponse<ArrayBuffer>>;


	post$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Blob>>;


	post$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpResponse<string>>;


	post$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Object>>;


	post<T>(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<T>>;


	post$(url: string, body: any | null, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<Object>;


	post<T>(url: string, body: any | null, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<T>;


	post$(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: HttpObserveType,
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
		withCredentials?: boolean,
	} = {}): Observable<any> {
		return this.request<any>('POST', url, optionsWithBody_<T>(options, body));
	}


	put(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<ArrayBuffer>;


	put(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<Blob>;


	put(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<string>;


	put(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpEvent<ArrayBuffer>>;


	put(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Blob>>;


	put(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpEvent<string>>;


	put(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<Object>>;


	put<T>(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpEvent<T>>;


	put(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'arraybuffer',
		withCredentials?: boolean,
	}): Observable<HttpResponse<ArrayBuffer>>;


	put(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'blob',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Blob>>;


	put(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean, responseType: 'text',
		withCredentials?: boolean,
	}): Observable<HttpResponse<string>>;


	put(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<Object>>;


	put<T>(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<HttpResponse<T>>;


	put(url: string, body: any | null, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<Object>;


	put<T>(url: string, body: any | null, options?: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: 'body',
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'json',
		withCredentials?: boolean,
	}): Observable<T>;


	put(url: string, body: any | null, options: {
		headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
		observe?: HttpObserveType,
		params?: HttpParams | { [param: string]: string | string[] },
		reportProgress?: boolean,
		responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
		withCredentials?: boolean,
	} = {}): Observable<any> {
		return this.request<any>('PUT', url, optionsWithBody_<T>(options, body));
	}
}

*/
