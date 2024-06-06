<script lang="ts">
	import Portfolio from '$lib/components/Portfolio.svelte';
	import Account from '$lib/components/Account.svelte';
	import { hacks_getGopherData } from '$lib/hacks';

	const promise = hacks_getGopherData();
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<Account />
		<Portfolio {promise} />
	</div>
</div>

<style lang="postcss">
</style>
