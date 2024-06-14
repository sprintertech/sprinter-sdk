<script lang="ts">
	import type { Chain, FungibleTokenBalance } from '@chainsafe/gopher-sdk';

	export let balances: FungibleTokenBalance[];
	export let networks: Chain[];

	$: list = balances.reduce(
		(previousValue, { balance, chainId }) => {
			if (balance != '0') {
				const network = networks.find((network) => network.chainID === chainId);
				if (network)
					previousValue.push({
						balance: BigInt(balance),
						chainId,
						name: network.name,
						logo: network.logoURI
					});
			}
			return previousValue;
		},
		[] as { logo: string; name: string; balance: bigint; chainId: number }[]
	);
</script>

<div class="flex -space-x-2">
	{#each list as item}
		<img
			class="inline-block size-8 rounded-full ring-white dark:ring-neutral-900"
			src={item.logo}
			alt={item.name}
		/>
	{/each}
</div>
