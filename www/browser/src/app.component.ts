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
		const mode: number = 1;
		const payload = { query: `{ getTodos { id, title, completed } }` };
		const methodUrl: string = `${Vars.host}${Vars.api}`;
		if (mode === 1) {
			HttpService.post$<IResponseData>(methodUrl, payload, {
				params: { query: `{ getTodos { id, title, completed } }` },
				reportProgress: false
			}).pipe(
				first(),
			).subscribe((response: IResponseData) => {
				this.items = response.data.getTodos;
				this.pushChanges();
				// console.log('AppComponent.getTodos', this.items);
			}, error => console.warn);
		} else if (mode === 2) {
			// console.log('methodUrl', methodUrl);
			HttpService.post$<IResponseData>(methodUrl, payload).pipe(
				first(),
			).subscribe((response: IResponseData) => {
				this.items = response.data.getTodos;
				this.pushChanges();
				// console.log('AppComponent.getTodos', this.items);
			}, error => console.warn);
		} else {
			HttpService.get$<IResponseData>(`${Vars.host}/data/todos.json`).pipe(
				first(),
			).subscribe((response: IResponseData) => {
				this.items = response.data.getTodos;
				this.pushChanges();
				// console.log('AppComponent.getTodos', this.items);
			}, error => console.warn);
		}
		// generic errors
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
