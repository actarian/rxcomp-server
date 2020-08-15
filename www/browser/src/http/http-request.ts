import { HttpHeaders } from './http-headers';
import { HttpParams } from './http-params';

export type HttpMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'JSONP';
export type HttpMethodBodyType = 'POST' | 'PUT' | 'PATCH';
export type HttpMethodNoBodyType = 'GET' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'JSONP';
export type HttpResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';
export type HttpBodyType<T> = T | string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null | undefined;
export type HttpObserveType = 'body' | 'events' | 'response';

export interface IHttpRequestInit<T> {
	headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined;
	reportProgress?: boolean;
	params?: HttpParams | { [key: string]: any } | string | undefined;
	responseType?: HttpResponseType;
	withCredentials?: boolean;
	observe?: HttpObserveType;
	body?: HttpBodyType<T>;
}

export interface IHttpRequest<T> extends IHttpRequestInit<T> {
	method?: HttpMethodType,
	url?: string,
}

export class HttpRequest<T> {
	readonly body: HttpBodyType<T>;
	readonly headers!: HttpHeaders;
	readonly reportProgress: boolean = false;
	readonly withCredentials: boolean = false;
	readonly observe: HttpObserveType = 'body';
	readonly responseType: HttpResponseType = 'json';
	readonly method: HttpMethodType;
	readonly params!: HttpParams;
	readonly urlWithParams: string;
	constructor(method: HttpMethodNoBodyType, url: string, options?: IHttpRequestInit<T>);
	constructor(method: HttpMethodBodyType, url: string, body: HttpBodyType<T>, options?: IHttpRequestInit<T>);
	constructor(method: HttpMethodType, url: string, body: HttpBodyType<T>, options?: IHttpRequestInit<T>);
	constructor(method: HttpMethodType, readonly url: string, third?: HttpBodyType<T> | IHttpRequestInit<T> | null, fourth?: IHttpRequestInit<T>) {
		// !!! remove, rethink
		const isStaticFile: boolean = /\.(json|xml|txt)(\?.*)?$/.test(url);
		this.method = isStaticFile ? 'GET' : method.toUpperCase() as HttpMethodType;
		let options: IHttpRequestInit<T> | undefined;
		if (methodHasBody(this.method) || !!fourth) {
			this.body = (third !== undefined) ? third as HttpBodyType<T> : null;
			options = fourth;
		} else {
			options = third as IHttpRequestInit<T>;
		}
		if (options) {
			this.reportProgress = !!options.reportProgress;
			this.withCredentials = !!options.withCredentials;
			this.observe = options.observe || this.observe;
			if (options.responseType) {
				this.responseType = options.responseType;
			}
			if (options.headers) {
				this.headers = new HttpHeaders(options.headers);
			}
			if (options.params) {
				this.params = new HttpParams(options.params);
			}
		}
		if (!this.headers) {
			this.headers = new HttpHeaders();
		}
		if (!this.params) {
			this.params = new HttpParams();
		}
		const params = this.params.toString();
		const index = url.indexOf('?');
		const sep: string = index === -1 ? '?' : (index < url.length - 1 ? '&' : '');
		this.urlWithParams = url + (params.length ? sep + params : params);
	}
	serializeBody(): ArrayBuffer | Blob | FormData | string | null {
		if (this.body === null) {
			return null;
		}
		if (isArrayBuffer(this.body) || isBlob(this.body) || isFormData(this.body) ||
			typeof this.body === 'string') {
			return this.body;
		}
		if (this.body instanceof HttpParams) {
			return (<any>this.body).toString();
		}
		if (typeof this.body === 'object' || typeof this.body === 'boolean' || Array.isArray(this.body)) {
			return JSON.stringify(this.body);
		}
		return (this.body as any).toString();
	}
	detectContentTypeHeader(): string | null {
		if (this.body === null) {
			return null;
		}
		if (isFormData(this.body)) {
			return null;
		}
		if (isBlob(this.body)) {
			return this.body.type || null;
		}
		if (isArrayBuffer(this.body)) {
			return null;
		}
		if (typeof this.body === 'string') {
			return 'text/plain';
		}
		if (this.body instanceof HttpParams) {
			return 'application/x-www-form-urlencoded;charset=UTF-8';
		}
		if (typeof this.body === 'object' || typeof this.body === 'number' ||
			Array.isArray(this.body)) {
			return 'application/json';
		}
		return null;
	}
	toInitRequest(): RequestInit {
		return {
			method: this.method,
			headers: this.headers.serialize(),
			body: this.serializeBody(),
			mode: 'same-origin', // 'cors' | 'navigate' | 'no-cors' | 'same-origin',
			credentials: 'same-origin',
			cache: 'default', // 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload',
			redirect: 'error', // 'error' | 'follow' | 'manual';
			// referrer: '',
			// integrity: '',
			// keepalive: false,
			// referrerPolicy: ''; // '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url',
			// signal: null,
			// window,
			// method: The request method, e.g., GET, POST. The default is GET.
			// headers: Any headers you want to add to your request, contained within a Headers object or an object literal with ByteString values.
			// body: Any body that you want to add to your request: this can be a Blob, BufferSource, FormData, URLSearchParams, USVString, or ReadableStream object. Note that a request using the GET or HEAD method cannot have a body.
			// mode: The mode you want to use for the request, e.g., cors, no-cors, same-origin, or navigate. The default is cors.
			// credentials: The request credentials you want to use for the request: omit, same-origin, or include. The default is same-origin.
			// cache: The cache mode you want to use for the request.
			// redirect: The redirect mode to use: follow, error, or manual. The default is follow.
			// referrer: A USVString specifying no-referrer, client, or a URL. The default is about:client.
			// integrity: Contains the subresource integrity value of the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).
		}
	}
	toFetchRequest__(): Request {
		return new Request(this.urlWithParams, this.toInitRequest());
		/*
		Request.cache Read only
		Contains the cache mode of the request (e.g., default, reload, no-cache).
		Request.context Read only
		Contains the context of the request (e.g., audio, image, iframe, etc.)
		Request.credentials Read only
		Contains the credentials of the request (e.g., omit, same-origin, include). The default is same-origin.
		Request.destination Read only
		Returns a string from the RequestDestination enum describing the request's destination. This is a string indicating the type of content being requested.
		Request.headers Read only
		Contains the associated Headers object of the request.
		Request.integrity Read only
		Contains the subresource integrity value of the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).
		Request.method Read only
		Contains the request's method (GET, POST, etc.)
		Request.mode Read only
		Contains the mode of the request (e.g., cors, no-cors, same-origin, navigate.)
		Request.redirect Read only
		Contains the mode for how redirects are handled. It may be one of follow, error, or manual.
		Request.referrer Read only
		Contains the referrer of the request (e.g., client).
		Request.referrerPolicy Read only
		Contains the referrer policy of the request (e.g., no-referrer).
		Request.url Read only
		Contains the URL of the request.
		Request implements Body, so it also inherits the following properties:
		body Read only
		A simple getter used to expose a ReadableStream of the body contents.
		bodyUsed Read only
		Stores a Boolean that declares whether the body has been used in a response yet.
		*/
	}
	clone<T>(options?: IHttpRequest<T>): HttpRequest<T> {
		options = Object.assign({
			headers: this.headers,
			reportProgress: this.reportProgress,
			params: this.params,
			responseType: this.responseType,
			withCredentials: this.withCredentials,
			observe: this.observe,
			body: this.body,
			url: this.url,
			method: this.method,
		}, options || {}) as IHttpRequestInit<T>;
		const clone = new HttpRequest<T>(this.method as HttpMethodBodyType, this.url, this.body as HttpBodyType<T>, options);
		return clone;
	}
}

function methodHasBody(method: string): boolean {
	switch (method) {
		case 'DELETE':
		case 'GET':
		case 'HEAD':
		case 'OPTIONS':
		case 'JSONP':
			return false;
		default:
			return true;
	}
}

function isArrayBuffer(value: any): value is ArrayBuffer {
	return typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;
}

function isBlob(value: any): value is Blob {
	return typeof Blob !== 'undefined' && value instanceof Blob;
}

function isFormData(value: any): value is FormData {
	return typeof FormData !== 'undefined' && value instanceof FormData;
}
