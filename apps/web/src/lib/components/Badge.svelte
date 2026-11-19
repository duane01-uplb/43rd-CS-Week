<script lang="ts">
	import type { Snippet } from 'svelte';

	type BadgeVariant = 'open' | 'confirmed' | 'draft' | 'pending' | 'closed' | 'cancelled';

	let {
		variant = 'open',
		showDot = true,
		children
	}: {
		variant?: BadgeVariant;
		showDot?: boolean;
		children: Snippet;
	} = $props();
</script>

<span class={`badge badge-${variant}`}>
	{#if showDot}
		<span class="badge-dot" aria-hidden="true"></span>
	{/if}
	{@render children()}
</span>

<style>
	.badge {
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
	.badge-open,
	.badge-confirmed {
		background: #e5f2eb;
		color: var(--ok-foreground);
	}
	.badge-draft,
	.badge-pending {
		background: #f4efe4;
		color: var(--warn);
	}
	.badge-closed {
		background: #ece6ea;
		color: var(--plum-soft);
	}
	.badge-cancelled {
		background: #fae7e7;
		color: var(--danger);
	}
	.badge-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
	}
	.badge-open .badge-dot {
		animation: badgeDotPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
	@keyframes badgeDotPulse {
		0%, 100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.4);
			opacity: 0.7;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.badge-open .badge-dot {
			animation: none !important;
		}
	}
</style>
