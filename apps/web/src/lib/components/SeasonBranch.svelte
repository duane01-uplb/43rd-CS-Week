<script lang="ts">
	let { progress = 0 } = $props();
	const shoots = [
		[66,314,33,281], [61,278,85,239], [57,245,24,205], [60,209,90,168],
		[55,171,25,137], [46,132,66,95], [40,104,15,70], [36,77,51,42],
		[32,57,18,28], [30,38,34,12]
	];
	const clamp = (n: number) => Math.max(0, Math.min(1,n));
</script>

<svg class="branch" viewBox="0 0 106 380" fill="none" aria-hidden="true">
	<defs>
		<g id="branch-flower">
			{#each [0,72,144,216,288] as angle}
				<path transform={'rotate('+angle+')'} d="M0 0C-2-1-5-4-4-7Q-3-10-1-9L0-7 2-9Q5-9 4-5Q3-2 0 0Z" fill="#eab9bc" stroke="#a96974" stroke-width=".5"/>
			{/each}
			<circle r="1.4" fill="#986434"/>
		</g>
	</defs>
	<path d="M88 380 Q69 348 66 314 T57 245 Q64 198 55 171 T40 104 Q35 81 32 57 T30 35" stroke="#785c53" stroke-width="2.4" pathLength="1" stroke-dasharray="1" stroke-dashoffset={1-(0.12+0.88*progress)} />
	{#each shoots as [x,y,tx,ty], i}
		{@const start = .06 + i*.084}
		{@const growth = clamp((progress-start)/.1)}
		{@const bloom = clamp((progress-start-.10)/.10)}
		<path d={'M'+x+' '+y+'Q'+tx+' '+(y-10)+' '+tx+' '+ty} stroke="#785c53" stroke-width="1.15" pathLength="1" stroke-dasharray="1" stroke-dashoffset={1-growth}/>
		<g transform={'translate('+tx+' '+ty+')'} opacity={clamp((growth-.75)*4)}>
			<ellipse cy="-2" rx="2.4" ry="4" fill="#af727e"/>
			<use href="#branch-flower" transform={'scale('+bloom+')'}/>
		</g>
	{/each}
</svg>

<style>
	.branch { position: fixed; right: 0; bottom: 0; width: clamp(3rem, 7vw, 7rem); height: auto; pointer-events: none; z-index: 3; }
	@media(max-width:700px){.branch{width:2.25rem;}}
</style>
