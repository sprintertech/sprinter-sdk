<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import {
		Accordion,
		AccordionItem,
		getModalStore,
		ListBox,
		ListBoxItem
	} from '@skeletonlabs/skeleton';
	import { hacks_getChainIcon } from '$lib/hacks';
	import { fromWei, toWei } from 'web3-utils';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	// selections
	let token;
	let network;
	//
	let whitelisted: string[] = [];

	// inputs
	let amount: number;
	let threshold: number;

	let balances;
	let tokenInfo;
	function updateWhitelistedOnTokenChange() {
		tokenInfo = $modalStore[0]?.value?.tokens.get(token);

		balances = $modalStore[0]?.value?.balances?.get(token) ?? [];
		whitelisted = balances.map((balance) => balance.chainId);
	}
	$: if (token) {
		updateWhitelistedOnTokenChange();
	}

	const modalStore = getModalStore();

	function onRequestQuota(): void {
		if ($modalStore[0].response)
			$modalStore[0].response({
				token,
				network,
				whitelisted,
				amount: toWei(amount, tokenInfo.decimals),
				threshold: threshold ? toWei(threshold, tokenInfo.decimals) : undefined
			});
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>
			<div class="space-y-4">
				<div>
					Token
					<select class="select" bind:value={token}>
						{#each $modalStore[0].value.tokens as token}
							<option value={token[1].symbol}>{token[1].name}</option>
						{/each}
					</select>
				</div>

				<div>
					Destination
					<select class="select" bind:value={network}>
						{#each $modalStore[0].value.networks as network}
							<option value={network[1].chainID}>{network[1].name}</option>
						{/each}
					</select>
				</div>

				<label class="label">
					<span>Amount</span>
					<input class="input" type="number" placeholder="0.5" bind:value={amount} />
				</label>

				<Accordion>
					<AccordionItem>
						<svelte:fragment slot="summary">Advance Options</svelte:fragment>
						<svelte:fragment slot="content">
							<label class="label">
								<span>Threshold</span>
								<input class="input" type="number" placeholder="0.005" bind:value={threshold} />
							</label>

							<div>
								Whitelisted Sources
								<ListBox multiple>
									{#each balances as balance}
										<ListBoxItem
											bind:group={whitelisted}
											name={$modalStore[0].value.networks.get(balance.chainId).name}
											value={balance.chainId}
										>
											<svelte:fragment slot="lead">
												<img
													class="size-6"
													src={hacks_getChainIcon(balance.chainId)}
													alt={`${balance.chainId}-LOGO`}
												/>
											</svelte:fragment>
											{$modalStore[0].value.networks.get(balance.chainId).name}
											<svelte:fragment slot="trail"
												>{fromWei(balance.balance, tokenInfo.decimals)}</svelte:fragment
											>
										</ListBoxItem>
									{/each}
								</ListBox>
							</div>
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
			</div>
		</article>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
				{parent.buttonTextCancel}
			</button>
			<button class="btn {parent.buttonPositive}" on:click={onRequestQuota}>Send Tokens</button>
		</footer>
	</div>
{/if}
