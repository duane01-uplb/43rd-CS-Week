<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import { onDestroy } from 'svelte';

	let { data } = $props();

	// Ambient sakura soundtrack: plays on first user interaction (browsers
	// block autoplay until then), toggled by the floating music button.
	const AUDIO_SRC = '/florews-sakura-325896.mp3';
	let audio: HTMLAudioElement | undefined = $state();
	let playing = $state(false);

	$effect(() => {
		if (audio) {
			audio.loop = true;
			audio.volume = 0.7;
		}
	});

	function toggleMusic() {
		if (!audio) {
			audio = new Audio(AUDIO_SRC);
			audio.loop = true;
			audio.volume = 0.7;
		}
		if (audio.paused) {
			audio.play().catch(() => {});
			playing = true;
		} else {
			audio.pause();
			playing = false;
		}
	}

	onDestroy(() => {
		audio?.pause();
		audio = undefined;
	});

	// Mouse parallax & interactive grid spotlight tracking
	let cursorX = $state(50);
	let cursorY = $state(50);
	let hasMouse = $state(false);
	// Tiles stay raised while the cursor moves, then settle back to rest
	// 2 seconds after movement stops.
	let gridLit = $state(false);
	let idleTimer: ReturnType<typeof setTimeout> | undefined;

	// 3D rising grid: every square touched by the cursor light lifts toward
	// the viewer as an extruded prism; lift depth falls off with distance.
	const CELL = 48;
	const LIGHT_RADIUS = 110;
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
	let viewportW = $state(typeof window !== 'undefined' ? window.innerWidth : 1440);
	let viewportH = $state(typeof window !== 'undefined' ? window.innerHeight : 900);
	let cols = $derived(Math.max(1, Math.floor(viewportW / CELL)));
	let rows = $derived(Math.max(1, Math.floor(viewportH / CELL)));
	let cells = $derived(Array.from({ length: cols * rows }, (_, i) => i));
	let lightPath = $derived.by(() => {
		const lifts = new Map<number, number>();
		if (!hasMouse || !gridLit) return lifts;
		const cx = (cursorX / 100) * viewportW;
		const cy = (cursorY / 100) * viewportH;
		const cellW = viewportW / cols;
		const cellH = viewportH / rows;
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const dx = (c + 0.5) * cellW - cx;
				const dy = (r + 0.5) * cellH - cy;
				const dist = Math.hypot(dx, dy);
				if (dist <= LIGHT_RADIUS) {
					const t = 1 - dist / LIGHT_RADIUS;
					lifts.set(r * cols + c, Math.round(16 + t * 72));
				}
			}
		}
		return lifts;
	});

	function handleMouseMove(e: MouseEvent) {
		if (typeof window !== 'undefined') {
			const { innerWidth, innerHeight } = window;
			cursorX = (e.clientX / innerWidth) * 100;
			cursorY = (e.clientY / innerHeight) * 100;
			hasMouse = true;
			gridLit = true;
			if (idleTimer) clearTimeout(idleTimer);
			idleTimer = setTimeout(() => {
				gridLit = false;
			}, 2000);
		}
	}

	onDestroy(() => {
		if (idleTimer) clearTimeout(idleTimer);
	});

	function handleResize() {
		if (typeof window !== 'undefined') {
			viewportW = window.innerWidth;
			viewportH = window.innerHeight;
		}
	}
</script>

<svelte:window onmousemove={handleMouseMove} onresize={handleResize} />

<svelte:head>
	<title>CASC4D3</title>
</svelte:head>

