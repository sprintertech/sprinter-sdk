<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		ListBox,
		ListBoxItem,
		type PopupSettings,
		popup,
		getDrawerStore,
		type DrawerSettings
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { hacks_getChainIcon } from '$lib/hacks';
	import { fromWei, toWei } from 'web3-utils';

	const drawerStore = getDrawerStore();

	let selectedToken: string;
	let selectedNetwork: string;
	let whitelisted: string[] = [];

	// inputs
	let amount: number;
	let threshold: number;

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	onMount(() => {
		selectedToken = $drawerStore.meta.tokens.values().next().value.symbol;
	});

	let balances;
	let tokenInfo;
	function updateWhitelistedOnTokenChange() {
		tokenInfo = $drawerStore.meta.tokens.get(selectedToken);

		balances = $drawerStore.meta.balances.get(selectedToken) ?? [];
		whitelisted = balances.map((balance) => balance.chainId);
	}
	$: if (selectedToken) {
		updateWhitelistedOnTokenChange();
	}

	function requestQuota() {
		const drawerSettings: DrawerSettings = {
			id: 'SubmitQuota',
			width: 'w-[518px]',
			position: 'right',
			meta: {
				...$drawerStore.meta,
				title: 'Submit Quotas',
				quota: {
					token: selectedToken,
					network: selectedNetwork,
					whitelisted,
					amount: toWei(amount, tokenInfo.decimals),
					threshold: threshold ? toWei(threshold, tokenInfo.decimals) : undefined
				}
			}
		};
		drawerStore.open(drawerSettings);
	}
</script>

<div
	class="self-stretch px-5 py-1.5 bg-slate-50 dark:bg-gray-600 justify-center items-center gap-1.5 inline-flex"
>
	<div
		class="grow shrink basis-0 text-slate-400 dark:text-slate-200 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
	>
		Amount
	</div>
</div>
<div
	class="self-stretch p-5 bg-white dark:bg-gray-800 border-t border-b border-gray-300 dark:border-gray-600 flex-col justify-center items-start gap-1 flex"
