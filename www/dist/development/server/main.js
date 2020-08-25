/**
 * @license rxcomp-server v1.0.0-beta.13
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('stream'),require('http'),require('url'),require('https'),require('zlib'),require('rxjs/operators'),require('rxcomp'),require('rxjs'),require('htmlparser2')):typeof define==='function'&&define.amd?define(['exports','stream','http','url','https','zlib','rxjs/operators','rxcomp','rxjs','htmlparser2'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.main={},g.Stream,g.http,g.Url,g.https,g.zlib,g.rxjs.operators,g.rxcomp,g.rxjs,g.htmlparser2));}(this,(function(exports, Stream, http, Url, https, zlib, operators, rxcomp, rxjs, htmlparser2){'use strict';Stream=Stream&&Object.prototype.hasOwnProperty.call(Stream,'default')?Stream['default']:Stream;http=http&&Object.prototype.hasOwnProperty.call(http,'default')?http['default']:http;Url=Url&&Object.prototype.hasOwnProperty.call(Url,'default')?Url['default']:Url;https=https&&Object.prototype.hasOwnProperty.call(https,'default')?https['default']:https;zlib=zlib&&Object.prototype.hasOwnProperty.call(zlib,'default')?zlib['default']:zlib;var operators__default='default'in operators?operators['default']:operators;var rxcomp__default='default'in rxcomp?rxcomp['default']:rxcomp;var rxjs__default='default'in rxjs?rxjs['default']:rxjs;var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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
}/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */
var _extendStatics = function extendStatics(d, b) {
  _extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) {
      if (b.hasOwnProperty(p)) d[p] = b[p];
    }
  };

  return _extendStatics(d, b);
};

