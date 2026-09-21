<script lang="ts">
	import Badge from './Badge.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { getExternalRegistration } from '$lib/externalRegistration';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import UsersIcon from '@lucide/svelte/icons/users';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';

	interface EventItem {
		id: string;
		title: string;
		description?: string | null;
		startAt: Date | string;
		endAt?: Date | string | null;
		capacity?: number | null;
		status: 'open' | 'closed' | 'draft' | string;
	}

	let {
		event,
		variant = 'grid'
	}: {
		event: EventItem;
		variant?: 'grid' | 'track';
	} = $props();

	const formatDateTime = (date: Date | string) =>
		new Intl.DateTimeFormat('en-PH', {
			dateStyle: 'medium',
			timeStyle: 'short',
			timeZone: 'Asia/Manila'
		}).format(new Date(date));

	const external = $derived(getExternalRegistration(event.title));
	const registerHref = $derived(external?.url ?? `/events/${event.id}`);
</script>

<article class={`event-card-root variant-${variant}`}>
	<div class="card-top">
		{#if event.status === 'open'}
			<Badge variant="open">Open for registration</Badge>
		{:else if event.status === 'closed'}
			<Badge variant="closed">Registration closed</Badge>
		{:else}
			<Badge variant="draft">Draft / Announced</Badge>
		{/if}

		<time datetime={new Date(event.startAt).toISOString()} class="card-time">
			<CalendarIcon size={14} strokeWidth={2} />
			<span>{formatDateTime(event.startAt)}</span>
		</time>
	</div>

	<h3 class="card-title">
		<a href={`/events/${event.id}`}>{event.title}</a>
	</h3>

	<p class="card-desc">
		{event.description ?? 'Event information, timeline, and participant requirements.'}
	</p>

	{#if variant === 'grid'}
		<div class="card-meta-grid">
			<div class="meta-item">
				<span class="meta-label">Capacity</span>
				<span class="meta-val">
					{#if event.capacity !== null}
						{event.capacity} spots
					{:else}
						Open Capacity
					{/if}
				</span>
			</div>
			<div class="meta-item">
				<span class="meta-label">Account</span>
				<span class="meta-val">Not required</span>
			</div>
		</div>
	{/if}

	<div class="card-footer">
		{#if variant === 'track'}
			<div class="track-capacity">
				{#if event.capacity !== null}
					<UsersIcon size={14} strokeWidth={2} />
					<span>{event.capacity} total slots</span>
				{:else}
					<CircleCheckIcon size={14} strokeWidth={2} />
					<span>Open Capacity</span>
				{/if}
			</div>
		{/if}

		{#if event.status === 'open'}
			<Button
				variant="default"
				size="lg"
				href={registerHref}
				class={variant === 'grid' ? 'h-10 w-full gap-2 px-4 text-[0.88rem] font-semibold' : 'h-10 gap-2 px-4 text-[0.88rem] font-semibold'}
			>
				<span>{external ? `Register at ${external.hostLabel}` : 'Register for event'}</span>
				<ArrowRightIcon size={15} strokeWidth={2} />
			</Button>
		{:else}
			<Button
				variant="outline"
				size="lg"
				href={`/events/${event.id}`}
				class={variant === 'grid' ? 'h-10 w-full gap-2 px-4 text-[0.88rem] font-semibold' : 'h-10 gap-2 px-4 text-[0.88rem] font-semibold'}
			>
				<span>View details</span>
				<ArrowRightIcon size={15} strokeWidth={2} />
			</Button>
		{/if}
	</div>
</article>

<style>
	.event-card-root {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius-sm);
		box-shadow: none;
		padding: 1.65rem;
	}

	.card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 1.15rem;
		flex-wrap: wrap;
	}
	.card-time {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.8rem;
		color: var(--plum-soft);
		font-weight: 500;
	}
	.card-time :global(svg) {
		color: var(--rose-600);
	}

	.card-title {
		font-size: 1.35rem;
		line-height: 1.3;
		margin: 0 0 0.65rem;
	}
	.card-title a {
		color: var(--plum);
	}
	.card-title a:hover {
		color: var(--rose-700);
		text-decoration: none;
	}

	.card-desc {
		margin: 0 0 1.5rem;
		color: var(--plum-soft);
		font-size: 0.94rem;
		line-height: 1.6;
		flex: 1;
	}

	.card-meta-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		background: var(--rose-050);
		border-radius: var(--radius-sm);
		margin-bottom: 1.5rem;
	}
	.meta-item {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
	.meta-label {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--plum-soft);
		font-weight: 600;
	}
	.meta-val {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--plum);
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: auto;
	}
	.variant-track .card-footer {
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
	.track-capacity :global(svg) {
		color: var(--rose-600);
	}

	@media (max-width: 520px) {
		.card-top {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.35rem;
		}
		.card-footer {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
