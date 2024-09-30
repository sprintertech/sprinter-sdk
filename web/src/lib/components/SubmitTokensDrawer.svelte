<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { sprinter } from '$lib/stores/sprinter';
	import { getNetworkByChainId, getTokenBySymbol } from '$lib/utils';
	import SkullCrossbonesSolid from '$lib/icons/SkullCrossbonesSolid.svelte';
	import TransactionCard from '$lib/components/TransactionCard.svelte';
	import { formatWei } from '$lib/formatters';

	const drawerStore = getDrawerStore();
	$: quota = $sprinter.bridgeAggregateBalance($drawerStore.meta.quota);
	$: token = getTokenBySymbol($drawerStore.meta.tokens, $drawerStore.meta.quota.token);
</script>

<div
	class="self-stretch px-5 py-1.5 bg-slate-50 dark:bg-gray-600 justify-center items-center gap-1.5 inline-flex"
>
	<div
		class="grow shrink basis-0 text-slate-400 dark:text-slate-200 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
	>
		Quotas
	</div>
</div>

<article class="container mx-auto p-4">
	<ul class="space-y-4">
		{#await quota}
			<li
				class="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center mb-4"
			>
				<div class="placeholder h-[68px] w-full rounded-lg" />
			</li>
		{:then response}
			{#if 'error' in response}
				<div class="alert variant-soft-error">
					<SkullCrossbonesSolid class="h-10 w-10 fill-error-800 opacity-75" />
					<div class="alert-message">
						<h3 class="h3">Error</h3>
						<p>{response.error}</p>
					</div>
				</div>
			{:else}
				{#each response as data}
					{@const network = getNetworkByChainId($drawerStore.meta.chains, data.sourceChain)}
					{@const balance = $drawerStore.meta.balances.find(
						({ chainId }) => chainId === data.sourceChain
					)}
					<TransactionCard
						{data}
						chain={network}
						{token}
						balance={formatWei(balance.balance, token.decimals)}
					/>
				{/each}
			{/if}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</ul>
</article>

<div
	class="w-full p-5 bg-white dark:bg-gray-800 border-t border-zinc-200 dark:border-gray-600 items-center gap-4 inline-flex mt-auto"
>
	<button
		on:click={() => {
			quota = $sprinter.bridgeAggregateBalance($drawerStore.meta.quota);
		}}
		class="w-full h-10 p-2.5 bg-white dark:bg-gray-700 rounded-[10px] shadow border border-zinc-200 dark:border-gray-600 justify-center items-center gap-1 inline-flex"
	>
		<div class="w-5 h-5 relative"></div>
		<div class="px-1 justify-center items-center flex">
			<div
				class="text-gray-600 dark:text-gray-200 text-sm font-medium font-['Inter'] leading-tight"
			>
				Get another Quota
			</div>
		</div>
	</button>
</div>
