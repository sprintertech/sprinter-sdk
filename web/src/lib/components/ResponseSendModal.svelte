<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { getModalStore } from '@skeletonlabs/skeleton';
	import { hacks_getQuota } from '$lib/hacks';
	import { formatDuration } from '$lib/formatters';
	import { fromWei, toHex } from 'web3-utils';
	import { selectedProvider } from '$lib/stores/wallet';
	import { Web3 } from 'web3';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	// Local
	const modalStore = getModalStore();

	$: quota = hacks_getQuota($modalStore[0]?.value);
	$: token = $modalStore[0]?.meta.tokens.get($modalStore[0]?.value.token);

	const submitting: boolean[] = [];
	const successful: boolean[] = [];
	// TODO: there is not place for this over here! refactor it to somewhere
	async function submitTransaction(transaction: Object, index: number) {
		try {
			submitting[index] = true;

			// Preparation /w questionable approach but will see for now
			try {
				await $selectedProvider.provider.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: toHex(transaction.chainId) }]
				});
			} catch (error) {
				if (error.code === 4902) {
					const network = $modalStore[0]?.meta.networks.get(transaction.chainId);
					await $selectedProvider.provider.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainName: network.name,
								chainId: toHex(transaction.chainId),
								rpcUrls: network.rpcURLs
							}
						]
					});
				}
			}

			const web3 = new Web3($selectedProvider.provider);
			const receipt = await web3.eth.sendTransaction(transaction);

			console.warn(`TX receipt: `, receipt);
			successful[index] = true;
		} catch {
			submitting[index] = false;
		}
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
						{#each response.data as data, index}
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
									{#if !successful[index]}
										<button
											class="border border-blue-500 text-blue-500 text-xs px-2 py-1 rounded mb-1"
											disabled={submitting[index]}
											on:click={() => submitTransaction(data.transaction, index)}
										>
											Submit & Send
										</button>
										<p class="text-gray-400 text-xs">
											Estimated Time {formatDuration(data.duration)}
										</p>
									{:else}
										<svg
											class="w-6 h-6 text-green-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											></path>
										</svg>
									{/if}
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
