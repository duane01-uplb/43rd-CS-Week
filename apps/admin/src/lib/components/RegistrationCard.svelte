<script lang="ts">
  export let title: string;
  export let date: string;
</script>

<article class="registration-card">
  <h3>{title}</h3>
  <p>{date}</p>
</article>

<style>
  .registration-card { border: 1px solid #e5e7eb; padding: 0.75rem; border-radius: 6px; }
</style>
