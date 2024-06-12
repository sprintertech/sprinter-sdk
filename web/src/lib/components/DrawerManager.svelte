<script>
	import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import SendTokensDrawer from '$lib/components/SendTokensDrawer.svelte';
	import SubmitTokensDrawer from '$lib/components/SubmitTokensDrawer.svelte';

	const drawerStore = getDrawerStore();
	const close = () => {
		drawerStore.close();
	};

	$: console.log($drawerStore);
</script>

<Drawer>
	<div
		class="w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-300 dark:border-gray-600 flex-col justify-start items-start inline-flex"
	>
		<div
			class="w-full h-16 p-5 bg-white dark:bg-gray-700 justify-start items-center gap-3 inline-flex"
		>
			<div class="grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex">
				<div class="self-stretch justify-start items-center gap-2 inline-flex">
					<div
						class="text-neutral-900 dark:text-neutral-200 text-lg font-medium font-['Inter'] leading-normal"
					>
						{$drawerStore.meta.title || '(missing title)'}
					</div>
				</div>
			</div>
			<div class="p-0.5 rounded-md justify-center items-center gap-0.5 flex">
				<button class="w-5 h-5 relative text-neutral-900 dark:text-neutral-200" on:click={close}
					>x</button
				>
			</div>
		</div>
		{#if $drawerStore.id === 'SendTokens'}
			<SendTokensDrawer />
		{:else if $drawerStore.id === 'SubmitQuota'}
			<SubmitTokensDrawer />
		{:else}
			<!-- (fallback contents) -->
		{/if}
	</div>
</Drawer>
