<script lang="ts">
	import { page } from '$app/state';

	type Link = { title: string; href: string; hint?: string };
	let { links = [] }: { links?: Link[] } = $props();

	const isActive = (href: string) => {
		const p = page.url.pathname;
		if (href === '/admin') return p === '/admin';
		return p === href || p.startsWith(href + '/');
	};
</script>

<aside class="sidebar" aria-label="Admin sections">
	<div class="brand">
		<span class="brand-mark" aria-hidden="true"></span>
		<div class="brand-text">
			<span class="brand-kicker">Computer Science Week</span>
			<span class="brand-title">Admin Console</span>
		</div>
	</div>

	<nav>
		<ul class="nav-list">
			{#each links as l (l.href)}
				<li>
					<a
						class="nav-item"
						class:active={isActive(l.href)}
						href={l.href}
						aria-current={isActive(l.href) ? 'page' : undefined}
					>
						<span class="nav-label">{l.title}</span>
						{#if l.hint}<span class="nav-hint">{l.hint}</span>{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<style>
	.sidebar {
		display: flex;
		flex-direction: column;
		width: 248px;
		flex-shrink: 0;
		background: var(--card);
		border-right: 1px solid var(--line);
		padding: 1.25rem 0.875rem;
		gap: 1.5rem;
		position: sticky;
		top: 0;
		height: 100vh;
		overflow-y: auto;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0 0.375rem;
	}
	.brand-mark {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--rose-600), var(--rose-900));
		position: relative;
		flex-shrink: 0;
		box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.15);
	}
	.brand-mark::after {
		content: '';
		position: absolute;
		inset: 7px;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.6);
	}
	.brand-text {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}
	.brand-kicker {
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--rose-700);
	}
	.brand-title {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--plum);
	}

	.nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.nav-item {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.55rem 0.75rem;
		border-radius: 8px;
		color: var(--plum-soft);
		text-decoration: none;
		font-weight: 500;
		position: relative;
		transition: background 0.15s ease, color 0.15s ease;
	}
	.nav-item:hover {
		background: var(--rose-050);
		color: var(--plum);
		text-decoration: none;
	}
	.nav-item.active {
		background: var(--rose-100);
		color: var(--rose-900);
	}
	/* signature: thin rose stem on the active item */
	.nav-item.active::before {
		content: '';
		position: absolute;
		left: -0.875rem;
		top: 20%;
		bottom: 20%;
		width: 3px;
		border-radius: 0 2px 2px 0;
		background: linear-gradient(var(--rose-600), var(--rose-900));
	}
	.nav-hint {
		font-size: 0.7rem;
		font-weight: 400;
		opacity: 0.7;
	}

	@media (max-width: 720px) {
		.sidebar {
			position: static;
			width: 100%;
			height: auto;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			border-right: none;
			border-bottom: 1px solid var(--line);
			padding: 0.75rem 1rem;
			gap: 0.75rem;
		}
		.brand-kicker {
			display: none;
		}
		.nav-list {
			flex-direction: row;
			gap: 0.25rem;
		}
		.nav-item {
			padding: 0.45rem 0.6rem;
		}
		.nav-item.active::before {
			left: auto;
			right: 20%;
			left: 20%;
			top: auto;
			bottom: -0.75rem;
			width: auto;
			height: 3px;
			border-radius: 2px 2px 0 0;
		}
		.nav-hint {
			display: none;
		}
	}
</style>
