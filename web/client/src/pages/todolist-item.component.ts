import 'gsap';
import { IElement, IFactoryMeta } from 'rxcomp';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterKeyValue, transition$, View } from '../../../../../rxcomp-router/dist/cjs/rxcomp-router';

export default class TodolistItemComponent extends View {
	onInit() {
		console.log('TodolistItemComponent.onInit', this.route);
		combineLatest(this.route.data$, this.route.params$).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((datas: RouterKeyValue[]) => {
			this.title = datas[0].title;
			this.itemId = datas[1].itemId;
			// this.pushChanges(); // !!! not needed;
			// console.log('TodolistItemComponent', datas);
		});
	}
	onEnter(node: IElement) {
		return transition$(complete => {
			gsap.set(node, { opacity: 0 });
			gsap.to(node, {
				opacity: 1,
				duration: 0.6,
				ease: Power3.easeOut,
				onComplete: () => {
					complete(true);
				}
			});
		});
	}
	onExit(node: IElement) {
		return transition$(complete => {
			gsap.set(node, { opacity: 1 });
			gsap.to(node, {
				opacity: 0,
				duration: 0.6,
				ease: Power3.easeOut,
				onComplete: () => {
					complete(true);
				}
			});
		});
	}
	static meta: IFactoryMeta = {
		selector: '[detail-component]',
		template: /* html */`
        <div class="page-detail">
            <div class="title">Todolist Item {{itemId}}</div>
        </div>
        `,
	};
}
