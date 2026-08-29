<script lang="ts">
	let { data } = $props();

	const formatDateTime = (date: Date) =>
		new Intl.DateTimeFormat('en-PH', {
			dateStyle: 'medium',
			timeStyle: 'short',
			timeZone: 'Asia/Manila'
		}).format(new Date(date));

	const isFiltered = $derived(data.status !== 'all' || data.upcoming);
</script>

<svelte:head>
	<title>Event Schedule & Registration | CASC4D3</title>
	<meta
		name="description"
		content="Explore all talks, workshops, and contests happening during the 43rd Computer Science Week. Free registration for all participants."
	/>
</svelte:head>

<div class="events-page">
	<!-- Page Header -->
	<header class="events-header">
		<p class="eyebrow">Event Schedule & Registration</p>
		<h1>Events Roster</h1>
		<p class="lede">
			Discover tech talks, hands-on workshops, and friendly contests planned for the 43rd Computer Science Week. All events are 100% free with no account required.
		</p>
	</header>

	<!-- Filter Controls -->
	<section class="filter-section" aria-label="Event filters">
		<form method="GET" class="filter-card">
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
				<button type="submit" class="btn btn-primary btn-sm">Apply filters</button>
				{#if isFiltered}
					<a href="/events?status=all" class="btn btn-ghost btn-sm">Reset</a>
				{/if}
			</div>
		</form>
	</section>

	<!-- Events Grid -->
	<section class="events-content" aria-label="Event listing">
		{#if data.events.length === 0}
			<div class="empty-card">
				<div class="empty-icon" aria-hidden="true">
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
						<rect x="3" y="4" width="18" height="18" rx="2" />
						<path d="M3 10h18" />
						<path d="M8 2v4M16 2v4" />
						<path d="M10 16h4" />
					</svg>
				</div>
				<h3>No events match your selected filters</h3>
				<p>Try switching to "All statuses" or unchecking "Upcoming only" to see the full schedule.</p>
				<div style="margin-top: 1.5rem;">
					<a href="/events?status=all" class="btn btn-primary btn-sm">View all events</a>
				</div>
			</div>
		{:else}
			<div class="events-summary">
				<p class="summary-text">
					Showing <strong>{data.events.length}</strong> {data.events.length === 1 ? 'event' : 'events'}
					{#if data.status === 'open'}· Open for registration{/if}
					{#if data.upcoming}· Upcoming schedule{/if}
				</p>
			</div>

			<div class="events-grid">
				{#each data.events as event (event.id)}
					<article class="event-card-rich">
						<div class="card-header">
							<div class="card-status">
								{#if event.status === 'open'}
									<span class="badge badge-open">
										<span class="badge-dot" aria-hidden="true"></span>
										Open for registration
									</span>
								{:else if event.status === 'closed'}
									<span class="badge badge-closed">
										<span class="badge-dot" aria-hidden="true"></span>
										Registration closed
									</span>
								{:else}
									<span class="badge badge-draft">
										<span class="badge-dot" aria-hidden="true"></span>
										Draft / Announced
									</span>
								{/if}
							</div>
							<time datetime={new Date(event.startAt).toISOString()} class="card-date">
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<rect x="3" y="4" width="18" height="18" rx="2" />
									<path d="M3 10h18" />
									<path d="M8 2v4M16 2v4" />
								</svg>
								{formatDateTime(event.startAt)}
							</time>
						</div>

						<h2 class="card-title">
							<a href={`/events/${event.id}`}>{event.title}</a>
						</h2>

						<p class="card-description">
							{event.description ?? 'Event information, timeline, and participant requirements.'}
						</p>

						<div class="card-meta">
							<div class="meta-item">
								<span class="meta-label">Capacity</span>
								<span class="meta-value">
									{#if event.capacity !== null}
										{event.capacity} participants max
									{:else}
										Open / Unlimited
									{/if}
								</span>
							</div>

							<div class="meta-item">
								<span class="meta-label">Entry Fee</span>
								<span class="meta-value fee-free">100% Free</span>
							</div>
						</div>

						<div class="card-footer">
							{#if event.status === 'open'}
								<a href={`/events/${event.id}`} class="btn btn-primary btn-full">
									<span>Register for event</span>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M5 12h14" />
										<path d="m12 5 7 7-7 7" />
									</svg>
								</a>
							{:else}
								<a href={`/events/${event.id}`} class="btn btn-ghost btn-full">
									<span>View event details</span>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M5 12h14" />
										<path d="m12 5 7 7-7 7" />
									</svg>
								</a>
							{/if}
						</div>
					</article>
				{/each}
			</div>
		{/if}
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
		font-size: clamp(2.2rem, 5vw, 3.2rem);
		line-height: 1.15;
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
		border-radius: var(--radius);
		padding: 1.25rem 1.5rem;
		box-shadow: var(--shadow);
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
		padding-bottom: 0.55rem;
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

	.events-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.event-card-rich {
		display: flex;
		flex-direction: column;
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: 1.75rem;
		transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
	}
	.event-card-rich:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-hover);
		border-color: var(--rose-100);
	}

	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}
	.card-date {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.8rem;
		color: var(--plum-soft);
		font-weight: 500;
	}
	.card-date svg {
		color: var(--rose-600);
	}

	.card-title {
		font-size: 1.35rem;
		line-height: 1.3;
		margin: 0 0 0.75rem;
	}
	.card-title a {
		color: var(--plum);
	}
	.card-title a:hover {
		color: var(--rose-700);
		text-decoration: none;
	}

	.card-description {
		margin: 0 0 1.5rem;
		color: var(--plum-soft);
		font-size: 0.94rem;
		line-height: 1.6;
		flex: 1;
	}

	.card-meta {
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
	.meta-value {
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--plum);
	}
	.fee-free {
		color: var(--ok);
	}

	.card-footer {
		margin-top: auto;
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

	@media (max-width: 520px) {
		.events-grid {
			grid-template-columns: 1fr;
		}
		.card-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
	}
</style>
