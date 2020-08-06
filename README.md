# 💎 RxComp ServerModule

[![Licence](https://img.shields.io/github/license/actarian/rxcomp-server.svg)](https://github.com/actarian/rxcomp-server)

[RxComp Server](https://github.com/actarian/rxcomp-server) is a small Javascript module for [RxComp](https://github.com/actarian/rxcomp), developed with [Immer](https://github.com/immerjs/immer) and [RxJs](https://github.com/ReactiveX/rxjs) as a simple alternative to [Redux](https://github.com/reduxjs/redux).

The store can however be used with any framework or VanillaJS. 

 lib & dependancy    | size
:--------------------|:----------------------------------------------------------------------------------------------|
rxcomp-server.min.js   | ![](https://img.badgesize.io/https://unpkg.com/rxcomp-server@1.0.0-beta.11/dist/umd/rxcomp-server.min.js.svg?compression=gzip)
rxcomp-server.min.js   | ![](https://img.badgesize.io/https://unpkg.com/rxcomp-server@1.0.0-beta.11/dist/umd/rxcomp-server.min.js.svg)
rxcomp.min.js        | ![](https://img.badgesize.io/https://unpkg.com/rxcomp@1.0.0-beta.11/dist/iife/rxcomp.min.js.svg?compression=gzip)
rxcomp.min.js        | ![](https://img.badgesize.io/https://unpkg.com/rxcomp@1.0.0-beta.11/dist/iife/rxcomp.min.js.svg)
rxjs.min.js          | ![](https://img.badgesize.io/https://unpkg.com/rxjs@6.6.2/bundles/rxjs.umd.min.js.svg?compression=gzip)
rxjs.min.js          | ![](https://img.badgesize.io/https://unpkg.com/rxjs@6.6.2/bundles/rxjs.umd.min.js.svg)
immer.min.js          | ![](https://img.badgesize.io/https://unpkg.com/immer@7.0.5/dist/immer.umd.production.min.js.svg?compression=gzip)
immer.min.js          | ![](https://img.badgesize.io/https://unpkg.com/immer@7.0.5/dist/immer.umd.production.min.js.svg)
 
> [RxComp Server Demo](https://actarian.github.io/rxcomp-server/)  
> [RxComp Server Api](https://actarian.github.io/rxcomp-server/api/)  
> [RxComp Sotre Codesandbox](https://codesandbox.io/s/rxcomp-servermodule-demo-h297m)  

![](https://rawcdn.githack.com/actarian/rxcomp-server/master/docs/img/rxcomp-server-demo.jpg?token=AAOBSISYZJXZNFFWAPGOLYC7DQKIO)  

___
## Installation and Usage

### ES6 via npm
This library depend on [RxComp](https://github.com/actarian/rxcomp) [Immer](https://github.com/immerjs/immer) and [RxJs](https://github.com/ReactiveX/rxjs)  
install via npm or include via script   

```
npm install rxjs immer rxcomp rxcomp-server --save
```
___
### CDN

For CDN, you can use unpkg

```html
<script src="https://unpkg.com/rxjs@6.6.2/bundles/rxjs.umd.min.js" crossorigin="anonymous" SameSite="none Secure"></script>
<script src="https://unpkg.com/immer@7.0.5/dist/immer.umd.production.min.js" crossorigin="anonymous" SameSite="none Secure"></script>
<script src="https://unpkg.com/rxcomp@1.0.0-beta.11/dist/umd/rxcomp.min.js" crossorigin="anonymous" SameSite="none Secure"></script>  
<script src="https://unpkg.com/rxcomp-server@1.0.0-beta.11/dist/umd/rxcomp-server.min.js" crossorigin="anonymous" SameSite="none Secure"></script>  
```

The global namespace for RxComp is `rxcomp`

```javascript
import { CoreModule, Module } from 'rxcomp';
```

The global namespace for RxComp ServerModule is `rxcomp.server`

```javascript
import { StoreModule } from 'rxcomp-server';
```
___
### The store
With the `useStore` factory we create the immutable store with a default value.  
The store will be consumed by a singleton service, and honoring the [single-responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) only a specific portion of the app data will be stored.  

```js
import { useStore } from 'rxcomp-server';

const { state$ } = useStore({ todolist: [] });
```
Subscribing to the `state$` observable you always get the last immutable copy of the `state` draft.
```js
state$.subscribe(state => this.todolist = state.todolist);
```
___
### Reducing the store state
The `reducer` operator accept a reducer callback with the `observable$` payload and a mutable draft of the `state` as parameter.  
When reducer returns, an immutable copy of the state will be pushed to the `state$` observable through [Immer](https://github.com/immerjs/immer).  

```js
const { reducer } = useStore({ todolist: [] });

observable$.pipe(
  reducer((todolist, state) => state.todolist = todolist)
);
```
___
### Catching errors into the state
The `catchState` operator is used to catch the error and store it in the immutable state.  

```js
const { catchState } = useStore({ todolist: [] });

observable$.pipe(
  catchState(console.log),
);
```
You can then observe the state for errors.  

```js
state$.subscribe(state => this.error = state.error);
```
___
### Setting the busy state
The `busy$` observable will store the busy flag in the immutable state and lock future calls until the observable completes.  

```js
const { busy$ } = useStore({ todolist: [] });

busy$().pipe(
  switchMap(() => observable$),
);
```
You can then observe the busy state.  

```js
state$.subscribe(state => this.busy = state.busy);
```
___
### Loading state from Web Api Storage or Cookie
While reloading the page, you may want to reload the previous state of the app.  
First we have to initialize the store with a different `StoreType` (the default is `StoreType.Memory`) and give it a unique store name.  

```js
import { StoreType, useStore } from 'rxcomp-server';

const { cached$ } = useStore({ todolist: [] }, 
  StoreType.Session, 'todolist'
);
```
With the `cached$` observable we can retrieve the last saved state from `sessionStorage` or `localStorage` or `cookie`.  

```js
cached$((state) => state.todolist)
```
___
### All together
1. busy$ mark state as busy  
2. cached$ load data from cache  
3. reducer reduce the state to the new state  
4. catchState catch the error and reduce the state to the errored state.  

```js
import { StoreType, useStore } from 'rxcomp-server';

const { busy$, cached$, reducer, catchState } = useStore(
  { todolist: [] },
  StoreType.Session, 'todolist'
);

busy$().pipe(
  switchMap(() => 
    merge(cached$((state) => state.todolist), fromApi$).pipe(
      reducer((todolist, state) => state.todolist = todolist),
      catchState(console.log),
    )
  )
);
```
___
### Querying the store state 
The `select$` observable accept a reducer callback with an immutable copy of the `state` as parameter and returns an immutable copy of a portion of the `state` as observable.  

```js
const { select$ } = useStore({ todolist: [] });

const todolist$ = select$((state) => state.todolist);
```
___
### Querying with select
The `select` method works like the `select$` observable but doesn't return an observable.  

```js
const { select } = useStore({ todolist: [] });

const todolist = select((state) => state.todolist);
```
___
### Other methods

#### Setting the store state
The `next` method accept a reducer callback with a mutable draft of the `state` as parameter.  
When reducer returns, an immutable copy of the state will be pushed to the `state$` observable through [Immer](https://github.com/immerjs/immer).  
It works like the `reduce` operator but doesn't return an observable.  

```js
const { next } = useStore({ todolist: [] });

next((state) => state.todolist = todolist))
```
___
#### Setting the store error
The `nextError` method will store the `error` parameter in the immutable state.
It works like the `catchState` operator but is intended to use in conjunction of classic `catchError` operator.  

```js
const { nextError } = useStore({ todolist: [] });

catchError(error => nextError(error))
```
___
### Bootstrapping Module

```javascript
import { Browser, CoreModule, Module } from 'rxcomp';
import { StoreModule } from 'rxcomp-server';
import AppComponent from './app.component';

export default class AppModule extends Module {}

AppModule.meta = {
    imports: [
        CoreModule,
        StoreModule
    ],
    declarations: [],
    bootstrap: AppComponent,
};

Browser.bootstrap(AppModule);
```
___
### Browser Compatibility
RxComp supports all browsers that are [ES5-compliant](http://kangax.github.io/compat-table/es5/) (IE8 and below are not supported).
___
## Contributing

*Pull requests are welcome and please submit bugs 🐞*
___
### Install packages
```
npm install
```
___
### Build, Serve & Watch 
```
gulp
```
___
### Build Dist
```
gulp build --target dist
```
___
*Thank you for taking the time to provide feedback and review. This feedback is appreciated and very helpful 🌈*

[![GitHub forks](https://img.shields.io/github/forks/actarian/rxcomp.svg?style=social&label=Fork&maxAge=2592000)](https://gitHub.com/actarian/rxcomp/network/)  [![GitHub stars](https://img.shields.io/github/stars/actarian/rxcomp.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/actarian/rxcomp/stargazers/)  [![GitHub followers](https://img.shields.io/github/followers/actarian.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/actarian?tab=followers)

* [Github Project Page](https://github.com/actarian/rxcomp)  

*If you find it helpful, feel free to contribute in keeping this library up to date via [PayPal](https://www.paypal.me/circledev/5)*

[![PayPal](https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png)](https://www.paypal.me/circledev/5)  

___
## Contact

* Luca Zampetti <lzampetti@gmail.com>
* Follow [@actarian](https://twitter.com/actarian) on Twitter

[![Twitter Follow](https://img.shields.io/twitter/follow/actarian.svg?style=social&label=Follow%20@actarian)](https://twitter.com/actarian)  

___
## Release Notes
Changelog [here](https://github.com/actarian/rxcomp-server/blob/master/CHANGELOG.md).
