<script lang="ts">
	export let balances;
	export let networks;

	$: list = balances.reduce((previousValue, { balance, chainId }) => {
		if (balance != '0') {
			const network = networks.get(chainId); // not having types yet! { name, logoURI }
			previousValue.push({
				balance: BigInt(balance),
				chainId,
				name: network.name,
				logo: network.logoURI
			});
		}
		return previousValue;
	}, []);
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
