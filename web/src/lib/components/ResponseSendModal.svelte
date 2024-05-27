<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { getModalStore } from '@skeletonlabs/skeleton';
	import { hacks_getQuota } from '$lib/hacks';
	import { formatDuration } from '$lib/formatters';
	import { fromWei } from 'web3-utils';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	// Local
	const modalStore = getModalStore();

	$: quota = hacks_getQuota($modalStore[0]?.value);
	$: token = $modalStore[0]?.meta.tokens.get($modalStore[0]?.value.token);

	async function submitTransaction(transaction: Object) {
		console.log(transaction);
	}

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
			{:then response}
				<article class="container mx-auto p-4">
					<ul class="space-y-4">
						{#each response.data as data}
							{@const network = $modalStore[0]?.meta.networks.get(data.sourceChain)}
							{@const balance = $modalStore[0]?.meta.balances
								.get(token.symbol)
								.find(({ chainId }) => chainId === data.sourceChain)}
							<li class="bg-gray-700 p-4 rounded-lg flex justify-between items-center mb-4">
								<div class="flex items-center">
									<img src={network.logoURI} alt="Source Chain Icon" class="w-8 h-8 mr-2" />
									<div>
										<p class="text-lg font-semibold">
											{fromWei(data.transaction.value, token.decimals)}
											{token.name} on {network.name}
										</p>
										<p class="text-sm text-gray-400">
											Balance: {fromWei(balance.balance, token.decimals)}
											{token.name}
										</p>
										<p class="text-sm text-gray-400">Fee: {data.fee.amountUSD} USD</p>
									</div>
								</div>
								<div class="flex flex-col items-center justify-center h-full">
									<button
										class="border border-blue-500 text-blue-500 text-xs px-2 py-1 rounded mb-1"
										on:click={() => submitTransaction(data.transaction)}
									>
										Submit & Send
									</button>
									<p class="text-gray-400 text-xs">
										Estimated Time {formatDuration(data.duration)}
									</p>
								</div>
							</li>
						{/each}
					</ul>
				</article>
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}
		</article>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
				{parent.buttonTextCancel}
			</button>
		</footer>
	</div>
{/if}
