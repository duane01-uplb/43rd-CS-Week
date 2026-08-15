<script lang="ts">
  export let links: { title: string; href: string }[] = [];
</script>

<nav class="app-sidebar">
  <ul>
    {#each links as l}
      <li><a href={l.href}>{l.title}</a></li>
    {/each}
  </ul>
</nav>

<style>
  .app-sidebar { padding: 1rem; width: 220px; }
  .app-sidebar ul { list-style: none; padding: 0; }
</style>
