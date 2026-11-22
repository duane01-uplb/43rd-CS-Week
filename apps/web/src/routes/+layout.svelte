<script lang="ts">
	import '../app.css';
	import '@fontsource/cormorant-garamond/latin-500.css';
	import '@fontsource/cormorant-garamond/latin-500-italic.css';
	import { page } from '$app/state';
	let { children } = $props();
</script>

<svelte:head><meta name="theme-color" content="#faf8f3" /></svelte:head>
<a class="skip" href="#main-content">Skip to content</a>
<header class="site-nav">
	<div class="mast">
		<a class="identity" href="/" aria-label="CASC4D3 home"><img src="/casc4d3-emblem.png" width="28" height="32" alt=""/>CASC4D3</a>
		<nav aria-label="Primary navigation"><a href="/#program">Program</a><a href="/#how-it-works">How to register</a><a href="/events" aria-current={page.url.pathname === '/events' ? 'page' : undefined}>Event schedule</a></nav>
	</div>
</header>
<main id="main-content" class:interior={page.url.pathname !== '/'}>{@render children()}</main>
<footer><div class="mast"><a class="identity" href="/">CASC4D3</a><a href="https://www.facebook.com/uplbcossph">UPLB Computer Science Society ↗</a></div></footer>
<style>
	:global(:root) { --paper:#faf8f3;--card:#fff;--plum:#292326;--plum-soft:#625955;--line:#d9d0c8;--rose-700:#91454f;--font-display:'Cormorant Garamond',Georgia,serif;--font-body:'Helvetica Neue',Helvetica,sans-serif; }
	:global(body){margin:0;background:var(--paper);color:var(--plum);font:1rem/1.6 var(--font-body)}
	:global(:focus-visible){outline:2px solid var(--rose-700);outline-offset:3px}
	:global(h1,h2,h3){font-family:var(--font-display);font-weight:500;line-height:1.1}
	:global(a){color:var(--rose-700);text-decoration:none} :global(a:hover){text-decoration:underline}
	.skip{position:absolute;top:-5rem;left:1rem;z-index:20;background:white;padding:.5rem}.skip:focus{top:.5rem}
	.site-nav,footer{background:var(--paper);position:relative;z-index:3}
	.mast{width:min(1240px,88%);margin:auto;min-height:74px;display:flex;align-items:center;justify-content:space-between;gap:1rem;border-bottom:1px solid var(--line)}
	.identity{display:inline-flex;align-items:center;gap:.6rem;color:var(--plum);font:500 1.9rem var(--font-display)}
	nav{display:flex;flex-wrap:wrap;gap:1.75rem}.mast a:not(.identity){font-size:.875rem;color:var(--plum)}nav [aria-current]{text-decoration:underline;text-underline-offset:.3rem}
	footer .mast{border:0;border-top:1px solid var(--line);padding-block:1rem}
	.interior{width:min(1120px,88%);margin:auto;padding-block:clamp(1.5rem,4vw,3.5rem)}
	@media(max-width:600px){header .mast{flex-wrap:wrap;padding-block:.75rem;gap:.45rem}nav{width:100%;justify-content:space-between;gap:.35rem}.mast a:not(.identity){font-size:.8rem}}
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
		color: var(--ok-foreground);
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
	:global(.empty-card h2, .empty-card h3) {
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

	</style>
