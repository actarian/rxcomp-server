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
        private hash_: string = '';
        get hash(): string { return this.hash_; }
        set hash(hash: string) { this.hash_ = hash; updateLocation_(this); }
    
        private host_: string = '';
        get host(): string { return this.host_; }
        set host(host: string) { this.host_ = host; updateLocation_(this); }
    
        private hostname_: string = '';
        get hostname(): string { return this.hostname_; }
        set hostname(hostname: string) { this.hostname_ = hostname; updateLocation_(this); }
    
        private pathname_: string = '';
        get pathname(): string { return this.pathname_; }
        set pathname(pathname: string) { this.pathname_ = pathname; updateLocation_(this); }
    
        private port_: string = '';
        get port(): string { return this.port_; }
        set port(port: string) { this.port_ = port; updateLocation_(this); }
    
        private protocol_: string = '';
        get protocol(): string { return this.protocol_; }
        set protocol(protocol: string) { this.protocol_ = protocol; updateLocation_(this); }
    
        private search_: string = '';
        get search(): string { return this.search_; }
        set search(search: string) { this.search_ = search; updateLocation_(this); }
        */
        this.hash = '';
        this.host = '';
        this.hostname = '';
        this.pathname = '';
        this.port = '';
        this.protocol = '';
        this.search = '';
        this.href_ = '';
        this.ancestorOrigins_ = new RxDOMStringList();
    }
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
                this.protocol = location_1.protocol;
                this.host = location_1.host;
                this.hostname = location_1.hostname;
                this.port = location_1.port;
                this.pathname = location_1.pathname;
                this.search = location_1.search;
                this.hash = location_1.hash;
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
