<script lang="ts">
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
</script>

<svelte:window onscroll={handleScroll} />

<svelte:head>
	<title>CASC4D3 — The 43rd Computer Science Week</title>
	<meta
		name="description"
		content="CASC4D3: The 43rd Computer Science Week at UPLB. Keynotes, workshops, and friendly contests for the computing community. All events are free to register."
	/>
	<meta name="theme-color" content="#2b2430" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Macondo+Swash+Caps&family=Space+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Press+Start+2P&display=swap"
		rel="stylesheet"
	/>
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
			<a href="/events" class="btn btn-primary btn-sm nav-cta">Register for Events</a>
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
				<a href="/events" class="btn btn-primary btn-full" onclick={() => (menuOpen = false)}>Register for Events</a>
			</div>
		</nav>
	{/if}
</header>

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
				The official annual gathering of students, educators, developers, and tech creators at the University of the Philippines Los Baños. Every event is 100% free to attend.
			</p>
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
		<p class="footer-legal">© 2026 CASC4D3 · 43rd CS Week Organizers · UPLB</p>
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
		background: var(--paper);
		color: var(--plum);
		font-family: var(--font-body);
		font-size: 16px;
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
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

	:global(a) {
		color: var(--rose-700);
		text-decoration: none;
		transition: color 0.15s ease;
	}
	:global(a:hover) {
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
		box-shadow: 0 2px 8px rgba(166, 58, 92, 0.25);
	}
	:global(.btn-primary:hover) {
		background: var(--rose-800);
		color: #ffffff;
		box-shadow: 0 4px 14px rgba(166, 58, 92, 0.35);
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
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		color: var(--rose-700);
	}
	.brand-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.18rem;
		color: var(--plum);
		letter-spacing: 0.02em;
	}

	/* Nav over Home Cinematic Dark Hero */
	.site-nav.isHome:not(.scrolled) .brand-kicker {
		color: var(--rose-100);
	}
	.site-nav.isHome:not(.scrolled) .brand-name {
		color: #ffffff;
	}
	.site-nav.isHome:not(.scrolled) .nav-links a:not(.btn) {
		color: rgba(255, 255, 255, 0.78);
	}
	.site-nav.isHome:not(.scrolled) .nav-links a:not(.btn):hover {
		color: #ffffff;
	}
	.site-nav.isHome:not(.scrolled) .nav-links a:not(.btn).active {
		color: #ffffff;
	}
	.site-nav.isHome:not(.scrolled) .nav-links a:not(.btn).active::after {
		background: var(--rose-600);
	}
	.site-nav.isHome:not(.scrolled) .nav-toggle {
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.2);
	}

	/* ---- header navigation ---- */
	.site-nav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(250, 247, 244, 0.92);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--line);
		transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}
	.site-nav.isHome:not(.scrolled) {
		position: absolute;
		left: 0;
		right: 0;
		background: transparent;
		border-bottom-color: rgba(255, 255, 255, 0.08);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
	}
	.site-nav.isHome.scrolled {
		position: sticky;
		background: rgba(43, 36, 48, 0.95);
		border-bottom-color: rgba(255, 255, 255, 0.1);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
	}
	.site-nav.isHome.scrolled .brand-kicker {
		color: var(--rose-100);
	}
	.site-nav.isHome.scrolled .brand-name {
		color: #ffffff;
	}
	.site-nav.isHome.scrolled .nav-links a:not(.btn) {
		color: rgba(255, 255, 255, 0.8);
	}
	.site-nav.isHome.scrolled .nav-links a:not(.btn):hover,
	.site-nav.isHome.scrolled .nav-links a:not(.btn).active {
		color: #ffffff;
	}

	.nav-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 72px;
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.65rem;
	}
	.nav-links a:not(.btn) {
		color: var(--plum-soft);
		font-weight: 500;
		font-size: 0.94rem;
		padding: 0.25rem 0;
		position: relative;
		transition: color 0.15s ease;
	}
	.nav-links a:not(.btn):hover {
		color: var(--rose-700);
		text-decoration: none;
	}
	.nav-links a:not(.btn).active {
		color: var(--rose-700);
		font-weight: 600;
	}
	.nav-links a:not(.btn).active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--rose-700);
		border-radius: 2px;
	}
	.nav-cta {
		margin-left: 0.5rem;
	}

	.nav-toggle {
		display: none;
		background: none;
		border: 1px solid var(--line);
		border-radius: var(--radius-sm);
		padding: 0.5rem;
		cursor: pointer;
		color: var(--plum);
		transition: background 0.15s ease, border-color 0.15s ease;
	}
	.nav-toggle:hover {
		background: var(--rose-050);
		border-color: var(--rose-100);
	}

	.mobile-menu {
		display: none;
	}

	/* ---- footer ---- */
	.site-footer {
		border-top: 1px solid var(--line);
		background: var(--rose-050);
		margin-top: auto;
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
		color: var(--plum-soft);
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
		color: var(--rose-700);
		margin-bottom: 0.35rem;
	}
	.footer-col a {
		color: var(--plum-soft);
		font-size: 0.92rem;
		text-decoration: none;
		transition: color 0.15s ease;
	}
	.footer-col a:hover {
		color: var(--rose-700);
		text-decoration: underline;
	}
	.footer-bottom {
		border-top: 1px solid var(--line);
		padding-top: 1.5rem;
		padding-bottom: 2.25rem;
	}
	.footer-legal {
		margin: 0;
		color: var(--plum-soft);
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
			border-top: 1px solid var(--line);
			background: var(--card);
			box-shadow: 0 10px 24px rgba(43, 36, 48, 0.08);
		}
		.mobile-menu > a {
			padding: 0.7rem 0.25rem;
			color: var(--plum);
			font-weight: 500;
			border-bottom: 1px solid var(--line);
		}
		.mobile-menu > a.active {
			color: var(--rose-700);
			font-weight: 600;
		}
		.mobile-menu > a:hover {
			color: var(--rose-700);
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
	}
</style>