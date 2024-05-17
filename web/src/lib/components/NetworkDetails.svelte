<script lang="ts">
	import { hacks_getChainIcon, hacks_getNetworkDetails } from '$lib/hacks';
	import { AccordionItem } from '@skeletonlabs/skeleton';

	export let chainID;
	export let name;

	const promise = hacks_getNetworkDetails(chainID);
</script>

<AccordionItem>
	<svelte:fragment slot="lead"
		><img class="size-8" src={hacks_getChainIcon(chainID)} alt={chainID} /></svelte:fragment
	>
	<svelte:fragment slot="summary">{name}</svelte:fragment>
	<svelte:fragment slot="content">
		{#await promise}
			<p>...waiting</p>
		{:then tokens}
			{console.warn(JSON.stringify(tokens, null, 2))}
			<ul class="list">
				{#each tokens.data as token}
					<li>
						<span><img class="size-8" src={token.LogoURI} alt={chainID} /></span>
						<span class="flex-auto">{token.Name}</span>
						<span class="flex-auto">Balance: {tokens.assetsMap[token.Symbol].balance}</span>
					</li>
				{/each}
			</ul>
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</svelte:fragment>
</AccordionItem>
