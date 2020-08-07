/**
 * @license rxcomp-server v1.0.0-beta.12
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(rxcomp,operators,rxjs){'use strict';function _defineProperties(target, props) {
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
}var HttpResponse = function () {
  function HttpResponse(response) {
    this.url = '';
    this.status = 0;
    this.statusText = '';
    this.ok = false;
    this.redirected = false;
    this.data = null;

    if (response) {
      this.url = response.url;
      this.status = response.status;
      this.statusText = response.statusText;
      this.ok = response.ok;
      this.redirected = response.redirected;
    }
  }

  _createClass(HttpResponse, [{
    key: "static",
    get: function get() {
      return this.url.indexOf('.json') === this.url.length - 5;
    }
  }]);

  return HttpResponse;
}();

var HttpService = function () {
  function HttpService() {}

  HttpService.http$ = function http$(method, url, data, format) {
    var _this = this;

    if (format === void 0) {
      format = 'json';
    }

    method = url.indexOf('.json') !== -1 ? 'GET' : method;
    var methods = ['POST', 'PUT', 'PATCH'];
    var response_ = null;
    this.pendingRequests$.next(this.pendingRequests$.getValue() + 1);
    return rxjs.from(fetch(url, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
    }).then(function (response) {
      response_ = new HttpResponse(response);

      if (typeof response[format] === 'function') {
        return response[format]().then(function (json) {
          response_.data = json;

          if (response.ok) {
            return Promise.resolve(response_);
          } else {
            return Promise.reject(response_);
          }
        });
      } else {
        return Promise.reject(response_);
      }
    })).pipe(operators.catchError(function (error) {
      console.log('error', error);
      return rxjs.throwError(_this.getError(error, response_));
    }), operators.finalize(function () {
      _this.pendingRequests$.next(_this.pendingRequests$.getValue() - 1);
    }));
  };

  HttpService.get$ = function get$(url, data, format) {
    var query = this.query(data);
    return this.http$('GET', "" + url + query, undefined, format);
  };

  HttpService.delete$ = function delete$(url) {
    return this.http$('DELETE', url);
  };

  HttpService.post$ = function post$(url, data) {
    return this.http$('POST', url, data);
  };

  HttpService.put$ = function put$(url, data) {
    return this.http$('PUT', url, data);
  };

  HttpService.patch$ = function patch$(url, data) {
    return this.http$('PATCH', url, data);
  };

  HttpService.query = function query(data) {
    return '';
  };

  HttpService.getError = function getError(object, response) {
    var error = typeof object === 'object' ? object : {};

    if (!error.statusCode) {
      error.statusCode = response ? response.status : 0;
    }

    if (!error.statusMessage) {
      error.statusMessage = response ? response.statusText : object;
    }

    return error;
  };

  return HttpService;
}();
HttpService.pendingRequests$ = new rxjs.BehaviorSubject(0);var AppComponent = function (_Component) {
  _inheritsLoose(AppComponent, _Component);

  function AppComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = AppComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.items = [];
    HttpService.get$('http://localhost:5000/data/todos.json').pipe(operators.first()).subscribe(function (response) {
      console.log('AppComponent.items', response);
      _this.items = response.data;

      _this.pushChanges();
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
};rxcomp.Browser.bootstrap(AppModule);}(rxcomp,rxjs.operators,rxjs));