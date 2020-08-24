// import fetch from 'cross-fetch';
import 'cross-fetch/polyfill';
import { Observable } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { HttpService } from '../../../../rxcomp-http/dist/cjs/rxcomp-http';
import { Server, ServerRequest, ServerResponse } from '../../../src/rxcomp-server';
import AppModule from './app.module';
import { Vars } from './vars';

export function renderRequest$(request: ServerRequest): Observable<ServerResponse> {
	Vars.host = request.vars.host;
	// console.log('renderRequest$', request, Vars);
	return Server.bootstrap$(AppModule, request).pipe(
		switchMap((response: ServerResponse) => {
			return HttpService.pendingRequests$.pipe(
				filter(count => count === 0),
				map(() => {
					response.body = response.serialize();
					return response;
				}),
				first(),
			);
		}),
	);
}
