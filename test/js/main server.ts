import AppModule from './app.module';
import { Server, Renderer, RxDocument } from '../../src/rxcomp-server';

export function renderServer(html: string): string {
	// console.log(html);
	// const doc = Renderer.parse(html);
	// const serialized = doc.serialize();
	// console.log(doc);
	// console.log(serialized);
	// document.getElementById('app').innerHTML = serialized;
	const module = Server.bootstrap(AppModule, html);
	console.log('module', module);
	const doc = Renderer.document;
	// console.log('doc', doc);
	if (doc instanceof RxDocument) {
		const serialized = doc.serialize();
		console.log('serialized', serialized);
		return serialized;
	} else {
		throw ('renderServer should run on Node');
	}
}
