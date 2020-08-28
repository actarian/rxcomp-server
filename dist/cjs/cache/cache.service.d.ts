import { Observable } from "rxjs";
export declare enum CacheMode {
    Memory = "memory",
    File = "file"
}
export declare enum CacheControlType {
    Public = "public",
    Private = "private",
    NoCache = "no-cache",
    NoStore = "no-store"
}
export interface ICacheItem {
    value: any;
    date?: Date;
    maxAge?: number;
    cacheControl?: CacheControlType;
}
export declare class CacheItem {
    value: any;
    date: Date;
    maxAge: number;
    cacheControl: CacheControlType;
    get expired(): boolean;
    constructor(options?: ICacheItem);
    static toData(cacheItem: CacheItem): string | undefined;
    static fromData(data: string): CacheItem;
}
export default class CacheService {
    private static cache_;
    static mode: CacheMode;
    static folder: string;
    static has(type: string | undefined, filename: string): boolean;
    static get(type: string | undefined, filename: string): any;
    static set(type: string | undefined, filename: string, value: any, maxAge?: number, cacheControl?: CacheControlType): any;
    static delete(type: string | undefined, filename: string): void;
    static has$(type: string | undefined, filename: string): Observable<boolean>;
    static get$<T>(type: string, filename: string): Observable<T>;
    static set$(type: string | undefined, filename: string, value: any, maxAge?: number, cacheControl?: CacheControlType): any;
    static delete$(type: string | undefined, filename: string): Observable<boolean>;
    protected static getPath(type: string | undefined, filename: string): string;
    protected static getKey(type: string | undefined, filename: string): string;
}
