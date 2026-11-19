<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import { program } from '$lib/program';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import MusicIcon from '@lucide/svelte/icons/music';
	import AudioLinesIcon from '@lucide/svelte/icons/audio-lines';
	import { reducedMotion } from '$lib/motion';
	import { createScrollSound } from '$lib/scroll-sound';

	let { data } = $props();

	const AUDIO_SRC = '/florews-sakura-325896.mp3';
	let soundtrack: HTMLAudioElement | undefined;
	let scrollAudio: AudioContext | undefined;
	let playScrollSound: ((intensity: number) => void) | undefined;
	let soundEnabled = $state(false);

	function stopSound() {
		soundEnabled = false;
		soundtrack?.pause();
		soundtrack = undefined;
		playScrollSound = undefined;
		void scrollAudio?.close().catch(() => {});
		scrollAudio = undefined;
	}

	function toggleSound() {
		if (soundEnabled) {
			stopSound();
			return;
		}

		const audio = new Audio(AUDIO_SRC);
		audio.loop = true;
		audio.volume = 0.7;
		soundtrack = audio;
		soundEnabled = true;
		void audio.play().catch(() => {
			if (soundtrack === audio) stopSound();
		});

		const AudioContextClass =
			window.AudioContext ||
			(window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (AudioContextClass && !reducedMotion()) {
			try {
				scrollAudio = new AudioContextClass();
				playScrollSound = createScrollSound(scrollAudio);
				void scrollAudio.resume().catch(() => {});
			} catch {
				// The soundtrack still works when Web Audio is unavailable.
			}
		}
	}

	const eventTime = new Intl.DateTimeFormat('en-PH', {
		weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Manila'
	});
	let passedHero = false;
	function handleScroll() {
		const past = window.scrollY > window.innerHeight * 0.5;
		if (past && !passedHero) playScrollSound?.(0.6);
		passedHero = past;
	}
	onMount(() => stopSound);
</script>

<svelte:window onscroll={handleScroll} />

<svelte:head>
	<title>CASC4D3</title>
</svelte:head>

<!-- ============================== CINEMATIC HERO ============================== -->
<section class="hero-cinematic" aria-label="Hero Introduction">
	<div class="petal-sweep" aria-hidden="true"><i></i><i></i><i></i></div>
	<div class="hero-inner shell">
		<div class="hero-content">
			<p class="hero-kicker">43rd Computer Science Week</p>

			<h1 class="hero-title">
				CASC<span class="hero-digit">4</span>D<span class="hero-digit">3</span>
				<span class="hero-subtitle-line">Towards a Resilient Human-Centered Computing</span>
			</h1>

			<p class="hero-description">
				The Annual Flagship Event of UPLB Computer Science Society.
				Explore the week’s events and register without an account.
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

		<div class="next-event">
			{#await data.summary}
				<a href="/events">Browse the event schedule →</a>
			{:then { upcoming }}
				{#if upcoming.length}
					{@const next = upcoming[0]}
					<span class="next-label">Next open event</span>
					<time datetime={new Date(next.startAt).toISOString()}>{eventTime.format(new Date(next.startAt))} · Manila</time>
					<a href={"/events/" + next.id}>{next.title} <span aria-hidden="true">→</span></a>
				{:else}
					<a href="/events">Browse the event schedule →</a>
				{/if}
			{:catch}
				<a href="/events">Browse the event schedule →</a>
			{/await}
		</div>
	</div>

	<button
		class="music-toggle"
		type="button"
		onclick={toggleSound}
		aria-pressed={soundEnabled}
		title="Toggle ambient music and scroll sounds"
	>
		{#if soundEnabled}
			<AudioLinesIcon size={18} strokeWidth={2} aria-hidden="true" />
		{:else}
			<MusicIcon size={18} strokeWidth={2} aria-hidden="true" />
		{/if}
		Sound
	</button>

</section>

<div class="home-body">
<!-- ====================== SECTION 1: IDENTITY & OVERVIEW ====================== -->
<section class="section-intro" id="intro">
	<div class="shell">
		<div class="intro-grid">
			<div class="intro-heading-col">
				<p class="eyebrow write-copy">The 43rd Celebration</p>
				<h2
					class="writing-heading"
					aria-label="Where computing curiosity cascades into impact."
				>
					<span class="write-line" aria-hidden="true">Where</span>
					<span class="write-line" aria-hidden="true">computing</span>
					<span class="write-line" aria-hidden="true">curiosity</span>
					<span class="write-line" aria-hidden="true">cascades</span>
					<span class="write-line" aria-hidden="true">into impact.</span>
				</h2>
			</div>
			<div class="intro-body-col">
				<p class="intro-lead write-copy">
					CASC4D3 honors the legacy of Computer Science at UPLB by creating an open arena for everyone — from first-year explorers to senior systems architects.
				</p>
				<p class="intro-sub write-copy">
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
				<p class="lede">Explore upcoming events accepting registrations.</p>
			</div>
			<a href="/events" class="arrow-link">
				<span>View complete event schedule</span>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M5 12h14" />
					<path d="m12 5 7 7-7 7" />
				</svg>
			</a>
		</div>

		{#await data.summary}
			<LoadingScreen label="Loading upcoming events" />
			<noscript><a href="/?render=full#event">Load upcoming events</a></noscript>
		{:then { upcoming }}
			{#if upcoming.length === 0}
				<div class="empty-card">
					<h3>No events currently accepting registrations</h3>
					<p>Organizers are preparing the next batch of sessions and challenges. Check back soon.</p>
					<div style="margin-top: 1.25rem;">
						<Button variant="ghost" size="sm" href="/events">Browse full event catalog</Button>
					</div>
				</div>
			{:else}
				<div class="track-grid">
					{#each upcoming as event (event.id)}
						<EventCard {event} variant="track" />
					{/each}
				</div>
			{/if}
		{:catch}
			<div class="empty-card">
				<p>Upcoming events couldn’t load. <a href="/events">Open the event roster</a>.</p>
			</div>
		{/await}
	</div>
</section>

<!-- ====================== SECTION 3: THREE EXPERIENCE PILLARS ====================== -->
<section class="section-experience" id="experience" aria-labelledby="program-title">
	<div class="shell">
		<h2 id="program-title">Explore the program</h2>
		<div class="program-grid">
			{#each program as area (area.title)}
				<article class="program-feature">
					<img src={area.image} alt="" loading="lazy" decoding="async" />
					<h3>{area.title}</h3>
					<p>{area.description}</p>
					{#await data.summary}
						<a href="/events">Browse the schedule <span aria-hidden="true">→</span></a>
					{:then { programEvents }}
						{@const match = programEvents.find((event) => area.aliases.includes(event.title.trim().toLowerCase()))}
						{#if match}
							<a href={`/events/${match.id}`} aria-label={`View ${area.title} event details`}>View event <span aria-hidden="true">→</span></a>
						{:else}
							<a href="/events">Browse the schedule <span aria-hidden="true">→</span></a>
						{/if}
					{:catch}
						<a href="/events">Browse the schedule <span aria-hidden="true">→</span></a>
					{/await}
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ====================== SECTION 4: HOW IT WORKS ====================== -->
<section class="section-howto" id="how-it-works">
	<div class="shell">
		<div class="section-head">
			<h2>How to register</h2>
			<p class="lede">Choose an event and follow its registration instructions.</p>
		</div>

		<ol class="steps-flow">
			<li class="step-card">
				<span class="step-counter" aria-hidden="true">
					<span class="step-num">01</span>
				</span>
				<div class="step-body">
					<h3>Choose Your Event</h3>
					<p>Browse the roster of live events, check the schedule, and select the session you want to join.</p>
				</div>
			</li>
			<li class="step-card">
				<span class="step-counter" aria-hidden="true">
					<span class="step-num">02</span>
				</span>
				<div class="step-body">
					<h3>Submit Responses</h3>
					<p>Answer the specific organizer questions directly in the form — no username or password required.</p>
				</div>
			</li>
			<li class="step-card">
				<span class="step-counter" aria-hidden="true">
					<span class="step-num">03</span>
				</span>
				<div class="step-body">
					<h3>Check your confirmation</h3>
					<p>Forms on this site confirm your seat when you submit successfully. For external forms, follow the organizer’s confirmation instructions.</p>
				</div>
			</li>
		</ol>
	</div>
</section>

<!-- ====================== SECTION 5: CINEMATIC CLOSING CTA ====================== -->
<section class="section-cta" id="register">
	<div class="shell">
		<div class="cta-master-card">
			<h2>Be part of the 43rd Computer Science Week.</h2>
			<p class="cta-summary">
				{#await data.summary}
					Explore the event roster for registration details.
				{:then { openCount }}
					{#if openCount > 0}
						{openCount} {openCount === 1 ? 'event track is' : 'events are'} accepting registrations right now. Claim your spot.
					{:else}
						The full event roster is ready. Discover all upcoming sessions and be first to register.
					{/if}
				{:catch}
					Explore the event roster for registration details.
				{/await}
			</p>
			<div class="cta-buttons">
				<Button variant="white" size="lg" href="/events">Explore Full Schedule</Button>
			</div>
		</div>
	</div>
</section>
</div>

<style>
	/* ============================== CINEMATIC HERO ============================== */
	.hero-cinematic {
		position: relative;
		isolation: isolate;
		min-height: 100vh;
		min-height: 100dvh;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: stretch;
		background: transparent;
		color: #ffffff;
		overflow: hidden;
		padding-top: 5rem;
		padding-bottom: 2rem;
		box-sizing: border-box;
	}

	/* Atmospheric Backdrop */
	/* (moved to +layout.svelte as the site-wide fixed sakura backdrop) */
	.hero-inner {
		position: relative;
		z-index: 2;
		width: 100%;
		flex: 1;
		gap: 1.25rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		text-align: left;
		box-sizing: border-box;
		transform-origin: 50% 22%;
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
		color: var(--rose-on-dark);
	}

	.hero-title {
		font-family: 'Macondo Swash Caps', var(--font-display);
		font-size: clamp(3rem, 7.5vw, 5.4rem);
		font-weight: 400;
		line-height: 0.98;
		letter-spacing: 0.04em;
		margin: 0 0 0.5rem;
		color: #ffffff;
		text-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
		text-transform: none;
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

	.next-event {
		width: min(100%, 43rem);
		display: grid;
		gap: 0.3rem;
		border-top: 1px solid var(--muted-on-dark);
		padding-top: 0.9rem;
	}
	.next-label, .next-event time {
		font: 0.8rem/1.5 var(--font-display);
		color: var(--rose-100);
	}
	.next-event a {
		width: fit-content;
		color: white;
		font-size: clamp(1.12rem, 3vw, 1.6rem);
		font-weight: 600;
		overflow-wrap: anywhere;
	}
	.petal-sweep { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
	.petal-sweep i {
		position: absolute;
		top: 22%; right: 12%; width: 9px; height: 14px;
		border-radius: 70% 15% 65% 35%;
		background: var(--rose-on-dark);
		transform: rotate(28deg);
	}
	.petal-sweep i:nth-child(2) { top: 28%; right: 16%; }
	.petal-sweep i:nth-child(3) { top: 32%; right: 9%; }
	@media (prefers-reduced-motion: no-preference) {
		.petal-sweep i { animation: settle 750ms ease-out both; }
		.petal-sweep i:nth-child(2) { animation-delay: 75ms; }
		.petal-sweep i:nth-child(3) { animation-delay: 140ms; }
	}
	@keyframes settle {
		from { transform: translate(3rem, -2rem) rotate(-40deg); opacity: 0; }
		to { transform: rotate(28deg); opacity: 1; }
	}

	.home-body {
		position: relative;
		z-index: 5;
		margin-top: 0;
		border-radius: 0;
		overflow: clip;
		box-shadow: none;
	}
	.section-event :global(.badge-open .badge-dot) {
		animation: none;
	}
	.home-body::before {
		content: '';
		position: absolute;
		top: 0;
		left: 24%;
		right: 24%;
		height: 1px;
		z-index: 6;
		pointer-events: none;
		background: linear-gradient(90deg, transparent, rgba(194, 80, 114, 0.8), transparent);
	}

	/* ============================== SECTION 1: INTRO ============================== */
	.section-intro {
		background: var(--paper);
		padding: clamp(3rem, 6vw, 4.75rem) 0 clamp(5rem, 9vw, 7.5rem);
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
	.write-line,
	.write-copy {
		clip-path: inset(0 0 0 0);

	}
	.write-line {
		display: block;
		width: max-content;
		max-width: 100%;
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
		perspective: 1200px;
	}

	/* ============================== SECTION 3: PILLARS ============================== */
	.section-experience {
		background: var(--plum);
		color: var(--paper);
		padding-block: clamp(3rem, 7vw, 6rem);
	}
	.section-experience h2 {
		margin: 0 0 1.5rem;
		color: var(--paper);
		font-size: clamp(1.8rem, 4vw, 3rem);
	}
	.program-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(1rem, 3vw, 2rem);
	}
	.program-feature { display: flex; flex-direction: column; align-items: flex-start; }
	.program-feature img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		border-radius: var(--radius-sm);
	}
	.program-feature h3 {
		margin: 1rem 0 0.4rem;
		color: var(--paper);
		font-size: clamp(1.15rem, 2.2vw, 1.65rem);
	}
	.program-feature p { margin: 0 0 0.75rem; line-height: 1.55; }
	.program-feature a {
		margin-top: auto;
		padding-block: 0.4rem;
		color: var(--rose-on-dark);
		font-weight: 600;
	}
	@media (max-width: 680px) {
		.program-grid { grid-template-columns: 1fr; gap: 2rem; }
		.program-feature img { aspect-ratio: 3 / 2; object-position: center 42%; }
	}

	/* ============================== SECTION 4: HOW IT WORKS ============================== */
	.section-howto {
		padding: clamp(5rem, 9vw, 7.5rem) 0;
		background: var(--plum);
	}
	.section-howto h2,
	.section-howto h3 {
		color: #ffffff;
	}
	.section-howto :global(.lede) {
		color: rgba(255, 255, 255, 0.62);
	}

	/* ── Container ────────────────────────────── */
	.steps-flow {
		list-style: none;
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
		padding: 0;
		margin: 0;
		max-width: 44rem;
		position: relative;
	}

	/* ── Animated connector line ──────────────── */
	.steps-flow::before {
		content: '';
		position: absolute;
		left: 1.3rem;
		top: 2rem;
		bottom: 2rem;
		width: 2px;
		transform: translateX(-50%);
		z-index: 0;
		pointer-events: none;
		background: linear-gradient(
			180deg,
			rgba(255, 156, 189, 0.55) 0%,
			rgba(194, 80, 114, 0.35) 60%,
			transparent 100%
		);
		transform: translateX(-50%);
	}
	.step-card {
		background: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		padding: 1.1rem 1.1rem 1.1rem 0;
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: 1.5rem;
		align-items: start;
		position: relative;
		z-index: 1;
	}
	.step-counter {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.6rem;
		height: 2.6rem;
		z-index: 2;
		margin-top: 0.05rem;
		flex-shrink: 0;
	}
	.step-num {
		position: relative;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 1.5px solid rgba(255, 199, 218, 0.35);
		background: var(--plum);
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 700;
		line-height: 1;
		color: #ffffff;
		transition:
			background 0.35s ease,
			border-color 0.35s ease,
			box-shadow 0.35s ease,
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.step-body {
		padding-top: 0.1rem;
	}
	.step-card h3 {
		font-size: 1.25rem;
		margin: 0 0 0.4rem;
		color: #ffffff;
		transition: color 0.25s ease;
	}
	.step-card:hover h3 {
		color: #ffc7da;
	}
	.step-card p {
		margin: 0;
		color: rgba(255, 255, 255, 0.62);
		font-size: 0.95rem;
		line-height: 1.65;
	}

	/* ── Keyframes ────────────────────────────── */
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
		position: relative;
		overflow: hidden;
		isolation: isolate;
		transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease;

	}
	.cta-master-card::before {
		content: '';
		position: absolute;
		inset: -20%;
		background: radial-gradient(circle at 75% 30%, rgba(255, 199, 218, 0.28), transparent 50%),
					radial-gradient(circle at 20% 80%, rgba(122, 31, 61, 0.35), transparent 45%);
		pointer-events: none;
		z-index: 0;

	}
	.cta-master-card > * {
		position: relative;
		z-index: 1;
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
	.cta-buttons :global(.btn) {
		transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease;
	}
	.cta-buttons :global(.btn:hover) {
		transform: translateY(-3px) scale(1.02);
		box-shadow: 0 12px 24px -4px rgba(60, 10, 24, 0.35);
	}

	/* ============================== RESPONSIVE BREAKPOINTS ============================== */
	@media (max-width: 900px) {
		.hero-cinematic {
			height: auto;
			min-height: 100svh;
			padding-top: 6rem;
			padding-bottom: 4.5rem;
		}
		.intro-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}

	@media (max-width: 520px) {
		.hero-action-row :global(.btn) {
			width: 100%;
		}
		.music-toggle {
			bottom: 1rem;
			right: 1rem;
		}
	}

	/* ============================== SOUND TOGGLE ============================== */
	.music-toggle {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 60;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding-inline: 0.8rem;
		height: 46px;
		border-radius: 999px;
		border: 1px solid rgba(255, 199, 218, 0.4);
		background: rgba(20, 8, 16, 0.55);
		backdrop-filter: blur(8px);
		color: #ffc7da;
		font: inherit;
		cursor: pointer;
		transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
	}
	.music-toggle:hover {
		background: rgba(194, 80, 114, 0.35);
		border-color: rgba(255, 199, 218, 0.7);
		transform: translateY(-2px);
	}
	.music-toggle:active {
		transform: translateY(0);
	}

</style>
