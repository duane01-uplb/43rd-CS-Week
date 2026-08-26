<script lang="ts">
	let { data } = $props();

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

	const fieldMap = $derived(new Map(data.fields.map((f: FieldDef) => [`${f.eventId}:${f.fieldKey}`, f])));
	const responseEntries = (row: RegistrationRow) =>
		Object.entries((row.responses ?? {}) as Record<string, unknown>).map(([key, value]) => ({
			key,
			value,
			def: fieldMap.get(`${row.eventId}:${key}`)
		}));
</script>

<h2>Registrations</h2>
<form method="GET">
	<input name="q" placeholder="Event or participant" value={data.q} />
	<select name="status" value={data.status}>
		<option value="">All statuses</option>
		<option>confirmed</option>
		<option>pending</option>
		<option>cancelled</option>
	</select>
	<button>Filter</button>
	<a href="/admin/registrations/export?q={data.q}&status={data.status}">Export CSV</a>
</form>
<table>
	<thead>
		<tr><th>Participant</th><th>Event</th><th>Status</th><th>Registered</th></tr>
	</thead>
	<tbody>
		{#each data.rows as row (row.id)}
			<tr>
				<td>{row.name ?? 'Unnamed'}</td>
				<td>{row.event}</td>
				<td>{row.status}</td>
				<td>{new Date(row.createdAt).toLocaleString()}</td>
			</tr>
			{@const entries = responseEntries(row)}
			{#if entries.length}
				<tr>
					<td colspan="4">
						<details>
							<summary>Responses ({entries.length})</summary>
							<dl>
								{#each entries as entry (entry.key)}
									<dt>{entry.def?.label ?? entry.key}</dt>
									<dd>
										{#if typeof entry.value === 'boolean'}
											{entry.value ? 'Yes' : 'No'}
										{:else if entry.def?.fieldType === 'file' && typeof entry.value === 'string' && entry.value}
											<a href="/admin/registrations/file?path={encodeURIComponent(entry.value)}" target="_blank" rel="noopener">View uploaded image</a>
										{:else if typeof entry.value === 'string' && entry.value}
											{entry.value}
										{/if}
									</dd>
								{/each}
							</dl>
						</details>
					</td>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>
