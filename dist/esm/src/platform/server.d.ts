import { Module, Platform } from 'rxcomp';
import { Observable } from 'rxjs';
import { RxDocument } from '../nodes/nodes';
export interface IServerRequest {
    url: string;
    template: string;
    host?: string;
    charset?: string;
}
export interface IServerResponse extends IServerRequest {
    serialize: () => string;
    body?: string;
    statusCode?: number;
    statusMessage?: string;
}
export interface IServerErrorResponse extends IServerRequest {
    error: Error;
    statusCode?: number;
    statusMessage?: string;
}
export declare class ServerResponse implements IServerResponse {
    template: string;
    url: string;
    host?: string;
    charset?: string;
    serialize: () => string;
    body: string;
    statusCode?: number;
    statusMessage?: string;
    constructor(options?: IServerResponse);
}
export declare class ServerErrorResponse implements IServerErrorResponse {
    template: string;
    url: string;
    host?: string;
    charset?: string;
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
    static bootstrap(moduleFactory?: typeof Module, template?: string): Module;
    static serialize(): string;
    protected static document: Document | RxDocument;
    protected static resolveGlobals(documentOrHtml: Document | string): Document | RxDocument;
    static bootstrap$: typeof bootstrap$;
    static render$: typeof render$;
    static template$: typeof template$;
}
export declare function bootstrap$(moduleFactory: typeof Module, request?: IServerRequest): Observable<ServerResponse>;
export declare function render$(request: IServerRequest, renderRequest$: (request?: IServerRequest) => Observable<ServerResponse>): Observable<ServerResponse>;
export declare function template$(request: IServerRequest): Observable<string>;
