<script lang="ts">import AppSidebar from '$lib/components/AppSidebar.svelte'; import AdminShellHeader from '$lib/components/AdminShellHeader.svelte'; let { data, children } = $props();</script>
<AdminShellHeader title="CS Week Admin" />
<div class="shell"><AppSidebar links={[{ title: 'Overview', href: '/admin' }, { title: 'Events', href: '/admin/events' }, { title: 'Registrations', href: '/admin/registrations' }]} /><main><p>Signed in as {data.profile.fullName ?? 'Administrator'}</p>{@render children()}</main></div>
<style>.shell { display: flex; } main { padding: 1rem; flex: 1; }</style>
