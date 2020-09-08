/**
 * @license rxcomp-server v1.0.0-beta.18
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

this.rxcomp=this.rxcomp||{};this.rxcomp.server=(function(exports,rxcomp,rxjs,operators,htmlparser2){'use strict';function _defineProperties(target, props) {
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

var FileService = function () {
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
        observer.complete();
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
          observer.next(error ? null : data);
          observer.complete();
        });
      } catch (error) {
        console.log('FileService.readFile$.error', error);
        observer.next(null);
        observer.complete();
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
            return;
          }

          fs.writeFile(pathname, content, 'utf8', function (error) {
            observer.next(!error);
            observer.complete();
          });
        });
      } catch (error) {
        console.log('FileService.writeFile$.error', error);
        observer.next(false);
        observer.complete();
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
          observer.complete();
        });
      } catch (error) {
        console.log('FileService.unlinkFile$.error', error);
        observer.next(false);
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

var CacheItem = function () {
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

var CacheService = function () {
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
          has = FileService.exists(key);
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
CacheService.mode = CacheMode.Memory;var RxDOMStringList = function (_Array) {
  _inheritsLoose(RxDOMStringList, _Array);

  function RxDOMStringList() {
    return _Array.apply(this, arguments) || this;
  }

  var _proto = RxDOMStringList.prototype;

  _proto.contains = function contains(string) {
    return this.indexOf(string) !== -1;
  };

  _proto.item = function item(index) {
    if (index > 0 && index < this.length) {
      return this[index];
    } else {
      return null;
    }
  };

  return RxDOMStringList;
}(_wrapNativeSuper(Array));
var RxLocation = function () {
  function RxLocation() {
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
}();var RxHistory = function () {
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
var RxNode = function () {
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
var RxStyle = function () {
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
var RxClassList = function (_Array) {
  _inheritsLoose(RxClassList, _Array);

  function RxClassList() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _Array.call.apply(_Array, [this].concat(args)) || this;
  }

  var _proto3 = RxClassList.prototype;

  _proto3.init = function init() {
    this.length = 0;

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
    this.serialize_();
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
}(_wrapNativeSuper(Array));
var RxElement = function (_RxNode) {
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
    _this5.nodeType = exports.RxNodeType.ELEMENT_NODE;
    _this5.nodeName = nodeName;

    if (attributes && typeof attributes === 'object') {
      _this5.attributes = attributes;
    }

    _this5.style = new RxStyle(_assertThisInitialized(_this5));
    var classList = new RxClassList();
    classList.node = _assertThisInitialized(_this5);
    _this5.classList = classList;
    _this5.childNodes = [];
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
    }

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

    this.childNodes.splice(index, 1);
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
    }

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
        if (node.nodeType === exports.RxNodeType.ELEMENT_NODE) {
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
var RxText = function (_RxNode2) {
  _inheritsLoose(RxText, _RxNode2);

  function RxText(parentNode, nodeValue) {
    var _this11;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this11 = _RxNode2.call(this, parentNode) || this;
    _this11.nodeType = exports.RxNodeType.TEXT_NODE;
    _this11.nodeValue = String(nodeValue);
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
var RxCData = function (_RxNode3) {
  _inheritsLoose(RxCData, _RxNode3);

  function RxCData(parentNode, nodeValue) {
    var _this12;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this12 = _RxNode3.call(this, parentNode) || this;
    _this12.nodeType = exports.RxNodeType.CDATA_SECTION_NODE;
    _this12.nodeValue = String(nodeValue);
    return _this12;
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
var RxComment = function (_RxNode4) {
  _inheritsLoose(RxComment, _RxNode4);

  function RxComment(parentNode, nodeValue) {
    var _this13;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this13 = _RxNode4.call(this, parentNode) || this;
    _this13.nodeType = exports.RxNodeType.COMMENT_NODE;
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
var RxProcessingInstruction = function (_RxNode5) {
  _inheritsLoose(RxProcessingInstruction, _RxNode5);

  function RxProcessingInstruction(parentNode, nodeValue) {
    var _this14;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this14 = _RxNode5.call(this, parentNode) || this;
    _this14.nodeType = exports.RxNodeType.PROCESSING_INSTRUCTION_NODE;
    _this14.nodeValue = String(nodeValue);
    return _this14;
  }

  var _proto8 = RxProcessingInstruction.prototype;

  _proto8.serialize = function serialize() {
    return "<" + this.nodeValue + ">";
  };

  return RxProcessingInstruction;
}(RxNode);
var RxDocumentType = function (_RxNode6) {
  _inheritsLoose(RxDocumentType, _RxNode6);

  function RxDocumentType(parentNode, nodeValue) {
    var _this15;

    if (parentNode === void 0) {
      parentNode = null;
    }

    _this15 = _RxNode6.call(this, parentNode) || this;
    _this15.nodeType = exports.RxNodeType.DOCUMENT_TYPE_NODE;
    _this15.nodeValue = String(nodeValue);
    return _this15;
  }

  var _proto9 = RxDocumentType.prototype;

  _proto9.serialize = function serialize() {
    return "<" + this.nodeValue + ">";
  };

  return RxDocumentType;
}(RxNode);
var RxDocumentFragment = function (_RxElement) {
  _inheritsLoose(RxDocumentFragment, _RxElement);

  function RxDocumentFragment() {
    var _this16;

    _this16 = _RxElement.call(this, null, '#document-fragment') || this;
    _this16.nodeType = exports.RxNodeType.DOCUMENT_FRAGMENT_NODE;
    _this16.childNodes = [];
    return _this16;
  }

  return RxDocumentFragment;
}(RxElement);
var RxDocument = function (_RxElement2) {
  _inheritsLoose(RxDocument, _RxElement2);

  function RxDocument() {
    var _this17;

    _this17 = _RxElement2.call(this, null, '#document') || this;
    _this17.location_ = RxLocation.location;
    _this17.nodeType = exports.RxNodeType.DOCUMENT_NODE;
    _this17.childNodes = [];
    return _this17;
  }

  var _proto10 = RxDocument.prototype;

  _proto10.createAttribute = function createAttribute() {};

  _proto10.createAttributeNS = function createAttributeNS() {};

  _proto10.createCDATASection = function createCDATASection() {};

  _proto10.createComment = function createComment(nodeValue) {
    return new RxComment(null, nodeValue);
  };

  _proto10.createDocumentFragment = function createDocumentFragment() {
    return new RxDocumentFragment();
  };

  _proto10.createElement = function createElement(nodeName) {
    return new RxElement(null, nodeName);
  };

  _proto10.createElementNS = function createElementNS(nodeName) {
    return new RxElement(null, nodeName);
  };

  _proto10.createEvent = function createEvent() {};

  _proto10.createNodeIterator = function createNodeIterator() {};

  _proto10.createProcessingInstruction = function createProcessingInstruction(nodeValue) {
    return new RxProcessingInstruction(null, nodeValue);
  };

  _proto10.createRange = function createRange() {};

  _proto10.createTextNode = function createTextNode(nodeValue) {
    return new RxText(null, nodeValue);
  };

  _proto10.createTouchList = function createTouchList() {};

  _proto10.createTreeWalker = function createTreeWalker() {};

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
var RxWindow = function () {
  function RxWindow(options) {
    if (options) {
      Object.assign(this, options);
    }
  }

  var _proto11 = RxWindow.prototype;

  _proto11.alert = function alert(message) {};

  _proto11.blur = function blur() {};

  _proto11.close = function close() {};

  _proto11.confirm = function confirm(message) {
    return false;
  };

  _proto11.departFocus = function departFocus(navigationReason, origin) {};

  _proto11.focus = function focus() {};

  _proto11.getComputedStyle = function getComputedStyle(elt, pseudoElt) {};

  _proto11.getMatchedCSSRules = function getMatchedCSSRules(elt, pseudoElt) {};

  _proto11.getSelection = function getSelection() {
    return null;
  };

  _proto11.matchMedia = function matchMedia(query) {};

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

  _proto11.webkitConvertPointFromNodeToPage = function webkitConvertPointFromNodeToPage(node, pt) {};

  _proto11.webkitConvertPointFromPageToNode = function webkitConvertPointFromPageToNode(node, pt) {};

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
      node = new RxElement(parentNode, nodeName, attributes);
      parentNode.childNodes.push(node);
      parentNode = node;
    },
    onclosetag: function onclosetag(nodeName) {
      if (parentNode.parentNode) {
        parentNode = parentNode.parentNode;
      }
    },
    ontext: function ontext(nodeValue) {
      var textNode = new RxText(parentNode, nodeValue);
      parentNode.childNodes.push(textNode);
    },
    onprocessinginstruction: function onprocessinginstruction(nodeName, nodeValue) {
      if (nodeName === '!doctype') {
        node = new RxDocumentType(parentNode, nodeValue);
      } else {
        node = new RxProcessingInstruction(parentNode, nodeValue);
      }

      parentNode.childNodes.push(node);
    },
    oncomment: function oncomment(nodeValue) {
      node = new RxComment(parentNode, nodeValue);
      parentNode.childNodes.push(node);
    },
    oncommentend: function oncommentend() {}
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
      var regex = /\:not\(\#([^\.[#:]+)\)|\:not\(\.([^\.[#:]+)\)|\:not\(\[([^\.\[#:]+)\]\)|\:not\(([^\.\[#:\]]+)\)|\#([^\.[#:]+)|\.([^\.[#:]+)|\[([^\.\[#:]+)\]|([^\.\[#:\]]+)/g;
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
        }
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

var Server = function (_Platform) {
  _inheritsLoose(Server, _Platform);

  function Server() {
    return _Platform.apply(this, arguments) || this;
  }

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
    if (this.document instanceof RxDocument) {
      var serialized = this.document.serialize();
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
    this.document = document;
    global.document = this.document;
    history.replaceState(null, document.title || '', location.origin);
    global.window = global.self = new RxWindow({
      document: document,
      history: history,
      location: location,
      devicePixelRatio: 1
    });
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
  return rxjs.Observable.create(function (observer) {
    if (!request.template) {
      return observer.error(new Error('ServerError: missing template'));
    }

    try {
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

var ServerModule = function (_Module) {
  _inheritsLoose(ServerModule, _Module);

  function ServerModule() {
    return _Module.apply(this, arguments) || this;
  }

  return ServerModule;
}(rxcomp.Module);
ServerModule.meta = {
  declarations: [].concat(factories, pipes),
  exports: [].concat(factories, pipes)
};exports.CacheItem=CacheItem;exports.CacheService=CacheService;exports.FileService=FileService;exports.RxCData=RxCData;exports.RxComment=RxComment;exports.RxDOMStringList=RxDOMStringList;exports.RxDocument=RxDocument;exports.RxDocumentType=RxDocumentType;exports.RxElement=RxElement;exports.RxHistory=RxHistory;exports.RxLocation=RxLocation;exports.RxNode=RxNode;exports.RxProcessingInstruction=RxProcessingInstruction;exports.RxQuery=RxQuery;exports.RxSelector=RxSelector;exports.RxText=RxText;exports.Server=Server;exports.ServerModule=ServerModule;exports.ServerRequest=ServerRequest;exports.ServerResponse=ServerResponse;exports.bootstrap$=bootstrap$;exports.cloneNode=_cloneNode;exports.fromCache$=fromCache$;exports.fromRenderRequest$=fromRenderRequest$;exports.getQueries=getQueries;exports.isRxComment=isRxComment;exports.isRxDocument=isRxDocument;exports.isRxDocumentType=isRxDocumentType;exports.isRxElement=isRxElement;exports.isRxProcessingInstruction=isRxProcessingInstruction;exports.isRxText=isRxText;exports.matchSelector=matchSelector;exports.matchSelectors=matchSelectors;exports.parse=parse;exports.querySelector=_querySelector;exports.querySelectorAll=_querySelectorAll;exports.render$=render$;exports.template$=template$;return exports;}({},rxcomp,rxjs,rxjs.operators,htmlparser2));