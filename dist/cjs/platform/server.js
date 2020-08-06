"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var renderer_1 = tslib_1.__importDefault(require("../renderer/renderer"));
var Server = /** @class */ (function (_super) {
    tslib_1.__extends(Server, _super);
    function Server() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Server.bootstrap = function (moduleFactory, html) {
        if (!html) {
            throw 'missing html template';
        }
        renderer_1.default.bootstrap(html);
        if (!moduleFactory) {
            throw 'missing moduleFactory';
        }
        if (!moduleFactory.meta) {
            throw 'missing moduleFactory meta';
        }
        if (!moduleFactory.meta.bootstrap) {
            throw 'missing bootstrap';
        }
        if (!moduleFactory.meta.bootstrap.meta) {
            throw 'missing bootstrap meta';
        }
        if (!moduleFactory.meta.bootstrap.meta.selector) {
            throw 'missing bootstrap meta selector';
        }
        var meta = this.resolveMeta(moduleFactory);
        var module = new moduleFactory();
        module.meta = meta;
        var instances = module.compile(meta.node, window);
        module.instances = instances;
        var root = instances[0];
        root.pushChanges();
        return module;
    };
    Server.querySelector = function (selector) {
        return renderer_1.default.document.querySelector(selector);
    };
    return Server;
}(rxcomp_1.Platform));
exports.default = Server;
