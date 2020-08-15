import { CoreModule, IModuleMeta, Module } from 'rxcomp';
import AppComponent from './app.component';

export default class AppModule extends Module {

	static meta: IModuleMeta = {
		imports: [
			CoreModule,
		],
		declarations: [
		],
		bootstrap: AppComponent,
	};

}
