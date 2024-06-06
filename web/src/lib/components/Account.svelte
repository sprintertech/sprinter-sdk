<script lang="ts">
	import { selectedProvider } from '$lib/stores/wallet';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import RequestSendModal from '$lib/components/RequestSendModal.svelte';
	import ResponseSendModal from '$lib/components/ResponseSendModal.svelte';

	$: address = $selectedProvider.provider.request({ method: 'eth_requestAccounts', params: [] });

	export let promise: Promise<any>;

	const modalStore = getModalStore();

	async function handleSendClick() {
		const data = await promise;

		const modal: ModalSettings = {
			type: 'component',
			component: { ref: RequestSendModal },
			title: 'Send Tokens',
			value: data.raw,
			response: handleTokenSending
		};
		modalStore.trigger(modal);
	}

	async function handleTokenSending(value: Object) {
		const data = await promise;

		const modal: ModalSettings = {
			type: 'component',
			component: { ref: ResponseSendModal },
			title: 'Submit transactions',
			value,
			meta: data.raw
		};
		modalStore.trigger(modal);
	}
</script>

<div class="w-[1012px] h-full py-[15px] flex-col justify-start items-center gap-2.5 inline-flex">
	<div
		class="self-stretch h-[152px] px-[22px] py-[23px] bg-gray-200 rounded-xl flex-col justify-start items-center gap-[34px] flex"
	>
		<div class="self-stretch justify-start items-start gap-2.5 inline-flex">
			<div class="text-black text-xl font-medium font-['Inter'] leading-7">
				Hello
				{#await address}
					0
				{:then result}
					{result[0]}
				{:catch error}
					- {JSON.stringify(error)}
				{/await}
			</div>
		</div>
		<div class="self-stretch justify-end items-start gap-2 inline-flex">
			<div class="p-2.5 bg-black rounded-full justify-center items-center gap-2 flex">
				<button
					type="button"
					class="text-white text-base font-medium font-['Inter'] leading-normal"
					on:click={handleSendClick}
				>
					Send & Receive
				</button>
			</div>
		</div>
	</div>
</div>
