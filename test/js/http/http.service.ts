import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

export class HttpResponse {

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

export default class HttpService {

	static pendingRequests$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	static http$(method: string, url: string, data?: any, format: string = 'json'): Observable<any> {
		method = url.indexOf('.json') !== -1 ? 'GET' : method;
		const methods = ['POST', 'PUT', 'PATCH'];
		let response_: HttpResponse | null = null;
		this.pendingRequests$.next(this.pendingRequests$.getValue() + 1);
		return from(fetch(url, {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
		}).then((response: Response) => {
			response_ = new HttpResponse(response);
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
				return throwError(this.getError(error, response_));
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

	static getError(object: any, response: HttpResponse | null): any {
		let error = typeof object === 'object' ? object : {};
		if (!error.statusCode) {
			error.statusCode = response ? response.status : 0;
		}
		if (!error.statusMessage) {
			error.statusMessage = response ? response.statusText : object;
		}
		// console.log('HttpService.getError', error, object);
		return error;
	}

}
