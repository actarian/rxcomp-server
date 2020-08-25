import { Observable, Observer } from "rxjs";

const fs = require('fs');

export enum CacheMode {
	Memory = 'memory',
	File = 'file',
}

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
	date: Date = new Date();
	maxAge: number = 0;
	cacheControl: CacheControlType = CacheControlType.Public;
	get expired(): boolean {
		return this.cacheControl === CacheControlType.NoStore
			|| this.maxAge === 0
			|| (this.date.getTime() + (this.maxAge * 1000) < Date.now());
	}
	constructor(options?: ICacheItem) {
		if (options) {
			this.value = options.value;
			this.date = options.date ? new Date(options.date) : this.date;
			this.maxAge = options.maxAge || this.maxAge;
			this.cacheControl = options.cacheControl || this.cacheControl;
		}
	}
}

export default class CacheService {

	private static cache_: Map<string, string> = new Map<string, string>();
	static mode: CacheMode = CacheMode.Memory;
	static folder: string;

	static has(type: string = 'cache', name: string): boolean {
		let has: boolean = false;
		switch (this.mode) {
			case CacheMode.File:
				has = this.hasFile(type, name);
				break;
			case CacheMode.Memory:
			default:
				const key: string = `${type}_${name}`;
				has = this.cache_.has(key);
		}
		return has;
	}

	static get(type: string = 'cache', name: string): any {
		let value = null, cacheItem: CacheItem | null;
		const key: string = `${type}_${name}`;
		switch (this.mode) {
			case CacheMode.File:
				if (this.hasFile(type, name)) {
					cacheItem = this.readFile(type, name);
					if (cacheItem) {
						if (cacheItem.expired) {
							this.unlinkFile(type, name);
						} else {
							value = cacheItem?.value;
						}
					}
				}
				break;
			case CacheMode.Memory:
			default:
				if (this.cache_.has(key)) {
					const data: string | undefined = this.cache_.get(key);
					if (data) {
						cacheItem = new CacheItem(JSON.parse(data));
						if (cacheItem) {
							if (cacheItem.expired) {
								this.cache_.delete(key);
							} else {
								value = cacheItem.value;
							}
						}
					}
				}
		}
		return value;
	}

	static set(type: string = 'cache', name: string, value: any, maxAge: number = 0): any {
		const key: string = `${type}_${name}`;
		const cacheItem: CacheItem = new CacheItem({ value, maxAge });
		switch (this.mode) {
			case CacheMode.File:
				this.writeFile(type, name, cacheItem);
				break;
			case CacheMode.Memory:
			default:
				const serialized: string = this.serialize(cacheItem);
				console.log(serialized);
				this.cache_.set(key, serialized);
		}
		return value;
	}

	static delete(type: string = 'cache', name: string): void {
		switch (this.mode) {
			case CacheMode.File:
				this.unlinkFile(type, name);
				break;
			case CacheMode.Memory:
			default:
				const key: string = `${type}_${name}`;
				if (this.cache_.has(key)) {
					this.cache_.delete(key);
				}
		}
	}

	protected static getPath(type: string = 'cache', name: string): string {
		const regExp: RegExp = /(\/|\\|\:|\?|\#|\&)+/g;
		let path: string = `_${type}_${name}`;
		// console.log('path', path);
		path = path.replace(regExp, function (substring: string, group: string) {
			return encodeURIComponent(group);
		});
		return `${this.folder}${path}`;
	}

	protected static hasFile(type: string = 'cache', name: string): boolean {
		let has: boolean = false;
		const key: string = this.getPath(type, name);
		try {
			if (fs.existsSync(key)) {
				has = true;
			}
		} catch (error) {
			throw error;
		}
		return has;
	}

	protected static readFile(type: string = 'cache', name: string): CacheItem | null {
		let cacheItem: CacheItem | null = null;
		const key: string = this.getPath(type, name);
		try {
			const json: string = fs.readFileSync(key, 'utf8');
			cacheItem = new CacheItem(JSON.parse(json));
		} catch (error) {
			throw error;
		}
		return cacheItem;
	}

	protected static writeFile(type: string = 'cache', name: string, cacheItem: CacheItem): CacheItem {
		const key: string = this.getPath(type, name);
		try {
			const json: string = this.serialize(cacheItem);
			fs.writeFileSync(key, json, 'utf8');
		} catch (error) {
			throw error;
		}
		return cacheItem;
	}

	protected static unlinkFile(type: string = 'cache', name: string): void {
		const key: string = this.getPath(type, name);
		try {
			if (fs.existsSync(key)) {
				fs.unlinkSync(key);
			}
		} catch (error) {
			throw error;
		}
	}

	protected static readFile$(type: string = 'cache', name: string): Observable<CacheItem> {
		const service = this;
		return Observable.create(function (observer: Observer<CacheItem>) {
			const key: string = `${service.folder}_${type}_${name}`;
			fs.readFile(key, 'utf8', function (error: NodeJS.ErrnoException, json: string) {
				if (error) {
					observer.error(error);
				} else {
					const cacheItem: CacheItem = new CacheItem(JSON.parse(json));
					observer.next(cacheItem);
					observer.complete();
				}
			});
		});
	}

	protected static writeFile$(type: string = 'cache', name: string, cacheItem: CacheItem): Observable<CacheItem> {
		const service = this;
		return Observable.create(function (observer: Observer<CacheItem>) {
			const key: string = `${service.folder}_${type}_${name}`;
			const json: string = service.serialize(cacheItem);
			fs.writeFile(key, json, 'utf8', function (error: NodeJS.ErrnoException) {
				if (error) {
					observer.error(error);
				} else {
					observer.next(cacheItem);
					observer.complete();
				}
			});
		});
	}

	protected static serialize(item: any): string {
		const pool: Map<any, boolean> = new Map<any, boolean>();
		const serialized: string = JSON.stringify(item, (key: string, value: any) => {
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
