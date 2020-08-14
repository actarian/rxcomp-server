import { Observable } from 'rxjs';
import { HttpRequest } from './http-request';
import { HttpEvent } from './http-response';

export abstract class HttpHandler {
	abstract handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}
