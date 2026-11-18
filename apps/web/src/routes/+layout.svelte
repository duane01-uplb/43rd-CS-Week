<script lang="ts">
	import '../app.css';
	import '@fontsource/space-mono/400.css';
	import '@fontsource/space-mono/700.css';
	import '@fontsource/ibm-plex-sans/400.css';
	import '@fontsource/ibm-plex-sans/500.css';
	import '@fontsource/ibm-plex-sans/600.css';
	import '@fontsource/ibm-plex-sans/700.css';
	import '@fontsource/macondo-swash-caps/400.css';
	import '@fontsource/press-start-2p/400.css';
	import { page } from '$app/state';

	let { children } = $props();
	let menuOpen = $state(false);
	let scrolled = $state(false);

	const pathname = $derived(page.url.pathname);
	const isHome = $derived(pathname === '/');
	const isEvents = $derived(pathname.startsWith('/events'));

	function handleScroll() {
		if (typeof window !== 'undefined') {
			scrolled = window.scrollY > 40;
		}
	}

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

<svelte:window onscroll={handleScroll} />

<svelte:head>
	<title>CASC4D3 — The 43rd Computer Science Week</title>
	<meta
		name="description"
		content="CASC4D3: The 43rd Computer Science Week at UPLB. Keynotes, workshops, and friendly contests for the computing community."
	/>
	<meta name="theme-color" content="#2b2430" />
</svelte:head>

