import { writable } from 'svelte/store';
import { GopherManager } from '@chainsafe/gopher-sdk';
import { selectedProvider } from '$lib/stores/wallet';

export const gopher = writable<GopherManager>();

selectedProvider.subscribe((event) => {
	if (event) gopher.set(new GopherManager(event.provider));
});
