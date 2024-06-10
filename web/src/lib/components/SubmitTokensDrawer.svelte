<script lang="ts">
	import { fromWei, toHex } from 'web3-utils';
	import { formatDuration } from '$lib/formatters';
	import { hacks_getQuota } from '$lib/hacks';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { selectedProvider } from '$lib/stores/wallet';
	import { type NonPayableCallOptions, Web3 } from 'web3';
	import { erc20Abi } from '$lib/erc20.abi';

	const drawerStore = getDrawerStore();
	$: quota = hacks_getQuota($drawerStore.meta.quota);
	$: token = $drawerStore.meta.tokens.get($drawerStore.meta.quota.token);

	const submitting: boolean[] = [];
	const successful: boolean[] = [];
	// TODO: there is not place for this over here! refactor it to somewhere
	async function submitTransaction(quotaRecord: Object, index: number) {
		try {
			submitting[index] = true;

			const [ownerAddress] = await $selectedProvider.provider.request({
				method: 'eth_requestAccounts',
				params: []
			});

			// Preparation /w questionable approach but will see for now
			try {
				await $selectedProvider.provider.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: toHex(quotaRecord.sourceChain) }]
				});
			} catch (error) {
				if (error.code === 4902) {
					const network = $drawerStore.meta.networks.get(quotaRecord.sourceChain);
					await $selectedProvider.provider.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainName: network.name,
								chainId: toHex(quotaRecord.sourceChain),
								rpcUrls: network.rpcURLs
							}
						]
					});
				}
			}

			const web3 = new Web3($selectedProvider.provider);

			// @ts-ignore   // chainId is missing in web3js call options type
			const callOptions: NonPayableCallOptions = { chainId: quotaRecord.sourceChain };

			// Approval sniff etc...\
			const erc20 = new web3.eth.Contract(erc20Abi, quotaRecord.sourceTokenAddress);

			const allowed = await erc20.methods
				.allowance(ownerAddress, quotaRecord.transaction.to)
				.call(callOptions);

			if (BigInt(quotaRecord.amount) > BigInt(allowed)) {
				const approval = await erc20.methods
					.approve(quotaRecord.transaction.to, quotaRecord.amount)
					.send({
						...callOptions,
						from: ownerAddress
					});
				if (!approval.status) throw new Error('Not Approved!'); // To stop execution
			}

			// FINAL STEP!
			const receipt = await web3.eth.sendTransaction(quotaRecord.transaction);

			console.warn(`TX receipt: `, receipt);
			successful[index] = true;
		} catch (error) {
			console.error(error);
			submitting[index] = false;
		}
	}
</script>

<div class="self-stretch px-5 py-1.5 bg-slate-50 justify-center items-center gap-1.5 inline-flex">
	<div
		class="grow shrink basis-0 text-slate-400 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
	>
		Quotas
	</div>
</div>
{#await quota}
	<p>...waiting</p>
{:then response}
	<article class="container mx-auto p-4">
		<ul class="space-y-4">
			{#each response.data as data, index}
				{@const network = $drawerStore.meta.networks.get(data.sourceChain)}
				{@const balance = $drawerStore.meta.balances
					.get(token.symbol)
					.find(({ chainId }) => chainId === data.sourceChain)}
				<li
					class="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center mb-4"
				>
					<div class="flex items-center">
						<img src={network.logoURI} alt="Source Chain Icon" class="w-8 h-8 mr-2" />
						<div>
							<p class="text-lg font-semibold text-black dark:text-white">
								{fromWei(data.amount, token.decimals)}
								{token.name} on {network.name}
							</p>
							<p class="text-sm text-gray-600 dark:text-gray-400">
								Balance: {fromWei(balance.balance, token.decimals)}
								{token.name}
							</p>
							<p class="text-sm text-gray-600 dark:text-gray-400">
								Fee: {data.fee.amountUSD} USD
							</p>
						</div>
					</div>
					<div class="flex flex-col items-center justify-center h-full">
						{#if !successful[index]}
							<button
								class="border border-blue-500 text-blue-500 text-xs px-2 py-1 rounded mb-1"
								disabled={submitting[index]}
								on:click={() => submitTransaction(data, index)}
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

<div class="w-full p-5 bg-white border-t border-zinc-200 items-center gap-4 inline-flex mt-auto">
	<button
		on:click={() => {
			quota = hacks_getQuota($drawerStore.meta.quota);
		}}
		class="w-full h-10 p-2.5 bg-white rounded-[10px] shadow border border-zinc-200 justify-center items-center gap-1 inline-flex"
	>
		<div class="w-5 h-5 relative"></div>
		<div class="px-1 justify-center items-center flex">
			<div class="text-gray-600 text-sm font-medium font-['Inter'] leading-tight">
				Get another Quota
			</div>
		</div>
	</button>
</div>
