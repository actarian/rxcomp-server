
import { EMPTY, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpRequest, HttpResponse, IHttpInterceptor } from '../../../../../rxcomp-http/dist/cjs/rxcomp-http';

const cancelRequest: boolean = false;

export class CustomInterceptor implements IHttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (cancelRequest) {
			return EMPTY;
		}
		const clonedRequest = request.clone({
			url: request.url,
		});
		// console.log('CustomInterceptor.clonedRequest', clonedRequest);
		return next.handle(clonedRequest);
		return next.handle(request).pipe(
			tap(event => {
				if (event instanceof HttpResponse) {
					console.log('CustomInterceptor.status', event.status);
					console.log('CustomInterceptor.filter', request.params.get('filter'));
				}
			})
		);
	}
}
