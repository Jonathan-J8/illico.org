import { PixelateVideos, type ScrambleText } from 'pkg-components';
import headerTexts from './texts.json';

const animateHeader = () => {
	let inc = 1;
	let id: undefined | ReturnType<typeof setInterval>;

	const resize = () => {
		const min = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
		const h2Container = document.getElementById('js-header-container') as HTMLDivElement;
		h2Container.style.transform = `scale(${min})`;
	};
	resize();
	window.addEventListener('resize', resize);

	const h2Top = document.getElementById('js-header-top') as ScrambleText;
	const h2Bottom = document.getElementById('js-header-bottom') as ScrambleText;
	const h2Video = document.getElementById('js-header-video') as PixelateVideos;
	const h2Buttons = document.getElementById('js-header-buttons') as HTMLElement;
	const inputs = document.querySelectorAll('#js-header-buttons input');
	const anim = async () => {
		const { value, question } = headerTexts[inc];

		h2Top.delay = 0;
		h2Bottom.delay = 300;
		h2Top.setAttribute('value', value);
		h2Bottom.setAttribute('value', question);
		h2Video.setAttribute('video', `${inc}`);

		++inc;
		inc = inc % headerTexts.length;
	};

	const next = () => {
		const el = inputs[inc] as HTMLInputElement;
		el.checked = true;
		anim();
	};

	Array.from(inputs).forEach((element, i) => {
		const el = element as HTMLInputElement;
		el.dataset['index'] = `${i}`;
	});
	h2Buttons.onchange = (e: Event) => {
		const el = e.target as HTMLInputElement;
		const index = parseInt(el.dataset['index'] || '0');
		inc = index;
		next();
	};

	const el = document.querySelector('header') as HTMLElement;
	const observer = new IntersectionObserver(
		(entries) => {
			const { intersectionRatio } = entries[0];
			if (intersectionRatio === 0) {
				if (typeof id === 'number') clearInterval(id);
			} else {
				// anim();
				id = setInterval(next, 6000);
			}
		},
		{ threshold: 0 }
	);

	observer.observe(el);

	import.meta.hot?.on('vite:beforeUpdate', () => {
		observer.unobserve(el);
		window.removeEventListener('resize', resize);
	});
};

export default animateHeader;
