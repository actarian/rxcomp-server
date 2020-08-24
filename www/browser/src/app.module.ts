import { CoreModule, IModuleMeta, Module } from 'rxcomp';
import { HttpModule } from '../../../../rxcomp-http/dist/cjs/rxcomp-http';
import AppComponent from './app.component';
import { CustomInterceptor } from './custom-interceptor/custom.interceptor';

export default class AppModule extends Module {

	static meta: IModuleMeta = {
		imports: [
			CoreModule,
			HttpModule.useInterceptors([CustomInterceptor]),
		],
		declarations: [
		],
		bootstrap: AppComponent,
	};

}
