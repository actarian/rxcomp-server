import { isPlatformServer, ModuleError, Platform } from 'rxcomp';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import CacheService, { CacheMode } from '../cache/cache.service';
import { RxHistory } from '../history/history';
import { RxLocation } from '../location/location';
import { parse, RxDocument, RxElement, RxText } from '../nodes/nodes';
const fs = require('fs');
export class ServerRequest {
    constructor(options) {
        if (options) {
            Object.assign(this, options);
        }
        this.vars = Object.assign({
            host: 'http://localhost:5000',
            port: 5000,
            charset: 'utf8',
            template: `./index.html`,
            cacheMode: CacheMode.Memory,
            cache: './cache/',
            root: './dist/browser/',
        }, this.vars || {});
    }
}
export class ServerResponse {
    constructor(options) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
export class ServerErrorResponse {
    constructor(options) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
export default class Server extends Platform {
    /**
     * @param moduleFactory
     * @description This method returns a Server compiled module
     */
    static bootstrap(moduleFactory, request) {
        var _a;
        if (!isPlatformServer) {
            throw new ModuleError('missing platform server, node process not found');
        }
        if (!moduleFactory) {
            throw new ModuleError('missing moduleFactory');
        }
        if (!moduleFactory.meta) {
            throw new ModuleError('missing moduleFactory meta');
        }
        if (!moduleFactory.meta.bootstrap) {
            throw new ModuleError('missing bootstrap');
        }
        if (!moduleFactory.meta.bootstrap.meta) {
            throw new ModuleError('missing bootstrap meta');
        }
        if (!moduleFactory.meta.bootstrap.meta.selector) {
            throw new ModuleError('missing bootstrap meta selector');
        }
        if (!(request === null || request === void 0 ? void 0 : request.template)) {
            throw new ModuleError('missing template');
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
        const document = this.resolveGlobals(request);
        const meta = this.resolveMeta(moduleFactory);
        if (meta.node instanceof RxElement) {
            const node = meta.node;
            const nodeInnerHTML = meta.nodeInnerHTML;
            const rxcomp_hydrate_ = {
                selector: moduleFactory.meta.bootstrap.meta.selector,
                innerHTML: nodeInnerHTML,
            };
            const scriptNode = new RxElement(null, 'script');
            const scriptText = new RxText(null, `var rxcomp_hydrate_ = ${JSON.stringify(rxcomp_hydrate_)};`);
            scriptNode.append(scriptText);
            (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(scriptNode, node);
        }
        const module = new moduleFactory();
        module.meta = meta;
        meta.imports.forEach((moduleFactory) => {
            moduleFactory.prototype.constructor.call(module);
        });
        const instances = module.compile(meta.node, { document });
        module.instances = instances;
        const root = instances[0];
        root.pushChanges();
        return module;
    }
    static serialize() {
        // console.log('Server.serialize');
        if (this.document instanceof RxDocument) {
            const serialized = this.document.serialize();
            // console.log('serialized', serialized);
            return serialized;
        }
        else {
            throw new ModuleError('document is not an instance of RxDocument');
        }
    }
    static resolveGlobals(request) {
        const url = request.url;
        const location = RxLocation.location;
        location.assign(url);
        global.location = location;
        const history = RxHistory.history;
        history.replaceState(null, '', location.origin);
        global.history = history;
        const documentOrHtml = request.template;
        const document = typeof documentOrHtml === 'string' ? parse(documentOrHtml) : documentOrHtml;
        this.document = document; // !!!
        global.document = this.document;
        history.replaceState(null, document.title || '', location.origin);
        return this.document;
    }
}
Server.render$ = render$;
Server.template$ = template$;
Server.bootstrap$ = bootstrap$;
export function render$(iRequest, renderRequest$) {
    return Observable.create(function (observer) {
        const request = new ServerRequest(iRequest);
        if (request.vars.cacheMode) {
            CacheService.mode = request.vars.cacheMode;
        }
        if (request.vars.cache) {
            CacheService.folder = request.vars.cache;
        }
        const cached = CacheService.get('cached', request.url);
        console.log('Server.render$.fromCache', !!cached, request.url);
        if (cached) {
            observer.next(cached);
            return observer.complete();
        }
        template$(request).pipe(switchMap((template) => {
            // console.log('template!', template);
            request.template = template;
            return renderRequest$(request);
        })).subscribe((success) => {
            CacheService.set('cached', request.url, success, 3600);
            observer.next(success);
            observer.complete();
        }, (error) => {
            observer.error(error);
        });
    });
}
export function template$(request) {
    return Observable.create(function (observer) {
        const src = request.vars.template;
        if (src) {
            const template = CacheService.get('template', src);
            console.log('Server.template$.fromCache', !!template, src);
            if (template) {
                observer.next(template);
                observer.complete();
            }
            fs.readFile(src, request.vars.charset, function (error, template) {
                if (error) {
                    observer.error(error);
                }
                else {
                    CacheService.set('template', src, template);
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
export function bootstrap$(moduleFactory, request) {
    // console.log('Server.bootstrap$', request);
    return Observable.create(function (observer) {
        if (!request.template) {
            return observer.error(new Error('ServerError: missing template'));
        }
        try {
            // const module = Server.bootstrap(moduleFactory, request.template);
            Server.bootstrap(moduleFactory, request);
            const serialize = () => Server.serialize();
            observer.next(new ServerResponse(Object.assign({ serialize }, request)));
            observer.complete();
        }
        catch (error) {
            observer.error(new ServerErrorResponse(Object.assign({ error }, request)));
        }
    });
}
