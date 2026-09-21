<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { gsap } from 'gsap';
	import MusicIcon from '@lucide/svelte/icons/music';
	import AudioLinesIcon from '@lucide/svelte/icons/audio-lines';

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

	onMount(() => {
		if (typeof window === 'undefined') return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const content = document.querySelector('.hero-content');
		const stats = document.querySelector('.hero-stat-bar');
		if (content) {
			gsap.fromTo(content, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' });
		}
		if (stats) {
			gsap.fromTo(stats, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power2.out' });
		}
	});

	onDestroy(() => {
		audio?.pause();
		audio = undefined;
	});
</script>

<svelte:head>
	<title>CASC4D3</title>
</svelte:head>

<!-- ============================== CINEMATIC HERO ============================== -->
<section class="hero-cinematic" aria-label="Hero Introduction">
	<!-- Central Hero Overlay Content -->
	<div class="hero-inner shell">
		<div class="hero-content">
			<p class="hero-kicker">43rd Computer Science Week</p>

			<h1 class="hero-title">
				CASC<span class="hero-digit">4</span>D<span class="hero-digit">3</span>
				<span class="hero-subtitle-line">Towards a Resilient Human-Centered Computing</span>
			</h1>

			<p class="hero-description">
				The Annual Flagship Event of UPLB Computer Science Society.
				Register without an account. Slots lock in when organizers confirm.
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
					<span>See the schedule</span>
				</Button>
			</div>
		</div>

		<!-- Bottom Metadata & Stat Bar -->
		<div class="hero-stat-bar">
			<div class="stat-item">
				<span class="stat-val">{data.openCount}</span>
				<span class="stat-lbl">Open events</span>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<span class="stat-val">No account</span>
				<span class="stat-lbl">Required</span>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<span class="stat-val">43rd</span>
				<span class="stat-lbl">Edition</span>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<span class="stat-val">UPLB</span>
				<span class="stat-lbl">ComSci Soc</span>
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
			<AudioLinesIcon size={18} strokeWidth={2} />
		{:else}
			<MusicIcon size={18} strokeWidth={2} />
		{/if}
	</button>
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
					No gatekeeping. Just passion for algorithms, interfaces, design challenges, and community.
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
				<p>Your spot is locked in as soon as the organizers confirm your registration.</p>
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
					{data.openCount} {data.openCount === 1 ? 'event track is' : 'events are'} accepting registrations right now. Claim your spot.
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
		align-items: stretch;
		background: transparent;
		color: #ffffff;
		overflow: hidden;
		padding-top: 5rem;
		padding-bottom: 1.75rem;
		box-sizing: border-box;
	}

	/* Atmospheric Backdrop */
	/* (moved to +layout.svelte as the site-wide fixed sakura backdrop) */
	.hero-inner {
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		text-align: left;
		box-sizing: border-box;
	}
	.hero-content {
		max-width: 46rem;
		margin: auto 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.hero-kicker {
		margin: 0 0 1.1rem;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--rose-600);
	}

	.hero-title {
		font-family: var(--font-display);
		font-size: clamp(2.8rem, 7vw, 5.2rem);
		font-weight: 700;
		line-height: 0.92;
		letter-spacing: -0.01em;
		margin: 0 0 0.5rem;
		color: #ffffff;
		text-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
		text-transform: uppercase;
	}
	.hero-digit {
		display: inline-block;
		font-family: 'Press Start 2P', 'Courier New', monospace;
		font-weight: 400;
		font-size: 0.68em;
		line-height: 1;
		color: var(--rose-600);
		text-shadow: 0 0 12px rgba(194, 80, 114, 0.65), 0 2px 0 rgba(122, 31, 61, 0.9);
		transform: translateY(0.05em);
		text-transform: none;
	}
	.hero-subtitle-line {
		display: block;
		font-family: var(--font-body);
		font-size: clamp(0.95rem, 1.8vw, 1.2rem);
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: none;
		color: var(--rose-100);
		margin-top: 0.55rem;
	}

	.hero-description {
		font-size: clamp(0.95rem, 1.6vw, 1.12rem);
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.82);
		max-width: 34rem;
		margin: 0.85rem 0 1.75rem;
	}

	.hero-action-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	/* Bottom Stat Bar */
	.hero-stat-bar {
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
		gap: 2.25rem;
		flex-wrap: wrap;
		padding: 0 0 0.35rem;
		border-radius: 0;
		background: transparent;
		border: 0;
		backdrop-filter: none;
		box-shadow: none;
	}
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.2rem;
	}
	.stat-val {
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 700;
		color: #ffffff;
		line-height: 1.1;
	}
	.stat-lbl {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: rgba(255, 255, 255, 0.55);
	}
	.stat-divider {
		width: 1px;
		height: 28px;
		background: rgba(255, 255, 255, 0.16);
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
		font-size: clamp(2.4rem, 5vw, 3.6rem);
		line-height: 1.05;
		letter-spacing: -0.01em;
		text-transform: uppercase;
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
		background: var(--plum);
		border-block: 0;
		padding: clamp(5rem, 9vw, 7.5rem) 0;
		color: rgba(255, 255, 255, 0.78);
	}
	.section-experience :global(.eyebrow) {
		color: var(--rose-600);
	}
	.section-experience h2,
	.section-experience .pillar-card h3 {
		color: #ffffff;
	}
	.section-experience :global(.lede) {
		color: rgba(255, 255, 255, 0.62);
	}
	.pillars-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.25rem;
	}
	.pillar-card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-sm);
		box-shadow: none;
		padding: 2.1rem 1.75rem;
	}
	.pillar-card p {
		margin: 0;
		color: rgba(255, 255, 255, 0.62);
		font-size: 0.95rem;
		line-height: 1.65;
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
		color: #ffffff;
	}

	/* ============================== SECTION 4: HOW IT WORKS ============================== */
	.section-howto {
		padding: clamp(5rem, 9vw, 7.5rem) 0;
		background: var(--plum);
	}
	.section-howto :global(.eyebrow) {
		color: var(--rose-600);
	}
	.section-howto h2,
	.section-howto h3 {
		color: #ffffff;
	}
	.section-howto :global(.lede) {
		color: rgba(255, 255, 255, 0.62);
	}
	.steps-flow {
		list-style: none;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.75rem;
		padding: 0;
		margin: 0;
		max-width: 42rem;
	}
	.step-card {
		background: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		padding: 0;
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: 1.25rem;
		row-gap: 0.35rem;
	}
	.step-counter {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		grid-row: 1 / span 2;
		width: 2.4rem;
		height: 2.4rem;
		border: 1px solid rgba(255, 255, 255, 0.22);
		font-family: var(--font-display);
		font-size: 0.82rem;
		font-weight: 700;
		line-height: 1;
		color: #ffffff;
		margin: 0.15rem 0 0;
	}
	.step-card h3 {
		font-size: 1.35rem;
		margin: 0;
		color: #ffffff;
	}
	.step-card p {
		margin: 0;
		color: rgba(255, 255, 255, 0.62);
		font-size: 0.95rem;
		line-height: 1.65;
	}

	/* ============================== SECTION 5: CTA ============================== */
	.section-cta {
		padding: clamp(4rem, 8vw, 6.5rem) 0;
		background: var(--paper);
	}
	.cta-master-card {
		background: var(--rose-700);
		border-radius: var(--radius-sm);
		text-align: left;
		padding: clamp(3rem, 7vw, 4.5rem) clamp(1.5rem, 5vw, 3rem);
		box-shadow: none;
	}
	.cta-kicker {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		color: rgba(255, 255, 255, 0.78);
		margin: 0 0 1rem;
	}
	.cta-master-card h2 {
		color: #ffffff;
		font-size: clamp(2rem, 5vw, 3.1rem);
		margin: 0 0 1rem;
		line-height: 1.05;
		text-transform: uppercase;
		letter-spacing: -0.01em;
	}
	.cta-summary {
		color: rgba(255, 255, 255, 0.88);
		max-width: 48ch;
		margin: 0 0 1.75rem;
		font-size: 1.05rem;
		line-height: 1.65;
	}
	.cta-buttons {
		display: flex;
		justify-content: flex-start;
	}

	/* ============================== RESPONSIVE BREAKPOINTS ============================== */
	@media (max-width: 900px) {
		.hero-cinematic {
			min-height: auto;
			padding-top: 6rem;
			padding-bottom: 4.5rem;
		}
		.intro-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}

	@media (max-width: 720px) {
		.hero-stat-bar {
			gap: 1.25rem;
			padding: 0;
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
		.music-toggle {
			bottom: 1rem;
			right: 1rem;
			width: 42px;
			height: 42px;
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
		.music-bars i {
			animation: none !important;
		}
	}
</style>