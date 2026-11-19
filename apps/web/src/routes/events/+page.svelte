<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import { getExternalRegistration } from '$lib/externalRegistration';
	import type { PageData } from './$types';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import Button from '$lib/components/Button.svelte';

	let { data }: { data: PageData } = $props();

	const isFiltered = $derived(data.status !== 'all' || data.upcoming);
	const filterQuery = $derived(`status=${data.status}${data.upcoming ? '&upcoming=1' : ''}`);

	const dayFormat = new Intl.DateTimeFormat('en-PH', { dateStyle: 'full', timeZone: 'Asia/Manila' });
	const timeFormat = new Intl.DateTimeFormat('en-PH', { timeStyle: 'short', timeZone: 'Asia/Manila' });

	function groupByDay(events: Awaited<PageData['events']>) {
		const days = new Map<string, typeof events>();
		for (const event of events) {
			const day = dayFormat.format(new Date(event.startAt));
			const group = days.get(day);
			if (group) group.push(event);
			else days.set(day, [event]);
		}
		return days;
	}
</script>

<svelte:head>
	<title>Event Schedule & Registration | CASC4D3</title>
	<meta
		name="description"
		content="Explore all talks, workshops, and contests happening during the 43rd Computer Science Week. No account required."
	/>
</svelte:head>

