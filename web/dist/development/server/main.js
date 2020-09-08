/**
 * @license rxcomp-server v1.0.0-beta.18
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('stream'),require('http'),require('url'),require('https'),require('zlib'),require('rxcomp-http'),require('rxjs/operators'),require('rxcomp'),require('rxjs'),require('htmlparser2'),require('rxcomp-router')):typeof define==='function'&&define.amd?define(['exports','stream','http','url','https','zlib','rxcomp-http','rxjs/operators','rxcomp','rxjs','htmlparser2','rxcomp-router'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.main={},g.Stream,g.http,g.Url,g.https,g.zlib,g.rxcomp.http,g.rxjs.operators,g.rxcomp,g.rxjs,g.htmlparser2,g.rxcomp.router));}(this,(function(exports, Stream, http, Url, https, zlib, rxcompHttp, operators, rxcomp, rxjs, htmlparser2, rxcompRouter){'use strict';Stream=Stream&&Object.prototype.hasOwnProperty.call(Stream,'default')?Stream['default']:Stream;http=http&&Object.prototype.hasOwnProperty.call(http,'default')?http['default']:http;Url=Url&&Object.prototype.hasOwnProperty.call(Url,'default')?Url['default']:Url;https=https&&Object.prototype.hasOwnProperty.call(https,'default')?https['default']:https;zlib=zlib&&Object.prototype.hasOwnProperty.call(zlib,'default')?zlib['default']:zlib;var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

class Blob {
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
				} else if (element instanceof Blob) {
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
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
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
			new Blob([], {
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
class Request {
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
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
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
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
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
			if (fetch.isRedirect(res.statusCode)) {
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
						resolve(fetch(new Request(locationURL, requestOpts)));
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
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;var lib=/*#__PURE__*/Object.freeze({__proto__:null,'default': fetch,Headers: Headers,Request: Request,Response: Response,FetchError: FetchError});var nodeFetch = getCjsExportFromNamespace(lib);var nodePonyfill = createCommonjsModule(function (module, exports) {
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
});var fetch$1 = nodePonyfill.fetch.bind({});

fetch$1.polyfill = true;

if (!commonjsGlobal.fetch) {
  commonjsGlobal.fetch = fetch$1;
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
}var path = require('path');

var fs = require('fs');

