import { Browser } from 'rxcomp';
import { Server } from '../../src/rxcomp-server';
import AppModule from './app.module';

Browser.bootstrap(AppModule);

fetch('./test.html')
	.then(response => response.text())
	.then(html => {
		const module = Server.bootstrap(AppModule, html);
		// console.log('module', module);
		const serialized = Server.serialize();
		// console.log('serialized', serialized);
		const app = document.getElementById('app');
		if (app) {
			app.innerHTML = serialized;
		}
	});
