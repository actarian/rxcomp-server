/**
 * @license rxcomp-server v1.0.0-beta.13
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(rxcomp,rxjs,operators){'use strict';var rxcomp__default='default'in rxcomp?rxcomp['default']:rxcomp;var rxjs__default='default'in rxjs?rxjs['default']:rxjs;var operators__default='default'in operators?operators['default']:operators;function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}function createCommonjsModule(fn, basedir, module) {
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
}var _extendStatics = function extendStatics(d, b) {
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

  var HttpHeaders = function () {
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
});var tslib_1 = getCjsExportFromNamespace(tslib_es6);var httpErrorResponse = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpErrorResponse = void 0;

  var HttpErrorResponse = function (_super) {
    tslib_1.__extends(HttpErrorResponse, _super);

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

  var HttpHeaderResponse = function () {
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

  var HttpResponse = function () {
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

  var HttpResponseBase = function () {
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
});var httpFetch_handler = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpFetchHandler = void 0;

  var HttpFetchHandler = function () {
    function HttpFetchHandler() {
      this.response_ = null;
    }

    HttpFetchHandler.prototype.handle = function (request) {
      var _this = this;

      if (!request.method) {
        throw new Error("missing method");
      }

      var requestInfo = request.urlWithParams;
      var requestInit = request.toInitRequest();
      var stateKey = rxcomp__default.TransferService.makeKey(request.transferKey);
      var response;

      if (rxcomp__default.isPlatformBrowser && request.hydrate && rxcomp__default.TransferService.has(stateKey)) {
        var transfer = rxcomp__default.TransferService.get(stateKey);

        if (transfer) {
          response = new httpResponse.HttpResponse(transfer);
        }

        rxcomp__default.TransferService.remove(stateKey);
      }

      if (response) {
        return rxjs__default.of(response);
      } else {
        return rxjs__default.from(fetch(requestInfo, requestInit).then(function (response) {
          return _this.getProgress(response, request);
        }).then(function (response) {
          return _this.getResponse(response, request);
        })).pipe(operators__default.tap(function (response) {
          if (rxcomp__default.isPlatformServer && request.hydrate) {
            rxcomp__default.TransferService.set(stateKey, response.toObject());
          }
        }), operators__default.catchError(function (error) {
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

          var httpErrorResponse$1 = new httpErrorResponse.HttpErrorResponse(errorResponse);
          rxcomp__default.nextError$.next(httpErrorResponse$1);
          return rxjs__default.of(_this.response_);
        }), operators__default.finalize(function () {
          _this.response_ = null;
        }));
      }
    };

    HttpFetchHandler.prototype.getProgress = function (response, request) {
      var _this = this;

      var clonedBody = response.clone().body;

      if (rxcomp__default.isPlatformBrowser && request.reportProgress && clonedBody) {
        var reader_1 = clonedBody.getReader();
        var contentLength_1 = response.headers && response.headers.has('Content-Length') ? +(response.headers.get('Content-Length') || 0) : 0;
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
                progress.total = contentLength_1;
                progress.current = receivedLength;
                progress.progress = receivedLength / contentLength_1;
                progress.percent = progress.progress * 100;
              }

              return reader_1.read().then(function (_a) {
                var value = _a.value,
                    done = _a.done;
                return onProgress(value, done);
              });
            } else {
              progress.total = contentLength_1;
              progress.current = contentLength_1;
              progress.progress = 1;
              progress.percent = 100;
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
          var push = function push() {
            reader.read().then(function (_a) {
              var done = _a.done,
                  value = _a.value;

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
  }();

  exports.HttpFetchHandler = HttpFetchHandler;
});var httpXhr_handler = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpXhrHandler = void 0;
  var XSSI_PREFIX = /^\)\]\}',?\n/;

  var HttpXhrHandler = function () {
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
        }

        var stateKey = rxcomp__default.TransferService.makeKey(request.transferKey);

        if (rxcomp__default.isPlatformBrowser && request.hydrate && rxcomp__default.TransferService.has(stateKey)) {
          var cached = rxcomp__default.TransferService.get(stateKey);
          rxcomp__default.TransferService.remove(stateKey);
          observer.next(cached);
          observer.complete();
          return;
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
              });

              if (rxcomp__default.isPlatformServer && request.hydrate) {
                rxcomp__default.TransferService.set(stateKey, response);
              }

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
              var httpErrorResponse$1 = new httpErrorResponse.HttpErrorResponse(options);
              rxcomp__default.nextError$.next(httpErrorResponse$1);
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
            var httpErrorResponse$1 = new httpErrorResponse.HttpErrorResponse(options);
            rxcomp__default.nextError$.next(httpErrorResponse$1);
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

  var HttpInterceptorHandler = function () {
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

  var NoopInterceptor = function () {
    function NoopInterceptor() {}

    NoopInterceptor.prototype.intercept = function (req, next) {
      return next.handle(req);
    };

    return NoopInterceptor;
  }();

  exports.NoopInterceptor = NoopInterceptor;
  exports.fetchHandler = new httpFetch_handler.HttpFetchHandler();
  exports.xhrHandler = new httpXhr_handler.HttpXhrHandler();

  var HttpInterceptingHandler = function () {
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

  var HttpModule = function (_super) {
    tslib_1.__extends(HttpModule, _super);

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
      declarations: tslib_1.__spread(factories, pipes),
      exports: tslib_1.__spread(factories, pipes)
    };
    return HttpModule;
  }(rxcomp__default.Module);

  exports.default = HttpModule;
});var httpHandler = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpHandler = void 0;

  var HttpHandler = function () {
    function HttpHandler() {}

    return HttpHandler;
  }();

  exports.HttpHandler = HttpHandler;
});var httpParams = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpParams = exports.HttpUrlEncodingCodec = void 0;

  var HttpUrlEncodingCodec = function () {
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
        }
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

        var _a = tslib_1.__read(index == -1 ? [encoder.decodeKey(keyValue), ''] : [encoder.decodeKey(keyValue.slice(0, index)), encoder.decodeValue(keyValue.slice(index + 1))], 2),
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

  var HttpRequest = function () {
    function HttpRequest(method, url, third, fourth) {
      this.url = url;
      this.reportProgress = false;
      this.withCredentials = false;
      this.hydrate = true;
      this.observe = 'body';
      this.responseType = 'json';
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
        var pathname = rxcomp__default.getLocationComponents(this.url).pathname;
        var paramsKey = rxcomp__default.optionsToKey(this.params.toObject());
        var bodyKey = rxcomp__default.optionsToKey(this.body);
        var key = this.method + "-" + pathname + "-" + paramsKey + "-" + bodyKey;
        key = key.replace(/(\s+)|(\W+)/g, function () {
          var matches = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            matches[_i] = arguments[_i];
          }

          return matches[1] ? '' : '_';
        });
        console.log('transferKey', key);
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
});var http_service = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var HttpService = function () {
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
      }

      HttpService.incrementPendingRequest();
      var events$ = rxjs__default.of(request).pipe(operators__default.concatMap(function (request) {
        return _this.handler.handle(request);
      }), operators__default.finalize(function () {
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

    HttpService.pendingRequests$ = new rxjs__default.BehaviorSubject(0);
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
});var Vars = {
  name: 'rxcomp-server',
  host: '',
  resource: '/',
  api: '/api',
  static: false,
  development: false,
  production: true
};var AppComponent = function (_Component) {
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

    var payload = {
      query: "{ getTodos { id, title, completed } }"
    };
    var methodUrl = "" + Vars.host + Vars.api;
    rxcompHttp.HttpService.post$(methodUrl, payload, {
      hydrate: true
    }).pipe(operators.first()).subscribe(function (response) {
      _this2.items = response.data.getTodos;

      _this2.pushChanges();
    }, function (error) {
      return console.warn;
    });
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
}();var AppModule = function (_Module) {
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
};rxcomp.Browser.bootstrap(AppModule);}(rxcomp,rxjs,rxjs.operators));