<div class="events-page">
	<!-- Page Header -->
	<header class="events-header">
		<h1>Event schedule</h1>
		<p class="lede">
			Explore the 43rd Computer Science Week program. All times are in Manila time. No account required.
		</p>
	</header>

	<!-- Filter Controls -->
	<section class="filter-section" aria-label="Event filters">
		<form method="GET" class="filter-card">
			<noscript><input type="hidden" name="render" value="full" /></noscript>
			<div class="filter-controls">
				<div class="filter-field">
					<label for="status-select">Registration Status</label>
					<div class="select-wrap">
						<select id="status-select" name="status" value={data.status}>
							<option value="open">Open for registration</option>
							<option value="all">All statuses</option>
						</select>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="select-arrow" aria-hidden="true">
							<path d="m6 9 6 6 6-6" />
						</svg>
					</div>
				</div>

				<div class="filter-field filter-checkbox-field">
					<label class="checkbox-label">
						<input type="checkbox" name="upcoming" value="1" checked={data.upcoming} />
						<span class="checkbox-custom" aria-hidden="true"></span>
						<span>Upcoming only</span>
					</label>
				</div>
			</div>

			<div class="filter-actions">
				<Button type="submit" variant="primary" size="sm">Apply filters</Button>
				{#if isFiltered}
					<Button variant="ghost" size="sm" href="/events?status=all">Reset</Button>
				{/if}
			</div>
		</form>
	</section>

	<!-- Daily program -->
	<section class="events-content" aria-label="Event listing">
		{#await data.events}
			<LoadingScreen label="Loading the event roster" />
			<noscript><a href={`/events?${filterQuery}&render=full`}>Load the event roster</a></noscript>
		{:then events}
			{#if events.length === 0}
				<div class="empty-card">
					<div class="empty-icon" aria-hidden="true">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
							<rect x="3" y="4" width="18" height="18" rx="2" />
							<path d="M3 10h18" />
							<path d="M8 2v4M16 2v4" />
							<path d="M10 16h4" />
						</svg>
					</div>
					<h2>No events match your selected filters</h2>
					<p>Try switching to "All statuses" or unchecking "Upcoming only" to see the full schedule.</p>
					<div style="margin-top: 1.5rem;">
						<Button variant="primary" size="sm" href="/events?status=all">View all events</Button>
					</div>
				</div>
			{:else}
				<div class="events-summary">
					<p class="summary-text">
						Showing <strong>{events.length}</strong> {events.length === 1 ? 'event' : 'events'}
						{#if data.status === 'open'}· Open for registration{/if}
						{#if data.upcoming}· Upcoming schedule{/if}
					</p>
				</div>

				{#each groupByDay(events) as [day, sessions] (day)}
					<section class="program-day">
						<h2>{day}</h2>
						{#each sessions as event (event.id)}
							{@const external = getExternalRegistration(event.title)}
							{@const details = `/events/${event.id}`}
							<article class="session">
								<time datetime={new Date(event.startAt).toISOString()}>{timeFormat.format(new Date(event.startAt))}</time>
								<div class="session-info">
									<h3><a href={details}>{event.title}</a></h3>
									{#if event.description}<p>{event.description}</p>{/if}
									<small>{event.capacity == null ? 'Open capacity' : `Capacity: ${event.capacity}`}</small>
								</div>
								<div class="status">
									{#if event.status === 'open'}
										<Badge variant="open" showDot={false}>Open for registration</Badge>
									{:else}
										<Badge variant="closed" showDot={false}>Registration closed</Badge>
									{/if}
								</div>
								<a class="session-action" href={event.status === 'open' ? external?.url ?? details : details}>
									{event.status === 'open' ? (external ? `Register at ${external.hostLabel}` : 'Register') : 'View details'}
									<span aria-hidden="true"> →</span>
								</a>
							</article>
						{/each}
					</section>
				{/each}
			{/if}
		{:catch}
			<div class="empty-card">
				<p>The event roster couldn’t load. <a href={`/events?${filterQuery}`} data-sveltekit-reload>Try again</a>.</p>
			</div>
		{/await}
	</section>
</div>

<style>
	.events-page {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.events-header {
		max-width: 38rem;
	}
	.events-header h1 {
		font-size: clamp(2.4rem, 6vw, 3.6rem);
		line-height: 1.05;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		margin: 0 0 0.75rem;
	}

	/* Filter Card */
	.filter-card {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius-sm);
		padding: 1.25rem 1.5rem;
		box-shadow: none;
	}
	.filter-controls {
		display: flex;
		align-items: flex-end;
		gap: 1.75rem;
		flex-wrap: wrap;
	}
	.filter-field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.filter-field label {
		font-size: 0.82rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--plum-soft);
	}
	.select-wrap {
		position: relative;
		display: inline-flex;
		align-items: center;
	}
	.select-wrap select {
		appearance: none;
		-webkit-appearance: none;
		padding: 0.55rem 2.25rem 0.55rem 0.85rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--line);
		background: var(--paper);
		color: var(--plum);
		font-family: var(--font-body);
		font-size: 0.92rem;
		font-weight: 500;
		cursor: pointer;
		min-width: 200px;
	}
	.select-arrow {
		position: absolute;
		right: 0.75rem;
		pointer-events: none;
		color: var(--plum-soft);
	}
	.filter-checkbox-field {
		justify-content: flex-end;
		padding-bottom: 0.15rem;
		max-width: 22rem;
	}
	.checkbox-label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.92rem !important;
		font-weight: 500 !important;
		text-transform: none !important;
		letter-spacing: normal !important;
		color: var(--plum) !important;
		cursor: pointer;
		user-select: none;
	}
	.checkbox-label input[type='checkbox'] {
		accent-color: var(--rose-700);
		width: 16px;
		height: 16px;
		cursor: pointer;
	}
	.filter-actions {
		display: flex;
		align-items: center;
		gap: 0.65rem;
	}

	/* Events Content */
	.events-summary {
		margin-bottom: 1.25rem;
	}
	.summary-text {
		margin: 0;
		font-size: 0.88rem;
		color: var(--plum-soft);
	}

	.program-day + .program-day { margin-top: 2.5rem; }
	.program-day h2 {
		margin: 0;
		padding-block: 0.75rem;
		border-bottom: 2px solid var(--rose-700);
		font-size: clamp(1.1rem, 2vw, 1.5rem);
		color: var(--rose-900);
	}
	.session {
		display: grid;
		grid-template-columns: 6rem minmax(0, 1fr) 10rem 11rem;
		align-items: baseline;
		gap: 1.25rem;
		padding-block: 1.25rem;
		border-bottom: 1px solid var(--line);
	}
	.session time { font: 0.9rem/1.5 var(--font-display); font-variant-numeric: tabular-nums; }
	.session h3 { margin: 0; font-size: 1.25rem; }
	.session h3 a { color: var(--plum); }
	.session-info { overflow-wrap: anywhere; }
	.session-info p { margin: 0.4rem 0; }
	.session-info small { color: var(--plum-soft); }
	.session-action { font-weight: 600; align-self: start; padding-block: 0.35rem; }
	@media (max-width: 900px) {
		.session { grid-template-columns: auto minmax(0, 1fr); gap: 0.5rem 1rem; }
		.status, .session-action { grid-column: 2; }
	}

	.empty-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--rose-100);
		color: var(--rose-700);
		margin-bottom: 1.25rem;
	}

	/* Responsive */
	@media (max-width: 720px) {
		.filter-card {
			flex-direction: column;
			align-items: stretch;
		}
		.filter-controls {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}
		.select-wrap select {
			width: 100%;
		}
		.filter-actions {
			justify-content: flex-start;
		}
	}

</style>
