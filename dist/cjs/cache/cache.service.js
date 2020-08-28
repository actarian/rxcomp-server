"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheItem = exports.CacheControlType = exports.CacheMode = void 0;
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var file_service_1 = tslib_1.__importDefault(require("../file/file.service"));
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
    CacheItem.toData = function (cacheItem) {
        return rxcomp_1.Serializer.encode(cacheItem, [rxcomp_1.encodeJson]);
    };
    CacheItem.fromData = function (data) {
        return new CacheItem(rxcomp_1.Serializer.decode(data, [rxcomp_1.decodeJson]));
    };
    return CacheItem;
}());
exports.CacheItem = CacheItem;
var CacheService = /** @class */ (function () {
    function CacheService() {
    }
    CacheService.has = function (type, filename) {
        if (type === void 0) { type = 'cache'; }
        var has = false;
        try {
            var key = this.getPath(type, filename);
            switch (this.mode) {
                case CacheMode.File:
                    has = file_service_1.default.exists(key);
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
    };
    CacheService.get = function (type, filename) {
        if (type === void 0) { type = 'cache'; }
        var value = null, cacheItem;
        try {
            var key = this.getPath(type, filename);
            switch (this.mode) {
                case CacheMode.File:
                    if (file_service_1.default.exists(key)) {
                        var data = file_service_1.default.readFile(key);
                        if (data) {
                            cacheItem = CacheItem.fromData(data);
                            if (cacheItem.expired) {
                                file_service_1.default.unlinkFile(key);
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
    };
    CacheService.set = function (type, filename, value, maxAge, cacheControl) {
        if (type === void 0) { type = 'cache'; }
        if (maxAge === void 0) { maxAge = 0; }
        if (cacheControl === void 0) { cacheControl = CacheControlType.Public; }
        try {
            var key = this.getPath(type, filename);
            var cacheItem = new CacheItem({ value: value, maxAge: maxAge, cacheControl: cacheControl });
            var data = void 0;
            switch (this.mode) {
                case CacheMode.File:
                    data = CacheItem.toData(cacheItem);
                    if (data) {
                        file_service_1.default.writeFile(key, data);
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
    };
    CacheService.delete = function (type, filename) {
        if (type === void 0) { type = 'cache'; }
        try {
            var key = this.getPath(type, filename);
            switch (this.mode) {
                case CacheMode.File:
                    file_service_1.default.unlinkFile(key);
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
    };
    CacheService.has$ = function (type, filename) {
        var _this = this;
        if (type === void 0) { type = 'cache'; }
        var key$ = rxjs_1.Observable.create(function (observer) {
            var key = _this.getPath(type, filename);
            observer.next(key);
            observer.complete();
        });
        return key$.pipe(operators_1.switchMap(function (key) {
            if (_this.mode === CacheMode.File) {
                return file_service_1.default.exists$(key);
            }
            else {
                return rxjs_1.of(Object.keys(_this.cache_).indexOf(key) !== -1);
            }
        }));
    };
    CacheService.get$ = function (type, filename) {
        var _this = this;
        if (type === void 0) { type = 'cache'; }
        var key;
        var key$ = rxjs_1.Observable.create(function (observer) {
            key = _this.getPath(type, filename);
            observer.next(key);
            observer.complete();
        });
        return key$.pipe(operators_1.switchMap(function (key) {
            if (_this.mode === CacheMode.File) {
                return file_service_1.default.readFile$(key);
            }
            else {
                return rxjs_1.of(_this.cache_[key]);
            }
        }), operators_1.switchMap(function (data) {
            var cacheItem = data ? CacheItem.fromData(data) : null;
            if (cacheItem && cacheItem.expired) {
                return file_service_1.default.unlinkFile$(key).pipe(operators_1.map(function () { return null; }));
            }
            return rxjs_1.of(cacheItem ? cacheItem.value : null);
        }));
    };
    CacheService.set$ = function (type, filename, value, maxAge, cacheControl) {
        var _this = this;
        if (type === void 0) { type = 'cache'; }
        if (maxAge === void 0) { maxAge = 0; }
        if (cacheControl === void 0) { cacheControl = CacheControlType.Public; }
        var key, cacheItem, data;
        var data$ = rxjs_1.Observable.create(function (observer) {
            key = _this.getPath(type, filename);
            cacheItem = new CacheItem({ value: value, maxAge: maxAge, cacheControl: cacheControl });
            data = CacheItem.toData(cacheItem);
            observer.next(data);
            observer.complete();
        });
        return data$.pipe(operators_1.switchMap(function (data) {
            if (data) {
                if (_this.mode === CacheMode.File) {
                    return file_service_1.default.writeFile$(key, data);
                }
                else {
                    _this.cache_[key] = data;
                    return rxjs_1.of(true);
                }
            }
            else {
                return rxjs_1.of(false);
            }
        }));
    };
    CacheService.delete$ = function (type, filename) {
        var _this = this;
        if (type === void 0) { type = 'cache'; }
        var key;
        var key$ = rxjs_1.Observable.create(function (observer) {
            key = _this.getPath(type, filename);
            observer.next(key);
            observer.complete();
        });
        return key$.pipe(operators_1.switchMap(function (key) {
            if (_this.mode === CacheMode.File) {
                return file_service_1.default.unlinkFile$(key);
            }
            else if (Object.keys(_this.cache_).indexOf(key) !== -1) {
                delete _this.cache_[key];
                return rxjs_1.of(true);
            }
            else {
                return rxjs_1.of(false);
            }
        }));
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
