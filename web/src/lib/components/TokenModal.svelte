<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { hacks_getChainIcon } from '$lib/hacks';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex">
				{#if $modalStore[0].meta.icon}
					<img class="size-7 mr-3" src={$modalStore[0].meta.icon} alt="" />
				{/if}
				{$modalStore[0].title ?? '(title missing)'}
			</div>
		</header>
		<article>
			<div class="table-container">
				<!-- Native Table Element -->
				<table class="table table-hover">
					<thead>
						<tr>
							<th />
							<th>Network</th>
							<th>Balance</th>
						</tr>
					</thead>
					<tbody>
						{#each $modalStore[0].value.balances as balance}
							<tr>
								<td><img class="size-7" src={hacks_getChainIcon(balance.chainId)} alt="" /></td>
								<td>{$modalStore[0].value.networks.get(balance.chainId).Name}</td>
								<td>{balance.balance}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</article>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
		</footer>
	</div>
{/if}
