<script lang="ts">
	let { data } = $props();

	const format = (date: Date) =>
		new Intl.DateTimeFormat('en-PH', {
			dateStyle: 'medium',
			timeStyle: 'short',
			timeZone: 'Asia/Manila'
		}).format(new Date(date));

	// Mouse parallax tracking for the central computational artifact
	let mouseX = $state(0);
	let mouseY = $state(0);

	function handleMouseMove(e: MouseEvent) {
		if (typeof window !== 'undefined') {
			const { innerWidth, innerHeight } = window;
			mouseX = (e.clientX / innerWidth - 0.5) * 20; // range: -10 to +10
			mouseY = (e.clientY / innerHeight - 0.5) * 20; // range: -10 to +10
		}
	}
</script>

<svelte:window onmousemove={handleMouseMove} />

<svelte:head>
	<title>CASC4D3 — The 43rd Computer Science Week | UPLB</title>
</svelte:head>

<!-- ============================== CINEMATIC HERO ============================== -->
<section class="hero-cinematic" aria-label="Hero Introduction">
	<!-- Atmospheric Deep Background with Grid & Ambient Light -->
	<div class="hero-backdrop" aria-hidden="true">
		<div class="ambient-glow"></div>
		<div class="ambient-grid"></div>
	</div>

	<!-- Central Dominant Computational Visual Focus -->
	<div
		class="hero-focal-stage"
		style={`transform: translate3d(${mouseX * 0.75}px, ${mouseY * 0.75}px, 0);`}
		aria-hidden="true"
	>
		<svg
			class="hero-artifact"
			viewBox="0 0 540 540"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<radialGradient id="artifactCoreGrad" cx="35%" cy="30%" r="80%">
					<stop offset="0%" stop-color="#c25072" />
					<stop offset="65%" stop-color="#a63a5c" />
					<stop offset="100%" stop-color="#7a1f3d" />
				</radialGradient>
				<radialGradient id="artifactGlowGrad" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stop-color="#c25072" stop-opacity="0.35" />
					<stop offset="50%" stop-color="#a63a5c" stop-opacity="0.12" />
					<stop offset="100%" stop-color="#2b2430" stop-opacity="0" />
				</radialGradient>
				<linearGradient id="orbitalStrokeGrad" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stop-color="#c25072" stop-opacity="0.8" />
					<stop offset="50%" stop-color="#a63a5c" stop-opacity="0.4" />
					<stop offset="100%" stop-color="#f6e3e9" stop-opacity="0.1" />
				</linearGradient>
			</defs>

			<!-- Outer Ambient Radiation -->
			<circle cx="270" cy="270" r="230" fill="url(#artifactGlowGrad)" />
			<circle cx="270" cy="270" r="215" stroke="#c25072" stroke-opacity="0.2" stroke-width="1.2" stroke-dasharray="3 9" />
			<circle cx="270" cy="270" r="185" stroke="url(#orbitalStrokeGrad)" stroke-width="1.5" />
			<circle cx="270" cy="270" r="145" stroke="#a63a5c" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="5 10" class="spin-slow" />
			<circle cx="270" cy="270" r="105" stroke="#c25072" stroke-opacity="0.6" stroke-width="1.5" />

			<!-- Computational Bus Lines & Logic Nodes -->
			<g stroke="#c25072" stroke-opacity="0.7" stroke-width="1.8" stroke-linecap="round">
				<path d="M270 270 h120 v68" />
				<path d="M270 270 h-130 v-80" />
				<path d="M270 270 v140" />
				<path d="M270 200 v-70" />
				<path d="M270 270 v-120 h-60" />
				<path d="M270 270 l90 -90 h45" />
				<path d="M270 270 l-85 85 h-45" />
			</g>

			<!-- Circuit Terminus Nodes -->
			<g fill="#2b2430" stroke="#f6e3e9" stroke-width="2">
				<circle cx="390" cy="270" r="6" />
				<circle cx="390" cy="338" r="5" />
				<circle cx="140" cy="270" r="6" />
				<circle cx="140" cy="190" r="5" />
				<circle cx="270" cy="410" r="6" />
				<circle cx="270" cy="130" r="6" />
				<circle cx="210" cy="150" r="5" />
				<circle cx="405" cy="180" r="5.5" />
				<circle cx="140" cy="355" r="5.5" />
			</g>

			<!-- Concentric Central Core Node -->
			<circle cx="270" cy="270" r="42" fill="url(#artifactCoreGrad)" class="pulse-core" />
			<circle cx="270" cy="270" r="34" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5" />
			<circle cx="258" cy="258" r="10" fill="#ffffff" fill-opacity="0.85" />
		</svg>
	</div>

	<!-- Central Hero Overlay Content -->
	<div class="hero-inner shell">
		<div class="hero-content">
			<div class="hero-badge">
				<span class="hero-badge-glow" aria-hidden="true"></span>
				<span class="hero-badge-text">43RD COMPUTER SCIENCE WEEK · UPLB</span>
			</div>

			<h1 class="hero-title">
				CASC4D3
				<span class="hero-subtitle-line">The 43rd Computer Science Week</span>
			</h1>

			<p class="hero-description">
				The flagship annual convergence of computing culture, technical workshops, and friendly contests. Free registration for all university students, alumni, and tech enthusiasts.
			</p>

			<div class="hero-action-row">
				<a href="/events" class="btn btn-primary btn-lg">
					<span>Register for Events</span>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M5 12h14" />
						<path d="m12 5 7 7-7 7" />
					</svg>
				</a>
				<a href="#tracks" class="btn btn-ghost-dark btn-lg">Explore Tracks & Schedule</a>
			</div>
		</div>

		<!-- Bottom Metadata & Stat Bar -->
		<div class="hero-stat-bar">
			<div class="stat-item">
				<span class="stat-val">100% Free</span>
				<span class="stat-lbl">No registration fees</span>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<span class="stat-val">PST (UTC+8)</span>
				<span class="stat-lbl">Asia/Manila timezone</span>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<span class="stat-val">Anonymous Flow</span>
				<span class="stat-lbl">No account creation needed</span>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<span class="stat-val">{data.openCount > 0 ? `${data.openCount} Open` : 'Coming Soon'}</span>
				<span class="stat-lbl">Event tracks available</span>
			</div>
		</div>
	</div>

	<!-- Minimal Right-Edge Section Index Indicator -->
	<aside class="hero-edge-nav" aria-label="Page section navigation">
		<a href="#intro" class="edge-dot">
			<span class="edge-dot-mark" aria-hidden="true"></span>
			<span class="edge-label">01 INTRO</span>
		</a>
		<a href="#tracks" class="edge-dot">
			<span class="edge-dot-mark" aria-hidden="true"></span>
			<span class="edge-label">02 TRACKS</span>
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

