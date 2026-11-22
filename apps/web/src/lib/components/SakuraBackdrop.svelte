<script lang="ts">
	import SakuraWind from "./SakuraWind.svelte";
	let { hero = false }: { hero?: boolean } = $props();

	// Pixel-art sakura tree (22 wide). '.' empty, 'P' blossom, 'L' light
	// blossom, 'D' deep blossom, 'T' trunk.
	const PTREE = [
		'......PPPP..PPPP......',
		'.....PPPPPPPPPP.......',
		'....PPPPPPPPPPPP......',
		'....DDDDDDPPPPPPP.....',
		'...PPPPPPPPPPPPPP.....',
		'...PPPPPPLLPPPPPP.....',
		'..PPPPPPPPPPPPPPPP....',
		'...PP..PPPPPPPP..PP...',
		'...PP.PPPPPPPP.PP.....',
		'.....PP.PPPP.PP.......',
		'......PPP..PPP........',
		'.......TT....TT.......',
		'.......TT....TT.......',
		'.......TTT..TTT.......',
		'........TTTTTT........',
		'........TTTTTT........',
		'.........TTTT.........',
		'.........TTTT.........',
		'.........TTTT.........',
		'.........TTTT.........',
		'.........TTTT.........'
	];
	const PCOLORS: Record<string, string> = {
		P: '#ff8fb3',
		L: '#ffc7da',
		D: '#c25072',
		T: '#46333f'
	};
</script>

