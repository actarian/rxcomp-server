import { RxLocation } from "../location/location";

export interface IHistoryItem {
	data: any;
	title: string;
	url?: string | null;
}

export interface IHistory extends History {
	/*
	readonly length: number;
    scrollRestoration: ScrollRestoration;
    readonly state: any;
    back(): void;
    forward(): void;
    go(delta?: number): void;
    pushState(data: any, title: string, url?: string | null): void;
	replaceState(data: any, title: string, url?: string | null): void;
	*/
}

export class RxHistory implements IHistory {
	private currentIndex_: number = 0;
	private history_: IHistoryItem[] = [];
	get length(): number {
		return this.history_.length;
	}
	scrollRestoration: ScrollRestoration = 'auto';
	state: any;
	back(): void {
		if (this.currentIndex_ > 0) {
			this.currentIndex_--;
			const item: IHistoryItem = this.history_[this.currentIndex_];
			if (item.url) RxLocation.location.href = item.url;
		}
	};
	forward(): void {
		if (this.currentIndex_ < this.history_.length - 1) {
			this.currentIndex_++;
			const item: IHistoryItem = this.history_[this.currentIndex_];
			if (item.url) RxLocation.location.href = item.url;
		}
	};
	go(delta?: number): void {
		if (typeof delta === 'number') {
			const index: number = this.currentIndex_ + delta;
			if (index > 0 && index < this.history_.length) {
				const item: IHistoryItem = this.history_[index];
				if (item.url) RxLocation.location.href = item.url;
			}
		}
	};
	pushState(data: any, title: string, url?: string | null): void {
		this.history_.push({ data, title, url });
		this.currentIndex_ = this.history_.length - 1;
	};
	replaceState(data: any, title: string, url?: string | null): void {
		if (this.history_.length) {
			this.history_.splice(this.history_.length - 1, 1, { data, title, url });
		} else {
			this.history_.push({ data, title, url });
		}
		this.currentIndex_ = this.history_.length - 1;
	};
	private static history_: History;
	static get history(): IHistory {
		if (this.history_) {
			return this.history_;
		} else {
			return this.history_ = new RxHistory();
		}
	}
}
