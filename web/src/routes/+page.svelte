<script lang="ts">
	import Portfolio from '$lib/components/Portfolio.svelte';
	import Account from '$lib/components/Account.svelte';
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<Account />
		<Portfolio />
	</div>
</div>

<style lang="postcss">
</style>