<div class="site-backdrop" class:hero aria-hidden="true">
	<div class="ambient-glow"></div>
	<div class="sakura-bloom-glow"></div>

	<!-- Pixel-Art Sakura Trees on the sides (petals fall from their canopies) -->
	<svg class="pixel-tree tree-left" viewBox={`0 0 22 ${PTREE.length}`} shape-rendering="crispEdges" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
		{#each PTREE as row, r}
			{#each row.split('') as px, c}
				{#if px !== '.'}
					<rect x={c} y={r} width="1" height="1" fill={PCOLORS[px] ?? '#ff8fb3'} />
				{/if}
			{/each}
		{/each}
	</svg>
	<svg class="pixel-tree tree-right" viewBox={`0 0 22 ${PTREE.length}`} shape-rendering="crispEdges" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
		{#each PTREE as row, r}
			{#each row.split('') as px, c}
				{#if px !== '.'}
					<rect x={c} y={r} width="1" height="1" fill={PCOLORS[px] ?? '#ff8fb3'} />
				{/if}
			{/each}
		{/each}
	</svg>
	<svg class="pixel-tree tree-left-mid" viewBox={`0 0 22 ${PTREE.length}`} shape-rendering="crispEdges" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
		{#each PTREE as row, r}
			{#each row.split('') as px, c}
				{#if px !== '.'}
					<rect x={c} y={r} width="1" height="1" fill={PCOLORS[px] ?? '#ff8fb3'} />
				{/if}
			{/each}
		{/each}
	</svg>
	<svg class="pixel-tree tree-right-mid" viewBox={`0 0 22 ${PTREE.length}`} shape-rendering="crispEdges" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
		{#each PTREE as row, r}
			{#each row.split('') as px, c}
				{#if px !== '.'}
					<rect x={c} y={r} width="1" height="1" fill={PCOLORS[px] ?? '#ff8fb3'} />
				{/if}
			{/each}
		{/each}
	</svg>

	<!-- Decorative Sakura Branch Silhouettes -->
	<svg class="sakura-branches" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
		<path d="M-50 -20 C180 60, 320 180, 480 120 C560 90, 640 160, 720 110" stroke="#7a1f3d" stroke-opacity="0.25" stroke-width="3" stroke-linecap="round" fill="none" />
		<path d="M1490 -30 C1280 80, 1150 200, 980 150 C900 125, 840 210, 760 170" stroke="#7a1f3d" stroke-opacity="0.22" stroke-width="2.5" stroke-linecap="round" fill="none" />
		<!-- Soft Blossom Clusters -->
		<circle cx="320" cy="180" r="14" fill="#c25072" fill-opacity="0.2" filter="blur(2px)" />
		<circle cx="480" cy="120" r="18" fill="#f6e3e9" fill-opacity="0.25" filter="blur(3px)" />
		<circle cx="640" cy="160" r="12" fill="#c25072" fill-opacity="0.18" filter="blur(2px)" />
		<circle cx="1150" cy="200" r="16" fill="#f6e3e9" fill-opacity="0.22" filter="blur(2px)" />
		<circle cx="980" cy="150" r="14" fill="#c25072" fill-opacity="0.2" filter="blur(2px)" />
	</svg>

	<SakuraWind />

	<!-- Drifting Sakura Petals -->
	<div class="sakura-petals-container">
		{#each Array(14) as _, i}
			<div class={`sakura-petal petal-${i + 1}`}>
				<svg viewBox="0 0 9 9" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
					<rect x="3" y="0" width="3" height="3" fill="#ffc7da" />
					<rect x="0" y="3" width="3" height="3" fill="#c25072" />
					<rect x="3" y="3" width="3" height="3" fill="#ff8fb3" />
					<rect x="6" y="3" width="3" height="3" fill="#c25072" />
					<rect x="3" y="6" width="3" height="3" fill="#a63a5c" />
				</svg>
			</div>
		{/each}
	</div>
</div>

<style>
	/* ---- site-wide sakura backdrop ---- */
	.site-backdrop {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}
	.site-backdrop .ambient-glow {
		position: absolute;
		top: 15%;
		left: 50%;
		transform: translateX(-50%);
		width: 800px;
		height: 800px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(194, 80, 114, 0.24) 0%, rgba(122, 31, 61, 0.12) 45%, rgba(35, 28, 39, 0) 75%);
		filter: blur(40px);
	}
	.site-backdrop .sakura-bloom-glow {
		position: absolute;
		top: 5%;
		left: 50%;
		transform: translateX(-50%);
		width: 1000px;
		height: 600px;
		border-radius: 50%;
		background: radial-gradient(ellipse at center, rgba(246, 227, 233, 0.14) 0%, rgba(194, 80, 114, 0.08) 40%, transparent 70%);
		filter: blur(50px);
	}
	.site-backdrop .sakura-branches {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.site-backdrop .pixel-tree {
		position: absolute;
		bottom: 0;
		height: min(30vh, 320px);
		pointer-events: none;
		z-index: 1;
		filter: drop-shadow(0 14px 34px rgba(0, 0, 0, 0.5));
	}
	.site-backdrop .tree-left {
		left: -1vw;
	}
	.site-backdrop .tree-right {
		right: -1vw;
		transform: scaleX(-1);
	}
	.site-backdrop .tree-left-mid {
		left: 9vw;
		height: min(22vh, 240px);
		opacity: 0.82;
	}
	.site-backdrop .tree-right-mid {
		right: 9vw;
		height: min(22vh, 240px);
		opacity: 0.82;
		transform: scaleX(-1);
	}
	.site-backdrop .sakura-petals-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 2;
	}
	.site-backdrop .sakura-petal {
		position: absolute;
		top: -30px;
		opacity: 0.8;
		filter: drop-shadow(0 2px 4px rgba(122, 31, 61, 0.3));
		animation: petalFall linear infinite;
	}
	.site-backdrop .sakura-petal svg {
		width: 100%;
		height: 100%;
		animation: petalSway ease-in-out infinite alternate;
	}
	.site-backdrop .petal-1 { left: 5%; width: 14px; height: 14px; animation-duration: 11s; animation-delay: 0s; }
	.site-backdrop .petal-2 { left: 13%; width: 17px; height: 17px; animation-duration: 13s; animation-delay: 2.5s; }
	.site-backdrop .petal-3 { left: 21%; width: 12px; height: 12px; animation-duration: 10s; animation-delay: 5s; opacity: 0.65; }
	.site-backdrop .petal-4 { left: 29%; width: 15px; height: 15px; animation-duration: 12s; animation-delay: 1.2s; }
	.site-backdrop .petal-5 { left: 37%; width: 11px; height: 11px; animation-duration: 11.5s; animation-delay: 6.5s; opacity: 0.6; }
	.site-backdrop .petal-6 { left: 45%; width: 14px; height: 14px; animation-duration: 14s; animation-delay: 3.5s; }
	.site-backdrop .petal-7 { left: 53%; width: 16px; height: 16px; animation-duration: 12.5s; animation-delay: 8s; opacity: 0.75; }
	.site-backdrop .petal-8 { left: 61%; width: 15px; height: 15px; animation-duration: 12s; animation-delay: 1s; }
	.site-backdrop .petal-9 { left: 69%; width: 12px; height: 12px; animation-duration: 10.5s; animation-delay: 4s; opacity: 0.6; }
	.site-backdrop .petal-10 { left: 77%; width: 17px; height: 17px; animation-duration: 13.5s; animation-delay: 2s; }
	.site-backdrop .petal-11 { left: 84%; width: 14px; height: 14px; animation-duration: 11s; animation-delay: 9s; opacity: 0.8; }
	.site-backdrop .petal-12 { left: 90%; width: 11px; height: 11px; animation-duration: 10s; animation-delay: 5.5s; opacity: 0.65; }
	.site-backdrop .petal-13 { left: 95%; width: 16px; height: 16px; animation-duration: 12.5s; animation-delay: 7s; }
	.site-backdrop .petal-14 { left: 42%; width: 13px; height: 13px; animation-duration: 11.5s; animation-delay: 10.5s; opacity: 0.7; }

	@keyframes petalFall {
		0% {
			transform: translate(0, -20px) rotate(0deg);
			opacity: 0;
		}
		8% {
			opacity: 0.85;
		}
		30% {
			transform: translate(10vw, 30vh) rotate(90deg);
		}
		55% {
			transform: translate(20vw, 55vh) rotate(200deg);
		}
		78% {
			transform: translate(28vw, 82vh) rotate(300deg);
			opacity: 0.7;
		}
		100% {
			transform: translate(34vw, 108vh) rotate(360deg);
			opacity: 0;
		}
	}
	@keyframes petalSway {
		0% {
			transform: translateX(-14px) translateY(4px) rotateX(0deg) rotateY(0deg) rotate(-30deg);
		}
		50% {
			transform: translateX(16px) translateY(-8px) rotateX(50deg) rotateY(70deg) rotate(40deg);
		}
		100% {
			transform: translateX(-14px) translateY(6px) rotateX(0deg) rotateY(0deg) rotate(-20deg);
		}
	}
	@media (max-width: 720px) {
		.site-backdrop .pixel-tree {
			display: none;
		}
	}

	.site-backdrop.hero { position: absolute; }
	@media (prefers-reduced-motion: reduce) {
		.sakura-petals-container { display: none; }
	}
</style>