<!-- ============================== CINEMATIC HERO ============================== -->
<section class="hero-cinematic" aria-label="Hero Introduction">
	<!-- Atmospheric Sakura Blossom Background with Interactive Lit Grid & Drifting Petals -->
	<div class="hero-backdrop" style={`--cursor-x: ${cursorX}%; --cursor-y: ${cursorY}%;`} aria-hidden="true">
		<div class="ambient-glow"></div>
		<div class="sakura-bloom-glow"></div>
		<div class="cursor-aura" class:active={hasMouse}></div>
		<div class="grid-3d" style={`--cols: ${cols}; --rows: ${rows};`} aria-hidden="true">
			{#each cells as i}
				{@const lift = lightPath.get(i) ?? 0}
				<div class="grid-cell" class:active={lift > 0} style={`--lift: ${lift}px`}></div>
			{/each}
		</div>

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

	<!-- Central Hero Overlay Content -->
	<div class="hero-inner shell">
		<div class="hero-content">
			<div class="hero-badge">
				<span class="hero-badge-text">43RD COMPUTER SCIENCE WEEK</span>
			</div>

			<h1 class="hero-title">
				CASC<span class="hero-digit">4</span>D<span class="hero-digit">3</span>
				<span class="hero-subtitle-line">Towards a Resilient Human-Centered Computing</span>
			</h1>

			<p class="hero-description">
				The Annual Flagship Event of UPLB Computer Science Society
			</p>

			<div class="hero-action-row">
				<Button variant="primary" size="lg" href="/events">
					<span>Register for Events</span>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M5 12h14" />
						<path d="m12 5 7 7-7 7" />
					</svg>
				</Button>
				<Button variant="ghost-dark" size="lg" href="#event">
					<span>Explore Schedule</span>
				</Button>
			</div>
		</div>

		<!-- Bottom Metadata & Stat Bar -->
		<div class="hero-stat-bar">
			<div class="stat-item">
				<span class="stat-val">placeholder</span>
				<span class="stat-lbl">placeholder</span>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<span class="stat-val">placeholder</span>
				<span class="stat-lbl">placeholder</span>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<span class="stat-val">placeholder</span>
				<span class="stat-lbl">placeholder</span>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<span class="stat-val">placeholder</span>
				<span class="stat-lbl">placeholder</span>
			</div>
		</div>
	</div>

	<!-- Floating ambient music toggle -->
	<button
		class="music-toggle"
		type="button"
		onclick={toggleMusic}
		aria-label={playing ? 'Pause ambient music' : 'Play ambient music'}
		title="Toggle ambient music"
	>
		{#if playing}
			<span class="music-bars" aria-hidden="true">
				<i></i><i></i><i></i><i></i>
			</span>
		{:else}
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M9 18V5l12-2v13" />
				<circle cx="6" cy="18" r="3" />
				<circle cx="18" cy="16" r="3" />
			</svg>
		{/if}
	</button>

	<!-- Minimal Right-Edge Section Index Indicator -->
	<aside class="hero-edge-nav" aria-label="Page section navigation">
		<a href="#intro" class="edge-dot">
			<span class="edge-dot-mark" aria-hidden="true"></span>
			<span class="edge-label">01 INTRO</span>
		</a>
		<a href="#event" class="edge-dot">
			<span class="edge-dot-mark" aria-hidden="true"></span>
			<span class="edge-label">02 EVENTS</span>
		</a>
		<a href="#experience" class="edge-dot">
			<span class="edge-dot-mark" aria-hidden="true"></span>
			<span class="edge-label">03 ABOUT</span>
		</a>
		<a href="#how-it-works" class="edge-dot">
			<span class="edge-dot-mark" aria-hidden="true"></span>
			<span class="edge-label">04 GUIDE</span>
		</a>
	</aside>
</section>

<!-- ====================== SECTION 1: IDENTITY & OVERVIEW ====================== -->
<section class="section-intro" id="intro">
	<div class="shell">
		<div class="intro-grid">
			<div class="intro-heading-col">
				<p class="eyebrow">The 43rd Celebration</p>
				<h2>Where computing curiosity cascades into impact.</h2>
			</div>
			<div class="intro-body-col">
				<p class="intro-lead">
					CASC4D3 honors the legacy of Computer Science at UPLB by creating an open arena for everyone — from first-year explorers to senior systems architects.
				</p>
				<p class="intro-sub">
					No paywalls. No gatekeeping. Just pure passion for algorithms, interfaces, design challenges, and community.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- ====================== SECTION 2: FEATURED / UPCOMING event ====================== -->
<section class="section-event" id="event">
	<div class="shell">
		<div class="section-head section-head-row">
			<div>
				<p class="eyebrow">Schedule & Registration</p>
				<h2>Open Events</h2>
				<p class="lede">Active registration streams. Slots are reserved instantly upon form submission.</p>
			</div>
			<a href="/events" class="arrow-link">
				<span>View complete event schedule</span>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M5 12h14" />
					<path d="m12 5 7 7-7 7" />
				</svg>
			</a>
		</div>

		{#if data.upcoming.length === 0}
			<div class="empty-card">
				<h3>No events currently accepting registrations</h3>
				<p>Organizers are preparing the next batch of sessions and challenges. Check back soon.</p>
				<div style="margin-top: 1.25rem;">
					<Button variant="ghost" size="sm" href="/events">Browse full event catalog</Button>
				</div>
			</div>
		{:else}
			<div class="track-grid">
				{#each data.upcoming as event (event.id)}
					<EventCard {event} variant="track" />
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- ====================== SECTION 3: THREE EXPERIENCE PILLARS ====================== -->
<section class="section-experience" id="experience">
	<div class="shell">
		<div class="section-head">
			<p class="eyebrow">Pillars of CASC4D3</p>
			<h2>Curated for every aspect of computing.</h2>
			<p class="lede">A balanced blend of academic insights, technical rigor, and spirited friendly competition.</p>
		</div>

		<div class="pillars-grid">
			<article class="pillar-card">
				<span class="pillar-icon" aria-hidden="true">
					<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<rect x="3" y="4" width="18" height="18" rx="2" />
						<path d="M3 10h18" />
						<path d="M8 2v4M16 2v4" />
						<path d="m9 16 2 2 4-4" />
					</svg>
				</span>
				<h3>Career & Tech Orientation</h3>
				<p>An opportunity for participants to gain valuable insights into the world of Computer Science and explore career opportunities. Expert guest speakers will share their knowledge and experiences, highlighting the realities and advantages of pursuing a career in Computer Science, with a particular focus on the current Computer Science Week theme.</p>
			</article>

			<article class="pillar-card">
				<span class="pillar-icon" aria-hidden="true">
					<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<polygon points="12 2 2 7 12 12 22 7 12 2" />
						<polyline points="2 17 12 22 22 17" />
						<polyline points="2 12 12 17 22 12" />
					</svg>
				</span>
				<h3>Warframes Design & Code</h3>
				<p>An event where participants can showcase their creative prowess and technical acumen in wireframe design. This competition serves as a platform for talented individuals and teams to demonstrate their ability to craft visually captivating, user-friendly, and innovative wireframes using Figma, based on a provided case study.</p>
			</article>

			<article class="pillar-card">
				<span class="pillar-icon" aria-hidden="true">
					<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<line x1="6" y1="12" x2="10" y2="12" />
						<line x1="8" y1="10" x2="8" y2="14" />
						<line x1="15" y1="13" x2="15.01" y2="13" />
						<line x1="18" y1="11" x2="18.01" y2="11" />
						<rect x="2" y="6" width="20" height="12" rx="2" />
					</svg>
				</span>
				<h3>Games Day Showdown</h3>
				<p>An annual video game tournament organized by the UPLB Computer Science Society during their Computer Science Week. This year, the event exclusively features Valorant, where teams from all around the Philippines compete for a cash prize and the prestigious title of Games Day Champion.</p>
			</article>
		</div>
	</div>
</section>

<!-- ====================== SECTION 4: HOW IT WORKS ====================== -->
<section class="section-howto" id="how-it-works">
	<div class="shell">
		<div class="section-head">
			<p class="eyebrow">Registration Flow</p>
			<h2>Fast, frictionless, account-free.</h2>
			<p class="lede">We eliminated sign-up hurdles so your entry is confirmed in less than a minute.</p>
		</div>

		<ol class="steps-flow">
			<li class="step-card">
				<span class="step-counter" aria-hidden="true">01</span>
				<h3>Choose Your Event</h3>
				<p>Browse the roster of live events, check the schedule, and select the session you want to join.</p>
			</li>
			<li class="step-card">
				<span class="step-counter" aria-hidden="true">02</span>
				<h3>Submit Responses</h3>
				<p>Answer the specific organizer questions directly in the form — no username or password required.</p>
			</li>
			<li class="step-card">
				<span class="step-counter" aria-hidden="true">03</span>
				<h3>Instant Reservation</h3>
				<p>Your spot is immediately locked in. Free admission with no checkout steps or payment gates.</p>
			</li>
		</ol>
	</div>
</section>

<!-- ====================== SECTION 5: CINEMATIC CLOSING CTA ====================== -->
<section class="section-cta" id="register">
	<div class="shell">
		<div class="cta-master-card">
			<p class="cta-kicker">GET INVOLVED IN CASC4D3</p>
			<h2>Be part of the 43rd Computer Science Week.</h2>
			<p class="cta-summary">
				{#if data.openCount > 0}
					{data.openCount} {data.openCount === 1 ? 'event track is' : 'event event are'} accepting registrations right now. Claim your spot.
				{:else}
					The full event roster is ready. Discover all upcoming sessions and be first to register.
				{/if}
			</p>
			<div class="cta-buttons">
				<Button variant="white" size="lg" href="/events">Explore Full Schedule</Button>
			</div>
		</div>
	</div>
</section>

<style>
	/* ============================== CINEMATIC HERO ============================== */
	.hero-cinematic {
		position: relative;
		min-height: 100vh;
		min-height: 100dvh;
		height: 100vh;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(175deg, #1f1823 0%, #2b1f2e 40%, #341e2b 75%, #231a26 100%);
		color: #ffffff;
		overflow: hidden;
		padding-top: 5rem;
		padding-bottom: 1.75rem;
		box-sizing: border-box;
	}

	/* Atmospheric Backdrop */
	.hero-backdrop {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}
	.ambient-glow {
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
	.sakura-bloom-glow {
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
	/* 3D Rising Grid: each square is its own tile; only the tile under the
		cursor lifts toward the viewer (perspective + translateZ + glow). */
	.grid-3d {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		grid-template-rows: repeat(var(--rows), 1fr);
		perspective: 700px;
		mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0.95) 0%, transparent 82%);
		-webkit-mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0.95) 0%, transparent 82%);
	}
	.grid-cell {
		position: relative;
		border-right: 1px solid rgba(246, 227, 233, 0.05);
		border-bottom: 1px solid rgba(246, 227, 233, 0.05);
		background: rgba(246, 227, 233, 0.015);
		transition:
			transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
			background 0.2s ease,
			border-color 0.2s ease,
			filter 0.3s ease;
	}
	/* Extruded prism side (visible under the lifting front face) */
	.grid-cell::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 2px;
		background: linear-gradient(120deg, rgba(90, 20, 44, 0.4) 0%, rgba(166, 58, 92, 0.2) 55%, rgba(246, 227, 233, 0.04) 100%);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.22s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.grid-cell.active {
		z-index: 2;
		border-color: rgba(246, 227, 233, 0.28);
		background: radial-gradient(circle at center, rgba(194, 80, 114, 0.18) 0%, rgba(246, 227, 233, 0.05) 70%);
		transform: translateZ(var(--lift, 0px));
		filter: brightness(1.18);
	}
	.grid-cell.active::after {
		opacity: 1;
		transform: translate(7px, 11px) translateZ(calc(var(--lift, 0px) * -0.85));
	}

	/* Cursor Radial Light Aura */
	.cursor-aura {
		position: absolute;
		inset: 0;
		background: radial-gradient(420px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(194, 80, 114, 0.22) 0%, rgba(122, 31, 61, 0.09) 45%, transparent 75%);
		opacity: 0;
		transition: opacity 0.25s ease;
		pointer-events: none;
	}
	.cursor-aura.active {
		opacity: 1;
	}

	.sakura-branches {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	/* Pixel-Art Sakura Trees */
	.pixel-tree {
		position: absolute;
		bottom: 0;
		height: min(30vh, 320px);
		pointer-events: none;
		z-index: 1;
		filter: drop-shadow(0 14px 34px rgba(0, 0, 0, 0.5));
	}
	.tree-left {
		left: -1vw;
	}
	.tree-right {
		right: -1vw;
		transform: scaleX(-1);
	}
	.tree-left-mid {
		left: 9vw;
		height: min(22vh, 240px);
		opacity: 0.82;
	}
	.tree-right-mid {
		right: 9vw;
		height: min(22vh, 240px);
		opacity: 0.82;
		transform: scaleX(-1);
	}

	/* Sakura Wind Breeze: drifting gust streaks + fine wind particles */
	.sakura-wind {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 1;
	}
	.wind-gust {
		position: absolute;
		height: 7vh;
		overflow: visible;
		opacity: 0.7;
		filter: blur(0.6px);
		animation: windFlow ease-in-out infinite;
		will-change: transform, opacity;
	}
	.wind-gust path {
		stroke-dasharray: 500;
		stroke-dashoffset: 0;
		animation: gustFlow 3s ease-in-out infinite alternate;
	}
	.gust-1 { top: 14%; left: -32%; width: 52%; animation-duration: 12s; animation-delay: 0s; opacity: 0.55; }
	.gust-2 { top: 34%; left: -24%; width: 44%; animation-duration: 15s; animation-delay: 2.5s; opacity: 0.4; }
	.gust-3 { top: 56%; left: -36%; width: 58%; animation-duration: 13s; animation-delay: 5s; opacity: 0.5; }
	.gust-4 { top: 78%; left: -28%; width: 48%; animation-duration: 16s; animation-delay: 1.2s; opacity: 0.35; }

	.wind-part-frail {
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
	.wp-1 { top: 22%; left: -5%; animation-duration: 10s; animation-delay: 0s; }
	.wp-2 { top: 40%; left: -8%; animation-duration: 13s; animation-delay: 1.5s; }
	.wp-3 { top: 58%; left: -6%; animation-duration: 11s; animation-delay: 4s; }
	.wp-4 { top: 74%; left: -9%; animation-duration: 14s; animation-delay: 3s; }
	.wp-5 { top: 30%; left: -7%; animation-duration: 12s; animation-delay: 6s; }
	.wp-6 { top: 63%; left: -5%; animation-duration: 15s; animation-delay: 8s; }
	.wp-7 { top: 47%; left: -9%; animation-duration: 11s; animation-delay: 2s; }
	.wp-8 { top: 80%; left: -6%; animation-duration: 12.5s; animation-delay: 5.5s; }

	@keyframes windFlow {
		0% {
			transform: translateX(-2vw) translateY(0) rotate(-4deg) scaleX(0.6);
			opacity: 0;
		}
		10% {
			transform: translateX(8vw) translateY(-2vh) rotate(-3deg) scaleX(0.8);
			opacity: var(--wind-peak, 0.6);
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
			opacity: var(--wind-peak, 0.5);
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

	/* Drifting Pixel Petals Falling From the Trees */
	.sakura-petals-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 2;
	}
	.sakura-petal {
		position: absolute;
		top: -30px;
		opacity: 0.8;
		filter: drop-shadow(0 2px 4px rgba(122, 31, 61, 0.3));
		animation: petalFall linear infinite;
	}
	.sakura-petal svg {
		width: 100%;
		height: 100%;
		animation: petalSway ease-in-out infinite alternate;
	}

	.petal-1 { left: 5%; width: 14px; height: 14px; animation-duration: 11s; animation-delay: 0s; }
	.petal-2 { left: 13%; width: 17px; height: 17px; animation-duration: 13s; animation-delay: 2.5s; }
	.petal-3 { left: 21%; width: 12px; height: 12px; animation-duration: 10s; animation-delay: 5s; opacity: 0.65; }
	.petal-4 { left: 29%; width: 15px; height: 15px; animation-duration: 12s; animation-delay: 1.2s; }
	.petal-5 { left: 37%; width: 11px; height: 11px; animation-duration: 11.5s; animation-delay: 6.5s; opacity: 0.6; }
	.petal-6 { left: 45%; width: 14px; height: 14px; animation-duration: 14s; animation-delay: 3.5s; }
	.petal-7 { left: 53%; width: 16px; height: 16px; animation-duration: 12.5s; animation-delay: 8s; opacity: 0.75; }
	.petal-8 { left: 61%; width: 15px; height: 15px; animation-duration: 12s; animation-delay: 1s; }
	.petal-9 { left: 69%; width: 12px; height: 12px; animation-duration: 10.5s; animation-delay: 4s; opacity: 0.6; }
	.petal-10 { left: 77%; width: 17px; height: 17px; animation-duration: 13.5s; animation-delay: 2s; }
	.petal-11 { left: 84%; width: 14px; height: 14px; animation-duration: 11s; animation-delay: 9s; opacity: 0.8; }
	.petal-12 { left: 90%; width: 11px; height: 11px; animation-duration: 10s; animation-delay: 5.5s; opacity: 0.65; }
	.petal-13 { left: 95%; width: 16px; height: 16px; animation-duration: 12.5s; animation-delay: 7s; }
	.petal-14 { left: 42%; width: 13px; height: 13px; animation-duration: 11.5s; animation-delay: 10.5s; opacity: 0.7; }

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

	/* Central Hero Content */
	.hero-inner {
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		text-align: center;
		box-sizing: border-box;
	}
	.hero-content {
		max-width: 44rem;
		margin: auto auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.35rem 0.95rem;
		border-radius: 999px;
		background: rgba(166, 58, 92, 0.18);
		border: 1px solid rgba(194, 80, 114, 0.45);
		backdrop-filter: blur(8px);
		margin-bottom: 1.25rem;
	}
	.hero-badge-glow {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--rose-600);
		box-shadow: 0 0 10px var(--rose-600);
	}
	.hero-badge-text {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		color: var(--rose-100);
	}

	.hero-title {
		font-family: 'Macondo Swash Caps', var(--font-display);
		font-size: clamp(3rem, 7.5vw, 5.4rem);
		font-weight: 700;
		line-height: 0.98;
		letter-spacing: 0.04em;
		margin: 0 0 0.5rem;
		color: #ffffff;
		text-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
	}
	.hero-digit {
		display: inline-block;
		font-family: 'Press Start 2P', 'Courier New', monospace;
		font-weight: 400;
		font-size: 0.68em;
		line-height: 1;
		color: #ff7096;
		text-shadow: 0 0 12px rgba(194, 80, 114, 0.65), 0 2px 0 rgba(122, 31, 61, 0.9);
		transform: translateY(0.05em);
	}
	.hero-subtitle-line {
		display: block;
		font-family: 'Macondo Swash Caps', var(--font-body);
		font-size: clamp(1rem, 2.2vw, 1.35rem);
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--rose-100);
		margin-top: 0.35rem;
	}

	.hero-description {
		font-size: clamp(0.95rem, 1.6vw, 1.1rem);
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.82);
		max-width: 36rem;
		margin: 0.65rem 0 1.85rem;
	}

	.hero-action-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	/* Bottom Stat Bar */
	.hero-stat-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.75rem;
		flex-wrap: wrap;
		padding: 1.15rem 2rem;
		border-radius: 999px;
		background: rgba(43, 36, 48, 0.75);
		border: 1px solid rgba(255, 255, 255, 0.12);
		backdrop-filter: blur(14px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
	}
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
	}
	.stat-val {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 700;
		color: #ffffff;
		line-height: 1.2;
	}
	.stat-lbl {
		font-size: 0.74rem;
		color: rgba(255, 255, 255, 0.65);
		letter-spacing: 0.02em;
	}
	.stat-divider {
		width: 1px;
		height: 24px;
		background: rgba(255, 255, 255, 0.14);
	}

	/* Right Edge Minimal Section Indicator */
	.hero-edge-nav {
		position: absolute;
		right: 1.5rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		z-index: 5;
	}
	.edge-dot {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		text-decoration: none;
		opacity: 0.65;
		transition: opacity 0.15s ease, transform 0.15s ease;
	}
	.edge-dot:hover {
		opacity: 1;
		transform: translateX(-3px);
		text-decoration: none;
	}
	.edge-dot-mark {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--rose-600);
	}
	.edge-label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		color: var(--rose-100);
	}

	/* ============================== SECTION 1: INTRO ============================== */
	.section-intro {
		background: var(--paper);
		padding: clamp(5rem, 9vw, 7.5rem) 0;
		border-bottom: 1px solid var(--line);
	}
	.intro-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
		gap: clamp(2.5rem, 6vw, 4.5rem);
		align-items: center;
	}
	.intro-heading-col h2 {
		font-size: clamp(2.1rem, 4.5vw, 3rem);
		line-height: 1.15;
		margin: 0;
	}
	.intro-lead {
		font-size: 1.18rem;
		line-height: 1.65;
		color: var(--plum);
		font-weight: 500;
		margin: 0 0 1.25rem;
	}
	.intro-sub {
		font-size: 1rem;
		line-height: 1.7;
		color: var(--plum-soft);
		margin: 0;
	}

	/* ============================== SECTION 2: event ============================== */
	.section-event {
		padding: clamp(5rem, 9vw, 7.5rem) 0;
		background: var(--paper);
	}
	.track-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.75rem;
	}

	/* ============================== SECTION 3: PILLARS ============================== */
	.section-experience {
		background: var(--rose-050);
		border-block: 1px solid var(--line);
		padding: clamp(5rem, 9vw, 7.5rem) 0;
	}
	.pillars-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.75rem;
	}
	.pillar-card {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: 2.25rem 2rem;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}
	.pillar-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-hover);
	}
	.pillar-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
		border-radius: 14px;
		background: var(--rose-100);
		color: var(--rose-700);
		margin-bottom: 1.5rem;
	}
	.pillar-card h3 {
		font-size: 1.25rem;
		margin: 0 0 0.6rem;
		color: var(--plum);
	}
	.pillar-card p {
		margin: 0;
		color: var(--plum-soft);
		font-size: 0.95rem;
		line-height: 1.65;
	}

	/* ============================== SECTION 4: HOW IT WORKS ============================== */
	.section-howto {
		padding: clamp(5rem, 9vw, 7.5rem) 0;
		background: var(--paper);
	}
	.steps-flow {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.75rem;
		padding: 0;
		margin: 0;
	}
	.step-card {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: 2.25rem 2rem;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}
	.step-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-hover);
	}
	.step-counter {
		display: block;
		font-family: var(--font-display);
		font-size: 2.8rem;
		font-weight: 700;
		line-height: 1;
		color: var(--rose-100);
		margin-bottom: 1.25rem;
		transition: color 0.15s ease;
	}
	.step-card:hover .step-counter {
		color: var(--rose-600);
	}
	.step-card h3 {
		font-size: 1.2rem;
		margin: 0 0 0.5rem;
		color: var(--plum);
	}
	.step-card p {
		margin: 0;
		color: var(--plum-soft);
		font-size: 0.95rem;
		line-height: 1.65;
	}

	/* ============================== SECTION 5: CTA ============================== */
	.section-cta {
		padding: clamp(4rem, 8vw, 6.5rem) 0;
		background: var(--paper);
	}
	.cta-master-card {
		background: linear-gradient(135deg, var(--rose-900), var(--rose-800));
		border-radius: 20px;
		text-align: center;
		padding: clamp(3.5rem, 8vw, 5.5rem) clamp(1.5rem, 6vw, 4rem);
		box-shadow: 0 24px 60px rgba(122, 31, 61, 0.28);
	}
	.cta-kicker {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		color: rgba(255, 255, 255, 0.75);
		margin: 0 0 1rem;
	}
	.cta-master-card h2 {
		color: #ffffff;
		font-size: clamp(2.1rem, 5vw, 3.2rem);
		margin: 0 0 1rem;
		line-height: 1.15;
	}
	.cta-summary {
		color: rgba(255, 255, 255, 0.88);
		max-width: 44ch;
		margin: 0 auto 2.25rem;
		font-size: 1.1rem;
		line-height: 1.65;
	}
	.cta-buttons {
		display: flex;
		justify-content: center;
	}

	/* ============================== RESPONSIVE BREAKPOINTS ============================== */
	@media (max-width: 900px) {
		.hero-cinematic {
			min-height: auto;
			padding-top: 6rem;
			padding-bottom: 4.5rem;
		}
		.pixel-tree {
			height: min(22vh, 200px);
		}
		.hero-edge-nav {
			display: none;
		}
		.intro-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}

	@media (max-width: 720px) {
		.pixel-tree {
			display: none;
		}
		.hero-stat-bar {
			border-radius: var(--radius);
			gap: 1.25rem;
			padding: 1.25rem;
		}
		.stat-divider {
			display: none;
		}
		.stat-item {
			width: calc(50% - 0.75rem);
		}
	}

	@media (max-width: 520px) {
		.hero-action-row :global(.btn) {
			width: 100%;
		}
		.hero-stat-bar .stat-item {
			width: 100%;
		}
	}

	/* ============================== AMBIENT MUSIC TOGGLE ============================== */
	.music-toggle {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 60;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 46px;
		height: 46px;
		border-radius: 999px;
		border: 1px solid rgba(255, 199, 218, 0.4);
		background: rgba(20, 8, 16, 0.55);
		backdrop-filter: blur(8px);
		color: #ffc7da;
		cursor: pointer;
		transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease, opacity 0.25s ease;
	}
	.music-toggle:hover {
		background: rgba(194, 80, 114, 0.35);
		border-color: rgba(255, 199, 218, 0.7);
		transform: translateY(-2px);
	}
	.music-toggle:active {
		transform: translateY(0);
	}
	.music-bars {
		display: inline-flex;
		align-items: flex-end;
		gap: 2px;
		height: 16px;
	}
	.music-bars i {
		display: block;
		width: 3px;
		border-radius: 2px;
		background: #ffc7da;
		animation: musicBounce 0.9s ease-in-out infinite;
	}
	.music-bars i:nth-child(1) { height: 6px; animation-delay: 0s; }
	.music-bars i:nth-child(2) { height: 14px; animation-delay: 0.15s; }
	.music-bars i:nth-child(3) { height: 9px; animation-delay: 0.3s; }
	.music-bars i:nth-child(4) { height: 12px; animation-delay: 0.45s; }

	@keyframes musicBounce {
		0%, 100% { transform: scaleY(0.5); opacity: 0.6; }
		50% { transform: scaleY(1); opacity: 1; }
	}

	@media (max-width: 520px) {
		.music-toggle {
			bottom: 1rem;
			right: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sakura-petal,
		.sakura-petal svg,
		.wind-gust,
		.wind-gust path,
		.wind-part-frail {
			animation: none !important;
		}
		.sakura-wind {
			opacity: 0;
		}
		.music-bars i {
			animation: none !important;
		}
		.grid-cell,
		.grid-cell.active,
		.grid-cell::after {
			transform: none !important;
			transition: none !important;
		}
	}
</style>