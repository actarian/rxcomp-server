import { decodeJson, encodeJson, Serializer } from "rxcomp";
import { Observable, Observer, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import FileService from "../file/file.service";

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
	static toData(cacheItem: CacheItem): string | undefined {
		return Serializer.encode(cacheItem, [encodeJson]);
	}
	static fromData(data: string): CacheItem {
		return new CacheItem(Serializer.decode<ICacheItem>(data, [decodeJson]));
	}
}

export default class CacheService {
	private static cache_: { [key: string]: string } = {};
	static mode: CacheMode = CacheMode.Memory;
	static folder: string;

	static has(type: string = 'cache', filename: string): boolean {
		let has: boolean = false;
		try {
			const key: string = this.getPath(type, filename);
			switch (this.mode) {
				case CacheMode.File:
					has = FileService.exists(key);
					// has = this.hasFile(type, filename);
					break;
				case CacheMode.Memory:
				default:
					has = Object.keys(this.cache_).indexOf(key) !== -1;
			}
		} catch (error) {
			console.log('CacheService.has.error', error);
		}
		return has;
	}

	static get<T>(type: string, filename: string): T;
	static get(type: string = 'cache', filename: string): any {
		let value = null, cacheItem: CacheItem | null;
		try {
			const key: string = this.getPath(type, filename);
			switch (this.mode) {
				case CacheMode.File:
					if (FileService.exists(key)) {
						const data: string | null = FileService.readFile(key);
						if (data) {
							cacheItem = CacheItem.fromData(data);
							if (cacheItem.expired) {
								FileService.unlinkFile(key);
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
							cacheItem = CacheItem.fromData(data);
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
		} catch (error) {
			console.log('CacheService.get.error', error);
		}
		return value;
	}

	static set(type: string = 'cache', filename: string, value: any, maxAge: number = 0, cacheControl: CacheControlType = CacheControlType.Public): any {
		try {
			const key: string = this.getPath(type, filename);
			const cacheItem: CacheItem = new CacheItem({ value, maxAge, cacheControl });
			let data: string | undefined;
			switch (this.mode) {
				case CacheMode.File:
					data = CacheItem.toData(cacheItem);
					if (data) {
						FileService.writeFile(key, data);
					}
					break;
				case CacheMode.Memory:
				default:
					data = CacheItem.toData(cacheItem);
					if (data) {
						this.cache_[key] = data;
					}
			}
		} catch (error) {
			console.log('CacheService.set.error', error);
		}
		return value;
	}

	static delete(type: string = 'cache', filename: string): void {
		try {
			const key: string = this.getPath(type, filename);
			switch (this.mode) {
				case CacheMode.File:
					FileService.unlinkFile(key);
					break;
				case CacheMode.Memory:
				default:
					if (Object.keys(this.cache_).indexOf(key) !== -1) {
						delete this.cache_[key];
					}
			}
		} catch (error) {
			console.log('CacheService.delete.error', error);
		}
	}

	static has$(type: string = 'cache', filename: string): Observable<boolean> {
		const key$: Observable<string> = Observable.create((observer: Observer<string>) => {
			const key: string = this.getPath(type, filename);
			observer.next(key);
			observer.complete();
		});
		return key$.pipe(
			switchMap((key: string) => {
				if (this.mode === CacheMode.File) {
					return FileService.exists$(key);
				} else {
					return of(Object.keys(this.cache_).indexOf(key) !== -1);
				}
			})
		);
	}

	static get$<T>(type: string, filename: string): Observable<T>;
	static get$(type: string = 'cache', filename: string): Observable<any> {
		let key: string;
		const key$: Observable<string> = Observable.create((observer: Observer<string>) => {
			key = this.getPath(type, filename);
			observer.next(key);
			observer.complete();
		});
		return key$.pipe(
			switchMap((key: string) => {
				if (this.mode === CacheMode.File) {
					return FileService.readFile$(key);
				} else {
					return of(this.cache_[key]);
				}
			}),
			switchMap((data: string | undefined | null) => {
				const cacheItem: CacheItem | null = data ? CacheItem.fromData(data) : null;
				if (cacheItem && cacheItem.expired) {
					return FileService.unlinkFile$(key).pipe(map(() => null));
				}
				return of(cacheItem ? cacheItem.value : null);
			}),
		);
	}

	static set$(type: string = 'cache', filename: string, value: any, maxAge: number = 0, cacheControl: CacheControlType = CacheControlType.Public): any {
		let key: string, cacheItem: CacheItem, data: string | undefined;
		const data$: Observable<string> = Observable.create((observer: Observer<string | undefined>) => {
			key = this.getPath(type, filename);
			cacheItem = new CacheItem({ value, maxAge, cacheControl });
			data = CacheItem.toData(cacheItem);
			observer.next(data);
			observer.complete();
		});
		return data$.pipe(
			switchMap((data: string | undefined) => {
				if (data) {
					if (this.mode === CacheMode.File) {
						return FileService.writeFile$(key, data);
					} else {
						this.cache_[key] = data;
						return of(true);
					}
				} else {
					return of(false);
				}
			}),
		);
	}

	static delete$(type: string = 'cache', filename: string): Observable<boolean> {
		let key: string;
		const key$: Observable<string> = Observable.create((observer: Observer<string>) => {
			key = this.getPath(type, filename);
			observer.next(key);
			observer.complete();
		});
		return key$.pipe(
			switchMap((key: string) => {
				if (this.mode === CacheMode.File) {
					return FileService.unlinkFile$(key);
				} else if (Object.keys(this.cache_).indexOf(key) !== -1) {
					delete this.cache_[key];
					return of(true);
				} else {
					return of(false);
				}
			}),
		);
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
