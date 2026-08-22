<script lang="ts">
  let { data, form } = $props();
  const toLocalInput = (date: string | Date) => new Date(date).toISOString().slice(0, 16);
</script>

<h2>Edit event</h2>
{#if data.registrationCount > 0}
  <p role="status">{data.registrationCount} participant(s) already registered.</p>
{/if}
<form method="POST">
  <label>Title <input name="title" value={data.event.title} required /></label>
  <label>Description <textarea name="description">{data.event.description ?? ''}</textarea></label>
  <label>Start <input name="startAt" type="datetime-local" value={toLocalInput(data.event.startAt)} required /></label>
  <label>Capacity <input name="capacity" type="number" min="1" value={data.event.capacity ?? ''} /></label>
  <label>Status
    <select name="status" value={data.event.status}>
      <option value="draft">Draft</option>
      <option value="open">Open</option>
      <option value="closed">Closed</option>
    </select>
  </label>
  {#if form?.error}<p role="alert">{form.error}</p>{/if}
  <button>Save changes</button>
</form>
