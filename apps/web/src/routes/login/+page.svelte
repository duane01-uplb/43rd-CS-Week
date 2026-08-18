<script lang="ts">let { form } = $props();</script>
<svelte:head><title>Log in | CS Week</title></svelte:head>
<h1>Log in</h1>
<form method="POST">
  <label>Email <input name="email" type="email" value={form?.email ?? ''} required /></label>
  <label>Password <input name="password" type="password" required /></label>
  {#if form?.error}<p role="alert">{form.error}</p>{/if}
  <button>Log in</button>
</form>
<p>New here? <a href="/signup">Create an account</a>.</p>
