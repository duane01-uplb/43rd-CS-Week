import { animate, onScroll, stagger } from 'animejs';

type Revertible = { revert: () => unknown };

function track<T extends Revertible>(handles: Revertible[], item: T): T {
	handles.push(item);
	return item;
}

export function reducedMotion() {
	return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function revealOnScroll(elements: Element[], handles: Revertible[]) {
	if (!elements.length || reducedMotion()) return;
	for (const el of elements) {
		track(
			handles,
			animate(el, {
				opacity: { from: 0, to: 1 },
				y: { from: 28, to: 0 },
				duration: 720,
				ease: 'out(3)',
				autoplay: onScroll({
					target: el as HTMLElement,
					enter: 'bottom-=16% top',
					sync: 'play'
				})
			})
		);
	}
}

export function staggerChildren(
	parent: Element,
	childSelector: string,
	handles: Revertible[],
	gap = 90
) {
	const kids = parent.querySelectorAll(childSelector);
	if (!kids.length || reducedMotion()) return;
	track(
		handles,
		animate(kids, {
			opacity: { from: 0, to: 1 },
			y: { from: 22, to: 0 },
			delay: stagger(gap),
			duration: 640,
			ease: 'out(3)',
			autoplay: onScroll({
				target: parent as HTMLElement,
				enter: 'bottom-=16% top',
				sync: 'play'
			})
		})
	);
}

export function mountPageMotion() {
	const handles: Revertible[] = [];
	revealOnScroll([...document.querySelectorAll('[data-reveal]')], handles);
	document.querySelectorAll('[data-stagger]').forEach((parent) => {
		const selector = parent.getAttribute('data-stagger');
		if (selector) staggerChildren(parent, selector, handles);
	});
	return () => {
		for (const handle of handles.reverse()) handle.revert();
	};
}
