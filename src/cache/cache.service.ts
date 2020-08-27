import { Observable, Observer } from "rxjs";

const path = require('path');
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
	private static cache_: { [key: string]: string } = {};
	static mode: CacheMode = CacheMode.Memory;
	static folder: string;

	static has(type: string = 'cache', filename: string): boolean {
		let has: boolean = false;
		switch (this.mode) {
			case CacheMode.File:
				has = this.hasFile(type, filename);
				break;
			case CacheMode.Memory:
			default:
				const key: string = this.getPath(type, filename);
				has = Object.keys(this.cache_).indexOf(key) !== -1;
		}
		return has;
	}

	static get(type: string = 'cache', filename: string): any {
		let value = null, cacheItem: CacheItem | null;
		const key: string = this.getPath(type, filename);
		switch (this.mode) {
			case CacheMode.File:
				if (this.hasFile(type, filename)) {
					cacheItem = this.readFile(type, filename);
					if (cacheItem) {
						if (cacheItem.expired) {
							this.unlinkFile(type, filename);
						} else {
							value = cacheItem?.value;
						}
					}
				}
				break;
			case CacheMode.Memory:
			default:
				if (Object.keys(this.cache_).indexOf(key) !== -1) {
					const data: string | undefined = this.cache_[key];
					if (data) {
						cacheItem = new CacheItem(JSON.parse(data));
						if (cacheItem) {
							if (cacheItem.expired) {
								delete this.cache_[key];
							} else {
								value = cacheItem.value;
							}
						}
					}
				}
		}
		return value;
	}

	static set(type: string = 'cache', filename: string, value: any, maxAge: number = 0, cacheControl: CacheControlType = CacheControlType.Public): any {
		const key: string = this.getPath(type, filename);
		const cacheItem: CacheItem = new CacheItem({ value, maxAge, cacheControl });
		switch (this.mode) {
			case CacheMode.File:
				this.writeFile(type, filename, cacheItem);
				break;
			case CacheMode.Memory:
			default:
				const serialized: string = this.serialize(cacheItem);
				this.cache_[key] = serialized;
		}
		return value;
	}

	static delete(type: string = 'cache', filename: string): void {
		switch (this.mode) {
			case CacheMode.File:
				this.unlinkFile(type, filename);
				break;
			case CacheMode.Memory:
			default:
				const key: string = this.getPath(type, filename);
				if (Object.keys(this.cache_).indexOf(key) !== -1) {
					delete this.cache_[key];
				}
		}
	}

	protected static hasFile(type: string = 'cache', filename: string): boolean {
		let has: boolean = false;
		const key: string = this.getPath(type, filename);
		try {
			if (fs.existsSync(key)) {
				has = true;
			}
		} catch (error) {
			throw error;
		}
		return has;
	}

	protected static readFile(type: string = 'cache', filename: string): CacheItem | null {
		let cacheItem: CacheItem | null = null;
		const key: string = this.getPath(type, filename);
		try {
			const dirname: string = path.dirname(key);
			if (!fs.existsSync(dirname)) {
				return cacheItem;
			}
			const json: string = fs.readFileSync(key, 'utf8');
			cacheItem = new CacheItem(JSON.parse(json));
		} catch (error) {
			throw error;
		}
		return cacheItem;
	}

	protected static writeFile(type: string = 'cache', filename: string, cacheItem: CacheItem): CacheItem {
		const key: string = this.getPath(type, filename);
		try {
			const json: string = this.serialize(cacheItem);
			const dirname: string = path.dirname(key);
			if (!fs.existsSync(dirname)) {
				fs.mkdirSync(dirname);
			}
			fs.writeFileSync(key, json, 'utf8');
		} catch (error) {
			throw error;
		}
		return cacheItem;
	}

	protected static unlinkFile(type: string = 'cache', filename: string): void {
		const key: string = this.getPath(type, filename);
		try {
			if (fs.existsSync(key)) {
				fs.unlinkSync(key);
			}
		} catch (error) {
			throw error;
		}
	}

	protected static readFile$(type: string = 'cache', filename: string): Observable<CacheItem> {
		const service = this;
		return Observable.create(function (observer: Observer<CacheItem>) {
			const key: string = service.getPath(type, filename);
			const dirname: string = path.dirname(key);
			if (!fs.existsSync(dirname)) {
				observer.error(`ENOENT: no such file or directory`);
			}
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

	protected static writeFile$(type: string = 'cache', filename: string, cacheItem: CacheItem): Observable<CacheItem> {
		const service = this;
		return Observable.create(function (observer: Observer<CacheItem>) {
			const key: string = service.getPath(type, filename);
			const json: string = service.serialize(cacheItem);
			const dirname: string = path.dirname(key);
			if (!fs.existsSync(dirname)) {
				fs.mkdirSync(dirname);
			}
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

	protected static getPath(type: string = 'cache', filename: string): string {
		const key: string = this.getKey(type, filename);
		return `${this.folder}${key}`;
	}

	protected static getKey(type: string = 'cache', filename: string): string {
		let key: string = `${type}-${filename}`.toLowerCase();
		key = key.replace(/(\s+)|(\W+)/g, function (...matches) { return matches[1] ? '' : '_' });
		return key;
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
