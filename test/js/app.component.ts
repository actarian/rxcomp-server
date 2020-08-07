import { Component, IFactoryMeta } from 'rxcomp';
import { first } from 'rxjs/operators';
import HttpService from './http/http.service';

export default class AppComponent extends Component {

	onInit() {
		// console.log('AppComponent.onInit', this);
		this.items = [];
		// HttpService.get$('https://jsonplaceholder.typicode.com/users/1/todos').pipe(
		HttpService.get$('http://localhost:5000/data/todos.json').pipe(
			first(),
		).subscribe(response => {
			console.log('AppComponent.items', response);
			this.items = response.data;
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
