import { Component, errors$, IFactoryMeta } from 'rxcomp';
import { first, takeUntil } from 'rxjs/operators';
import { HttpService } from '../../../../rxcomp-http/dist/cjs/rxcomp-http';
import { Vars } from './vars';

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
		HttpService.post$<IResponseData>(`${Vars.host}${Vars.api}`, payload, {
			params: { query: `{ getTodos { id, title, completed } }` },
			reportProgress: true
		}).pipe(
		*/
		const methodUrl: string = `${Vars.host}${Vars.api}`;
		console.log('methodUrl', methodUrl);
		HttpService.post$<IResponseData>(methodUrl, payload, { hydrate: true }).pipe(
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
