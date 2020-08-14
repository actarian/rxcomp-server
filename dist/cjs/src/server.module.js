"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var factories = [];
var pipes = [];
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
var ServerModule = /** @class */ (function (_super) {
    tslib_1.__extends(ServerModule, _super);
    function ServerModule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServerModule.meta = {
        declarations: tslib_1.__spread(factories, pipes),
        exports: tslib_1.__spread(factories, pipes)
    };
    return ServerModule;
}(rxcomp_1.Module));
exports.default = ServerModule;
