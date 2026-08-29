<script lang="ts">
	let { form } = $props();
</script>

<svelte:head><title>Create event · CS Week Admin</title></svelte:head>

<section class="head">
	<p class="eyebrow">Schedule</p>
	<h1>Create event</h1>
	<p class="lede">Set the basics. Registration fields are configured on the public site per event.</p>
</section>

<form method="POST" class="card">
	{#if form?.error}<p class="status-msg alert" role="alert">{form.error}</p>{/if}
	<div class="field">
		<label for="title">Title</label>
		<input id="title" name="title" required placeholder="e.g. Web Design Showcase" />
	</div>
	<div class="field">
		<label for="description">Description</label>
		<textarea id="description" name="description" placeholder="What attendees can expect…"></textarea>
	</div>
	<div class="field">
		<label for="startAt">Starts</label>
		<input id="startAt" name="startAt" type="datetime-local" required />
	</div>
	<div class="field">
		<label for="capacity">Capacity</label>
		<input id="capacity" name="capacity" type="number" min="1" placeholder="Leave blank for unlimited" />
	</div>
	<div class="field">
		<label for="status">Status</label>
		<select id="status" name="status">
			<option value="draft">Draft</option>
			<option value="open">Open</option>
			<option value="closed">Closed</option>
		</select>
	</div>
	<div class="actions">
		<button class="btn btn-primary" type="submit">Create event</button>
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
