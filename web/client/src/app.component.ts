import { Component, getContext, IFactoryMeta } from 'rxcomp';

export default class AppComponent extends Component {
	onInit() {
		const { node } = getContext(this);
		node.classList.add('init');
	}
	static meta: IFactoryMeta = {
		selector: '[app-component]',
	};
}
