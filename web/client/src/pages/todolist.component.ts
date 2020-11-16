import { Component, errors$, IFactoryMeta } from 'rxcomp';
import { HttpService } from 'rxcomp-http';
import { RouterKeyValue, RouterOutletStructure } from 'rxcomp-router';
import { first, takeUntil } from 'rxjs/operators';
import { IResponseData, ITodoItem } from '../todo/todo';
import { Vars } from '../vars';

export default class TodolistComponent extends Component {
	host!: RouterOutletStructure;
	items: ITodoItem[] = [];
	error: any = null;
	onInit() {
		const mode: number = 3;
		const payload = { query: `{ getTodos { id, title, completed } }` };
		const methodUrl: string = `${Vars.host}${Vars.api}`;
		// console.log('TodolistComponent.onInit', this);
		if (mode === 1) {
			HttpService.post$<IResponseData>(methodUrl, payload, {
				params: { query: `{ getTodos { id, title, completed } }` },
				reportProgress: false
			}).pipe(
				first(),
			).subscribe((response: IResponseData) => {
				this.items = response.data.getTodos;
				this.pushChanges();
				// console.log('TodolistComponent.getTodos', this.items);
			}, console.warn);
		} else if (mode === 2) {
			// console.log('TodolistComponent.methodUrl', methodUrl);
			HttpService.post$<IResponseData>(methodUrl, payload).pipe(
				first(),
			).subscribe((response: IResponseData) => {
				this.items = response.data.getTodos;
				this.pushChanges();
				// console.log('TodolistComponent.getTodos', this.items);
			}, console.warn);
		} else {
			HttpService.get$<IResponseData>(`${Vars.host}/assets/data/todos.json`).pipe(
				first(),
			).subscribe((response: IResponseData) => {
				this.items = response.data.getTodos;
				this.pushChanges();
				// console.log('TodolistComponent.getTodos', this.items);
			}, console.warn);
		}
		const route = this.host.route;
		if (route) {
			route.data$.pipe(
				takeUntil(this.unsubscribe$)
			).subscribe((data: RouterKeyValue) => {
				this.title = data.title;
				// this.pushChanges(); // !! not needed;
				// console.log('TodolistComponent', data);
			});
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
		selector: '[todolist-component]',
		hosts: { host: RouterOutletStructure },
		template: /* html */`
        <div class="page-todolist">
			<div class="title">{{title}}</div>
			<!-- {{items | json}} -->
			<ul class="list">
				<li class="list__item" *for="let item of items" [class]="{ completed: item.completed }" [style]="{ 'border-color': item.completed ? 'red' : 'black' }">
					<div class="title" [routerLink]="['/todolist', item.id]" [innerHTML]="item.title"></div>
					<div class="completed" (click)="onClick(item)" [innerHTML]="item.completed"></div>
					<!-- !!! debug -->
					<!-- <div class="completed" (click)="onClick(item)">{{item.completed}}</div> -->
				</li>
			</ul>
			<div *if="error">
				<span>error => {{error | json}}</span>
			</div>
        </div>
        `,
	};
}
