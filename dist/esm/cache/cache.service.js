import { decodeJson, encodeJson, Serializer } from "rxcomp";
import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import FileService from "../file/file.service";
export var CacheMode;
(function (CacheMode) {
    CacheMode["Memory"] = "memory";
    CacheMode["File"] = "file";
})(CacheMode || (CacheMode = {}));
export var CacheControlType;
(function (CacheControlType) {
    CacheControlType["Public"] = "public";
    CacheControlType["Private"] = "private";
    CacheControlType["NoCache"] = "no-cache";
    CacheControlType["NoStore"] = "no-store";
})(CacheControlType || (CacheControlType = {}));
export class CacheItem {
    constructor(options) {
        this.date = new Date();
        this.maxAge = 0;
        this.cacheControl = CacheControlType.Public;
        if (options) {
            this.value = options.value;
            this.date = options.date ? new Date(options.date) : this.date;
            this.maxAge = options.maxAge || this.maxAge;
            this.cacheControl = options.cacheControl || this.cacheControl;
        }
    }
    get expired() {
        return this.cacheControl === CacheControlType.NoStore
            || this.maxAge === 0
            || (this.date.getTime() + (this.maxAge * 1000) < Date.now());
    }
    static toData(cacheItem) {
        return Serializer.encode(cacheItem, [encodeJson]);
    }
    static fromData(data) {
        return new CacheItem(Serializer.decode(data, [decodeJson]));
    }
}
export default class CacheService {
    static has(type = 'cache', filename) {
        let has = false;
        try {
            const key = this.getPath(type, filename);
            switch (this.mode) {
                case CacheMode.File:
                    has = FileService.exists(key);
                    // has = this.hasFile(type, filename);
                    break;
                case CacheMode.Memory:
                default:
                    has = Object.keys(this.cache_).indexOf(key) !== -1;
            }
        }
        catch (error) {
            console.log('CacheService.has.error', error);
        }
        return has;
    }
    static get(type = 'cache', filename) {
        let value = null, cacheItem;
        try {
            const key = this.getPath(type, filename);
            switch (this.mode) {
                case CacheMode.File:
                    if (FileService.exists(key)) {
                        const data = FileService.readFile(key);
                        if (data) {
                            cacheItem = CacheItem.fromData(data);
                            if (cacheItem.expired) {
                                FileService.unlinkFile(key);
                            }
                            else {
                                value = cacheItem === null || cacheItem === void 0 ? void 0 : cacheItem.value;
                            }
                        }
                    }
                    break;
                case CacheMode.Memory:
                default:
                    if (Object.keys(this.cache_).indexOf(key) !== -1) {
                        const data = this.cache_[key];
                        if (data) {
                            cacheItem = CacheItem.fromData(data);
                            if (cacheItem) {
                                if (cacheItem.expired) {
                                    delete this.cache_[key];
                                }
                                else {
                                    value = cacheItem.value;
                                }
                            }
                        }
                    }
            }
        }
        catch (error) {
            console.log('CacheService.get.error', error);
        }
        return value;
    }
    static set(type = 'cache', filename, value, maxAge = 0, cacheControl = CacheControlType.Public) {
        try {
            const key = this.getPath(type, filename);
            const cacheItem = new CacheItem({ value, maxAge, cacheControl });
            let data;
            switch (this.mode) {
                case CacheMode.File:
                    data = CacheItem.toData(cacheItem);
                    if (data) {
                        FileService.writeFile(key, data);
                    }
                    break;
                case CacheMode.Memory:
                default:
                    data = CacheItem.toData(cacheItem);
                    if (data) {
                        this.cache_[key] = data;
                    }
            }
        }
        catch (error) {
            console.log('CacheService.set.error', error);
        }
        return value;
    }
    static delete(type = 'cache', filename) {
        try {
            const key = this.getPath(type, filename);
            switch (this.mode) {
                case CacheMode.File:
                    FileService.unlinkFile(key);
                    break;
                case CacheMode.Memory:
                default:
                    if (Object.keys(this.cache_).indexOf(key) !== -1) {
                        delete this.cache_[key];
                    }
            }
        }
        catch (error) {
            console.log('CacheService.delete.error', error);
        }
    }
    static has$(type = 'cache', filename) {
        const key$ = Observable.create((observer) => {
            const key = this.getPath(type, filename);
            observer.next(key);
            observer.complete();
        });
        return key$.pipe(switchMap((key) => {
            if (this.mode === CacheMode.File) {
                return FileService.exists$(key);
            }
            else {
                return of(Object.keys(this.cache_).indexOf(key) !== -1);
            }
        }));
    }
    static get$(type = 'cache', filename) {
        let key;
        const key$ = Observable.create((observer) => {
            key = this.getPath(type, filename);
            observer.next(key);
            observer.complete();
        });
        return key$.pipe(switchMap((key) => {
            if (this.mode === CacheMode.File) {
                return FileService.readFile$(key);
            }
            else {
                return of(this.cache_[key]);
            }
        }), switchMap((data) => {
            const cacheItem = data ? CacheItem.fromData(data) : null;
            if (cacheItem && cacheItem.expired) {
                return FileService.unlinkFile$(key).pipe(map(() => null));
            }
            return of(cacheItem ? cacheItem.value : null);
        }));
    }
    static set$(type = 'cache', filename, value, maxAge = 0, cacheControl = CacheControlType.Public) {
        let key, cacheItem, data;
        const data$ = Observable.create((observer) => {
            key = this.getPath(type, filename);
            cacheItem = new CacheItem({ value, maxAge, cacheControl });
            data = CacheItem.toData(cacheItem);
            observer.next(data);
            observer.complete();
        });
        return data$.pipe(switchMap((data) => {
            if (data) {
                if (this.mode === CacheMode.File) {
                    return FileService.writeFile$(key, data);
                }
                else {
                    this.cache_[key] = data;
                    return of(true);
                }
            }
            else {
                return of(false);
            }
        }));
    }
    static delete$(type = 'cache', filename) {
        let key;
        const key$ = Observable.create((observer) => {
            key = this.getPath(type, filename);
            observer.next(key);
            observer.complete();
        });
        return key$.pipe(switchMap((key) => {
            if (this.mode === CacheMode.File) {
                return FileService.unlinkFile$(key);
            }
            else if (Object.keys(this.cache_).indexOf(key) !== -1) {
                delete this.cache_[key];
                return of(true);
            }
            else {
                return of(false);
            }
        }));
    }
    static getPath(type = 'cache', filename) {
        const key = this.getKey(type, filename);
        return `${this.folder}${key}`;
    }
    static getKey(type = 'cache', filename) {
        let key = `${type}-${filename}`.toLowerCase();
        key = key.replace(/(\s+)|(\W+)/g, function (...matches) { return matches[1] ? '' : '_'; });
        return key;
    }
}
CacheService.cache_ = {};
CacheService.mode = CacheMode.Memory;
/*
Cache-Control: max-age=0, private, must-revalidate
Date: Fri, 14 Aug 2020 20:09:02 GMT
Expect-CT: max-age=2592000, report-uri="https://api.github.com/_private/browser/errors"
Status: 200 OK
Strict-Transport-Security: max-age=31536000; includeSubdomains; preload
Cache-Control: no-cache
Connection: keep-alive
Pragma: no-cache
*/
