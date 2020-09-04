/**
 * @license rxcomp-server v1.0.0-beta.16
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(rxcomp, rxcompHttp, rxjs, operators) {
  'use strict'; var rxcomp__default = 'default' in rxcomp ? rxcomp['default'] : rxcomp; var rxjs__default = 'default' in rxjs ? rxjs['default'] : rxjs; var operators__default = 'default' in operators ? operators['default'] : operators; function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  } function createCommonjsModule(fn, basedir, module) {
    return module = {
      path: basedir,
      exports: {},
      require: function(path, base) {
        return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
      }
    }, fn(module, module.exports), module.exports;
  }

  function getCjsExportFromNamespace(n) {
    return n && n['default'] || n;
  }

  function commonjsRequire() {
    throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  } var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(d, b) {
      d.__proto__ = b;
    } || function(d, b) {
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
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function __param(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  }
  function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }

    return new (P || (P = Promise))(function(resolve, reject) {
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
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;

    function verb(n) {
      return function(v) {
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
  var __createBinding = Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
      enumerable: true,
      get: function get() {
        return m[k];
      }
    });
  } : function(o, m, k, k2) {
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
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;

    function verb(n) {
      if (g[n]) i[n] = function(v) {
        return new Promise(function(a, b) {
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
    return i = {}, verb("next"), verb("throw", function(e) {
      throw e;
    }), verb("return"), i[Symbol.iterator] = function() {
      return this;
    }, i;

    function verb(n, f) {
      i[n] = o[n] ? function(v) {
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
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i);

    function verb(n) {
      i[n] = o[n] && function(v) {
        return new Promise(function(resolve, reject) {
          v = o[n](v), settle(resolve, reject, v.done, v.value);
        });
      };
    }

    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function(v) {
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

  var __setModuleDefault = Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
      enumerable: true,
      value: v
    });
  } : function(o, v) {
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
  } var tslib_es6 =/*#__PURE__*/Object.freeze({ __proto__: null, __extends: __extends, get __assign() { return _assign }, __rest: __rest, __decorate: __decorate, __param: __param, __metadata: __metadata, __awaiter: __awaiter, __generator: __generator, __createBinding: __createBinding, __exportStar: __exportStar, __values: __values, __read: __read, __spread: __spread, __spreadArrays: __spreadArrays, __await: __await, __asyncGenerator: __asyncGenerator, __asyncDelegator: __asyncDelegator, __asyncValues: __asyncValues, __makeTemplateObject: __makeTemplateObject, __importStar: __importStar, __importDefault: __importDefault, __classPrivateFieldGet: __classPrivateFieldGet, __classPrivateFieldSet: __classPrivateFieldSet }); var tslib_1 = getCjsExportFromNamespace(tslib_es6); var view = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var View = function(_super) {
      tslib_1.__extends(View, _super);

      function View() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      View.prototype.onEnter = function(node) {
        return rxjs__default.of(true);
      };

      View.prototype.onExit = function(node) {
        return rxjs__default.of(true);
      };

      return View;
    }(rxcomp__default.Component);

    exports.default = View;
  }); var location_strategy = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LocationStrategyHash = exports.LocationStrategyPath = exports.decodeParam = exports.encodeParam = exports.LocationStrategy = void 0;

    var LocationStrategy = function() {
      function LocationStrategy() { }

      LocationStrategy.prototype.serializeLink = function(routerLink) {
        var _this = this;

        var url = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(function(x) {
          return typeof x === 'string' ? x : _this.encodeParams(x);
        }).join('/');
        return this.serializeUrl(url);
      };

      LocationStrategy.prototype.serializeUrl = function(url) {
        return url;
      };

      LocationStrategy.prototype.serialize = function(routePath) {
        return "" + routePath.prefix + routePath.path + routePath.search + routePath.hash;
      };

      LocationStrategy.prototype.resolve = function(url, target) {
        var e_1, _a;

        if (target === void 0) {
          target = {};
        }

        var prefix = '';
        var path = '';
        var query = '';
        var search = '';
        var hash = '';
        var segments;
        var params;
        var regExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#[^\#]*?)?$/gm;
        var matches = url.matchAll(regExp);

        try {
          for (var matches_1 = tslib_1.__values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
            var match = matches_1_1.value;
            var g1 = match[1];
            var g2 = match[2];
            var g3 = match[3];

            if (g1) {
              path = g1;
            }

            if (g2) {
              query = g2;
            }

            if (g3) {
              hash = g3;
            }
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

        prefix = prefix;
        path = path;
        query = query;
        hash = hash.substring(1, hash.length);
        search = query.substring(1, query.length);
        segments = path.split('/').filter(function(x) {
          return x !== '';
        });
        params = {};
        target.prefix = prefix;
        target.path = path;
        target.query = query;
        target.hash = hash;
        target.search = search;
        target.segments = segments;
        target.params = params;
        return target;
      };

      LocationStrategy.prototype.resolveParams = function(path, routeSegments) {
        var _this = this;

        var segments = path.split('/').filter(function(x) {
          return x !== '';
        });
        var params = {};
        routeSegments.forEach(function(segment, index) {
          var keys = Object.keys(segment.params);

          if (keys.length) {
            params[keys[0]] = _this.decodeParams(segments[index]);
          }
        });
        return params;
      };

      LocationStrategy.prototype.encodeParams = function(value) {
        var encoded;

        if (typeof value === 'object') {
          encoded = rxcomp__default.Serializer.encode(value, [rxcomp__default.encodeJson, rxcomp__default.encodeBase64, encodeParam]);
        } else if (typeof value === 'number') {
          encoded = value.toString();
        }

        return encoded;
      };

      LocationStrategy.prototype.decodeParams = function(value) {
        var decoded = value;

        if (value.indexOf(';') === 0) {
          try {
            decoded = rxcomp__default.Serializer.decode(value, [decodeParam, rxcomp__default.decodeBase64, rxcomp__default.decodeJson]);
          } catch (error) {
            decoded = value;
          }
        } else if (Number(value).toString() === value) {
          decoded = Number(value);
        }

        return decoded;
      };

      LocationStrategy.prototype.encodeSegment = function(value) {
        return this.encodeString(value).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
      };

      LocationStrategy.prototype.decodeSegment = function(value) {
        return this.decodeString(value.replace(/%28/g, '(').replace(/%29/g, ')').replace(/\&/gi, '%26'));
      };

      LocationStrategy.prototype.encodeString = function(value) {
        return encodeURIComponent(value).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
      };

      LocationStrategy.prototype.decodeString = function(value) {
        return decodeURIComponent(value.replace(/\@/g, '%40').replace(/\:/gi, '%3A').replace(/\$/g, '%24').replace(/\,/gi, '%2C'));
      };

      LocationStrategy.prototype.getPath = function(url) {
        return url;
      };

      LocationStrategy.prototype.getUrl = function(url, params) {
        return "" + url + (params ? '?' + params.toString() : '');
      };

      LocationStrategy.prototype.setHistory = function(url, params, popped) {
        if (rxcomp__default.isPlatformBrowser && typeof history !== 'undefined' && history.pushState) {
          var title = document.title;
          url = this.getUrl(url, params);

          if (popped) {
            history.replaceState(undefined, title, url);
          } else {
            history.pushState(undefined, title, url);
          }
        }
      };

      return LocationStrategy;
    }();

    exports.LocationStrategy = LocationStrategy;

    function encodeParam(value) {
      return ";" + value;
    }

    exports.encodeParam = encodeParam;

    function decodeParam(value) {
      return value.substring(1, value.length);
    }

    exports.decodeParam = decodeParam;

    var LocationStrategyPath = function(_super) {
      tslib_1.__extends(LocationStrategyPath, _super);

      function LocationStrategyPath() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      LocationStrategyPath.prototype.serialize = function(routePath) {
        return "" + routePath.prefix + routePath.path + routePath.search + routePath.hash;
      };

      LocationStrategyPath.prototype.resolve = function(url, target) {
        var e_2, _a;

        if (target === void 0) {
          target = {};
        }

        var prefix = '';
        var path = '';
        var query = '';
        var search = '';
        var hash = '';
        var segments;
        var params;
        var regExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#[^\#]*?)?$/gm;
        var matches = url.matchAll(regExp);

        try {
          for (var matches_2 = tslib_1.__values(matches), matches_2_1 = matches_2.next(); !matches_2_1.done; matches_2_1 = matches_2.next()) {
            var match = matches_2_1.value;
            var g1 = match[1];
            var g2 = match[2];
            var g3 = match[3];

            if (g1) {
              path = g1;
            }

            if (g2) {
              query = g2;
            }

            if (g3) {
              hash = g3;
            }
          }
        } catch (e_2_1) {
          e_2 = {
            error: e_2_1
          };
        } finally {
          try {
            if (matches_2_1 && !matches_2_1.done && (_a = matches_2.return)) _a.call(matches_2);
          } finally {
            if (e_2) throw e_2.error;
          }
        }

        prefix = prefix;
        path = path;
        query = query;
        hash = hash.substring(1, hash.length);
        search = query.substring(1, query.length);
        segments = path.split('/').filter(function(x) {
          return x !== '';
        });
        params = {};
        target.prefix = prefix;
        target.path = path;
        target.query = query;
        target.hash = hash;
        target.search = search;
        target.segments = segments;
        target.params = params;
        return target;
      };

      return LocationStrategyPath;
    }(LocationStrategy);

    exports.LocationStrategyPath = LocationStrategyPath;

    var LocationStrategyHash = function(_super) {
      tslib_1.__extends(LocationStrategyHash, _super);

      function LocationStrategyHash() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      LocationStrategyHash.prototype.serializeLink = function(routerLink) {
        var _this = this;

        var url = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(function(x) {
          return typeof x === 'string' ? x : _this.encodeParams(x);
        }).join('/');
        return this.serializeUrl(url);
      };

      LocationStrategyHash.prototype.serializeUrl = function(url) {
        var path = this.resolve(url, {});
        return this.serialize(path);
      };

      LocationStrategyHash.prototype.serialize = function(routePath) {
        return "" + routePath.prefix + routePath.search + routePath.hash + routePath.path;
      };

      LocationStrategyHash.prototype.resolve = function(url, target) {
        var e_3, _a;

        if (target === void 0) {
          target = {};
        }

        var prefix = '';
        var path = '';
        var query = '';
        var search = '';
        var hash = '#';
        var segments;
        var params;
        var regExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#.*)$/gm;
        var matches = url.matchAll(regExp);

        try {
          for (var matches_3 = tslib_1.__values(matches), matches_3_1 = matches_3.next(); !matches_3_1.done; matches_3_1 = matches_3.next()) {
            var match = matches_3_1.value;
            var g1 = match[1];
            var g2 = match[2];
            var g3 = match[3];

            if (g1) {
              prefix = g1;
            }

            if (g2) {
              query = g2;
            }

            if (g3) {
              path = g3;
            }
          }
        } catch (e_3_1) {
          e_3 = {
            error: e_3_1
          };
        } finally {
          try {
            if (matches_3_1 && !matches_3_1.done && (_a = matches_3.return)) _a.call(matches_3);
          } finally {
            if (e_3) throw e_3.error;
          }
        }

        prefix = prefix;
        path = path.substring(1, path.length);
        hash = hash;
        search = query.substring(1, query.length);
        segments = path.split('/').filter(function(x) {
          return x !== '';
        });
        params = {};
        target.prefix = prefix;
        target.path = path;
        target.query = query;
        target.hash = hash;
        target.search = search;
        target.segments = segments;
        target.params = params;
        return target;
      };

      LocationStrategyHash.prototype.getPath = function(url) {
        if (url.indexOf("/#") === -1) {
          return "/#" + url;
        } else {
          return url;
        }
      };

      LocationStrategyHash.prototype.getUrl = function(url, params) {
        return "" + (params ? '?' + params.toString() : '') + this.getPath(url);
      };

      return LocationStrategyHash;
    }(LocationStrategy);

    exports.LocationStrategyHash = LocationStrategyHash;
  }); var routeActivators = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isPromise = exports.mapCanActivateChild$_ = exports.mapCanActivate$_ = exports.mapCanLoad$_ = exports.mapCanDeactivate$_ = void 0;

    function mapCanDeactivate$_(activator) {
      return function canDeactivate$(component, currentRoute) {
        return makeObserver$_(function() {
          return activator.canDeactivate(component, currentRoute);
        });
      };
    }

    exports.mapCanDeactivate$_ = mapCanDeactivate$_;

    function mapCanLoad$_(activator) {
      return function canLoad$$(route, segments) {
        return makeObserver$_(function() {
          return activator.canLoad(route, segments);
        });
      };
    }

    exports.mapCanLoad$_ = mapCanLoad$_;

    function mapCanActivate$_(activator) {
      return function canActivate$(route) {
        return makeObserver$_(function() {
          return activator.canActivate(route);
        });
      };
    }

    exports.mapCanActivate$_ = mapCanActivate$_;

    function mapCanActivateChild$_(activator) {
      return function canActivateChild$(childRoute) {
        return makeObserver$_(function() {
          return activator.canActivateChild(childRoute);
        });
      };
    }

    exports.mapCanActivateChild$_ = mapCanActivateChild$_;

    function isPromise(object) {
      return object instanceof Promise || typeof object === 'object' && 'then' in object && typeof object['then'] === 'function';
    }

    exports.isPromise = isPromise;

    function makeObserver$_(callback) {
      return rxjs__default.Observable.create(function(observer) {
        var subscription;

        try {
          var result = callback();

          if (rxjs__default.isObservable(result)) {
            subscription = result.subscribe(function(result) {
              observer.next(result);
              observer.complete();
            });
          } else if (isPromise(result)) {
            result.then(function(result) {
              observer.next(result);
              observer.complete();
            });
          } else if (typeof result === 'boolean' || Array.isArray(result)) {
            observer.next(result);
            observer.complete();
          } else {
            observer.error(new Error('invalid value'));
          }
        } catch (error) {
          observer.error(error);
        }

        return function() {
          if (subscription) {
            subscription.unsubscribe();
          }
        };
      });
    }
  }); var routeSegment = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.RouteSegment = void 0;

    var RouteSegment = function() {
      function RouteSegment(path, params) {
        if (params === void 0) {
          params = {};
        }

        this.path = path;
        this.params = params;
      }

      return RouteSegment;
    }();

    exports.RouteSegment = RouteSegment;
  }); var route = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Route = void 0;

    var Route = function() {
      function Route(options) {
        var e_1, _a;

        var _this = this;

        this.pathMatch = 'prefix';
        this.relative = true;
        this.canDeactivate = [];
        this.canLoad = [];
        this.canActivate = [];
        this.canActivateChild = [];

        if (options) {
          Object.assign(this, options);
          this.canDeactivate = options.canDeactivate ? options.canDeactivate.map(function(x) {
            return routeActivators.mapCanDeactivate$_(x);
          }) : [];
          this.canLoad = options.canLoad ? options.canLoad.map(function(x) {
            return routeActivators.mapCanLoad$_(x);
          }) : [];
          this.canActivate = options.canActivate ? options.canActivate.map(function(x) {
            return routeActivators.mapCanActivate$_(x);
          }) : [];
          this.canActivateChild = options.canActivateChild ? options.canActivateChild.map(function(x) {
            return routeActivators.mapCanActivateChild$_(x);
          }) : [];
        }

        if (this.children) {
          this.children = this.children.map(function(iRoute) {
            var route = new Route(iRoute);
            route.parent = _this;
            return route;
          });
        }

        var segments = [];

        if (this.path === '**') {
          segments.push(new routeSegment.RouteSegment(this.path));
          this.matcher = new RegExp('^.*$');
        } else {
          var matchers = ["^(../|./|//|/)?"];
          var regExp = /(^\.\.\/|\.\/|\/\/|\/)|([^:|\/]+)\/?|\:([^\/]+)\/?/g;
          var matches = this.path.matchAll(regExp);

          try {
            for (var matches_1 = tslib_1.__values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
              var match = matches_1_1.value;
              var g1 = match[1];
              var g2 = match[2];
              var g3 = match[3];

              if (g1) {
                this.relative = !(g1 === '//' || g1 === '/');
              } else if (g2) {
                matchers.push(g2);
                segments.push(new routeSegment.RouteSegment(g2));
              } else if (g3) {
                matchers.push('(\/[^\/]+)');
                var param = {};
                param[g3] = null;
                segments.push(new routeSegment.RouteSegment('', param));
              }
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

          if (this.pathMatch === 'full') {
            matchers.push('$');
          }

          var regexp = matchers.join('');
          this.matcher = new RegExp(regexp);
        }

        this.segments = segments;
      }

      return Route;
    }();

    exports.Route = Route;
  }); var routePath = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.RoutePath = void 0;

    var RoutePath = function() {
      function RoutePath(url, routeSegments, snapshot, locationStrategy) {
        if (url === void 0) {
          url = '';
        }

        if (routeSegments === void 0) {
          routeSegments = [];
        }

        this.prefix = '';
        this.path = '';
        this.query = '';
        this.search = '';
        this.hash = '';
        this.locationStrategy = locationStrategy || new location_strategy.LocationStrategy();
        this.url = url;
        this.routeSegments = routeSegments;
        this.route = snapshot;
      }

      Object.defineProperty(RoutePath.prototype, "url", {
        get: function get() {
          return this.url_;
        },
        set: function set(url) {
          if (this.url_ !== url) {
            this.locationStrategy.resolve(url, this);
            this.url_ = this.locationStrategy.serialize(this);
          }
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RoutePath.prototype, "routeSegments", {
        get: function get() {
          return this.routeSegments_;
        },
        set: function set(routeSegments) {
          if (this.routeSegments_ !== routeSegments) {
            this.routeSegments_ = routeSegments;
            this.params = this.locationStrategy.resolveParams(this.path, routeSegments);
          }
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RoutePath.prototype, "remainUrl", {
        get: function get() {
          return this.query + this.hash;
        },
        enumerable: false,
        configurable: true
      });
      return RoutePath;
    }();

    exports.RoutePath = RoutePath;
  }); var routeSnapshot = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.RouteSnapshot = void 0;

    var RouteSnapshot = function() {
      function RouteSnapshot(options) {
        this.pathMatch = 'prefix';
        this.relative = true;
        this.data$ = new rxjs__default.ReplaySubject(1);
        this.params$ = new rxjs__default.ReplaySubject(1);
        this.queryParams$ = new rxjs__default.ReplaySubject(1);
        this.canDeactivate = [];
        this.canLoad = [];
        this.canActivate = [];
        this.canActivateChild = [];

        if (options) {
          Object.assign(this, options);
        }

        this.data$.next(this.data);
        this.params$.next(this.params);
        this.queryParams$.next(this.queryParams);
      }

      RouteSnapshot.prototype.next = function(snapshot) {
        this.childRoute = snapshot.childRoute;

        if (snapshot.childRoute) {
          snapshot.childRoute.parent = this;
        }

        var data = this.data = Object.assign({}, snapshot.data);
        this.data$.next(data);
        var params = this.params = Object.assign({}, snapshot.params);
        this.params$.next(params);
        var queryParams = this.queryParams = Object.assign({}, snapshot.queryParams);
        this.queryParams$.next(queryParams);
      };

      return RouteSnapshot;
    }();

    exports.RouteSnapshot = RouteSnapshot;
  }); var routerEvents = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.NavigationError = exports.NavigationCancel = exports.NavigationEnd = exports.RouteConfigLoadEnd = exports.RouteConfigLoadStart = exports.ChildActivationEnd = exports.ActivationEnd = exports.ResolveEnd = exports.ResolveStart = exports.GuardsCheckEnd = exports.ActivationStart = exports.ChildActivationStart = exports.GuardsCheckStart = exports.RoutesRecognized = exports.NavigationStart = exports.RouterEvent = void 0;

    var RouterEvent = function() {
      function RouterEvent(options) {
        if (options) {
          Object.assign(this, options);
        }

        if (this.routerLink) {
          this.url = Array.isArray(this.routerLink) ? this.routerLink.join('') : this.routerLink;
        }
      }

      return RouterEvent;
    }();

    exports.RouterEvent = RouterEvent;

    var NavigationStart = function(_super) {
      tslib_1.__extends(NavigationStart, _super);

      function NavigationStart() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return NavigationStart;
    }(RouterEvent);

    exports.NavigationStart = NavigationStart;

    var RoutesRecognized = function(_super) {
      tslib_1.__extends(RoutesRecognized, _super);

      function RoutesRecognized() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return RoutesRecognized;
    }(RouterEvent);

    exports.RoutesRecognized = RoutesRecognized;

    var GuardsCheckStart = function(_super) {
      tslib_1.__extends(GuardsCheckStart, _super);

      function GuardsCheckStart() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return GuardsCheckStart;
    }(RouterEvent);

    exports.GuardsCheckStart = GuardsCheckStart;

    var ChildActivationStart = function(_super) {
      tslib_1.__extends(ChildActivationStart, _super);

      function ChildActivationStart() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return ChildActivationStart;
    }(RouterEvent);

    exports.ChildActivationStart = ChildActivationStart;

    var ActivationStart = function(_super) {
      tslib_1.__extends(ActivationStart, _super);

      function ActivationStart() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return ActivationStart;
    }(RouterEvent);

    exports.ActivationStart = ActivationStart;

    var GuardsCheckEnd = function(_super) {
      tslib_1.__extends(GuardsCheckEnd, _super);

      function GuardsCheckEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return GuardsCheckEnd;
    }(RouterEvent);

    exports.GuardsCheckEnd = GuardsCheckEnd;

    var ResolveStart = function(_super) {
      tslib_1.__extends(ResolveStart, _super);

      function ResolveStart() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return ResolveStart;
    }(RouterEvent);

    exports.ResolveStart = ResolveStart;

    var ResolveEnd = function(_super) {
      tslib_1.__extends(ResolveEnd, _super);

      function ResolveEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return ResolveEnd;
    }(RouterEvent);

    exports.ResolveEnd = ResolveEnd;

    var ActivationEnd = function(_super) {
      tslib_1.__extends(ActivationEnd, _super);

      function ActivationEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return ActivationEnd;
    }(RouterEvent);

    exports.ActivationEnd = ActivationEnd;

    var ChildActivationEnd = function(_super) {
      tslib_1.__extends(ChildActivationEnd, _super);

      function ChildActivationEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return ChildActivationEnd;
    }(RouterEvent);

    exports.ChildActivationEnd = ChildActivationEnd;

    var RouteConfigLoadStart = function(_super) {
      tslib_1.__extends(RouteConfigLoadStart, _super);

      function RouteConfigLoadStart() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return RouteConfigLoadStart;
    }(RouterEvent);

    exports.RouteConfigLoadStart = RouteConfigLoadStart;

    var RouteConfigLoadEnd = function(_super) {
      tslib_1.__extends(RouteConfigLoadEnd, _super);

      function RouteConfigLoadEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return RouteConfigLoadEnd;
    }(RouterEvent);

    exports.RouteConfigLoadEnd = RouteConfigLoadEnd;

    var NavigationEnd = function(_super) {
      tslib_1.__extends(NavigationEnd, _super);

      function NavigationEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return NavigationEnd;
    }(RouterEvent);

    exports.NavigationEnd = NavigationEnd;

    var NavigationCancel = function(_super) {
      tslib_1.__extends(NavigationCancel, _super);

      function NavigationCancel() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return NavigationCancel;
    }(RouterEvent);

    exports.NavigationCancel = NavigationCancel;

    var NavigationError = function(_super) {
      tslib_1.__extends(NavigationError, _super);

      function NavigationError() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      return NavigationError;
    }(RouterEvent);

    exports.NavigationError = NavigationError;
  }); var router_service = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var RouterService = function() {
      function RouterService() { }

      Object.defineProperty(RouterService, "flatRoutes", {
        get: function get() {
          return getFlatRoutes_(this.routes);
        },
        enumerable: false,
        configurable: true
      });

      RouterService.setRoutes = function(routes) {
        this.routes = routes.map(function(x) {
          return new route.Route(x);
        });
        this.observe$ = makeObserve$_(this.routes, this.route$, this.events$, this.locationStrategy);
        return this;
      };

      RouterService.setRouterLink = function(routerLink, extras) {

        this.events$.next(new routerEvents.NavigationStart({
          routerLink: routerLink,
          trigger: 'imperative'
        }));
      };

      RouterService.navigate = function(routerLink, extras) {

        this.events$.next(new routerEvents.NavigationStart({
          routerLink: routerLink,
          trigger: 'imperative'
        }));
      };

      RouterService.findRoute = function(routerLink) {
        var initialUrl = this.locationStrategy.serializeLink(routerLink);
        return this.findRouteByUrl(initialUrl);
      };

      RouterService.findRouteByUrl = function(initialUrl) {
        var e_1, _a;

        var routes = getFlatRoutes_(this.routes);
        var resolvedRoute = null;
        var lastMatcbesLength = Number.NEGATIVE_INFINITY;

        try {
          for (var routes_1 = tslib_1.__values(routes), routes_1_1 = routes_1.next(); !routes_1_1.done; routes_1_1 = routes_1.next()) {
            var route = routes_1_1.value;
            var matches = initialUrl.match(route.matcher);

            if (matches && (!resolvedRoute || matches[0].length > lastMatcbesLength)) {
              lastMatcbesLength = matches[0].length;
              resolvedRoute = route;
            }
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (routes_1_1 && !routes_1_1.done && (_a = routes_1.return)) _a.call(routes_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }

        var urlAfterRedirects = initialUrl;

        if (resolvedRoute && resolvedRoute.redirectTo) {
          urlAfterRedirects = resolvedRoute.redirectTo;
          resolvedRoute = this.findRouteByUrl(urlAfterRedirects);
        }

        return resolvedRoute;
      };

      RouterService.getPath = function(routerLink) {
        var _this = this;

        if (routerLink === void 0) {
          routerLink = [];
        }

        var lastPath = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(function(x) {
          return typeof x === 'string' ? x : _this.locationStrategy.encodeParams(x);
        }).join('/');
        var segments = [];
        var routes = [];
        var route = this.findRouteByUrl(lastPath);

        if (route) {
          var r = route === null || route === void 0 ? void 0 : route.parent;

          while (r) {
            segments.unshift.apply(segments, r.segments);
            routes.unshift(r instanceof routeSnapshot.RouteSnapshot ? r : r.snapshot || r);
            r = r.parent;
          }

          segments.push.apply(segments, (route === null || route === void 0 ? void 0 : route.segments) || []);
          routes.push({
            path: lastPath
          });
        }

        var initialUrl = routes.map(function(r) {
          return r instanceof routeSnapshot.RouteSnapshot ? r.extractedUrl : r.path;
        }).join('/');
        initialUrl = this.locationStrategy.getPath(initialUrl);
        var routePath$1 = new routePath.RoutePath(initialUrl, segments, route || undefined, this.locationStrategy);
        return routePath$1;
      };

      Object.defineProperty(RouterService, "locationStrategy", {
        get: function get() {
          if (this.locationStrategy_) {
            return this.locationStrategy_;
          } else {
            return this.locationStrategy_ = new location_strategy.LocationStrategyPath();
          }
        },
        enumerable: false,
        configurable: true
      });

      RouterService.useLocationStrategy = function(locationStrategyType) {
        this.locationStrategy_ = new locationStrategyType();
      };

      RouterService.routes = [];
      RouterService.route$ = new rxjs__default.ReplaySubject(1);
      RouterService.events$ = new rxjs__default.ReplaySubject(1);
      return RouterService;
    }();

    exports.default = RouterService;

    function getFlatRoutes_(routes) {
      var reduceRoutes = function reduceRoutes(routes) {
        return routes.reduce(function(p, c) {
          p.push(c);
          p.push.apply(p, reduceRoutes(c.children || []));
          return p;
        }, []);
      };

      return reduceRoutes(routes);
    }

    function getFlatSnapshots_(currentSnapshot) {
      var snapshots = [currentSnapshot];
      var childRoute = currentSnapshot.childRoute;

      while (childRoute) {
        snapshots.push(childRoute);
        childRoute = childRoute.childRoute;
      }

      return snapshots;
    }

    function clearRoutes_(routes, currentSnapshot) {
      var snapshots = getFlatSnapshots_(currentSnapshot);
      var flatRoutes = getFlatRoutes_(routes);
      flatRoutes.forEach(function(route) {
        if (route.snapshot && snapshots.indexOf(route.snapshot) === -1) {
          route.snapshot = undefined;
        }
      });
    }

    function resolveRoutes_(routes, childRoutes, initialUrl) {
      var e_2, _a;

      var resolvedRoute;

      try {
        for (var childRoutes_1 = tslib_1.__values(childRoutes), childRoutes_1_1 = childRoutes_1.next(); !childRoutes_1_1.done; childRoutes_1_1 = childRoutes_1.next()) {
          var childRoute = childRoutes_1_1.value;
          var route = resolveRoute_(routes, childRoute, initialUrl);

          if (route && (!resolvedRoute || route.remainUrl.length < resolvedRoute.remainUrl.length)) {
            resolvedRoute = route;
          }
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (childRoutes_1_1 && !childRoutes_1_1.done && (_a = childRoutes_1.return)) _a.call(childRoutes_1);
        } finally {
          if (e_2) throw e_2.error;
        }
      }

      return resolvedRoute;
    }

    function resolveRoute_(routes, route, initialUrl) {
      var _a;

      var urlAfterRedirects;
      var extractedUrl = '';
      var remainUrl = initialUrl;
      var match = initialUrl.match(route.matcher);

      if (!match) {
        return undefined;
      }

      if (route.redirectTo) {
        var routePath_1 = RouterService.getPath(route.redirectTo);
        return resolveRoutes_(routes, routes, routePath_1.url);
      }

      extractedUrl = match[0];
      remainUrl = initialUrl.substring(match[0].length, initialUrl.length);
      var routePath$1 = new routePath.RoutePath(extractedUrl, route.segments, undefined, RouterService.locationStrategy);
      var params = routePath$1.params;
      var snapshot = new routeSnapshot.RouteSnapshot(tslib_1.__assign(tslib_1.__assign({}, route), {
        initialUrl: initialUrl,
        urlAfterRedirects: urlAfterRedirects,
        extractedUrl: extractedUrl,
        remainUrl: remainUrl,
        params: params
      }));
      route.snapshot = snapshot;

      if (((_a = route.children) === null || _a === void 0 ? void 0 : _a.length) && remainUrl.length) {
        var childRoute = resolveRoutes_(routes, route.children, remainUrl);
        snapshot.childRoute = childRoute;

        if (childRoute) {
          childRoute.parent = snapshot;
        }
      }

      return snapshot;
    }

    function makeActivatorResponse$_(event, activators) {
      return rxjs__default.combineLatest.apply(void 0, tslib_1.__spread(activators)).pipe(operators__default.map(function(values) {
        var canActivate = values.reduce(function(p, c) {
          return p === true ? c === true ? true : c : p;
        }, true);

        if (canActivate === true) {
          return event;
        } else {
          var cancelEvent = tslib_1.__assign(tslib_1.__assign({}, event), {
            reason: 'An activation guard has dismissed navigation to the route.'
          });

          if (canActivate !== false) {
            var routePath = RouterService.getPath(canActivate);
            cancelEvent.redirectTo = [routePath.url];
          }

          return new routerEvents.NavigationCancel(cancelEvent);
        }
      }));
    }

    function makeCanDeactivateResponse$_(events$, event, currentRoute) {
      if (event.route.canDeactivate && event.route.canDeactivate.length) {
        var route = event.route;
        var instance_1 = rxcomp__default.getContextByNode(event.route.element).instance;
        return makeActivatorResponse$_(event, route.canDeactivate.map(function(x) {
          return x(instance_1, currentRoute);
        }));
      } else {
        return rxjs__default.of(event);
      }
    }

    function makeCanLoadResponse$_(events$, event) {
      if (event.route.canLoad && event.route.canLoad.length) {
        var route_2 = event.route;
        return makeActivatorResponse$_(event, route_2.canLoad.map(function(x) {
          return x(route_2, route_2.segments);
        }));
      } else {
        return rxjs__default.of(event);
      }
    }

    function makeCanActivateChildResponse$_(events$, event) {
      var reduceChildRouteActivators_ = function reduceChildRouteActivators_(route, activators) {
        while (route != null && route.canActivateChild && route.canActivateChild.length && route.childRoute) {
          var routeActivators = route.canActivateChild.map(function(x) {
            return x(route.childRoute);
          });
          Array.prototype.push.apply(activators, routeActivators);
          route = route.childRoute;
        }

        return activators;
      };

      var activators = reduceChildRouteActivators_(event.route, []);

      if (activators.length) {
        return makeActivatorResponse$_(event, activators);
      } else {
        return rxjs__default.of(event);
      }
    }

    function makeCanActivateResponse$_(events$, event) {
      if (event.route.canActivate && event.route.canActivate.length) {
        var route_3 = event.route;
        return makeActivatorResponse$_(event, route_3.canActivate.map(function(x) {
          return x(route_3);
        }));
      } else {
        return rxjs__default.of(event);
      }
    }

    function makeObserve$_(routes, route$, events$, locationStrategy) {
      var currentRoute;
      var stateEvents$ = rxcomp__default.isPlatformServer ? rxjs__default.EMPTY : rxjs__default.merge(rxjs__default.fromEvent(rxcomp__default.WINDOW, 'popstate')).pipe(operators__default.map(function(event) {
        return new routerEvents.NavigationStart({
          routerLink: document.location.pathname,
          trigger: 'popstate'
        });
      }), operators__default.shareReplay(1));
      return rxjs__default.merge(stateEvents$, events$).pipe(operators__default.switchMap(function(event) {
        if (event instanceof routerEvents.GuardsCheckStart) {
          return makeCanDeactivateResponse$_(events$, event, currentRoute).pipe(operators__default.switchMap(function(nextEvent) {
            if (nextEvent instanceof routerEvents.NavigationCancel) {
              return rxjs__default.of(nextEvent);
            } else {
              return makeCanLoadResponse$_(events$, event).pipe(operators__default.switchMap(function(nextEvent) {
                if (nextEvent instanceof routerEvents.NavigationCancel) {
                  return rxjs__default.of(nextEvent);
                } else {
                  return makeCanActivateChildResponse$_(events$, event);
                }
              }));
            }
          }));
        } else if (event instanceof routerEvents.ChildActivationStart) {
          return makeCanActivateResponse$_(events$, event);
        } else {
          return rxjs__default.of(event);
        }
      }), operators__default.tap(function(event) {
        var _a, _b, _c;

        if (event instanceof routerEvents.NavigationStart) {
          var routerLink = event.routerLink;
          var snapshot = void 0;
          var initialUrl = void 0;
          var routePath = RouterService.getPath(routerLink);
          initialUrl = routePath.url;
          var isRelative = initialUrl.indexOf('/') !== 0;

          if (isRelative && currentRoute && ((_a = currentRoute.children) === null || _a === void 0 ? void 0 : _a.length)) {
            snapshot = resolveRoutes_(routes, currentRoute.children, initialUrl);

            if (snapshot) {
              currentRoute.childRoute = snapshot;
              snapshot.parent = currentRoute;
              snapshot = currentRoute;
            }
          } else {
            snapshot = resolveRoutes_(routes, routes, initialUrl);
          }

          if (snapshot) {
            currentRoute = snapshot;
            events$.next(new routerEvents.RoutesRecognized(tslib_1.__assign(tslib_1.__assign({}, event), {
              route: snapshot
            })));
          } else {
            events$.next(new routerEvents.NavigationError(tslib_1.__assign(tslib_1.__assign({}, event), {
              error: new Error('unknown route')
            })));
          }
        } else if (event instanceof routerEvents.RoutesRecognized) {
          events$.next(new routerEvents.GuardsCheckStart(tslib_1.__assign({}, event)));
        } else if (event instanceof routerEvents.GuardsCheckStart) {
          events$.next(new routerEvents.ChildActivationStart(tslib_1.__assign({}, event)));
        } else if (event instanceof routerEvents.ChildActivationStart) {
          events$.next(new routerEvents.ActivationStart(tslib_1.__assign({}, event)));
        } else if (event instanceof routerEvents.ActivationStart) {
          events$.next(new routerEvents.GuardsCheckEnd(tslib_1.__assign({}, event)));
        } else if (event instanceof routerEvents.GuardsCheckEnd) {
          events$.next(new routerEvents.ResolveStart(tslib_1.__assign({}, event)));
        } else if (event instanceof routerEvents.ResolveStart) {
          events$.next(new routerEvents.ResolveEnd(tslib_1.__assign({}, event)));
        } else if (event instanceof routerEvents.ResolveEnd) {
          events$.next(new routerEvents.ActivationEnd(tslib_1.__assign({}, event)));
        } else if (event instanceof routerEvents.ActivationEnd) {
          events$.next(new routerEvents.ChildActivationEnd(tslib_1.__assign({}, event)));
        } else if (event instanceof routerEvents.ChildActivationEnd) {
          events$.next(new routerEvents.RouteConfigLoadStart(tslib_1.__assign({}, event)));
        } else if (event instanceof routerEvents.RouteConfigLoadStart) {
          events$.next(new routerEvents.RouteConfigLoadEnd(tslib_1.__assign({}, event)));
        } else if (event instanceof routerEvents.RouteConfigLoadEnd) {
          events$.next(new routerEvents.NavigationEnd(tslib_1.__assign({}, event)));
        } else if (event instanceof routerEvents.NavigationEnd) {
          var segments = [];
          var source = event.route;

          while (source != null) {
            if ((_b = source.extractedUrl) === null || _b === void 0 ? void 0 : _b.length) {
              segments.push(source.extractedUrl);
            }

            if (source.childRoute) {
              source = source.childRoute;
            } else {
              if ((_c = source.remainUrl) === null || _c === void 0 ? void 0 : _c.length) {
                segments[segments.length - 1] = segments[segments.length - 1] + source.remainUrl;
              }

              source = undefined;
            }
          }

          var extractedUrl = segments.join('/').replace(/\/\//g, '/');
          console.log('NavigationEnd', event.route.initialUrl, event.route.extractedUrl, event.route.urlAfterRedirects);
          clearRoutes_(routes, event.route);
          locationStrategy.setHistory(extractedUrl, undefined, event.trigger === 'popstate');
          route$.next(event.route);
        } else if (event instanceof routerEvents.NavigationCancel) {
          console.log('NavigationCancel', event.reason, event.redirectTo);

          if (event.redirectTo) {
            events$.next(new routerEvents.NavigationStart({
              routerLink: event.redirectTo,
              trigger: 'imperative'
            }));
          }
        } else if (event instanceof routerEvents.NavigationError) {
          console.log('NavigationError', event.error);
        }
      }), operators__default.catchError(function(error) {
        return rxjs__default.of(new routerEvents.NavigationError(tslib_1.__assign(tslib_1.__assign({}, event), {
          error: error
        })));
      }), operators__default.shareReplay(1));
    }
  }); var routerLink_directive = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var router_service_1 = tslib_1.__importDefault(router_service);

    var RouterLinkDirective = function(_super) {
      tslib_1.__extends(RouterLinkDirective, _super);

      function RouterLinkDirective() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      Object.defineProperty(RouterLinkDirective.prototype, "routerLink", {
        get: function get() {
          return this.routerLink_;
        },
        set: function set(routerLink) {
          this.routerLink_ = Array.isArray(routerLink) ? routerLink : [routerLink];
          this.segments = this.getSegments(this.routerLink_);
        },
        enumerable: false,
        configurable: true
      });

      RouterLinkDirective.prototype.getSegments = function(routerLink) {
        var segments = [];
        routerLink.forEach(function(item) {
          var e_1, _a;

          if (typeof item === 'string') {
            var regExp = /([^:]+)|\:([^\/]+)/g;
            var matches = item.matchAll(regExp);
            var components = [];

            try {
              for (var matches_1 = tslib_1.__values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
                var match = matches_1_1.value;
                var g1 = match[1];
                var g2 = match[2];

                if (g1) {
                  components.push(g1);
                } else if (g2) {
                  var param = {};
                  param[g2] = null;
                  components.push(param);
                }
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
          } else {
            segments.push(new routeSegment.RouteSegment('', {}));
          }
        });
        return segments;
      };

      RouterLinkDirective.prototype.onInit = function() {
        var _this = this;

        var node = rxcomp__default.getContext(this).node;
        var event$ = rxjs__default.fromEvent(node, 'click').pipe(operators__default.shareReplay(1));
        event$.pipe(operators__default.takeUntil(this.unsubscribe$)).subscribe(function(event) {
          var navigationExtras = {
            skipLocationChange: _this.skipLocationChange,
            replaceUrl: _this.replaceUrl,
            state: _this.state
          };
          router_service_1.default.setRouterLink(_this.routerLink, navigationExtras);
          event.preventDefault();
          return false;
        });
      };

      RouterLinkDirective.prototype.onChanges = function() {
        var node = rxcomp__default.getContext(this).node;
        var routePath = router_service_1.default.getPath(this.routerLink_);
        node.setAttribute('href', routePath.url);
      };

      RouterLinkDirective.meta = {
        selector: '[routerLink],[[routerLink]]',
        inputs: ['routerLink']
      };
      return RouterLinkDirective;
    }(rxcomp__default.Directive);

    exports.default = RouterLinkDirective;
  }); var routerLinkActive_directive = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var router_link_directive_1 = tslib_1.__importDefault(routerLink_directive);

    var router_service_1 = tslib_1.__importDefault(router_service);

    var RouterLinkActiveDirective = function(_super) {
      tslib_1.__extends(RouterLinkActiveDirective, _super);

      function RouterLinkActiveDirective() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.keys = [];
        return _this;
      }

      RouterLinkActiveDirective.prototype.onChanges = function() {
        var node = rxcomp__default.getContext(this).node;
        node.classList.remove.apply(node.classList, this.keys);
        var keys = [];
        var active = this.isActive();

        if (active) {
          var object = this.routerLinkActive;

          if (typeof object === 'object') {
            for (var key in object) {
              if (object[key]) {
                keys.push(key);
              }
            }
          } else if (typeof object === 'string') {
            keys = object.split(' ').filter(function(x) {
              return x.length;
            });
          }
        }

        node.classList.add.apply(node.classList, keys);
        this.keys = keys;
      };

      RouterLinkActiveDirective.prototype.isActive = function() {
        var _a;

        var path = router_service_1.default.getPath(this.host.routerLink);
        var isActive = ((_a = path.route) === null || _a === void 0 ? void 0 : _a.snapshot) != null;
        return isActive;
      };

      RouterLinkActiveDirective.meta = {
        selector: '[routerLinkActive],[[routerLinkActive]]',
        hosts: {
          host: router_link_directive_1.default
        },
        inputs: ['routerLinkActive']
      };
      return RouterLinkActiveDirective;
    }(rxcomp__default.Directive);

    exports.default = RouterLinkActiveDirective;
  }); var routerOutlet_structure = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.asObservable = void 0;

    var view_1 = tslib_1.__importDefault(view);

    var router_service_1 = tslib_1.__importDefault(router_service);

    var RouterOutletStructure = function(_super) {
      tslib_1.__extends(RouterOutletStructure, _super);

      function RouterOutletStructure() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.route$_ = new rxjs__default.ReplaySubject(1);
        return _this;
      }

      Object.defineProperty(RouterOutletStructure.prototype, "route", {
        get: function get() {
          return this.route_;
        },
        enumerable: false,
        configurable: true
      });

      RouterOutletStructure.prototype.onInit = function() {
        var _this = this;

        var _a;

        this.route$().pipe(operators__default.switchMap(function(snapshot) {
          return _this.factory$(snapshot);
        }), operators__default.takeUntil(this.unsubscribe$)).subscribe(function() { });

        if (this.host) {
          this.route$_.next((_a = this.host.route) === null || _a === void 0 ? void 0 : _a.childRoute);
        }
      };

      RouterOutletStructure.prototype.onChanges = function() {
        var _a;

        if (this.host) {
          this.route$_.next((_a = this.host.route) === null || _a === void 0 ? void 0 : _a.childRoute);
        }
      };

      RouterOutletStructure.prototype.route$ = function() {
        var _this = this;

        var source = this.host ? this.route$_ : router_service_1.default.route$;
        return source.pipe(operators__default.filter(function(snapshot) {
          _this.route_ = snapshot;

          if (_this.snapshot_ && snapshot && _this.snapshot_.component === snapshot.component) {
            _this.snapshot_.next(snapshot);

            return false;
          } else {
            _this.snapshot_ = snapshot;
            return true;
          }
        }));
      };

      RouterOutletStructure.prototype.factory$ = function(snapshot) {
        var _this = this;

        var _a = rxcomp__default.getContext(this),
          module = _a.module,
          node = _a.node;

        var factory = snapshot === null || snapshot === void 0 ? void 0 : snapshot.component;

        if (this.factory_ !== factory) {
          this.factory_ = factory;
          return this.onExit$_(this.element, this.instance).pipe(operators__default.tap(function() {
            if (_this.element) {
              _this.element.parentNode.removeChild(_this.element);

              module.remove(_this.element, _this);
              _this.element = undefined;
              _this.instance = undefined;
            }
          }), operators__default.switchMap(function() {
            if (snapshot && factory && factory.meta.template) {
              var element = document.createElement('div');
              element.innerHTML = factory.meta.template;

              if (element.children.length === 1) {
                element = element.firstElementChild;
              }

              node.appendChild(element);
              var instance = module.makeInstance(element, factory, factory.meta.selector, _this, undefined, {
                route: snapshot
              });
              module.compile(element, instance);
              _this.instance = instance;
              _this.element = element;
              snapshot.element = element;
              return _this.onEnter$_(element, instance);
            } else {
              return rxjs__default.of(false);
            }
          }));
        } else {
          return rxjs__default.of(false);
        }
      };

      RouterOutletStructure.prototype.onEnter$_ = function(element, instance) {
        if (element && instance && instance instanceof view_1.default) {
          return asObservable([element], instance.onEnter);
        } else {
          return rxjs__default.of(true);
        }
      };

      RouterOutletStructure.prototype.onExit$_ = function(element, instance) {
        if (element && instance && instance instanceof view_1.default) {
          return asObservable([element], instance.onExit);
        } else {
          return rxjs__default.of(true);
        }
      };

      RouterOutletStructure.meta = {
        selector: 'router-outlet,[router-outlet]',
        hosts: {
          host: RouterOutletStructure
        }
      };
      return RouterOutletStructure;
    }(rxcomp__default.Structure);

    exports.default = RouterOutletStructure;

    function asObservable(args, callback) {
      return rxjs__default.Observable.create(function(observer) {
        var subscription;

        try {
          var result = callback.apply(void 0, tslib_1.__spread(args));

          if (rxjs__default.isObservable(result)) {
            subscription = result.subscribe(function(result) {
              observer.next(result);
              observer.complete();
            });
          } else if (routeActivators.isPromise(result)) {
            result.then(function(result) {
              observer.next(result);
              observer.complete();
            });
          } else if (typeof result === 'function') {
            observer.next(result());
            observer.complete();
          } else {
            observer.next(result);
            observer.complete();
          }
        } catch (error) {
          observer.error(error);
        }

        return function() {
          if (subscription) {
            subscription.unsubscribe();
          }
        };
      });
    }

    exports.asObservable = asObservable;
  }); var router_module = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var router_link_active_directive_1 = tslib_1.__importDefault(routerLinkActive_directive);

    var router_link_directive_1 = tslib_1.__importDefault(routerLink_directive);

    var router_outlet_structure_1 = tslib_1.__importDefault(routerOutlet_structure);

    var router_service_1 = tslib_1.__importDefault(router_service);

    var factories = [router_outlet_structure_1.default, router_link_directive_1.default, router_link_active_directive_1.default];
    var pipes = [];

    var RouterModule = function(_super) {
      tslib_1.__extends(RouterModule, _super);

      function RouterModule() {
        var _this = _super.call(this) || this;

        router_service_1.default.observe$.pipe(operators__default.tap(function(event) {
          var _a;

          if (event instanceof routerEvents.NavigationEnd || event instanceof routerEvents.NavigationCancel || event instanceof routerEvents.NavigationError) {
            if ((_a = _this.instances) === null || _a === void 0 ? void 0 : _a.length) {
              var root = _this.instances[0];
              root.pushChanges();
            }
          }
        }), operators__default.takeUntil(_this.unsubscribe$)).subscribe();
        router_service_1.default.navigate("" + (location.pathname === '' ? '/' : location.pathname) + location.search + location.hash);
        return _this;
      }

      RouterModule.forRoot = function(routes) {
        router_service_1.default.setRoutes(routes);
        return this;
      };

      RouterModule.useStrategy = function(locationStrategyType) {
        router_service_1.default.useLocationStrategy(locationStrategyType);
        return this;
      };

      RouterModule.meta = {
        declarations: tslib_1.__spread(factories, pipes),
        exports: tslib_1.__spread(factories, pipes)
      };
      return RouterModule;
    }(rxcomp__default.Module);

    exports.default = RouterModule;
  }); var router_types = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.RouteLocationStrategy = void 0;
    var RouteLocationStrategy;

    (function(RouteLocationStrategy) {
      RouteLocationStrategy["Path"] = "path";
      RouteLocationStrategy["Hash"] = "hash";
    })(RouteLocationStrategy = exports.RouteLocationStrategy || (exports.RouteLocationStrategy = {}));
  }); var transition = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.transition$ = void 0;

    function transition$(callback) {
      return rxjs__default.Observable.create(function(observer) {
        try {
          if (rxcomp__default.isPlatformBrowser) {
            callback(function(result) {
              observer.next(result);
              observer.complete();
            });
          } else {
            observer.next(true);
            observer.complete();
          }
        } catch (error) {
          observer.error(error);
        }
      });
    }

    exports.transition$ = transition$;
  }); var rxcompRouter = createCommonjsModule(function(module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "View", {
      enumerable: true,
      get: function get() {
        return view.default;
      }
    });
    Object.defineProperty(exports, "LocationStrategy", {
      enumerable: true,
      get: function get() {
        return location_strategy.LocationStrategy;
      }
    });
    Object.defineProperty(exports, "LocationStrategyHash", {
      enumerable: true,
      get: function get() {
        return location_strategy.LocationStrategyHash;
      }
    });
    Object.defineProperty(exports, "LocationStrategyPath", {
      enumerable: true,
      get: function get() {
        return location_strategy.LocationStrategyPath;
      }
    });
    Object.defineProperty(exports, "Route", {
      enumerable: true,
      get: function get() {
        return route.Route;
      }
    });
    Object.defineProperty(exports, "RoutePath", {
      enumerable: true,
      get: function get() {
        return routePath.RoutePath;
      }
    });
    Object.defineProperty(exports, "RouteSegment", {
      enumerable: true,
      get: function get() {
        return routeSegment.RouteSegment;
      }
    });
    Object.defineProperty(exports, "RouteSnapshot", {
      enumerable: true,
      get: function get() {
        return routeSnapshot.RouteSnapshot;
      }
    });
    Object.defineProperty(exports, "RouterModule", {
      enumerable: true,
      get: function get() {
        return router_module.default;
      }
    });
    Object.defineProperty(exports, "RouteLocationStrategy", {
      enumerable: true,
      get: function get() {
        return router_types.RouteLocationStrategy;
      }
    });
    Object.defineProperty(exports, "ActivationEnd", {
      enumerable: true,
      get: function get() {
        return routerEvents.ActivationEnd;
      }
    });
    Object.defineProperty(exports, "ActivationStart", {
      enumerable: true,
      get: function get() {
        return routerEvents.ActivationStart;
      }
    });
    Object.defineProperty(exports, "ChildActivationEnd", {
      enumerable: true,
      get: function get() {
        return routerEvents.ChildActivationEnd;
      }
    });
    Object.defineProperty(exports, "ChildActivationStart", {
      enumerable: true,
      get: function get() {
        return routerEvents.ChildActivationStart;
      }
    });
    Object.defineProperty(exports, "GuardsCheckEnd", {
      enumerable: true,
      get: function get() {
        return routerEvents.GuardsCheckEnd;
      }
    });
    Object.defineProperty(exports, "GuardsCheckStart", {
      enumerable: true,
      get: function get() {
        return routerEvents.GuardsCheckStart;
      }
    });
    Object.defineProperty(exports, "NavigationCancel", {
      enumerable: true,
      get: function get() {
        return routerEvents.NavigationCancel;
      }
    });
    Object.defineProperty(exports, "NavigationEnd", {
      enumerable: true,
      get: function get() {
        return routerEvents.NavigationEnd;
      }
    });
    Object.defineProperty(exports, "NavigationError", {
      enumerable: true,
      get: function get() {
        return routerEvents.NavigationError;
      }
    });
    Object.defineProperty(exports, "NavigationStart", {
      enumerable: true,
      get: function get() {
        return routerEvents.NavigationStart;
      }
    });
    Object.defineProperty(exports, "ResolveEnd", {
      enumerable: true,
      get: function get() {
        return routerEvents.ResolveEnd;
      }
    });
    Object.defineProperty(exports, "ResolveStart", {
      enumerable: true,
      get: function get() {
        return routerEvents.ResolveStart;
      }
    });
    Object.defineProperty(exports, "RouteConfigLoadEnd", {
      enumerable: true,
      get: function get() {
        return routerEvents.RouteConfigLoadEnd;
      }
    });
    Object.defineProperty(exports, "RouteConfigLoadStart", {
      enumerable: true,
      get: function get() {
        return routerEvents.RouteConfigLoadStart;
      }
    });
    Object.defineProperty(exports, "RouterEvent", {
      enumerable: true,
      get: function get() {
        return routerEvents.RouterEvent;
      }
    });
    Object.defineProperty(exports, "RoutesRecognized", {
      enumerable: true,
      get: function get() {
        return routerEvents.RoutesRecognized;
      }
    });
    Object.defineProperty(exports, "RouterLinkActiveDirective", {
      enumerable: true,
      get: function get() {
        return routerLinkActive_directive.default;
      }
    });
    Object.defineProperty(exports, "RouterLinkDirective", {
      enumerable: true,
      get: function get() {
        return routerLink_directive.default;
      }
    });
    Object.defineProperty(exports, "asObservable", {
      enumerable: true,
      get: function get() {
        return routerOutlet_structure.asObservable;
      }
    });
    Object.defineProperty(exports, "RouterOutletStructure", {
      enumerable: true,
      get: function get() {
        return routerOutlet_structure.default;
      }
    });
    Object.defineProperty(exports, "transition$", {
      enumerable: true,
      get: function get() {
        return transition.transition$;
      }
    });
  }); var AppComponent = function(_Component) {
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
  }; var CustomRequestInterceptor = function() {
    function CustomRequestInterceptor() { }

    var _proto = CustomRequestInterceptor.prototype;

    _proto.intercept = function intercept(request, next) {

      return next.handle(request);
    };

    return CustomRequestInterceptor;
  }();
  var CustomResponseInterceptor = function() {
    function CustomResponseInterceptor() { }

    var _proto2 = CustomResponseInterceptor.prototype;

    _proto2.intercept = function intercept(request, next) {
      return next.handle(request).pipe(operators.tap(function(event) {
        if (event instanceof rxcompHttp.HttpResponse) {
          console.log('CustomResponseInterceptor.status', event.status);
          console.log('CustomResponseInterceptor.filter', request.params.get('filter'));
        }
      }));
    };

    return CustomResponseInterceptor;
  }(); var NotFoundComponent = function(_Component) {
    _inheritsLoose(NotFoundComponent, _Component);

    function NotFoundComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = NotFoundComponent.prototype;

    _proto.onInit = function onInit() { };

    return NotFoundComponent;
  }(rxcomp.Component);
  NotFoundComponent.meta = {
    selector: '[not-found-component]',
    template: "\n        <div class=\"page-not-found\">\n            <div class=\"title\">Not Found</div>\n        </div>\n        "
  }; var TodolistItemComponent = function(_View) {
    _inheritsLoose(TodolistItemComponent, _View);

    function TodolistItemComponent() {
      return _View.apply(this, arguments) || this;
    }

    var _proto = TodolistItemComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      console.log('TodolistItemComponent.onInit', this.route);
      rxjs.combineLatest(this.route.data$, this.route.params$).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function(datas) {
        _this.title = datas[0].title;
        _this.itemId = datas[1].itemId;
      });
    };

    _proto.onEnter = function onEnter(node) {
      return rxcompRouter.transition$(function(complete) {
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
      return rxcompRouter.transition$(function(complete) {
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
    template: "\n        <div class=\"page-detail\">\n            <div class=\"title\">Todolist Item {{itemId}}</div>\n        </div>\n        "
  }; var Vars = {
    name: 'rxcomp-server',
    host: '',
    resource: '/',
    api: '/api',
    static: false,
    development: false,
    production: true
  }; var TodolistComponent = function(_Component) {
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
      var methodUrl = "" + Vars.host + Vars.api;
      console.log('TodolistComponent.onInit', this);

      {
        rxcompHttp.HttpService.post$(methodUrl, payload, {
          params: {
            query: "{ getTodos { id, title, completed } }"
          },
          reportProgress: false
        }).pipe(operators.first()).subscribe(function(response) {
          _this2.items = response.data.getTodos;

          _this2.pushChanges();
        }, console.warn);
      }

      var route = this.host.route;

      if (route) {
        route.data$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function(data) {
          _this2.title = data.title;
        });
      }

      rxcomp.errors$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function(error) {
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
    template: "\n        <div class=\"page-todolist\">\n\t\t\t<div class=\"title\">{{title}}</div>\n\t\t\t<!-- {{items | json}} -->\n\t\t\t<ul class=\"list\">\n\t\t\t\t<li class=\"list__item\" *for=\"let item of items\" [class]=\"{ completed: item.completed }\" [style]=\"{ 'border-color': item.completed ? 'red' : 'black' }\">\n\t\t\t\t\t<div class=\"title\" [routerLink]=\"['/todolist', item.id]\" [innerHTML]=\"item.title\"></div>\n\t\t\t\t\t<div class=\"completed\" (click)=\"onClick(item)\" [innerHTML]=\"item.completed\"></div>\n\t\t\t\t\t<!-- !!! debug -->\n\t\t\t\t\t<!-- <div class=\"completed\" (click)=\"onClick(item)\">{{item.completed}}</div> -->\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t<div *if=\"error\">\n\t\t\t\t<span>error => {{error | json}}</span>\n\t\t\t</div>\n        </div>\n        "
  }; var AppModule = function(_Module) {
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
  }; rxcomp.Browser.bootstrap(AppModule);
}(rxcomp, rxcomp.http, rxjs, rxjs.operators));
