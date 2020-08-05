import { Component, IFactoryMeta } from 'rxcomp';

export default class AppComponent extends Component {

	onInit() {
		this.items = new Array(4).fill(0).map((x, i) => {
			return { name: `item ${i + 1}`, done: Math.random() > 0.75 };
		});
		this.flag = true;
		this.active = false;
	}

	onClick(item: { name: string, done: boolean }) {
		console.log('onClick', item);
	}

	static meta: IFactoryMeta = {
		selector: '[app-component]',
	};

}
