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
	import { selectedProvider } from '$lib/stores/wallet';
	import ConnectView from '$lib/components/ConnectView.svelte';
</script>

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
				<h2 class="h2">Welcome to Gopher POC.</h2>
				<ConnectView />
			</div>
		</div>
	{/if}
</AppShell>
