<script lang="ts">
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml';
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	import json from 'highlight.js/lib/languages/json';

	hljs.registerLanguage('xml', xml);
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	hljs.registerLanguage('json', json);
	storeHighlightJs.set(hljs);

	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { initializeStores, Modal } from '@skeletonlabs/skeleton';
	initializeStores();

	// Import the header and other components
	import Header from '$lib/components/Header.svelte';

	import { providers, selectedAccount, selectedProvider } from '$lib/stores/wallet';
	import type { EIP6963ProviderDetail } from 'mipd';
	import DrawerManager from '$lib/components/DrawerManager.svelte';

	let selecting = false;
	async function selectWallet(provider: EIP6963ProviderDetail): Promise<void> {
		if (selecting) return;

		selecting = true;
		try {
			const accounts = await provider.provider.request({ method: 'eth_requestAccounts', params: [] });

			selectedAccount.set(accounts[0]);
			selectedProvider.set(provider);
		} finally {
			selecting = false;
		}
	}

	import { autoModeWatcher } from '@skeletonlabs/skeleton';
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}
</svelte:head>

<DrawerManager />
<Modal />

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<Header />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft"></svelte:fragment>
	<svelte:fragment slot="sidebarRight"></svelte:fragment>
	<!-- Page Route Content -->
	{#if $selectedProvider}
		<slot />
	{:else}
		<div class="container h-full mx-auto flex justify-center items-center">
			<div class="space-y-10 text-center flex flex-col items-center">
				<h2 class="h2">Welcome to Sprinter POC.</h2>
				<br />
				<h3 class="h3">Please select wallet</h3>
				<article class="container mx-auto">
					<ul class="space-y-4">
						{#if !$providers.length}
							No wallets Found GET ONE!
						{:else}
							{#each $providers as provider}
								<!-- eslint-disable-next-line svelte/valid-compile -->
								<li
									on:click={() => selectWallet(provider)}
									class="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-lg transition duration-300 flex items-center cursor-pointer"
								>
									<img
										src={provider.info.icon}
										alt="{provider.info.icon} Icon"
										class="w-12 h-12 mr-4"
									/>
									<div>
										<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
											{provider.info.name}
										</h3>
										<p class="text-gray-600 dark:text-gray-400">{provider.info.rdns}</p>
									</div>
								</li>
							{/each}
						{/if}
					</ul>
				</article>
			</div>
		</div>
	{/if}
</AppShell>
