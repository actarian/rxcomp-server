
export type IHttpHeaders = string | { [name: string]: string | string[] };

export class HttpHeaders implements Headers {
	private headers_: Map<string, string[]> = new Map<string, string[]>();

	constructor(options?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined) {
		const headers = this.headers_;
		if (options instanceof HttpHeaders) {
			options.headers_.forEach((value, key) => {
				headers.set(key, value);
			});
		} else if (typeof (options as Headers)?.forEach === 'function') {
			(options as Headers).forEach((value, key) => {
				headers.set(key, value.split(', '));
			});
		} else if (typeof options === 'object') {
			Object.keys(options).forEach(key => {
				let values: string | string[] = (options as any)[key];
				if (typeof values === 'string') {
					values = [values];
				}
				if (headers.has(key)) {
					values.forEach(value => this.append(key, value));
				} else {
					headers.set(key, values);
				}
			});
		} else if (typeof options === 'string') {
			options.split('\n').forEach(line => {
				const index = line.indexOf(':');
				if (index > 0) {
					const key = line.slice(0, index);;
					const value = line.slice(index + 1).trim();
					if (headers.has(key)) {
						this.append(key, value);
					} else {
						headers.set(key, [value]);
					}
				}
			});
		}
		if (!headers.has('Accept')) {
			headers.set('Accept', ['application/json', 'text/plain', '*/*']);
		}
		if (!headers.has('Content-Type')) {
			headers.set('Content-Type', ['application/json']);
		}
	}

	has(key: string): boolean {
		return this.headers_.has(key);
	}

	get(key: string): string | null {
		const values = this.headers_.get(key);
		return values ? values.join(', ') : null;
	}

	set(key: string, value: string): HttpHeaders {
		const clone = this.clone_();
		clone.headers_.set(key, value.split(', '));
		return clone;
	}

	append(key: string, value: string): HttpHeaders {
		const clone = this.clone_();
		const values: string[] = clone.headers_.has(key) ? clone.headers_.get(key) || [] : [];
		values.push(value);
		clone.headers_.set(key, values);
		return clone;
	}

	delete(key: string): HttpHeaders {
		const clone = this.clone_();
		clone.headers_.delete(key);
		return clone;
	}

	forEach(callback: (value: string, key: string, parent: Headers) => void, thisArg?: any): void {
		this.headers_.forEach((v, k) => {
			callback(v.join(', '), k, this);
		});
	}

	serialize(): Headers | string[][] | Record<string, string> | undefined {
		const headers: string[][] = [];
		this.forEach((value, key) => {
			headers.push([key, value]);
		});
		return headers;
	}

	private clone_(): HttpHeaders {
		const clone = new HttpHeaders();
		this.headers_.forEach((value, key) => {
			clone.headers_.set(key, value);
		});
		return clone;
	}

}

/*
export class HttpHeaders implements Headers {

	private headers: Map<string, string[]> = new Map<string, string[]>();;
	private normalizedNames: Map<string, string> = new Map();

	constructor(headers?: IHttpHeaders) {
		if (typeof headers === 'string') {
			headers.split('\n').forEach(line => {
				const index = line.indexOf(':');
				if (index > 0) {
					const name = line.slice(0, index);
					const key = name.toLowerCase();
					const value = line.slice(index + 1).trim();
					if (!this.normalizedNames.has(key)) {
						this.normalizedNames.set(key, name);
					}
					if (this.headers.has(key)) {
						this.headers.get(key)!.push(value);
					} else {
						this.headers.set(key, [value]);
					}
				}
			});
		} else if (typeof headers === 'object') {
			Object.keys(headers).forEach(name => {
				let values: string | string[] = headers[name];
				const key = name.toLowerCase();
				if (typeof values === 'string') {
					values = [values];
				}
				if (values.length > 0) {
					this.headers.set(key, values);
					if (!this.normalizedNames.has(key)) {
						this.normalizedNames.set(key, name);
					}
				}
			});
		}
	}

	append(name: string, value: string): void {
		this.applyUpdate({ name, value, operation: 'append' });
	}

	delete(name: string): void {
		this.applyUpdate({ name, operation: 'delete' });
	}

	get(name: string): string | null {
		const values = this.headers.get(name.toLowerCase());
		return values && values.length > 0 ? values[0] : null;
	}

	has(name: string): boolean {
		// this.init();
		return this.headers.has(name.toLowerCase());
	}

	set(name: string, value: string | string[]): void {
		this.applyUpdate({ name, value, operation: 'set' });
	}

	// forEach(callback: (name: string, values: string[]) => void):void {
	// 	this.init();
	//	Array.from(this.normalizedNames.keys()).forEach(key => callback(this.normalizedNames.get(key)!, this.headers.get(key)!));
	// }

	forEach(callback: (value: string, key: string, parent: Headers) => void, thisArg?: any): void {
		Array.from(this.normalizedNames.keys()).forEach(key => {
			const value = this.headers.get(key)!;
			callback((Array.isArray(value) ? value.join(',') : value), this.normalizedNames.get(key)!, this);
		});
	}

	serialize(): Headers | string[][] | Record<string, string> | undefined {
		const headers: string[][] = [];
		Object.keys(this.headers.keys()).forEach(key => {
			const value = this.headers.get(key);
			if (value) {
				headers.push([key, ...value]);
			}
		});
		return headers;
	}

	private clone(update: any): HttpHeaders {
		const headers: IHttpHeaders = {};
		Object.keys(this.headers.keys()).forEach(key => {
			const value = this.headers.get(key);
			if (value) {
				headers[key] = value;
			}
		});
		this.applyUpdate(update);
		return new HttpHeaders(headers);
	}

	private applyUpdate(update: any): void {
		const key = update.name.toLowerCase();
		switch (update.operation) {
			case 'appen':
			case 'set':
				let value = update.value!;
				if (typeof value === 'string') {
					value = [value];
				}
				if (value.length === 0) {
					return;
				}
				if (!this.normalizedNames.has(key)) {
					this.normalizedNames.set(key, update.name);
				}
				const base = (update.op === 'append' ? this.headers.get(key) : undefined) || [];
				base.push(...value);
				this.headers.set(key, base);
				break;
			case 'delete':
				const toDelete = update.value as string | undefined;
				if (!toDelete) {
					this.headers.delete(key);
					this.normalizedNames.delete(key);
				} else {
					let existing = this.headers.get(key);
					if (!existing) {
						return;
					}
					existing = existing.filter(value => toDelete.indexOf(value) === -1);
					if (existing.length === 0) {
						this.headers.delete(key);
						this.normalizedNames.delete(key);
					} else {
						this.headers.set(key, existing);
					}
				}
				break;
		}
	}

}
*/

