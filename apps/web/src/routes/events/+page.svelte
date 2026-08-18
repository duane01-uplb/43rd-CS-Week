<script lang="ts">let { data } = $props();
  const format = (date: Date) => new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' }).format(new Date(date));
</script>
<svelte:head><title>Events | CS Week</title></svelte:head>
<h1>CS Week events</h1>
<form method="GET"><label>Status <select name="status" value={data.status}><option value="open">Open for registration</option><option value="all">All events</option></select></label><label><input type="checkbox" name="upcoming" value="1" checked={data.upcoming} /> Upcoming only</label><button>Filter</button></form>
{#if data.events.length === 0}<p>No events match these filters yet. Check back soon.</p>{:else}<ul>{#each data.events as event}<li><h2><a href={`/events/${event.id}`}>{event.title}</a></h2><p>{format(event.startAt)} · {event.status}</p><p>{event.description ?? 'More details coming soon.'}</p></li>{/each}</ul>{/if}
