<script lang="ts">
	let { label }: { label: string } = $props();
</script>

<div class="loading-screen" role="status">
	<div class="loading-bloom" aria-hidden="true">
		{#each [0, 1, 2, 3, 4] as petal (petal)}
			<span style:--angle={`${petal * 72}deg`} style:--delay={`${petal * 25}ms`}></span>
		{/each}
	</div>
	<p>{label}…</p>
</div>

<style>
	.loading-screen {
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 0.75rem;
		min-height: 16rem;
		border-radius: var(--radius);
		background: var(--plum);
		color: var(--rose-100);
	}
	p {
		margin: 0;
	}
	.loading-bloom {
		position: relative;
		width: 4rem;
		aspect-ratio: 1;
	}
	.loading-bloom span {
		position: absolute;
		top: 3%;
		left: 33%;
		width: 34%;
		height: 47%;
		transform: rotate(var(--angle));
		transform-origin: center bottom;
	}
	.loading-bloom span::before {
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 48% 48% 54% 54% / 43% 43% 69% 69%;
		clip-path: polygon(0 0, 38% 0, 50% 10%, 62% 0, 100% 0, 100% 100%, 0 100%);
		background: linear-gradient(var(--rose-100), var(--rose-600));
		transform-origin: center bottom;
	}
	@media (prefers-reduced-motion: no-preference) {
		.loading-bloom span::before {
			animation: bloom 560ms ease-out var(--delay) both;
		}
	}
	@keyframes bloom {
		from { transform: scale(0.35); }
		to { transform: scale(1); }
	}
</style>