/*
export class HttpHeaders {

	private headers!: Map<string, string[]>;
	private normalizedNames: Map<string, string> = new Map();
	private lazyInit!: HttpHeaders | Function | null;
	private lazyUpdate: Update[] | null = null;

	constructor(headers?: string | { [name: string]: string | string[] }) {
		if (!headers) {
			this.headers = new Map<string, string[]>();
		} else if (typeof headers === 'string') {
			this.lazyInit = () => {
				this.headers = new Map<string, string[]>();
				headers.split('\n').forEach(line => {
					const index = line.indexOf(':');
					if (index > 0) {
						const name = line.slice(0, index);
						const key = name.toLowerCase();
						const value = line.slice(index + 1).trim();
						this.maybeSetNormalizedName(name, key);
						if (this.headers.has(key)) {
							this.headers.get(key)!.push(value);
						} else {
							this.headers.set(key, [value]);
						}
					}
				});
			};
		} else {
			this.lazyInit = () => {
				this.headers = new Map<string, string[]>();
				Object.keys(headers).forEach(name => {
					let values: string | string[] = headers[name];
					const key = name.toLowerCase();
					if (typeof values === 'string') {
						values = [values];
					}
					if (values.length > 0) {
						this.headers.set(key, values);
						this.maybeSetNormalizedName(name, key);
					}
				});
			};
		}
	}

	has(name: string): boolean {
		this.init();
		return this.headers.has(name.toLowerCase());
	}

	get(name: string): string | null {
		this.init();
		const values = this.headers.get(name.toLowerCase());
		return values && values.length > 0 ? values[0] : null;
	}

	keys(): string[] {
		this.init();
		return Array.from(this.normalizedNames.values());
	}

	getAll(name: string): string[] | null {
		this.init();
		return this.headers.get(name.toLowerCase()) || null;
	}

	append(name: string, value: string | string[]): HttpHeaders {
		return this.clone({ name, value, operation: 'a' });
	}

	set(name: string, value: string | string[]): HttpHeaders {
		return this.clone({ name, value, operation: 's' });
	}

	delete(name: string, value?: string | string[]): HttpHeaders {
		return this.clone({ name, value, operation: 'd' });
	}

	private maybeSetNormalizedName(name: string, key: string): void {
		if (!this.normalizedNames.has(key)) {
			this.normalizedNames.set(key, name);
		}
	}

	private init(): void {
		if (!!this.lazyInit) {
			if (this.lazyInit instanceof HttpHeaders) {
				this.copyFrom(this.lazyInit);
			} else {
				this.lazyInit();
			}
			this.lazyInit = null;
			if (!!this.lazyUpdate) {
				this.lazyUpdate.forEach(update => this.applyUpdate(update));
				this.lazyUpdate = null;
			}
		}
	}

	private copyFrom(other: HttpHeaders) {
		other.init();
		Array.from(other.headers.keys()).forEach(key => {
			this.headers.set(key, other.headers.get(key)!);
			this.normalizedNames.set(key, other.normalizedNames.get(key)!);
		});
	}

	private clone(update: Update): HttpHeaders {
		const clone = new HttpHeaders();
		clone.lazyInit =
			(!!this.lazyInit && this.lazyInit instanceof HttpHeaders) ? this.lazyInit : this;
		clone.lazyUpdate = (this.lazyUpdate || []).concat([update]);
		return clone;
	}

	private applyUpdate(update: Update): void {
		const key = update.name.toLowerCase();
		switch (update.operation) {
			case 'a':
			case 's':
				let value = update.value!;
				if (typeof value === 'string') {
					value = [value];
				}
				if (value.length === 0) {
					return;
				}
				this.maybeSetNormalizedName(update.name, key);
				const base = (update.op === 'a' ? this.headers.get(key) : undefined) || [];
				base.push(...value);
				this.headers.set(key, base);
				break;
			case 'd':
				const toDelete = update.value as string | undefined;
				if (!toDelete) {
					this.headers.delete(key);
					this.normalizedNames.delete(key);
				} else {
					let existing = this.headers.get(key);
					if (!existing) {
						return;
					}
					existing = existing.filter(value => toDelete.indexOf(value) === -1);
					if (existing.length === 0) {
						this.headers.delete(key);
						this.normalizedNames.delete(key);
					} else {
						this.headers.set(key, existing);
					}
				}
				break;
		}
	}

	forEach(fn: (name: string, values: string[]) => void) {
		this.init();
		Array.from(this.normalizedNames.keys()).forEach(key => fn(this.normalizedNames.get(key)!, this.headers.get(key)!));
	}

}
*/
