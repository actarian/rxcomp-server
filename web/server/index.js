const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { useApi } = require('./api/api.js');
const { staticMiddleware } = require('./static/static.js');
const { spaMiddleware } = require('./spa/spa.js');
// const router = express.Router();
// const https = require('https');

const BASE_HREF = '/rxcomp-server/';
const ASSETS = `assets/`;
const ROOT = `../dist/development/browser/`;
const PORT = process.env.PORT || 46000;

const Vars = {
  port: PORT,
  host: `http://localhost:${PORT}`,
  charset: 'utf8',
  root: ROOT,
  assets: ASSETS,
  baseHref: BASE_HREF,
  cacheMode: 'file',
  cache: path.join(__dirname, `../cache/`),
  template: path.join(__dirname, `${ROOT}index.html`),
};

const staticMiddleware_ = staticMiddleware(Vars);
const spaMiddleware_ = spaMiddleware(Vars);

const app = express();
app.disable('x-powered-by');
app.use('/api', useApi());
app.use('*', staticMiddleware_);
app.get('*', spaMiddleware_);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.listen(Vars.port, () => {
  console.log(`NodeJs Running server at ${Vars.host}`);
});
