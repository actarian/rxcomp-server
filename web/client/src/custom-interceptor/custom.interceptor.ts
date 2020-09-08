
import { HttpEvent, HttpHandler, HttpRequest, HttpResponse, IHttpInterceptor } from 'rxcomp-http';
import { EMPTY, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const cancelRequest: boolean = false;
export class CustomRequestInterceptor implements IHttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (cancelRequest) {
			return EMPTY;
		}
		return next.handle(request);
	}
}
export class CustomResponseInterceptor implements IHttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			tap(event => {
				if (event instanceof HttpResponse) {
					console.log('CustomResponseInterceptor.status', event.status);
					console.log('CustomResponseInterceptor.filter', request.params.get('filter'));
				}
			})
		);
	}
}
export class CustomRequestCloneInterceptor implements IHttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const clonedRequest = request.clone({
			url: request.url,
		});
		return next.handle(clonedRequest);
	}
}
