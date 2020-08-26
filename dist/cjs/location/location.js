"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RxLocation = exports.RxDOMStringList = void 0;
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var RxDOMStringList = /** @class */ (function (_super) {
    tslib_1.__extends(RxDOMStringList, _super);
    function RxDOMStringList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /*
    private list_: string[] = [];
    get length(): number {
        return this.list_.length;
    }
    */
    RxDOMStringList.prototype.contains = function (string) {
        // return this.list_.indexOf(string) !== -1;
        return this.indexOf(string) !== -1;
    };
    RxDOMStringList.prototype.item = function (index) {
        // if (index > 0 && index < this.list_.length) {
        if (index > 0 && index < this.length) {
            // return this.list_[index];
            return this[index];
        }
        else {
            return null;
        }
    };
    ;
    return RxDOMStringList;
}(Array));
exports.RxDOMStringList = RxDOMStringList;
var RxLocation = /** @class */ (function () {
    function RxLocation() {
        /*
        hash: string = '';
        host: string = '';
        hostname: string = '';
        pathname: string = '';
        port: string = '';
        protocol: string = '';
        search: string = '';
        */
        this.hash_ = '';
        this.host_ = '';
        this.hostname_ = '';
        this.pathname_ = '';
        this.port_ = '';
        this.protocol_ = '';
        this.search_ = '';
        this.href_ = '';
        this.ancestorOrigins_ = new RxDOMStringList();
    }
    Object.defineProperty(RxLocation.prototype, "hash", {
        get: function () { return this.hash_; },
        set: function (hash) { this.hash_ = hash; this.href = this.href; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxLocation.prototype, "host", {
        get: function () { return this.host_; },
        set: function (host) { this.host_ = host; this.href = this.href; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxLocation.prototype, "hostname", {
        get: function () { return this.hostname_; },
        set: function (hostname) { this.hostname_ = hostname; this.href = this.href; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxLocation.prototype, "pathname", {
        get: function () { return this.pathname_; },
        set: function (pathname) { this.pathname_ = pathname; this.href = this.href; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxLocation.prototype, "port", {
        get: function () { return this.port_; },
        set: function (port) { this.port_ = port; this.href = this.href; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxLocation.prototype, "protocol", {
        get: function () { return this.protocol_; },
        set: function (protocol) { this.protocol_ = protocol; this.href = this.href; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxLocation.prototype, "search", {
        get: function () { return this.search_; },
        set: function (search) { this.search_ = search; this.href = this.href; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxLocation.prototype, "href", {
        get: function () {
            var href = this.protocol + "//" + this.host + (this.port.length ? ":" + this.port : "") + this.pathname + this.search + this.hash;
            this.href_ = href;
            return href;
        },
        set: function (href) {
            if (this.href_ !== href) {
                this.href_ = href;
                var location_1 = rxcomp_1.getLocationComponents(href);
                this.protocol_ = location_1.protocol;
                this.host_ = location_1.host;
                this.hostname_ = location_1.hostname;
                this.port_ = location_1.port;
                this.pathname_ = location_1.pathname;
                this.search_ = location_1.search;
                this.hash_ = location_1.hash;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxLocation.prototype, "origin", {
        get: function () {
            return this.protocol + "//" + this.host + (this.port.length ? ":" + this.port : "");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RxLocation.prototype, "ancestorOrigins", {
        get: function () {
            return this.ancestorOrigins_;
        },
        enumerable: false,
        configurable: true
    });
    RxLocation.prototype.assign = function (url) {
        this.href = url;
    };
    RxLocation.prototype.reload = function () { };
    RxLocation.prototype.replace = function (url) {
        this.href = url;
    };
    RxLocation.prototype.toString = function () {
        return this.href;
    };
    Object.defineProperty(RxLocation, "location", {
        get: function () {
            if (this.location_) {
                return this.location_;
            }
            else {
                return this.location_ = new RxLocation();
            }
        },
        enumerable: false,
        configurable: true
    });
    return RxLocation;
}());
exports.RxLocation = RxLocation;
