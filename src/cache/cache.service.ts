export enum CacheControlType {
	Public = 'public', // The response may be stored by any cache, even if the response is normally non-cacheable.
	Private = 'private', // The response may be stored only by a browser's cache, even if the response is normally non-cacheable. If you mean to not store the response in any cache, use no-store instead. This directive is not effective in preventing caches from storing your response.
	NoCache = 'no-cache', // The response may be stored by any cache, even if the response is normally non-cacheable. However, the stored response MUST always go through validation with the origin server first before using it, therefore, you cannot use no-cache in-conjunction with immutable. If you mean to not store the response in any cache, use no-store instead. This directive is not effective in preventing caches from storing your response.
	NoStore = 'no-store', // The response may not be stored in any cache. Although other directives may be set, this alone is the only directive you need in preventing cached responses on modern browsers. max-age=0 is already implied. Setting must-revalidate does not make sense because in order to go through revalidation you need the response to be stored in a cache, which no-store prevents.
}

export interface ICacheItem {
	value: any;
	date?: Date,
	maxAge?: number;
	cacheControl?: CacheControlType;
}

export class CacheItem {
	value: any;
	date!: Date;
	maxAge: number = 0;
	cacheControl: CacheControlType = CacheControlType.Public;
	get expired(): boolean {
		return this.cacheControl === CacheControlType.NoStore
			|| this.maxAge === 0
			|| (this.date.getTime() + (this.maxAge * 1000) < Date.now());
	}
	constructor(options?: ICacheItem) {
		if (options) {
			Object.assign(this, options);
		}
	}
	set(options?: ICacheItem): CacheItem {
		if (options) {
			Object.assign(this, options);
		}
		this.date = new Date();
		return this;
	}
}

export default class CacheService {

	private static cache_: Map<string, CacheItem> = new Map<string, CacheItem>();

	static delete(type: string = 'cache', name: string): void {
		const key: string = `${type}_${name}`;
		if (this.cache_.has(key)) {
			this.cache_.delete(key);
		}
	}

	static has(type: string = 'cache', name: string): boolean {
		const key: string = `${type}_${name}`;
		return this.cache_.has(key);
	}

	static get(type: string = 'cache', name: string): any {
		let value = null;
		const key: string = `${type}_${name}`;
		if (this.cache_.has(key)) {
			const cacheItem: CacheItem = this.cache_.get(key) as CacheItem;
			if (cacheItem) {
				if (cacheItem.expired) {
					this.cache_.delete(key);
				} else {
					value = JSON.parse(cacheItem.value);
				}
			}
		}
		return value;
	}

	static set(type: string = 'cache', name: string, value: any, maxAge: number = 0): any {
		const key: string = `${type}_${name}`;
		const cacheItem: CacheItem = new CacheItem().set({ value: JSON.stringify(value, null, 0), maxAge });
		this.cache_.set(key, cacheItem);
		return value;
	}

}

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
