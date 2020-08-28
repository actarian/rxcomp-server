import { Module, Platform } from 'rxcomp';
import { Observable } from 'rxjs';
import { CacheControlType, CacheMode } from '../cache/cache.service';
import { RxDocument } from '../nodes/nodes';
export interface IServerVars {
    name?: string;
    host?: string;
    port?: number;
    charset?: string;
    template?: string;
    cacheMode?: CacheMode;
    cache?: string;
    root?: string;
    resource?: string;
    api?: string;
    static?: boolean;
    development?: boolean;
    production?: boolean;
    [key: string]: any;
}
export interface IServerRequest {
    url: string;
    template?: string;
    vars?: IServerVars;
}
export interface IServerResponse extends IServerRequest {
    serialize: () => string;
    body?: string;
    statusCode?: number;
    statusMessage?: string;
    maxAge?: number;
    cacheControl?: CacheControlType;
}
export interface IServerErrorResponse extends IServerRequest {
    error: Error;
    statusCode?: number;
    statusMessage?: string;
}
export declare class ServerRequest implements IServerRequest {
    url: string;
    template: string;
    vars: IServerVars;
    constructor(options?: IServerRequest);
}
export declare class ServerResponse implements IServerResponse {
    url: string;
    template: string;
    vars: IServerVars;
    serialize: () => string;
    body: string;
    statusCode?: number;
    statusMessage?: string;
    maxAge: number;
    cacheControl: CacheControlType;
    constructor(options?: IServerResponse);
}
export declare class ServerErrorResponse implements IServerErrorResponse {
    url: string;
    vars: IServerVars;
    error: Error;
    statusCode?: number;
    statusMessage?: string;
    constructor(options?: IServerErrorResponse);
}
export default class Server extends Platform {
    /**
     * @param moduleFactory
     * @description This method returns a Server compiled module
     */
    static bootstrap(moduleFactory?: typeof Module, request?: ServerRequest): Module;
    static serialize(): string;
    protected static document: Document | RxDocument;
    protected static resolveGlobals(request: ServerRequest): Document | RxDocument;
    static render$: typeof render$;
    static template$: typeof template$;
    static bootstrap$: typeof bootstrap$;
}
export declare function render$(iRequest: IServerRequest, renderRequest$: (request: ServerRequest) => Observable<ServerResponse>): Observable<ServerResponse>;
export declare function fromCache$(request: ServerRequest): Observable<ServerResponse | null>;
export declare function fromRenderRequest$(request: ServerRequest, renderRequest$: (request: ServerRequest) => Observable<ServerResponse>): Observable<ServerResponse>;
export declare function template$(request: ServerRequest): Observable<string>;
export declare function bootstrap$(moduleFactory: typeof Module, request: ServerRequest): Observable<ServerResponse>;
