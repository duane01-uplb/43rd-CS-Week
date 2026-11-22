<script lang="ts">
	let { data } = $props();

	const stats = $derived([
		{
			label: 'Events',
			value: data.eventCount,
			sub: `${data.openEventCount} open`,
			href: '/admin/events'
		},
		{
			label: 'Registrations',
			value: data.registrationCount,
			sub: `${data.pendingCount} awaiting review`,
			href: '/admin/registrations'
		},
		{
			label: 'Confirmed registrations',
			value: data.confirmedCount,
			sub: '',
			href: '/admin/registrations?status=confirmed'
		}
	]);
</script>

<svelte:head><title>Overview · CS Week Admin</title></svelte:head>

<header class="head overview-header">
	<h1>Overview</h1>
	<a class="btn btn-primary" href="/admin/events/new">Create an event</a>
</header>

<ul class="summary">
	{#each stats as stat (stat.href)}
		<li>
			<a href={stat.href}>
				<span>
					<strong>{stat.label}</strong>
					{#if stat.sub}<span class="detail">{stat.sub}</span>{/if}
				</span>
				<span class="stat-value">{stat.value}</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	.overview-header, .summary a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.overview-header { flex-wrap: wrap; margin-bottom: 1.5rem; }
	.overview-header h1 { margin: 0; }
	.summary {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	.summary li { border-bottom: 1px solid var(--line); }
	.summary a { padding: 1rem 0.75rem; color: var(--plum); }
	.summary a:hover, .summary a:focus-visible {
		background: var(--rose-050);
		text-decoration: none;
	}
	.summary a:hover strong, .summary a:focus-visible strong { text-decoration: underline; }
	.detail { display: block; color: var(--plum-soft); font-size: 0.875rem; }
	.stat-value { font: 700 1.25rem var(--font-display); font-variant-numeric: tabular-nums; }
</style>
