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
    static has(type: string | undefined, name: string): boolean;
    static get(type: string | undefined, name: string): any;
    static set(type: string | undefined, name: string, value: any, maxAge?: number): any;
    static delete(type: string | undefined, name: string): void;
    protected static getPath(type: string | undefined, name: string): string;
    protected static hasFile(type: string | undefined, name: string): boolean;
    protected static readFile(type: string | undefined, name: string): CacheItem | null;
    protected static writeFile(type: string | undefined, name: string, cacheItem: CacheItem): CacheItem;
    protected static unlinkFile(type: string | undefined, name: string): void;
    protected static readFile$(type: string | undefined, name: string): Observable<CacheItem>;
    protected static writeFile$(type: string | undefined, name: string, cacheItem: CacheItem): Observable<CacheItem>;
    protected static serialize(item: any): string;
}
