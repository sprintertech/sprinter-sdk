<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { BASE_URL } from '@chainsafe/sprinter-sdk';
	import { Contract, eth, type NonPayableCallOptions } from 'web3';
	import { sprinterNameServiceAbi } from '$lib/sprinterNameService.abi';
	import { selectedProvider } from '$lib/stores/wallet';
	import { toWei } from 'web3-utils';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	let name = '';
	let donation = '';

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	async function onNameSubmit() {
		const SPRINTER_SEPOLIA_ADDRESS = '0x01D6Dbd6663f2a19aaec09381D3e3826Cdf96C4E';
		const sprinterNameService = new Contract(
			sprinterNameServiceAbi,
			SPRINTER_SEPOLIA_ADDRESS,
			$selectedProvider.provider
		);

		const address = (
			await $selectedProvider.provider.request({ method: 'eth_requestAccounts', params: [] })
		)[0];
		const amount = toWei(donation, 6);

		console.log(address, amount);

		const data = eth.abi.encodeParameters(['address', 'string'], [address, name]);
		console.log(data);

		// @ts-expect-error   // chainId is missing in web3js call options type
		const callOptions: NonPayableCallOptions = { chainId: 11155111 };

		console.log(callOptions);

		const url = new URL('/solutions/aggregation', BASE_URL);
		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				account: address,
				amount: amount,
				token: 'USDC',
				destination: 11155111,
				destinationContractCall: {
					callData: data,
					contractAddress: SPRINTER_SEPOLIA_ADDRESS,
					gasLimit: 10_000_000
				},
				type: 'fungible'
			})
		}).then((response) => response.json());

		console.log('r', response);
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex">
				{$modalStore[0].title ?? '(title missing)'}
			</div>
		</header>
		<article>
			<div class="self-stretch p-3 flex-col justify-center items-start gap-1 flex">
				<div
					class="self-stretch text-slate-700 dark:text-slate-300 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
				>
					set display name
				</div>
				<input
					type="text"
					bind:value={name}
					class="self-stretch h-10 px-4 py-3 rounded-lg border border-slate-700 dark:border-gray-600 mt-1 bg-transparent text-zinc-800 dark:text-zinc-200"
				/>
			</div>
			<div class="self-stretch p-3 flex-col justify-center items-start gap-1 flex">
				<div
					class="self-stretch text-slate-700 dark:text-slate-300 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
				>
					name upholding donation in USDC
				</div>
				<input
					type="number"
					bind:value={donation}
					class="self-stretch h-10 px-4 py-3 rounded-lg border border-slate-700 dark:border-gray-600 mt-1 bg-transparent text-zinc-800 dark:text-zinc-200"
				/>
			</div>
		</article>
		<footer class="modal-footer {parent.regionFooter}">
			<button
				class="btn {parent.buttonPositive}"
				on:click={onNameSubmit}
				disabled={!name.length || !donation}>Update Name</button
			>
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
				{parent.buttonTextCancel}
			</button>
		</footer>
	</div>
{/if}
