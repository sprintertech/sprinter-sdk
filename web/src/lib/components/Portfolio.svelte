<script lang="ts">
	import { fromWei } from 'web3-utils';
	import Facepile from '$lib/components/Facepile.svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import TokenModal from '$lib/components/TokenModal.svelte';

	export let promise: Promise<any>;

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

{#await promise}
	<p>...waiting</p>
{:then data}
	<div class="w-[1012px] bg-stone-50 flex flex-col items-center gap-4 p-12">
		<!-- Balance Section -->
		<div class="w-full p-6 bg-white rounded-xl flex justify-between items-center relative">
			<div>
				<div class="text-slate-800 text-lg font-normal text-left">Balance</div>
				<div class="text-slate-800 text-4xl font-semibold">
					{#await total}
						0
					{:then result}
						${result.toFixed(2)}
					{:catch error}
						- {JSON.stringify(error)}
					{/await}
				</div>
			</div>
			<div
				class="absolute right-0 top-0 bottom-0 w-[60%] bg-gradient-to-r from-white via-indigo-600 to-fuchsia-800 rounded-xl"
			></div>
		</div>
		<!-- Portfolio Section -->
		<div class="w-full flex flex-col gap-4">
			<div class="text-slate-800 text-2xl font-semibold text-left">Portfolio</div>
			<div class="table-container">
				<!-- Native Table Element -->
				<table class="table table-hover">
					<thead>
						<tr class="font-medium">
							<th>ASSET</th>
							<th>BALANCE</th>
							<th>DISTRIBUTION</th>
						</tr>
					</thead>
					<tbody>
						{#each data.tokens as token, i}
							<tr class="pt-2" on:click={() => handleListClick(i)}>
								<td class="flex items-center gap-2 py-2">
									<div
										class="relative w-6 h-6 bg-gradient-to-b from-amber-500 to-amber-300 rounded-full overflow-hidden"
									>
										<img class="size-6" src={token.logoURI} alt={`${token.logoURI}-LOGO`} />
									</div>
									<div class="flex">
										<div class="text-slate-800 text-base">{token.name}</div>
										<div class="px-2 ml-2 py-0.5 bg-zinc-200 rounded text-slate-700 text-sm">
											6.4%
										</div>
									</div>
								</td>
								<td class="text-slate-700 text-base text-left"
									>{fromWei(token.total, token.decimals)} {token.symbol}</td
								>
								<td class="text-slate-700 text-base"
									><Facepile balances={token.balances} networks={data.raw.networks} /></td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
