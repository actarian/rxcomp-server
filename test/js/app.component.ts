import { Component, errors$, IFactoryMeta } from 'rxcomp';
import { EMPTY, Observable } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import HttpClient from './http/http-client';
import { HttpHandler } from './http/http-handler';
import { HttpInterceptor, HttpInterceptors } from './http/http-interceptor';
import { HttpRequest } from './http/http-request';
import { HttpEvent, HttpResponse } from './http/http-response';
import { Vars } from './vars';

const cancelRequest: boolean = false;

export class CustomInterceptor implements HttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (cancelRequest) {
			return EMPTY;
		}
		const clonedRequest = request.clone({
			url: request.url,
		});
		// console.log('CustomInterceptor.clonedRequest', clonedRequest);
		return next.handle(clonedRequest);
		return next.handle(request).pipe(
			tap(event => {
				if (event instanceof HttpResponse) {
					console.log('CustomInterceptor.status', event.status);
					console.log('CustomInterceptor.filter', request.params.get('filter'));
				}
			})
		);
	}
}

const interceptor = new CustomInterceptor();
HttpInterceptors.push(interceptor);

interface ITodoItem {
	id: number;
	title: string;
	completed: boolean;
}

interface IGetTodos {
	getTodos: ITodoItem[]
}

interface IResponseData {
	data: IGetTodos;
}

export default class AppComponent extends Component {
	items: ITodoItem[] = [];
	error: any = null;

	onInit() {
		// console.log('AppComponent.onInit', this);
		/*
		const payload = { query: `{ hello }` };
		*/
		/*
		const payload = { query: `{ roll(dices: ${3}, sides: ${6}) }` };
		*/
		/*
		const payload = {
			query: `query ($dices: Int!, $sides: Int) {
			roll(dices: $dices, sides: $sides)
		}`, variables: { dices: 3, sides: 6 }
		};
		*/
		const payload = { query: `{ getTodos { id, title, completed } }` };
		/*
		HttpClient.post$<IResponseData>(`${Vars.host}${Vars.api}`, payload, {
			params: { query: `{ getTodos { id, title, completed } }` },
			reportProgress: true
		}).pipe(
		*/

		HttpClient.post$<IResponseData>(`${Vars.host}${Vars.api}`, payload).pipe(
			first(),
		).subscribe((response: IResponseData) => {
			this.items = response.data.getTodos;
			this.pushChanges();
			// console.log('AppComponent.getTodos', this.items);
		}, error => console.log);

		// HttpService.get$(`https://jsonplaceholder.typicode.com/users/1/todos`).pipe(

		/*
		HttpService.get$(`${Vars.host}/data/todos.json`).pipe(
			first(),
		).subscribe(response => {
			// console.log('AppComponent.items', response);
			this.items = response.data;
			this.pushChanges();
		});
		*/

		errors$.pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(error => {
			this.error = error;
			this.pushChanges();
		});

	}

	onClick(item: { title: string, completed: boolean }) {
		item.completed = !item.completed;
		this.pushChanges();
	}

	static meta: IFactoryMeta = {
		selector: '[app-component]',
	};

}
