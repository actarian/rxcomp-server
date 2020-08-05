import { Browser } from 'rxcomp';
import AppModule from './app.module';
import { Server, Renderer, RxDocument } from '../../src/rxcomp-server';

Browser.bootstrap(AppModule);

fetch('./test.html')
	.then(response => response.text())
	.then(html => {
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
			const app = document.getElementById('app');
			if (app) {
				app.innerHTML = serialized;
			}
		}
	});
