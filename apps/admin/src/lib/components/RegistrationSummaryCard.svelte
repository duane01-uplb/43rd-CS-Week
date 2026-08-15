<script lang="ts">
  export let name: string;
  export let email: string;
</script>

<div class="summary-card">
  <div>{name}</div>
  <div class="muted">{email}</div>
</div>

<style>
  .summary-card { padding: 0.5rem; border-bottom: 1px solid #eee; }
  .muted { color: #6b7280; font-size: 0.9rem; }
</style>
