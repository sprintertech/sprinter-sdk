import { writable } from 'svelte/store';
import { Gopher } from '@chainsafe/gopher-sdk';
import { selectedProvider } from '$lib/stores/wallet';

export const gopher = writable<Gopher>();

selectedProvider.subscribe((event) => {
	if (event) gopher.set(new Gopher(event.provider));
});
