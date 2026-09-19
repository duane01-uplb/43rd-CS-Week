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
</script>

<svelte:head>
	<title>CASC4D3</title>
</svelte:head>

<!-- ============================== CINEMATIC HERO ============================== -->
<section class="hero-cinematic" aria-label="Hero Introduction">
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
		align-items: center;
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
		.hero-edge-nav {
			display: none;
		}
		.intro-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}

	@media (max-width: 720px) {
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
		.music-bars i {
			animation: none !important;
		}
	}
</style>