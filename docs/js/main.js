/**
 * @license rxcomp-server v1.0.0-beta.12
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(rxcomp,rxjs,operators){'use strict';function _inheritsLoose(subClass, superClass) {
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
}var HttpEventType;

(function (HttpEventType) {
  HttpEventType[HttpEventType["Sent"] = 0] = "Sent";
  HttpEventType[HttpEventType["UploadProgress"] = 1] = "UploadProgress";
  HttpEventType[HttpEventType["ResponseHeader"] = 2] = "ResponseHeader";
  HttpEventType[HttpEventType["DownloadProgress"] = 3] = "DownloadProgress";
  HttpEventType[HttpEventType["Response"] = 4] = "Response";
  HttpEventType[HttpEventType["User"] = 5] = "User";
  HttpEventType[HttpEventType["ResponseError"] = 6] = "ResponseError";
})(HttpEventType || (HttpEventType = {}));var HttpHeaders = function () {
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
}();var HttpErrorResponse = function (_Error) {
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
}(_wrapNativeSuper(Error));var HttpResponse = function () {
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
}();var HttpFetchHandler = function () {
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
    var requestInit = request.toInitRequest();
    return rxjs.from(fetch(requestInfo, requestInit).then(function (response) {
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

      var httpErrorResponse = new HttpErrorResponse(errorResponse);
      rxcomp.nextError$.next(httpErrorResponse);
      return rxjs.of(_this.response_);
    }), operators.finalize(function () {
      _this.response_ = null;
    }));
  };

  _proto.getProgress = function getProgress(response, request) {
    var _this2 = this;

    var clonedBody = response.clone().body;

    if (rxcomp.isPlatformBrowser && request.reportProgress && clonedBody) {
      var reader = clonedBody.getReader();
      var contentLength = response.headers && response.headers.has('Content-Length') ? +(response.headers.get('Content-Length') || 0) : 0;
      return new Promise(function (resolve, reject) {
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
            }

            return reader.read().then(function (_ref) {
              var value = _ref.value,
                  done = _ref.done;
              return onProgress(value, done);
            });
          } else {
            progress.total = contentLength;
            progress.current = contentLength;
            progress.progress = 1;
            progress.percent = 100;
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
        var push = function push() {
          reader.read().then(function (_ref3) {
            var done = _ref3.done,
                value = _ref3.value;

            if (done) {
              controller.close();
              return;
            }

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
}();var HttpInterceptorHandler = function () {
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
var HttpInterceptingHandler = function () {
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
}();var HttpUrlEncodingCodec = function () {
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
var HttpParams = function () {
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
    }
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
}var HttpRequest = function () {
  function HttpRequest(method, url, third, fourth) {
    this.url = url;
    this.reportProgress = false;
    this.withCredentials = false;
    this.observe = 'body';
    this.responseType = 'json';
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

    if (isArrayBuffer(this.body) || isBlob(this.body) || isFormData(this.body) || typeof this.body === 'string') {
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

    if (isBlob(this.body)) {
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

function isBlob(value) {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

function isFormData(value) {
  return typeof FormData !== 'undefined' && value instanceof FormData;
}var HttpClient = function () {
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
    }

    HttpClient.incrementPendingRequest();
    var events$ = rxjs.of(request).pipe(operators.concatMap(function (request) {
      return _this.handler.handle(request);
    }), operators.finalize(function () {
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
HttpClient.pendingRequests$ = new rxjs.BehaviorSubject(0);
HttpClient.handler = new HttpInterceptingHandler();

function optionsWithBody_(options, body) {
  return Object.assign({}, options, {
    body: body
  });
}var Vars = {
  name: 'rxcomp-server',
  host: '',
  resource: '/',
  api: '/api',
  static: false,
  development: false,
  production: true
};var CustomInterceptor = function () {
  function CustomInterceptor() {}

  var _proto = CustomInterceptor.prototype;

  _proto.intercept = function intercept(request, next) {

    var clonedRequest = request.clone({
      url: request.url
    });
    return next.handle(clonedRequest);
  };

  return CustomInterceptor;
}();
var interceptor = new CustomInterceptor();
HttpInterceptors.push(interceptor);

var AppComponent = function (_Component) {
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

    var payload = {
      query: "{ getTodos { id, title, completed } }"
    };
    var methodUrl = "" + Vars.host + Vars.api;
    console.log('methodUrl', methodUrl);
    HttpClient.post$(methodUrl, payload).pipe(operators.first()).subscribe(function (response) {
      _this2.items = response.data.getTodos;

      _this2.pushChanges();
    }, function (error) {
      return console.log;
    });
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
};var AppModule = function (_Module) {
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
};rxcomp.Browser.bootstrap(AppModule);}(rxcomp,rxjs,rxjs.operators));