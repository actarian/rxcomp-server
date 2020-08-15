/**
 * @license rxcomp-server v1.0.0-beta.12
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('stream'),require('http'),require('url'),require('https'),require('zlib'),require('rxjs/operators'),require('rxjs'),require('htmlparser2'),require('rxcomp')):typeof define==='function'&&define.amd?define(['exports','stream','http','url','https','zlib','rxjs/operators','rxjs','htmlparser2','rxcomp'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.main={},g.Stream,g.http,g.Url,g.https,g.zlib,g.rxjs.operators,g.rxjs,g.htmlparser2,g.rxcomp));}(this,(function(exports, Stream, http, Url, https, zlib, operators, rxjs, htmlparser2, rxcomp){'use strict';Stream=Stream&&Object.prototype.hasOwnProperty.call(Stream,'default')?Stream['default']:Stream;http=http&&Object.prototype.hasOwnProperty.call(http,'default')?http['default']:http;Url=Url&&Object.prototype.hasOwnProperty.call(Url,'default')?Url['default']:Url;https=https&&Object.prototype.hasOwnProperty.call(https,'default')?https['default']:https;zlib=zlib&&Object.prototype.hasOwnProperty.call(zlib,'default')?zlib['default']:zlib;var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob$1 {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob$1) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob$1([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob$1.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob$1.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob$1([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request$1 {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request$1(this);
	}
}

Body.mixIn(Request$1.prototype);

Object.defineProperty(Request$1.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request$1.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch$1(url, opts) {

	// allow custom promise
	if (!fetch$1.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch$1.Promise;

	// wrap http.request into fetch
	return new fetch$1.Promise(function (resolve, reject) {
		// build request object
		const request = new Request$1(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch$1.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch$1(new Request$1(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch$1.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch$1.Promise = global.Promise;var lib=/*#__PURE__*/Object.freeze({__proto__:null,'default': fetch$1,Headers: Headers,Request: Request$1,Response: Response,FetchError: FetchError});var nodeFetch = getCjsExportFromNamespace(lib);var nodePonyfill = createCommonjsModule(function (module, exports) {
var realFetch = nodeFetch.default || nodeFetch;

var fetch = function (url, options) {
  // Support schemaless URIs on the server for parity with the browser.
  // Ex: //github.com/ -> https://github.com/
  if (/^\/\//.test(url)) {
    url = 'https:' + url;
  }
  return realFetch.call(this, url, options)
};

module.exports = exports = fetch;
exports.fetch = fetch;
exports.Headers = nodeFetch.Headers;
exports.Request = nodeFetch.Request;
exports.Response = nodeFetch.Response;

// Needed for TypeScript consumers without esModuleInterop.
exports.default = fetch;
});var fetch$2 = nodePonyfill.fetch.bind({});

fetch$2.polyfill = true;

if (!commonjsGlobal.fetch) {
  commonjsGlobal.fetch = fetch$2;
  commonjsGlobal.Response = nodePonyfill.Response;
  commonjsGlobal.Headers = nodePonyfill.Headers;
  commonjsGlobal.Request = nodePonyfill.Request;
}function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}var fs = require('fs');

var CacheMode;

(function (CacheMode) {
  CacheMode["Memory"] = "memory";
  CacheMode["File"] = "file";
})(CacheMode || (CacheMode = {}));

var CacheControlType;

(function (CacheControlType) {
  CacheControlType["Public"] = "public";
  CacheControlType["Private"] = "private";
  CacheControlType["NoCache"] = "no-cache";
  CacheControlType["NoStore"] = "no-store";
})(CacheControlType || (CacheControlType = {}));

var CacheItem = /*#__PURE__*/function () {
  function CacheItem(options) {
    this.date = new Date();
    this.maxAge = 0;
    this.cacheControl = CacheControlType.Public;

    if (options) {
      this.value = options.value;
      this.date = options.date ? new Date(options.date) : this.date;
      this.maxAge = options.maxAge || this.maxAge;
      this.cacheControl = options.cacheControl || this.cacheControl;
    }
  }

  _createClass(CacheItem, [{
    key: "expired",
    get: function get() {
      return this.cacheControl === CacheControlType.NoStore || this.maxAge === 0 || this.date.getTime() + this.maxAge * 1000 < Date.now();
    }
  }]);

  return CacheItem;
}();

