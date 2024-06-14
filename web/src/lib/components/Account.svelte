<script lang="ts">
	import { selectedProvider } from '$lib/stores/wallet';
	import { type DrawerSettings, getDrawerStore } from '@skeletonlabs/skeleton';

	$: address = $selectedProvider.provider.request({ method: 'eth_requestAccounts', params: [] });

	const drawerStore = getDrawerStore();
	async function openSendDrawer() {
		const drawerSettings: DrawerSettings = {
			id: 'SendTokens',
			width: 'w-[518px]',
			position: 'right',
			meta: {
				title: 'Send Tokens'
			}
		};
		drawerStore.open(drawerSettings);
	}
</script>

<div class="w-[1024px] h-full py-[15px] flex-col justify-start items-center gap-2.5 inline-flex">
	<div
		class="self-stretch h-[152px] px-[22px] py-[23px] bg-gray-200 dark:bg-gray-700 rounded-xl flex-col justify-start items-center gap-[34px] flex"
	>
		<div class="self-stretch justify-start items-start gap-2.5 inline-flex">
			<div class="text-black dark:text-white text-xl font-medium font-['Inter'] leading-7">
				Hello
				{#await address}
					0x....
				{:then result}
					{result[0]}
				{:catch error}
					- {JSON.stringify(error)}
				{/await}
			</div>
		</div>
		<div class="self-stretch justify-end items-start gap-2 inline-flex">
			<div
				class="p-2.5 bg-black dark:bg-gray-200 rounded-full justify-center items-center gap-2 flex"
			>
				<button
					type="button"
					class="text-white dark:text-black text-base font-medium font-['Inter'] leading-normal"
					on:click={openSendDrawer}
				>
					Send
				</button>
			</div>
		</div>
	</div>
</div>
