/**
 * @license rxcomp-server v1.0.0-beta.13
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('rxcomp'),require('rxjs'),require('rxjs/operators'),require('htmlparser2')):typeof define==='function'&&define.amd?define(['exports','rxcomp','rxjs','rxjs/operators','htmlparser2'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.rxcomp=g.rxcomp||{},g.rxcomp.server={}),g.rxcomp,g.rxjs,g.rxjs.operators,g.htmlparser2));}(this,(function(exports, rxcomp, rxjs, operators, htmlparser2){'use strict';function _defineProperties(target, props) {
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

(function (CacheControlType) {
  CacheControlType["Public"] = "public";
  CacheControlType["Private"] = "private";
  CacheControlType["NoCache"] = "no-cache";
  CacheControlType["NoStore"] = "no-store";
})(exports.CacheControlType || (exports.CacheControlType = {}));

var CacheItem = /*#__PURE__*/function () {
  function CacheItem(options) {
    this.date = new Date();
    this.maxAge = 0;
    this.cacheControl = exports.CacheControlType.Public;

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
      return this.cacheControl === exports.CacheControlType.NoStore || this.maxAge === 0 || this.date.getTime() + this.maxAge * 1000 < Date.now();
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
      cacheControl = exports.CacheControlType.Public;
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
      cacheControl = exports.CacheControlType.Public;
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
}();(function (RxNodeType) {
  RxNodeType[RxNodeType["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
  RxNodeType[RxNodeType["TEXT_NODE"] = 3] = "TEXT_NODE";
  RxNodeType[RxNodeType["CDATA_SECTION_NODE"] = 4] = "CDATA_SECTION_NODE";
  RxNodeType[RxNodeType["PROCESSING_INSTRUCTION_NODE"] = 7] = "PROCESSING_INSTRUCTION_NODE";
  RxNodeType[RxNodeType["COMMENT_NODE"] = 8] = "COMMENT_NODE";
  RxNodeType[RxNodeType["DOCUMENT_NODE"] = 9] = "DOCUMENT_NODE";
  RxNodeType[RxNodeType["DOCUMENT_TYPE_NODE"] = 10] = "DOCUMENT_TYPE_NODE";
  RxNodeType[RxNodeType["DOCUMENT_FRAGMENT_NODE"] = 11] = "DOCUMENT_FRAGMENT_NODE";
})(exports.RxNodeType || (exports.RxNodeType = {}));

(function (SelectorType) {
  SelectorType[SelectorType["None"] = -1] = "None";
  SelectorType[SelectorType["Id"] = 0] = "Id";
  SelectorType[SelectorType["Class"] = 1] = "Class";
  SelectorType[SelectorType["Attribute"] = 2] = "Attribute";
  SelectorType[SelectorType["TagName"] = 3] = "TagName";
})(exports.SelectorType || (exports.SelectorType = {}));

var RxSelector = function RxSelector(options) {
  this.selector = '';
  this.type = exports.SelectorType.None;
  this.negate = false;

  if (options) {
    Object.assign(this, options);
  }
};
var RxQuery = function RxQuery(options) {
  this.selector = '';
  this.selectors = [];
  this.inner = false;

  if (options) {
    Object.assign(this, options);
  }
};
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
    _this6.nodeType = exports.RxNodeType.ELEMENT_NODE;
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

        if (node.nodeType === exports.RxNodeType.ELEMENT_NODE) {
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
        if (node.nodeType === exports.RxNodeType.ELEMENT_NODE) {
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

      if (this.nodeType === exports.RxNodeType.TEXT_NODE) {
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
    _this12.nodeType = exports.RxNodeType.TEXT_NODE;
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
var RxCData = /*#__PURE__*/function (_RxNode3) {
  _inheritsLoose(RxCData, _RxNode3);

  function RxCData(parentNode, nodeValue) {
    var _this13;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this13 = _RxNode3.call(this, parentNode) || this;
    _this13.nodeType = exports.RxNodeType.CDATA_SECTION_NODE;
    _this13.nodeValue = String(nodeValue);
    return _this13;
  }

  var _proto6 = RxCData.prototype;

  _proto6.serialize = function serialize() {
    return this.nodeValue;
  };

  _createClass(RxCData, [{
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

  return RxCData;
}(RxNode);
var RxComment = /*#__PURE__*/function (_RxNode4) {
  _inheritsLoose(RxComment, _RxNode4);

  function RxComment(parentNode, nodeValue) {
    var _this14;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this14 = _RxNode4.call(this, parentNode) || this;
    _this14.nodeType = exports.RxNodeType.COMMENT_NODE;
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
    _this15.nodeType = exports.RxNodeType.PROCESSING_INSTRUCTION_NODE;
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
    _this16.nodeType = exports.RxNodeType.DOCUMENT_TYPE_NODE;
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
    _this17.nodeType = exports.RxNodeType.DOCUMENT_FRAGMENT_NODE;
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
    _this18.nodeType = exports.RxNodeType.DOCUMENT_NODE;
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
  return x.nodeType === exports.RxNodeType.ELEMENT_NODE;
}
function isRxText(x) {
  return x.nodeType === exports.RxNodeType.TEXT_NODE;
}
function isRxComment(x) {
  return x.nodeType === exports.RxNodeType.COMMENT_NODE;
}
function isRxDocument(x) {
  return x.nodeType === exports.RxNodeType.DOCUMENT_NODE;
}
function isRxDocumentFragment(x) {
  return x.nodeType === exports.RxNodeType.DOCUMENT_FRAGMENT_NODE;
}
function isRxDocumentType(x) {
  return x.nodeType === exports.RxNodeType.DOCUMENT_TYPE_NODE;
}
function isRxProcessingInstruction(x) {
  return x.nodeType === exports.RxNodeType.PROCESSING_INSTRUCTION_NODE;
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
            type: exports.SelectorType.Id,
            negate: true
          });
        } else if (match[2]) {
          selectors.push({
            selector: match[2],
            type: exports.SelectorType.Class,
            negate: true
          });
        } else if (match[3]) {
          selectors.push({
            selector: match[3],
            type: exports.SelectorType.Attribute,
            negate: true
          });
        } else if (match[4]) {
          selectors.push({
            selector: match[4],
            type: exports.SelectorType.TagName,
            negate: true
          });
        } else if (match[5]) {
          selectors.push({
            selector: match[5],
            type: exports.SelectorType.Id,
            negate: false
          });
        } else if (match[6]) {
          selectors.push({
            selector: match[6],
            type: exports.SelectorType.Class,
            negate: false
          });
        } else if (match[7]) {
          selectors.push({
            selector: match[7],
            type: exports.SelectorType.Attribute,
            negate: false
          });
        } else if (match[8]) {
          selectors.push({
            selector: match[8],
            type: exports.SelectorType.TagName,
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
    case exports.SelectorType.Id:
      return (selector.selector !== '' && child.attributes.id === selector.selector) !== selector.negate;

    case exports.SelectorType.Class:
      return child.classList.indexOf(selector.selector) !== -1 !== selector.negate;

    case exports.SelectorType.Attribute:
      return Object.keys(child.attributes).indexOf(selector.selector) !== -1 !== selector.negate;

    case exports.SelectorType.TagName:
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
  this.cacheControl = exports.CacheControlType.Public;

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
  var request;
  var request$ = rxjs.Observable.create(function (observer) {
    request = new ServerRequest(iRequest);
    observer.next(request);
    observer.complete();
  });
  return request$.pipe(operators.switchMap(function (request) {
    return fromCache$(request);
  }), operators.switchMap(function (response) {
    console.log('Server.render$.fromCache', 'route', request.url, !!response);

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
}var factories = [];
var pipes = [];
/**
 *  ServerModule Class.
 * @example
 * export default class AppModule extends Module {}
 *
 * AppModule.meta = {
 *  imports: [
 *   CoreModule,
 *    ServerModule
 *  ],
 *  declarations: [
 *   ErrorsComponent
 *  ],
 *  bootstrap: AppComponent,
 * };
 * @extends Module
 */

var ServerModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(ServerModule, _Module);

  function ServerModule() {
    return _Module.apply(this, arguments) || this;
  }

  return ServerModule;
}(rxcomp.Module);
ServerModule.meta = {
  declarations: [].concat(factories, pipes),
  exports: [].concat(factories, pipes)
};exports.CacheItem=CacheItem;exports.CacheService=CacheService;exports.FileService=FileService;exports.RxCData=RxCData;exports.RxComment=RxComment;exports.RxDOMStringList=RxDOMStringList;exports.RxDocument=RxDocument;exports.RxDocumentType=RxDocumentType;exports.RxElement=RxElement;exports.RxHistory=RxHistory;exports.RxLocation=RxLocation;exports.RxNode=RxNode;exports.RxProcessingInstruction=RxProcessingInstruction;exports.RxQuery=RxQuery;exports.RxSelector=RxSelector;exports.RxText=RxText;exports.Server=Server;exports.ServerModule=ServerModule;exports.ServerRequest=ServerRequest;exports.ServerResponse=ServerResponse;exports.bootstrap$=bootstrap$;exports.cloneNode=_cloneNode;exports.getQueries=getQueries;exports.isRxComment=isRxComment;exports.isRxDocument=isRxDocument;exports.isRxDocumentType=isRxDocumentType;exports.isRxElement=isRxElement;exports.isRxProcessingInstruction=isRxProcessingInstruction;exports.isRxText=isRxText;exports.matchSelector=matchSelector;exports.matchSelectors=matchSelectors;exports.parse=parse;exports.querySelector=_querySelector;exports.querySelectorAll=_querySelectorAll;exports.render$=render$;exports.template$=template$;Object.defineProperty(exports,'__esModule',{value:true});})));