function __extends(d, b) {
  _extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var _assign = function __assign() {
  _assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return _assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}
function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}
var __createBinding = Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
};
function __exportStar(m, exports) {
  for (var p in m) {
    if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
  }
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function next() {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
      ar.push(r.value);
    }
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) {
    ar = ar.concat(__read(arguments[i]));
  }

  return ar;
}
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;

  function verb(n) {
    if (g[n]) i[n] = function (v) {
      return new Promise(function (a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }

  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }

  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }

  function fulfill(value) {
    resume("next", value);
  }

  function reject(value) {
    resume("throw", value);
  }

  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function () {
    return this;
  }, i;

  function verb(n, f) {
    i[n] = o[n] ? function (v) {
      return (p = !p) ? {
        value: __await(o[n](v)),
        done: n === "return"
      } : f ? f(v) : v;
    } : f;
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
}

var __setModuleDefault = Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
}
function __importDefault(mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
}
function __classPrivateFieldGet(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return privateMap.get(receiver);
}
function __classPrivateFieldSet(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }

  privateMap.set(receiver, value);
  return value;
}var tslib_es6=/*#__PURE__*/Object.freeze({__proto__:null,__extends: __extends,get __assign(){return _assign},__rest: __rest,__decorate: __decorate,__param: __param,__metadata: __metadata,__awaiter: __awaiter,__generator: __generator,__createBinding: __createBinding,__exportStar: __exportStar,__values: __values,__read: __read,__spread: __spread,__spreadArrays: __spreadArrays,__await: __await,__asyncGenerator: __asyncGenerator,__asyncDelegator: __asyncDelegator,__asyncValues: __asyncValues,__makeTemplateObject: __makeTemplateObject,__importStar: __importStar,__importDefault: __importDefault,__classPrivateFieldGet: __classPrivateFieldGet,__classPrivateFieldSet: __classPrivateFieldSet});var httpEvent = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpEventType = void 0;
  var HttpEventType;

  (function (HttpEventType) {
    HttpEventType[HttpEventType["Sent"] = 0] = "Sent";
    HttpEventType[HttpEventType["UploadProgress"] = 1] = "UploadProgress";
    HttpEventType[HttpEventType["ResponseHeader"] = 2] = "ResponseHeader";
    HttpEventType[HttpEventType["DownloadProgress"] = 3] = "DownloadProgress";
    HttpEventType[HttpEventType["Response"] = 4] = "Response";
    HttpEventType[HttpEventType["User"] = 5] = "User";
    HttpEventType[HttpEventType["ResponseError"] = 6] = "ResponseError";
  })(HttpEventType = exports.HttpEventType || (exports.HttpEventType = {}));
});var httpHeaders = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpHeaders = void 0;

  var HttpHeaders =
  /** @class */
  function () {
    function HttpHeaders(options) {
      var _this = this;

      var _a;

      this.headers_ = new Map();
      var headers = this.headers_;

      if (options instanceof HttpHeaders) {
        options.headers_.forEach(function (value, key) {
          headers.set(key, value);
        });
      } else if (typeof ((_a = options) === null || _a === void 0 ? void 0 : _a.forEach) === 'function') {
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

    HttpHeaders.prototype.has = function (key) {
      return this.headers_.has(key);
    };

    HttpHeaders.prototype.get = function (key) {
      var values = this.headers_.get(key);
      return values ? values.join(', ') : null;
    };

    HttpHeaders.prototype.set = function (key, value) {
      var clone = this.clone_();
      clone.headers_.set(key, value.split(', '));
      return clone;
    };

    HttpHeaders.prototype.append = function (key, value) {
      var clone = this.clone_();
      var values = clone.headers_.has(key) ? clone.headers_.get(key) || [] : [];
      values.push(value);
      clone.headers_.set(key, values);
      return clone;
    };

    HttpHeaders.prototype.delete = function (key) {
      var clone = this.clone_();
      clone.headers_.delete(key);
      return clone;
    };

    HttpHeaders.prototype.forEach = function (callback, thisArg) {
      var _this = this;

      this.headers_.forEach(function (v, k) {
        callback(v.join(', '), k, _this);
      });
    };

    HttpHeaders.prototype.serialize = function () {
      var headers = [];
      this.forEach(function (value, key) {
        headers.push([key, value]);
      });
      return headers;
    };

    HttpHeaders.prototype.toObject = function () {
      var headers = {};
      this.forEach(function (value, key) {
        headers[key] = value;
      });
      return headers;
    };

    HttpHeaders.prototype.clone_ = function () {
      var clone = new HttpHeaders();
      this.headers_.forEach(function (value, key) {
        clone.headers_.set(key, value);
      });
      return clone;
    };

    return HttpHeaders;
  }();

  exports.HttpHeaders = HttpHeaders;
});var httpErrorResponse = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpErrorResponse = void 0;

  var HttpErrorResponse =
  /** @class */
  function (_super) {
    tslib_es6.__extends(HttpErrorResponse, _super);

    function HttpErrorResponse(options) {
      var _this = _super.call(this, (options === null || options === void 0 ? void 0 : options.message) || 'Unknown Error') || this;

      _this.status = 0;
      _this.statusText = 'Unknown Error';
      _this.ok = false;
      _this.type = httpEvent.HttpEventType.ResponseError;
      _this.message = 'Unknown Error';
      _this.name = 'HttpErrorResponse';

      if (options) {
        _this.headers = new httpHeaders.HttpHeaders(options.headers);
        _this.status = options.status || _this.status;
        _this.statusText = options.statusText || _this.statusText;
        _this.url = options.url || _this.url;
        _this.error = options.error || _this.error;
        _this.name = options.name || _this.name;
        _this.request = options.request || null;
      }

      return _this;
    }

    HttpErrorResponse.prototype.clone = function (options) {
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
  }(Error);

  exports.HttpErrorResponse = HttpErrorResponse;
});var httpResponse = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpResponseBase = exports.HttpResponse = exports.HttpHeaderResponse = void 0;

  var HttpHeaderResponse =
  /** @class */
  function () {
    function HttpHeaderResponse(options) {
      this.status = 200;
      this.statusText = 'OK';
      this.type = httpEvent.HttpEventType.ResponseHeader;

      if (options) {
        this.headers = new httpHeaders.HttpHeaders(options.headers);
        this.status = options.status || this.status;
        this.statusText = options.statusText || this.statusText;
        this.url = options.url || this.url;
      }

      this.ok = this.status >= 200 && this.status < 300;
    }

    HttpHeaderResponse.prototype.clone = function (options) {
      options = Object.assign({
        headers: this.headers,
        status: this.status,
        statusText: this.statusText,
        url: this.url,
        ok: this.ok,
        type: this.type
      }, options || {});
      var clone = new HttpHeaderResponse(options);
      return clone;
    };

    return HttpHeaderResponse;
  }();

  exports.HttpHeaderResponse = HttpHeaderResponse;

  var HttpResponse =
  /** @class */
  function () {
    function HttpResponse(options) {
      this.status = 200;
      this.statusText = 'OK';
      this.type = httpEvent.HttpEventType.Response;
      this.body = null;

      if (options) {
        this.headers = new httpHeaders.HttpHeaders(options.headers);
        this.status = options.status || this.status;
        this.statusText = options.statusText || this.statusText;
        this.url = options.url || this.url;
        this.body = options.body || this.body;
      }

      this.ok = this.status >= 200 && this.status < 300;
    }

    HttpResponse.prototype.clone = function (options) {
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

    HttpResponse.prototype.toObject = function () {
      var response = {};
      response.url = this.url;
      response.headers = this.headers.toObject();
      response.status = this.status;
      response.statusText = this.statusText;
      response.ok = this.ok;
      response.type = this.type;
      response.body = this.body;
      return response;
    };

    return HttpResponse;
  }();

  exports.HttpResponse = HttpResponse;

  var HttpResponseBase =
  /** @class */
  function () {
    function HttpResponseBase(options, defaultStatus, defaultStatusText) {
      if (defaultStatus === void 0) {
        defaultStatus = 200;
      }

      if (defaultStatusText === void 0) {
        defaultStatusText = 'OK';
      }

      this.status = 200;
      this.statusText = 'OK';
      this.headers = options.headers || new httpHeaders.HttpHeaders();
      this.status = options.status !== undefined ? options.status : defaultStatus;
      this.statusText = options.statusText || defaultStatusText;
      this.url = options.url || undefined;
      this.ok = this.status >= 200 && this.status < 300;
    }

    return HttpResponseBase;
  }();

  exports.HttpResponseBase = HttpResponseBase;
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
  */
});var httpFetch_handler = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpFetchHandler = void 0;

  var HttpFetchHandler =
  /** @class */
  function () {
    function HttpFetchHandler() {
      this.response_ = null;
    }

    HttpFetchHandler.prototype.handle = function (request) {
      var _this = this;

      if (!request.method) {
        throw new Error("missing method");
      }

      var requestInfo = request.urlWithParams;
      var requestInit = request.toInitRequest(); // console.log('fetchRequest', fetchRequest);
      // fetchRequest.headers.forEach((value, key) => console.log('HttpFetchHandler.handle', key, value));
      // request = request.clone({ headers: fetchRequest.headers });
      // console.log('HttpFetchHandler.handle', 'requestInfo', requestInfo, 'requestInit', requestInit);
      // hydrate

      var stateKey = rxcomp__default.TransferService.makeKey(request.transferKey); // console.log('HttpFetchHandler.get', 'stateKey', stateKey, 'isPlatformBrowser', isPlatformBrowser, 'hydrate', request.hydrate);

      if (rxcomp__default.isPlatformBrowser && request.hydrate && rxcomp__default.TransferService.has(stateKey)) {
        var cached = rxcomp__default.TransferService.get(stateKey); // !!! <T>			
        // console.log('HttpFetchHandler', cached);

        rxcomp__default.TransferService.remove(stateKey);
        return rxjs__default.of(cached); // hydrate
      } else {
        return rxjs__default.from(fetch(requestInfo, requestInit) // fetch(fetchRequest)
        .then(function (response) {
          return _this.getProgress(response, request);
        }).then(function (response) {
          return _this.getResponse(response, request);
        })).pipe( // hydrate
        operators__default.tap(function (response) {
          // console.log('HttpFetchHandler.set', 'isPlatformServer', isPlatformServer, 'hydrate', request.hydrate, response);
          if (rxcomp__default.isPlatformServer && request.hydrate) {
            rxcomp__default.TransferService.set(stateKey, response.toObject());
          }
        }), // hydrate
        operators__default.catchError(function (error) {
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

          var httpErrorResponse$1 = new httpErrorResponse.HttpErrorResponse(errorResponse); // console.log('httpErrorResponse', httpErrorResponse);

          rxcomp__default.nextError$.next(httpErrorResponse$1);
          return rxjs__default.of(_this.response_); // return throwError(httpErrorResponse);
        }), operators__default.finalize(function () {
          _this.response_ = null;
        }));
      }
    };
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


    HttpFetchHandler.prototype.getProgress = function (response, request) {
      var _this = this; // console.log('HttpFetchHandler.setProgress', request.reportProgress, response.body);


      var clonedBody = response.clone().body;

      if (rxcomp__default.isPlatformBrowser && request.reportProgress && clonedBody) {
        var reader_1 = clonedBody.getReader();
        var contentLength_1 = response.headers && response.headers.has('Content-Length') ? +(response.headers.get('Content-Length') || 0) : 0;
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
                progress.total = contentLength_1;
                progress.current = receivedLength;
                progress.progress = receivedLength / contentLength_1;
                progress.percent = progress.progress * 100;
              } // console.log('progress', progress);


              return reader_1.read().then(function (_a) {
                var value = _a.value,
                    done = _a.done;
                return onProgress(value, done);
              });
            } else {
              progress.total = contentLength_1;
              progress.current = contentLength_1;
              progress.progress = 1;
              progress.percent = 100; // console.log('progress', progress);

              return reader_1.closed.then(function () {
                return response.clone();
              });
            }
          };

          reader_1.read().then(function (_a) {
            var value = _a.value,
                done = _a.done;
            return onProgress(value, done);
          }).then(function (response) {
            _this.response_ = new httpResponse.HttpResponse(response);

            if (typeof response[request.responseType] === 'function') {
              return response[request.responseType]().then(function (json) {
                _this.response_ = new httpResponse.HttpResponse(Object.assign(_this.response_, {
                  body: json
                }));

                if (response.ok) {
                  return resolve(_this.response_);
                } else {
                  return reject(_this.response_);
                }
              });
            } else {
              return reject(_this.response_);
            }
          }).catch(function (err) {
            return console.log("upload error:", err);
          });
        });
      } else {
        return Promise.resolve(response);
      }
    };

    HttpFetchHandler.prototype.getResponse = function (response, request) {
      this.response_ = new httpResponse.HttpResponse(response);

      if (rxcomp__default.isPlatformBrowser && request.reportProgress && response.body) {
        return Promise.resolve(this.response_);
      } else {
        return this.getResponseType(response, request);
      }
    };

    HttpFetchHandler.prototype.getResponseType = function (response, request) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.response_ = new httpResponse.HttpResponse(response);

        if (typeof response[request.responseType] === 'function') {
          return response[request.responseType]().then(function (json) {
            _this.response_ = new httpResponse.HttpResponse(Object.assign(_this.response_, {
              body: json
            }));

            if (response.ok) {
              return resolve(_this.response_);
            } else {
              return reject(_this.response_);
            }
          });
        } else {
          return reject(_this.response_);
        }
      });
    };

    HttpFetchHandler.prototype.getReadableStream = function (response, request) {
      var reader = response.body.getReader();
      var readableStream = new ReadableStream({
        start: function start(controller) {
          // console.log("starting upload, request.bodyUsed:", request.bodyUsed);
          // controller.enqueue(request.bodyUsed);
          // The following function handles each data chunk
          var push = function push() {
            // "done" is a Boolean and value a "Uint8Array"
            reader.read().then(function (_a) {
              var done = _a.done,
                  value = _a.value; // Is there no more data to read?

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
  }();

  exports.HttpFetchHandler = HttpFetchHandler;
});var httpXhr_handler = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpXhrHandler = void 0;
  var XSSI_PREFIX = /^\)\]\}',?\n/;

  var HttpXhrHandler =
  /** @class */
  function () {
    function HttpXhrHandler() {}

    HttpXhrHandler.prototype.handle = function (request) {
      if (!request.method) {
        throw new Error("missing method");
      }

      if (request.method === 'JSONP') {
        throw new Error("Attempted to construct Jsonp request without JsonpClientModule installed.");
      }

      console.log('HttpXhrHandler.request', request);
      return new rxjs__default.Observable(function (observer) {
        var xhr = new XMLHttpRequest();
        var requestInfo = request.urlWithParams;
        var requestInit = request.toInitRequest();

        if (!requestInit.method) {
          throw new Error("missing method");
        } // hydrate


        var stateKey = rxcomp__default.TransferService.makeKey(request.transferKey);

        if (rxcomp__default.isPlatformBrowser && request.hydrate && rxcomp__default.TransferService.has(stateKey)) {
          var cached = rxcomp__default.TransferService.get(stateKey); // !!! <T>

          rxcomp__default.TransferService.remove(stateKey);
          observer.next(cached);
          observer.complete();
          return; // hydrate
        } else {
          xhr.open(requestInit.method, requestInfo);

          if (request.withCredentials) {
            xhr.withCredentials = true;
          }

          var headers = request.headers;

          if (!headers.has('Accept')) {
            headers.set('Accept', 'application/json, text/plain, */*');
          }

          if (!headers.has('Content-Type')) {
            var detectedType = request.detectContentTypeHeader();

            if (detectedType !== null) {
              headers.set('Content-Type', detectedType);
            }
          }

          console.log('HttpXhrHandler.contentType', headers.get('Content-Type'));
          headers.forEach(function (value, name) {
            return xhr.setRequestHeader(name, value);
          });

          if (request.responseType) {
            xhr.responseType = request.responseType !== 'json' ? request.responseType : 'text';
          }

          var body_1 = request.serializeBody();
          var headerResponse_1 = null;

          var partialFromXhr_1 = function partialFromXhr_1() {
            if (headerResponse_1 !== null) {
              return headerResponse_1;
            }

            var status = xhr.status === 1223 ? 204 : xhr.status;
            var statusText = xhr.statusText || 'OK';
            var headers = new httpHeaders.HttpHeaders(xhr.getAllResponseHeaders());
            var url = getResponseUrl_(xhr) || request.url;
            headerResponse_1 = new httpResponse.HttpHeaderResponse({
              headers: headers,
              status: status,
              statusText: statusText,
              url: url
            });
            return headerResponse_1;
          };

          var onLoad_1 = function onLoad_1() {
            var _a = partialFromXhr_1(),
                headers = _a.headers,
                status = _a.status,
                statusText = _a.statusText,
                url = _a.url;

            var body = null;

            if (status !== 204) {
              body = typeof xhr.response === 'undefined' ? xhr.responseText : xhr.response;
            }

            if (status === 0) {
              status = !!body ? 200 : 0;
            }

            var ok = status >= 200 && status < 300;

            if (request.responseType === 'json' && typeof body === 'string') {
              var originalBody = body;
              body = body.replace(XSSI_PREFIX, '');

              try {
                body = body !== '' ? JSON.parse(body) : null;
              } catch (error) {
                body = originalBody;

                if (ok) {
                  ok = false;
                  body = {
                    error: error,
                    text: body
                  };
                }
              }
            }

            if (ok) {
              var response = new httpResponse.HttpResponse({
                body: body,
                headers: headers,
                status: status,
                statusText: statusText,
                url: url
              }); // hydrate

              if (rxcomp__default.isPlatformServer && request.hydrate) {
                rxcomp__default.TransferService.set(stateKey, response);
              } // hydrate


              observer.next(response);
              observer.complete();
            } else {
              var options = {
                error: new Error(statusText),
                headers: headers,
                status: status,
                statusText: statusText,
                url: url,
                request: request
              };
              var httpErrorResponse$1 = new httpErrorResponse.HttpErrorResponse(options); // console.log('httpErrorResponse', httpErrorResponse);

              rxcomp__default.nextError$.next(httpErrorResponse$1); // return of(null);

              observer.error(httpErrorResponse$1);
            }
          };

          var onError_1 = function onError_1(error) {
            var url = partialFromXhr_1().url;
            var statusText = xhr.statusText || 'Unknown Error';
            var headers = new httpHeaders.HttpHeaders(xhr.getAllResponseHeaders());
            var options = {
              error: new Error(statusText),
              headers: headers,
              status: xhr.status || 0,
              statusText: statusText,
              url: url,
              request: request
            };
            var httpErrorResponse$1 = new httpErrorResponse.HttpErrorResponse(options); // console.log('httpErrorResponse', httpErrorResponse);

            rxcomp__default.nextError$.next(httpErrorResponse$1); // return of(null);

            observer.error(httpErrorResponse$1);
          };

          var sentHeaders_1 = false;

          var onDownProgress_1 = function onDownProgress_1(event) {
            if (!sentHeaders_1) {
              observer.next(partialFromXhr_1());
              sentHeaders_1 = true;
            }

            var progressEvent = {
              type: httpEvent.HttpEventType.DownloadProgress,
              loaded: event.loaded
            };

            if (event.lengthComputable) {
              progressEvent.total = event.total;
            }

            if (request.responseType === 'text' && !!xhr.responseText) {
              progressEvent.partialText = xhr.responseText;
            }

            console.log(progressEvent);
            observer.next(progressEvent);
          };

          var onUpProgress_1 = function onUpProgress_1(event) {
            var progress = {
              type: httpEvent.HttpEventType.UploadProgress,
              loaded: event.loaded
            };

            if (event.lengthComputable) {
              progress.total = event.total;
            }

            observer.next(progress);
          };

          xhr.addEventListener('load', onLoad_1);
          xhr.addEventListener('error', onError_1);

          if (request.reportProgress) {
            xhr.addEventListener('progress', onDownProgress_1);

            if (body_1 !== null && xhr.upload) {
              xhr.upload.addEventListener('progress', onUpProgress_1);
            }
          }

          xhr.send(body_1);
          observer.next({
            type: httpEvent.HttpEventType.Sent
          });
          return function () {
            xhr.removeEventListener('error', onError_1);
            xhr.removeEventListener('load', onLoad_1);

            if (request.reportProgress) {
              xhr.removeEventListener('progress', onDownProgress_1);

              if (body_1 !== null && xhr.upload) {
                xhr.upload.removeEventListener('progress', onUpProgress_1);
              }
            }

            if (xhr.readyState !== xhr.DONE) {
              xhr.abort();
            }
          };
        }
      });
    };

    return HttpXhrHandler;
  }();

  exports.HttpXhrHandler = HttpXhrHandler;

  function getResponseUrl_(xhr) {
    if ('responseURL' in xhr && xhr.responseURL) {
      return xhr.responseURL;
    }

    if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
      return xhr.getResponseHeader('X-Request-URL');
    }

    return null;
  }
});var httpInterceptor = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.jsonpCallbackContext = exports.interceptingHandler = exports.HttpInterceptingHandler = exports.xhrHandler = exports.fetchHandler = exports.NoopInterceptor = exports.HttpInterceptors = exports.HttpInterceptorHandler = void 0;

  var HttpInterceptorHandler =
  /** @class */
  function () {
    function HttpInterceptorHandler(next, interceptor) {
      this.next = next;
      this.interceptor = interceptor;
    }

    HttpInterceptorHandler.prototype.handle = function (req) {
      return this.interceptor.intercept(req, this.next);
    };

    return HttpInterceptorHandler;
  }();

  exports.HttpInterceptorHandler = HttpInterceptorHandler;
  exports.HttpInterceptors = [];

  var NoopInterceptor =
  /** @class */
  function () {
    function NoopInterceptor() {}

    NoopInterceptor.prototype.intercept = function (req, next) {
      return next.handle(req);
    };

    return NoopInterceptor;
  }();

  exports.NoopInterceptor = NoopInterceptor;
  exports.fetchHandler = new httpFetch_handler.HttpFetchHandler();
  exports.xhrHandler = new httpXhr_handler.HttpXhrHandler();

  var HttpInterceptingHandler =
  /** @class */
  function () {
    function HttpInterceptingHandler() {
      this.chain = null;
    }

    HttpInterceptingHandler.prototype.handle = function (req) {
      if (this.chain === null) {
        var interceptors = exports.HttpInterceptors;
        this.chain = interceptors.reduceRight(function (next, interceptor) {
          return new HttpInterceptorHandler(next, interceptor);
        }, exports.fetchHandler);
      }

      return this.chain.handle(req);
    };

    return HttpInterceptingHandler;
  }();

  exports.HttpInterceptingHandler = HttpInterceptingHandler;

  function interceptingHandler(handler, interceptors) {
    if (interceptors === void 0) {
      interceptors = [];
    }

    if (!interceptors) {
      return handler;
    }

    return interceptors.reduceRight(function (next, interceptor) {
      return new HttpInterceptorHandler(next, interceptor);
    }, handler);
  }

  exports.interceptingHandler = interceptingHandler;

  function jsonpCallbackContext() {
    if (typeof window === 'object') {
      return window;
    }

    return {};
  }

  exports.jsonpCallbackContext = jsonpCallbackContext;
});var http_module = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var factories = [];
  var pipes = [];
  /**
   *  HttpModule Class.
   * @example
   * export default class AppModule extends Module {}
   *
   * AppModule.meta = {
   *  imports: [
   *   CoreModule,
   *    HttpModule
   *  ],
   *  declarations: [
   *   ErrorsComponent
   *  ],
   *  bootstrap: AppComponent,
   * };
   * @extends Module
   */

  var HttpModule =
  /** @class */
  function (_super) {
    tslib_es6.__extends(HttpModule, _super);

    function HttpModule() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    HttpModule.useInterceptors = function (interceptorFactories) {
      if (interceptorFactories === null || interceptorFactories === void 0 ? void 0 : interceptorFactories.length) {
        var interceptors = interceptorFactories === null || interceptorFactories === void 0 ? void 0 : interceptorFactories.map(function (x) {
          return new x();
        });
        httpInterceptor.HttpInterceptors.push.apply(httpInterceptor.HttpInterceptors, interceptors);
      }

      return this;
    };

    HttpModule.meta = {
      declarations: tslib_es6.__spread(factories, pipes),
      exports: tslib_es6.__spread(factories, pipes)
    };
    return HttpModule;
  }(rxcomp__default.Module);

  exports.default = HttpModule;
});var httpHandler = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpHandler = void 0;

  var HttpHandler =
  /** @class */
  function () {
    function HttpHandler() {}

    return HttpHandler;
  }();

  exports.HttpHandler = HttpHandler;
});var httpParams = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpParams = exports.HttpUrlEncodingCodec = void 0;

  var HttpUrlEncodingCodec =
  /** @class */
  function () {
    function HttpUrlEncodingCodec() {}

    HttpUrlEncodingCodec.prototype.encodeKey = function (key) {
      return encodeParam_(key);
    };

    HttpUrlEncodingCodec.prototype.encodeValue = function (value) {
      return encodeParam_(value);
    };

    HttpUrlEncodingCodec.prototype.decodeKey = function (key) {
      return decodeURIComponent(key);
    };

    HttpUrlEncodingCodec.prototype.decodeValue = function (value) {
      return decodeURIComponent(value);
    };

    return HttpUrlEncodingCodec;
  }();

  exports.HttpUrlEncodingCodec = HttpUrlEncodingCodec;

  var HttpParams =
  /** @class */
  function () {
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

    HttpParams.prototype.keys = function () {
      return Array.from(this.params_.keys());
    };

    HttpParams.prototype.has = function (key) {
      return this.params_.has(key);
    };

    HttpParams.prototype.get = function (key) {
      var value = this.params_.get(key);
      return value ? value[0] : null;
    };

    HttpParams.prototype.getAll = function (key) {
      return this.params_.get(key) || null;
    };

    HttpParams.prototype.set = function (key, value) {
      var clone = this.clone_();
      clone.params_.set(key, [value]);
      return clone;
    };

    HttpParams.prototype.append = function (key, value) {
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

    HttpParams.prototype.delete = function (key) {
      var clone = this.clone_();
      clone.params_.delete(key);
      return clone;
    };

    HttpParams.prototype.toString = function () {
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

    HttpParams.prototype.toObject = function () {
      var _this = this;

      var params = {};
      this.keys().map(function (key) {
        var values = _this.params_.get(key);

        if (values) {
          params[key] = values;
        } // return this.encoder.encodeKey(key) + (values ? '=' + values.map(x => this.encoder.encodeValue(x)).join('&') : '');

      });
      return params;
    };

    HttpParams.prototype.clone_ = function () {
      var clone = new HttpParams(undefined, this.encoder);
      this.params_.forEach(function (value, key) {
        clone.params_.set(key, value);
      });
      return clone;
    };

    return HttpParams;
  }();

  exports.HttpParams = HttpParams;

  function parseRawParams_(params, queryString, encoder) {
    if (queryString.length > 0) {
      var keyValueParams = queryString.split('&');
      keyValueParams.forEach(function (keyValue) {
        var index = keyValue.indexOf('=');

        var _a = tslib_es6.__read(index == -1 ? [encoder.decodeKey(keyValue), ''] : [encoder.decodeKey(keyValue.slice(0, index)), encoder.decodeValue(keyValue.slice(index + 1))], 2),
            key = _a[0],
            value = _a[1];

        var values = params.get(key) || [];
        values.push(value);
        params.set(key, values);
      });
    }

    return params;
  }

  function encodeParam_(v) {
    return encodeURIComponent(v).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/gi, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%2B/gi, '+').replace(/%3D/gi, '=').replace(/%3F/gi, '?').replace(/%2F/gi, '/');
  }
});var httpRequest = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpRequest = void 0;

  var HttpRequest =
  /** @class */
  function () {
    function HttpRequest(method, url, third, fourth) {
      this.url = url;
      this.reportProgress = false;
      this.withCredentials = false;
      this.hydrate = true;
      this.observe = 'body';
      this.responseType = 'json'; // !!! remove, rethink

      var isStaticFile = /\.(json|xml|txt)(\?.*)?$/.test(url);
      this.method = isStaticFile ? 'GET' : method.toUpperCase();
      var options;

      if (methodHasBody_(this.method) || !!fourth) {
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
          this.headers = new httpHeaders.HttpHeaders(options.headers);
        }

        if (options.params) {
          this.params = new httpParams.HttpParams(options.params);
        }
      }

      if (!this.headers) {
        this.headers = new httpHeaders.HttpHeaders();
      }

      if (!this.params) {
        this.params = new httpParams.HttpParams();
      }

      var params = this.params.toString();
      var index = url.indexOf('?');
      var sep = index === -1 ? '?' : index < url.length - 1 ? '&' : '';
      this.urlWithParams = url + (params.length ? sep + params : params);
    }

    Object.defineProperty(HttpRequest.prototype, "transferKey", {
      get: function get() {
        var pathname = getPath_(this.url).pathname;
        var params = flatMap_(this.params.toObject());
        var body = flatMap_(this.body);
        var key = (pathname + "_" + params + "_" + body).replace(/(\W)/gm, '_');
        console.log('transferKey', key, this.url);
        return key;
      },
      enumerable: false,
      configurable: true
    });

    HttpRequest.prototype.serializeBody = function () {
      if (this.body === null) {
        return null;
      }

      if (isArrayBuffer_(this.body) || isBlob_(this.body) || isFormData_(this.body) || typeof this.body === 'string') {
        return this.body;
      }

      if (this.body instanceof httpParams.HttpParams) {
        return this.body.toString();
      }

      if (typeof this.body === 'object' || typeof this.body === 'boolean' || Array.isArray(this.body)) {
        return JSON.stringify(this.body);
      }

      return this.body.toString();
    };

    HttpRequest.prototype.detectContentTypeHeader = function () {
      if (this.body === null) {
        return null;
      }

      if (isFormData_(this.body)) {
        return null;
      }

      if (isBlob_(this.body)) {
        return this.body.type || null;
      }

      if (isArrayBuffer_(this.body)) {
        return null;
      }

      if (typeof this.body === 'string') {
        return 'text/plain';
      }

      if (this.body instanceof httpParams.HttpParams) {
        return 'application/x-www-form-urlencoded;charset=UTF-8';
      }

      if (typeof this.body === 'object' || typeof this.body === 'number' || Array.isArray(this.body)) {
        return 'application/json';
      }

      return null;
    };

    HttpRequest.prototype.toInitRequest = function () {
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

    HttpRequest.prototype.toFetchRequest__ = function () {
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

    HttpRequest.prototype.clone = function (options) {
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

    HttpRequest.prototype.toObject = function () {
      var request = {};
      request.url = this.url;
      request.method = this.method;
      request.headers = this.headers.toObject();
      request.params = this.params.toObject();
      request.body = this.body;
      request.reportProgress = this.reportProgress;
      request.responseType = this.responseType;
      request.withCredentials = this.withCredentials;
      request.observe = this.observe;
      return request;
    };

    return HttpRequest;
  }();

  exports.HttpRequest = HttpRequest;

  function methodHasBody_(method) {
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

  function isArrayBuffer_(value) {
    return typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;
  }

  function isBlob_(value) {
    return typeof Blob !== 'undefined' && value instanceof Blob;
  }

  function isFormData_(value) {
    return typeof FormData !== 'undefined' && value instanceof FormData;
  }

  function flatMap_(v, s) {
    if (s === void 0) {
      s = '';
    }

    if (typeof v === 'number') {
      s += v.toString();
    } else if (typeof v === 'string') {
      s += v.substr(0, 10);
    } else if (v && Array.isArray(v)) {
      s += v.map(function (v) {
        return flatMap_(v);
      }).join('');
    } else if (v && typeof v === 'object') {
      s += Object.keys(v).map(function (k) {
        return k + flatMap_(v[k]);
      }).join('_');
    }

    return "_" + s;
  }

  function getPath_(href) {
    var e_1, _a;

    var protocol = '';
    var host = '';
    var hostname = '';
    var port = '';
    var pathname = '';
    var search = '';
    var hash = '';
    var regExp = /^((http\:|https\:)?\/\/)?((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])|locahost)?(\:([^\/]+))?(\.?\/[^\?]+)?(\?[^\#]+)?(\#.+)?$/g;
    var matches = href.matchAll(regExp);

    try {
      for (var matches_1 = tslib_es6.__values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
        var match = matches_1_1.value;
        protocol = match[2] || '';
        host = hostname = match[3] || '';
        port = match[11] || '';
        pathname = match[12] || '';
        search = match[13] || '';
        hash = match[14] || '';
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (matches_1_1 && !matches_1_1.done && (_a = matches_1.return)) _a.call(matches_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }

    return {
      href: href,
      protocol: protocol,
      host: host,
      hostname: hostname,
      port: port,
      pathname: pathname,
      search: search,
      hash: hash
    };
  }
});var http_service = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var HttpService =
  /** @class */
  function () {
    function HttpService() {}

    HttpService.incrementPendingRequest = function () {
      HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() + 1);
    };

    HttpService.decrementPendingRequest = function () {
      HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() - 1);
    };

    HttpService.request$ = function (first, url, options) {
      var _this = this;

      if (options === void 0) {
        options = {};
      }

      var request;

      if (first instanceof httpRequest.HttpRequest) {
        request = first;
      } else {
        var headers = undefined;

        if (options.headers instanceof httpHeaders.HttpHeaders) {
          headers = options.headers;
        } else {
          headers = new httpHeaders.HttpHeaders(options.headers);
        }

        var params = undefined;

        if (options.params) {
          params = new httpParams.HttpParams(options.params);
        }

        request = new httpRequest.HttpRequest(first, url, options.body !== undefined ? options.body : null, {
          headers: headers,
          params: params,
          reportProgress: options.reportProgress,
          responseType: options.responseType || 'json',
          withCredentials: options.withCredentials
        });
      } // console.log('HttpService.request$', request);


      HttpService.incrementPendingRequest();
      var events$ = rxjs__default.of(request).pipe(operators__default.concatMap(function (request) {
        return _this.handler.handle(request);
      }), // tap((response: HttpEvent<any>) => console.log('HttpService.response', response)),
      operators__default.finalize(function () {
        return HttpService.decrementPendingRequest();
      }));

      if (first instanceof httpRequest.HttpRequest || options.observe === 'events') {
        return events$.pipe(operators__default.catchError(function (error) {
          console.log('error', error);
          return rxjs__default.throwError(_this.getError(error, null, request));
        }));
      }

      var response$ = events$.pipe(operators__default.filter(function (event) {
        return event instanceof httpResponse.HttpResponse;
      }));
      var response_;
      var observe$ = response$.pipe(operators__default.map(function (response) {
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
      }), operators__default.catchError(function (error) {
        console.log('error', error);
        return rxjs__default.throwError(_this.getError(error, response_, request));
      }));
      return observe$;
      /*
      switch (options.observe || 'body') {
          case 'body':
              switch (request.responseType) {
                  case 'arraybuffer':
                      return response$.pipe(map((response: HttpResponse<T>) => {
                          if (response.body !== null && !(response.body instanceof ArrayBuffer)) {
                              throw new Error('Response is not an ArrayBuffer.');
                          }
                          return response.body;
                      }));
                  case 'blob':
                      return response$.pipe(map((response: HttpResponse<T>) => {
                          if (response.body !== null && !(response.body instanceof Blob)) {
                              throw new Error('Response is not a Blob.');
                          }
                          return response.body;
                      }));
                  case 'text':
                      return response$.pipe(map((response: HttpResponse<T>) => {
                          if (response.body !== null && typeof response.body !== 'string') {
                              throw new Error('Response is not a string.');
                          }
                          return response.body;
                      }));
                  case 'json':
                  default:
                      return response$.pipe(map((response: HttpResponse<T>) => response.body));
              }
          case 'response':
              return response$;
          default:
              throw new Error(`Unreachable: unhandled observe type ${options.observe}}`);
      }
      */
    };

    HttpService.delete$ = function (url, options) {
      if (options === void 0) {
        options = {};
      }

      return this.request$('DELETE', url, options);
    };

    HttpService.get$ = function (url, options) {
      if (options === void 0) {
        options = {};
      }

      return this.request$('GET', url, options);
    };

    HttpService.head$ = function (url, options) {
      if (options === void 0) {
        options = {};
      }

      return this.request$('HEAD', url, options);
    };

    HttpService.jsonp$ = function (url, callbackParam) {
      return this.request$('JSONP', url, {
        params: new httpParams.HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
        observe: 'body',
        responseType: 'json'
      });
    };

    HttpService.options$ = function (url, options) {
      if (options === void 0) {
        options = {};
      }

      return this.request$('OPTIONS', url, options);
    };

    HttpService.patch$ = function (url, body, options) {
      if (options === void 0) {
        options = {};
      }

      return this.request$('PATCH', url, optionsWithBody_(options, body));
    };

    HttpService.post$ = function (url, body, options) {
      if (options === void 0) {
        options = {};
      }

      return this.request$('POST', url, optionsWithBody_(options, body));
    };

    HttpService.put$ = function (url, body, options) {
      if (options === void 0) {
        options = {};
      }

      return this.request$('PUT', url, optionsWithBody_(options, body));
    };

    HttpService.getError = function (error, response, request) {
      if (!error.status) {
        error.statusCode = (response === null || response === void 0 ? void 0 : response.status) || 0;
      }

      if (!error.statusMessage) {
        error.statusMessage = (response === null || response === void 0 ? void 0 : response.statusText) || 'Unknown Error';
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

      return new httpErrorResponse.HttpErrorResponse(options);
    };

    HttpService.pendingRequests$ = new rxjs__default.BehaviorSubject(0); // static handler: HttpHandler = new HttpFetchHandler();

    HttpService.handler = new httpInterceptor.HttpInterceptingHandler();
    return HttpService;
  }();

  exports.default = HttpService;

  function optionsWithBody_(options, body) {
    return Object.assign({}, options, {
      body: body
    });
  }
});var rxcompHttp = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "HttpModule", {
    enumerable: true,
    get: function get() {
      return http_module.default;
    }
  });
  Object.defineProperty(exports, "HttpErrorResponse", {
    enumerable: true,
    get: function get() {
      return httpErrorResponse.HttpErrorResponse;
    }
  });
  Object.defineProperty(exports, "HttpEventType", {
    enumerable: true,
    get: function get() {
      return httpEvent.HttpEventType;
    }
  });
  Object.defineProperty(exports, "HttpFetchHandler", {
    enumerable: true,
    get: function get() {
      return httpFetch_handler.HttpFetchHandler;
    }
  });
  Object.defineProperty(exports, "HttpHandler", {
    enumerable: true,
    get: function get() {
      return httpHandler.HttpHandler;
    }
  });
  Object.defineProperty(exports, "HttpHeaders", {
    enumerable: true,
    get: function get() {
      return httpHeaders.HttpHeaders;
    }
  });
  Object.defineProperty(exports, "fetchHandler", {
    enumerable: true,
    get: function get() {
      return httpInterceptor.fetchHandler;
    }
  });
  Object.defineProperty(exports, "HttpInterceptingHandler", {
    enumerable: true,
    get: function get() {
      return httpInterceptor.HttpInterceptingHandler;
    }
  });
  Object.defineProperty(exports, "HttpInterceptorHandler", {
    enumerable: true,
    get: function get() {
      return httpInterceptor.HttpInterceptorHandler;
    }
  });
  Object.defineProperty(exports, "HttpInterceptors", {
    enumerable: true,
    get: function get() {
      return httpInterceptor.HttpInterceptors;
    }
  });
  Object.defineProperty(exports, "interceptingHandler", {
    enumerable: true,
    get: function get() {
      return httpInterceptor.interceptingHandler;
    }
  });
  Object.defineProperty(exports, "jsonpCallbackContext", {
    enumerable: true,
    get: function get() {
      return httpInterceptor.jsonpCallbackContext;
    }
  });
  Object.defineProperty(exports, "NoopInterceptor", {
    enumerable: true,
    get: function get() {
      return httpInterceptor.NoopInterceptor;
    }
  });
  Object.defineProperty(exports, "xhrHandler", {
    enumerable: true,
    get: function get() {
      return httpInterceptor.xhrHandler;
    }
  });
  Object.defineProperty(exports, "HttpParams", {
    enumerable: true,
    get: function get() {
      return httpParams.HttpParams;
    }
  });
  Object.defineProperty(exports, "HttpUrlEncodingCodec", {
    enumerable: true,
    get: function get() {
      return httpParams.HttpUrlEncodingCodec;
    }
  });
  Object.defineProperty(exports, "HttpRequest", {
    enumerable: true,
    get: function get() {
      return httpRequest.HttpRequest;
    }
  });
  Object.defineProperty(exports, "HttpHeaderResponse", {
    enumerable: true,
    get: function get() {
      return httpResponse.HttpHeaderResponse;
    }
  });
  Object.defineProperty(exports, "HttpResponse", {
    enumerable: true,
    get: function get() {
      return httpResponse.HttpResponse;
    }
  });
  Object.defineProperty(exports, "HttpResponseBase", {
    enumerable: true,
    get: function get() {
      return httpResponse.HttpResponseBase;
    }
  });
  Object.defineProperty(exports, "HttpXhrHandler", {
    enumerable: true,
    get: function get() {
      return httpXhr_handler.HttpXhrHandler;
    }
  });
  Object.defineProperty(exports, "HttpService", {
    enumerable: true,
    get: function get() {
      return http_service.default;
    }
  });
});function _defineProperties(target, props) {
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

    var regExp = /(\/|\\|\:|\?|\#|\&)+/g;
    var path = "_" + type + "_" + name; // console.log('path', path);

    path = path.replace(regExp, function (substring, group) {
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
    private hash_: string = '';
    get hash(): string { return this.hash_; }
    set hash(hash: string) { this.hash_ = hash; updateLocation_(this); }
         private host_: string = '';
    get host(): string { return this.host_; }
    set host(host: string) { this.host_ = host; updateLocation_(this); }
         private hostname_: string = '';
    get hostname(): string { return this.hostname_; }
    set hostname(hostname: string) { this.hostname_ = hostname; updateLocation_(this); }
         private pathname_: string = '';
    get pathname(): string { return this.pathname_; }
    set pathname(pathname: string) { this.pathname_ = pathname; updateLocation_(this); }
         private port_: string = '';
    get port(): string { return this.port_; }
    set port(port: string) { this.port_ = port; updateLocation_(this); }
         private protocol_: string = '';
    get protocol(): string { return this.protocol_; }
    set protocol(protocol: string) { this.protocol_ = protocol; updateLocation_(this); }
         private search_: string = '';
    get search(): string { return this.search_; }
    set search(search: string) { this.search_ = search; updateLocation_(this); }
    */
    this.hash = '';
    this.host = '';
    this.hostname = '';
    this.pathname = '';
    this.port = '';
    this.protocol = '';
    this.search = '';
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
    key: "href",
    get: function get() {
      var href = this.protocol + "//" + this.host + (this.port.length ? ":" + this.port : "") + this.pathname + this.search + this.hash;
      this.href_ = href;
      return href;
    },
    set: function set(href) {
      if (this.href_ !== href) {
        this.href_ = href;
        var regExp = /^((http\:|https\:)?\/\/)?((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])|locahost)?(\:([^\/]+))?(\.?\/[^\?]+)?(\?[^\#]+)?(\#.+)?$/g;
        var matches = href.matchAll(regExp);

        for (var _iterator = _createForOfIteratorHelperLoose(matches), _step; !(_step = _iterator()).done;) {
          var match = _step.value;

          /*
          Group 0.  https://developer.mozilla.org/en-US/docs/Web/API/Location/ancestorOrigins?pippo=shuter&a=dsok#asoka
          Group 1.  https://
          Group 2.  https:
          Group 3.  developer.mozilla.org
          Group 7.  mozilla.
          Group 8.  mozilla
          Group 9.  org
          Group 12. /en-US/docs/Web/API/Location/ancestorOrigins
          Group 13. ?pippo=shuter&a=dsok
          Group 14. #asoka
          */
          this.protocol = match[2] || '';
          this.host = this.hostname = match[3] || '';
          this.port = match[11] || '';
          this.pathname = match[12] || '';
          this.search = match[13] || '';
          this.hash = match[14] || '';
        }
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
}();
/*
function updateLocation_(location: ILocation): void {
    location.href = location.href;
}
*/var RxHistory = /*#__PURE__*/function () {
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
}();// const SKIP = ['html','head','title','base','meta','script','link','body',];
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
    var _this18;

    _this18 = _RxElement2.call(this, null, '#document') || this;
    _this18.location_ = RxLocation.location;
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
      console.log('childNodes', this.childNodes);
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

      title.innerText = nodeValue;
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
}var fs$1 = require('fs');

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

    var render = CacheService.get('render', request.url);
    console.log('Server.render$.fromCache', !!render, request.url);

    if (render) {
      observer.next(render);
      return observer.complete();
    }

    template$(request).pipe(operators.switchMap(function (template) {
      // console.log('template!', template);
      request.template = template;
      return renderRequest$(request);
    })).subscribe(function (success) {
      CacheService.set('render', request.url, success, 3600);
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
      console.log('Server.template$.fromCache', !!template, src);

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
}var Vars = {
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
*/var AppComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(AppComponent, _Component);

  function AppComponent() {
    var _this;

    _this = _Component.apply(this, arguments) || this;
    _this.items = [];
    _this.error = null;
    return _this;
  }

  var _proto = AppComponent.prototype;

  _proto.onInit = function onInit() {
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
    HttpService.post$<IResponseData>(`${Vars.host}${Vars.api}`, payload, {
        params: { query: `{ getTodos { id, title, completed } }` },
        reportProgress: true
    }).pipe(
    */

    var methodUrl = "" + Vars.host + Vars.api;
    console.log('methodUrl', methodUrl);
    rxcompHttp.HttpService.post$(methodUrl, payload, {
      hydrate: true
    }).pipe(operators.first()).subscribe(function (response) {
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

  _proto.onClick = function onClick(item) {
    item.completed = !item.completed;
    this.pushChanges();
  };

  return AppComponent;
}(rxcomp.Component);
AppComponent.meta = {
  selector: '[app-component]'
};var CustomInterceptor = /*#__PURE__*/function () {
  function CustomInterceptor() {}

  var _proto = CustomInterceptor.prototype;

  _proto.intercept = function intercept(request, next) {

    var clonedRequest = request.clone({
      url: request.url
    }); // console.log('CustomInterceptor.clonedRequest', clonedRequest);

    return next.handle(clonedRequest);
  };

  return CustomInterceptor;
}();var AppModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(AppModule, _Module);

  function AppModule() {
    return _Module.apply(this, arguments) || this;
  }

  return AppModule;
}(rxcomp.Module);
AppModule.meta = {
  imports: [rxcomp.CoreModule, rxcompHttp.HttpModule.useInterceptors([CustomInterceptor])],
  declarations: [],
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