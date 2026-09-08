<script lang="ts">
	type FieldDef = { eventId: string; fieldKey: string; label: string; fieldType: string; sortOrder: number };
	type RegistrationRow = {
		id: string;
		eventId: string;
		status: string;
		createdAt: Date | string;
		responses: unknown;
		event: string;
		name: string | null;
	};

	interface Props {
		data: {
			rows: RegistrationRow[];
			fields: FieldDef[];
			q: string;
			status: string;
		};
	}
	let { data }: Props = $props();

	const fieldMap = $derived(new Map(data.fields.map((f) => [`${f.eventId}:${f.fieldKey}`, f])));
	const responseEntries = (row: RegistrationRow) =>
		Object.entries((row.responses ?? {}) as Record<string, unknown>).map(([key, value]) => ({
			key,
			value,
			def: fieldMap.get(`${row.eventId}:${key}`)
		}));

	const statusBadge = (s: string) => `badge badge-${s}`;
	const hasFilter = $derived(data.q !== '' || data.status !== '');
	const fmtDate = (d: Date | string) =>
		new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' }).format(
			new Date(d)
		);
</script>

<svelte:head><title>Registrations · CS Week Admin</title></svelte:head>

<section class="head row">
	<div>
		<p class="eyebrow">Attendance</p>
		<h1>Registrations</h1>
	</div>
	<a
		class="btn btn-ghost"
		href="/admin/registrations/export?q={data.q}&status={data.status}"
	>Export CSV</a>
</section>

<form class="filters" method="GET" role="search">
	<label class="search">
		<span class="sr">Search</span>
		<input name="q" placeholder="Search event or participant…" value={data.q} />
	</label>
	<label class="status">
		<span class="sr">Status</span>
		<select name="status" value={data.status}>
			<option value="">All statuses</option>
			<option value="confirmed">Confirmed</option>
			<option value="pending">Pending</option>
			<option value="cancelled">Cancelled</option>
		</select>
	</label>
	<button class="btn btn-primary" type="submit">Filter</button>
	{#if hasFilter}
		<a class="btn btn-ghost" href="/admin/registrations">Clear</a>
	{/if}
</form>

{#if data.rows.length === 0}
	<div class="empty">
		<p class="empty-title">
			{#if hasFilter}
				No matches{/if}{#if !hasFilter}No registrations yet{/if}
		</p>
		<p class="empty-desc">
			{#if hasFilter}
				Try a different name, event, or status.
			{:else}
				Participant sign-ups will appear here as CS Week goes live.
			{/if}
		</p>
		{#if hasFilter}
			<a class="btn btn-ghost" href="/admin/registrations">Clear filters</a>
		{/if}
	</div>
{:else}
	<p class="count" role="status">{data.rows.length} registration{data.rows.length === 1 ? '' : 's'}</p>
	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th>Participant</th>
					<th>Event</th>
					<th>Status</th>
					<th>Registered</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.rows as row (row.id)}
					{@const entries = responseEntries(row)}
					<tr class="main-row">
						<td class="strong">{row.name ?? 'Unnamed'}</td>
						<td>{row.event}</td>
						<td><span class={statusBadge(row.status)}>{row.status}</span></td>
						<td>{fmtDate(row.createdAt)}</td>
						<td class="align-right">
							{#if entries.length}
								<details class="responses">
									<summary>{entries.length} response{entries.length === 1 ? '' : 's'}</summary>
								</details>
							{/if}
						</td>
					</tr>
					{#if entries.length}
						<tr class="detail-row">
							<td colspan="5">
								<div class="responses-panel">
									<dl class="res-list">
										{#each entries as entry (entry.key)}
											<div class="res-item">
												<dt>{entry.def?.label ?? entry.key}</dt>
												<dd>
													{#if typeof entry.value === 'boolean'}
														{entry.value ? 'Yes' : 'No'}
													{:else if entry.def?.fieldType === 'file' && typeof entry.value === 'string' && entry.value}
														<a href="/admin/registrations/file?path={encodeURIComponent(entry.value)}" target="_blank" rel="noopener">
															View uploaded file
														</a>
													{:else if typeof entry.value === 'string' && entry.value}
														{entry.value}
													{:else}
														<span class="muted">—</span>
													{/if}
												</dd>
											</div>
										{/each}
									</dl>
								</div>
							</td>
						</tr>
					{/if}
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
		margin-bottom: 1.25rem;
	}
	.head.row h1 {
		margin-bottom: 0;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 1rem;
	}
	.search {
		flex: 1;
		min-width: 220px;
	}
	.search input {
		font-family: inherit;
		font-size: 0.92rem;
		padding: 0.55rem 0.8rem;
		border-radius: 8px;
		border: 1px solid var(--line);
		background: #fff;
		color: var(--plum);
		width: 100%;
	}
	.search input:focus-visible,
	.status select:focus-visible {
		border-color: var(--rose-600);
		box-shadow: var(--focus);
		outline: none;
	}
	.status select {
		font-family: inherit;
		font-size: 0.92rem;
		padding: 0.55rem 0.8rem;
		border-radius: 8px;
		border: 1px solid var(--line);
		background: #fff;
		color: var(--plum);
	}

	.count {
		margin: 0 0 0.6rem;
		font-size: 0.82rem;
		color: var(--plum-soft);
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
		min-width: 720px;
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
	td {
		padding: 0.8rem 1rem;
		border-bottom: 1px solid var(--line);
		vertical-align: top;
	}
	.strong {
		font-weight: 600;
		color: var(--plum);
	}
	.align-right {
		text-align: right;
		width: 1%;
	}

	.responses summary {
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--rose-700);
		user-select: none;
	}
	.responses summary:hover {
		text-decoration: underline;
	}
	.detail-row td {
		background: var(--rose-050);
		padding: 0.6rem 1rem 1rem;
	}
	.responses-panel {
		border-top: 1px dashed var(--line);
		padding-top: 0.6rem;
	}
	.res-list {
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 0.7rem 1.4rem;
	}
	.res-item dt {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--plum-soft);
		margin-bottom: 0.1rem;
	}
	.res-item dd {
		margin: 0;
		font-size: 0.9rem;
		color: var(--plum);
		word-break: break-word;
	}
	.muted {
		color: var(--plum-soft);
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
		font-weight: 700;
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
