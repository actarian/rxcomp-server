// import fetch from 'cross-fetch';
import 'cross-fetch/polyfill';
import { from, Observable } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { IServerRequest, Server, ServerResponse } from '../../src/rxcomp-server';
import AppModule from './app.module';
import HttpClient from './http/http-client';
import { Vars } from './vars';

export function renderRequest$(request?: IServerRequest): Observable<ServerResponse> {
	return Server.bootstrap$(AppModule, request).pipe(
		switchMap((response: ServerResponse) => {
			return HttpClient.pendingRequests$.pipe(
				filter(count => count === 0),
				map(() => {
					response.body = response.serialize();
					return response;
				}),
				first(),
			);
		}),
	);
	/*
	return from(new Promise((resolve, reject) => {
		if (!request?.template) {
			return reject(new Error('ServerError: template not found!'));
		}
		try {
			const module = Server.bootstrap(AppModule, html);
			resolve(module);
		} catch (error) {
			reject(error);
		}
	})).pipe(
		switchMap(() => HttpClient.pendingRequests$),
		filter(x => x === 0),
		map(() => Server.serialize()),
		first(),
	);
	*/
	/*
	const module = Server.bootstrap(AppModule, html);
	console.log(module);
	// return of(Server.serialize());
	return HttpClient.pendingRequests$.pipe(
		filter(x => x === 0),
		map(x => Server.serialize()),
		first(),
	);
	*/
}

// !!! remove html only request;
export function renderServer(html: string, request?: IServerRequest): Observable<string> {
	if (request && request.host) {
		Vars.host = request.host;
	}
	return from(new Promise((resolve, reject) => {
		if (!request?.template) {
			return reject(new Error('ServerError: template not found!'));
		}
		try {
			const module = Server.bootstrap(AppModule, html);
			resolve(module);
		} catch (error) {
			reject(error);
		}
	})).pipe(
		switchMap(() => HttpClient.pendingRequests$),
		filter(x => x === 0),
		map(() => Server.serialize()),
		first(),
	);
	/*
	const module = Server.bootstrap(AppModule, html);
	console.log(module);
	// return of(Server.serialize());
	return HttpClient.pendingRequests$.pipe(
		filter(x => x === 0),
		map(x => Server.serialize()),
		first(),
	);
	*/
}
