import { merge, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StoreType, useStore } from '../../../src/rxcomp-server';
import ApiService, { ITodoItem } from '../api/api.service';

const { state$, busy$, cached$, reducer, catchState } = useStore({
	todolist: [],
}, StoreType.Session, 'todolist');

export class TodoService {

	static get state$() {
		return state$;
	}

	static loadWithCache$(): Observable<ITodoItem[] | unknown> {
		return busy$().pipe(
			switchMap(() => merge(cached$((state: any) => state.todolist) as Observable<ITodoItem[]>, ApiService.load$('url')).pipe(
				reducer((todolist: ITodoItem[], state: any) => state.todolist = todolist),
				catchState(console.log),
				// tap((todolist: ITodoItem[]) => next((state: any) => (state.todolist = todolist))),
				// catchError((error: any) => nextError(error))
			)));
	}

	static load$(): Observable<ITodoItem[] | unknown> {
		return busy$().pipe(
			switchMap(() => ApiService.load$('url').pipe(
				reducer((todolist: ITodoItem[], state: any) => state.todolist = todolist),
				catchState(console.log),
			)));
	}

	static addItem$(): Observable<ITodoItem | unknown> {
		return busy$().pipe(
			switchMap(() => ApiService.addItem$('url').pipe(
				reducer((item: ITodoItem, state: any) => {
					state.todolist.push(item)
				}),
				catchState(console.log),
			))
		);
	}

	static clearItems$(): Observable<ITodoItem[] | unknown> {
		return busy$().pipe(
			switchMap(() => ApiService.clearItems$('url').pipe(
				reducer((items: ITodoItem[], state: any) => state.todolist = items),
				catchState(console.log),
			))
		);
	}

	static removeItem$(id: number): Observable<number | unknown> {
		return busy$().pipe(
			switchMap(() => ApiService.remove$('url', id).pipe(
				reducer((id: number, state: any) => {
					const index = state.todolist.reduce((p: number, c: ITodoItem, i: number) => {
						return c.id === id ? i : p;
					}, -1);
					if (index !== -1) {
						state.todolist.splice(index, 1);
					}
				}),
				catchState(console.log),
			))
		);
	}

	static toggleCompleted$(item: ITodoItem): Observable<ITodoItem | unknown> {
		return busy$().pipe(
			switchMap(() => ApiService.patch$('url', item).pipe(
				reducer((item: ITodoItem, state: any) => {
					const stateItem = state.todolist.find((x: ITodoItem) => x.id === item.id);
					if (stateItem) {
						stateItem.completed = !stateItem.completed;
					}
				}),
				catchState(console.log),
			)));
	}

}