<!-- ====================== SECTION 2: FEATURED / UPCOMING TRACKS ====================== -->
<section class="section-tracks" id="tracks">
	<div class="shell">
		<div class="section-head section-head-row">
			<div>
				<p class="eyebrow">Schedule & Registration</p>
				<h2>Open Event Tracks</h2>
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
					<a href="/events" class="btn btn-ghost btn-sm">Browse full event catalog</a>
				</div>
			</div>
		{:else}
			<div class="track-grid">
				{#each data.upcoming as event (event.id)}
					<article class="track-card">
						<div class="track-header">
							<span class="badge badge-open">
								<span class="badge-dot" aria-hidden="true"></span>
								Registration Open
							</span>
							<time datetime={new Date(event.startAt).toISOString()} class="track-time">
								{format(event.startAt)}
							</time>
						</div>

						<h3 class="track-title">
							<a href={`/events/${event.id}`}>{event.title}</a>
						</h3>

						<p class="track-desc">
							{event.description ?? 'Session mechanics, participant guidelines, and schedule details inside.'}
						</p>

						<div class="track-footer">
							<div class="track-capacity">
								{#if event.capacity !== null}
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
										<circle cx="9" cy="7" r="4" />
									</svg>
									<span>{event.capacity} total slots</span>
								{:else}
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<circle cx="12" cy="12" r="10" />
										<path d="m9 12 2 2 4-4" />
									</svg>
									<span>Open Capacity</span>
								{/if}
							</div>

							<a href={`/events/${event.id}`} class="btn btn-primary btn-sm">
								<span>Register</span>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M5 12h14" />
									<path d="m12 5 7 7-7 7" />
								</svg>
							</a>
						</div>
					</article>
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
				<p>Engage with industry alumni and experienced practitioners to navigate software engineering, AI, and academic research pathways.</p>
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
				<p>Put your team's design intuition and web development prowess to the test in high-energy creative challenges.</p>
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
				<p>Unwind and compete in multiplayer tournaments. Celebrate camaraderie with fellow computing peers across batches.</p>
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
					{data.openCount} {data.openCount === 1 ? 'event track is' : 'event tracks are'} accepting registrations right now. Claim your spot.
				{:else}
					The full event roster is ready. Discover all upcoming sessions and be first to register.
				{/if}
			</p>
			<div class="cta-buttons">
				<a href="/events" class="btn btn-white btn-lg">Explore Full Schedule</a>
			</div>
		</div>
	</div>
</section>

<style>
	/* ============================== CINEMATIC HERO ============================== */
	.hero-cinematic {
		position: relative;
		min-height: 94vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #231c27; /* Deep atmospheric dark plum */
		color: #ffffff;
		overflow: hidden;
		padding-top: 5rem;
		padding-bottom: 3.5rem;
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
		width: 750px;
		height: 750px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(166, 58, 92, 0.28) 0%, rgba(122, 31, 61, 0.12) 45%, rgba(35, 28, 39, 0) 75%);
		filter: blur(40px);
	}
	.ambient-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
		background-size: 50px 50px;
		background-position: center center;
		mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0.8) 0%, transparent 80%);
		-webkit-mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0.8) 0%, transparent 80%);
	}

	/* Central Dominant Computational Visual Focus */
	.hero-focal-stage {
		position: absolute;
		top: 44%;
		left: 50%;
		margin-top: -270px;
		margin-left: -270px;
		width: 540px;
		height: 540px;
		pointer-events: none;
		z-index: 1;
		transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.hero-artifact {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 15px 45px rgba(194, 80, 114, 0.25));
	}

	@keyframes spinSlow {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	@keyframes pulseCore {
		0%, 100% { transform: scale(1); opacity: 1; }
		50% { transform: scale(1.06); opacity: 0.92; }
	}
	.spin-slow {
		transform-origin: 270px 270px;
		animation: spinSlow 36s linear infinite;
	}
	.pulse-core {
		transform-origin: 270px 270px;
		animation: pulseCore 4s ease-in-out infinite;
	}

	/* Central Hero Content */
	.hero-inner {
		position: relative;
		z-index: 2;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-top: auto;
		margin-bottom: auto;
		padding-top: 2rem;
	}
	.hero-content {
		max-width: 44rem;
		margin: 0 auto;
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
		margin-bottom: 1.5rem;
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
		font-family: var(--font-display);
		font-size: clamp(3.2rem, 8.5vw, 5.8rem);
		font-weight: 700;
		line-height: 0.98;
		letter-spacing: 0.04em;
		margin: 0 0 0.65rem;
		color: #ffffff;
		text-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
	}
	.hero-subtitle-line {
		display: block;
		font-family: var(--font-body);
		font-size: clamp(1.05rem, 2.4vw, 1.4rem);
		font-weight: 500;
		letter-spacing: 0.08em;
		color: var(--rose-100);
		margin-top: 0.45rem;
		text-transform: uppercase;
	}

	.hero-description {
		font-size: clamp(1rem, 1.8vw, 1.15rem);
		line-height: 1.65;
		color: rgba(255, 255, 255, 0.82);
		max-width: 36rem;
		margin: 0.75rem 0 2.25rem;
	}

	.hero-action-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 3rem;
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

	/* ============================== SECTION 2: TRACKS ============================== */
	.section-tracks {
		padding: clamp(5rem, 9vw, 7.5rem) 0;
		background: var(--paper);
	}
	.track-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.75rem;
	}
	.track-card {
		display: flex;
		flex-direction: column;
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: 2rem 1.85rem;
		transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
	}
	.track-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-hover);
		border-color: var(--rose-100);
	}
	.track-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}
	.track-time {
		font-size: 0.8rem;
		color: var(--plum-soft);
		font-weight: 500;
	}
	.track-title {
		font-size: 1.35rem;
		line-height: 1.3;
		margin: 0 0 0.75rem;
	}
	.track-title a {
		color: var(--plum);
	}
	.track-title a:hover {
		color: var(--rose-700);
		text-decoration: none;
	}
	.track-desc {
		margin: 0 0 1.75rem;
		color: var(--plum-soft);
		font-size: 0.94rem;
		line-height: 1.6;
		flex: 1;
	}
	.track-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border-top: 1px solid var(--line);
		padding-top: 1.15rem;
	}
	.track-capacity {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		color: var(--plum-soft);
		font-weight: 500;
	}
	.track-capacity svg {
		color: var(--rose-600);
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
		.hero-focal-stage {
			width: 400px;
			height: 400px;
			margin-top: -200px;
			margin-left: -200px;
			opacity: 0.55;
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
		.hero-action-row .btn {
			width: 100%;
		}
		.hero-stat-bar .stat-item {
			width: 100%;
		}
		.track-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.35rem;
		}
		.track-footer {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.85rem;
		}
		.track-footer .btn {
			width: 100%;
		}
	}
</style>