<script lang="ts">
	import { CS_WEEK_CALENDAR_DAYS, getEventMeta, type CalendarDayDef } from '$lib/events';

	interface EventItem {
		id: string;
		title: string;
		description?: string | null;
		startAt: Date | string;
		endAt?: Date | string | null;
		capacity?: number | null;
		status: string;
	}

	let { events = [] }: { events: EventItem[] } = $props();

	interface DayWithEvents extends CalendarDayDef {
		events: {
			ev: EventItem;
			meta: ReturnType<typeof getEventMeta>;
		}[];
	}

	const calendarDays = $derived.by(() => {
		return CS_WEEK_CALENDAR_DAYS.map((day) => {
			const dayEvents = events
				.filter((ev) => {
					const meta = getEventMeta(ev.title);
					if (meta.tba) return false;
					return meta.activeDays.includes(day.key);
				})
				.map((ev) => ({
					ev,
					meta: getEventMeta(ev.title)
				}));

			return {
				...day,
				events: dayEvents
			} as DayWithEvents;
		});
	});

	const tbaEvents = $derived(
		events
			.filter((ev) => getEventMeta(ev.title).tba)
			.map((ev) => ({
				ev,
				meta: getEventMeta(ev.title)
			}))
	);
</script>

<div class="cal-card" aria-label="CS Week Event Schedule Calendar">
	<div class="cal-chrome" aria-hidden="true">
		<span class="cal-chrome-dot"></span>
		<span class="cal-chrome-dot"></span>
		<span class="cal-chrome-dot"></span>
		<span class="cal-chrome-tab">CS WEEK 2026 CALENDAR</span>
	</div>

	<div class="cal-body">
		<div class="cal-head">
			<div class="cal-head-left">
				<span class="cal-head-month">FEBRUARY 2026</span>
				<span class="cal-head-sub">Feb 2 – 7, 2026 · Week-at-a-Glance</span>
			</div>
			<div class="cal-head-legend" aria-hidden="true">
				<span class="legend-pill legend-f2f">
					<i class="cal-legend-dot cal-mod--F2F"></i> F2F (Face-to-Face)
				</span>
				<span class="legend-pill legend-online">
					<i class="cal-legend-dot cal-mod--Online"></i> Online
				</span>
			</div>
		</div>

		<!-- 6 Columns for Feb 2 - Feb 7 -->
		<div class="cal-grid-wrap">
			<div class="cal-grid">
				{#each calendarDays as day (day.key)}
					<div class="cal-day">
						<div class="cal-day-head">
							<span class="cal-day-slug">{day.slug}</span>
							<span class="cal-day-date">{day.dayNum} <small>{day.month}</small></span>
						</div>

						<div class="cal-day-events">
							{#if day.events.length === 0}
								<div class="cal-empty-day">
									<span>No scheduled sessions</span>
								</div>
							{:else}
								{#each day.events as item (item.ev.id + day.key)}
									<a class="cal-chip cal-chip--{item.meta.modality.toLowerCase()}" href={`/events/${item.ev.id}`}>
										<div class="cal-chip-top">
											<span class="cal-mod cal-mod--{item.meta.modality}">{item.meta.modality}</span>
											{#if item.meta.note}
												<span class="cal-chip-note">{item.meta.note}</span>
											{/if}
										</div>
										<span class="cal-chip-name">{item.ev.title}</span>
										{#if item.meta.timeLabel}
											<span class="cal-chip-time">{item.meta.timeLabel}</span>
										{/if}
									</a>
								{/each}
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- TBA Section -->
		{#if tbaEvents.length > 0}
			<div class="cal-tba-section">
				<div class="cal-tba-header">
					<span class="cal-mod cal-mod--tba">TBA</span>
					<span class="cal-tba-title">Events to be announced:</span>
				</div>
				<div class="cal-tba-list">
					{#each tbaEvents as item (item.ev.id)}
						<a class="cal-tba-chip" href={`/events/${item.ev.id}`}>
							<span class="cal-mod cal-mod--{item.meta.modality}">{item.meta.modality}</span>
							<span class="cal-tba-name">{item.ev.title}</span>
							<span class="cal-tba-desc">Schedule details to be announced soon · Stay tuned</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.cal-card {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 16px;
		box-shadow: var(--shadow);
		overflow: hidden;
	}

	.cal-chrome {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.55rem 1rem;
		background: var(--rose-050);
		border-bottom: 1px solid var(--line);
	}
	.cal-chrome-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--rose-100);
		border: 1px solid var(--line);
	}
	.cal-chrome-tab {
		margin-left: auto;
		font-family: var(--font-display);
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		color: var(--rose-700);
	}

	.cal-body {
		padding: 1.25rem 1.25rem 1.5rem;
	}

	.cal-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}
	.cal-head-left {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.cal-head-month {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--plum);
	}
	.cal-head-sub {
		font-size: 0.78rem;
		color: var(--plum-soft);
		font-weight: 500;
	}

	.cal-head-legend {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
	}
	.legend-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.74rem;
		font-weight: 600;
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		border: 1px solid var(--line);
	}
	.legend-f2f {
		background: var(--rose-050);
		color: var(--rose-800);
	}
	.legend-online {
		background: #edf7f2;
		color: #1b633e;
	}

	.cal-legend-dot {
		width: 8px;
		height: 8px;
		border-radius: 999px;
		display: inline-block;
	}
	.cal-legend-dot.cal-mod--F2F {
		background: var(--rose-600);
	}
	.cal-legend-dot.cal-mod--Online {
		background: var(--ok);
	}

	.cal-grid-wrap {
		width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 0.5rem;
	}

	.cal-grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(140px, 1fr));
		gap: 0.75rem;
		min-width: 840px;
	}

	.cal-day {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius-sm);
		padding: 0.85rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		min-height: 170px;
	}

	.cal-day-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
		border-bottom: 1px solid var(--line);
		padding-bottom: 0.45rem;
	}
	.cal-day-slug {
		font-family: var(--font-display);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		color: var(--plum-soft);
	}
	.cal-day-date {
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--plum);
		line-height: 1;
	}
	.cal-day-date small {
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--plum-soft);
		margin-left: 0.2rem;
	}

	.cal-day-events {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	.cal-empty-day {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: var(--plum-soft);
		font-size: 0.72rem;
		opacity: 0.6;
		padding: 1rem 0;
	}

	.cal-chip {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		text-decoration: none;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 8px;
		padding: 0.55rem 0.6rem;
		transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
	}
	.cal-chip:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow);
		text-decoration: none;
	}
	.cal-chip--f2f:hover {
		border-color: var(--rose-200);
	}
	.cal-chip--online:hover {
		border-color: #a8dec1;
	}

	.cal-chip-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.35rem;
	}

	.cal-mod {
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		line-height: 1;
		padding: 0.2rem 0.4rem;
		border-radius: 999px;
		white-space: nowrap;
	}
	.cal-mod--F2F {
		background: var(--rose-100);
		color: var(--rose-800);
	}
	.cal-mod--Online {
		background: #d8f1e3;
		color: #1b633e;
	}
	.cal-mod--tba {
		background: #fbf0d3;
		color: #925700;
	}

	.cal-chip-note {
		font-size: 0.58rem;
		color: var(--plum-soft);
		line-height: 1.2;
		text-align: right;
		font-weight: 500;
	}

	.cal-chip-name {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--plum);
		line-height: 1.25;
	}

	.cal-chip-time {
		font-size: 0.65rem;
		color: var(--plum-soft);
		line-height: 1.3;
	}

	/* TBA Section */
	.cal-tba-section {
		margin-top: 1.25rem;
		padding-top: 1rem;
		border-top: 1px dashed var(--line);
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.cal-tba-header {
		display: flex;
		align-items: center;
		gap: 0.65rem;
	}
	.cal-tba-title {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--plum-soft);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.cal-tba-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.cal-tba-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		text-decoration: none;
		background: #fcf8ee;
		border: 1px solid #f2e2be;
		border-radius: 8px;
		padding: 0.5rem 0.85rem;
		transition: transform 0.12s ease, border-color 0.12s ease;
	}
	.cal-tba-chip:hover {
		transform: translateY(-1px);
		border-color: #e5cd94;
		text-decoration: none;
	}
	.cal-tba-name {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--plum);
	}
	.cal-tba-desc {
		font-size: 0.74rem;
		color: #876527;
	}

	@media (max-width: 900px) {
		.cal-grid {
			min-width: 780px;
		}
	}
</style>
