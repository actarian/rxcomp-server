import { isPlatformBrowser, nextError$ } from 'rxcomp';
import { from, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { HttpErrorResponse, IHttpErrorResponse } from './http-error-response';
import { HttpHandler } from './http-handler';
import { HttpRequest } from './http-request';
import { HttpEvent, HttpResponse, IHttpResponse } from './http-response';

export class HttpFetchHandler implements HttpHandler {

	private response_: HttpResponse<any> | null = null;

	handle<T>(request: HttpRequest<any>): Observable<HttpEvent<T>> {
		if (!request.method) {
			throw new Error(`missing method`);
		}
		const requestInfo: RequestInfo = request.urlWithParams;
		const requestInit: RequestInit = request.toInitRequest();
		// const fetchRequest: Request = request.toFetchRequest__();
		// console.log('fetchRequest', fetchRequest);
		// fetchRequest.headers.forEach((value, key) => console.log('HttpFetchHandler.handle', key, value));
		// request = request.clone({ headers: fetchRequest.headers });
		// console.log('HttpFetchHandler.handle', 'requestInfo', requestInfo, 'requestInit', requestInit);
		return from(
			fetch(requestInfo, requestInit)
				// fetch(fetchRequest)
				.then((response: Response) => this.getProgress<T>(response, request))
				.then((response: Response | HttpResponse<T>) => this.getResponse<T>(response, request))
		).pipe(
			catchError((error: Error) => {
				const errorResponse: IHttpErrorResponse<T> = { error };
				if (this.response_) {
					errorResponse.headers = this.response_.headers;
					errorResponse.status = this.response_.status;
					errorResponse.statusText = this.response_.statusText;
					errorResponse.url = this.response_.url;
					errorResponse.request = request;
				}
				const httpErrorResponse = new HttpErrorResponse<T>(errorResponse);
				// console.log('httpErrorResponse', httpErrorResponse);
				nextError$.next(httpErrorResponse);
				return of(this.response_) as Observable<any>;
				// return throwError(httpErrorResponse);
			}),
			finalize(() => {
				this.response_ = null;
			})
		);
	}

	/*
	onProgress(value: Uint8Array, done: boolean, request, reader, progress) {
		console.log("value:", value);
		if (value || done) {
			console.log("upload complete, request.bodyUsed:", request.bodyUsed);
			progress.value = progress.max;
			return reader.closed.then(() => fileUpload);
		};
		console.log("upload progress:", value);
		if (progress.value < file.size) {
			progress.value += 1;
		}
		return reader.read().then(({ value, done }) => this.onProgress(value, done, request, reader, progress));
	};

	getProgress_(request) {
		const uploadProgress = new ReadableStream({
			start(controller) {
				console.log("starting upload, request.bodyUsed:", request.bodyUsed);
				controller.enqueue(request.bodyUsed);
			},
			pull(controller) {
				if (request.bodyUsed) {
					controller.close();
				}
				controller.enqueue(request.bodyUsed);
				console.log("pull, request.bodyUsed:", request.bodyUsed);
			},
			cancel(reason) {
				console.log(reason);
			}
		});

		const [fileUpload, reader] = [
			upload(request).catch(e => {
				reader.cancel();
				console.log(e);
				throw e
			}), uploadProgress.getReader()
		];
	}
	*/

	getProgress<T>(response: Response, request: HttpRequest<any>): Promise<Response | HttpResponse<T>> {
		// console.log('HttpFetchHandler.setProgress', request.reportProgress, response.body);
		const clonedBody = response.clone().body;
		if (isPlatformBrowser && request.reportProgress && clonedBody) {
			const reader: ReadableStreamDefaultReader<Uint8Array> = clonedBody.getReader();
			const contentLength = response.headers && response.headers.has('Content-Length') ? +(response.headers.get('Content-Length') || 0) : 0;
			return new Promise((resolve, reject) => {
				/*
				let receivedLength = 0; // received that many bytes at the moment
				const chunks: Uint8Array[] = []; // array of received binary chunks (comprises the body)
				const getChunk = () => {
					return reader.read().then(({ done, value }) => {
						if (!done) {
							if (value) {
								chunks.push(value);
								receivedLength += value.length || 0;
								console.log(`HttpFetchHandler.setProgress ${(receivedLength / contentLength * 100).toFixed(2)}% ${receivedLength} of ${contentLength}`);
							}
							getChunk();
						} else {
							reader.cancel();
							resolve(response);
							if (false) {
								// Step 4: concatenate chunks into single Uint8Array
								const chunksAll = new Uint8Array(receivedLength); // (4.1)
								let position = 0;
								for (let chunk of chunks) {
									chunksAll.set(chunk, position); // (4.2)
									position += chunk.length;
								}
								// Step 5: decode into a string
								const result = new TextDecoder("utf-8").decode(chunksAll);
								// We're done!
								const data = JSON.parse(result);
								console.log('HttpFetchHandler.setProgress data', data);
								resolve(response);
							}
						}
					}).catch(error => {
						reader.cancel();
						reject(error);
					});
				};
				getChunk();
				*/
				const progress = { progress: 0, percent: 0, current: 0, total: 0 };
				const onProgress = (value: Uint8Array | undefined, done: boolean): Promise<any> => {
					let receivedLength = progress.current;
					if (!done) {
						if (value) {
							receivedLength += value.length || 0;
							progress.total = contentLength;
							progress.current = receivedLength;
							progress.progress = receivedLength / contentLength;
							progress.percent = progress.progress * 100;
						}
						// console.log('progress', progress);
						return reader.read().then(({ value, done }) => onProgress(value, done));
					} else {
						progress.total = contentLength;
						progress.current = contentLength;
						progress.progress = 1;
						progress.percent = 100;
						// console.log('progress', progress);
						return reader.closed.then(() => response.clone());
					}
				};
				reader.read()
					.then(({ value, done }) => onProgress(value, done))
					.then(response => {
						this.response_ = new HttpResponse<T>(response as unknown as IHttpResponse<T>);
						if (typeof (response as any)[request.responseType] === 'function') {
							return (response as any)[request.responseType]().then((json: any) => {
								this.response_ = new HttpResponse<T>(Object.assign(this.response_, { body: json }) as IHttpResponse<T>);
								if (response.ok) {
									return resolve(this.response_);
								} else {
									return reject(this.response_);
								}
							});
						} else {
							return reject(this.response_);
						}
					})
					.catch(err => console.log("upload error:", err));
			});
		} else {
			return Promise.resolve(response);
		}
	}

	getResponse<T>(response: Response | HttpResponse<T>, request: HttpRequest<any>): Promise<HttpResponse<T>> {
		this.response_ = new HttpResponse<T>(response as IHttpResponse<T>);
		if (isPlatformBrowser && request.reportProgress && response.body) {
			return Promise.resolve(this.response_);
		} else {
			return this.getResponseType(response as Response, request);
		}
	}

	getResponseType<T>(response: Response, request: HttpRequest<any>): Promise<HttpResponse<T>> {
		return new Promise((resolve, reject) => {
			this.response_ = new HttpResponse<T>(response as unknown as IHttpResponse<T>);
			if (typeof (response as any)[request.responseType] === 'function') {
				return (response as any)[request.responseType]().then((json: any) => {
					this.response_ = new HttpResponse<T>(Object.assign(this.response_, { body: json }) as IHttpResponse<T>);
					if (response.ok) {
						return resolve(this.response_);
					} else {
						return reject(this.response_);
					}
				});
			} else {
				return reject(this.response_);
			}
		});
	}

	getReadableStream<T>(response: Response, request: HttpRequest<any>): ReadableStream {
		const reader = response.body!.getReader();
		const readableStream = new ReadableStream({
			start(controller) {
				// console.log("starting upload, request.bodyUsed:", request.bodyUsed);
				// controller.enqueue(request.bodyUsed);
				// The following function handles each data chunk
				const push = function () {
					// "done" is a Boolean and value a "Uint8Array"
					reader.read().then(({ done, value }) => {
						// Is there no more data to read?
						if (done) {
							// Tell the browser that we have finished sending data
							controller.close();
							return;
						}
						// Get the data and send it to the browser via the controller
						controller.enqueue(value);
						push();
					});
				};
				push();
			},
			/*
			pull(controller) {
				if (request.bodyUsed) {
					controller.close();
				}
				controller.enqueue(request.bodyUsed);
				console.log("pull, request.bodyUsed:", request.bodyUsed);
			},
			cancel(reason) {
				console.log(reason);
			}
			*/
		});
		return readableStream;
	}

}
