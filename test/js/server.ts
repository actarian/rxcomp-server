const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const path = require('path');
const { renderServer } = require('./server/main');

const PORT = process.env.PORT || 5000;

var app = express();

app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, '../../docs/')));
app.use('/rxcomp-server', serveStatic(path.join(__dirname, '../../docs/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

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

app.get('/', function (request: any, response: any) {
	fs.readFile(path.join(__dirname, '../../docs/index.html'), "utf8", function (error: any, html: any) {
		if (error) {
			throw error;
		}
		const renderedHtml = renderServer(html);
		response.send(renderedHtml);
	});
	// response.sendFile(path.join(__dirname, '../../docs/index.html'));
	// response.render('docs/index');
});

/*
app.post('/api/token/rtc', function (request, response) {
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

app.post('/api/token/rtm', function (request, response) {
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

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});

/*
https
	.createServer({
		cert: fs.readFileSync(path.join(__dirname, '../../certs/server.crt'), 'utf8'),
		key: fs.readFileSync(path.join(__dirname, '../../certs/server.key'), 'utf8')
	}, app)
	.listen(PORT, function() {
		console.log(`Example app listening on port ${PORT}! Go to https://192.168.1.2:${PORT}/`);
	});
*/

// IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

// Build token with uid
// const token = RtcTokenBuilder.buildTokenWithUid(environment.appKey, environment.appCertificate, environment.channelName, uid, role, expirationTime);

// Build token with user account
// const token = RtcTokenBuilder.buildTokenWithAccount(environment.appKey, environment.appCertificate, environment.channelName, account, role, expirationTime);
