<script lang="ts">let { form } = $props();</script>
<svelte:head><title>Sign up | CS Week</title></svelte:head>
<h1>Create an account</h1>
<form method="POST">
  <label>Name <input name="fullName" value={form?.fullName ?? ''} required /></label>
  <label>Email <input name="email" type="email" value={form?.email ?? ''} required /></label>
  <label>Password <input name="password" type="password" minlength="8" required /></label>
  {#if form?.error}<p role="alert">{form.error}</p>{/if}
  <button>Create account</button>
</form>
<p>Already registered? <a href="/login">Log in</a>.</p>
