import { IModuleMeta, Module } from 'rxcomp';
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
    static meta: IModuleMeta;
}
