import { Component, IFactoryMeta } from 'rxcomp';
import { first } from 'rxjs/operators';
import HttpService from './http/http.service';

export default class AppComponent extends Component {

	onInit() {
		this.items = new Array(4).fill(0).map((x, i) => {
			return { title: `item ${i + 1}`, completed: Math.random() > 0.75 };
		});
		this.flag = true;
		this.active = false;
		// console.log('AppComponent.onInit', this);
		HttpService.get$('https://jsonplaceholder.typicode.com/users/1/todos').pipe(
			first(),
		).subscribe(response => {
			console.log('AppComponent.items', response);
			this.items = response.data;
			this.pushChanges();
		});
	}

	onClick(item: { title: string, completed: boolean }) {
		console.log('onClick', item);
	}

	static meta: IFactoryMeta = {
		selector: '[app-component]',
	};

}
