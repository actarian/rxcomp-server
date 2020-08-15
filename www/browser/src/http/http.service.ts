import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { HttpErrorResponse, IHttpErrorResponse } from './http-error-response';
import { HttpMethodType, HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export default class HttpService {

	static pendingRequests$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	static incrementPendingRequest() {
		HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() + 1);
	}

	static decrementPendingRequest() {
		HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() - 1);
	}

	static http$<T>(method: HttpMethodType, url: string, data?: any, format: string = 'json'): Observable<any> {
		method = url.indexOf('.json') !== -1 ? 'GET' : method;
		const methods: HttpMethodType[] = ['POST', 'PUT', 'PATCH'];
		let response_: HttpResponse<T> | null = null;
		this.pendingRequests$.next(this.pendingRequests$.getValue() + 1);
		const request: HttpRequest<T> = new HttpRequest<T>({
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
		});
		return from(fetch(url, request).then((response: Response) => {
			response_ = new HttpResponse<T>(response);
			if (typeof (response as any)[format] === 'function') {
				return (response as any)[format]().then((json: any) => {
					response_!.data = json;
					if (response.ok) {
						return Promise.resolve(response_);
					} else {
						return Promise.reject(response_);
					}
				});
			} else {
				return Promise.reject(response_);
			}
		})).pipe(
			catchError(error => {
				console.log('error', error);
				return throwError(this.getError(error, response_, request));
			}),
			finalize(() => {
				this.pendingRequests$.next(this.pendingRequests$.getValue() - 1);
			})
		);
	}

	static get$(url: string, data?: any, format?: string): Observable<any> {
		const query = this.query(data);
		return this.http$('GET', `${url}${query}`, undefined, format);
	}

	static delete$(url: string): Observable<any> {
		return this.http$('DELETE', url);
	}

	static post$(url: string, data?: any): Observable<any> {
		return this.http$('POST', url, data);
	}

	static put$(url: string, data?: any): Observable<any> {
		return this.http$('PUT', url, data);
	}

	static patch$(url: string, data?: any): Observable<any> {
		return this.http$('PATCH', url, data);
	}

	static query(data: any): string {
		return ''; // todo
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
