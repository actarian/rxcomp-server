"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap$ = exports.template$ = exports.render$ = exports.ServerErrorResponse = exports.ServerResponse = exports.ServerRequest = void 0;
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var cache_service_1 = tslib_1.__importStar(require("../cache/cache.service"));
var nodes_1 = require("../nodes/nodes");
var fs = require('fs');
var ServerRequest = /** @class */ (function () {
    function ServerRequest(options) {
        if (options) {
            Object.assign(this, options);
        }
        this.vars = Object.assign({
            host: 'http://localhost:5000',
            port: 5000,
            charset: 'utf8',
            template: "./index.html",
            cacheMode: cache_service_1.CacheMode.Memory,
            cache: './cache/',
            root: './dist/browser/',
        }, this.vars || {});
    }
    return ServerRequest;
}());
exports.ServerRequest = ServerRequest;
var ServerResponse = /** @class */ (function () {
    function ServerResponse(options) {
        if (options) {
            Object.assign(this, options);
        }
    }
    return ServerResponse;
}());
exports.ServerResponse = ServerResponse;
var ServerErrorResponse = /** @class */ (function () {
    function ServerErrorResponse(options) {
        if (options) {
            Object.assign(this, options);
        }
    }
    return ServerErrorResponse;
}());
exports.ServerErrorResponse = ServerErrorResponse;
var Server = /** @class */ (function (_super) {
    tslib_1.__extends(Server, _super);
    function Server() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param moduleFactory
     * @description This method returns a Server compiled module
     */
    Server.bootstrap = function (moduleFactory, template) {
        var _a;
        if (!rxcomp_1.isPlatformServer) {
            throw new rxcomp_1.ModuleError('missing platform server, node process not found');
        }
        if (!moduleFactory) {
            throw new rxcomp_1.ModuleError('missing moduleFactory');
        }
        if (!moduleFactory.meta) {
            throw new rxcomp_1.ModuleError('missing moduleFactory meta');
        }
        if (!moduleFactory.meta.bootstrap) {
            throw new rxcomp_1.ModuleError('missing bootstrap');
        }
        if (!moduleFactory.meta.bootstrap.meta) {
            throw new rxcomp_1.ModuleError('missing bootstrap meta');
        }
        if (!moduleFactory.meta.bootstrap.meta.selector) {
            throw new rxcomp_1.ModuleError('missing bootstrap meta selector');
        }
        if (!template) {
            throw new rxcomp_1.ModuleError('missing template');
        }
        /*
        if (typeof ((ReadableStream.prototype as any)[Symbol.asyncIterator]) === 'undefined') {
            (ReadableStream.prototype as any)[Symbol.asyncIterator] = async function* () {
                const reader = this.getReader()
                while (1) {
                    const r = await reader.read();
                    if (r.done) {
                        return r.value;
                    }
                    yield r.value;
                }
            }
        }
        */
        var document = this.resolveGlobals(template);
        var meta = this.resolveMeta(moduleFactory);
        if (meta.node instanceof nodes_1.RxElement) {
            var node = meta.node;
            var nodeInnerHTML = meta.nodeInnerHTML;
            var rxcomp_hydrate_ = {
                selector: moduleFactory.meta.bootstrap.meta.selector,
                innerHTML: nodeInnerHTML,
            };
            var scriptNode = new nodes_1.RxElement(null, 'script');
            var scriptText = new nodes_1.RxText(null, "var rxcomp_hydrate_ = " + JSON.stringify(rxcomp_hydrate_) + ";");
            scriptNode.append(scriptText);
            (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(scriptNode, node);
        }
        var module = new moduleFactory();
        module.meta = meta;
        meta.imports.forEach(function (moduleFactory) {
            moduleFactory.prototype.constructor.call(module);
        });
        var instances = module.compile(meta.node, { document: document });
        module.instances = instances;
        var root = instances[0];
        root.pushChanges();
        return module;
    };
    Server.serialize = function () {
        console.log('Server.serialize');
        if (this.document instanceof nodes_1.RxDocument) {
            var serialized = this.document.serialize();
            // console.log('serialized', serialized);
            return serialized;
        }
        else {
            throw new rxcomp_1.ModuleError('document is not an instance of RxDocument');
        }
    };
    Server.resolveGlobals = function (documentOrHtml) {
        var document = typeof documentOrHtml === 'string' ? nodes_1.parse(documentOrHtml) : documentOrHtml;
        this.document = document;
        global.document = this.document;
        return this.document;
    };
    Server.render$ = render$;
    Server.template$ = template$;
    Server.bootstrap$ = bootstrap$;
    return Server;
}(rxcomp_1.Platform));
exports.default = Server;
function render$(iRequest, renderRequest$) {
    return rxjs_1.Observable.create(function (observer) {
        var request = new ServerRequest(iRequest);
        if (request.vars.cacheMode) {
            cache_service_1.default.mode = request.vars.cacheMode;
        }
        if (request.vars.cache) {
            cache_service_1.default.folder = request.vars.cache;
        }
        var cached = cache_service_1.default.get('cached', request.url);
        console.log('cached', !!cached);
        if (cached) {
            observer.next(cached);
            return observer.complete();
        }
        template$(request).pipe(operators_1.switchMap(function (template) {
            // console.log('template!', template);
            request.template = template;
            return renderRequest$(request);
        })).subscribe(function (success) {
            cache_service_1.default.set('cached', request.url, success, 3600);
            observer.next(success);
            observer.complete();
        }, function (error) {
            observer.error(error);
        });
    });
}
exports.render$ = render$;
function template$(request) {
    return rxjs_1.Observable.create(function (observer) {
        var src = request.vars.template;
        if (src) {
            var template = cache_service_1.default.get('template', src);
            console.log('template', !!template);
            if (template) {
                observer.next(template);
                observer.complete();
            }
            fs.readFile(src, request.vars.charset, function (error, template) {
                if (error) {
                    observer.error(error);
                }
                else {
                    cache_service_1.default.set('template', src, template);
                    observer.next(template);
                    observer.complete();
                }
            });
        }
        else {
            observer.error(new Error('ServerError: missing template'));
        }
    });
}
exports.template$ = template$;
function bootstrap$(moduleFactory, request) {
    console.log('bootstrap$', request);
    return rxjs_1.Observable.create(function (observer) {
        if (!request.template) {
            return observer.error(new Error('ServerError: missing template'));
        }
        try {
            // const module = Server.bootstrap(moduleFactory, request.template);
            Server.bootstrap(moduleFactory, request.template);
            var serialize = function () { return Server.serialize(); };
            observer.next(new ServerResponse(Object.assign({ serialize: serialize }, request)));
            observer.complete();
        }
        catch (error) {
            observer.error(new ServerErrorResponse(Object.assign({ error: error }, request)));
        }
    });
}
exports.bootstrap$ = bootstrap$;
