<script lang="ts">
	import { web3Connected } from '$lib/stores/wallet';
	import Web3Modal from '$lib/components/Web3Modal.svelte';
	import NetworkList from '$lib/components/NetworkList.svelte';
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		{#if $web3Connected}
			<NetworkList />
			<div class="flex justify-center space-x-2">
				<a class="btn variant-filled" href="https://skeleton.dev/" target="_blank" rel="noreferrer">
					Launch Documentation
				</a>
			</div>
		{:else}
			<h2 class="h2">Welcome to Gopher POC.</h2>
			<Web3Modal />
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