>
	<div class="self-stretch h-[74px] py-3 rounded-3xl flex-col justify-start items-start flex">
		<div class="self-stretch flex-col justify-center items-start gap-2 flex">
			<div class="self-stretch h-10 flex-col justify-start items-start gap-2 flex">
				<div class="self-stretch justify-between items-center inline-flex">
					<!-- Value Input -->
					<input
						type="number"
						placeholder="Enter a value"
						bind:value={amount}
						class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full border-transparent focus:border-transparent focus:ring-0 text-zinc-600 dark:text-zinc-200 text-[34px] font-medium font-['Inter'] leading-10 outline-none border-0 pl-0 bg-transparent"
					/>
					<!-- Token Selection -->
					<button
						class="px-2 py-1.5 bg-zinc-100 dark:bg-gray-700 rounded-[40px] justify-end items-center gap-1 flex"
						use:popup={popupCombobox}
					>
						<div class="w-5 h-5 mb-2.5">
							<img
								class="inline-block size-5 rounded-full mr-1"
								src={tokenInfo?.logoURI}
								alt={tokenInfo?.name}
							/>
						</div>

						<div class="text-zinc-700 dark:text-zinc-300 text-lg font-medium font-['Inter']">
							{tokenInfo?.symbol}
						</div>
						<div class="justify-end items-center gap-3 flex">
							<div class="w-6 h-6 relative">↓</div>
						</div>
					</button>
					<div class="card w-48 shadow-xl py-2" data-popup="popupCombobox">
						<ListBox rounded="rounded-none">
							{#each $drawerStore.meta.tokens.values() as token}
								<ListBoxItem bind:group={selectedToken} name="medium" value={token.symbol}>
									<img
										class="inline-block size-5 rounded-full mr-1"
										src={token.logoURI}
										alt={token.name}
									/>
									{token.name}
								</ListBoxItem>
							{/each}
						</ListBox>
						<div class="arrow bg-surface-100-800-token" />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div
	class="self-stretch px-5 py-1.5 bg-slate-50 dark:bg-gray-600 justify-center items-center gap-1.5 inline-flex"
>
	<div
		class="grow shrink basis-0 text-slate-400 dark:text-slate-200 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
	>
		Destination network
	</div>
</div>
<div
	class="self-stretch px-[9px] py-3 bg-white dark:bg-gray-800 rounded-lg flex-col justify-center items-start gap-4 flex"
>
	<select
		class="self-stretch px-4 py-3 rounded-lg border border-zinc-200 dark:border-gray-600 flex-col justify-center items-start gap-1 flex text-zinc-800 dark:text-zinc-200 text-lg font-medium font-['Inter'] leading-relaxed bg-transparent"
		bind:value={selectedNetwork}
	>
		{#each $drawerStore.meta.networks.values() as network}
			<option value={network.chainID}>{network.name}</option>
		{/each}
	</select>
</div>

<!-- Advanced Settings -->
<Accordion
	padding="0"
	class="w-full self-stretch bg-slate-50 dark:bg-gray-600 justify-center items-center inline-flex overflow-y-hidden"
>
	<AccordionItem
		open
		class="grow shrink basis-0 text-slate-400 dark:text-slate-200 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
	>
		<svelte:fragment slot="summary">
			<div class="self-stretch px-5 py-1.5 justify-center items-center gap-1.5 inline-flex">
				<div
					class="grow shrink basis-0 text-slate-400 dark:text-slate-200 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
				>
					Advanced methods
				</div>
			</div>
		</svelte:fragment>
		<svelte:fragment slot="content">
			<div
				class="self-stretch bg-white dark:bg-gray-800 flex-col justify-start items-start gap-3 flex pt-1"
			>
				<div class="self-stretch p-3 flex-col justify-center items-start gap-1 flex">
					<div
						class="self-stretch text-slate-700 dark:text-slate-300 text-xs font-medium font-['Inter'] uppercase leading-none tracking-wide"
					>
						set custom threshold
					</div>
					<input
						type="number"
						bind:value={threshold}
						class="self-stretch h-10 px-4 py-3 rounded-lg border border-zinc-200 dark:border-gray-600 mt-1 bg-transparent text-zinc-800 dark:text-zinc-200"
					/>
				</div>
				<Accordion>
					<AccordionItem>
						<svelte:fragment slot="summary">WHITELIST A NETWORK</svelte:fragment>
						<svelte:fragment slot="content">
							<ListBox multiple>
								{#each balances as balance}
									<ListBoxItem
										bind:group={whitelisted}
										name={$drawerStore.meta.networks.get(balance.chainId).name}
										value={balance.chainId}
									>
										<svelte:fragment slot="lead">
											<img
												class="size-6"
												src={hacks_getChainIcon(balance.chainId)}
												alt={`${balance.chainId}-LOGO`}
											/>
										</svelte:fragment>
										{$drawerStore.meta.networks.get(balance.chainId).name}
										<svelte:fragment slot="trail">
											{fromWei(balance.balance, tokenInfo.decimals)}
										</svelte:fragment>
									</ListBoxItem>
								{/each}
							</ListBox>
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
			</div>
		</svelte:fragment>
	</AccordionItem>
</Accordion>

<div
	class="w-full p-5 bg-white dark:bg-gray-800 border-t border-zinc-200 dark:border-gray-600 items-center gap-4 inline-flex mt-auto"
>
	<div class="grow shrink basis-0 flex-col justify-center items-center gap-4 inline-flex">
		<button
			on:click={requestQuota}
			class="self-stretch h-[60px] p-2.5 bg-indigo-600 dark:bg-indigo-500 rounded-[10px] shadow border border-zinc-200 dark:border-gray-600 justify-center items-center gap-1 inline-flex"
		>
			<div class="px-1 justify-center items-center flex">
				<div
					class="text-white dark:text-gray-200 text-base font-semibold font-['Inter'] leading-normal"
				>
					Get Quota
				</div>
			</div>
		</button>
	</div>
</div>
