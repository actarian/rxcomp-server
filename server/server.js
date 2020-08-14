const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const path = require('path');
const { useApi } = require('./api/api.js');
const { Server } = require('../dist/cjs/src/rxcomp-server');
const { renderRequest$ } = require('./main.server.umd.js');
// const router = express.Router();

const PORT = process.env.PORT || 5000;
const ROOT = `../docs/`;

const Vars = {
	port: PORT,
	host: `http://localhost:${PORT}`,
	charset: 'utf8',
	root: ROOT,
	template: path.join(__dirname, `${ROOT}index.html`),
};

const app = express();

app.disable('x-powered-by');

app.get('/', (request, response) => {
	const serverRequest = { url: request.url, template: Vars.template, host: Vars.host, charset: Vars.charset };
	Server.render$(serverRequest, renderRequest$).subscribe(
		success => {
			// console.log('success', success);
			response.send(success.body);
		},
		error => {
			// console.log('error', error);
			response.send(JSON.stringify(error, null, 2));
		},
	);
	// renderPath(response, Object.assign({}, Vars, { url: request.url }));
});

app.use('/api', useApi());
// app.use(express.static(path.join(__dirname, `../docs/`)));
app.use('/', serveStatic(path.join(__dirname, `../docs/`)));
app.use('/rxcomp-server', serveStatic(path.join(__dirname, `../docs/`)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.listen(Vars.port, () => {
	console.log(`Running server at ${Vars.host}`);
});

// app.use(express.favicon());
/*
app.get('/', function(request, response) {
	response.send('Hello World!');
});
*/
/*
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (request, response) => response.render('pages/index'));
*/
// app.set('view engine', 'handlebars');

/*
app.get('/', function(request, response) {
	fs.readFile(path.join(__dirname, `../docs/index.html`), Vars.charset, function(error, html) {
		if (error) {
			throw error;
		}
		console.log('html', html);
		const body = renderServer(html);
		console.log('body', body);
		response.send(body);
	});
	// response.sendFile(path.join(__dirname, `../../docs/index.html`));
	// response.render('docs/index');
});
*/

/*
// middleware that is specific to this router
router.use((request, response, next) => {
	console.log('Time: ', Date.now());
	next();
});

router.get('/', (request, response, next) => {
	fs.readFile(path.join(__dirname, `../docs/index.html`), Vars.charset, function(error, html) {
		if (error) {
			throw error;
		}
		console.log('html', html);
		const body = renderServer(html);
		console.log('body', body);
		response.send(body);
	});
	// response.sendFile(path.join(__dirname, `../../docs/index.html`));
	// response.render('docs/index');
});
*/

/*
app.post(`/api/token/rtc`, function (request, response) {
	const payload = request.body || {};
	const duration = 3600;
	const timestamp = Math.floor(Date.now() / 1000);
	const expirationTime = timestamp + duration;
	const uid = payload.uid ? String(payload.uid) : timestamp.toString();
	const role = RtcRole.PUBLISHER;
	const token = RtcTokenBuilder.buildTokenWithUid(environment.appKey, environment.appCertificate, environment.channelName, uid, role, expirationTime);
	response.send(JSON.stringify({
		token: token,
	}));
});

app.post(`/api/token/rtm`, function (request, response) {
	const payload = request.body || {};
	const duration = 3600;
	const timestamp = Math.floor(Date.now() / 1000);
	const expirationTime = timestamp + duration;
	const uid = payload.uid ? String(payload.uid) : timestamp.toString();
	const role = RtmRole.PUBLISHER;
	const token = RtmTokenBuilder.buildToken(environment.appKey, environment.appCertificate, uid, role, expirationTime);
	response.send(JSON.stringify({
		token: token,
	}));
});
*/

/*
https
	.createServer({
		cert: fs.readFileSync(path.join(__dirname, `../../certs/server.crt`), Vars.charset),
		key: fs.readFileSync(path.join(__dirname, `../../certs/server.key`), Vars.charset)
	}, app)
	.listen(Vars.port, function() {
		console.log(`Example app listening on port ${Vars.port}! Go to https://192.168.1.2:${Vars.port}/`);
	});
*/

// IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

// Build token with uid
// const token = RtcTokenBuilder.buildTokenWithUid(environment.appKey, environment.appCertificate, environment.channelName, uid, role, expirationTime);

// Build token with user account
// const token = RtcTokenBuilder.buildTokenWithAccount(environment.appKey, environment.appCertificate, environment.channelName, account, role, expirationTime);

// module.exports = router;
