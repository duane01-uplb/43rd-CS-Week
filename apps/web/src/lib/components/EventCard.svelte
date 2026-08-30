<script lang="ts">
	import Badge from './Badge.svelte';
	import Button from './Button.svelte';

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
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<rect x="3" y="4" width="18" height="18" rx="2" />
				<path d="M3 10h18" />
				<path d="M8 2v4M16 2v4" />
			</svg>
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
				<span class="meta-label">Entry</span>
				<span class="meta-val val-free">100% Free</span>
			</div>
		</div>
	{/if}

	<div class="card-footer">
		{#if variant === 'track'}
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
		{/if}

		{#if event.status === 'open'}
			<Button variant="primary" size="sm" href={`/events/${event.id}`} fullWidth={variant === 'grid'}>
				<span>Register for event</span>
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M5 12h14" />
					<path d="m12 5 7 7-7 7" />
				</svg>
			</Button>
		{:else}
			<Button variant="ghost" size="sm" href={`/events/${event.id}`} fullWidth={variant === 'grid'}>
				<span>View details</span>
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M5 12h14" />
					<path d="m12 5 7 7-7 7" />
				</svg>
			</Button>
		{/if}
	</div>
</article>

<style>
	.event-card-root {
		display: flex;
		flex-direction: column;
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: 1.85rem;
		transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
	}
	.event-card-root:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-hover);
		border-color: var(--rose-100);
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
	.card-time svg {
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
	.val-free {
		color: var(--ok);
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
	.track-capacity svg {
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
