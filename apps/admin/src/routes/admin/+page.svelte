<script lang="ts">
	let { data } = $props();

	const stats = $derived([
		{
			label: 'Events',
			value: data.eventCount,
			sub: `${data.openEventCount} open`,
			href: '/admin/events',
			accent: 'rose'
		},
		{
			label: 'Registrations',
			value: data.registrationCount,
			sub: `${data.pendingCount} awaiting review`,
			href: '/admin/registrations',
			accent: 'plum'
		},
		{
			label: 'Confirmed',
			value: data.confirmedCount,
			sub: 'seats locked in',
			href: '/admin/registrations?status=confirmed',
			accent: 'ok'
		}
	]);
</script>

<svelte:head><title>Overview · CS Week Admin</title></svelte:head>

<section class="head">
	<p class="eyebrow">Console</p>
	<h1>Overview</h1>
	<p class="lede">A quick read on how the week is shaping up. Everything here opens into the detail.</p>
</section>

<div class="stats">
	{#each stats as s (s.label)}
		<a class="stat" class:rose={s.accent === 'rose'} class:plum={s.accent === 'plum'} class:ok={s.accent === 'ok'} href={s.href}>
			<span class="stat-value">{s.value}</span>
			<span class="stat-label">{s.label}</span>
			<span class="stat-sub">{s.sub}</span>
		</a>
	{/each}
</div>

<div class="actions">
	<h2>Common tasks</h2>
	<div class="actions-grid">
		<a class="action" href="/admin/events/new">
			<span class="action-title">Create an event</span>
			<span class="action-desc">Set a title, capacity, and registration window for a new CS Week event.</span>
		</a>
		<a class="action" href="/admin/events">
			<span class="action-title">Manage events</span>
			<span class="action-desc">Open, close, or edit existing events and their limits.</span>
		</a>
		<a class="action" href="/admin/registrations">
			<span class="action-title">Review registrations</span>
			<span class="action-desc">Search participants and confirm their seats for each event.</span>
		</a>
	</div>
</div>

<style>
	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: 1rem;
		margin-bottom: 2.25rem;
	}
	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		padding: 1.1rem 1.25rem;
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		text-decoration: none;
		transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
	}
	.stat:hover {
		transform: translateY(-2px);
		box-shadow: 0 2px 4px rgba(43, 36, 48, 0.05), 0 12px 28px rgba(43, 36, 48, 0.08);
		text-decoration: none;
		border-color: var(--rose-100);
	}
	.stat-value {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 2rem;
		line-height: 1.1;
		color: var(--plum);
	}
	.stat-value::after {
		content: '';
		display: block;
		width: 22px;
		height: 3px;
		border-radius: 2px;
		margin-top: 0.5rem;
	}
	.stat.rose .stat-value::after {
		background: var(--rose-600);
	}
	.stat.plum .stat-value::after {
		background: var(--plum);
	}
	.stat.ok .stat-value::after {
		background: var(--ok);
	}
	.stat-label {
		font-weight: 600;
		color: var(--plum);
		margin-top: 0.3rem;
	}
	.stat-sub {
		font-size: 0.8rem;
		color: var(--plum-soft);
	}

	.actions h2 {
		font-size: 1.15rem;
		margin-bottom: 0.9rem;
	}
	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}
	.action {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 1.15rem 1.25rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--card);
		text-decoration: none;
		transition: transform 0.12s ease, box-shadow 0.12s ease;
	}
	.action:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow);
		text-decoration: none;
	}
	.action-title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--rose-700);
	}
	.action-desc {
		font-size: 0.85rem;
		color: var(--plum-soft);
	}
</style>
