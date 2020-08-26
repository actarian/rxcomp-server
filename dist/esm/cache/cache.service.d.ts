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
}
export default class CacheService {
    private static cache_;
    static mode: CacheMode;
    static folder: string;
    static has(type: string | undefined, path: string): boolean;
    static get(type: string | undefined, path: string): any;
    static set(type: string | undefined, path: string, value: any, maxAge?: number, cacheControl?: CacheControlType): any;
    static delete(type: string | undefined, path: string): void;
    protected static hasFile(type: string | undefined, path: string): boolean;
    protected static readFile(type: string | undefined, path: string): CacheItem | null;
    protected static writeFile(type: string | undefined, path: string, cacheItem: CacheItem): CacheItem;
    protected static unlinkFile(type: string | undefined, path: string): void;
    protected static readFile$(type: string | undefined, path: string): Observable<CacheItem>;
    protected static writeFile$(type: string | undefined, path: string, cacheItem: CacheItem): Observable<CacheItem>;
    protected static serialize(item: any): string;
    protected static getPath(type: string | undefined, path: string): string;
    protected static getKey(type: string | undefined, path: string): string;
}
