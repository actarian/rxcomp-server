# 💎 RxComp ServerModule

[![Licence](https://img.shields.io/github/license/actarian/rxcomp-server.svg)](https://github.com/actarian/rxcomp-server)

[RxComp Server](https://github.com/actarian/rxcomp-server) is the Server Side Rendering module for [RxComp](https://github.com/actarian/rxcomp) library, developed with [RxJs](https://github.com/ReactiveX/rxjs).

 lib & dependancy    | size
:--------------------|:----------------------------------------------------------------------------------------------|
rxcomp-server.min.js   | ![](https://img.badgesize.io/https://unpkg.com/rxcomp-server@1.0.0-beta.18/dist/umd/rxcomp-server.min.js.svg?compression=gzip)
rxcomp-server.min.js   | ![](https://img.badgesize.io/https://unpkg.com/rxcomp-server@1.0.0-beta.18/dist/umd/rxcomp-server.min.js.svg)
rxcomp.min.js        | ![](https://img.badgesize.io/https://unpkg.com/rxcomp@1.0.0-beta.18/dist/umd/rxcomp.min.js.svg?compression=gzip)
rxcomp.min.js        | ![](https://img.badgesize.io/https://unpkg.com/rxcomp@1.0.0-beta.18/dist/umd/rxcomp.min.js.svg)
rxjs.min.js          | ![](https://img.badgesize.io/https://unpkg.com/rxjs@6.6.2/bundles/rxjs.umd.min.js.svg?compression=gzip)
rxjs.min.js          | ![](https://img.badgesize.io/https://unpkg.com/rxjs@6.6.2/bundles/rxjs.umd.min.js.svg)
 
<!-- > [RxComp Server Demo](https://actarian.github.io/rxcomp-server/) -->
> [RxComp Server Api](https://actarian.github.io/rxcomp-server/api/)  

![](https://rawcdn.githack.com/actarian/rxcomp-server/master/docs/img/rxcomp-server-demo.jpg?token=AAOBSISYZJXZNFFWAPGOLYC7DQKIO)  

___
## Installation and Usage

### ES6 via npm
This library depend on [RxComp](https://github.com/actarian/rxcomp) and [RxJs](https://github.com/ReactiveX/rxjs)  
install via npm or include via script   

```
npm install rxjs rxcomp rxcomp-server --save
```
___
### CDN

For CDN, you can use unpkg

```html
<script src="https://unpkg.com/rxjs@6.6.2/bundles/rxjs.umd.min.js" crossorigin="anonymous" SameSite="none Secure"></script>
<script src="https://unpkg.com/rxcomp@1.0.0-beta.18/dist/umd/rxcomp.min.js" crossorigin="anonymous" SameSite="none Secure"></script>  
<script src="https://unpkg.com/rxcomp-server@1.0.0-beta.18/dist/umd/rxcomp-server.min.js" crossorigin="anonymous" SameSite="none Secure"></script>  
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
### Bootstrapping Server Module
The exposed `renderRequest$` method handles the `ServerRequest` and return an Observable with the `ServerResponse`.
Example of `main.server.ts`.  

```javascript
import 'cross-fetch/polyfill';
import { Observable } from 'rxjs';
import { Server, ServerRequest, ServerResponse } from 'rxcomp-server';
import AppModule from './app.module';

export function renderRequest$(request: ServerRequest): Observable<ServerResponse> {
	return Server.bootstrap$(AppModule, request);
}
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
