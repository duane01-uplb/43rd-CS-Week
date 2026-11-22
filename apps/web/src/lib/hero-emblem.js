import {
	Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, HemisphereLight,
	Group, Mesh, MeshStandardMaterial, LatheGeometry, CircleGeometry, Vector2,
	TextureLoader, SRGBColorSpace
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const HOLD = 6;
const SPIN = 1.1;

function makeSocietySeal(texture) {
	texture.colorSpace = SRGBColorSpace;
	const seal = new Group();
	// Revolve the bevel profile around the seal, leaving both faces open for the artwork.
	const profile = [[0.975, -0.077], [0.99, -0.073], [1, -0.06], [1, 0.06], [0.99, 0.073], [0.975, 0.077]];
	const edge = new Mesh(new LatheGeometry(profile.map(([r, z]) => new Vector2(r, z)), 160),
		new MeshStandardMaterial({ color: 0x344b82, metalness: 0.48, roughness: 0.31 }));
	edge.rotation.x = Math.PI / 2;
	seal.add(edge);

	const face = new Mesh(new CircleGeometry(0.976, 160), new MeshStandardMaterial({
		map: texture, bumpMap: texture, bumpScale: 0.009, roughness: 0.58, metalness: 0.12
	}));
	face.position.z = 0.077;
	const reverse = face.clone();
	reverse.position.z = -face.position.z;
	reverse.rotation.y = Math.PI;
	seal.add(face, reverse);
	return seal;
}

/** @param {HTMLElement} stage @param {HTMLCanvasElement} canvas @param {(visible: boolean) => void} show */
export function mountEmblem(stage, canvas, show) {
	let renderer;
	try {
		renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
	} catch {
		return () => {};
	}
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	const scene = new Scene();
	const camera = new PerspectiveCamera(34, 1, 0.1, 10);
	camera.position.z = 4.15;
	scene.add(new HemisphereLight(0xfff1f3, 0x9e425a, 1.9));
	const key = new DirectionalLight(0xfff3ee, 3.2);
	key.position.set(-2, 3, 4);
	const rim = new DirectionalLight(0xffa5bb, 2.6);
	rim.position.set(3, 1, -1);
	scene.add(key, rim);

	const reduced = matchMedia('(prefers-reduced-motion: reduce)');
	const model = new Group();
	const turntable = new Group();
	model.add(turntable);
	scene.add(model);
	let emblem, seal, frame = 0, timer = 0, previous = 0, elapsed = 0, cycle = 0;
	let societyFirst = false;
	let pointerX = 0, pointerY = 0, inView = true, disposed = false;

	function draw(now) {
		frame = 0;
		if (!emblem || disposed || !inView || document.hidden) { previous = 0; return; }
		const delta = previous ? (now - previous) / 1000 : 0;
		previous = now;
		elapsed += delta;
		const duration = HOLD + (reduced.matches ? 0 : SPIN);
		if (seal) cycle += delta;
		if (cycle >= duration) {
			if (Math.floor(cycle / duration) % 2) societyFirst = !societyFirst;
			cycle %= duration;
		}
		const progress = reduced.matches ? 0 : Math.max(0, (cycle - HOLD) / SPIN);
		const eased = progress * progress * (3 - 2 * progress);
		const swapped = eased >= 0.5;
		const showSociety = societyFirst !== swapped;
		emblem.visible = !showSociety;
		if (seal) seal.visible = showSociety;
		turntable.rotation.y = (eased - (swapped ? 1 : 0)) * 3 * Math.PI;
		if (reduced.matches) {
			model.rotation.set(-0.09, -0.23, 0);
			model.position.y = 0;
		} else {
			const ease = 1 - Math.exp(-delta * 7);
			model.rotation.y += (-0.23 + 0.15 * Math.sin(elapsed * 0.62) + pointerX * 0.52 - model.rotation.y) * ease;
			model.rotation.x += (-0.09 + 0.06 * Math.sin(elapsed * 0.8) + pointerY * 0.34 - model.rotation.x) * ease;
			model.position.y = 0.025 * Math.sin(elapsed * 0.9);
		}
		renderer.render(scene, camera);
		show(true);
		if (!reduced.matches) wake();
		else if (seal) timer = window.setTimeout(wake, Math.max(16, (HOLD - cycle) * 1000));
	}
	function wake() {
		clearTimeout(timer);
		if (!frame && !disposed && emblem && inView && !document.hidden) frame = requestAnimationFrame(draw);
	}
	function resume() { previous = 0; wake(); }
	function move(event) {
		if (event.pointerType === 'touch' || reduced.matches) return;
		const rect = stage.getBoundingClientRect();
		pointerX = 2 * (event.clientX - rect.left) / rect.width - 1;
		pointerY = 2 * (event.clientY - rect.top) / rect.height - 1;
	}
	function reset() { pointerX = 0; pointerY = 0; }
	const size = new ResizeObserver(() => {
		renderer.setSize(stage.clientWidth, stage.clientHeight, false);
		wake();
	});
	size.observe(stage);
	const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; resume(); });
	visibility.observe(stage);
	stage.addEventListener('pointermove', move);
	stage.addEventListener('pointerleave', reset);
	reduced.addEventListener('change', resume);
	document.addEventListener('visibilitychange', resume);
	function release(object) {
		const geometries = new Set();
		const materials = new Set();
		object.traverse(child => {
			if (child.isMesh) { geometries.add(child.geometry); materials.add(child.material); }
		});
		for (const geometry of geometries) geometry.dispose();
		for (const material of materials) { material.map?.dispose(); material.dispose(); }
	}
	new GLTFLoader().load('/casc4d3-emblem.glb', ({ scene: object }) => {
		if (disposed) { release(object); return; }
		emblem = object;
		model.rotation.set(-0.09, -0.23, 0);
		turntable.add(emblem);
		wake();
	}, undefined, () => show(false));
	new TextureLoader().load('/uplb-comsci-soc-logo.png', texture => {
		if (disposed) { texture.dispose(); return; }
		seal = makeSocietySeal(texture);
		seal.visible = false;
		turntable.add(seal);
		wake();
	});
	return () => {
		disposed = true;
		cancelAnimationFrame(frame);
		clearTimeout(timer);
		size.disconnect();
		visibility.disconnect();
		stage.removeEventListener('pointermove', move);
		stage.removeEventListener('pointerleave', reset);
		reduced.removeEventListener('change', resume);
		document.removeEventListener('visibilitychange', resume);
		release(model);
		renderer.dispose();
	};
}
