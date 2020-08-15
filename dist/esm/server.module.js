import { Module } from 'rxcomp';
const factories = [];
const pipes = [];
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
}
ServerModule.meta = {
    declarations: [
        ...factories,
        ...pipes,
    ],
    exports: [
        ...factories,
        ...pipes,
    ]
};
