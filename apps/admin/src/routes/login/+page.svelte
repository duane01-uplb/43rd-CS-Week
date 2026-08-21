<script lang="ts">
  let { form } = $props();
</script>

<svelte:head><title>Admin log in | CS Week</title></svelte:head>

<h1>Admin log in</h1>
<form method="POST">
  <label>Email <input name="email" type="email" value={form?.email ?? ''} required /></label>
  <label>Password <input name="password" type="password" required /></label>
  {#if form?.error}<p role="alert">{form.error}</p>{/if}
  <button>Log in</button>
</form>
