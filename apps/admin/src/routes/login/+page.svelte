<script lang="ts">
	let { form } = $props();
</script>

<svelte:head><title>Admin Log In · CS Week</title></svelte:head>

<main class="login">
	<form method="POST" class="card">
		<div class="brand">
			<span class="brand-mark" aria-hidden="true"></span>
			<span class="brand-kicker">Computer Science Week</span>
			<h1>Admin sign in</h1>
		</div>

		{#if form?.error}
			<p class="status-msg alert" role="alert">{form.error}</p>
		{/if}

		<div class="field">
			<label for="email">Email</label>
			<input id="email" name="email" type="email" value={form?.email ?? ''} required autocomplete="email" />
		</div>
		<div class="field">
			<label for="password">Password</label>
			<input id="password" name="password" type="password" required autocomplete="current-password" />
		</div>

		<button class="btn btn-primary" type="submit">Log in</button>
	</form>
</main>

<style>
	.login {
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 1.5rem;
		background:
			radial-gradient(circle at 15% 12%, var(--rose-100) 0, transparent 42%),
			radial-gradient(circle at 85% 85%, var(--rose-050) 0, transparent 46%),
			var(--paper);
	}
	.card {
		width: 100%;
		max-width: 380px;
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 14px;
		box-shadow: var(--shadow);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.35rem;
		margin-bottom: 0.25rem;
	}
	.brand-mark {
		width: 46px;
		height: 46px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--rose-600), var(--rose-900));
		position: relative;
		box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.15);
		margin-bottom: 0.4rem;
	}
	.brand-mark::after {
		content: '';
		position: absolute;
		inset: 9px;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.6);
	}
	.brand-kicker {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--rose-700);
	}
	.card h1 {
		font-size: 1.45rem;
		margin: 0;
	}
</style>
