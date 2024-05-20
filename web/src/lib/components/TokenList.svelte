<script lang="ts">
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { getModalStore } from '@skeletonlabs/skeleton';

	import { hacks_getGopherData } from '$lib/hacks';
	import TokenModal from '$lib/components/TokenModal.svelte';
	import RequestSendModal from "$lib/components/RequestSendModal.svelte";

	const modalStore = getModalStore();

	const promise = hacks_getGopherData();

	async function handleListClick(index: number) {
		const data = await promise;
		const token = data.tokens[index];

		const modal: ModalSettings = {
			type: 'component',
			component: { ref: TokenModal },
			title: token.Name,
			buttonTextCancel: "close",
			value: { networks: data.raw.networks, balances: token.balances },
			meta: { icon: token.LogoURI, sybol: token.Symbol }
		};
		modalStore.trigger(modal);
	}

	async function handleSendClick() {
		const data = await promise;

		const modal: ModalSettings = {
			type: 'component',
			component: { ref: RequestSendModal },
			title: "Send Tokens",
			value: data.raw,
			response: console.log,
		};
		modalStore.trigger(modal);
	}
</script>

{#await promise}
	<p>...waiting</p>
{:then data}
	<button type="button" class="btn variant-filled" on:click={handleSendClick}>Send</button>
	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th />
					<th>Token</th>
					<th />
					<th>Balance</th>
				</tr>
			</thead>
			<tbody>
				{#each data.tokens as token, i}
					<tr on:click={() => handleListClick(i)}>
						<td><img class="size-8" src={token.LogoURI} alt={`${token.LogoURI}-LOGO`} /></td>
						<td>{token.Name}</td>
						<td />
						<td>{token.total}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
