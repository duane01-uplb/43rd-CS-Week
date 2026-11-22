<script lang="ts">
	let { label, note }: { label: string; note: string } = $props();
	let pinned = $state(false);
	let hovering = $state(false);
	const id = $props.id();
</script>

<div class="note" onpointerenter={e => hovering = e.pointerType === 'mouse'} onpointerleave={() => hovering = false}>
	<button aria-expanded={pinned || hovering} aria-controls={id} onclick={() => pinned = !pinned}
		onkeydown={e => { if (e.key === 'Escape') { pinned = false; hovering = false; } }}>
		{label} <span aria-hidden="true">{pinned || hovering ? '−' : '+'}</span>
	</button>
	<p {id} hidden={!pinned && !hovering}>{note}</p>
</div>

<style>
	.note{position:absolute;bottom:1rem;left:1rem;max-width:calc(100% - 2rem);width:max-content;background:var(--paper);color:var(--sumi);font:inherit;font-size:.85rem}
	button{background:transparent;border:0;color:inherit;font:inherit;font-weight:600;padding:.65rem .85rem;cursor:pointer}
	button span{margin-left:.75rem;color:var(--beni)}
	p{max-width:32ch;margin:0;padding:0 .85rem .75rem}
</style>
