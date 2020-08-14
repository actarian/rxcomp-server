export var CacheControlType;
(function (CacheControlType) {
    CacheControlType["Public"] = "public";
    CacheControlType["Private"] = "private";
    CacheControlType["NoCache"] = "no-cache";
    CacheControlType["NoStore"] = "no-store";
})(CacheControlType || (CacheControlType = {}));
export class CacheItem {
    constructor(options) {
        this.maxAge = 0;
        this.cacheControl = CacheControlType.Public;
        if (options) {
            Object.assign(this, options);
        }
    }
    get expired() {
        return this.cacheControl === CacheControlType.NoStore
            || this.maxAge === 0
            || (this.date.getTime() + (this.maxAge * 1000) < Date.now());
    }
    set(options) {
        if (options) {
            Object.assign(this, options);
        }
        this.date = new Date();
        return this;
    }
}
export default class CacheService {
    static delete(type = 'cache', name) {
        const key = `${type}_${name}`;
        if (this.cache_.has(key)) {
            this.cache_.delete(key);
        }
    }
    static has(type = 'cache', name) {
        const key = `${type}_${name}`;
        return this.cache_.has(key);
    }
    static get(type = 'cache', name) {
        let value = null;
        const key = `${type}_${name}`;
        if (this.cache_.has(key)) {
            const cacheItem = this.cache_.get(key);
            if (cacheItem) {
                if (cacheItem.expired) {
                    this.cache_.delete(key);
                }
                else {
                    value = JSON.parse(cacheItem.value);
                }
            }
        }
        return value;
    }
    static set(type = 'cache', name, value, maxAge = 0) {
        const key = `${type}_${name}`;
        const cacheItem = new CacheItem().set({ value: JSON.stringify(value, null, 0), maxAge });
        this.cache_.set(key, cacheItem);
        return value;
    }
}
CacheService.cache_ = new Map();
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
