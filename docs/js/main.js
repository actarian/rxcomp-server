/**
 * @license rxcomp-server v1.0.0-beta.16
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(rxcomp,rxcompHttp,rxcompRouter,rxjs,operators){'use strict';function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}var AppComponent = function (_Component) {
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
};var CustomRequestInterceptor = function () {
  function CustomRequestInterceptor() {}

  var _proto = CustomRequestInterceptor.prototype;

  _proto.intercept = function intercept(request, next) {

    return next.handle(request);
  };

  return CustomRequestInterceptor;
}();
var CustomResponseInterceptor = function () {
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
}();var NotFoundComponent = function (_Component) {
  _inheritsLoose(NotFoundComponent, _Component);

  function NotFoundComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = NotFoundComponent.prototype;

  _proto.onInit = function onInit() {};

  return NotFoundComponent;
}(rxcomp.Component);
NotFoundComponent.meta = {
  selector: '[not-found-component]',
  template: "\n        <div class=\"page-not-found\">\n            <div class=\"title\">Not Found</div>\n        </div>\n        "
};var TodolistItemComponent = function (_View) {
  _inheritsLoose(TodolistItemComponent, _View);

  function TodolistItemComponent() {
    return _View.apply(this, arguments) || this;
  }

  var _proto = TodolistItemComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    console.log('TodolistItemComponent.onInit', this.route);
    rxjs.combineLatest(this.route.data$, this.route.params$).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (datas) {
      _this.title = datas[0].title;
      _this.itemId = datas[1].itemId;
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
  template: "\n        <div class=\"page-detail\">\n            <div class=\"title\">Todolist Item {{itemId}}</div>\n        </div>\n        "
};var Vars = {
  name: 'rxcomp-server',
  host: '',
  resource: '/',
  api: '/api',
  static: false,
  development: false,
  production: true
};var TodolistComponent = function (_Component) {
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
      }).pipe(operators.first()).subscribe(function (response) {
        _this2.items = response.data.getTodos;

        _this2.pushChanges();
      }, console.warn);
    }

    var route = this.host.route;

    if (route) {
      route.data$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (data) {
        _this2.title = data.title;
      });
    }

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
  template: "\n        <div class=\"page-todolist\">\n\t\t\t<div class=\"title\">{{title}}</div>\n\t\t\t<!-- {{items | json}} -->\n\t\t\t<ul class=\"list\">\n\t\t\t\t<li class=\"list__item\" *for=\"let item of items\" [class]=\"{ completed: item.completed }\" [style]=\"{ 'border-color': item.completed ? 'red' : 'black' }\">\n\t\t\t\t\t<div class=\"title\" [routerLink]=\"['/todolist', item.id]\" [innerHTML]=\"item.title\"></div>\n\t\t\t\t\t<div class=\"completed\" (click)=\"onClick(item)\" [innerHTML]=\"item.completed\"></div>\n\t\t\t\t\t<!-- !!! debug -->\n\t\t\t\t\t<!-- <div class=\"completed\" (click)=\"onClick(item)\">{{item.completed}}</div> -->\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t<div *if=\"error\">\n\t\t\t\t<span>error => {{error | json}}</span>\n\t\t\t</div>\n        </div>\n        "
};var AppModule = function (_Module) {
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
};rxcomp.Browser.bootstrap(AppModule);}(rxcomp,rxcomp.http,rxcomp.router,rxjs,rxjs.operators));