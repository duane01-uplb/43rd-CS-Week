<script lang="ts">
	let { data } = $props();
	const format = (date: Date) =>
		new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' }).format(new Date(date));
</script>

<svelte:head><title>CS Week</title></svelte:head>

<section class="hero">
	<p>Computer Science Week</p>
	<h1>Learn, compete, and connect.</h1>
	<p>Discover the events bringing our CS community together.</p>
	<a href="/events">Explore events</a>
</section>

<section class="upcoming">
	<h2>Upcoming Events</h2>
	{#if data.upcoming.length === 0}
		<p class="empty">No events open yet — check back soon.</p>
	{:else}
		<ul class="event-list">
			{#each data.upcoming as event (event.id)}
				<li class="event-card">
					<h3><a href={`/events/${event.id}`}>{event.title}</a></h3>
					<p class="date">{format(event.startAt)}</p>
					<p class="desc">{event.description ?? 'More details coming soon.'}</p>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	/* --- Hero --- */
	.hero {
		max-width: 640px;
		padding: 2rem 1rem;
	}
	.hero h1 {
		font-size: clamp(1.5rem, 4vw, 2.25rem);
		margin: 0.25rem 0;
	}
	.hero a {
		display: inline-block;
		margin-top: 0.75rem;
		padding: 0.5rem 1rem;
		background: #1d4ed8;
		color: #fff;
		text-decoration: none;
		border-radius: 6px;
	}

	/* --- Upcoming events --- */
	.upcoming {
		max-width: 640px;
		padding: 1.5rem 1rem 2rem;
	}
	.upcoming h2 {
		font-size: 1.25rem;
		margin-bottom: 0.75rem;
	}
	.empty {
		color: #666;
	}
	.event-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.event-card {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 1rem;
	}
	.event-card h3 {
		margin: 0 0 0.25rem;
		font-size: 1.1rem;
	}
	.event-card h3 a {
		color: #1d4ed8;
		text-decoration: none;
	}
	.date {
		font-size: 0.875rem;
		color: #555;
		margin: 0 0 0.35rem;
	}
	.desc {
		margin: 0;
		font-size: 0.95rem;
	}

	/* --- Responsive --- */
	@media (max-width: 480px) {
		.hero {
			padding: 1.25rem 0.75rem;
		}
		.upcoming {
			padding: 1rem 0.75rem 1.5rem;
		}
		.event-card {
			padding: 0.75rem;
		}
	}
</style>
