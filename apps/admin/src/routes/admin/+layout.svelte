<script lang="ts">
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	let { data, children } = $props();

	const name = $derived(data.profile.fullName ?? 'Administrator');
	const initial = $derived(name.trim().charAt(0).toUpperCase() || 'A');
</script>

<div class="shell">
	<AppSidebar
		links={[
			{ title: 'Overview', href: '/admin' },
			{ title: 'Events', href: '/admin/events' },
			{ title: 'Registrations', href: '/admin/registrations' }
		]}
	/>

	<div class="content">
		<header class="topbar">
			<div class="whoami">
				<span class="avatar" aria-hidden="true">{initial}</span>
				<span class="who-text">
					<span class="who-label">Signed in as</span>
					<span class="who-name">{name}</span>
				</span>
			</div>
		</header>

		<main class="main">{@render children()}</main>
	</div>
</div>

<style>
	.shell {
		display: flex;
		min-height: 100vh;
	}

	.content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.topbar {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 0.9rem 2rem;
		border-bottom: 1px solid var(--line);
		background: var(--card);
	}
	.whoami {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}
	.avatar {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--rose-100);
		color: var(--rose-900);
		display: grid;
		place-items: center;
		font-weight: 600;
		font-size: 0.85rem;
	}
	.who-text {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}
	.who-label {
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--plum-soft);
	}
	.who-name {
		font-weight: 600;
		color: var(--plum);
	}

	.main {
		flex: 1;
		padding: 2rem;
		max-width: 1080px;
		width: 100%;
	}

	@media (max-width: 720px) {
		.shell {
			flex-direction: column;
		}
		.main {
			padding: 1.25rem 1rem;
		}
		.topbar {
			padding: 0.6rem 1rem;
		}
	}
</style>
