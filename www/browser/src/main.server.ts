// import fetch from 'cross-fetch';
import 'cross-fetch/polyfill';
import { Observable } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { Server, ServerRequest, ServerResponse } from '../../../src/rxcomp-server';
import AppModule from './app.module';
import HttpClient from './http/http-client';
import { Vars } from './vars';

export function renderRequest$(request: ServerRequest): Observable<ServerResponse> {
	Vars.host = request.vars.host;
	// console.log('renderRequest$', request, Vars);
	return Server.bootstrap$(AppModule, request).pipe(
		switchMap((response: ServerResponse) => {
			return HttpClient.pendingRequests$.pipe(
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
