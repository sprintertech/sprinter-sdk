<script>
	import { AppBar, LightSwitch, modeCurrent } from '@skeletonlabs/skeleton';
	import logoDark from '$lib/assets/sprinter-logo.svg';
	import logoLight from '$lib/assets/sprinter-logo-white.svg';
</script>

<AppBar class="bg-surface-200 dark:bg-gray-800">
	<svelte:fragment slot="lead">
		<div class="h-10 px-2.5 justify-start items-center gap-2.5 flex">
			<div class="w-10 h-10 relative bg-slate-200 dark:bg-slate-700 overflow-hidden bg-transparent">
				<img src={$modeCurrent ? logoDark : logoLight} alt="SprinterLogo" />
			</div>
			<div class="text-black dark:text-white text-xl font-medium font-['Inter'] leading-7">
				Sprinter Demo
			</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<LightSwitch />
		<a
			class="btn btn-sm variant-ghost-surface dark:text-white"
			href="https://docs.sprinter.buildwithsygma.com/"
			target="_blank"
			rel="noreferrer"
		>
			Docs
		</a>
		<a
			class="btn btn-sm variant-ghost-surface dark:text-white"
			href="https://github.com/ChainSafe/sprinter-ts"
			target="_blank"
			rel="noreferrer"
		>
			GitHub
		</a>
	</svelte:fragment>
</AppBar>
