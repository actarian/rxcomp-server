import { Factory, IModuleMeta, Module, Pipe } from 'rxcomp';

const factories: typeof Factory[] = [
];

const pipes: typeof Pipe[] = [
];

/**
 *  ServerModule Class.
 * @example
 * export default class AppModule extends Module {}
 *
 * AppModule.meta = {
 *  imports: [
 *   CoreModule,
 *    ServerModule
 *  ],
 *  declarations: [
 *   ErrorsComponent
 *  ],
 *  bootstrap: AppComponent,
 * };
 * @extends Module
 */
export default class ServerModule extends Module {

	static meta: IModuleMeta = {
		declarations: [
			...factories,
			...pipes,
		],
		exports: [
			...factories,
			...pipes,
		]
	};

}
