<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { type Solution } from '@chainsafe/sprinter-sdk';
	import { Contract } from 'web3';
	import { toWei } from 'web3-utils';
	import { sprinter, SPRINTER_SEPOLIA_ADDRESS } from '$lib/stores/sprinter';
	import TransactionCard from '$lib/components/TransactionCard.svelte';
	import { getNetworkByChainId, getTokenBySymbol } from '$lib/utils';
	import SkullCrossbonesSolid from '$lib/icons/SkullCrossbonesSolid.svelte';
	import { sprinterNameServiceAbi } from '$lib/sprinterNameService.abi';
	import { selectedAccount } from '$lib/stores/wallet';
	import type { Address } from '@chainsafe/sprinter-sdk';
	import { formatWei } from '$lib/formatters';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	const token = $sprinter
		.getAvailableTokens()
		.then((response) => getTokenBySymbol(response, 'USDC'));
	const balances = $sprinter
		.getUserBalances($selectedAccount as Address)
		.then((response) => response['USDC'].balances ?? []);
	const chains = $sprinter.getAvailableChains();

	let name = '';
	let donation = '';

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	let transactions: Solution[] = [];
	let hasError = false;
	let fetching = false;

	async function onNameSubmit() {
		fetching = true;

		const amount = Number(toWei(donation, 6));
		const sprinterNameService = new Contract(sprinterNameServiceAbi);

		const data = sprinterNameService.methods
			.claimName(name, $selectedAccount as Address, amount)
			.encodeABI();

		const response = await $sprinter.bridgeAndCall({
			amount: amount,
			account: $selectedAccount as Address,
			token: 'USDC',
			destinationChain: 11155111,
			contractCall: {
				callData: data,
				contractAddress: SPRINTER_SEPOLIA_ADDRESS,
				approvalAddress: SPRINTER_SEPOLIA_ADDRESS,
				gasLimit: 1_000_000
			}
		});

		fetching = false;
		if ('error' in response) {
			hasError = true;
			return;
		}
		hasError = false;
		transactions = response;
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex">
				{$modalStore[0].title ?? '(title missing)'}
			</div>
		</header>
		{#if transactions.length}
			{#await Promise.all([chains, balances, token])}
				...
			{:then [_chains, _balances, _token]}
				<article>
					<ul class="space-y-4">
						{#each transactions as data}
							{@const network = getNetworkByChainId(_chains, data.sourceChain)}
							{@const balance = _balances.find(({ chainId }) => chainId === data.sourceChain)}
							<TransactionCard
								{data}
								chain={network}
								token={_token}
								balance={formatWei((balance || { balance: '0' }).balance, _token.decimals)}
							/>
						{/each}
					</ul>
				</article>
			{/await}
		{:else}
			<article>
				{#if hasError}
					<div class="alert variant-soft-error">
						<SkullCrossbonesSolid class="h-10 w-10 fill-error-800 opacity-75" />
						<div class="alert-message">
							<h3 class="h3">Something went wrong</h3>
							<p>
								Possible to low donation or insufficient funds.<br />Try again with different
								donation value
							</p>
						</div>
					</div>
					<br />
				{/if}
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
		{/if}
		<footer class="modal-footer {parent.regionFooter}">
			{#if !transactions.length}
				<button
					class="btn {parent.buttonPositive}"
					on:click={onNameSubmit}
					disabled={!name.length || !donation || fetching}>Update Name</button
				>
			{/if}
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
				{parent.buttonTextCancel}
			</button>
		</footer>
	</div>
{/if}
