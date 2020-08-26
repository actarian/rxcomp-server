"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheItem = exports.CacheControlType = exports.CacheMode = void 0;
var rxjs_1 = require("rxjs");
var fs = require('fs');
var CacheMode;
(function (CacheMode) {
    CacheMode["Memory"] = "memory";
    CacheMode["File"] = "file";
})(CacheMode = exports.CacheMode || (exports.CacheMode = {}));
var CacheControlType;
(function (CacheControlType) {
    CacheControlType["Public"] = "public";
    CacheControlType["Private"] = "private";
    CacheControlType["NoCache"] = "no-cache";
    CacheControlType["NoStore"] = "no-store";
})(CacheControlType = exports.CacheControlType || (exports.CacheControlType = {}));
var CacheItem = /** @class */ (function () {
    function CacheItem(options) {
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
    Object.defineProperty(CacheItem.prototype, "expired", {
        get: function () {
            return this.cacheControl === CacheControlType.NoStore
                || this.maxAge === 0
                || (this.date.getTime() + (this.maxAge * 1000) < Date.now());
        },
        enumerable: false,
        configurable: true
    });
    return CacheItem;
}());
exports.CacheItem = CacheItem;
var CacheService = /** @class */ (function () {
    function CacheService() {
    }
    CacheService.has = function (type, path) {
        if (type === void 0) { type = 'cache'; }
        var has = false;
        switch (this.mode) {
            case CacheMode.File:
                has = this.hasFile(type, path);
                break;
            case CacheMode.Memory:
            default:
                var key = this.getPath(type, path);
                has = this.cache_.has(key);
        }
        return has;
    };
    CacheService.get = function (type, path) {
        if (type === void 0) { type = 'cache'; }
        var value = null, cacheItem;
        var key = this.getPath(type, path);
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
                    var data = this.cache_.get(key);
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
    };
    CacheService.set = function (type, path, value, maxAge, cacheControl) {
        if (type === void 0) { type = 'cache'; }
        if (maxAge === void 0) { maxAge = 0; }
        if (cacheControl === void 0) { cacheControl = CacheControlType.Public; }
        var key = this.getPath(type, path);
        var cacheItem = new CacheItem({ value: value, maxAge: maxAge, cacheControl: cacheControl });
        switch (this.mode) {
            case CacheMode.File:
                this.writeFile(type, path, cacheItem);
                break;
            case CacheMode.Memory:
            default:
                var serialized = this.serialize(cacheItem);
                this.cache_.set(key, serialized);
        }
        return value;
    };
    CacheService.delete = function (type, path) {
        if (type === void 0) { type = 'cache'; }
        switch (this.mode) {
            case CacheMode.File:
                this.unlinkFile(type, path);
                break;
            case CacheMode.Memory:
            default:
                var key = this.getPath(type, path);
                if (this.cache_.has(key)) {
                    this.cache_.delete(key);
                }
        }
    };
    CacheService.hasFile = function (type, path) {
        if (type === void 0) { type = 'cache'; }
        var has = false;
        var key = this.getPath(type, path);
        try {
            if (fs.existsSync(key)) {
                has = true;
            }
        }
        catch (error) {
            throw error;
        }
        return has;
    };
    CacheService.readFile = function (type, path) {
        if (type === void 0) { type = 'cache'; }
        var cacheItem = null;
        var key = this.getPath(type, path);
        try {
            var json = fs.readFileSync(key, 'utf8');
            cacheItem = new CacheItem(JSON.parse(json));
        }
        catch (error) {
            throw error;
        }
        return cacheItem;
    };
    CacheService.writeFile = function (type, path, cacheItem) {
        if (type === void 0) { type = 'cache'; }
        var key = this.getPath(type, path);
        try {
            var json = this.serialize(cacheItem);
            fs.writeFileSync(key, json, 'utf8');
        }
        catch (error) {
            throw error;
        }
        return cacheItem;
    };
    CacheService.unlinkFile = function (type, path) {
        if (type === void 0) { type = 'cache'; }
        var key = this.getPath(type, path);
        try {
            if (fs.existsSync(key)) {
                fs.unlinkSync(key);
            }
        }
        catch (error) {
            throw error;
        }
    };
    CacheService.readFile$ = function (type, path) {
        if (type === void 0) { type = 'cache'; }
        var service = this;
        return rxjs_1.Observable.create(function (observer) {
            var key = service.getPath(type, path);
            fs.readFile(key, 'utf8', function (error, json) {
                if (error) {
                    observer.error(error);
                }
                else {
                    var cacheItem = new CacheItem(JSON.parse(json));
                    observer.next(cacheItem);
                    observer.complete();
                }
            });
        });
    };
    CacheService.writeFile$ = function (type, path, cacheItem) {
        if (type === void 0) { type = 'cache'; }
        var service = this;
        return rxjs_1.Observable.create(function (observer) {
            var key = service.getPath(type, path);
            var json = service.serialize(cacheItem);
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
    };
    CacheService.serialize = function (item) {
        var pool = new Map();
        var serialized = JSON.stringify(item, function (key, value) {
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
    };
    CacheService.getPath = function (type, path) {
        if (type === void 0) { type = 'cache'; }
        var key = this.getKey(type, path);
        return "" + this.folder + key;
    };
    CacheService.getKey = function (type, path) {
        if (type === void 0) { type = 'cache'; }
        var key = (type + "-" + path).toLowerCase();
        key = key.replace(/(\s+)|(\W+)/g, function () {
            var matches = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                matches[_i] = arguments[_i];
            }
            return matches[1] ? '' : '_';
        });
        // console.log('key', key);
        return key;
    };
    CacheService.cache_ = new Map();
    CacheService.mode = CacheMode.Memory;
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
