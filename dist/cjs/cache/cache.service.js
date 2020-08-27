"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheItem = exports.CacheControlType = exports.CacheMode = void 0;
var rxjs_1 = require("rxjs");
var path = require('path');
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
    CacheService.has = function (type, filename) {
        if (type === void 0) { type = 'cache'; }
        var has = false;
        switch (this.mode) {
            case CacheMode.File:
                has = this.hasFile(type, filename);
                break;
            case CacheMode.Memory:
            default:
                var key = this.getPath(type, filename);
                has = Object.keys(this.cache_).indexOf(key) !== -1;
        }
        return has;
    };
    CacheService.get = function (type, filename) {
        if (type === void 0) { type = 'cache'; }
        var value = null, cacheItem;
        var key = this.getPath(type, filename);
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
                    var data = this.cache_[key];
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
    };
    CacheService.set = function (type, filename, value, maxAge, cacheControl) {
        if (type === void 0) { type = 'cache'; }
        if (maxAge === void 0) { maxAge = 0; }
        if (cacheControl === void 0) { cacheControl = CacheControlType.Public; }
        var key = this.getPath(type, filename);
        var cacheItem = new CacheItem({ value: value, maxAge: maxAge, cacheControl: cacheControl });
        switch (this.mode) {
            case CacheMode.File:
                this.writeFile(type, filename, cacheItem);
                break;
            case CacheMode.Memory:
            default:
                var serialized = this.serialize(cacheItem);
                this.cache_[key] = serialized;
        }
        return value;
    };
    CacheService.delete = function (type, filename) {
        if (type === void 0) { type = 'cache'; }
        switch (this.mode) {
            case CacheMode.File:
                this.unlinkFile(type, filename);
                break;
            case CacheMode.Memory:
            default:
                var key = this.getPath(type, filename);
                if (Object.keys(this.cache_).indexOf(key) !== -1) {
                    delete this.cache_[key];
                }
        }
    };
    CacheService.hasFile = function (type, filename) {
        if (type === void 0) { type = 'cache'; }
        var has = false;
        var key = this.getPath(type, filename);
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
    CacheService.readFile = function (type, filename) {
        if (type === void 0) { type = 'cache'; }
        var cacheItem = null;
        var key = this.getPath(type, filename);
        try {
            var dirname = path.dirname(key);
            console.log('existsSync', dirname);
            if (!fs.existsSync(dirname)) {
                return cacheItem;
            }
            var json = fs.readFileSync(key, 'utf8');
            cacheItem = new CacheItem(JSON.parse(json));
        }
        catch (error) {
            throw error;
        }
        return cacheItem;
    };
    CacheService.writeFile = function (type, filename, cacheItem) {
        if (type === void 0) { type = 'cache'; }
        var key = this.getPath(type, filename);
        try {
            var json = this.serialize(cacheItem);
            var dirname = path.dirname(key);
            console.log('existsSync', dirname);
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname);
            }
            console.log('writeFile', key);
            fs.writeFileSync(key, json, 'utf8');
        }
        catch (error) {
            throw error;
        }
        return cacheItem;
    };
    CacheService.unlinkFile = function (type, filename) {
        if (type === void 0) { type = 'cache'; }
        var key = this.getPath(type, filename);
        try {
            if (fs.existsSync(key)) {
                fs.unlinkSync(key);
            }
        }
        catch (error) {
            throw error;
        }
    };
    CacheService.readFile$ = function (type, filename) {
        if (type === void 0) { type = 'cache'; }
        var service = this;
        return rxjs_1.Observable.create(function (observer) {
            var key = service.getPath(type, filename);
            var dirname = path.dirname(key);
            console.log('existsSync', dirname);
            if (!fs.existsSync(dirname)) {
                observer.error("ENOENT: no such file or directory");
            }
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
    CacheService.writeFile$ = function (type, filename, cacheItem) {
        if (type === void 0) { type = 'cache'; }
        var service = this;
        return rxjs_1.Observable.create(function (observer) {
            var key = service.getPath(type, filename);
            var json = service.serialize(cacheItem);
            var dirname = path.dirname(key);
            console.log('existsSync', dirname);
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname);
            }
            console.log('writeFile', key);
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
    CacheService.getPath = function (type, filename) {
        if (type === void 0) { type = 'cache'; }
        var key = this.getKey(type, filename);
        return "" + this.folder + key;
    };
    CacheService.getKey = function (type, filename) {
        if (type === void 0) { type = 'cache'; }
        var key = (type + "-" + filename).toLowerCase();
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
    CacheService.cache_ = {};
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
