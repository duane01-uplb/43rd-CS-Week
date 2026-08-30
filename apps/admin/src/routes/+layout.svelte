<script lang="ts">let { children } = $props();</script>

<svelte:head>
	<title>CS Week Admin</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}

<style>
	/* ------------------------------------------------------------------ *
	 * CS Week Admin — global shell
	 * Sakura tokens: a dusky-rose palette on warm paper. The Japanese
	 * influence lives in the color and the Mincho display face, not in
	 * floral decoration.
	 * ------------------------------------------------------------------ */
	:global(:root) {
		--rose-900: #7a1f3d;
		--rose-800: #8f2d4c;
		--rose-700: #a63a5c; /* solid buttons */
		--rose-600: #c25072; /* accent */
		--rose-100: #f6e3e9; /* pale wash */
		--rose-050: #fbf1f4;
		--plum: #2b2430; /* ink */
		--plum-soft: #6f6676; /* muted text */
		--paper: #faf7f4; /* warm-paper background */
		--card: #ffffff;
		--line: #ece3e6; /* rose-tinted hairline */
		--ok: #3e7a5c; /* confirmed / open-positive */
		--warn: #b7791f;
		--danger: #b13a3a;
		--font-display: 'Space Mono', 'Courier New', monospace;
		--font-body: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
		--radius: 10px;
		--shadow: 0 1px 2px rgba(43, 36, 48, 0.05), 0 8px 24px rgba(43, 36, 48, 0.06);
		--focus: 0 0 0 3px rgba(194, 80, 114, 0.3);
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(html, body) {
		margin: 0;
		height: 100%;
	}

	:global(body) {
		background: var(--paper);
		color: var(--plum);
		font-family: var(--font-body);
		font-size: 15px;
		line-height: 1.55;
		-webkit-font-smoothing: antialiased;
	}

	:global(:focus-visible) {
		outline: none;
		box-shadow: var(--focus);
		border-radius: 4px;
	}

	:global(a) {
		color: var(--rose-700);
		text-decoration: none;
	}
	:global(a:hover) {
		text-decoration: underline;
	}

	:global(h1, h2, h3) {
		font-family: var(--font-display);
		color: var(--plum);
		margin: 0 0 0.4em;
		font-weight: 700;
		letter-spacing: 0.02em;
	}

	/* ---------- shared page-header pattern ---------- */
	:global(.eyebrow) {
		margin: 0 0 0.15rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--rose-700);
	}
	:global(.head h1) {
		font-size: clamp(1.5rem, 3vw, 2rem);
	}
	:global(.lede) {
		margin: 0 0 1.5rem;
		color: var(--plum-soft);
		max-width: 46ch;
	}

	/* ---------- shared buttons ---------- */
	:global(.btn) {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.55rem 1rem;
		border-radius: var(--radius);
		border: 1px solid transparent;
		font-family: inherit;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		transition: background 0.15s ease, border-color 0.15s ease, transform 0.05s ease;
	}
	:global(.btn:active) {
		transform: translateY(1px);
	}
	:global(.btn-primary) {
		background: var(--rose-700);
		color: #fff;
	}
	:global(.btn-primary:hover) {
		background: var(--rose-800);
		text-decoration: none;
	}
	:global(.btn-ghost) {
		background: transparent;
		color: var(--plum);
		border-color: var(--line);
	}
	:global(.btn-ghost:hover) {
		background: var(--rose-050);
		text-decoration: none;
	}

	/* ---------- shared form controls ---------- */
	:global(.field) {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		margin-bottom: 1rem;
	}
	:global(.field label) {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--plum);
	}
	:global(.field input),
	:global(.field textarea),
	:global(.field select) {
		font-family: inherit;
		font-size: 0.95rem;
		padding: 0.55rem 0.7rem;
		border-radius: 8px;
		border: 1px solid var(--line);
		background: #fff;
		color: var(--plum);
	}
	:global(.field input:focus-visible),
	:global(.field textarea:focus-visible),
	:global(.field select:focus-visible) {
		border-color: var(--rose-600);
		box-shadow: var(--focus);
		outline: none;
	}
	:global(.field textarea) {
		resize: vertical;
		min-height: 96px;
	}

	/* ---------- shared status badges ---------- */
	:global(.badge) {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.18rem 0.6rem;
		border-radius: 999px;
		font-size: 0.74rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		white-space: nowrap;
	}
	:global(.badge::before) {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
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

	/* ---------- shared alert / status message ---------- */
	:global(.status-msg) {
		padding: 0.7rem 0.9rem;
		border-radius: 8px;
		font-size: 0.88rem;
		border: 1px solid transparent;
		margin: 0 0 1rem;
	}
	:global(.status-msg.alert) {
		background: #fae7e7;
		color: var(--danger);
		border-color: #f1cfcf;
	}
	:global(.status-msg.info) {
		background: var(--rose-050);
		color: var(--rose-900);
		border-color: var(--rose-100);
	}

	@media (prefers-reduced-motion: reduce) {
		:global(*) {
			animation-duration: 0.001ms !important;
			transition-duration: 0.001ms !important;
		}
	}
</style>
