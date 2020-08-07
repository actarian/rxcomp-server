// import fetch from 'cross-fetch';
import 'cross-fetch/polyfill';
import { Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { Server } from '../../src/rxcomp-server';
import AppModule from './app.module';
import HttpService from './http/http.service';

export function renderServer(html: string): Observable<string> {
	const module = Server.bootstrap(AppModule, html);
	console.log(module);
	// return of(Server.serialize());
	return HttpService.pendingRequests$.pipe(
		filter(x => x === 0),
		map(x => Server.serialize()),
		first(),
	);
}
