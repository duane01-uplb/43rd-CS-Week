<script lang="ts">
	import { onMount } from 'svelte';

	let stage: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let ready = $state(false);

	onMount(() => {
		let disposed = false;
		let stop: (() => void) | undefined;
		import('$lib/hero-emblem').then(({ mountEmblem }) => {
			if (!disposed) stop = mountEmblem(stage, canvas, (visible) => ready = visible);
		}).catch(() => { /* The original emblem is the static fallback. */ });
		return () => { disposed = true; stop?.(); };
	});
</script>

<div class="emblem" bind:this={stage} aria-hidden="true">
	<img class:hidden={ready} src="/casc4d3-emblem.png" alt="" />
	<canvas bind:this={canvas} class:visible={ready}></canvas>
</div>

<style>
	.emblem {
		position: relative;
		width: min(100%, 28rem);
		aspect-ratio: 1;
		justify-self: center;
	}
	canvas, img { position: absolute; display: block; }
	canvas { inset: 0; width: 100%; height: 100%; opacity: 0; }
	canvas.visible { opacity: 1; }
	img { inset: 10%; width: 80%; height: 80%; object-fit: contain; }
	img.hidden { visibility: hidden; }
	@media (max-width: 680px) {
		.emblem { width: clamp(8rem, 27svh, 13rem); }
	}
</style>
