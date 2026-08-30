<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

	type ButtonVariant = 'primary' | 'ghost' | 'ghost-dark' | 'white';
	type ButtonSize = 'sm' | 'md' | 'lg';

	type Props = {
		variant?: ButtonVariant;
		size?: ButtonSize;
		fullWidth?: boolean;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		children: Snippet;
	} & (HTMLButtonAttributes | HTMLAnchorAttributes);

	let {
		variant = 'primary',
		size = 'md',
		fullWidth = false,
		href = undefined,
		type = 'button',
		disabled = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const computedClass = $derived(
		`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`.trim()
	);
</script>

{#if href}
	<a {href} class={computedClass} {...(restProps as HTMLAnchorAttributes)}>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} class={computedClass} {...(restProps as HTMLButtonAttributes)}>
		{@render children()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border-radius: var(--radius-sm);
		border: 1px solid transparent;
		font-family: var(--font-body);
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		white-space: nowrap;
		transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease, color 0.15s ease;
	}
	.btn:hover {
		text-decoration: none;
	}
	.btn:active:not(:disabled) {
		transform: translateY(1px);
	}
	.btn:disabled {
		opacity: 0.65;
		cursor: not-allowed;
	}

	.btn-primary {
		background: var(--rose-700);
		color: #ffffff;
		box-shadow: 0 2px 8px rgba(166, 58, 92, 0.25);
	}
	.btn-primary:hover:not(:disabled) {
		background: var(--rose-800);
		color: #ffffff;
		box-shadow: 0 4px 14px rgba(166, 58, 92, 0.35);
	}
	.btn-ghost {
		background: transparent;
		color: var(--plum);
		border-color: var(--line);
	}
	.btn-ghost:hover:not(:disabled) {
		background: var(--rose-050);
		border-color: var(--rose-100);
		color: var(--rose-800);
	}
	.btn-ghost-dark {
		background: rgba(255, 255, 255, 0.06);
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.18);
		backdrop-filter: blur(8px);
	}
	.btn-ghost-dark:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.35);
		color: #ffffff;
	}
	.btn-white {
		background: #ffffff;
		color: var(--rose-900);
	}
	.btn-white:hover:not(:disabled) {
		background: var(--rose-050);
		color: var(--rose-800);
	}

	.btn-sm {
		padding: 0.42rem 0.95rem;
		font-size: 0.88rem;
		border-radius: var(--radius-sm);
	}
	.btn-md {
		padding: 0.62rem 1.25rem;
		font-size: 0.95rem;
		border-radius: var(--radius-sm);
	}
	.btn-lg {
		padding: 0.85rem 1.65rem;
		font-size: 1.02rem;
		border-radius: var(--radius);
	}
	.btn-full {
		width: 100%;
	}
</style>
