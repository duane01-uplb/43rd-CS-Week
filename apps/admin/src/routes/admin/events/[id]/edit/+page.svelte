<script lang="ts">
	let { data, form } = $props();
	const toLocalInput = (date: string | Date) => new Date(date).toISOString().slice(0, 16);
</script>

<svelte:head><title>Edit event · CS Week Admin</title></svelte:head>

<section class="head">
	<p class="eyebrow">Schedule</p>
	<h1>Edit event</h1>
	<p class="lede">Update the basics below. Changes apply to anyone who hasn't signed up yet.</p>
</section>

<form method="POST" class="card">
	{#if data.registrationCount > 0}
		<p class="status-msg info" role="status">
			{data.registrationCount} participant{data.registrationCount === 1 ? '' : 's'} already registered. Lowering
			capacity below that number will not cancel existing seats.
		</p>
	{/if}
	{#if form?.error}<p class="status-msg alert" role="alert">{form.error}</p>{/if}

	<div class="field">
		<label for="title">Title</label>
		<input id="title" name="title" value={data.event.title} required />
	</div>
	<div class="field">
		<label for="description">Description</label>
		<textarea id="description" name="description">{data.event.description ?? ''}</textarea>
	</div>
	<div class="field">
		<label for="startAt">Starts</label>
		<input id="startAt" name="startAt" type="datetime-local" value={toLocalInput(data.event.startAt)} required />
	</div>
	<div class="field">
		<label for="capacity">Capacity</label>
		<input id="capacity" name="capacity" type="number" min="1" value={data.event.capacity ?? ''} />
	</div>
	<div class="field">
		<label for="status">Status</label>
		<select id="status" name="status" value={data.event.status}>
			<option value="draft">Draft</option>
			<option value="open">Open</option>
			<option value="closed">Closed</option>
		</select>
	</div>
	<div class="actions">
		<button class="btn btn-primary" type="submit">Save changes</button>
		<a class="btn btn-ghost" href="/admin/events">Cancel</a>
	</div>
</form>

<style>
	.card {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: 1.5rem;
		max-width: 560px;
	}
	.actions {
		display: flex;
		gap: 0.6rem;
		margin-top: 0.5rem;
	}
</style>
