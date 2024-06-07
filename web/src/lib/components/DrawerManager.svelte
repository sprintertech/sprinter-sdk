<script>
	import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import SendTokensDrawer from '$lib/components/SendTokensDrawer.svelte';

	const drawerStore = getDrawerStore();
	const close = () => {
		drawerStore.close();
	};

	$: console.log($drawerStore);
</script>

<Drawer>
	<div
		class="w-full h-full bg-white rounded-xl shadow border border-gray-300 flex-col justify-start items-start inline-flex"
	>
		<div class="w-full h-16 p-5 bg-white justify-start items-center gap-3 inline-flex">
			<div class="grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex">
				<div class="self-stretch justify-start items-center gap-2 inline-flex">
					<div class="text-neutral-900 text-lg font-medium font-['Inter'] leading-normal">
						Send Tokens
					</div>
				</div>
			</div>
			<div class="p-0.5 rounded-md justify-center items-center gap-0.5 flex">
				<div class="w-5 h-5 relative" on:click={close}>x</div>
			</div>
		</div>
		{#if $drawerStore.id === 'SendTokens'}
			<SendTokensDrawer />
		{:else if $drawerStore.id === 'example-2'}
			<!-- (show 'example-2' contents) -->
		{:else}
			<!-- (fallback contents) -->
		{/if}
	</div>
</Drawer>
