const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const path = require('path');
const { useApi } = require('./api/api.js');
const { Server } = require('../../dist/cjs/rxcomp-server');
const { renderRequest$ } = require('../client/dist/development/server/main.js');
// const router = express.Router();

const PORT = process.env.PORT || 5000;
const ROOT = `../client/dist/development/browser/`;

const Vars = {
	port: PORT,
	host: `http://localhost:${PORT}`,
	charset: 'utf8',
	root: ROOT,
	cacheMode: 'file',
	cache: path.join(__dirname, `../__cache/`),
	template: path.join(__dirname, `${ROOT}index.html`),
};

const app = express();
app.disable('x-powered-by');
app.use('/api', useApi());
app.get('*', (request, response) => {
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
});
// app.use(express.static(path.join(__dirname, ROOT)));
app.use('/', serveStatic(path.join(__dirname, ROOT)));
app.use('/rxcomp-server', serveStatic(path.join(__dirname, ROOT)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.listen(Vars.port, () => {
	console.log(`Running server at ${Vars.host}`);
});
