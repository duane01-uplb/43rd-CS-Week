<script lang="ts">
  export let open: boolean = false;
</script>

{#if open}
  <div class="dialog-backdrop">
    <div class="dialog">
      <slot />
    </div>
  </div>
{/if}

<style>
  .dialog-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; }
  .dialog { background: white; padding: 1rem; border-radius: 8px; max-width: 600px; }
</style>
