"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RxLocation = exports.RxDOMStringList = void 0;
var tslib_1 = require("tslib");
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
            var e_1, _a;
            if (this.href_ !== href) {
                this.href_ = href;
                var regExp = /^((http\:|https\:)?\/\/|\/)?([^\/\:]+)?(\:([^\/]+))?(\/[^\?]+)?(\?[^\#]+)?(\#.+)?$/g;
                var matches = href.matchAll(regExp);
                try {
                    for (var matches_1 = tslib_1.__values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
                        var match = matches_1_1.value;
                        /*
                        0 Match	0.	https://developer.mozilla.org/en-US/docs/Web/API/Location/ancestorOrigins?pippo=shuter&a=dsok#asoka
                        1 Group 1.	https://
                        2 Group 2.	https:
                        3 Group 3.	developer.mozilla.org
                        4 Group 4.	:8080
                        5 Group 5.	8080
                        6 Group 5.	/en-US/docs/Web/API/Location/ancestorOrigins
                        7 Group 6.	?pippo=shuter&a=dsok
                        8 Group 7.	#asoka
                        */
                        /*
                        this.protocol_ = match[2] || '';
                        this.host_ = this.hostname_ = match[3] || '';
                        this.port_ = match[5] || '';
                        this.pathname_ = match[6] || '';
                        this.search_ = match[7] || '';
                        this.hash_ = match[8] || '';
                        */
                        this.protocol = match[2] || '';
                        this.host = this.hostname = match[3] || '';
                        this.port = match[5] || '';
                        this.pathname = match[6] || '';
                        this.search = match[7] || '';
                        this.hash = match[8] || '';
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (matches_1_1 && !matches_1_1.done && (_a = matches_1.return)) _a.call(matches_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
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
/*
function updateLocation_(location: ILocation): void {
    location.href = location.href;
}
*/
