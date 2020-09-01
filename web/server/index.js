const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const path = require('path');
const { useApi } = require('./api/api.js');
const { Server } = require('../../dist/cjs/rxcomp-server');
const { renderRequest$ } = require('../__dist/development/server/main.js');
const fs = require('fs');
// const router = express.Router();

const MIME_TEXT = [
  'js', 'css', 'map', // js & css
  'txt', 'xml', 'json', 'md', // text
  'webmanifest' // manifest
];
const MIME_IMAGE = [
  'jpg', 'jpeg', 'png', 'gif', 'ico', 'svg', // images
];
const MIME_FONTS = [
  'ttf', 'woff', 'eot', // fonts
];
const MIME_MEDIA = [
  'mp3', 'mp4', 'webm', 'webp', // media
];
const MIME_OCTET = [];
const MIME_TYPES = [
  ...MIME_TEXT,
  ...MIME_IMAGE,
  ...MIME_FONTS,
  ...MIME_MEDIA,
  ...MIME_OCTET,
];
const BASE_HREF = '/rxcomp-server/';
const ASSETS = `assets/`;
const ROOT = `../__dist/development/browser/`;
const PORT = process.env.PORT || 5000;
const STATIC_REGEXP = new RegExp('^(' + BASE_HREF + '|\/)(.+?)(\.)(' + MIME_TYPES.join('|') + ')$', 'gm');
console.log('NodeJs.regExp', STATIC_REGEXP);

const Vars = {
  port: PORT,
  host: `http://localhost:${PORT}`,
  charset: 'utf8',
  root: ROOT,
  assets: ASSETS,
  baseHref: BASE_HREF,
  cacheMode: 'file',
  cache: path.join(__dirname, `../__cache/`),
  template: path.join(__dirname, `${ROOT}index.html`),
};

const spaMiddleware = (request, response) => {
  Server.render$({ url: request.url, vars: Vars }, renderRequest$).subscribe(
    success => {
      // console.log('success', success);
      response.send(success.body);
    },
    error => {
      // console.log('error', error);
      response.send(JSON.stringify(error, null, 2));
    },
  );
};

const staticMiddleware = (request, response, next) => {
  const matches = STATIC_REGEXP.exec(request.baseUrl);
  // console.log(request.url, request.baseUrl, request.originalUrl, match);
  if (matches) {
    const extension = matches[4];
    const file = path.join(__dirname, ROOT, matches[2] + matches[3] + extension);
    console.log('NodeJs.file:', file);
    fs.readFile(file, {}, (error, data) => {
      if (error) {
        console.log('NodeJs.error', error);
        return next();
      }
      // console.log('NodeJs.data', data);
      response.set('Content-Type', 'text/plain');
      response.send(data);
    });
  } else {
    console.log('NodeJs.unmatch', request.baseUrl);
    next();
  }
};

const app = express();
app.disable('x-powered-by');
app.use('/api', useApi());
// app.use(express.static(BASE_HREF, { index: false, extensions: MIME_TYPES }));
// app.use(express.static('/', { index: false, extensions: MIME_TYPES }));
// app.use(STATIC_REGEXP, serveStatic(path.join(__dirname, `${ROOT}`)));
// app.use('/', serveStatic(path.join(__dirname, `${ROOT}`)));
app.use('*', staticMiddleware);
app.get('*', spaMiddleware);
// app.use(express.static(path.join(__dirname, ROOT)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.listen(Vars.port, () => {
  console.log(`NodeJs Running server at ${Vars.host}`);
});