var FileService = /*#__PURE__*/function () {
  function FileService() {}

  FileService.exists = function exists(pathname) {
    return fs.existsSync(pathname);
  };

  FileService.exists$ = function exists$(pathname) {
    return rxjs.Observable.create(function (observer) {
      try {
        fs.access(pathname, fs.constants.F_OK, function (error) {
          var exists = !error;
          observer.next(exists);
          observer.complete();
        });
      } catch (error) {
        console.log('FileService.exists$.error', error);
        observer.next(false);
        observer.complete(); // observer.error(error);
      }
    });
  };

  FileService.readFile = function readFile(pathname) {
    var dirname = path.dirname(pathname);

    if (!fs.existsSync(dirname)) {
      return null;
    }

    return fs.readFileSync(pathname, 'utf8');
  };

  FileService.readFile$ = function readFile$(pathname) {
    return rxjs.Observable.create(function (observer) {
      try {
        fs.readFile(pathname, 'utf8', function (error, data) {
          // return observer.error(error);
          observer.next(error ? null : data);
          observer.complete();
        }); // sync
        // observer.next(this.readFile(pathname));
        // observer.complete();
      } catch (error) {
        console.log('FileService.readFile$.error', error);
        observer.next(null);
        observer.complete(); // observer.error(error);
      }
    });
  };

  FileService.writeFile = function writeFile(pathname, content) {
    try {
      var dirname = path.dirname(pathname);

      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
      }

      fs.writeFileSync(pathname, content, 'utf8');
      return true;
    } catch (error) {
      console.log('FileService.writeFile.error', error);
      return false;
    }
  };

  FileService.writeFile$ = function writeFile$(pathname, content) {
    return rxjs.Observable.create(function (observer) {
      try {
        var dirname = path.dirname(pathname);
        fs.mkdir(dirname, {
          recursive: true
        }, function (error) {
          if (error) {
            observer.next(false);
            observer.complete();
            return; // return observer.error(error);
          }

          fs.writeFile(pathname, content, 'utf8', function (error) {
            observer.next(!error);
            observer.complete();
          });
        }); // sync
        // this.writeFile(pathname, content);
        // observer.next(true);
        // observer.complete();
      } catch (error) {
        console.log('FileService.writeFile$.error', error);
        observer.next(false);
        observer.complete(); // observer.error(error);
      }
    });
  };

  FileService.unlinkFile = function unlinkFile(pathname) {
    try {
      if (fs.existsSync(pathname)) {
        fs.unlinkSync(pathname);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('FileService.unlinkFile.error', error);
      return false;
    }
  };

  FileService.unlinkFile$ = function unlinkFile$(pathname) {
    return rxjs.Observable.create(function (observer) {
      try {
        fs.unlink(pathname, function (error) {
          observer.next(!error);
          observer.complete(); // return observer.error(error);
        }); // sync
        // this.unlinkFile(pathname);
        // observer.next(true);
        // observer.complete();
      } catch (error) {
        console.log('FileService.unlinkFile$.error', error);
        observer.next(false); // observer.error(error);
      }
    });
  };

  return FileService;
}();var CacheMode;

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

  CacheItem.toData = function toData(cacheItem) {
    return rxcomp.Serializer.encode(cacheItem, [rxcomp.encodeJson]);
  };

  CacheItem.fromData = function fromData(data) {
    return new CacheItem(rxcomp.Serializer.decode(data, [rxcomp.decodeJson]));
  };

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

  CacheService.has = function has(type, filename) {
    if (type === void 0) {
      type = 'cache';
    }

    var has = false;

    try {
      var key = this.getPath(type, filename);

      switch (this.mode) {
        case CacheMode.File:
          has = FileService.exists(key); // has = this.hasFile(type, filename);

          break;

        case CacheMode.Memory:
        default:
          has = Object.keys(this.cache_).indexOf(key) !== -1;
      }
    } catch (error) {
      console.log('CacheService.has.error', error);
    }

    return has;
  };

  CacheService.get = function get(type, filename) {
    if (type === void 0) {
      type = 'cache';
    }

    var value = null,
        cacheItem;

    try {
      var key = this.getPath(type, filename);

      switch (this.mode) {
        case CacheMode.File:
          if (FileService.exists(key)) {
            var data = FileService.readFile(key);

            if (data) {
              cacheItem = CacheItem.fromData(data);

              if (cacheItem.expired) {
                FileService.unlinkFile(key);
              } else {
                var _cacheItem;

                value = (_cacheItem = cacheItem) == null ? void 0 : _cacheItem.value;
              }
            }
          }

          break;

        case CacheMode.Memory:
        default:
          if (Object.keys(this.cache_).indexOf(key) !== -1) {
            var _data = this.cache_[key];

            if (_data) {
              cacheItem = CacheItem.fromData(_data);

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
  };

  CacheService.set = function set(type, filename, value, maxAge, cacheControl) {
    if (type === void 0) {
      type = 'cache';
    }

    if (maxAge === void 0) {
      maxAge = 0;
    }

    if (cacheControl === void 0) {
      cacheControl = CacheControlType.Public;
    }

    try {
      var key = this.getPath(type, filename);
      var cacheItem = new CacheItem({
        value: value,
        maxAge: maxAge,
        cacheControl: cacheControl
      });
      var data;

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
  };

  CacheService.delete = function _delete(type, filename) {
    if (type === void 0) {
      type = 'cache';
    }

    try {
      var key = this.getPath(type, filename);

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
  };

  CacheService.has$ = function has$(type, filename) {
    var _this = this;

    if (type === void 0) {
      type = 'cache';
    }

    var key$ = rxjs.Observable.create(function (observer) {
      var key = _this.getPath(type, filename);

      observer.next(key);
      observer.complete();
    });
    return key$.pipe(operators.switchMap(function (key) {
      if (_this.mode === CacheMode.File) {
        return FileService.exists$(key);
      } else {
        return rxjs.of(Object.keys(_this.cache_).indexOf(key) !== -1);
      }
    }));
  };

  CacheService.get$ = function get$(type, filename) {
    var _this2 = this;

    if (type === void 0) {
      type = 'cache';
    }

    var key;
    var key$ = rxjs.Observable.create(function (observer) {
      key = _this2.getPath(type, filename);
      observer.next(key);
      observer.complete();
    });
    return key$.pipe(operators.switchMap(function (key) {
      if (_this2.mode === CacheMode.File) {
        return FileService.readFile$(key);
      } else {
        return rxjs.of(_this2.cache_[key]);
      }
    }), operators.switchMap(function (data) {
      var cacheItem = data ? CacheItem.fromData(data) : null;

      if (cacheItem && cacheItem.expired) {
        return FileService.unlinkFile$(key).pipe(operators.map(function () {
          return null;
        }));
      }

      return rxjs.of(cacheItem ? cacheItem.value : null);
    }));
  };

  CacheService.set$ = function set$(type, filename, value, maxAge, cacheControl) {
    var _this3 = this;

    if (type === void 0) {
      type = 'cache';
    }

    if (maxAge === void 0) {
      maxAge = 0;
    }

    if (cacheControl === void 0) {
      cacheControl = CacheControlType.Public;
    }

    var key, cacheItem, data;
    var data$ = rxjs.Observable.create(function (observer) {
      key = _this3.getPath(type, filename);
      cacheItem = new CacheItem({
        value: value,
        maxAge: maxAge,
        cacheControl: cacheControl
      });
      data = CacheItem.toData(cacheItem);
      observer.next(data);
      observer.complete();
    });
    return data$.pipe(operators.switchMap(function (data) {
      if (data) {
        if (_this3.mode === CacheMode.File) {
          return FileService.writeFile$(key, data);
        } else {
          _this3.cache_[key] = data;
          return rxjs.of(true);
        }
      } else {
        return rxjs.of(false);
      }
    }));
  };

  CacheService.delete$ = function delete$(type, filename) {
    var _this4 = this;

    if (type === void 0) {
      type = 'cache';
    }

    var key;
    var key$ = rxjs.Observable.create(function (observer) {
      key = _this4.getPath(type, filename);
      observer.next(key);
      observer.complete();
    });
    return key$.pipe(operators.switchMap(function (key) {
      if (_this4.mode === CacheMode.File) {
        return FileService.unlinkFile$(key);
      } else if (Object.keys(_this4.cache_).indexOf(key) !== -1) {
        delete _this4.cache_[key];
        return rxjs.of(true);
      } else {
        return rxjs.of(false);
      }
    }));
  };

  CacheService.getPath = function getPath(type, filename) {
    if (type === void 0) {
      type = 'cache';
    }

    var key = this.getKey(type, filename);
    return "" + this.folder + key;
  };

  CacheService.getKey = function getKey(type, filename) {
    if (type === void 0) {
      type = 'cache';
    }

    var key = (type + "-" + filename).toLowerCase();
    key = key.replace(/(\s+)|(\W+)/g, function () {
      return (arguments.length <= 1 ? undefined : arguments[1]) ? '' : '_';
    });
    return key;
  };

  return CacheService;
}();
CacheService.cache_ = {};
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
*/var RxDOMStringList = /*#__PURE__*/function (_Array) {
  _inheritsLoose(RxDOMStringList, _Array);

  function RxDOMStringList() {
    return _Array.apply(this, arguments) || this;
  }

  var _proto = RxDOMStringList.prototype;

  /*
  private list_: string[] = [];
  get length(): number {
      return this.list_.length;
  }
  */
  _proto.contains = function contains(string) {
    // return this.list_.indexOf(string) !== -1;
    return this.indexOf(string) !== -1;
  };

  _proto.item = function item(index) {
    // if (index > 0 && index < this.list_.length) {
    if (index > 0 && index < this.length) {
      // return this.list_[index];
      return this[index];
    } else {
      return null;
    }
  };

  return RxDOMStringList;
}( /*#__PURE__*/_wrapNativeSuper(Array));
var RxLocation = /*#__PURE__*/function () {
  function RxLocation() {
    /*
    hash: string = '';
    host: string = '';
    hostname: string = '';
    pathname: string = '';
    port: string = '';
    protocol: string = '';
    search: string = '';
    */
    this.hash_ = '';
    this.host_ = '';
    this.hostname_ = '';
    this.pathname_ = '';
    this.port_ = '';
    this.protocol_ = '';
    this.search_ = '';
    this.href_ = '';
    this.ancestorOrigins_ = new RxDOMStringList();
  }

  var _proto2 = RxLocation.prototype;

  _proto2.assign = function assign(url) {
    this.href = url;
  };

  _proto2.reload = function reload() {};

  _proto2.replace = function replace(url) {
    this.href = url;
  };

  _proto2.toString = function toString() {
    return this.href;
  };

  _createClass(RxLocation, [{
    key: "hash",
    get: function get() {
      return this.hash_;
    },
    set: function set(hash) {
      this.hash_ = hash;
      this.href = this.href;
    }
  }, {
    key: "host",
    get: function get() {
      return this.host_;
    },
    set: function set(host) {
      this.host_ = host;
      this.href = this.href;
    }
  }, {
    key: "hostname",
    get: function get() {
      return this.hostname_;
    },
    set: function set(hostname) {
      this.hostname_ = hostname;
      this.href = this.href;
    }
  }, {
    key: "pathname",
    get: function get() {
      return this.pathname_;
    },
    set: function set(pathname) {
      this.pathname_ = pathname;
      this.href = this.href;
    }
  }, {
    key: "port",
    get: function get() {
      return this.port_;
    },
    set: function set(port) {
      this.port_ = port;
      this.href = this.href;
    }
  }, {
    key: "protocol",
    get: function get() {
      return this.protocol_;
    },
    set: function set(protocol) {
      this.protocol_ = protocol;
      this.href = this.href;
    }
  }, {
    key: "search",
    get: function get() {
      return this.search_;
    },
    set: function set(search) {
      this.search_ = search;
      this.href = this.href;
    }
  }, {
    key: "href",
    get: function get() {
      var href = this.protocol + "//" + this.host + (this.port.length ? ":" + this.port : "") + this.pathname + this.search + this.hash;
      this.href_ = href;
      return href;
    },
    set: function set(href) {
      if (this.href_ !== href) {
        this.href_ = href;
        var location = rxcomp.getLocationComponents(href);
        this.protocol_ = location.protocol;
        this.host_ = location.host;
        this.hostname_ = location.hostname;
        this.port_ = location.port;
        this.pathname_ = location.pathname;
        this.search_ = location.search;
        this.hash_ = location.hash;
      }
    }
  }, {
    key: "origin",
    get: function get() {
      return this.protocol + "//" + this.host + (this.port.length ? ":" + this.port : "");
    }
  }, {
    key: "ancestorOrigins",
    get: function get() {
      return this.ancestorOrigins_;
    }
  }], [{
    key: "location",
    get: function get() {
      if (this.location_) {
        return this.location_;
      } else {
        return this.location_ = new RxLocation();
      }
    }
  }]);

  return RxLocation;
}();var RxHistory = /*#__PURE__*/function () {
  function RxHistory() {
    this.currentIndex_ = 0;
    this.history_ = [];
    this.scrollRestoration = 'auto';
  }

  var _proto = RxHistory.prototype;

  _proto.back = function back() {
    if (this.currentIndex_ > 0) {
      this.currentIndex_--;
      var item = this.history_[this.currentIndex_];
      if (item.url) RxLocation.location.href = item.url;
    }
  };

  _proto.forward = function forward() {
    if (this.currentIndex_ < this.history_.length - 1) {
      this.currentIndex_++;
      var item = this.history_[this.currentIndex_];
      if (item.url) RxLocation.location.href = item.url;
    }
  };

  _proto.go = function go(delta) {
    if (typeof delta === 'number') {
      var index = this.currentIndex_ + delta;

      if (index > 0 && index < this.history_.length) {
        var item = this.history_[index];
        if (item.url) RxLocation.location.href = item.url;
      }
    }
  };

  _proto.pushState = function pushState(data, title, url) {
    this.history_.push({
      data: data,
      title: title,
      url: url
    });
    this.currentIndex_ = this.history_.length - 1;
  };

  _proto.replaceState = function replaceState(data, title, url) {
    if (this.history_.length) {
      this.history_.splice(this.history_.length - 1, 1, {
        data: data,
        title: title,
        url: url
      });
    } else {
      this.history_.push({
        data: data,
        title: title,
        url: url
      });
    }

    this.currentIndex_ = this.history_.length - 1;
  };

  _createClass(RxHistory, [{
    key: "length",
    get: function get() {
      return this.history_.length;
    }
  }], [{
    key: "history",
    get: function get() {
      if (this.history_) {
        return this.history_;
      } else {
        return this.history_ = new RxHistory();
      }
    }
  }]);

  return RxHistory;
}();var RxNodeType;

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
  function RxStyle(node) {
    Object.defineProperty(this, 'node', {
      value: node,
      writable: false,
      enumerable: false
    });
    this.init();
  }

  var _proto2 = RxStyle.prototype;

  _proto2.init = function init() {
    var _this = this,
        _this$node$attributes;

    var keys = Object.keys(this);
    keys.forEach(function (key) {
      return delete _this[key];
    });

    if ((_this$node$attributes = this.node.attributes) == null ? void 0 : _this$node$attributes.style) {
      var regex = /([^:]+):([^;]+);?\s*/gm;
      var matches = [].concat(this.node.attributes.style.matchAll(regex));
      matches.forEach(function (match) {
        var key = match[1];
        var value = match[2];
        _this[key] = value;
      });
    }
  };

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
    var _this2 = this;

    this.node.attributes.style = Object.keys(this).map(function (key) {
      return key + ": " + _this2[key] + ";";
    }).join(' ');
  };

  return RxStyle;
}();
var RxClassList = /*#__PURE__*/function (_Array) {
  _inheritsLoose(RxClassList, _Array);

  function RxClassList() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _Array.call.apply(_Array, [this].concat(args)) || this;
  }

  var _proto3 = RxClassList.prototype;

  _proto3.init = function init() {
    this.length = 0; // console.log('RxClassList.node', this.node);

    if (this.node.hasAttribute('class')) {
      Array.prototype.push.apply(this, this.node.getAttribute('class').split(' ').map(function (name) {
        return name.trim();
      }));
    }
  };

  _proto3.slice = function slice(start, end) {
    var length = this.length;
    start = start || 0;
    start = start >= 0 ? start : Math.max(0, length + start);
    end = typeof end !== 'undefined' ? end : length;
    end = end >= 0 ? Math.min(end, length) : length + end;
    var size = end - start;
    var classList = size > 0 ? new RxClassList(size) : new RxClassList();
    var i;

    for (i = 0; i < size; i++) {
      classList[i] = this[start + i];
    }

    classList.node = this.node;
    /*
    // !!! from string ?
    if (this.charAt) {
        for (i = 0; i < size; i++) {
            classList[i] = this.charAt(from + i);
        }
    }
    */

    return classList;
  };

  _proto3.item = function item(index) {
    return this[index];
  };

  _proto3.contains = function contains(name) {
    return this.indexOf(name) !== -1;
  };

  _proto3.add = function add() {
    var _this3 = this;

    for (var _len2 = arguments.length, names = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      names[_key2] = arguments[_key2];
    }

    names.forEach(function (name) {
      if (_this3.indexOf(name) === -1) {
        _this3.push(name);
      }
    });
    this.serialize_(); // console.log('RxClasslist.add', `[${this.join(', ')}]`, this.node.attributes.class, names);
  };

  _proto3.remove = function remove() {
    var _this4 = this;

    for (var _len3 = arguments.length, names = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      names[_key3] = arguments[_key3];
    }

    names.forEach(function (name) {
      var index = _this4.indexOf(name);

      if (index !== -1) {
        _this4.splice(index, 1);
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
    this.node.setAttribute('class', this.join(' '));
  };

  _createClass(RxClassList, [{
    key: "node",
    get: function get() {
      return this.node_;
    },
    set: function set(node) {
      if (this.node_ !== node) {
        this.node_ = node;
        this.init();
      }
    }
  }]);

  return RxClassList;
}( /*#__PURE__*/_wrapNativeSuper(Array));
var RxElement = /*#__PURE__*/function (_RxNode) {
  _inheritsLoose(RxElement, _RxNode);

  function RxElement(parentNode, nodeName, attributes) {
    var _this5;

    if (parentNode === void 0) {
      parentNode = null;
    }

    if (attributes === void 0) {
      attributes = null;
    }

    _this5 = _RxNode.call(this, parentNode) || this;
    _this5.attributes = {};
    _this5.nodeType = RxNodeType.ELEMENT_NODE;
    _this5.nodeName = nodeName;

    if (attributes && typeof attributes === 'object') {
      _this5.attributes = attributes;
    } // console.log('RxElement.constructor', this);


    _this5.style = new RxStyle(_assertThisInitialized(_this5));
    var classList = new RxClassList();
    classList.node = _assertThisInitialized(_this5);
    _this5.classList = classList;
    _this5.childNodes = [];
    /*
    if (SKIP.indexOf(nodeName) === -1) {
        // console.log(parentNode.nodeName, '>', nodeName);
    }
    */

    return _this5;
  }

  var _proto4 = RxElement.prototype;

  _proto4.append = function append() {
    var _this6 = this;

    for (var _len4 = arguments.length, nodesOrDOMStrings = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      nodesOrDOMStrings[_key4] = arguments[_key4];
    }

    nodesOrDOMStrings = nodesOrDOMStrings.map(function (nodeOrDomString) {
      var node;

      if (typeof nodeOrDomString === 'string') {
        node = new RxText(_this6, nodeOrDomString);
      } else {
        node = nodeOrDomString;
        node.parentNode = _this6;
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

  _proto4.appendChild = function appendChild(newChild) {
    if (newChild.parentNode) {
      newChild.parentNode.removeChild(newChild);
    }

    if (isRxDocumentFragment(newChild)) {
      this.append.apply(this, newChild.childNodes);
    } else {
      this.append(newChild);
    }

    return newChild;
  };

  _proto4.prepend = function prepend() {
    var _this7 = this;

    for (var _len5 = arguments.length, nodesOrDOMStrings = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      nodesOrDOMStrings[_key5] = arguments[_key5];
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
    var _this8 = this;

    for (var _len6 = arguments.length, nodesOrDOMStrings = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      nodesOrDOMStrings[_key6] = arguments[_key6];
    }

    var nodes = nodesOrDOMStrings.map(function (nodeOrDomString) {
      var node;

      if (typeof nodeOrDomString === 'string') {
        node = new RxText(_this8, nodeOrDomString);
      } else {
        node = nodeOrDomString;
        node.parentNode = _this8;
      }

      return node;
    });
    this.childNodes = nodes;
  };

  _proto4.querySelectorAll = function querySelectorAll(selector) {
    var queries = getQueries(selector);

    var nodes = _querySelectorAll(queries, this.childNodes);

    return nodes && nodes.length ? nodes : null;
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
    var _this9 = this;

    var attributes = '';
    var keys = Object.keys(this.attributes);

    if (keys.length) {
      attributes = ' ' + keys.map(function (k) {
        return k + "=\"" + _this9.attributes[k] + "\"";
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
        if (node.nodeType === RxNodeType.ELEMENT_NODE) {
          children.push(node);
        }

        node = nodes[i++];
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
      for (var _iterator = _createForOfIteratorHelperLoose(this.childNodes), _step; !(_step = _iterator()).done;) {
        var node = _step.value;

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
      var _this10 = this;

      var doc = parse(html);
      var childNodes = doc.childNodes.map(function (n) {
        n.parentNode = _this10;
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
    var _this11;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this11 = _RxNode2.call(this, parentNode) || this;
    _this11.nodeType = RxNodeType.TEXT_NODE;
    _this11.nodeValue = String(nodeValue); // console.log('RxText', nodeValue);

    return _this11;
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
    var _this13;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this13 = _RxNode4.call(this, parentNode) || this;
    _this13.nodeType = RxNodeType.COMMENT_NODE;
    _this13.nodeValue = String(nodeValue);
    return _this13;
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
    var _this14;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this14 = _RxNode5.call(this, parentNode) || this;
    _this14.nodeType = RxNodeType.PROCESSING_INSTRUCTION_NODE;
    _this14.nodeValue = String(nodeValue);
    return _this14;
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
    var _this15;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this15 = _RxNode6.call(this, parentNode) || this;
    _this15.nodeType = RxNodeType.DOCUMENT_TYPE_NODE;
    _this15.nodeValue = String(nodeValue);
    return _this15;
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
    var _this16;

    _this16 = _RxElement.call(this, null, '#document-fragment') || this;
    _this16.nodeType = RxNodeType.DOCUMENT_FRAGMENT_NODE;
    _this16.childNodes = [];
    return _this16;
  }

  return RxDocumentFragment;
}(RxElement);
var RxDocument = /*#__PURE__*/function (_RxElement2) {
  _inheritsLoose(RxDocument, _RxElement2);

  /*
      readonly characterSet: string; // Returns document's encoding.
      readonly charset: string; // Gets or sets the character set used to encode the object.
      readonly compatMode: string; // Gets a value that indicates whether standards-compliant mode is switched on for the object.
      readonly contentType: string; // Returns document's content type.
      readonly currentScript: HTMLOrSVGScriptElement | null; // Returns the script element, or the SVG script element, that is currently executing, as long as the element represents a classic script. In the case of reentrant script execution, returns the one that most recently started executing amongst those that have not yet finished executing.
      readonly defaultView: (WindowProxy & typeof globalThis) | null; // Returns null if the Document is not currently executing a script or SVG script element (e.g., because the running script is an event handler, or a timeout), or if the currently executing script or SVG script element represents a module script.
      readonly documentElement: HTMLElement; // Gets a reference to the root node of the document.
      readonly documentURI: string; // Returns document's URL.
      readonly embeds: HTMLCollectionOf<HTMLEmbedElement>; // Retrieves a collection of all embed objects in the document.
      readonly forms: HTMLCollectionOf<HTMLFormElement>; // Retrieves a collection, in source order, of all form objects in the document.
      readonly fullscreenEnabled: boolean; // Returns true if document has the ability to display elements fullscreen and fullscreen is supported, or false otherwise.
      readonly head: HTMLHeadElement; // Returns the head element.
      readonly hidden: boolean;
      readonly images: HTMLCollectionOf<HTMLImageElement>; // Retrieves a collection, in source order, of img objects in the document.
      readonly implementation: DOMImplementation; // Gets the implementation object of the current document.
      readonly inputEncoding: string; // Returns the character encoding used to create the webpage that is loaded into the document object.
      readonly lastModified: string; // Gets the date that the page was last modified, if the page supplies one.
      readonly links: HTMLCollectionOf<HTMLAnchorElement | HTMLAreaElement>; // Retrieves a collection of all a objects that specify the href property and all area objects in the document.
      readonly origin: string; // Returns document's origin.
      readonly ownerDocument: null;
      readonly plugins: HTMLCollectionOf<HTMLEmbedElement>; // Return an HTMLCollection of the embed elements in the Document.
      readonly readyState: DocumentReadyState; // Retrieves a value that indicates the current state of the object.
      readonly referrer: string; // Gets the URL of the location that referred the user to the current page.
      readonly scripts: HTMLCollectionOf<HTMLScriptElement>; // Retrieves a collection of all script objects in the document.
      readonly scrollingElement: Element | null;
      readonly timeline: DocumentTimeline;
      readonly visibilityState: VisibilityState;
      */
  function RxDocument() {
    var _this17;

    _this17 = _RxElement2.call(this, null, '#document') || this;
    _this17.location_ = RxLocation.location;
    _this17.nodeType = RxNodeType.DOCUMENT_NODE;
    _this17.childNodes = [];
    return _this17;
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

  _createClass(RxDocument, [{
    key: "location",
    get: function get() {
      return this.location_;
    }
  }, {
    key: "URL",
    get: function get() {
      return this.location_.href;
    }
  }, {
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
    key: "head",
    get: function get() {
      // console.log('childNodes', this.childNodes);
      var head = this.documentElement.childNodes.find(function (x) {
        return isRxElement(x) && x.nodeName === 'head';
      });

      if (!head) {
        head = new RxElement(this.documentElement, 'head');
        this.documentElement.append(head);
      }

      return head;
    }
  }, {
    key: "body",
    get: function get() {
      var body = this.childNodes.find(function (x) {
        return isRxElement(x) && x.nodeName === 'body';
      });

      if (!body) {
        body = new RxElement(this.documentElement, 'body');
        this.documentElement.append(body);
      }

      return body;
    }
  }, {
    key: "title",
    get: function get() {
      var title = this.head.childNodes.find(function (x) {
        return isRxElement(x) && x.nodeName === 'title';
      });

      if (title) {
        return title.innerText;
      } else {
        return null;
      }
    },
    set: function set(nodeValue) {
      var title = this.head.childNodes.find(function (x) {
        return isRxElement(x) && x.nodeName === 'title';
      });

      if (!title) {
        title = new RxElement(this.head, 'title');
      }

      title.innerText = String(nodeValue);
    }
  }, {
    key: "documentElement",
    get: function get() {
      var element = this.firstElementChild;

      if (!element) {
        element = new RxElement(this, 'html');
      }

      return element;
    }
  }]);

  return RxDocument;
}(RxElement);
var RxWindow = /*#__PURE__*/function () {
  function RxWindow(options) {
    if (options) {
      Object.assign(this, options);
    }
  }
  /* tslint:disable:no-unused-variable */


  var _proto11 = RxWindow.prototype;

  _proto11.alert = function alert(message) {};

  _proto11.blur = function blur() {};

  _proto11.close = function close() {};

  _proto11.confirm = function confirm(message) {
    return false;
  };

  _proto11.departFocus = function departFocus(navigationReason, origin) {};

  _proto11.focus = function focus() {};

  _proto11.getComputedStyle = function getComputedStyle(elt, pseudoElt) {} // CSSStyleDeclaration {}
  ;

  _proto11.getMatchedCSSRules = function getMatchedCSSRules(elt, pseudoElt) {} // CSSRuleList {}
  ;

  _proto11.getSelection = function getSelection() {
    return null;
  };

  _proto11.matchMedia = function matchMedia(query) {} // MediaQueryList { }
  ;

  _proto11.moveBy = function moveBy(x, y) {};

  _proto11.moveTo = function moveTo(x, y) {};

  _proto11.msWriteProfilerMark = function msWriteProfilerMark(profilerMarkName) {};

  _proto11.open = function open(url, target, features, replace) {
    return null;
  };

  _proto11.postMessage = function postMessage(message, targetOrigin, transfer) {};

  _proto11.print = function print() {};

  _proto11.prompt = function prompt(message, _default) {
    return null;
  };

  _proto11.resizeBy = function resizeBy(x, y) {};

  _proto11.resizeTo = function resizeTo(x, y) {};

  _proto11.scroll = function scroll() {};

  _proto11.scrollBy = function scrollBy() {};

  _proto11.scrollTo = function scrollTo() {};

  _proto11.stop = function stop() {};

  _proto11.webkitCancelAnimationFrame = function webkitCancelAnimationFrame(handle) {};

  _proto11.webkitConvertPointFromNodeToPage = function webkitConvertPointFromNodeToPage(node, pt) {} // WebKitPoint { }
  ;

  _proto11.webkitConvertPointFromPageToNode = function webkitConvertPointFromPageToNode(node, pt) {} // WebKitPoint { }
  ;

  _proto11.webkitRequestAnimationFrame = function webkitRequestAnimationFrame(callback) {
    return 0;
  };

  _proto11.addEventListener = function addEventListener(type, listener, options) {};

  _proto11.removeEventListener = function removeEventListener(type, listener, options) {};

  _proto11.oncompassneedscalibration = function oncompassneedscalibration(event) {
    return null;
  };

  _proto11.ondevicelight = function ondevicelight(event) {
    return null;
  };

  _proto11.ondevicemotion = function ondevicemotion(event) {};

  _proto11.ondeviceorientation = function ondeviceorientation(event) {};

  _proto11.ondeviceorientationabsolute = function ondeviceorientationabsolute(event) {};

  _proto11.onmousewheel = function onmousewheel(event) {};

  _proto11.onmsgesturechange = function onmsgesturechange(event) {};

  _proto11.onmsgesturedoubletap = function onmsgesturedoubletap(event) {};

  _proto11.onmsgestureend = function onmsgestureend(event) {};

  _proto11.onmsgesturehold = function onmsgesturehold(event) {};

  _proto11.onmsgesturestart = function onmsgesturestart(event) {};

  _proto11.onmsgesturetap = function onmsgesturetap(event) {};

  _proto11.onmsinertiastart = function onmsinertiastart(event) {};

  _proto11.onmspointercancel = function onmspointercancel(event) {};

  _proto11.onmspointerdown = function onmspointerdown(event) {};

  _proto11.onmspointerenter = function onmspointerenter(event) {};

  _proto11.onmspointerleave = function onmspointerleave(event) {};

  _proto11.onmspointermove = function onmspointermove(event) {};

  _proto11.onmspointerout = function onmspointerout(event) {};

  _proto11.onmspointerover = function onmspointerover(event) {};

  _proto11.onmspointerup = function onmspointerup(event) {};

  _proto11.onreadystatechange = function onreadystatechange(event) {};

  _proto11.onvrdisplayactivate = function onvrdisplayactivate(event) {};

  _proto11.onvrdisplayblur = function onvrdisplayblur(event) {};

  _proto11.onvrdisplayconnect = function onvrdisplayconnect(event) {};

  _proto11.onvrdisplaydeactivate = function onvrdisplaydeactivate(event) {};

  _proto11.onvrdisplaydisconnect = function onvrdisplaydisconnect(event) {};

  _proto11.onvrdisplayfocus = function onvrdisplayfocus(event) {};

  _proto11.onvrdisplaypointerrestricted = function onvrdisplaypointerrestricted(event) {};

  _proto11.onvrdisplaypointerunrestricted = function onvrdisplaypointerunrestricted(event) {};

  _proto11.onvrdisplaypresentchange = function onvrdisplaypresentchange(event) {};

  return RxWindow;
}();
/*
global: [Circular],
clearInterval: [Function: clearInterval],
clearTimeout: [Function: clearTimeout],
setInterval: [Function: setInterval],
setTimeout: [Function: setTimeout] { [Symbol(util.promisify.custom)]: [Function] },
queueMicrotask: [Function: queueMicrotask],
clearImmediate: [Function: clearImmediate],
setImmediate: [Function: setImmediate] {
[Symbol(util.promisify.custom)]: [Function]
},
__extends: [Function: __extends],
__assign: [Function: assign],
__rest: [Function: __rest],
__decorate: [Function: __decorate],
__param: [Function: __param],
__metadata: [Function: __metadata],
__awaiter: [Function: __awaiter],
__generator: [Function: __generator],
__exportStar: [Function: __exportStar],
__createBinding: [Function],
__values: [Function: __values],
__read: [Function: __read],
__spread: [Function: __spread],
__spreadArrays: [Function: __spreadArrays],
__await: [Function: __await],
__asyncGenerator: [Function: __asyncGenerator],
__asyncDelegator: [Function: __asyncDelegator],
__asyncValues: [Function: __asyncValues],
__makeTemplateObject: [Function: __makeTemplateObject],
__importStar: [Function: __importStar],
__importDefault: [Function: __importDefault],
__classPrivateFieldGet: [Function: __classPrivateFieldGet],
__classPrivateFieldSet: [Function: __classPrivateFieldSet],
fetch: [Function: bound fetch] { polyfill: true },
Response: undefined,
Headers: undefined,
Request: undefined
*/

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
      // console.log(nodeName);
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

      for (var _iterator2 = _createForOfIteratorHelperLoose(matches), _step2; !(_step2 = _iterator2()).done;) {
        var match = _step2.value;

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

function _querySelectorAll(queries, childNodes, query, nodes) {
  if (query === void 0) {
    query = null;
  }

  if (nodes === void 0) {
    nodes = [];
  }

  if (query || queries.length) {
    query = query || queries.shift();

    for (var _iterator3 = _createForOfIteratorHelperLoose(childNodes), _step3; !(_step3 = _iterator3()).done;) {
      var child = _step3.value;

      if (child instanceof RxElement) {
        if (matchSelectors(child, query.selectors)) {
          // console.log(query);
          if (queries.length) {
            var results = _querySelectorAll(queries, child.childNodes);

            if (results) {
              Array.prototype.push.apply(nodes, results);
            }
          } else {
            nodes.push(child);
          }
        } else if (!query.inner) {
          var _results = _querySelectorAll(queries, child.childNodes, query);

          if (_results) {
            Array.prototype.push.apply(nodes, _results);
          }
        }
      }
    }
  }

  return nodes.length ? nodes : null;
}

function _querySelector(queries, childNodes, query) {
  if (query === void 0) {
    query = null;
  }

  var node = null;

  if (query || queries.length) {
    query = query || queries.shift();

    for (var _iterator4 = _createForOfIteratorHelperLoose(childNodes), _step4; !(_step4 = _iterator4()).done;) {
      var child = _step4.value;

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
}var ServerRequest = function ServerRequest(options) {
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
  this.maxAge = 3600;
  this.cacheControl = CacheControlType.Public;

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
  Server.bootstrap = function bootstrap(moduleFactory, request) {
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

    if (!(request == null ? void 0 : request.template)) {
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


    var document = this.resolveGlobals(request);
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
    // console.log('Server.serialize');
    if (this.document instanceof RxDocument) {
      var serialized = this.document.serialize(); // console.log('serialized', serialized);

      return serialized;
    } else {
      throw new rxcomp.ModuleError('document is not an instance of RxDocument');
    }
  };

  Server.resolveGlobals = function resolveGlobals(request) {
    var url = request.url;
    var location = RxLocation.location;
    location.assign(url);
    global.location = location;
    var history = RxHistory.history;
    history.replaceState(null, '', location.origin);
    global.history = history;
    var documentOrHtml = request.template;
    var document = typeof documentOrHtml === 'string' ? parse(documentOrHtml) : documentOrHtml;
    this.document = document; // !!!

    global.document = this.document;
    history.replaceState(null, document.title || '', location.origin);
    global.window = global.self = new RxWindow({
      document: document,
      history: history,
      location: location,
      devicePixelRatio: 1
    }); // console.log('window', window);

    return this.document;
  };

  return Server;
}(rxcomp.Platform);
Server.render$ = render$;
Server.template$ = template$;
Server.bootstrap$ = bootstrap$;
function render$(iRequest, renderRequest$) {
  var request;
  var request$ = rxjs.Observable.create(function (observer) {
    request = new ServerRequest(iRequest);
    observer.next(request);
    observer.complete();
  });
  return request$.pipe(operators.switchMap(function (request) {
    return fromCache$(request);
  }), operators.switchMap(function (response) {
    console.log('NodeJs.Server.render$.fromCache', 'route', request.url, !!response);

    if (response) {
      return rxjs.of(response);
    } else {
      return fromRenderRequest$(request, renderRequest$);
    }
  }));
}
function fromCache$(request) {
  if (request.vars.cacheMode) {
    CacheService.mode = request.vars.cacheMode;
  }

  if (request.vars.cache) {
    CacheService.folder = request.vars.cache;
  }

  return CacheService.get$('render', request.url);
}
function fromRenderRequest$(request, renderRequest$) {
  return template$(request).pipe(operators.switchMap(function (template) {
    request.template = template;
    return renderRequest$(request);
  }), operators.switchMap(function (response) {
    return CacheService.set$('render', request.url, response, response.maxAge, response.cacheControl).pipe(operators.switchMap(function () {
      return rxjs.of(response);
    }));
  }));
}
function template$(request) {
  var templateSrc$ = rxjs.Observable.create(function (observer) {
    var src = request.vars.template;

    if (src) {
      observer.next(src);
      observer.complete();
    } else {
      observer.error(new Error('ServerError: you must provide a template path'));
    }
  });
  return templateSrc$.pipe(operators.switchMap(function (src) {
    return FileService.readFile$(src);
  }), operators.switchMap(function (template) {
    return template ? rxjs.of(template) : rxjs.throwError(new Error("ServerError: missing template at path " + request.vars.template));
  }));
}
function bootstrap$(moduleFactory, request) {
  // console.log('Server.bootstrap$', request);
  return rxjs.Observable.create(function (observer) {
    if (!request.template) {
      return observer.error(new Error('ServerError: missing template'));
    }

    try {
      // const module = Server.bootstrap(moduleFactory, request.template);
      Server.bootstrap(moduleFactory, request);

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
}var AppComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(AppComponent, _Component);

  function AppComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = AppComponent.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.add('init');
  };

  return AppComponent;
}(rxcomp.Component);
AppComponent.meta = {
  selector: '[app-component]'
};var CustomRequestInterceptor = /*#__PURE__*/function () {
  function CustomRequestInterceptor() {}

  var _proto = CustomRequestInterceptor.prototype;

  _proto.intercept = function intercept(request, next) {

    return next.handle(request);
  };

  return CustomRequestInterceptor;
}();
var CustomResponseInterceptor = /*#__PURE__*/function () {
  function CustomResponseInterceptor() {}

  var _proto2 = CustomResponseInterceptor.prototype;

  _proto2.intercept = function intercept(request, next) {
    return next.handle(request).pipe(operators.tap(function (event) {
      if (event instanceof rxcompHttp.HttpResponse) {
        console.log('CustomResponseInterceptor.status', event.status);
        console.log('CustomResponseInterceptor.filter', request.params.get('filter'));
      }
    }));
  };

  return CustomResponseInterceptor;
}();var NotFoundComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(NotFoundComponent, _Component);

  function NotFoundComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = NotFoundComponent.prototype;

  _proto.onInit = function onInit() {// console.log('NotFoundComponent.onInit');
  };

  return NotFoundComponent;
}(rxcomp.Component);
NotFoundComponent.meta = {
  selector: '[not-found-component]',
  template:
  /* html */
  "\n        <div class=\"page-not-found\">\n            <div class=\"title\">Not Found</div>\n        </div>\n        "
};var TodolistItemComponent = /*#__PURE__*/function (_View) {
  _inheritsLoose(TodolistItemComponent, _View);

  function TodolistItemComponent() {
    return _View.apply(this, arguments) || this;
  }

  var _proto = TodolistItemComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    // console.log('TodolistItemComponent.onInit', this.route);
    rxjs.combineLatest(this.route.data$, this.route.params$).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (datas) {
      _this.title = datas[0].title;
      _this.itemId = datas[1].itemId; // this.pushChanges(); // !!! not needed;
      // console.log('TodolistItemComponent', datas);
    });
  };

  _proto.onEnter = function onEnter(node) {
    return rxcompRouter.transition$(function (complete) {
      gsap.set(node, {
        opacity: 0
      });
      gsap.to(node, {
        opacity: 1,
        duration: 0.6,
        ease: Power3.easeOut,
        onComplete: function onComplete() {
          complete(true);
        }
      });
    });
  };

  _proto.onExit = function onExit(node) {
    return rxcompRouter.transition$(function (complete) {
      gsap.set(node, {
        opacity: 1
      });
      gsap.to(node, {
        opacity: 0,
        duration: 0.6,
        ease: Power3.easeOut,
        onComplete: function onComplete() {
          complete(true);
        }
      });
    });
  };

  return TodolistItemComponent;
}(rxcompRouter.View);
TodolistItemComponent.meta = {
  selector: '[detail-component]',
  template:
  /* html */
  "\n        <div class=\"page-detail\">\n            <div class=\"title\">Todolist Item {{itemId}}</div>\n        </div>\n        "
};var Vars = {
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
        // console.log(url);
        return url;
    }
    url = url.replace(`/${ENV.NAME}`, '');
    url = url.replace('.html', '');
    return `/it/it${url}`;
}
*/var TodolistComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(TodolistComponent, _Component);

  function TodolistComponent() {
    var _this;

    _this = _Component.apply(this, arguments) || this;
    _this.items = [];
    _this.error = null;
    return _this;
  }

  var _proto = TodolistComponent.prototype;

  _proto.onInit = function onInit() {
    var _this2 = this;
    var payload = {
      query: "{ getTodos { id, title, completed } }"
    };
    var methodUrl = "" + Vars.host + Vars.api; // console.log('TodolistComponent.onInit', this);

    {
      rxcompHttp.HttpService.post$(methodUrl, payload, {
        params: {
          query: "{ getTodos { id, title, completed } }"
        },
        reportProgress: false
      }).pipe(operators.first()).subscribe(function (response) {
        _this2.items = response.data.getTodos;

        _this2.pushChanges(); // console.log('TodolistComponent.getTodos', this.items);

      }, console.warn);
    }

    var route = this.host.route;

    if (route) {
      route.data$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (data) {
        _this2.title = data.title; // this.pushChanges(); // !! not needed;
        // console.log('TodolistComponent', data);
      });
    } // generic errors


    rxcomp.errors$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (error) {
      _this2.error = error;

      _this2.pushChanges();
    });
  };

  _proto.onClick = function onClick(item) {
    item.completed = !item.completed;
    this.pushChanges();
  };

  return TodolistComponent;
}(rxcomp.Component);
TodolistComponent.meta = {
  selector: '[todolist-component]',
  hosts: {
    host: rxcompRouter.RouterOutletStructure
  },
  template:
  /* html */
  "\n        <div class=\"page-todolist\">\n\t\t\t<div class=\"title\">{{title}}</div>\n\t\t\t<!-- {{items | json}} -->\n\t\t\t<ul class=\"list\">\n\t\t\t\t<li class=\"list__item\" *for=\"let item of items\" [class]=\"{ completed: item.completed }\" [style]=\"{ 'border-color': item.completed ? 'red' : 'black' }\">\n\t\t\t\t\t<div class=\"title\" [routerLink]=\"['/todolist', item.id]\" [innerHTML]=\"item.title\"></div>\n\t\t\t\t\t<div class=\"completed\" (click)=\"onClick(item)\" [innerHTML]=\"item.completed\"></div>\n\t\t\t\t\t<!-- !!! debug -->\n\t\t\t\t\t<!-- <div class=\"completed\" (click)=\"onClick(item)\">{{item.completed}}</div> -->\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t<div *if=\"error\">\n\t\t\t\t<span>error => {{error | json}}</span>\n\t\t\t</div>\n        </div>\n        "
};var AppModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(AppModule, _Module);

  function AppModule() {
    return _Module.apply(this, arguments) || this;
  }

  return AppModule;
}(rxcomp.Module);
AppModule.meta = {
  imports: [rxcomp.CoreModule, rxcompHttp.HttpModule.useInterceptors([CustomRequestInterceptor, CustomResponseInterceptor]), rxcompRouter.RouterModule.forRoot([{
    path: '',
    redirectTo: '/todolist',
    pathMatch: 'full'
  }, {
    path: 'todolist',
    component: TodolistComponent,
    data: {
      title: 'Todolist'
    }
  }, {
    path: 'todolist/:itemId',
    component: TodolistItemComponent,
    data: {
      title: 'Todolist Item'
    }
  }, {
    path: '**',
    component: NotFoundComponent
  }])],
  declarations: [TodolistComponent, TodolistItemComponent, NotFoundComponent],
  bootstrap: AppComponent
};// import fetch from 'cross-fetch';
function renderRequest$(request) {
  Vars.host = request.vars.host; // console.log('renderRequest$', request, Vars);

  return Server.bootstrap$(AppModule, request).pipe(operators.switchMap(function (response) {
    return rxcompHttp.HttpService.pendingRequests$.pipe(operators.filter(function (count) {
      return count === 0;
    }), operators.map(function () {
      response.body = response.serialize();
      return response;
    }), operators.first());
  }));
}exports.renderRequest$=renderRequest$;Object.defineProperty(exports,'__esModule',{value:true});})));