<header class="site-nav" class:isHome class:scrolled>
	<div class="nav-row shell">
		<a href="/" class="brand" aria-label="CASC4D3 — 43rd Computer Science Week Home">
			<span class="brand-mark-group">
				<span class="brand-mark brand-mark-soc" aria-hidden="true">
					<img src="/uplb-comsci-soc-logo.png" alt="" class="brand-logo-img" />
				</span>
				<span class="brand-divider" aria-hidden="true">│</span>
				<span class="brand-mark brand-mark-emblem" aria-hidden="true">
					<img src="/casc4d3-emblem.png" alt="" class="brand-emblem-img" />
				</span>
			</span>
			<span class="brand-text">
				<span class="brand-kicker">43RD COMPUTER SCIENCE WEEK</span>
				<span class="brand-name">CASC4D3</span>
			</span>
		</a>

		<nav class="nav-links" aria-label="Primary navigation">
			<a href="/" class:active={isHome}>Home</a>
			<a href="/events" class:active={isEvents}>Events</a>
			<a href="/#how-it-works">How It Works</a>
			<a href="/events" class="btn btn-nav-outline btn-sm nav-cta">Register for Events →</a>
		</nav>

		<button
			class="nav-toggle"
			aria-expanded={menuOpen}
			aria-controls="mobile-menu"
			aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				{#if menuOpen}
					<path d="M6 6l12 12M18 6L6 18" />
				{:else}
					<path d="M4 7h16M4 12h16M4 17h16" />
				{/if}
			</svg>
		</button>
	</div>

	{#if menuOpen}
		<nav id="mobile-menu" class="mobile-menu" aria-label="Mobile navigation">
			<a href="/" class:active={isHome} onclick={() => (menuOpen = false)}>Home</a>
			<a href="/events" class:active={isEvents} onclick={() => (menuOpen = false)}>Events & Schedule</a>
			<a href="/#how-it-works" onclick={() => (menuOpen = false)}>How It Works</a>
			<div class="mobile-menu-cta">
				<a href="/events" class="btn btn-nav-outline btn-full" onclick={() => (menuOpen = false)}>Register for Events →</a>
			</div>
		</nav>
	{/if}
</header>

<!-- Site-wide atmospheric Sakura backdrop shared across every page -->
<div class="site-backdrop" aria-hidden="true">
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

	<!-- Sakura Wind Breeze: flowing wavy gusts + fine wind-carried particles -->
	<div class="sakura-wind" aria-hidden="true">
		<svg width="0" height="0" style="position:absolute">
			<defs>
				<linearGradient id="windGrad1" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stop-color="rgba(246,227,233,0)" />
					<stop offset="30%" stop-color="rgba(246,227,233,0.6)" />
					<stop offset="70%" stop-color="rgba(198,80,114,0.4)" />
					<stop offset="100%" stop-color="rgba(198,80,114,0)" />
				</linearGradient>
				<linearGradient id="windGrad2" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stop-color="rgba(246,227,233,0)" />
					<stop offset="35%" stop-color="rgba(255,199,218,0.55)" />
					<stop offset="75%" stop-color="rgba(166,58,92,0.35)" />
					<stop offset="100%" stop-color="rgba(166,58,92,0)" />
				</linearGradient>
				<linearGradient id="windGrad3" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stop-color="rgba(246,227,233,0)" />
					<stop offset="30%" stop-color="rgba(255,199,218,0.5)" />
					<stop offset="70%" stop-color="rgba(194,80,114,0.4)" />
					<stop offset="100%" stop-color="rgba(194,80,114,0)" />
				</linearGradient>
				<linearGradient id="windGrad4" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stop-color="rgba(246,227,233,0)" />
					<stop offset="30%" stop-color="rgba(255,199,218,0.45)" />
					<stop offset="70%" stop-color="rgba(246,227,233,0.35)" />
					<stop offset="100%" stop-color="rgba(246,227,233,0)" />
				</linearGradient>
			</defs>
		</svg>
		<svg class="wind-gust gust-1" viewBox="0 0 400 60" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 30 C 60 6, 120 54, 180 30 S 300 6, 400 30" stroke="url(#windGrad1)" stroke-width="3.5" stroke-linecap="round" />
			<path d="M0 46 C 70 30, 130 62, 200 46 S 320 30, 400 46" stroke="url(#windGrad1)" stroke-width="2" stroke-linecap="round" />
		</svg>
		<svg class="wind-gust gust-2" viewBox="0 0 400 60" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 36 C 70 10, 140 52, 200 32 S 320 12, 400 30" stroke="url(#windGrad2)" stroke-width="3" stroke-linecap="round" />
		</svg>
		<svg class="wind-gust gust-3" viewBox="0 0 400 60" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 24 C 80 52, 150 6, 220 34 S 330 54, 400 22" stroke="url(#windGrad3)" stroke-width="2.5" stroke-linecap="round" />
		</svg>
		<svg class="wind-gust gust-4" viewBox="0 0 400 60" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 38 C 60 16, 120 50, 190 34 S 310 48, 400 28" stroke="url(#windGrad4)" stroke-width="2" stroke-linecap="round" />
		</svg>
		<div class="wind-part-frail wp-1"></div>
		<div class="wind-part-frail wp-2"></div>
		<div class="wind-part-frail wp-3"></div>
		<div class="wind-part-frail wp-4"></div>
		<div class="wind-part-frail wp-5"></div>
		<div class="wind-part-frail wp-6"></div>
		<div class="wind-part-frail wp-7"></div>
		<div class="wind-part-frail wp-8"></div>
	</div>

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

<main class:isHome class="page">
	{@render children()}
</main>

<footer class="site-footer">
	<div class="shell footer-row">
		<div class="footer-brand">
			<div class="brand">
				<span class="brand-mark-group">
					<span class="brand-mark brand-mark-soc" aria-hidden="true">
						<img src="/uplb-comsci-soc-logo.png" alt="" class="brand-logo-img" />
					</span>
					<span class="brand-divider" aria-hidden="true">│</span>
					<span class="brand-mark brand-mark-emblem" aria-hidden="true">
						<img src="/casc4d3-emblem.png" alt="" class="brand-emblem-img" />
					</span>
				</span>
				<span class="brand-text">
					<span class="brand-kicker">43RD COMPUTER SCIENCE WEEK</span>
					<span class="brand-name">CASC4D3</span>
				</span>
			</div>
			<p class="footer-tag">
				The official annual gathering of students, educators, developers, and tech creators at the University of the Philippines Los Baños.
			</p>
			<div class="footer-socials">
				<a href="https://www.facebook.com/uplbcossph" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
					</svg>
				</a>
				<a href="https://www.instagram.com/uplbcossph/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
						<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
						<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
					</svg>
				</a>
				<a href="https://www.tiktok.com/@uplbcossph?lang=en" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M14.5 3c.4 2.6 1.9 4.4 4.5 4.7v3.1c-1.5 0-2.9-.5-4.1-1.3v6.7c0 3.7-3 6.8-6.7 6.8S1.5 19.9 1.5 16.2c0-3.5 2.7-6.4 6.1-6.7v3.2c-1.4.3-2.4 1.5-2.4 3 0 1.7 1.4 3.1 3.1s3.1-1.4 3.1-3.1V3h3.1Z" />
					</svg>
				</a>
			</div>
		</div>
		<nav class="footer-links" aria-label="Footer navigation">
			<div class="footer-col">
				<span class="footer-col-title">Navigation</span>
				<a href="/">Home</a>
				<a href="/events">Events Roster</a>
				<a href="/#how-it-works">Registration Flow</a>
			</div>
			<div class="footer-col">
				<span class="footer-col-title">Community</span>
				<a href="/events">Schedule & Details</a>
				<a href="/#tracks">Open Tracks</a>
			</div>
		</nav>
	</div>
	<div class="shell footer-bottom">
		<p class="footer-legal">© 2026 UPLB Computer Science Society. All rights reserved.</p>
	</div>
</footer>

<style>
	/* ------------------------------------------------------------------ *
	 * CS Week Public Site — Global Design System & Variables.
	 * Binding Source of Truth: agents/DESIGN_TOKENS.md ("Sakura, but not flowery")
	 * ------------------------------------------------------------------ */
	:global(:root) {
		--rose-900: #7a1f3d;
		--rose-800: #8f2d4c;
		--rose-700: #a63a5c; /* Primary brand action */
		--rose-600: #c25072; /* Accent / focus highlight */
		--rose-100: #f6e3e9; /* Pale wash */
		--rose-050: #fbf1f4; /* Lightest tint wash */
		--plum: #2b2430; /* Main ink text / deep atmospheric dark */
		--plum-soft: #6f6676; /* Muted secondary text */
		--paper: #faf7f4; /* Warm-paper background */
		--card: #ffffff; /* Card surface */
		--line: #ece3e6; /* Hairline border */
		--ok: #3e7a5c; /* Confirmed / open */
		--warn: #b7791f; /* Pending / draft */
		--danger: #b13a3a; /* Cancelled / error */
		--font-display: 'Space Mono', 'Courier New', monospace;
		--font-body: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
		--radius: 12px;
		--radius-sm: 8px;
		--shadow: 0 1px 2px rgba(43, 36, 48, 0.05), 0 8px 24px rgba(43, 36, 48, 0.06);
		--shadow-hover: 0 2px 4px rgba(43, 36, 48, 0.05), 0 14px 34px rgba(43, 36, 48, 0.09);
		--focus: 0 0 0 3px rgba(194, 80, 114, 0.35);
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	:global(html, body) {
		margin: 0;
		min-height: 100%;
	}

	:global(body) {
		display: flex;
		flex-direction: column;
		background: linear-gradient(175deg, #1f1823 0%, #2b1f2e 40%, #341e2b 75%, #231a26 100%);
		color: var(--plum);
		font-family: var(--font-body);
		font-size: 16px;
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
	}

	/* ---- site-wide sakura backdrop ---- */
	:global(.site-backdrop) {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}
	:global(.site-backdrop) :global(.ambient-glow) {
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
	:global(.site-backdrop) :global(.sakura-bloom-glow) {
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
	:global(.site-backdrop) :global(.sakura-branches) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	:global(.site-backdrop) :global(.pixel-tree) {
		position: absolute;
		bottom: 0;
		height: min(30vh, 320px);
		pointer-events: none;
		z-index: 1;
		filter: drop-shadow(0 14px 34px rgba(0, 0, 0, 0.5));
	}
	:global(.site-backdrop) :global(.tree-left) {
		left: -1vw;
	}
	:global(.site-backdrop) :global(.tree-right) {
		right: -1vw;
		transform: scaleX(-1);
	}
	:global(.site-backdrop) :global(.tree-left-mid) {
		left: 9vw;
		height: min(22vh, 240px);
		opacity: 0.82;
	}
	:global(.site-backdrop) :global(.tree-right-mid) {
		right: 9vw;
		height: min(22vh, 240px);
		opacity: 0.82;
		transform: scaleX(-1);
	}
	:global(.site-backdrop) :global(.sakura-wind) {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 1;
	}
	:global(.site-backdrop) :global(.wind-gust) {
		position: absolute;
		height: 7vh;
		overflow: visible;
		opacity: 0.7;
		filter: blur(0.6px);
		animation: windFlow ease-in-out infinite;
		will-change: transform, opacity;
	}
	:global(.site-backdrop) :global(.wind-gust path) {
		stroke-dasharray: 500;
		stroke-dashoffset: 0;
		animation: gustFlow 3s ease-in-out infinite alternate;
	}
	:global(.site-backdrop) :global(.gust-1) { top: 14%; left: -32%; width: 52%; animation-duration: 12s; animation-delay: 0s; opacity: 0.55; }
	:global(.site-backdrop) :global(.gust-2) { top: 34%; left: -24%; width: 44%; animation-duration: 15s; animation-delay: 2.5s; opacity: 0.4; }
	:global(.site-backdrop) :global(.gust-3) { top: 56%; left: -36%; width: 58%; animation-duration: 13s; animation-delay: 5s; opacity: 0.5; }
	:global(.site-backdrop) :global(.gust-4) { top: 78%; left: -28%; width: 48%; animation-duration: 16s; animation-delay: 1.2s; opacity: 0.35; }
	:global(.site-backdrop) :global(.wind-part-frail) {
		position: absolute;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: rgba(255, 199, 218, 0.75);
		box-shadow: 0 0 10px rgba(194, 80, 114, 0.55);
		opacity: 0.6;
		animation: windFlow ease-in-out infinite;
		will-change: transform, opacity;
	}
	:global(.site-backdrop) :global(.wp-1) { top: 22%; left: -5%; animation-duration: 10s; animation-delay: 0s; }
	:global(.site-backdrop) :global(.wp-2) { top: 40%; left: -8%; animation-duration: 13s; animation-delay: 1.5s; }
	:global(.site-backdrop) :global(.wp-3) { top: 58%; left: -6%; animation-duration: 11s; animation-delay: 4s; }
	:global(.site-backdrop) :global(.wp-4) { top: 74%; left: -9%; animation-duration: 14s; animation-delay: 3s; }
	:global(.site-backdrop) :global(.wp-5) { top: 30%; left: -7%; animation-duration: 12s; animation-delay: 6s; }
	:global(.site-backdrop) :global(.wp-6) { top: 63%; left: -5%; animation-duration: 15s; animation-delay: 8s; }
	:global(.site-backdrop) :global(.wp-7) { top: 47%; left: -9%; animation-duration: 11s; animation-delay: 2s; }
	:global(.site-backdrop) :global(.wp-8) { top: 80%; left: -6%; animation-duration: 12.5s; animation-delay: 5.5s; }

	@keyframes windFlow {
		0% {
			transform: translateX(-2vw) translateY(0) rotate(-4deg) scaleX(0.6);
			opacity: 0;
		}
		10% {
			transform: translateX(8vw) translateY(-2vh) rotate(-3deg) scaleX(0.8);
			opacity: 0.6;
		}
		30% {
			transform: translateX(32vw) translateY(4vh) rotate(2deg) scaleX(1);
		}
		48% {
			transform: translateX(56vw) translateY(-4vh) rotate(-2deg) scaleX(1.02);
		}
		66% {
			transform: translateX(80vw) translateY(5vh) rotate(3deg) scaleX(1);
		}
		86% {
			transform: translateX(106vw) translateY(-2vh) rotate(-2deg) scaleX(0.85);
			opacity: 0.5;
		}
		100% {
			transform: translateX(126vw) translateY(3vh) rotate(2deg) scaleX(0.6);
			opacity: 0;
		}
	}
	@keyframes gustFlow {
		from { stroke-dashoffset: 500; }
		to { stroke-dashoffset: 0; }
	}
	:global(.site-backdrop) :global(.sakura-petals-container) {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 2;
	}
	:global(.site-backdrop) :global(.sakura-petal) {
		position: absolute;
		top: -30px;
		opacity: 0.8;
		filter: drop-shadow(0 2px 4px rgba(122, 31, 61, 0.3));
		animation: petalFall linear infinite;
	}
	:global(.site-backdrop) :global(.sakura-petal svg) {
		width: 100%;
		height: 100%;
		animation: petalSway ease-in-out infinite alternate;
	}
	:global(.site-backdrop) :global(.petal-1) { left: 5%; width: 14px; height: 14px; animation-duration: 11s; animation-delay: 0s; }
	:global(.site-backdrop) :global(.petal-2) { left: 13%; width: 17px; height: 17px; animation-duration: 13s; animation-delay: 2.5s; }
	:global(.site-backdrop) :global(.petal-3) { left: 21%; width: 12px; height: 12px; animation-duration: 10s; animation-delay: 5s; opacity: 0.65; }
	:global(.site-backdrop) :global(.petal-4) { left: 29%; width: 15px; height: 15px; animation-duration: 12s; animation-delay: 1.2s; }
	:global(.site-backdrop) :global(.petal-5) { left: 37%; width: 11px; height: 11px; animation-duration: 11.5s; animation-delay: 6.5s; opacity: 0.6; }
	:global(.site-backdrop) :global(.petal-6) { left: 45%; width: 14px; height: 14px; animation-duration: 14s; animation-delay: 3.5s; }
	:global(.site-backdrop) :global(.petal-7) { left: 53%; width: 16px; height: 16px; animation-duration: 12.5s; animation-delay: 8s; opacity: 0.75; }
	:global(.site-backdrop) :global(.petal-8) { left: 61%; width: 15px; height: 15px; animation-duration: 12s; animation-delay: 1s; }
	:global(.site-backdrop) :global(.petal-9) { left: 69%; width: 12px; height: 12px; animation-duration: 10.5s; animation-delay: 4s; opacity: 0.6; }
	:global(.site-backdrop) :global(.petal-10) { left: 77%; width: 17px; height: 17px; animation-duration: 13.5s; animation-delay: 2s; }
	:global(.site-backdrop) :global(.petal-11) { left: 84%; width: 14px; height: 14px; animation-duration: 11s; animation-delay: 9s; opacity: 0.8; }
	:global(.site-backdrop) :global(.petal-12) { left: 90%; width: 11px; height: 11px; animation-duration: 10s; animation-delay: 5.5s; opacity: 0.65; }
	:global(.site-backdrop) :global(.petal-13) { left: 95%; width: 16px; height: 16px; animation-duration: 12.5s; animation-delay: 7s; }
	:global(.site-backdrop) :global(.petal-14) { left: 42%; width: 13px; height: 13px; animation-duration: 11.5s; animation-delay: 10.5s; opacity: 0.7; }

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
		:global(.site-backdrop) :global(.pixel-tree) {
			display: none;
		}
	}

	:global(main.page), :global(.site-nav), :global(.site-footer) {
		position: relative;
		z-index: 1;
	}

	:global(:focus-visible) {
		outline: none;
		box-shadow: var(--focus);
		border-radius: 4px;
	}

	:global(h1, h2, h3, h4) {
		font-family: var(--font-display);
		color: var(--plum);
		margin: 0 0 0.4em;
		font-weight: 700;
		letter-spacing: 0.02em;
	}

	:global(a:not([data-slot='button']):not(.btn)) {
		color: var(--rose-700);
		text-decoration: none;
		transition: color 0.15s ease;
	}
	:global(a:not([data-slot='button']):not(.btn):hover) {
		text-decoration: underline;
	}

	/* ---- shared shell & layout utilities ---- */
	:global(.shell) {
		max-width: 1120px;
		margin-inline: auto;
		padding-inline: clamp(1.25rem, 5vw, 2.5rem);
	}

	:global(.page) {
		flex: 1;
	}
	:global(main.page:not(.isHome)) {
		max-width: 1120px;
		margin-inline: auto;
		padding: 3rem clamp(1.25rem, 5vw, 2.5rem) 5rem;
		background: var(--paper);
		border-inline: 1px solid var(--line);
	}
	@media (max-width: 720px) {
		:global(main.page:not(.isHome)) {
			max-width: none;
			margin-inline: 0;
			border-inline: none;
			padding: 1.5rem 1.15rem 3.25rem;
		}
	}

	/* ---- button utilities ---- */
	:global(.btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.62rem 1.25rem;
		border-radius: var(--radius-sm);
		border: 1px solid transparent;
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		white-space: nowrap;
		transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease, color 0.15s ease;
	}
	:global(.btn:hover) {
		text-decoration: none;
	}
	:global(.btn:active) {
		transform: translateY(1px);
	}
	:global(.btn-primary) {
		background: var(--rose-700);
		color: #ffffff;
		box-shadow: none;
	}
	:global(.btn-primary:hover) {
		background: var(--rose-800);
		color: #ffffff;
		box-shadow: none;
	}
	:global(.btn-nav-outline) {
		background: transparent;
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.45);
	}
	:global(.btn-nav-outline:hover) {
		background: rgba(255, 255, 255, 0.08);
		border-color: #ffffff;
		color: #ffffff;
	}
	:global(.btn-ghost) {
		background: transparent;
		color: var(--plum);
		border-color: var(--line);
	}
	:global(.btn-ghost:hover) {
		background: var(--rose-050);
		border-color: var(--rose-100);
		color: var(--rose-800);
	}
	:global(.btn-ghost-dark) {
		background: rgba(255, 255, 255, 0.06);
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.18);
		backdrop-filter: blur(8px);
	}
	:global(.btn-ghost-dark:hover) {
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.35);
		color: #ffffff;
	}
	:global(.btn-lg) {
		padding: 0.85rem 1.65rem;
		font-size: 1.02rem;
		border-radius: var(--radius);
	}
	:global(.btn-sm) {
		padding: 0.42rem 0.95rem;
		font-size: 0.88rem;
		border-radius: var(--radius-sm);
	}
	:global(.btn-full) {
		width: 100%;
	}
	:global(.btn-white) {
		background: #ffffff;
		color: var(--rose-900);
	}
	:global(.btn-white:hover) {
		background: var(--rose-050);
		color: var(--rose-800);
	}

	/* ---- typography utilities ---- */
	:global(.eyebrow) {
		margin: 0 0 0.5rem;
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--rose-700);
	}
	:global(.head) {
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--plum);
	}
	:global(.lede) {
		margin: 0;
		color: var(--plum-soft);
		font-size: 1.05rem;
		line-height: 1.65;
	}
	:global(.section-head) {
		margin-bottom: 2.75rem;
		max-width: 36rem;
	}
	:global(.section-head h2) {
		font-size: clamp(1.8rem, 3.8vw, 2.5rem);
		line-height: 1.2;
		margin: 0 0 0.5rem;
	}
	:global(.section-head-row) {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.5rem;
		max-width: none;
	}

	/* ---- form field styling ---- */
	:global(.field) {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-bottom: 1.35rem;
	}
	:global(.field label) {
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--plum);
	}
	.footer-tag {
		font-size: 0.95rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.62);
		max-width: 400px;
	}

	.footer-socials {
		display: flex;
		gap: 1.5rem;
		margin-top: 0.5rem;
	}

	.footer-socials a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		font-size: 1.5rem;
		opacity: 0.8;
		transition: opacity 0.2s ease, color 0.2s ease;
	}

	.footer-socials a:hover {
		opacity: 1;
		color: var(--rose-100);
	}

	.footer-socials a:hover {
		opacity: 1;
		color: var(--rose-100);
	}
	:global(.field input:not([type='checkbox']):not([type='radio'])),
	:global(.field select),
	:global(.field textarea) {
		width: 100%;
		padding: 0.7rem 0.95rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--line);
		background: var(--card);
		color: var(--plum);
		font-family: var(--font-body);
		font-size: 0.95rem;
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
	}
	:global(.field input:focus),
	:global(.field select:focus),
	:global(.field textarea:focus) {
		outline: none;
		border-color: var(--rose-600);
		box-shadow: var(--focus);
	}

	/* ---- badges & status dots ---- */
	:global(.badge) {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.24rem 0.7rem;
		border-radius: 999px;
		font-size: 0.76rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		white-space: nowrap;
		line-height: 1.3;
	}
	:global(.badge-open),
	:global(.badge-confirmed) {
		background: #e5f2eb;
		color: var(--ok);
	}
	:global(.badge-draft),
	:global(.badge-pending) {
		background: #f4efe4;
		color: var(--warn);
	}
	:global(.badge-closed) {
		background: #ece6ea;
		color: var(--plum-soft);
	}
	:global(.badge-cancelled) {
		background: #fae7e7;
		color: var(--danger);
	}
	:global(.badge-dot) {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
	}

	/* ---- status alert messages ---- */
	:global(.status-msg) {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border-radius: var(--radius-sm);
		font-size: 0.92rem;
		line-height: 1.5;
		margin-bottom: 1.25rem;
	}
	:global(.status-msg.alert) {
		background: #fae7e7;
		border: 1px solid #f1cfcf;
		color: var(--danger);
	}
	:global(.status-msg.info) {
		background: var(--rose-050);
		border: 1px solid var(--rose-100);
		color: var(--rose-900);
	}
	:global(.status-msg.ok) {
		background: #e5f2eb;
		border: 1px solid #c2e2d0;
		color: var(--ok);
	}

	:global(.empty-card) {
		border: 1.5px dashed var(--rose-100);
		border-radius: var(--radius);
		background: var(--rose-050);
		padding: 3rem 2rem;
		text-align: center;
	}
	:global(.empty-card h3) {
		font-size: 1.2rem;
		margin: 0 0 0.4rem;
	}
	:global(.empty-card p) {
		margin: 0;
		color: var(--plum-soft);
	}

	:global(.arrow-link) {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--rose-700);
		font-weight: 600;
		font-size: 0.95rem;
		white-space: nowrap;
	}
	:global(.arrow-link svg) {
		transition: transform 0.15s ease;
	}
	:global(.arrow-link:hover) {
		color: var(--rose-800);
		text-decoration: none;
	}
	:global(.arrow-link:hover svg) {
		transform: translateX(3px);
	}

	:global(.sr-only) {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}

	/* ---- brand mark ---- */
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.85rem;
		text-decoration: none;
	}
	.brand:hover {
		text-decoration: none;
	}
	.brand-mark-group {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}
	.brand-mark {
		width: 36px;
		height: 36px;
		flex-shrink: 0;
		border-radius: 50%;
		background: radial-gradient(circle at 32% 30%, var(--rose-600), var(--rose-800) 72%);
		box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.4), 0 2px 8px rgba(166, 58, 92, 0.35);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 2.5px;
		overflow: hidden;
	}
	.brand-mark-emblem {
		background: radial-gradient(circle at 35% 30%, #ffffff 0%, #fbf1f4 60%, #f6e3e9 100%);
		box-shadow: inset 0 0 0 1.5px rgba(194, 80, 114, 0.45), 0 2px 8px rgba(166, 58, 92, 0.25);
		padding: 3.5px;
	}
	.brand-logo-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
		display: block;
	}
	.brand-emblem-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}
	.brand-text {
		display: flex;
		flex-direction: column;
		line-height: 1.15;
	}
	.brand-kicker {
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		color: var(--rose-100);
	}
	.brand-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.18rem;
		color: #ffffff;
		letter-spacing: 0.02em;
	}

	/* ---- header navigation (RecordRecharge chrome, sakura tokens) ---- */
	.site-nav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--plum);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}
	.site-nav.isHome:not(.scrolled) {
		position: absolute;
		left: 0;
		right: 0;
		background: linear-gradient(180deg, rgba(43, 36, 48, 0.72) 0%, rgba(43, 36, 48, 0) 100%);
		border-bottom-color: transparent;
	}
	.site-nav.isHome.scrolled {
		position: sticky;
		background: var(--plum);
		border-bottom-color: rgba(255, 255, 255, 0.1);
	}

	.nav-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.35rem;
	}
	.nav-links a:not(.btn) {
		color: rgba(255, 255, 255, 0.78);
		font-weight: 500;
		font-size: 0.82rem;
		padding: 0.25rem 0;
		position: relative;
		letter-spacing: 0.01em;
		transition: color 0.15s ease;
	}
	.nav-links a:not(.btn):hover {
		color: #ffffff;
		text-decoration: none;
	}
	.nav-links a:not(.btn).active {
		color: #ffffff;
		font-weight: 600;
	}
	.nav-links a:not(.btn).active::after {
		content: '';
		position: absolute;
		bottom: -6px;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--rose-600);
	}
	.nav-cta {
		margin-left: 0.35rem;
	}

	.nav-toggle {
		display: none;
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.22);
		border-radius: var(--radius-sm);
		padding: 0.5rem;
		cursor: pointer;
		color: #ffffff;
		transition: background 0.15s ease, border-color 0.15s ease;
	}
	.nav-toggle:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.4);
	}

	.mobile-menu {
		display: none;
	}

	/* ---- footer ---- */
	.site-footer {
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		background: var(--plum);
		margin-top: auto;
		color: rgba(255, 255, 255, 0.72);
	}
	.footer-row {
		display: flex;
		justify-content: space-between;
		gap: 3rem;
		flex-wrap: wrap;
		padding-top: 4rem;
		padding-bottom: 2.5rem;
	}
	.footer-brand {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
		max-width: 30rem;
	}
	.footer-tag {
		margin: 0.25rem 0 0;
		color: rgba(255, 255, 255, 0.62);
		font-size: 0.92rem;
		line-height: 1.65;
	}
	.footer-links {
		display: flex;
		gap: 3.5rem;
		flex-wrap: wrap;
	}
	.footer-col {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}
	.footer-col-title {
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--rose-600);
		margin-bottom: 0.35rem;
	}
	.footer-col a {
		color: rgba(255, 255, 255, 0.68);
		font-size: 0.92rem;
		text-decoration: none;
		transition: color 0.15s ease;
	}
	.footer-col a:hover {
		color: #ffffff;
		text-decoration: none;
	}
	.footer-bottom {
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		padding-top: 1.5rem;
		padding-bottom: 2.25rem;
	}
	.footer-legal {
		margin: 0;
		color: rgba(255, 255, 255, 0.45);
		font-size: 0.82rem;
	}

	/* ---- responsive behavior ---- */
	@media (max-width: 720px) {
		.nav-links {
			display: none;
		}
		.nav-toggle {
			display: inline-flex;
		}
		.mobile-menu {
			display: flex;
			flex-direction: column;
			gap: 0.35rem;
			padding: 1.25rem clamp(1.25rem, 5vw, 2.5rem) 1.75rem;
			border-top: 1px solid rgba(255, 255, 255, 0.08);
			background: var(--plum);
			box-shadow: none;
		}
		.mobile-menu > a {
			padding: 0.7rem 0.25rem;
			color: rgba(255, 255, 255, 0.86);
			font-weight: 500;
			border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		}
		.mobile-menu > a.active {
			color: #ffffff;
			font-weight: 600;
		}
		.mobile-menu > a:hover {
			color: #ffffff;
			text-decoration: none;
		}
		.mobile-menu-cta {
			padding-top: 0.85rem;
		}
		.footer-row {
			flex-direction: column;
			gap: 2rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
		}
		:global(*) {
			animation-duration: 0.001ms !important;
			transition-duration: 0.001ms !important;
		}
		:global(.site-backdrop) :global(.sakura-wind) {
			opacity: 0;
		}
	}
</style>