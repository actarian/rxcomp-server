import { CoreModule, IModuleMeta, Module } from 'rxcomp';
import { ServerModule } from '../../src/rxcomp-server';
import AppComponent from './app.component';

export default class AppModule extends Module {

	static meta: IModuleMeta = {
		imports: [
			CoreModule,
			ServerModule
		],
		declarations: [
		],
		bootstrap: AppComponent,
	};

}
