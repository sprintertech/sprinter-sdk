<script lang="ts">
	import { web3Connected } from '$lib/stores/wallet';
	import Web3Modal from '$lib/components/Web3Modal.svelte';
	import TokenList from "$lib/components/TokenList.svelte";
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		{#if $web3Connected}
			<TokenList />
		{:else}
			<h2 class="h2">Welcome to Gopher POC.</h2>
			<Web3Modal />
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
