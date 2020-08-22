import { RxLocation } from "../location/location";
export class RxHistory {
    constructor() {
        this.currentIndex_ = 0;
        this.history_ = [];
        this.scrollRestoration = 'auto';
    }
    get length() {
        return this.history_.length;
    }
    back() {
        if (this.currentIndex_ > 0) {
            this.currentIndex_--;
            const item = this.history_[this.currentIndex_];
            if (item.url)
                RxLocation.location.href = item.url;
        }
    }
    ;
    forward() {
        if (this.currentIndex_ < this.history_.length - 1) {
            this.currentIndex_++;
            const item = this.history_[this.currentIndex_];
            if (item.url)
                RxLocation.location.href = item.url;
        }
    }
    ;
    go(delta) {
        if (typeof delta === 'number') {
            const index = this.currentIndex_ + delta;
            if (index > 0 && index < this.history_.length) {
                const item = this.history_[index];
                if (item.url)
                    RxLocation.location.href = item.url;
            }
        }
    }
    ;
    pushState(data, title, url) {
        this.history_.push({ data, title, url });
        this.currentIndex_ = this.history_.length - 1;
    }
    ;
    replaceState(data, title, url) {
        if (this.history_.length) {
            this.history_.splice(this.history_.length - 1, 1, { data, title, url });
        }
        else {
            this.history_.push({ data, title, url });
        }
        this.currentIndex_ = this.history_.length - 1;
    }
    ;
    static get history() {
        if (this.history_) {
            return this.history_;
        }
        else {
            return this.history_ = new RxHistory();
        }
    }
}
