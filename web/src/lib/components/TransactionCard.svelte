<script lang="ts">
	import { fromWei, toHex } from 'web3-utils';
	import { formatDuration } from '$lib/formatters.js';
	import { type Chain, type FungibleToken, type Solution } from '@chainsafe/sprinter-sdk';
	import { selectedProvider } from '$lib/stores/wallet';
	import { type NonPayableCallOptions, Web3 } from 'web3';
	import { erc20Abi } from '$lib/erc20.abi';

	export let chain: Chain;
	export let token: FungibleToken;
	export let balance: string;

	export let data: Solution;

	let submitting: boolean = false;
	let successful: boolean = false;

	// TODO: there is not place for this over here! refactor it to somewhere
	async function submitTransaction(quotaRecord: Solution) {
		try {
			submitting = true;

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
					await $selectedProvider.provider.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainName: chain.name,
								chainId: toHex(quotaRecord.sourceChain),
								rpcUrls: chain.rpcURLs
							}
						]
					});
				}
			}

			const web3 = new Web3($selectedProvider.provider);

			// @ts-expect-error   // chainId is missing in web3js call options type
			const callOptions: NonPayableCallOptions = { chainId: quotaRecord.sourceChain };

			// Approval sniff etc...\
			if (quotaRecord.approvals?.length > 0) {
				for (const approval in quotaRecord.approvals) {
					const receipt = await web3.eth.sendTransaction(approval);
					console.warn(`Approval receipt: `, receipt);
				}
			} else {
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
			}

			// FINAL STEP!
			const receipt = await web3.eth.sendTransaction(quotaRecord.transaction);

			console.warn(`TX receipt: `, receipt);
			successful = true;
		} catch (error) {
			console.error(error);
			submitting = false;
		}
	}
</script>

<li class="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center mb-4">
	<div class="flex items-center">
		<img src={chain.logoURI} alt="Source Chain Icon" class="w-8 h-8 mr-2" />
		<div>
			<p class="text-lg font-semibold text-black dark:text-white">
				{fromWei(data.amount, token.decimals)}
				{token.name} on {chain.name}
			</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Balance: {balance}
				{token.name}
			</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Fee: {data.fee.amountUSD} USD
			</p>
		</div>
	</div>
	<div class="flex flex-col items-center justify-center h-full">
		{#if !successful}
			<button
				class="border border-blue-500 text-blue-500 text-xs px-2 py-1 rounded mb-1 dark:border-blue-300 dark:text-blue-300"
				disabled={submitting}
				on:click={() => submitTransaction(data)}
			>
				Submit & Send
			</button>
			<p class="text-gray-400 dark:text-gray-500 text-xs">
				Estimated Time {formatDuration(data.duration)}
			</p>
		{:else}
			<svg
				class="w-6 h-6 text-green-500 dark:text-green-300"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
				></path>
			</svg>
		{/if}
	</div>
</li>
