<script lang="ts">
	import type { Snippet } from 'svelte';

	type BadgeVariant = 'open' | 'confirmed' | 'draft' | 'pending' | 'closed' | 'cancelled';

	let {
		variant = 'open',

		children
	}: {
		variant?: BadgeVariant;

		children: Snippet;
	} = $props();
</script>

<span class={`badge badge-${variant}`}>
	{@render children()}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.24rem 0.7rem;
		border-radius: 6px;
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
		color: #775018;
	}
	.badge-closed {
		background: #ece6ea;
		color: var(--plum-soft);
	}
	.badge-cancelled {
		background: #fae7e7;
		color: var(--danger);
	}
</style>
