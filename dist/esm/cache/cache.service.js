import { Observable } from "rxjs";
const fs = require('fs');
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
}
export default class CacheService {
    static has(type = 'cache', path) {
        let has = false;
        switch (this.mode) {
            case CacheMode.File:
                has = this.hasFile(type, path);
                break;
            case CacheMode.Memory:
            default:
                const key = this.getPath(type, path);
                has = this.cache_.has(key);
        }
        return has;
    }
    static get(type = 'cache', path) {
        let value = null, cacheItem;
        const key = this.getPath(type, path);
        switch (this.mode) {
            case CacheMode.File:
                if (this.hasFile(type, path)) {
                    cacheItem = this.readFile(type, path);
                    if (cacheItem) {
                        if (cacheItem.expired) {
                            this.unlinkFile(type, path);
                        }
                        else {
                            value = cacheItem === null || cacheItem === void 0 ? void 0 : cacheItem.value;
                        }
                    }
                }
                break;
            case CacheMode.Memory:
            default:
                if (this.cache_.has(key)) {
                    const data = this.cache_.get(key);
                    if (data) {
                        cacheItem = new CacheItem(JSON.parse(data));
                        if (cacheItem) {
                            if (cacheItem.expired) {
                                this.cache_.delete(key);
                            }
                            else {
                                value = cacheItem.value;
                            }
                        }
                    }
                }
        }
        return value;
    }
    static set(type = 'cache', path, value, maxAge = 0, cacheControl = CacheControlType.Public) {
        const key = this.getPath(type, path);
        const cacheItem = new CacheItem({ value, maxAge, cacheControl });
        switch (this.mode) {
            case CacheMode.File:
                this.writeFile(type, path, cacheItem);
                break;
            case CacheMode.Memory:
            default:
                const serialized = this.serialize(cacheItem);
                this.cache_.set(key, serialized);
        }
        return value;
    }
    static delete(type = 'cache', path) {
        switch (this.mode) {
            case CacheMode.File:
                this.unlinkFile(type, path);
                break;
            case CacheMode.Memory:
            default:
                const key = this.getPath(type, path);
                if (this.cache_.has(key)) {
                    this.cache_.delete(key);
                }
        }
    }
    static hasFile(type = 'cache', path) {
        let has = false;
        const key = this.getPath(type, path);
        try {
            if (fs.existsSync(key)) {
                has = true;
            }
        }
        catch (error) {
            throw error;
        }
        return has;
    }
    static readFile(type = 'cache', path) {
        let cacheItem = null;
        const key = this.getPath(type, path);
        try {
            const json = fs.readFileSync(key, 'utf8');
            cacheItem = new CacheItem(JSON.parse(json));
        }
        catch (error) {
            throw error;
        }
        return cacheItem;
    }
    static writeFile(type = 'cache', path, cacheItem) {
        const key = this.getPath(type, path);
        try {
            const json = this.serialize(cacheItem);
            fs.writeFileSync(key, json, 'utf8');
        }
        catch (error) {
            throw error;
        }
        return cacheItem;
    }
    static unlinkFile(type = 'cache', path) {
        const key = this.getPath(type, path);
        try {
            if (fs.existsSync(key)) {
                fs.unlinkSync(key);
            }
        }
        catch (error) {
            throw error;
        }
    }
    static readFile$(type = 'cache', path) {
        const service = this;
        return Observable.create(function (observer) {
            const key = service.getPath(type, path);
            fs.readFile(key, 'utf8', function (error, json) {
                if (error) {
                    observer.error(error);
                }
                else {
                    const cacheItem = new CacheItem(JSON.parse(json));
                    observer.next(cacheItem);
                    observer.complete();
                }
            });
        });
    }
    static writeFile$(type = 'cache', path, cacheItem) {
        const service = this;
        return Observable.create(function (observer) {
            const key = service.getPath(type, path);
            const json = service.serialize(cacheItem);
            fs.writeFile(key, json, 'utf8', function (error) {
                if (error) {
                    observer.error(error);
                }
                else {
                    observer.next(cacheItem);
                    observer.complete();
                }
            });
        });
    }
    static serialize(item) {
        const pool = new Map();
        const serialized = JSON.stringify(item, (key, value) => {
            if (value && typeof value === 'object') {
                if (pool.has(value)) {
                    return;
                }
                pool.set(value, true);
            }
            return value;
        }, 0);
        pool.clear();
        return serialized;
    }
    static getPath(type = 'cache', path) {
        const key = this.getKey(type, path);
        return `${this.folder}${key}`;
    }
    static getKey(type = 'cache', path) {
        let key = `${type}-${path}`.toLowerCase();
        key = key.replace(/(\s+)|(\W+)/g, function (...matches) { return matches[1] ? '' : '_'; });
        // console.log('key', key);
        return key;
    }
}
CacheService.cache_ = new Map();
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
