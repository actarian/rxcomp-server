import { nextError$ } from 'rxcomp';
import { Observable, Observer } from 'rxjs';
import { HttpErrorResponse, IHttpErrorResponse, IHttpJsonParseError } from './http-error-response';
import { HttpDownloadProgressEvent, HttpEventType, HttpUploadProgressEvent } from './http-event';
import { HttpHandler } from './http-handler';
import { HttpHeaders } from './http-headers';
import { HttpRequest } from './http-request';
import { HttpEvent, HttpHeaderResponse, HttpResponse } from './http-response';

const XSSI_PREFIX = /^\)\]\}',?\n/;

export interface IPartialResponse {
	headers: HttpHeaders;
	status: number;
	statusText: string;
	url: string;
}

export class HttpXhrHandler implements HttpHandler {
	handle<T>(request: HttpRequest<any>): Observable<HttpEvent<T>> {
		if (!request.method) {
			throw new Error(`missing method`);
		}
		if (request.method === 'JSONP') {
			throw new Error(`Attempted to construct Jsonp request without JsonpClientModule installed.`);
		}
		console.log('HttpXhrHandler.request', request);
		return new Observable((observer: Observer<HttpEvent<any>>) => {
			const xhr = new XMLHttpRequest();
			const requestInfo: RequestInfo = request.urlWithParams;
			const requestInit: RequestInit = request.toInitRequest();
			if (!requestInit.method) {
				throw new Error(`missing method`);
			}
			xhr.open(requestInit.method!, requestInfo);
			if (request.withCredentials) {
				xhr.withCredentials = true;
			}
			const headers = request.headers;
			if (!headers.has('Accept')) {
				headers.set('Accept', 'application/json, text/plain, */*');
			}
			if (!headers.has('Content-Type')) {
				const detectedType = request.detectContentTypeHeader();
				if (detectedType !== null) {
					headers.set('Content-Type', detectedType);
				}
			}
			console.log('HttpXhrHandler.contentType', headers.get('Content-Type'));
			headers.forEach((value, name) => xhr.setRequestHeader(name, value));
			if (request.responseType) {
				xhr.responseType = (request.responseType !== 'json' ? request.responseType : 'text') as any;
			}
			const body = request.serializeBody();
			let headerResponse: HttpHeaderResponse<T> | null = null;
			const partialFromXhr_ = (): HttpHeaderResponse<T> => {
				if (headerResponse !== null) {
					return headerResponse;
				}
				const status: number = xhr.status === 1223 ? 204 : xhr.status;
				const statusText = xhr.statusText || 'OK';
				const headers = new HttpHeaders(xhr.getAllResponseHeaders());
				const url = getResponseUrl_(xhr) || request.url;
				headerResponse = new HttpHeaderResponse({ headers, status, statusText, url });
				return headerResponse;
			};
			const onLoad = () => {
				let { headers, status, statusText, url } = partialFromXhr_();
				let body: any | null = null;
				if (status !== 204) {
					body = (typeof xhr.response === 'undefined') ? xhr.responseText : xhr.response;
				}
				if (status === 0) {
					status = !!body ? 200 : 0;
				}
				let ok = status >= 200 && status < 300;
				if (request.responseType === 'json' && typeof body === 'string') {
					const originalBody = body;
					body = body.replace(XSSI_PREFIX, '');
					try {
						body = body !== '' ? JSON.parse(body) : null;
					} catch (error) {
						body = originalBody;
						if (ok) {
							ok = false;
							body = { error, text: body } as IHttpJsonParseError;
						}
					}
				}
				if (ok) {
					observer.next(new HttpResponse({ body, headers, status, statusText, url: url }));
					observer.complete();
				} else {
					const options: IHttpErrorResponse<T> = {
						error: new Error(statusText),
						headers,
						status,
						statusText,
						url,
						request
					};
					const httpErrorResponse = new HttpErrorResponse<T>(options);
					// console.log('httpErrorResponse', httpErrorResponse);
					nextError$.next(httpErrorResponse);
					// return of(null);
					observer.error(httpErrorResponse);
				}
			};
			const onError = (error: ProgressEvent) => {
				const { url } = partialFromXhr_();
				const statusText = xhr.statusText || 'Unknown Error';
				const headers = new HttpHeaders(xhr.getAllResponseHeaders());
				const options: IHttpErrorResponse<T> = {
					error: new Error(statusText),
					headers,
					status: xhr.status || 0,
					statusText,
					url,
					request
				};
				const httpErrorResponse = new HttpErrorResponse<T>(options);
				// console.log('httpErrorResponse', httpErrorResponse);
				nextError$.next(httpErrorResponse);
				// return of(null);
				observer.error(httpErrorResponse);
			};
			let sentHeaders = false;
			const onDownProgress = (event: ProgressEvent) => {
				if (!sentHeaders) {
					observer.next(partialFromXhr_());
					sentHeaders = true;
				}
				const progressEvent: HttpDownloadProgressEvent = {
					type: HttpEventType.DownloadProgress,
					loaded: event.loaded,
				};
				if (event.lengthComputable) {
					progressEvent.total = event.total;
				}
				if (request.responseType === 'text' && !!xhr.responseText) {
					progressEvent.partialText = xhr.responseText;
				}
				console.log(progressEvent);
				observer.next(progressEvent);
			};
			const onUpProgress = (event: ProgressEvent) => {
				const progress: HttpUploadProgressEvent = {
					type: HttpEventType.UploadProgress,
					loaded: event.loaded,
				};
				if (event.lengthComputable) {
					progress.total = event.total;
				}
				observer.next(progress);
			};
			xhr.addEventListener('load', onLoad);
			xhr.addEventListener('error', onError);
			if (request.reportProgress) {
				xhr.addEventListener('progress', onDownProgress);
				if (body !== null && xhr.upload) {
					xhr.upload.addEventListener('progress', onUpProgress);
				}
			}
			xhr.send(body!);
			observer.next({ type: HttpEventType.Sent });
			return () => {
				xhr.removeEventListener('error', onError);
				xhr.removeEventListener('load', onLoad);
				if (request.reportProgress) {
					xhr.removeEventListener('progress', onDownProgress);
					if (body !== null && xhr.upload) {
						xhr.upload.removeEventListener('progress', onUpProgress);
					}
				}
				if (xhr.readyState !== xhr.DONE) {
					xhr.abort();
				}
			};
		});
	}
}

function getResponseUrl_(xhr: any): string | null {
	if ('responseURL' in xhr && xhr.responseURL) {
		return xhr.responseURL;
	}
	if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
		return xhr.getResponseHeader('X-Request-URL');
	}
	return null;
}