var CacheService = /*#__PURE__*/function () {
  function CacheService() {}

  CacheService.has = function has(type, name) {
    if (type === void 0) {
      type = 'cache';
    }

    var has = false;

    switch (this.mode) {
      case CacheMode.File:
        has = this.hasFile(type, name);
        break;

      case CacheMode.Memory:
      default:
        var key = type + "_" + name;
        has = this.cache_.has(key);
    }

    return has;
  };

  CacheService.get = function get(type, name) {
    if (type === void 0) {
      type = 'cache';
    }

    var value = null,
        cacheItem;
    var key = type + "_" + name;

    switch (this.mode) {
      case CacheMode.File:
        if (this.hasFile(type, name)) {
          cacheItem = this.readFile(type, name);

          if (cacheItem) {
            if (cacheItem.expired) {
              this.unlinkFile(type, name);
            } else {
              var _cacheItem;

              value = (_cacheItem = cacheItem) == null ? void 0 : _cacheItem.value;
            }
          }
        }

        break;

      case CacheMode.Memory:
      default:
        if (this.cache_.has(key)) {
          var data = this.cache_.get(key);

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
  };

  CacheService.set = function set(type, name, value, maxAge) {
    if (type === void 0) {
      type = 'cache';
    }

    if (maxAge === void 0) {
      maxAge = 0;
    }

    var key = type + "_" + name;
    var cacheItem = new CacheItem({
      value: value,
      maxAge: maxAge
    });

    switch (this.mode) {
      case CacheMode.File:
        this.writeFile(type, name, cacheItem);
        break;

      case CacheMode.Memory:
      default:
        var serialized = this.serialize(cacheItem);
        console.log(serialized);
        this.cache_.set(key, serialized);
    }

    return value;
  };

  CacheService.delete = function _delete(type, name) {
    if (type === void 0) {
      type = 'cache';
    }

    switch (this.mode) {
      case CacheMode.File:
        this.unlinkFile(type, name);
        break;

      case CacheMode.Memory:
      default:
        var key = type + "_" + name;

        if (this.cache_.has(key)) {
          this.cache_.delete(key);
        }

    }
  };

  CacheService.getPath = function getPath(type, name) {
    if (type === void 0) {
      type = 'cache';
    }

    var path = ("_" + type + "_" + name).replace(/(\/|\?|\#|\&)+/g, function (substring, group) {
      return encodeURIComponent(group);
    });
    return "" + this.folder + path;
  };

  CacheService.hasFile = function hasFile(type, name) {
    if (type === void 0) {
      type = 'cache';
    }

    var has = false;
    var key = this.getPath(type, name);

    try {
      if (fs.existsSync(key)) {
        has = true;
      }
    } catch (error) {
      throw error;
    }

    return has;
  };

  CacheService.readFile = function readFile(type, name) {
    if (type === void 0) {
      type = 'cache';
    }

    var cacheItem = null;
    var key = this.getPath(type, name);

    try {
      var json = fs.readFileSync(key, 'utf8');
      cacheItem = new CacheItem(JSON.parse(json));
    } catch (error) {
      throw error;
    }

    return cacheItem;
  };

  CacheService.writeFile = function writeFile(type, name, cacheItem) {
    if (type === void 0) {
      type = 'cache';
    }

    var key = this.getPath(type, name);

    try {
      var json = this.serialize(cacheItem);
      fs.writeFileSync(key, json, 'utf8');
    } catch (error) {
      throw error;
    }

    return cacheItem;
  };

  CacheService.unlinkFile = function unlinkFile(type, name) {
    if (type === void 0) {
      type = 'cache';
    }

    var key = this.getPath(type, name);

    try {
      if (fs.existsSync(key)) {
        fs.unlinkSync(key);
      }
    } catch (error) {
      throw error;
    }
  };

  CacheService.readFile$ = function readFile$(type, name) {
    if (type === void 0) {
      type = 'cache';
    }

    var service = this;
    return rxjs.Observable.create(function (observer) {
      var key = service.folder + "_" + type + "_" + name;
      fs.readFile(key, 'utf8', function (error, json) {
        if (error) {
          observer.error(error);
        } else {
          var cacheItem = new CacheItem(JSON.parse(json));
          observer.next(cacheItem);
          observer.complete();
        }
      });
    });
  };

  CacheService.writeFile$ = function writeFile$(type, name, cacheItem) {
    if (type === void 0) {
      type = 'cache';
    }

    var service = this;
    return rxjs.Observable.create(function (observer) {
      var key = service.folder + "_" + type + "_" + name;
      var json = service.serialize(cacheItem);
      fs.writeFile(key, json, 'utf8', function (error) {
        if (error) {
          observer.error(error);
        } else {
          observer.next(cacheItem);
          observer.complete();
        }
      });
    });
  };

  CacheService.serialize = function serialize(item) {
    var cache = new Map();
    var serialized = JSON.stringify(item, function (key, value) {
      if (value && typeof value === 'object') {
        if (cache.has(value)) {
          return;
        }

        cache.set(value, true);
      }

      return value;
    }, 0);
    cache.clear();
    return serialized;
  };

  return CacheService;
}();
CacheService.cache_ = new Map();
CacheService.mode = CacheMode.Memory;
/*
Cache-Control: max-age=0, private, must-revalidate
Date: Fri, 14 Aug 2020 20:09:02 GMT
Expect-CT: max-age=2592000, report-uri="https://api.github.com/_private/browser/errors"
Status: 200 OK
Strict-Transport-Security: max-age=31536000; includeSubdomains; preload
Cache-Control: no-cache
Connection: keep-alive
Pragma: no-cache
*/// const SKIP = ['html','head','title','base','meta','script','link','body',];
// document.createComment = nodeValue => { return new RxComment(null, nodeValue); };
// document.createTextNode = nodeValue => { return new RxText(null, nodeValue); };

var RxNodeType;

(function (RxNodeType) {
  RxNodeType[RxNodeType["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
  RxNodeType[RxNodeType["TEXT_NODE"] = 3] = "TEXT_NODE";
  RxNodeType[RxNodeType["CDATA_SECTION_NODE"] = 4] = "CDATA_SECTION_NODE";
  RxNodeType[RxNodeType["PROCESSING_INSTRUCTION_NODE"] = 7] = "PROCESSING_INSTRUCTION_NODE";
  RxNodeType[RxNodeType["COMMENT_NODE"] = 8] = "COMMENT_NODE";
  RxNodeType[RxNodeType["DOCUMENT_NODE"] = 9] = "DOCUMENT_NODE";
  RxNodeType[RxNodeType["DOCUMENT_TYPE_NODE"] = 10] = "DOCUMENT_TYPE_NODE";
  RxNodeType[RxNodeType["DOCUMENT_FRAGMENT_NODE"] = 11] = "DOCUMENT_FRAGMENT_NODE";
})(RxNodeType || (RxNodeType = {}));

var SelectorType;

(function (SelectorType) {
  SelectorType[SelectorType["None"] = -1] = "None";
  SelectorType[SelectorType["Id"] = 0] = "Id";
  SelectorType[SelectorType["Class"] = 1] = "Class";
  SelectorType[SelectorType["Attribute"] = 2] = "Attribute";
  SelectorType[SelectorType["TagName"] = 3] = "TagName";
})(SelectorType || (SelectorType = {}));

function isRxElement(x) {
  return x.nodeType === RxNodeType.ELEMENT_NODE;
}
function isRxText(x) {
  return x.nodeType === RxNodeType.TEXT_NODE;
}
function isRxComment(x) {
  return x.nodeType === RxNodeType.COMMENT_NODE;
}
function isRxDocument(x) {
  return x.nodeType === RxNodeType.DOCUMENT_NODE;
}
function isRxDocumentFragment(x) {
  return x.nodeType === RxNodeType.DOCUMENT_FRAGMENT_NODE;
}
function isRxDocumentType(x) {
  return x.nodeType === RxNodeType.DOCUMENT_TYPE_NODE;
}
function parse(html) {
  var doc = new RxDocument();
  var parentNode = doc,
      node;
  var parser = new htmlparser2.Parser({
    onopentag: function onopentag(nodeName, attributes) {
      // console.log(nodeName);
      node = new RxElement(parentNode, nodeName, attributes);
      parentNode.childNodes.push(node);
      parentNode = node; // if (NO_CHILDS.indexOf(nodeName) === -1) {
      //	console.log(nodeName);
      //	parentNode = node;
      // }
    },
    onclosetag: function onclosetag(nodeName) {
      if (parentNode.parentNode) {
        parentNode = parentNode.parentNode;
      }
    },
    ontext: function ontext(nodeValue) {
      // console.log('ontext', nodeValue);
      // if (nodeValue.length) {
      var textNode = new RxText(parentNode, nodeValue);
      parentNode.childNodes.push(textNode); // }
    },
    onprocessinginstruction: function onprocessinginstruction(nodeName, nodeValue) {
      // console.log('onprocessinginstruction', nodeName, nodeValue);
      if (nodeName === '!doctype') {
        node = new RxDocumentType(parentNode, nodeValue);
      } else {
        node = new RxProcessingInstruction(parentNode, nodeValue);
      }

      parentNode.childNodes.push(node);
    },
    oncomment: function oncomment(nodeValue) {
      // console.log('oncomment', nodeValue);
      node = new RxComment(parentNode, nodeValue);
      parentNode.childNodes.push(node); // parentNode = node;
    },
    oncommentend: function oncommentend() {// console.log('oncommentend');
      // parentNode = parentNode.parentNode;
    },
    oncdatastart: function oncdatastart() {
      console.log('oncdatastart');
    },
    oncdataend: function oncdataend() {
      console.log('oncdataend');
    },
    onerror: function onerror(error) {
      console.log('error', error);
    }
  }, {
    decodeEntities: false,
    lowerCaseTags: true
  });
  parser.write(html);
  parser.end();
  return doc;
}
function getQueries(selector) {
  var queries = [];
  selector.trim().split(' ').forEach(function (x) {
    x.trim().split('>').forEach(function (x, i) {
      // const regex = /\.([^\.[]+)|\[([^\.\[]+)\]|([^\.\[\]]+)/g;
      // const regex = /\#([^\.[#]+)|\.([^\.[#]+)|\[([^\.\[#]+)\]|([^\.\[#\]]+)/g;
      var regex = /\:not\(\#([^\.[#:]+)\)|\:not\(\.([^\.[#:]+)\)|\:not\(\[([^\.\[#:]+)\]\)|\:not\(([^\.\[#:\]]+)\)|\#([^\.[#:]+)|\.([^\.[#:]+)|\[([^\.\[#:]+)\]|([^\.\[#:\]]+)/g;
      /* eslint no-useless-escape: "off" */

      var selectors = [];
      var matches = x.matchAll(regex);

      for (var _iterator = _createForOfIteratorHelperLoose(matches), _step; !(_step = _iterator()).done;) {
        var match = _step.value;

        if (match[1]) {
          selectors.push({
            selector: match[1],
            type: SelectorType.Id,
            negate: true
          });
        } else if (match[2]) {
          selectors.push({
            selector: match[2],
            type: SelectorType.Class,
            negate: true
          });
        } else if (match[3]) {
          selectors.push({
            selector: match[3],
            type: SelectorType.Attribute,
            negate: true
          });
        } else if (match[4]) {
          selectors.push({
            selector: match[4],
            type: SelectorType.TagName,
            negate: true
          });
        } else if (match[5]) {
          selectors.push({
            selector: match[5],
            type: SelectorType.Id,
            negate: false
          });
        } else if (match[6]) {
          selectors.push({
            selector: match[6],
            type: SelectorType.Class,
            negate: false
          });
        } else if (match[7]) {
          selectors.push({
            selector: match[7],
            type: SelectorType.Attribute,
            negate: false
          });
        } else if (match[8]) {
          selectors.push({
            selector: match[8],
            type: SelectorType.TagName,
            negate: false
          });
        } // console.log('match', match);

      }

      var selector = i > 0 ? {
        selector: x,
        selectors: selectors,
        inner: true
      } : {
        selector: x,
        selectors: selectors,
        inner: false
      };
      queries.push.call(queries, selector);
    });
  });
  return queries;
}
function matchSelector(child, selector) {
  switch (selector.type) {
    case SelectorType.Id:
      return (selector.selector !== '' && child.attributes.id === selector.selector) !== selector.negate;

    case SelectorType.Class:
      return child.classList.indexOf(selector.selector) !== -1 !== selector.negate;

    case SelectorType.Attribute:
      return Object.keys(child.attributes).indexOf(selector.selector) !== -1 !== selector.negate;

    case SelectorType.TagName:
      return child.nodeName === selector.selector !== selector.negate;

    default:
      return false;
  }
}
function matchSelectors(child, selectors) {
  return selectors.reduce(function (p, selector) {
    return p && matchSelector(child, selector);
  }, true);
}

function _querySelector(queries, childNodes, query) {
  if (query === void 0) {
    query = null;
  }

  var node = null;

  if (query || queries.length) {
    query = query || queries.shift();

    for (var _iterator3 = _createForOfIteratorHelperLoose(childNodes), _step3; !(_step3 = _iterator3()).done;) {
      var child = _step3.value;

      if (child instanceof RxElement) {
        if (matchSelectors(child, query.selectors)) {
          // console.log(query);
          if (queries.length) {
            return _querySelector(queries, child.childNodes);
          } else {
            return child;
          }
        } else if (!query.inner) {
          node = _querySelector(queries, child.childNodes, query);
        }
      }
    }
  }

  return node;
}

function _cloneNode(source, deep, parentNode) {
  if (deep === void 0) {
    deep = false;
  }

  if (parentNode === void 0) {
    parentNode = null;
  }

  var node;

  if (isRxElement(source)) {
    var nodeElement = new RxElement(parentNode, source.nodeName, Object.assign({}, source.attributes));

    if (deep) {
      nodeElement.childNodes = source.childNodes.map(function (x) {
        return _cloneNode.apply(x, [x, deep, nodeElement]);
      });
    }

    node = nodeElement;
  } else if (isRxDocumentFragment(source)) {
    var nodeDocumentFragment = new RxDocumentFragment();

    if (deep) {
      nodeDocumentFragment.childNodes = source.childNodes.map(function (x) {
        return _cloneNode.apply(x, [x, deep, nodeDocumentFragment]);
      });
    }

    node = nodeDocumentFragment;
  } else if (isRxText(source)) {
    node = new RxText(parentNode, source.nodeValue);
  } else if (isRxComment(source)) {
    node = new RxComment(parentNode, source.nodeValue);
  } else if (isRxDocument(source)) {
    var documentElement = new RxDocument();

    if (deep) {
      documentElement.childNodes = source.childNodes.map(function (x) {
        return _cloneNode.apply(x, [x, deep, documentElement]);
      });
    }

    node = documentElement;
  } else {
    throw new Error('Invalid node type');
  }

  return node;
}
var RxNode = /*#__PURE__*/function () {
  function RxNode(parentNode) {
    if (parentNode === void 0) {
      parentNode = null;
    }

    this.nodeValue = null;
    this.parentNode = parentNode;
    this.nodeType = -1;
  }

  var _proto = RxNode.prototype;

  _proto.cloneNode = function cloneNode(deep) {
    if (deep === void 0) {
      deep = false;
    }

    return _cloneNode.apply(this, [this, deep]);
  };

  _proto.serialize = function serialize() {
    return "";
  };

  return RxNode;
}();
var RxStyle = /*#__PURE__*/function () {
  var _proto2 = RxStyle.prototype;

  _proto2.item = function item(index) {
    var keys = Object.keys(this);

    if (keys.length > index) {
      return keys[index];
    } else {
      return undefined;
    }
  };

  _proto2.getPropertyPriority = function getPropertyPriority(key) {
    var value = this[key];

    if (value && value.indexOf('!important')) {
      return 'important';
    } else {
      return '';
    }
  };

  _proto2.getPropertyValue = function getPropertyValue(key) {
    return this[key];
  };

  _proto2.setProperty = function setProperty(key, value, important) {
    this[key] = value + (important === 'important' ? '!important' : '');
    this.serialize_();
  };

  _proto2.removeProperty = function removeProperty(key) {
    delete this[key];
    this.serialize_();
  };

  _proto2.serialize_ = function serialize_() {
    var _this = this;

    this.node.attributes.style = Object.keys(this).map(function (key) {
      return key + ": " + _this[key] + ";";
    }).join(' ');
  };

  _proto2.init = function init() {
    var _this2 = this,
        _this$node$attributes;

    var keys = Object.keys(this);
    keys.forEach(function (key) {
      return delete _this2[key];
    });

    if ((_this$node$attributes = this.node.attributes) == null ? void 0 : _this$node$attributes.style) {
      var regex = /([^:]+):([^;]+);?\s*/gm;
      var matches = [].concat(this.node.attributes.style.matchAll(regex));
      matches.forEach(function (match) {
        var key = match[1];
        var value = match[2];
        _this2[key] = value;
      });
    }
  };

  function RxStyle(node) {
    Object.defineProperty(this, 'node', {
      value: node,
      writable: false,
      enumerable: false
    });
    this.init();
  }

  return RxStyle;
}();
var RxClassList = /*#__PURE__*/function (_Array) {
  _inheritsLoose(RxClassList, _Array);

  function RxClassList(node) {
    var _this3;

    _this3 = _Array.call(this) || this;
    _this3.node = node;

    _this3.init();

    return _this3;
  }

  var _proto3 = RxClassList.prototype;

  _proto3.item = function item(index) {
    return this[index];
  };

  _proto3.contains = function contains(name) {
    return this.indexOf(name) !== -1;
  };

  _proto3.add = function add() {
    var _this4 = this;

    for (var _len = arguments.length, names = new Array(_len), _key = 0; _key < _len; _key++) {
      names[_key] = arguments[_key];
    }

    names.forEach(function (name) {
      if (_this4.indexOf(name) !== -1) {
        _this4.push(name);
      }
    });
    this.serialize_();
  };

  _proto3.remove = function remove() {
    var _this5 = this;

    for (var _len2 = arguments.length, names = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      names[_key2] = arguments[_key2];
    }

    names.forEach(function (name) {
      var index = _this5.indexOf(name);

      if (index !== -1) {
        _this5.splice(index, 1);
      }
    });
    this.serialize_();
  };

  _proto3.toggle = function toggle(name, force) {
    var index = this.indexOf(name);

    if (force === false) {
      this.splice(index, 1);
      this.serialize_();
      return false;
    } else if (force === true) {
      this.push(name);
      this.serialize_();
      return true;
    } else if (index !== -1) {
      this.splice(index, 1);
      this.serialize_();
      return false;
    } else {
      this.push(name);
      this.serialize_();
      return true;
    }
  };

  _proto3.replace = function replace(oldClass, newClass) {
    var index = this.indexOf(oldClass);

    if (index !== -1) {
      this.splice(index, 1);
    }

    this.push(newClass);
    this.serialize_();
  };

  _proto3.serialize_ = function serialize_() {
    this.node.attributes.class = this.join(' ');
  };

  _proto3.init = function init() {
    var _this$node$attributes2;

    this.length = 0;

    if ((_this$node$attributes2 = this.node.attributes) == null ? void 0 : _this$node$attributes2.class) {
      Array.prototype.push.apply(this, this.node.attributes.class.split(' ').map(function (name) {
        return name.trim();
      }));
    }
  };

  return RxClassList;
}( /*#__PURE__*/_wrapNativeSuper(Array));
var RxElement = /*#__PURE__*/function (_RxNode) {
  _inheritsLoose(RxElement, _RxNode);

  function RxElement(parentNode, nodeName, attributes) {
    var _this6;

    if (parentNode === void 0) {
      parentNode = null;
    }

    if (attributes === void 0) {
      attributes = null;
    }

    _this6 = _RxNode.call(this, parentNode) || this;
    _this6.attributes = {};
    _this6.nodeType = RxNodeType.ELEMENT_NODE;
    _this6.nodeName = nodeName;

    if (attributes && typeof attributes === 'object') {
      _this6.attributes = attributes;
    }

    _this6.style = new RxStyle(_assertThisInitialized(_this6));
    _this6.classList = new RxClassList(_assertThisInitialized(_this6));
    _this6.childNodes = [];
    /*
        if (SKIP.indexOf(nodeName) === -1) {
            console.log(parentNode.nodeName, '>', nodeName);
    }
    */

    return _this6;
  }

  var _proto4 = RxElement.prototype;

  _proto4.append = function append() {
    var _this7 = this;

    for (var _len3 = arguments.length, nodesOrDOMStrings = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      nodesOrDOMStrings[_key3] = arguments[_key3];
    }

    nodesOrDOMStrings = nodesOrDOMStrings.map(function (nodeOrDomString) {
      var node;

      if (typeof nodeOrDomString === 'string') {
        node = new RxText(_this7, nodeOrDomString);
      } else {
        node = nodeOrDomString;
        node.parentNode = _this7;
      }

      return node;
    });
    Array.prototype.push.apply(this.childNodes, nodesOrDOMStrings);
    /*
    for (let nodeOrDomString of nodesOrDOMStrings) {
            let node;
            if (typeof nodeOrDomString === 'string') {
                node = new RxText(this, nodeOrDomString);
            } else {
                node = nodeOrDomString;
            }
            this.childNodes.push(node);
    }
    */
  };

  _proto4.prepend = function prepend() {
    var _this8 = this;

    for (var _len4 = arguments.length, nodesOrDOMStrings = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      nodesOrDOMStrings[_key4] = arguments[_key4];
    }

    nodesOrDOMStrings = nodesOrDOMStrings.map(function (nodeOrDomString) {
      var node;

      if (typeof nodeOrDomString === 'string') {
        node = new RxText(_this8, nodeOrDomString);
      } else {
        node = nodeOrDomString;
        node.parentNode = _this8;
      }

      return node;
    });
    Array.prototype.unshift.apply(this.childNodes, nodesOrDOMStrings);
    /*
        for (let nodeOrDomString of nodesOrDOMStrings) {
            let node;
            if (typeof nodeOrDomString === 'string') {
                node = new RxText(this, nodeOrDomString);
            } else {
                node = nodeOrDomString;
            }
            this.childNodes.unshift(node);
    }
    */
  };

  _proto4.replaceChildren = function replaceChildren() {
    var _this9 = this;

    for (var _len5 = arguments.length, nodesOrDOMStrings = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      nodesOrDOMStrings[_key5] = arguments[_key5];
    }

    var nodes = nodesOrDOMStrings.map(function (nodeOrDomString) {
      var node;

      if (typeof nodeOrDomString === 'string') {
        node = new RxText(_this9, nodeOrDomString);
      } else {
        node = nodeOrDomString;
        node.parentNode = _this9;
      }

      return node;
    });
    this.childNodes = nodes;
  };

  _proto4.querySelectorAll = function querySelectorAll(selector) {
    var queries = getQueries(selector);
    var nodes = this.childNodes.filter(function (x) {
      return true;
    });
    console.log(queries);
    return nodes.length ? nodes : null;
  };

  _proto4.querySelector = function querySelector(selector) {
    var queries = getQueries(selector);

    var node = _querySelector(queries, this.childNodes);

    return node;
  };

  _proto4.hasAttribute = function hasAttribute(attribute) {
    return Object.keys(this.attributes).indexOf(attribute.toLowerCase()) !== -1;
  };

  _proto4.getAttribute = function getAttribute(attribute) {
    return this.attributes[attribute.toLowerCase()] || null;
  };

  _proto4.setAttribute = function setAttribute(attribute, value) {
    this.attributes[attribute.toLowerCase()] = value.toString();

    if (attribute === 'style') {
      this.style.init();
    } else if (attribute === 'class') {
      this.classList.init();
    }
  };

  _proto4.removeAttribute = function removeAttribute(attribute) {
    delete this.attributes[attribute];

    if (attribute === 'style') {
      this.style.init();
    } else if (attribute === 'class') {
      this.classList.init();
    }
  };

  _proto4.replaceChild = function replaceChild(newChild, oldChild) {
    var index = this.childNodes.indexOf(oldChild);

    if (index !== -1) {
      this.childNodes[index] = newChild;
      newChild.parentNode = this;
    } // console.log('replaceChild', this, newChild, oldChild);


    return oldChild;
  };

  _proto4.removeChild = function removeChild(child) {
    if (!(child instanceof RxNode)) {
      throw new Error("Uncaught TypeError: Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'.");
    }

    var index = this.childNodes.indexOf(child);

    if (index === -1) {
      throw new Error("Uncaught NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.");
    }

    this.childNodes.splice(index, 1); // console.log('removeChild', this.childNodes.length);

    return child;
  };

  _proto4.insertBefore = function insertBefore(newNode, referenceNode) {
    if (referenceNode === void 0) {
      referenceNode = null;
    }

    var index = referenceNode ? this.childNodes.indexOf(referenceNode) : this.childNodes.length;

    if (index !== -1) {
      this.childNodes.splice(index, 0, newNode);
      newNode.parentNode = this;
    } // console.log('insertBefore', this, newNode, referenceNode);


    return newNode;
  };

  _proto4.cloneNode = function cloneNode(deep) {
    if (deep === void 0) {
      deep = false;
    }

    return _cloneNode.apply(this, [this, deep]);
  };

  _proto4.addListener = function addListener(eventName, handler) {};

  _proto4.removeListener = function removeListener(eventName, handler) {};

  _proto4.serialize = function serialize() {
    return "<" + this.nodeName + this.serializeAttributes() + ">" + this.childNodes.map(function (x) {
      return x.serialize();
    }).join('') + "</" + this.nodeName + ">";
  };

  _proto4.serializeAttributes = function serializeAttributes() {
    var _this10 = this;

    var attributes = '';
    var keys = Object.keys(this.attributes);

    if (keys.length) {
      attributes = ' ' + keys.map(function (k) {
        return k + "=\"" + _this10.attributes[k] + "\"";
      }).join(' ');
    }

    return attributes;
  };

  _createClass(RxElement, [{
    key: "children",
    get: function get() {
      var children = [],
          i = 0,
          node,
          nodes = this.childNodes;
      node = nodes[i++];

      while (node) {
        node = nodes[i++];

        if (node.nodeType === RxNodeType.ELEMENT_NODE) {
          children.push(node);
        }
      }

      return children;
    }
  }, {
    key: "childElementCount",
    get: function get() {
      var i = 0,
          count = 0,
          node,
          nodes = this.childNodes;
      node = nodes[i++];

      while (node) {
        if (node.nodeType === RxNodeType.ELEMENT_NODE) {
          count++;
        }

        node = nodes[i++];
      }

      return count;
    }
  }, {
    key: "firstChild",
    get: function get() {
      var node = null;

      if (this.childNodes.length) {
        node = this.childNodes[0];
      }

      return node;
    }
  }, {
    key: "firstElementChild",
    get: function get() {
      for (var _iterator4 = _createForOfIteratorHelperLoose(this.childNodes), _step4; !(_step4 = _iterator4()).done;) {
        var node = _step4.value;

        if (isRxElement(node)) {
          return node;
        }
      }

      return null;
    }
  }, {
    key: "lastChild",
    get: function get() {
      var node = null;

      if (this.childNodes.length) {
        node = this.childNodes[this.childNodes.length - 1];
      }

      return node;
    }
  }, {
    key: "lastElementChild",
    get: function get() {
      var nodes = this.childNodes;

      for (var i = nodes.length - 1; i > -1; i--) {
        var node = nodes[i];

        if (isRxElement(node)) {
          return node;
        }
      }

      return null;
    }
  }, {
    key: "previousSibling",
    get: function get() {
      var node = null;

      if (this.parentNode) {
        var index = this.parentNode.childNodes.indexOf(this);

        if (index > 0) {
          node = this.parentNode.childNodes[index - 1];
        }
      }

      return node;
    }
  }, {
    key: "nextSibling",
    get: function get() {
      var node = null;

      if (this.parentNode) {
        var index = this.parentNode.childNodes.indexOf(this);

        if (index !== -1 && index < this.parentNode.childNodes.length - 1) {
          node = this.parentNode.childNodes[index];
        }
      }

      return node;
    }
  }, {
    key: "wholeText",
    get: function get() {
      var nodeValue;

      if (this.nodeType === RxNodeType.TEXT_NODE) {
        return this.nodeValue;
      }

      return nodeValue;
    }
  }, {
    key: "outerHTML",
    get: function get() {
      var html = null;

      if (this.parentNode) {
        html = this.parentNode.serialize();
      }

      return html;
    }
  }, {
    key: "innerText",
    set: function set(nodeValue) {
      this.childNodes = [new RxText(this, nodeValue)];
    },
    get: function get() {
      // return this.childNodes.filter((n): n is RxText => isRxText(n)).map(n => n.innerText).join('');
      return this.childNodes.filter(function (n) {
        return isRxText(n) || isRxElement(n);
      }).map(function (n) {
        return n.innerText;
      }).join('');
    }
  }, {
    key: "textContent",
    set: function set(nodeValue) {
      this.innerText = String(nodeValue);
    },
    get: function get() {
      return this.innerText;
    }
  }, {
    key: "innerHTML",
    get: function get() {
      return this.childNodes.map(function (x) {
        return x.serialize();
      }).join('');
    },
    set: function set(html) {
      var _this11 = this;

      var doc = parse(html);
      var childNodes = doc.childNodes.map(function (n) {
        n.parentNode = _this11;
        return n;
      });
      this.childNodes = childNodes;
    }
  }]);

  return RxElement;
}(RxNode);
var RxText = /*#__PURE__*/function (_RxNode2) {
  _inheritsLoose(RxText, _RxNode2);

  function RxText(parentNode, nodeValue) {
    var _this12;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this12 = _RxNode2.call(this, parentNode) || this;
    _this12.nodeType = RxNodeType.TEXT_NODE;
    _this12.nodeValue = String(nodeValue); // console.log('RxText', nodeValue);

    return _this12;
  }

  var _proto5 = RxText.prototype;

  _proto5.serialize = function serialize() {
    return this.nodeValue;
  };

  _createClass(RxText, [{
    key: "outerHTML",
    get: function get() {
      var html = null;

      if (this.parentNode) {
        html = this.parentNode.serialize();
      }

      return html;
    }
  }, {
    key: "wholeText",
    get: function get() {
      return this.nodeValue;
    }
  }, {
    key: "innerText",
    set: function set(nodeValue) {
      this.nodeValue = String(nodeValue);
    },
    get: function get() {
      return this.nodeValue;
    }
  }, {
    key: "textContent",
    set: function set(nodeValue) {
      this.nodeValue = String(nodeValue);
    },
    get: function get() {
      return this.nodeValue;
    }
  }]);

  return RxText;
}(RxNode);
var RxComment = /*#__PURE__*/function (_RxNode4) {
  _inheritsLoose(RxComment, _RxNode4);

  function RxComment(parentNode, nodeValue) {
    var _this14;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this14 = _RxNode4.call(this, parentNode) || this;
    _this14.nodeType = RxNodeType.COMMENT_NODE;
    _this14.nodeValue = String(nodeValue);
    return _this14;
  }

  var _proto7 = RxComment.prototype;

  _proto7.serialize = function serialize() {
    return "<!--" + this.nodeValue + "-->";
  };

  _createClass(RxComment, [{
    key: "outerHTML",
    get: function get() {
      var html = null;

      if (this.parentNode) {
        html = this.parentNode.serialize();
      }

      return html;
    }
  }, {
    key: "wholeText",
    get: function get() {
      return this.nodeValue;
    }
  }, {
    key: "innerText",
    set: function set(nodeValue) {
      this.nodeValue = String(nodeValue);
    },
    get: function get() {
      return this.nodeValue;
    }
  }, {
    key: "textContent",
    set: function set(nodeValue) {
      this.nodeValue = String(nodeValue);
    },
    get: function get() {
      return this.nodeValue;
    }
  }]);

  return RxComment;
}(RxNode);
var RxProcessingInstruction = /*#__PURE__*/function (_RxNode5) {
  _inheritsLoose(RxProcessingInstruction, _RxNode5);

  function RxProcessingInstruction(parentNode, nodeValue) {
    var _this15;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this15 = _RxNode5.call(this, parentNode) || this;
    _this15.nodeType = RxNodeType.PROCESSING_INSTRUCTION_NODE;
    _this15.nodeValue = String(nodeValue);
    return _this15;
  }

  var _proto8 = RxProcessingInstruction.prototype;

  _proto8.serialize = function serialize() {
    return "<" + this.nodeValue + ">";
  };

  return RxProcessingInstruction;
}(RxNode);
var RxDocumentType = /*#__PURE__*/function (_RxNode6) {
  _inheritsLoose(RxDocumentType, _RxNode6);

  function RxDocumentType(parentNode, nodeValue) {
    var _this16;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this16 = _RxNode6.call(this, parentNode) || this;
    _this16.nodeType = RxNodeType.DOCUMENT_TYPE_NODE;
    _this16.nodeValue = String(nodeValue);
    return _this16;
  }

  var _proto9 = RxDocumentType.prototype;

  _proto9.serialize = function serialize() {
    return "<" + this.nodeValue + ">";
  };

  return RxDocumentType;
}(RxNode);
var RxDocumentFragment = /*#__PURE__*/function (_RxElement) {
  _inheritsLoose(RxDocumentFragment, _RxElement);

  function RxDocumentFragment() {
    var _this17;

    _this17 = _RxElement.call(this, null, '#document-fragment') || this;
    _this17.nodeType = RxNodeType.DOCUMENT_FRAGMENT_NODE;
    _this17.childNodes = [];
    return _this17;
  }

  return RxDocumentFragment;
}(RxElement);
var RxDocument = /*#__PURE__*/function (_RxElement2) {
  _inheritsLoose(RxDocument, _RxElement2);

  _createClass(RxDocument, [{
    key: "hidden",
    get: function get() {
      return true;
    }
  }, {
    key: "visibilityState",
    get: function get() {
      return 'prerender';
    }
  }, {
    key: "doctype",
    get: function get() {
      return this.childNodes.find(function (x) {
        return isRxDocumentType(x);
      });
    }
  }, {
    key: "body",
    get: function get() {
      return this.childNodes.find(function (x) {
        return isRxElement(x) && x.nodeName === 'body';
      });
    }
  }, {
    key: "head",
    get: function get() {
      return this.childNodes.find(function (x) {
        return isRxElement(x) && x.nodeName === 'head';
      });
    }
  }, {
    key: "title",
    get: function get() {
      var title = this.childNodes.find(function (x) {
        return isRxElement(x) && x.nodeName === 'title';
      });

      if (title) {
        return title.innerText;
      } else {
        return null;
      }
    },
    set: function set(nodeValue) {
      var title = this.childNodes.find(function (x) {
        return isRxElement(x) && x.nodeName === 'title';
      });

      if (title) {
        title.innerText = nodeValue;
      }
    }
  }, {
    key: "documentElement",
    get: function get() {
      return this.firstElementChild;
    }
  }]);

  function RxDocument() {
    var _this18;

    _this18 = _RxElement2.call(this, null, '#document') || this;
    _this18.nodeType = RxNodeType.DOCUMENT_NODE;
    _this18.childNodes = [];
    return _this18;
  }

  var _proto10 = RxDocument.prototype;

  _proto10.createAttribute = function createAttribute() {} // Creates a new Attr object and returns it.
  ;

  _proto10.createAttributeNS = function createAttributeNS() {} // Creates a new attribute node in a given namespace and returns it.
  ;

  _proto10.createCDATASection = function createCDATASection() {} // Creates a new CDATA node and returns it.
  ;

  _proto10.createComment = function createComment(nodeValue) {
    return new RxComment(null, nodeValue);
  } // Creates a new comment node and returns it.
  ;

  _proto10.createDocumentFragment = function createDocumentFragment() {
    return new RxDocumentFragment();
  } // Creates a new document fragment.
  ;

  _proto10.createElement = function createElement(nodeName) {
    return new RxElement(null, nodeName);
  } // Creates a new element with the given tag name.
  ;

  _proto10.createElementNS = function createElementNS(nodeName) {
    return new RxElement(null, nodeName);
  } // Creates a new element with the given tag name and namespace URI.
  ;

  _proto10.createEvent = function createEvent() {} // Creates an event object.
  ;

  _proto10.createNodeIterator = function createNodeIterator() {} // Creates a NodeIterator object.
  ;

  _proto10.createProcessingInstruction = function createProcessingInstruction(nodeValue) {
    return new RxProcessingInstruction(null, nodeValue);
  } // Creates a new ProcessingInstruction object.
  ;

  _proto10.createRange = function createRange() {} // Creates a Range object.
  ;

  _proto10.createTextNode = function createTextNode(nodeValue) {
    return new RxText(null, nodeValue);
  } // Creates a text node.
  ;

  _proto10.createTouchList = function createTouchList() {} // Creates a TouchList object.
  ;

  _proto10.createTreeWalker = function createTreeWalker() {} // Creates a TreeWalker object.
  ;

  _proto10.serialize = function serialize() {
    return "" + this.childNodes.map(function (x) {
      return x.serialize();
    }).join('');
  };

  return RxDocument;
}(RxElement);var fs$1 = require('fs');

var ServerRequest = function ServerRequest(options) {
  if (options) {
    Object.assign(this, options);
  }

  this.vars = Object.assign({
    host: 'http://localhost:5000',
    port: 5000,
    charset: 'utf8',
    template: "./index.html",
    cacheMode: CacheMode.Memory,
    cache: './cache/',
    root: './dist/browser/'
  }, this.vars || {});
};
var ServerResponse = function ServerResponse(options) {
  if (options) {
    Object.assign(this, options);
  }
};
var ServerErrorResponse = function ServerErrorResponse(options) {
  if (options) {
    Object.assign(this, options);
  }
};

var Server = /*#__PURE__*/function (_Platform) {
  _inheritsLoose(Server, _Platform);

  function Server() {
    return _Platform.apply(this, arguments) || this;
  }

  /**
   * @param moduleFactory
   * @description This method returns a Server compiled module
   */
  Server.bootstrap = function bootstrap(moduleFactory, template) {
    if (!rxcomp.isPlatformServer) {
      throw new rxcomp.ModuleError('missing platform server, node process not found');
    }

    if (!moduleFactory) {
      throw new rxcomp.ModuleError('missing moduleFactory');
    }

    if (!moduleFactory.meta) {
      throw new rxcomp.ModuleError('missing moduleFactory meta');
    }

    if (!moduleFactory.meta.bootstrap) {
      throw new rxcomp.ModuleError('missing bootstrap');
    }

    if (!moduleFactory.meta.bootstrap.meta) {
      throw new rxcomp.ModuleError('missing bootstrap meta');
    }

    if (!moduleFactory.meta.bootstrap.meta.selector) {
      throw new rxcomp.ModuleError('missing bootstrap meta selector');
    }

    if (!template) {
      throw new rxcomp.ModuleError('missing template');
    }
    /*
    if (typeof ((ReadableStream.prototype as any)[Symbol.asyncIterator]) === 'undefined') {
        (ReadableStream.prototype as any)[Symbol.asyncIterator] = async function* () {
            const reader = this.getReader()
            while (1) {
                const r = await reader.read();
                if (r.done) {
                    return r.value;
                }
                yield r.value;
            }
        }
    }
    */


    var document = this.resolveGlobals(template);
    var meta = this.resolveMeta(moduleFactory);

    if (meta.node instanceof RxElement) {
      var _node$parentNode;

      var node = meta.node;
      var nodeInnerHTML = meta.nodeInnerHTML;
      var rxcomp_hydrate_ = {
        selector: moduleFactory.meta.bootstrap.meta.selector,
        innerHTML: nodeInnerHTML
      };
      var scriptNode = new RxElement(null, 'script');
      var scriptText = new RxText(null, "var rxcomp_hydrate_ = " + JSON.stringify(rxcomp_hydrate_) + ";");
      scriptNode.append(scriptText);
      (_node$parentNode = node.parentNode) == null ? void 0 : _node$parentNode.insertBefore(scriptNode, node);
    }

    var module = new moduleFactory();
    module.meta = meta;
    meta.imports.forEach(function (moduleFactory) {
      moduleFactory.prototype.constructor.call(module);
    });
    var instances = module.compile(meta.node, {
      document: document
    });
    module.instances = instances;
    var root = instances[0];
    root.pushChanges();
    return module;
  };

  Server.serialize = function serialize() {
    console.log('Server.serialize');

    if (this.document instanceof RxDocument) {
      var serialized = this.document.serialize(); // console.log('serialized', serialized);

      return serialized;
    } else {
      throw new rxcomp.ModuleError('document is not an instance of RxDocument');
    }
  };

  Server.resolveGlobals = function resolveGlobals(documentOrHtml) {
    var document = typeof documentOrHtml === 'string' ? parse(documentOrHtml) : documentOrHtml;
    this.document = document;
    global.document = this.document;
    return this.document;
  };

  return Server;
}(rxcomp.Platform);
Server.render$ = render$;
Server.template$ = template$;
Server.bootstrap$ = bootstrap$;
function render$(iRequest, renderRequest$) {
  return rxjs.Observable.create(function (observer) {
    var request = new ServerRequest(iRequest);

    if (request.vars.cacheMode) {
      CacheService.mode = request.vars.cacheMode;
    }

    if (request.vars.cache) {
      CacheService.folder = request.vars.cache;
    }

    var cached = CacheService.get('cached', request.url);
    console.log('cached', !!cached);

    if (cached) {
      observer.next(cached);
      return observer.complete();
    }

    template$(request).pipe(operators.switchMap(function (template) {
      // console.log('template!', template);
      request.template = template;
      return renderRequest$(request);
    })).subscribe(function (success) {
      CacheService.set('cached', request.url, success, 3600);
      observer.next(success);
      observer.complete();
    }, function (error) {
      observer.error(error);
    });
  });
}
function template$(request) {
  return rxjs.Observable.create(function (observer) {
    var src = request.vars.template;

    if (src) {
      var template = CacheService.get('template', src);
      console.log('template', !!template);

      if (template) {
        observer.next(template);
        observer.complete();
      }

      fs$1.readFile(src, request.vars.charset, function (error, template) {
        if (error) {
          observer.error(error);
        } else {
          CacheService.set('template', src, template);
          observer.next(template);
          observer.complete();
        }
      });
    } else {
      observer.error(new Error('ServerError: missing template'));
    }
  });
}
function bootstrap$(moduleFactory, request) {
  console.log('bootstrap$', request);
  return rxjs.Observable.create(function (observer) {
    if (!request.template) {
      return observer.error(new Error('ServerError: missing template'));
    }

    try {
      // const module = Server.bootstrap(moduleFactory, request.template);
      Server.bootstrap(moduleFactory, request.template);

      var serialize = function serialize() {
        return Server.serialize();
      };

      observer.next(new ServerResponse(Object.assign({
        serialize: serialize
      }, request)));
      observer.complete();
    } catch (error) {
      observer.error(new ServerErrorResponse(Object.assign({
        error: error
      }, request)));
    }
  });
}var HttpEventType;

(function (HttpEventType) {
  HttpEventType[HttpEventType["Sent"] = 0] = "Sent";
  HttpEventType[HttpEventType["UploadProgress"] = 1] = "UploadProgress";
  HttpEventType[HttpEventType["ResponseHeader"] = 2] = "ResponseHeader";
  HttpEventType[HttpEventType["DownloadProgress"] = 3] = "DownloadProgress";
  HttpEventType[HttpEventType["Response"] = 4] = "Response";
  HttpEventType[HttpEventType["User"] = 5] = "User";
  HttpEventType[HttpEventType["ResponseError"] = 6] = "ResponseError";
})(HttpEventType || (HttpEventType = {}));var HttpHeaders = /*#__PURE__*/function () {
  function HttpHeaders(options) {
    var _this = this;

    this.headers_ = new Map();
    var headers = this.headers_;

    if (options instanceof HttpHeaders) {
      options.headers_.forEach(function (value, key) {
        headers.set(key, value);
      });
    } else if (typeof (options == null ? void 0 : options.forEach) === 'function') {
      options.forEach(function (value, key) {
        headers.set(key, value.split(', '));
      });
    } else if (typeof options === 'object') {
      Object.keys(options).forEach(function (key) {
        var values = options[key];

        if (typeof values === 'string') {
          values = [values];
        }

        if (headers.has(key)) {
          values.forEach(function (value) {
            return _this.append(key, value);
          });
        } else {
          headers.set(key, values);
        }
      });
    } else if (typeof options === 'string') {
      options.split('\n').forEach(function (line) {
        var index = line.indexOf(':');

        if (index > 0) {
          var key = line.slice(0, index);
          var value = line.slice(index + 1).trim();

          if (headers.has(key)) {
            _this.append(key, value);
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

  var _proto = HttpHeaders.prototype;

  _proto.has = function has(key) {
    return this.headers_.has(key);
  };

  _proto.get = function get(key) {
    var values = this.headers_.get(key);
    return values ? values.join(', ') : null;
  };

  _proto.set = function set(key, value) {
    var clone = this.clone_();
    clone.headers_.set(key, value.split(', '));
    return clone;
  };

  _proto.append = function append(key, value) {
    var clone = this.clone_();
    var values = clone.headers_.has(key) ? clone.headers_.get(key) || [] : [];
    values.push(value);
    clone.headers_.set(key, values);
    return clone;
  };

  _proto.delete = function _delete(key) {
    var clone = this.clone_();
    clone.headers_.delete(key);
    return clone;
  };

  _proto.forEach = function forEach(callback, thisArg) {
    var _this2 = this;

    this.headers_.forEach(function (v, k) {
      callback(v.join(', '), k, _this2);
    });
  };

  _proto.serialize = function serialize() {
    var headers = [];
    this.forEach(function (value, key) {
      headers.push([key, value]);
    });
    return headers;
  };

  _proto.clone_ = function clone_() {
    var clone = new HttpHeaders();
    this.headers_.forEach(function (value, key) {
      clone.headers_.set(key, value);
    });
    return clone;
  };

  return HttpHeaders;
}();
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
*/var HttpErrorResponse = /*#__PURE__*/function (_Error) {
  _inheritsLoose(HttpErrorResponse, _Error);

  function HttpErrorResponse(options) {
    var _this;

    _this = _Error.call(this, (options == null ? void 0 : options.message) || 'Unknown Error') || this;
    _this.status = 0;
    _this.statusText = 'Unknown Error';
    _this.ok = false;
    _this.type = HttpEventType.ResponseError;
    _this.message = 'Unknown Error';
    _this.name = 'HttpErrorResponse';

    if (options) {
      _this.headers = new HttpHeaders(options.headers);
      _this.status = options.status || _this.status;
      _this.statusText = options.statusText || _this.statusText;
      _this.url = options.url || _this.url;
      _this.error = options.error || _this.error;
      _this.name = options.name || _this.name;
      _this.request = options.request || null;
    }

    return _this;
  }

  var _proto = HttpErrorResponse.prototype;

  _proto.clone = function clone(options) {
    options = Object.assign({
      headers: this.headers,
      status: this.status,
      statusText: this.statusText,
      url: this.url,
      error: this.error,
      message: this.message,
      name: this.name,
      request: this.request
    }, options || {});
    var clone = new HttpErrorResponse(options);
    return clone;
  };

  return HttpErrorResponse;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/*
export class HttpErrorResponse<T> extends HttpResponseBase implements Error {
    readonly name = 'HttpErrorResponse';
    readonly message: string;
    readonly error: any | null;
    readonly ok = false;
    constructor(errorResponse: IHttpErrorResponse, response: HttpResponse<T> | null = null) {
        super(errorResponse, 0, 'Unknown Error');
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpErrorResponse);
        }
        if (this.status >= 200 && this.status < 300) {
            this.message = `Http failure during parsing for ${errorResponse.url || '(unknown url)'}`;
        } else {
            this.message = `Http failure response for ${errorResponse.url || '(unknown url)'}: ${errorResponse.status} ${errorResponse.statusText}`;
        }
        this.error = errorResponse.error || null;
    }
}
*/var HttpResponse = /*#__PURE__*/function () {
  function HttpResponse(options) {
    this.status = 200;
    this.statusText = 'OK';
    this.type = HttpEventType.Response;
    this.body = null;

    if (options) {
      this.headers = new HttpHeaders(options.headers);
      this.status = options.status || this.status;
      this.statusText = options.statusText || this.statusText;
      this.url = options.url || this.url;
      this.body = options.body || this.body;
    }

    this.ok = this.status >= 200 && this.status < 300;
  }

  var _proto2 = HttpResponse.prototype;

  _proto2.clone = function clone(options) {
    options = Object.assign({
      headers: this.headers,
      status: this.status,
      statusText: this.statusText,
      url: this.url,
      ok: this.ok,
      type: this.type,
      body: this.body
    }, options || {});
    var clone = new HttpResponse(options);
    return clone;
  };

  return HttpResponse;
}();
/*
// !!!
export default class HttpResponse {
    data?: any;
    url: string = '';
    status: number = 0;
    statusText: string = '';
    ok: boolean = false;
    redirected: boolean = false;
    get static() {
        return this.url!.indexOf('.json') === this.url!.length - 5;
    }
    constructor(response: Response) {
        this.data = null;
        if (response) {
            this.url = response.url;
            this.status = response.status;
            this.statusText = response.statusText;
            this.ok = response.ok;
            this.redirected = response.redirected;
        }
    }
}
*/var HttpFetchHandler = /*#__PURE__*/function () {
  function HttpFetchHandler() {
    this.response_ = null;
  }

  var _proto = HttpFetchHandler.prototype;

  _proto.handle = function handle(request) {
    var _this = this;

    if (!request.method) {
      throw new Error("missing method");
    }

    var requestInfo = request.urlWithParams;
    var requestInit = request.toInitRequest(); // const fetchRequest: Request = request.toFetchRequest__();
    // console.log('fetchRequest', fetchRequest);
    // fetchRequest.headers.forEach((value, key) => console.log('HttpFetchHandler.handle', key, value));
    // request = request.clone({ headers: fetchRequest.headers });
    // console.log('HttpFetchHandler.handle', 'requestInfo', requestInfo, 'requestInit', requestInit);

    return rxjs.from(fetch(requestInfo, requestInit) // fetch(fetchRequest)
    .then(function (response) {
      return _this.getProgress(response, request);
    }).then(function (response) {
      return _this.getResponse(response, request);
    })).pipe(operators.catchError(function (error) {
      var errorResponse = {
        error: error
      };

      if (_this.response_) {
        errorResponse.headers = _this.response_.headers;
        errorResponse.status = _this.response_.status;
        errorResponse.statusText = _this.response_.statusText;
        errorResponse.url = _this.response_.url;
        errorResponse.request = request;
      }

      var httpErrorResponse = new HttpErrorResponse(errorResponse); // console.log('httpErrorResponse', httpErrorResponse);

      rxcomp.nextError$.next(httpErrorResponse);
      return rxjs.of(_this.response_); // return throwError(httpErrorResponse);
    }), operators.finalize(function () {
      _this.response_ = null;
    }));
  }
  /*
  onProgress(value: Uint8Array, done: boolean, request, reader, progress) {
      console.log("value:", value);
      if (value || done) {
          console.log("upload complete, request.bodyUsed:", request.bodyUsed);
          progress.value = progress.max;
          return reader.closed.then(() => fileUpload);
      };
      console.log("upload progress:", value);
      if (progress.value < file.size) {
          progress.value += 1;
      }
      return reader.read().then(({ value, done }) => this.onProgress(value, done, request, reader, progress));
  };
   getProgress_(request) {
      const uploadProgress = new ReadableStream({
          start(controller) {
              console.log("starting upload, request.bodyUsed:", request.bodyUsed);
              controller.enqueue(request.bodyUsed);
          },
          pull(controller) {
              if (request.bodyUsed) {
                  controller.close();
              }
              controller.enqueue(request.bodyUsed);
              console.log("pull, request.bodyUsed:", request.bodyUsed);
          },
          cancel(reason) {
              console.log(reason);
          }
      });
       const [fileUpload, reader] = [
          upload(request).catch(e => {
              reader.cancel();
              console.log(e);
              throw e
          }), uploadProgress.getReader()
      ];
  }
  */
  ;

  _proto.getProgress = function getProgress(response, request) {
    var _this2 = this;

    // console.log('HttpFetchHandler.setProgress', request.reportProgress, response.body);
    var clonedBody = response.clone().body;

    if (rxcomp.isPlatformBrowser && request.reportProgress && clonedBody) {
      var reader = clonedBody.getReader();
      var contentLength = response.headers && response.headers.has('Content-Length') ? +(response.headers.get('Content-Length') || 0) : 0;
      return new Promise(function (resolve, reject) {
        /*
        let receivedLength = 0; // received that many bytes at the moment
        const chunks: Uint8Array[] = []; // array of received binary chunks (comprises the body)
        const getChunk = () => {
            return reader.read().then(({ done, value }) => {
                if (!done) {
                    if (value) {
                        chunks.push(value);
                        receivedLength += value.length || 0;
                        console.log(`HttpFetchHandler.setProgress ${(receivedLength / contentLength * 100).toFixed(2)}% ${receivedLength} of ${contentLength}`);
                    }
                    getChunk();
                } else {
                    reader.cancel();
                    resolve(response);
                    if (false) {
                        // Step 4: concatenate chunks into single Uint8Array
                        const chunksAll = new Uint8Array(receivedLength); // (4.1)
                        let position = 0;
                        for (let chunk of chunks) {
                            chunksAll.set(chunk, position); // (4.2)
                            position += chunk.length;
                        }
                        // Step 5: decode into a string
                        const result = new TextDecoder("utf-8").decode(chunksAll);
                        // We're done!
                        const data = JSON.parse(result);
                        console.log('HttpFetchHandler.setProgress data', data);
                        resolve(response);
                    }
                }
            }).catch(error => {
                reader.cancel();
                reject(error);
            });
        };
        getChunk();
        */
        var progress = {
          progress: 0,
          percent: 0,
          current: 0,
          total: 0
        };

        var onProgress = function onProgress(value, done) {
          var receivedLength = progress.current;

          if (!done) {
            if (value) {
              receivedLength += value.length || 0;
              progress.total = contentLength;
              progress.current = receivedLength;
              progress.progress = receivedLength / contentLength;
              progress.percent = progress.progress * 100;
            } // console.log('progress', progress);


            return reader.read().then(function (_ref) {
              var value = _ref.value,
                  done = _ref.done;
              return onProgress(value, done);
            });
          } else {
            progress.total = contentLength;
            progress.current = contentLength;
            progress.progress = 1;
            progress.percent = 100; // console.log('progress', progress);

            return reader.closed.then(function () {
              return response.clone();
            });
          }
        };

        reader.read().then(function (_ref2) {
          var value = _ref2.value,
              done = _ref2.done;
          return onProgress(value, done);
        }).then(function (response) {
          _this2.response_ = new HttpResponse(response);

          if (typeof response[request.responseType] === 'function') {
            return response[request.responseType]().then(function (json) {
              _this2.response_ = new HttpResponse(Object.assign(_this2.response_, {
                body: json
              }));

              if (response.ok) {
                return resolve(_this2.response_);
              } else {
                return reject(_this2.response_);
              }
            });
          } else {
            return reject(_this2.response_);
          }
        }).catch(function (err) {
          return console.log("upload error:", err);
        });
      });
    } else {
      return Promise.resolve(response);
    }
  };

  _proto.getResponse = function getResponse(response, request) {
    this.response_ = new HttpResponse(response);

    if (rxcomp.isPlatformBrowser && request.reportProgress && response.body) {
      return Promise.resolve(this.response_);
    } else {
      return this.getResponseType(response, request);
    }
  };

  _proto.getResponseType = function getResponseType(response, request) {
    var _this3 = this;

    return new Promise(function (resolve, reject) {
      _this3.response_ = new HttpResponse(response);

      if (typeof response[request.responseType] === 'function') {
        return response[request.responseType]().then(function (json) {
          _this3.response_ = new HttpResponse(Object.assign(_this3.response_, {
            body: json
          }));

          if (response.ok) {
            return resolve(_this3.response_);
          } else {
            return reject(_this3.response_);
          }
        });
      } else {
        return reject(_this3.response_);
      }
    });
  };

  _proto.getReadableStream = function getReadableStream(response, request) {
    var reader = response.body.getReader();
    var readableStream = new ReadableStream({
      start: function start(controller) {
        // console.log("starting upload, request.bodyUsed:", request.bodyUsed);
        // controller.enqueue(request.bodyUsed);
        // The following function handles each data chunk
        var push = function push() {
          // "done" is a Boolean and value a "Uint8Array"
          reader.read().then(function (_ref3) {
            var done = _ref3.done,
                value = _ref3.value;

            // Is there no more data to read?
            if (done) {
              // Tell the browser that we have finished sending data
              controller.close();
              return;
            } // Get the data and send it to the browser via the controller


            controller.enqueue(value);
            push();
          });
        };

        push();
      }
    });
    return readableStream;
  };

  return HttpFetchHandler;
}();var HttpInterceptorHandler = /*#__PURE__*/function () {
  function HttpInterceptorHandler(next, interceptor) {
    this.next = next;
    this.interceptor = interceptor;
  }

  var _proto = HttpInterceptorHandler.prototype;

  _proto.handle = function handle(req) {
    return this.interceptor.intercept(req, this.next);
  };

  return HttpInterceptorHandler;
}();
var HttpInterceptors = [];
var fetchHandler = new HttpFetchHandler();
var HttpInterceptingHandler = /*#__PURE__*/function () {
  function HttpInterceptingHandler() {
    this.chain = null;
  }

  var _proto3 = HttpInterceptingHandler.prototype;

  _proto3.handle = function handle(req) {
    if (this.chain === null) {
      var interceptors = HttpInterceptors;
      this.chain = interceptors.reduceRight(function (next, interceptor) {
        return new HttpInterceptorHandler(next, interceptor);
      }, fetchHandler);
    }

    return this.chain.handle(req);
  };

  return HttpInterceptingHandler;
}();var HttpUrlEncodingCodec = /*#__PURE__*/function () {
  function HttpUrlEncodingCodec() {}

  var _proto = HttpUrlEncodingCodec.prototype;

  _proto.encodeKey = function encodeKey(key) {
    return encodeParam_(key);
  };

  _proto.encodeValue = function encodeValue(value) {
    return encodeParam_(value);
  };

  _proto.decodeKey = function decodeKey(key) {
    return decodeURIComponent(key);
  };

  _proto.decodeValue = function decodeValue(value) {
    return decodeURIComponent(value);
  };

  return HttpUrlEncodingCodec;
}();
var HttpParams = /*#__PURE__*/function () {
  function HttpParams(options, encoder) {
    if (encoder === void 0) {
      encoder = new HttpUrlEncodingCodec();
    }

    this.params_ = new Map();
    this.encoder = encoder;
    var params = this.params_;

    if (options instanceof HttpParams) {
      options.params_.forEach(function (value, key) {
        params.set(key, value);
      });
    } else if (typeof options === 'object') {
      Object.keys(options).forEach(function (key) {
        var value = options[key];
        params.set(key, Array.isArray(value) ? value : [value]);
      });
    } else if (typeof options === 'string') {
      parseRawParams_(params, options, this.encoder);
    } // ?updates=null&cloneFrom=null&encoder=%5Bobject%20Object%5D&params_=%5Bobject%20Map%5D

  }

  var _proto2 = HttpParams.prototype;

  _proto2.keys = function keys() {
    return Array.from(this.params_.keys());
  };

  _proto2.has = function has(key) {
    return this.params_.has(key);
  };

  _proto2.get = function get(key) {
    var value = this.params_.get(key);
    return value ? value[0] : null;
  };

  _proto2.getAll = function getAll(key) {
    return this.params_.get(key) || null;
  };

  _proto2.set = function set(key, value) {
    var clone = this.clone_();
    clone.params_.set(key, [value]);
    return clone;
  };

  _proto2.append = function append(key, value) {
    var clone = this.clone_();

    if (clone.has(key)) {
      var values = clone.params_.get(key) || [];
      values.push(value);
      clone.params_.set(key, values);
    } else {
      clone.params_.set(key, [value]);
    }

    return clone;
  };

  _proto2.delete = function _delete(key) {
    var clone = this.clone_();
    clone.params_.delete(key);
    return clone;
  };

  _proto2.toString = function toString() {
    var _this = this;

    return this.keys().map(function (key) {
      var values = _this.params_.get(key);

      return _this.encoder.encodeKey(key) + (values ? '=' + values.map(function (x) {
        return _this.encoder.encodeValue(x);
      }).join('&') : '');
    }).filter(function (keyValue) {
      return keyValue !== '';
    }).join('&');
  };

  _proto2.clone_ = function clone_() {
    var clone = new HttpParams(undefined, this.encoder);
    this.params_.forEach(function (value, key) {
      clone.params_.set(key, value);
    });
    return clone;
  };

  return HttpParams;
}();

function parseRawParams_(params, queryString, encoder) {
  if (queryString.length > 0) {
    var keyValueParams = queryString.split('&');
    keyValueParams.forEach(function (keyValue) {
      var index = keyValue.indexOf('=');

      var _ref = index == -1 ? [encoder.decodeKey(keyValue), ''] : [encoder.decodeKey(keyValue.slice(0, index)), encoder.decodeValue(keyValue.slice(index + 1))],
          key = _ref[0],
          value = _ref[1];

      var values = params.get(key) || [];
      values.push(value);
      params.set(key, values);
    });
  }

  return params;
}

function encodeParam_(v) {
  return encodeURIComponent(v).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/gi, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%2B/gi, '+').replace(/%3D/gi, '=').replace(/%3F/gi, '?').replace(/%2F/gi, '/');
}var HttpRequest = /*#__PURE__*/function () {
  function HttpRequest(method, url, third, fourth) {
    this.url = url;
    this.reportProgress = false;
    this.withCredentials = false;
    this.observe = 'body';
    this.responseType = 'json'; // !!! remove, rethink

    var isStaticFile = /\.(json|xml|txt)(\?.*)?$/.test(url);
    this.method = isStaticFile ? 'GET' : method.toUpperCase();
    var options;

    if (methodHasBody(this.method) || !!fourth) {
      this.body = third !== undefined ? third : null;
      options = fourth;
    } else {
      options = third;
    }

    if (options) {
      this.reportProgress = !!options.reportProgress;
      this.withCredentials = !!options.withCredentials;
      this.observe = options.observe || this.observe;

      if (options.responseType) {
        this.responseType = options.responseType;
      }

      if (options.headers) {
        this.headers = new HttpHeaders(options.headers);
      }

      if (options.params) {
        this.params = new HttpParams(options.params);
      }
    }

    if (!this.headers) {
      this.headers = new HttpHeaders();
    }

    if (!this.params) {
      this.params = new HttpParams();
    }

    var params = this.params.toString();
    var index = url.indexOf('?');
    var sep = index === -1 ? '?' : index < url.length - 1 ? '&' : '';
    this.urlWithParams = url + (params.length ? sep + params : params);
  }

  var _proto = HttpRequest.prototype;

  _proto.serializeBody = function serializeBody() {
    if (this.body === null) {
      return null;
    }

    if (isArrayBuffer(this.body) || isBlob$1(this.body) || isFormData(this.body) || typeof this.body === 'string') {
      return this.body;
    }

    if (this.body instanceof HttpParams) {
      return this.body.toString();
    }

    if (typeof this.body === 'object' || typeof this.body === 'boolean' || Array.isArray(this.body)) {
      return JSON.stringify(this.body);
    }

    return this.body.toString();
  };

  _proto.detectContentTypeHeader = function detectContentTypeHeader() {
    if (this.body === null) {
      return null;
    }

    if (isFormData(this.body)) {
      return null;
    }

    if (isBlob$1(this.body)) {
      return this.body.type || null;
    }

    if (isArrayBuffer(this.body)) {
      return null;
    }

    if (typeof this.body === 'string') {
      return 'text/plain';
    }

    if (this.body instanceof HttpParams) {
      return 'application/x-www-form-urlencoded;charset=UTF-8';
    }

    if (typeof this.body === 'object' || typeof this.body === 'number' || Array.isArray(this.body)) {
      return 'application/json';
    }

    return null;
  };

  _proto.toInitRequest = function toInitRequest() {
    return {
      method: this.method,
      headers: this.headers.serialize(),
      body: this.serializeBody(),
      mode: 'same-origin',
      credentials: 'same-origin',
      cache: 'default',
      redirect: 'error'
    };
  };

  _proto.toFetchRequest__ = function toFetchRequest__() {
    return new Request(this.urlWithParams, this.toInitRequest());
    /*
    Request.cache Read only
    Contains the cache mode of the request (e.g., default, reload, no-cache).
    Request.context Read only
    Contains the context of the request (e.g., audio, image, iframe, etc.)
    Request.credentials Read only
    Contains the credentials of the request (e.g., omit, same-origin, include). The default is same-origin.
    Request.destination Read only
    Returns a string from the RequestDestination enum describing the request's destination. This is a string indicating the type of content being requested.
    Request.headers Read only
    Contains the associated Headers object of the request.
    Request.integrity Read only
    Contains the subresource integrity value of the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).
    Request.method Read only
    Contains the request's method (GET, POST, etc.)
    Request.mode Read only
    Contains the mode of the request (e.g., cors, no-cors, same-origin, navigate.)
    Request.redirect Read only
    Contains the mode for how redirects are handled. It may be one of follow, error, or manual.
    Request.referrer Read only
    Contains the referrer of the request (e.g., client).
    Request.referrerPolicy Read only
    Contains the referrer policy of the request (e.g., no-referrer).
    Request.url Read only
    Contains the URL of the request.
    Request implements Body, so it also inherits the following properties:
    body Read only
    A simple getter used to expose a ReadableStream of the body contents.
    bodyUsed Read only
    Stores a Boolean that declares whether the body has been used in a response yet.
    */
  };

  _proto.clone = function clone(options) {
    options = Object.assign({
      headers: this.headers,
      reportProgress: this.reportProgress,
      params: this.params,
      responseType: this.responseType,
      withCredentials: this.withCredentials,
      observe: this.observe,
      body: this.body,
      url: this.url,
      method: this.method
    }, options || {});
    var clone = new HttpRequest(this.method, this.url, this.body, options);
    return clone;
  };

  return HttpRequest;
}();

function methodHasBody(method) {
  switch (method) {
    case 'DELETE':
    case 'GET':
    case 'HEAD':
    case 'OPTIONS':
    case 'JSONP':
      return false;

    default:
      return true;
  }
}

function isArrayBuffer(value) {
  return typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;
}

function isBlob$1(value) {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

function isFormData(value) {
  return typeof FormData !== 'undefined' && value instanceof FormData;
}var HttpClient = /*#__PURE__*/function () {
  function HttpClient() {}

  HttpClient.incrementPendingRequest = function incrementPendingRequest() {
    HttpClient.pendingRequests$.next(HttpClient.pendingRequests$.getValue() + 1);
  };

  HttpClient.decrementPendingRequest = function decrementPendingRequest() {
    HttpClient.pendingRequests$.next(HttpClient.pendingRequests$.getValue() - 1);
  };

  HttpClient.request$ = function request$(first, url, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var request;

    if (first instanceof HttpRequest) {
      request = first;
    } else {
      var headers = undefined;

      if (options.headers instanceof HttpHeaders) {
        headers = options.headers;
      } else {
        headers = new HttpHeaders(options.headers);
      }

      var params = undefined;

      if (options.params) {
        params = new HttpParams(options.params);
      }

      request = new HttpRequest(first, url, options.body !== undefined ? options.body : null, {
        headers: headers,
        params: params,
        reportProgress: options.reportProgress,
        responseType: options.responseType || 'json',
        withCredentials: options.withCredentials
      });
    } // console.log('HttpClient.request$', request);


    HttpClient.incrementPendingRequest();
    var events$ = rxjs.of(request).pipe(operators.concatMap(function (request) {
      return _this.handler.handle(request);
    }), // tap((response: HttpEvent<any>) => console.log('HttpClient.response', response)),
    operators.finalize(function () {
      return HttpClient.decrementPendingRequest();
    }));

    if (first instanceof HttpRequest || options.observe === 'events') {
      return events$.pipe(operators.catchError(function (error) {
        console.log('error', error);
        return rxjs.throwError(_this.getError(error, null, request));
      }));
    }

    var response$ = events$.pipe(operators.filter(function (event) {
      return event instanceof HttpResponse;
    }));
    var response_;
    var observe$ = response$.pipe(operators.map(function (response) {
      response_ = response;

      switch (options.observe || 'body') {
        case 'body':
          switch (request.responseType) {
            case 'arraybuffer':
              if (response.body !== null && !(response.body instanceof ArrayBuffer)) {
                throw new Error('Response is not an ArrayBuffer.');
              }

              return response.body;

            case 'blob':
              if (response.body !== null && !(response.body instanceof Blob)) {
                throw new Error('Response is not a Blob.');
              }

              return response.body;

            case 'text':
              if (response.body !== null && typeof response.body !== 'string') {
                throw new Error('Response is not a string.');
              }

              return response.body;

            case 'json':
            default:
              return response.body;
          }

        case 'response':
          return response;

        default:
          throw new Error("Unreachable: unhandled observe type " + options.observe + "}");
      }
    }), operators.catchError(function (error) {
      console.log('error', error);
      return rxjs.throwError(_this.getError(error, response_, request));
    }));
    return observe$;
  };

  HttpClient.delete$ = function delete$(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('DELETE', url, options);
  };

  HttpClient.get$ = function get$(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('GET', url, options);
  };

  HttpClient.head$ = function head$(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('HEAD', url, options);
  };

  HttpClient.jsonp$ = function jsonp$(url, callbackParam) {
    return this.request$('JSONP', url, {
      params: new HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
      observe: 'body',
      responseType: 'json'
    });
  };

  HttpClient.options$ = function options$(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('OPTIONS', url, options);
  };

  HttpClient.patch$ = function patch$(url, body, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('PATCH', url, optionsWithBody_(options, body));
  };

  HttpClient.post$ = function post$(url, body, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('POST', url, optionsWithBody_(options, body));
  };

  HttpClient.put$ = function put$(url, body, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('PUT', url, optionsWithBody_(options, body));
  };

  HttpClient.getError = function getError(error, response, request) {
    if (!error.status) {
      error.statusCode = (response == null ? void 0 : response.status) || 0;
    }

    if (!error.statusMessage) {
      error.statusMessage = (response == null ? void 0 : response.statusText) || 'Unknown Error';
    }

    var options = {
      error: error,
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      request: request
    };

    if (response) {
      options.headers = response.headers;
      options.status = options.status || response.status;
      options.statusText = options.statusText || response.statusText;
      options.url = response.url;
    }

    return new HttpErrorResponse(options);
  };

  return HttpClient;
}();
HttpClient.pendingRequests$ = new rxjs.BehaviorSubject(0); // static handler: HttpHandler = new HttpFetchHandler();

HttpClient.handler = new HttpInterceptingHandler();

function optionsWithBody_(options, body) {
  return Object.assign({}, options, {
    body: body
  });
}
/*

export class HttpClient {

    constructor(private handler: HttpHandler) { }

    request<R>(request: HttpRequest<any>): Observable<HttpEvent<R>>;
    request(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<ArrayBuffer>;
    request(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<Blob>;
    request(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<string>;
    request(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        params?: HttpParams | { [param: string]: string | string[] }, observe: 'events',
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpEvent<ArrayBuffer>>;
    request(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Blob>>;
    request(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpEvent<string>>;
    request(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        reportProgress?: boolean, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<any>>;
    request<R>(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        reportProgress?: boolean, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<R>>;
    request(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpResponse<ArrayBuffer>>;
    request(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Blob>>;
    request(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpResponse<string>>;
    request(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        reportProgress?: boolean, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Object>>;
    request<R>(method: string, url: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        reportProgress?: boolean, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<R>>;
    request(method: string, url: string, options?: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        responseType?: 'json',
        reportProgress?: boolean,
        withCredentials?: boolean,
    }): Observable<Object>;
    request<R>(method: string, url: string, options?: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        responseType?: 'json',
        reportProgress?: boolean,
        withCredentials?: boolean,
    }): Observable<R>;
    request(method: string, url: string, options?: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        params?: HttpParams | { [param: string]: string | string[] },
        observe?: HttpObserve,
        reportProgress?: boolean,
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
        withCredentials?: boolean,
    }): Observable<any>;
    request(first: string | HttpRequest<any>, url?: string, options: {
        body?: any,
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: HttpObserveType,
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
        withCredentials?: boolean,
    } = {}): Observable<any> {
        let request: HttpRequest<any>;
        if (first instanceof HttpRequest) {
            request = first;
        } else {
            let headers: HttpHeaders | undefined = undefined;
            if (options.headers instanceof HttpHeaders) {
                headers = options.headers;
            } else {
                headers = new HttpHeaders(options.headers);
            }
            let params: HttpParams | undefined = undefined;
            if (!!options.params) {
                if (options.params instanceof HttpParams) {
                    params = options.params;
                } else {
                    params = new HttpParams({ fromObject: options.params } as HttpParamsOptions);
                }
            }
            request = new HttpRequest(first, url!, (options.body !== undefined ? options.body : null), {
                headers,
                params,
                reportProgress: options.reportProgress,
                responseType: options.responseType || 'json',
                withCredentials: options.withCredentials,
            });
        }
        const events$: Observable<HttpEvent<any>> = of(request).pipe(concatMap((request: HttpRequest<any>) => this.handler.handle(request)));
        if (first instanceof HttpRequest || options.observe === 'events') {
            return events$;
        }
        const response$: Observable<HttpResponse<any>> = <Observable<HttpResponse<any>>>events$.pipe(
            filter((event: HttpEvent<any>) => event instanceof HttpResponse),
        );
        switch (options.observe || 'body') {
            case 'body':
                switch (request.responseType) {
                    case 'arraybuffer':
                        return response$.pipe(map((res: HttpResponse<any>) => {
                            if (res.body !== null && !(res.body instanceof ArrayBuffer)) {
                                throw new Error('Response is not an ArrayBuffer.');
                            }
                            return res.body;
                        }));
                    case 'blob':
                        return response$.pipe(map((res: HttpResponse<any>) => {
                            if (res.body !== null && !(res.body instanceof Blob)) {
                                throw new Error('Response is not a Blob.');
                            }
                            return res.body;
                        }));
                    case 'text':
                        return response$.pipe(map((res: HttpResponse<any>) => {
                            if (res.body !== null && typeof res.body !== 'string') {
                                throw new Error('Response is not a string.');
                            }
                            return res.body;
                        }));
                    case 'json':
                    default:
                        return response$.pipe(map((res: HttpResponse<any>) => res.body));
                }
            case 'response':
                return response$;
            default:
                throw new Error(`Unreachable: unhandled observe type ${options.observe}}`);
        }
    }

    delete(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<ArrayBuffer>;
    delete(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<Blob>;
    delete(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<string>;


    delete(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpEvent<ArrayBuffer>>;


    delete(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Blob>>;

    delete(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpEvent<string>>;

    delete(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Object>>;


    delete<T>(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<T>>;


    delete(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpResponse<ArrayBuffer>>;


    delete(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Blob>>;


    delete(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpResponse<string>>;


    delete(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Object>>;


    delete<T>(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<T>>;


    delete(url: string, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<Object>;


    delete<T>(url: string, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<T>;


    delete(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: HttpObserveType,
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
        withCredentials?: boolean,
    } = {}): Observable<any> {
        return this.request<any>('DELETE', url, options as any);
    }



    get(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<ArrayBuffer>;


    get(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<Blob>;


    get(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<string>;


    get(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpEvent<ArrayBuffer>>;


    get(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Blob>>;


    get(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpEvent<string>>;


    get(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Object>>;


    get<T>(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<T>>;


    get(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpResponse<ArrayBuffer>>;


    get(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Blob>>;


    get(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpResponse<string>>;


    get(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Object>>;


    get<T>(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<T>>;


    get(url: string, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<Object>;


    get<T>(url: string, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<T>;


    get(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: HttpObserveType,
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
        withCredentials?: boolean,
    } = {}): Observable<any> {
        return this.request<any>('GET', url, options as any);
    }



    head(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<ArrayBuffer>;



    head(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<Blob>;


    head(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<string>;


    head(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpEvent<ArrayBuffer>>;


    head(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Blob>>;


    head(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpEvent<string>>;


    head(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Object>>;


    head<T>(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<T>>;


    head(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpResponse<ArrayBuffer>>;


    head(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Blob>>;


    head(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpResponse<string>>;


    head(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Object>>;


    head<T>(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<T>>;


    head(url: string, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<Object>;


    head<T>(url: string, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<T>;


    head(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: HttpObserveType,
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
        withCredentials?: boolean,
    } = {}): Observable<any> {
        return this.request<any>('HEAD', url, options as any);
    }


    jsonp(url: string, callbackParam: string): Observable<Object>;


    jsonp<T>(url: string, callbackParam: string): Observable<T>;


    jsonp<T>(url: string, callbackParam: string): Observable<T> {
        return this.request<any>('JSONP', url, {
            params: new HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
            observe: 'body',
            responseType: 'json',
        });
    }


    options(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<ArrayBuffer>;


    options(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<Blob>;


    options(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<string>;


    options(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpEvent<ArrayBuffer>>;


    options(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Blob>>;


    options(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpEvent<string>>;


    options(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Object>>;


    options<T>(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<T>>;


    options(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpResponse<ArrayBuffer>>;


    options(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Blob>>;


    options(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpResponse<string>>;


    options(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Object>>;


    options<T>(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<T>>;


    options(url: string, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<Object>;


    options<T>(url: string, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<T>;


    options(url: string, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: HttpObserveType,
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
        withCredentials?: boolean,
    } = {}): Observable<any> {
        return this.request<any>('OPTIONS', url, options as any);
    }


    patch$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<ArrayBuffer>;


    patch$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<Blob>;


    patch$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<string>;



    patch$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpEvent<ArrayBuffer>>;


    patch$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Blob>>;


    patch$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpEvent<string>>;


    patch$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Object>>;


    patch<T>(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<T>>;


    patch$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpResponse<ArrayBuffer>>;


    patch$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Blob>>;


    patch$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpResponse<string>>;


    patch$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Object>>;


    patch<T>(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<T>>;


    patch$(url: string, body: any | null, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<Object>;


    patch<T>(url: string, body: any | null, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<T>;


    patch$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: HttpObserveType,
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
        withCredentials?: boolean,
    } = {}): Observable<any> {
        return this.request<any>('PATCH', url, optionsWithBody_<T>(options, body));
    }


    post$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<ArrayBuffer>;


    post$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<Blob>;


    post$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<string>;


    post$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpEvent<ArrayBuffer>>;


    post$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Blob>>;


    post$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpEvent<string>>;


    post$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Object>>;


    post<T>(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<T>>;


    post$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpResponse<ArrayBuffer>>;


    post$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Blob>>;


    post$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpResponse<string>>;


    post$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Object>>;


    post<T>(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<T>>;


    post$(url: string, body: any | null, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<Object>;


    post<T>(url: string, body: any | null, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<T>;


    post$(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: HttpObserveType,
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
        withCredentials?: boolean,
    } = {}): Observable<any> {
        return this.request<any>('POST', url, optionsWithBody_<T>(options, body));
    }


    put(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<ArrayBuffer>;


    put(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<Blob>;


    put(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<string>;


    put(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpEvent<ArrayBuffer>>;


    put(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Blob>>;


    put(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpEvent<string>>;


    put(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<Object>>;


    put<T>(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'events',
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpEvent<T>>;


    put(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'arraybuffer',
        withCredentials?: boolean,
    }): Observable<HttpResponse<ArrayBuffer>>;


    put(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'blob',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Blob>>;


    put(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean, responseType: 'text',
        withCredentials?: boolean,
    }): Observable<HttpResponse<string>>;


    put(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<Object>>;


    put<T>(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined, observe: 'response',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<HttpResponse<T>>;


    put(url: string, body: any | null, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<Object>;


    put<T>(url: string, body: any | null, options?: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    }): Observable<T>;


    put(url: string, body: any | null, options: {
        headers?: HttpHeaders | Headers | { [key: string]: string | string[] } | string | undefined,
        observe?: HttpObserveType,
        params?: HttpParams | { [param: string]: string | string[] },
        reportProgress?: boolean,
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
        withCredentials?: boolean,
    } = {}): Observable<any> {
        return this.request<any>('PUT', url, optionsWithBody_<T>(options, body));
    }
}

*/var Vars = {
  name: 'rxcomp-server',
  host: '',
  resource: '/',
  api: '/api',
  static: false,
  development: false,
  production: true
};
/*
export const STATIC = window.location.port === '40333' || window.location.host === 'actarian.github.io';
export const DEVELOPMENT = ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(window.location.host.split(':')[0]) !== -1;
export const PRODUCTION = !DEVELOPMENT;
export const ENV = {
    NAME: 'ws-events',
    STATIC,
    DEVELOPMENT,
    PRODUCTION,
    RESOURCE: '/Modules/Events/Client/docs/',
    STATIC_RESOURCE: './',
    API: '/api',
    STATIC_API: (DEVELOPMENT && !STATIC) ? '/Modules/Events/Client/docs/api' : './api',
};
export function getApiUrl(url, useStatic) {
    const base = (useStatic || STATIC) ? ENV.STATIC_API : ENV.API;
    const json = (useStatic || STATIC) ? '.json' : '';
    return `${base}${url}${json}`;
}
export function getResourceRoot() {
    return STATIC ? ENV.STATIC_RESOURCE : ENV.RESOURCE;
}
export function getSlug(url) {
    if (!url) {
        return url;
    }
    if (url.indexOf(`/${ENV.NAME}`) !== 0) {
        return url;
    }
    if (STATIC) {
        console.log(url);
        return url;
    }
    url = url.replace(`/${ENV.NAME}`, '');
    url = url.replace('.html', '');
    return `/it/it${url}`;
}
*/var CustomInterceptor = /*#__PURE__*/function () {
  function CustomInterceptor() {}

  var _proto = CustomInterceptor.prototype;

  _proto.intercept = function intercept(request, next) {

    var clonedRequest = request.clone({
      url: request.url
    }); // console.log('CustomInterceptor.clonedRequest', clonedRequest);

    return next.handle(clonedRequest);
  };

  return CustomInterceptor;
}();
var interceptor = new CustomInterceptor();
HttpInterceptors.push(interceptor);

var AppComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(AppComponent, _Component);

  function AppComponent() {
    var _this;

    _this = _Component.apply(this, arguments) || this;
    _this.items = [];
    _this.error = null;
    return _this;
  }

  var _proto2 = AppComponent.prototype;

  _proto2.onInit = function onInit() {
    var _this2 = this;

    // console.log('AppComponent.onInit', this);

    /*
    const payload = { query: `{ hello }` };
    */

    /*
    const payload = { query: `{ roll(dices: ${3}, sides: ${6}) }` };
    */

    /*
    const payload = {
        query: `query ($dices: Int!, $sides: Int) {
        roll(dices: $dices, sides: $sides)
    }`, variables: { dices: 3, sides: 6 }
    };
    */
    var payload = {
      query: "{ getTodos { id, title, completed } }"
    };
    /*
    HttpClient.post$<IResponseData>(`${Vars.host}${Vars.api}`, payload, {
        params: { query: `{ getTodos { id, title, completed } }` },
        reportProgress: true
    }).pipe(
    */

    var methodUrl = "" + Vars.host + Vars.api;
    console.log('methodUrl', methodUrl);
    HttpClient.post$(methodUrl, payload).pipe(operators.first()).subscribe(function (response) {
      _this2.items = response.data.getTodos;

      _this2.pushChanges(); // console.log('AppComponent.getTodos', this.items);

    }, function (error) {
      return console.log;
    }); // HttpService.get$(`https://jsonplaceholder.typicode.com/users/1/todos`).pipe(

    /*
    HttpService.get$(`${Vars.host}/data/todos.json`).pipe(
        first(),
    ).subscribe(response => {
        // console.log('AppComponent.items', response);
        this.items = response.data;
        this.pushChanges();
    });
    */

    rxcomp.errors$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (error) {
      _this2.error = error;

      _this2.pushChanges();
    });
  };

  _proto2.onClick = function onClick(item) {
    item.completed = !item.completed;
    this.pushChanges();
  };

  return AppComponent;
}(rxcomp.Component);
AppComponent.meta = {
  selector: '[app-component]'
};var AppModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(AppModule, _Module);

  function AppModule() {
    return _Module.apply(this, arguments) || this;
  }

  return AppModule;
}(rxcomp.Module);
AppModule.meta = {
  imports: [rxcomp.CoreModule],
  declarations: [],
  bootstrap: AppComponent
};// import fetch from 'cross-fetch';
function renderRequest$(request) {
  Vars.host = request.vars.host; // console.log('renderRequest$', request, Vars);

  return Server.bootstrap$(AppModule, request).pipe(operators.switchMap(function (response) {
    return HttpClient.pendingRequests$.pipe(operators.filter(function (count) {
      return count === 0;
    }), operators.map(function () {
      response.body = response.serialize();
      return response;
    }), operators.first());
  }));
}exports.renderRequest$=renderRequest$;Object.defineProperty(exports,'__esModule',{value:true});})));