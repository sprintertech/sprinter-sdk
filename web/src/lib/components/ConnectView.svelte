<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import Web3Modal from '$lib/components/Web3Modal.svelte';

	const modalStore = getModalStore();

	function handleConnect() {
		const modal: ModalSettings = {
			type: 'component',
			component: { ref: Web3Modal },
			title: 'Select wallet',
			buttonTextCancel: 'close'
		};
		modalStore.trigger(modal);
	}
</script>

<button class="btn variant-filled" on:click={handleConnect}> Connect Wallet </button>
