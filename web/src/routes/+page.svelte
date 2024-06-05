<script lang="ts">
	import { selectedProvider } from '$lib/stores/wallet';
	import TokenList from '$lib/components/TokenList.svelte';
	import ConnectView from '$lib/components/ConnectView.svelte';
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		{#if $selectedProvider}
			<TokenList />
		{:else}
			<h2 class="h2">Welcome to Gopher POC.</h2>
			<ConnectView />
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
