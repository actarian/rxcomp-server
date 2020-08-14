import { HttpEventType, HttpProgressEvent, HttpSentEvent, HttpUserEvent } from './http-event';
import { HttpHeaders } from './http-headers';
import { HttpBodyType } from './http-request';

export type HttpEvent<T> = HttpSentEvent | HttpHeaderResponse<T> | HttpResponse<T> | HttpProgressEvent | HttpUserEvent<T>;

export interface IHttpHeaderResponse<T> {
	headers?: HttpHeaders,
	status?: number,
	statusText?: string,
	url?: string,
	ok?: boolean;
	type?: HttpEventType;
}

export interface IHttpResponse<T> extends IHttpHeaderResponse<T> {
	body?: HttpBodyType;
}

export class HttpHeaderResponse<T> implements IHttpHeaderResponse<T> {
	readonly headers!: HttpHeaders;
	readonly status: number = 200;
	readonly statusText: string = 'OK';
	readonly url: string | undefined;
	readonly ok: boolean;
	readonly type: HttpEventType.ResponseHeader = HttpEventType.ResponseHeader;
	constructor(options?: IHttpHeaderResponse<T>) {
		if (options) {
			this.headers = new HttpHeaders(options.headers);
			this.status = options.status || this.status;
			this.statusText = options.statusText || this.statusText;
			this.url = options.url || this.url;
		}
		this.ok = this.status >= 200 && this.status < 300;
	}
	clone<T>(options?: IHttpHeaderResponse<T>): HttpHeaderResponse<T> {
		options = Object.assign({
			headers: this.headers,
			status: this.status,
			statusText: this.statusText,
			url: this.url,
			ok: this.ok,
			type: this.type,
		}, options || {});
		const clone = new HttpHeaderResponse<T>(options);
		return clone;
	}
}

export class HttpResponse<T> implements IHttpResponse<T> {
	readonly headers!: HttpHeaders;
	readonly status: number = 200;
	readonly statusText: string = 'OK';
	readonly url: string | undefined;
	readonly ok: boolean;
	readonly type: HttpEventType.Response = HttpEventType.Response;
	readonly body: HttpBodyType = null;
	constructor(options?: IHttpResponse<T>) {
		if (options) {
			this.headers = new HttpHeaders(options.headers);
			this.status = options.status || this.status;
			this.statusText = options.statusText || this.statusText;
			this.url = options.url || this.url;
			this.body = options.body || this.body;
		}
		this.ok = this.status >= 200 && this.status < 300;
	}
	clone<T>(options?: IHttpResponse<T>): HttpResponse<T> {
		options = Object.assign({
			headers: this.headers,
			status: this.status,
			statusText: this.statusText,
			url: this.url,
			ok: this.ok,
			type: this.type,
			body: this.body,
		}, options || {});
		const clone = new HttpResponse<T>(options);
		return clone;
	}
}

export abstract class HttpResponseBase<T> {
	readonly headers: HttpHeaders;
	readonly status: number = 200;
	readonly statusText: string = 'OK';
	readonly url: string | undefined;
	readonly ok: boolean;
	readonly type!: HttpEventType.Response | HttpEventType.ResponseHeader;
	constructor(
		options: IHttpHeaderResponse<T>,
		defaultStatus: number = 200,
		defaultStatusText: string = 'OK'
	) {
		this.headers = options.headers || new HttpHeaders();
		this.status = options.status !== undefined ? options.status : defaultStatus;
		this.statusText = options.statusText || defaultStatusText;
		this.url = options.url || undefined;
		this.ok = this.status >= 200 && this.status < 300;
	}
}

/*
// !!!
export default class HttpResponse {
	data?: any;
	url: string = '';
	status: number = 0;
	statusText: string = '';
	ok: boolean = false;
	redirected: boolean = false;
	get static() {
		return this.url!.indexOf('.json') === this.url!.length - 5;
	}
	constructor(response: Response) {
		this.data = null;
		if (response) {
			this.url = response.url;
			this.status = response.status;
			this.statusText = response.statusText;
			this.ok = response.ok;
			this.redirected = response.redirected;
		}
	}
}
*/
