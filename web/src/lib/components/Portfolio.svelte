<script lang="ts">
	import { fromWei } from 'web3-utils';
	import Facepile from '$lib/components/Facepile.svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import TokenModal from '$lib/components/TokenModal.svelte';

	export let promise: Promise<object>;

	$: total = promise.then(({ tokens }) =>
		tokens.reduce((p, c) => p + Number(fromWei(c.total, c.decimals)), 0)
	);

	const modalStore = getModalStore();

	async function handleListClick(index: number) {
		const data = await promise;
		const token = data.tokens[index];

		const modal: ModalSettings = {
			type: 'component',
			component: { ref: TokenModal },
			title: token.name,
			buttonTextCancel: 'close',
			value: { networks: data.raw.networks, balances: token.balances },
			meta: { icon: token.logoURI, sybol: token.symbol, decimals: token.decimals }
		};
		modalStore.trigger(modal);
	}
</script>

<div class="w-[1024px] bg-gray-200 dark:bg-gray-800 flex flex-col items-center gap-4 rounded-xl">
	<!-- Balance Section -->
	<div class="w-full p-6 rounded-xl flex justify-between items-center relative py-9">
		<div>
			<div class="text-slate-800 dark:text-slate-200 text-lg font-normal text-left">Balance</div>
			<div class="text-slate-800 dark:text-slate-200 text-4xl font-semibold">
				{#await total}
					<div class="placeholder h-11 w-40" />
				{:then result}
					${result.toFixed(2)}
				{:catch error}
					- {JSON.stringify(error)}
				{/await}
			</div>
		</div>
		<div
			class="absolute right-0 top-0 bottom-0 w-[80%] bg-gradient-to-r from-transparent via-indigo-600 to-fuchsia-800 rounded-xl"
		></div>
	</div>
	<!-- Portfolio Section -->
	<div class="w-full flex flex-col gap-4 p-6 pt-3">
		<div class="text-slate-800 dark:text-slate-200 text-2xl font-semibold text-left">Portfolio</div>
		<div class="table-container">
			<!-- Native Table Element -->
			<table
				class="table table-hover bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200 rounded-lg overflow-hidden"
			>
				<thead>
					<tr class="bg-gray-100 dark:bg-gray-700 font-medium">
						<th class="p-2">ASSET</th>
						<th class="p-2">BALANCE</th>
						<th class="p-2">DISTRIBUTION</th>
					</tr>
				</thead>
				<tbody>
					{#await promise}
						<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
						{#each { length: 3 } as _}
							<tr class="pt-2">
								<td><div class="placeholder h-8" /></td>
								<td><div class="placeholder h-8" /></td>
								<td><div class="placeholder h-8" /></td>
							</tr>
						{/each}
					{:then data}
						{#each data.tokens as token, i}
							<tr
								class="pt-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
								on:click={() => handleListClick(i)}
							>
								<td class="flex items-center gap-2 py-2">
									<div
										class="relative w-6 h-6 bg-gradient-to-b from-amber-500 to-amber-300 rounded-full overflow-hidden"
									>
										<img class="size-6" src={token.logoURI} alt={`${token.logoURI}-LOGO`} />
									</div>
									<div class="flex">
										<div class="text-slate-800 dark:text-slate-200 text-base">{token.name}</div>
									</div>
								</td>
								<td class="text-slate-700 dark:text-slate-300 text-base text-left">
									{fromWei(token.total, token.decimals)}
									{token.symbol}
								</td>
								<td class="text-slate-700 dark:text-slate-300 text-base">
									<Facepile balances={token.balances} networks={data.raw.networks} />
								</td>
							</tr>
						{/each}
					{:catch error}
						<p style="color: red">{error.message}</p>
					{/await}
				</tbody>
			</table>
		</div>
	</div>
</div>
