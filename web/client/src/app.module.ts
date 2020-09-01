import { CoreModule, IModuleMeta, Module } from 'rxcomp';
import { HttpModule } from 'rxcomp-http';
import { RouterModule } from '../../../../rxcomp-router/dist/cjs/rxcomp-router';
import AppComponent from './app.component';
import { CustomRequestInterceptor, CustomResponseInterceptor } from './custom-interceptor/custom.interceptor';
import NotFoundComponent from './pages/not-found.component';
import TodolistItemComponent from './pages/todolist-item.component';
import TodolistComponent from './pages/todolist.component';

export default class AppModule extends Module {

	static meta: IModuleMeta = {
		imports: [
			CoreModule,
			HttpModule.useInterceptors([CustomRequestInterceptor, CustomResponseInterceptor]),
			RouterModule.forRoot([
				{ path: '', redirectTo: '/todolist', pathMatch: 'full' },
				{ path: 'todolist', component: TodolistComponent, data: { title: 'Todolist' } },
				{ path: 'todolist/:itemId', component: TodolistItemComponent, data: { title: 'Todolist Item' } },
				{ path: '**', component: NotFoundComponent },
			]), // .useStrategy(LocationStrategyHash),
		],
		declarations: [
			TodolistComponent,
			TodolistItemComponent,
			NotFoundComponent
		],
		bootstrap: AppComponent,
	};

}
