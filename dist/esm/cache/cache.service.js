import { Observable } from "rxjs";
const path = require('path');
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
    static has(type = 'cache', filename) {
        let has = false;
        switch (this.mode) {
            case CacheMode.File:
                has = this.hasFile(type, filename);
                break;
            case CacheMode.Memory:
            default:
                const key = this.getPath(type, filename);
                has = Object.keys(this.cache_).indexOf(key) !== -1;
        }
        return has;
    }
    static get(type = 'cache', filename) {
        let value = null, cacheItem;
        const key = this.getPath(type, filename);
        switch (this.mode) {
            case CacheMode.File:
                if (this.hasFile(type, filename)) {
                    cacheItem = this.readFile(type, filename);
                    if (cacheItem) {
                        if (cacheItem.expired) {
                            this.unlinkFile(type, filename);
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
                        cacheItem = new CacheItem(JSON.parse(data));
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
        return value;
    }
    static set(type = 'cache', filename, value, maxAge = 0, cacheControl = CacheControlType.Public) {
        const key = this.getPath(type, filename);
        const cacheItem = new CacheItem({ value, maxAge, cacheControl });
        switch (this.mode) {
            case CacheMode.File:
                this.writeFile(type, filename, cacheItem);
                break;
            case CacheMode.Memory:
            default:
                const serialized = this.serialize(cacheItem);
                this.cache_[key] = serialized;
        }
        return value;
    }
    static delete(type = 'cache', filename) {
        switch (this.mode) {
            case CacheMode.File:
                this.unlinkFile(type, filename);
                break;
            case CacheMode.Memory:
            default:
                const key = this.getPath(type, filename);
                if (Object.keys(this.cache_).indexOf(key) !== -1) {
                    delete this.cache_[key];
                }
        }
    }
    static hasFile(type = 'cache', filename) {
        let has = false;
        const key = this.getPath(type, filename);
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
    static readFile(type = 'cache', filename) {
        let cacheItem = null;
        const key = this.getPath(type, filename);
        try {
            const dirname = path.dirname(key);
            if (!fs.existsSync(dirname)) {
                return cacheItem;
            }
            const json = fs.readFileSync(key, 'utf8');
            cacheItem = new CacheItem(JSON.parse(json));
        }
        catch (error) {
            throw error;
        }
        return cacheItem;
    }
    static writeFile(type = 'cache', filename, cacheItem) {
        const key = this.getPath(type, filename);
        try {
            const json = this.serialize(cacheItem);
            const dirname = path.dirname(key);
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname);
            }
            fs.writeFileSync(key, json, 'utf8');
        }
        catch (error) {
            throw error;
        }
        return cacheItem;
    }
    static unlinkFile(type = 'cache', filename) {
        const key = this.getPath(type, filename);
        try {
            if (fs.existsSync(key)) {
                fs.unlinkSync(key);
            }
        }
        catch (error) {
            throw error;
        }
    }
    static readFile$(type = 'cache', filename) {
        const service = this;
        return Observable.create(function (observer) {
            const key = service.getPath(type, filename);
            const dirname = path.dirname(key);
            if (!fs.existsSync(dirname)) {
                observer.error(`ENOENT: no such file or directory`);
            }
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
    static writeFile$(type = 'cache', filename, cacheItem) {
        const service = this;
        return Observable.create(function (observer) {
            const key = service.getPath(type, filename);
            const json = service.serialize(cacheItem);
            const dirname = path.dirname(key);
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname);
            }
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
