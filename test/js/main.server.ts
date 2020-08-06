import { Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { Server } from '../../src/rxcomp-server';
import AppModule from './app.module';
import HttpService from './http/http.service';

export function renderServer(html: string): Observable<string> {
	// console.log(html);
	// const doc = Renderer.parse(html);
	// const serialized = doc.serialize();
	// console.log(doc);
	// console.log(serialized);
	// document.getElementById('app').innerHTML = serialized;
	const module = Server.bootstrap(AppModule, html);
	if (false) {
		console.log('module', module);
	}
	return HttpService.pendingRequests$.pipe(
		filter(x => x === 0),
		map(x => Server.serialize()),
		first(),
	);
}
