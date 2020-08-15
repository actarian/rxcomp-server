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
    static has(type = 'cache', name) {
        let has = false;
        switch (this.mode) {
            case CacheMode.File:
                has = this.hasFile(type, name);
                break;
            case CacheMode.Memory:
            default:
                const key = `${type}_${name}`;
                has = this.cache_.has(key);
        }
        return has;
    }
    static get(type = 'cache', name) {
        let value = null, cacheItem;
        const key = `${type}_${name}`;
        switch (this.mode) {
            case CacheMode.File:
                if (this.hasFile(type, name)) {
                    cacheItem = this.readFile(type, name);
                    if (cacheItem) {
                        if (cacheItem.expired) {
                            this.unlinkFile(type, name);
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
    static set(type = 'cache', name, value, maxAge = 0) {
        const key = `${type}_${name}`;
        const cacheItem = new CacheItem({ value, maxAge });
        switch (this.mode) {
            case CacheMode.File:
                this.writeFile(type, name, cacheItem);
                break;
            case CacheMode.Memory:
            default:
                const serialized = this.serialize(cacheItem);
                console.log(serialized);
                this.cache_.set(key, serialized);
        }
        return value;
    }
    static delete(type = 'cache', name) {
        switch (this.mode) {
            case CacheMode.File:
                this.unlinkFile(type, name);
                break;
            case CacheMode.Memory:
            default:
                const key = `${type}_${name}`;
                if (this.cache_.has(key)) {
                    this.cache_.delete(key);
                }
        }
    }
    static getPath(type = 'cache', name) {
        const path = `_${type}_${name}`.replace(/(\/|\?|\#|\&)+/g, function (substring, group) {
            return encodeURIComponent(group);
        });
        return `${this.folder}${path}`;
    }
    static hasFile(type = 'cache', name) {
        let has = false;
        const key = this.getPath(type, name);
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
    static readFile(type = 'cache', name) {
        let cacheItem = null;
        const key = this.getPath(type, name);
        try {
            const json = fs.readFileSync(key, 'utf8');
            cacheItem = new CacheItem(JSON.parse(json));
        }
        catch (error) {
            throw error;
        }
        return cacheItem;
    }
    static writeFile(type = 'cache', name, cacheItem) {
        const key = this.getPath(type, name);
        try {
            const json = this.serialize(cacheItem);
            fs.writeFileSync(key, json, 'utf8');
        }
        catch (error) {
            throw error;
        }
        return cacheItem;
    }
    static unlinkFile(type = 'cache', name) {
        const key = this.getPath(type, name);
        try {
            if (fs.existsSync(key)) {
                fs.unlinkSync(key);
            }
        }
        catch (error) {
            throw error;
        }
    }
    static readFile$(type = 'cache', name) {
        const service = this;
        return Observable.create(function (observer) {
            const key = `${service.folder}_${type}_${name}`;
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
    static writeFile$(type = 'cache', name, cacheItem) {
        const service = this;
        return Observable.create(function (observer) {
            const key = `${service.folder}_${type}_${name}`;
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
        const cache = new Map();
        const serialized = JSON.stringify(item, (key, value) => {
            if (value && typeof value === 'object') {
                if (cache.has(value)) {
                    return;
                }
                cache.set(value, true);
            }
            return value;
        }, 0);
        cache.clear();
        return serialized;
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
