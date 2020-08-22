"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RxHistory = void 0;
var location_1 = require("../location/location");
var RxHistory = /** @class */ (function () {
    function RxHistory() {
        this.currentIndex_ = 0;
        this.history_ = [];
        this.scrollRestoration = 'auto';
    }
    Object.defineProperty(RxHistory.prototype, "length", {
        get: function () {
            return this.history_.length;
        },
        enumerable: false,
        configurable: true
    });
    RxHistory.prototype.back = function () {
        if (this.currentIndex_ > 0) {
            this.currentIndex_--;
            var item = this.history_[this.currentIndex_];
            if (item.url)
                location_1.RxLocation.location.href = item.url;
        }
    };
    ;
    RxHistory.prototype.forward = function () {
        if (this.currentIndex_ < this.history_.length - 1) {
            this.currentIndex_++;
            var item = this.history_[this.currentIndex_];
            if (item.url)
                location_1.RxLocation.location.href = item.url;
        }
    };
    ;
    RxHistory.prototype.go = function (delta) {
        if (typeof delta === 'number') {
            var index = this.currentIndex_ + delta;
            if (index > 0 && index < this.history_.length) {
                var item = this.history_[index];
                if (item.url)
                    location_1.RxLocation.location.href = item.url;
            }
        }
    };
    ;
    RxHistory.prototype.pushState = function (data, title, url) {
        this.history_.push({ data: data, title: title, url: url });
        this.currentIndex_ = this.history_.length - 1;
    };
    ;
    RxHistory.prototype.replaceState = function (data, title, url) {
        if (this.history_.length) {
            this.history_.splice(this.history_.length - 1, 1, { data: data, title: title, url: url });
        }
        else {
            this.history_.push({ data: data, title: title, url: url });
        }
        this.currentIndex_ = this.history_.length - 1;
    };
    ;
    Object.defineProperty(RxHistory, "history", {
        get: function () {
            if (this.history_) {
                return this.history_;
            }
            else {
                return this.history_ = new RxHistory();
            }
        },
        enumerable: false,
        configurable: true
    });
    return RxHistory;
}());
exports.RxHistory = RxHistory;
