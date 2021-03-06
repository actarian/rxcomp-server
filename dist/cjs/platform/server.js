"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap$ = exports.template$ = exports.fromRenderRequest$ = exports.fromCache$ = exports.render$ = exports.ServerErrorResponse = exports.ServerResponse = exports.ServerRequest = void 0;
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var cache_service_1 = tslib_1.__importStar(require("../cache/cache.service"));
var file_service_1 = tslib_1.__importDefault(require("../file/file.service"));
var history_1 = require("../history/history");
var location_1 = require("../location/location");
var nodes_1 = require("../nodes/nodes");
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
        this.maxAge = 3600;
        this.cacheControl = cache_service_1.CacheControlType.Public;
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
    Server.bootstrap = function (moduleFactory, request) {
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
        if (!(request === null || request === void 0 ? void 0 : request.template)) {
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
        var document = this.resolveGlobals(request);
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
        // console.log('Server.serialize');
        if (this.document instanceof nodes_1.RxDocument) {
            var serialized = this.document.serialize();
            // console.log('serialized', serialized);
            return serialized;
        }
        else {
            throw new rxcomp_1.ModuleError('document is not an instance of RxDocument');
        }
    };
    Server.resolveGlobals = function (request) {
        var url = request.url;
        var location = location_1.RxLocation.location;
        location.assign(url);
        global.location = location;
        var history = history_1.RxHistory.history;
        history.replaceState(null, '', location.origin);
        global.history = history;
        var documentOrHtml = request.template;
        var document = typeof documentOrHtml === 'string' ? nodes_1.parse(documentOrHtml) : documentOrHtml;
        this.document = document; // !!!
        global.document = this.document;
        history.replaceState(null, document.title || '', location.origin);
        global.window = global.self = new nodes_1.RxWindow({
            document: document,
            history: history,
            location: location,
            devicePixelRatio: 1,
        });
        // console.log('window', window);
        return this.document;
    };
    Server.render$ = render$;
    Server.template$ = template$;
    Server.bootstrap$ = bootstrap$;
    return Server;
}(rxcomp_1.Platform));
exports.default = Server;
function render$(iRequest, renderRequest$) {
    var request;
    var request$ = rxjs_1.Observable.create(function (observer) {
        request = new ServerRequest(iRequest);
        observer.next(request);
        observer.complete();
    });
    return request$.pipe(operators_1.switchMap(function (request) { return fromCache$(request); }), operators_1.switchMap(function (response) {
        console.log('NodeJs.Server.render$.fromCache', 'route', request.url, !!response);
        if (response) {
            return rxjs_1.of(response);
        }
        else {
            return fromRenderRequest$(request, renderRequest$);
        }
    }));
}
exports.render$ = render$;
function fromCache$(request) {
    if (request.vars.cacheMode) {
        cache_service_1.default.mode = request.vars.cacheMode;
    }
    if (request.vars.cache) {
        cache_service_1.default.folder = request.vars.cache;
    }
    return cache_service_1.default.get$('render', request.url);
}
exports.fromCache$ = fromCache$;
function fromRenderRequest$(request, renderRequest$) {
    return template$(request).pipe(operators_1.switchMap(function (template) {
        request.template = template;
        return renderRequest$(request);
    }), operators_1.switchMap(function (response) {
        return cache_service_1.default.set$('render', request.url, response, response.maxAge, response.cacheControl).pipe(operators_1.switchMap(function () { return rxjs_1.of(response); }));
    }));
}
exports.fromRenderRequest$ = fromRenderRequest$;
function template$(request) {
    var templateSrc$ = rxjs_1.Observable.create(function (observer) {
        var src = request.vars.template;
        if (src) {
            observer.next(src);
            observer.complete();
        }
        else {
            observer.error(new Error('ServerError: you must provide a template path'));
        }
    });
    return templateSrc$.pipe(operators_1.switchMap(function (src) { return file_service_1.default.readFile$(src); }), operators_1.switchMap(function (template) { return template ? rxjs_1.of(template) : rxjs_1.throwError(new Error("ServerError: missing template at path " + request.vars.template)); }));
}
exports.template$ = template$;
function bootstrap$(moduleFactory, request) {
    // console.log('Server.bootstrap$', request);
    return rxjs_1.Observable.create(function (observer) {
        if (!request.template) {
            return observer.error(new Error('ServerError: missing template'));
        }
        try {
            // const module = Server.bootstrap(moduleFactory, request.template);
            Server.bootstrap(moduleFactory, request);
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
