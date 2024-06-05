<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { getModalStore } from '@skeletonlabs/skeleton';
	import { providers, selectedProvider } from '$lib/stores/wallet';
	import type { EIP6963ProviderDetail } from 'mipd';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	function selectWallet(provider: EIP6963ProviderDetail): void {
		selectedProvider.set(provider);
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article class="container mx-auto p-4">
			<ul class="space-y-4">
				{#each $providers as provider}
					<li
						on:click={() => selectWallet(provider)}
						class="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-lg transition duration-300 flex items-center cursor-pointer"
					>
						<img src={provider.info.icon} alt="{provider.info.icon} Icon" class="w-12 h-12 mr-4" />
						<div>
							<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
								{provider.info.name}
							</h3>
							<p class="text-gray-600 dark:text-gray-400">{provider.info.rdns}</p>
						</div>
					</li>
				{/each}
			</ul>
		</article>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
		</footer>
	</div>
{/if}
