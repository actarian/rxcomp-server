"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheItem = exports.CacheControlType = void 0;
var CacheControlType;
(function (CacheControlType) {
    CacheControlType["Public"] = "public";
    CacheControlType["Private"] = "private";
    CacheControlType["NoCache"] = "no-cache";
    CacheControlType["NoStore"] = "no-store";
})(CacheControlType = exports.CacheControlType || (exports.CacheControlType = {}));
var CacheItem = /** @class */ (function () {
    function CacheItem(options) {
        this.maxAge = 0;
        this.cacheControl = CacheControlType.Public;
        if (options) {
            Object.assign(this, options);
        }
    }
    Object.defineProperty(CacheItem.prototype, "expired", {
        get: function () {
            return this.cacheControl === CacheControlType.NoStore
                || this.maxAge === 0
                || (this.date.getTime() + (this.maxAge * 1000) < Date.now());
        },
        enumerable: false,
        configurable: true
    });
    CacheItem.prototype.set = function (options) {
        if (options) {
            Object.assign(this, options);
        }
        this.date = new Date();
        return this;
    };
    return CacheItem;
}());
exports.CacheItem = CacheItem;
var CacheService = /** @class */ (function () {
    function CacheService() {
    }
    CacheService.delete = function (type, name) {
        if (type === void 0) { type = 'cache'; }
        var key = type + "_" + name;
        if (this.cache_.has(key)) {
            this.cache_.delete(key);
        }
    };
    CacheService.has = function (type, name) {
        if (type === void 0) { type = 'cache'; }
        var key = type + "_" + name;
        return this.cache_.has(key);
    };
    CacheService.get = function (type, name) {
        if (type === void 0) { type = 'cache'; }
        var value = null;
        var key = type + "_" + name;
        if (this.cache_.has(key)) {
            var cacheItem = this.cache_.get(key);
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
    };
    CacheService.set = function (type, name, value, maxAge) {
        if (type === void 0) { type = 'cache'; }
        if (maxAge === void 0) { maxAge = 0; }
        var key = type + "_" + name;
        var cacheItem = new CacheItem().set({ value: JSON.stringify(value, null, 0), maxAge: maxAge });
        this.cache_.set(key, cacheItem);
        return value;
    };
    CacheService.cache_ = new Map();
    return CacheService;
}());
exports.default = CacheService;
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
