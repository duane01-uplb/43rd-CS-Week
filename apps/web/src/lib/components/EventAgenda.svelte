<script lang="ts">
	import { getExternalRegistration } from '$lib/externalRegistration';
	import type { PageData } from '../../routes/events/$types';

	type Events = Awaited<PageData['events']>;
	let { events, preview = false }: { events: Events; preview?: boolean } = $props();

	const dayFormat = new Intl.DateTimeFormat('en-PH', { dateStyle: 'full', timeZone: 'Asia/Manila' });
	const timeFormat = new Intl.DateTimeFormat('en-PH', { timeStyle: 'short', timeZone: 'Asia/Manila' });
	const days = $derived.by(() => {
		const groups = new Map<string, Events>();
		for (const event of events) {
			const day = dayFormat.format(new Date(event.startAt));
			const group = groups.get(day);
			if (group) group.push(event);
			else groups.set(day, [event]);
		}
		return groups;
	});
</script>

{#each days as [day, sessions] (day)}
	<section class="program-day">
		<svelte:element this={preview ? 'h3' : 'h2'} class="day">{day}</svelte:element>
		{#each sessions as event (event.id)}
			{@const details = '/events/' + event.id}
			{@const open = event.status === 'open'}
			{@const external = open && getExternalRegistration(event.title)}
			<article class="session">
				<time datetime={new Date(event.startAt).toISOString()}>{timeFormat.format(new Date(event.startAt))}</time>
				<span class="status" class:open>{open ? 'Open for registration' : 'Registration closed'}</span>
				<div class="info">
					<svelte:element this={preview ? 'h4' : 'h3'} class="title"><a href={details}>{event.title}</a></svelte:element>
					{#if !preview}<small>{event.capacity == null ? 'Open capacity' : 'Capacity: ' + event.capacity}</small>{/if}
				</div>
				<a class="session-action" href={external ? external.url : open ? details + '#registration' : details}>
					{external ? 'Register at ' + external.hostLabel : open ? 'Register' : 'View details'} <span aria-hidden="true">→</span>
				</a>
			</article>
		{/each}
	</section>
{/each}

<style>
	.program-day + .program-day { margin-top: 1.5rem; }
	.day {
		margin: 0;
		padding-block: 0.5rem;
		border-bottom: 1px solid var(--rose-600);
		color: var(--rose-900);
		font: 700 1rem/1.5 var(--font-display);
	}
	.session {
		display: grid;
		grid-template-columns: 6rem minmax(0, 1fr) 10rem 12rem;
		grid-template-areas: 'time info status action';
		align-items: baseline;
		gap: 1rem;
		padding-block: 1rem;
		border-bottom: 1px solid var(--line);
	}
	time { grid-area: time; font: 0.875rem/1.5 var(--font-display); }
	.status { grid-area: status; font-size: 0.875rem; color: var(--plum-soft); }
	.status.open { color: var(--ok-foreground); }
	.info { grid-area: info; overflow-wrap: anywhere; }
	.title { margin: 0; font: 600 1.25rem/1.35 var(--font-body); }
	.title a { color: var(--plum); }
	small { color: var(--plum-soft); }
	.session-action { grid-area: action; justify-self: start; font-weight: 600; }
	@media (max-width: 760px) {
		.session {
			display: flex;
			flex-wrap: wrap;
			align-items: baseline;
			gap: 0.375rem 1rem;
		}
		.info, .session-action { flex-basis: 100%; }
		.session-action { padding-block: 0.25rem; }
	}
</style>
