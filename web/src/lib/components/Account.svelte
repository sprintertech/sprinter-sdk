<script lang="ts">
	import {
		type DrawerSettings,
		getDrawerStore,
		getModalStore,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { Web3 } from 'web3';
	import { sprinterNameServiceAbi } from '$lib/sprinterNameService.abi';
	import UpdateNameModal from '$lib/components/UpdateNameModal.svelte';
	import { SPRINTER_SEPOLIA_ADDRESS } from '$lib/stores/sprinter';
	import { selectedAccount } from '$lib/stores/wallet';
	import type { Address } from "@chainsafe/sprinter-sdk";

	async function getSprinterName(): Promise<string> {
		const SEPOLIA_RPC_PROVIDER = 'https://ethereum-sepolia-rpc.publicnode.com';
		const web3 = new Web3(SEPOLIA_RPC_PROVIDER);

		const sprinterNameService = new web3.eth.Contract(
			sprinterNameServiceAbi,
			SPRINTER_SEPOLIA_ADDRESS
		);

		const name = await sprinterNameService.methods.names($selectedAccount as Address).call();
		if (!name) throw new Error('Name not found!');
		return name;
	}

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

	const modalStore = getModalStore();
	async function openUpdateNameModal() {
		const modal: ModalSettings = {
			type: 'component',
			component: { ref: UpdateNameModal },
			title: 'Change Name',
			buttonTextCancel: 'close'
		};
		modalStore.trigger(modal);
	}
</script>

<div class="w-[1024px] h-full py-[15px] flex-col justify-start items-center gap-2.5 inline-flex">
	<div
		class="self-stretch h-[152px] px-[22px] py-[23px] bg-gray-200 dark:bg-gray-700 rounded-xl flex-col justify-start items-center gap-[34px] flex"
	>
		<div class="self-stretch justify-start items-start gap-2.5 inline-flex">
			<div class="text-black dark:text-white text-xl font-medium font-['Inter'] leading-7">
				Hello
					{#await getSprinterName()}
						{$selectedAccount}
					{:then name}
						{name}
					{:catch}
						{$selectedAccount}
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
			<div
				class="p-2.5 bg-black dark:bg-gray-200 rounded-full justify-center items-center gap-2 flex"
			>
				<button
					type="button"
					class="text-white dark:text-black text-base font-medium font-['Inter'] leading-normal"
					on:click={openUpdateNameModal}
				>
					Change Display Name
				</button>
			</div>
		</div>
	</div>
</div>
