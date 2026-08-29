<script lang="ts">
	let { data } = $props();

	const fmtDate = (d: string | Date) =>
		new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' }).format(
			new Date(d)
		);

	const statusBadge = (s: string) => `badge badge-${s}`;
</script>

<svelte:head><title>Events · CS Week Admin</title></svelte:head>

<section class="head row">
	<div>
		<p class="eyebrow">Schedule</p>
		<h1>Events</h1>
	</div>
	<a class="btn btn-primary" href="/admin/events/new">Create event</a>
</section>

{#if data.events.length === 0}
	<div class="empty">
		<p class="empty-title">No events yet</p>
		<p class="empty-desc">Add your first CS Week event to start collecting registrations.</p>
		<a class="btn btn-primary" href="/admin/events/new">Create event</a>
	</div>
{:else}
	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th>Event</th>
					<th>Starts</th>
					<th>Capacity</th>
					<th>Status</th>
					<th class="align-right"><span class="sr">Actions</span></th>
				</tr>
			</thead>
			<tbody>
				{#each data.events as event (event.id)}
					<tr>
						<td class="cell-title">
							<a href={`/admin/events/${event.id}/edit`}>{event.title}</a>
							{#if event.description}<span class="cell-desc">{event.description}</span>{/if}
						</td>
						<td>{fmtDate(event.startAt)}</td>
						<td>{event.capacity ?? 'Unlimited'}</td>
						<td><span class={statusBadge(event.status)}>{event.status}</span></td>
						<td class="align-right">
							<a class="btn btn-ghost btn-sm" href={`/admin/events/${event.id}/edit`}>Edit</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	.head.row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}
	.head.row h1 {
		margin-bottom: 0;
	}

	.btn-sm {
		padding: 0.35rem 0.7rem;
		font-size: 0.8rem;
	}

	.table-wrap {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		overflow-x: auto;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
		min-width: 620px;
	}
	th {
		text-align: left;
		padding: 0.8rem 1rem;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--plum-soft);
		border-bottom: 1px solid var(--line);
		background: var(--rose-050);
	}
	th.align-right {
		text-align: right;
		width: 1%;
	}
	td {
		padding: 0.85rem 1rem;
		border-bottom: 1px solid var(--line);
		vertical-align: top;
	}
	tbody tr:last-child td {
		border-bottom: none;
	}
	tbody tr:hover td {
		background: var(--rose-050);
	}
	.cell-title a {
		font-weight: 600;
		color: var(--plum);
		text-decoration: none;
	}
	.cell-title a:hover {
		color: var(--rose-700);
		text-decoration: underline;
	}
	.cell-desc {
		display: block;
		margin-top: 0.15rem;
		font-size: 0.8rem;
		color: var(--plum-soft);
		max-width: 34ch;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.align-right {
		text-align: right;
	}

	.empty {
		text-align: center;
		padding: 3rem 1.5rem;
		border: 1px dashed var(--line);
		border-radius: var(--radius);
		background: var(--card);
	}
	.empty-title {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.2rem;
		margin: 0 0 0.3rem;
	}
	.empty-desc {
		color: var(--plum-soft);
		margin: 0 0 1.1rem;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	@media (max-width: 720px) {
		.head.row {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
