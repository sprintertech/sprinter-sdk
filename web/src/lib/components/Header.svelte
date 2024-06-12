<script>
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
</script>

<AppBar class="bg-white dark:bg-gray-800">
	<svelte:fragment slot="lead">
		<div class="h-10 px-2.5 justify-start items-center gap-2.5 flex">
			<div
				class="w-10 h-10 relative bg-slate-200 dark:bg-slate-700 rounded-[500px] overflow-hidden"
			>
				<img
					src="https://media1.tenor.com/m/zfhl02Fs4ZwAAAAC/raccoon-dancing-in-a-circle-raccoon-dancing.gif"
				/>
			</div>
			<div class="text-black dark:text-white text-xl font-medium font-['Inter'] leading-7">
				Gopher Demo
			</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<LightSwitch />
		<a
			class="btn btn-sm variant-ghost-surface dark:text-white"
			href="https://github.com/ChainSafe/gopher-ts"
			target="_blank"
			rel="noreferrer"
		>
			GitHub
		</a>
	</svelte:fragment>
</AppBar>
