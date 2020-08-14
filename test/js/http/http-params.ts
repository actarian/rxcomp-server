
export interface IHttpParamEncoder {
	encodeKey(key: string): string;
	encodeValue(value: string): string;
	decodeKey(key: string): string;
	decodeValue(value: string): string;
}

export class HttpUrlEncodingCodec implements IHttpParamEncoder {
	encodeKey(key: string): string {
		return encodeParam_(key);
	}
	encodeValue(value: string): string {
		return encodeParam_(value);
	}
	decodeKey(key: string): string {
		return decodeURIComponent(key);
	}
	decodeValue(value: string) {
		return decodeURIComponent(value);
	}
}

export class HttpParams {
	private params_: Map<string, string[]> = new Map<string, string[]>();
	private encoder: IHttpParamEncoder;

	constructor(options?: HttpParams | { [key: string]: any } | string | undefined, encoder: IHttpParamEncoder = new HttpUrlEncodingCodec()) {
		this.encoder = encoder;
		const params = this.params_;
		if (options instanceof HttpParams) {
			options.params_.forEach((value, key) => {
				params.set(key, value);
			});
		} else if (typeof options === 'object') {
			Object.keys(options).forEach(key => {
				const value = options[key];
				params.set(key, Array.isArray(value) ? value : [value]);
			});
		} else if (typeof options === 'string') {
			parseRawParams_(params, options, this.encoder);
		}
		// ?updates=null&cloneFrom=null&encoder=%5Bobject%20Object%5D&params_=%5Bobject%20Map%5D
	}

	keys(): string[] {
		return Array.from(this.params_.keys());
	}

	has(key: string): boolean {
		return this.params_.has(key);
	}

	get(key: string): string | null {
		const value = this.params_.get(key);
		return value ? value[0] : null;
	}

	getAll(key: string): string[] | null {
		return this.params_.get(key) || null;
	}

	set(key: string, value: string): HttpParams {
		const clone = this.clone_();
		clone.params_.set(key, [value]);
		return clone;
	}

	append(key: string, value: string): HttpParams {
		const clone = this.clone_();
		if (clone.has(key)) {
			const values = clone.params_.get(key) || [];
			values.push(value);
			clone.params_.set(key, values);
		} else {
			clone.params_.set(key, [value]);
		}
		return clone;
	}

	delete(key: string): HttpParams {
		const clone = this.clone_();
		clone.params_.delete(key);
		return clone;
	}

	toString(): string {
		return this.keys().map((key: string) => {
			const values = this.params_.get(key);
			return this.encoder.encodeKey(key) + (values ? '=' + values.map(x => this.encoder.encodeValue(x)).join('&') : '');
		}).filter(keyValue => keyValue !== '').join('&');
	}

	private clone_(): HttpParams {
		const clone = new HttpParams(undefined, this.encoder);
		this.params_.forEach((value, key) => {
			clone.params_.set(key, value);
		});
		return clone;
	}
}

function parseRawParams_(params: Map<string, string[]>, queryString: string, encoder: IHttpParamEncoder): Map<string, string[]> {
	if (queryString.length > 0) {
		const keyValueParams: string[] = queryString.split('&');
		keyValueParams.forEach((keyValue: string) => {
			const index = keyValue.indexOf('=');
			const [key, value]: string[] = index == -1 ? [encoder.decodeKey(keyValue), ''] : [encoder.decodeKey(keyValue.slice(0, index)), encoder.decodeValue(keyValue.slice(index + 1))];
			const values = params.get(key) || [];
			values.push(value);
			params.set(key, values);
		});
	}
	return params;
}

function encodeParam_(v: string): string {
	return encodeURIComponent(v)
		.replace(/%40/gi, '@')
		.replace(/%3A/gi, ':')
		.replace(/%24/gi, '$')
		.replace(/%2C/gi, ',')
		.replace(/%3B/gi, ';')
		.replace(/%2B/gi, '+')
		.replace(/%3D/gi, '=')
		.replace(/%3F/gi, '?')
		.replace(/%2F/gi, '/');
}
