<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { CodeBlock, getModalStore } from '@skeletonlabs/skeleton';
	import { hacks_getQuota } from '$lib/hacks';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	// Local
	const modalStore = getModalStore();

	$: quota = hacks_getQuota($modalStore[0]?.value);

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>
			{#await quota}
				<p>...waiting</p>
			{:then data}
				<CodeBlock language="json" code={JSON.stringify(data, null, 2)}></CodeBlock>
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}
		</article>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        </footer>
	</div>
{/if}
