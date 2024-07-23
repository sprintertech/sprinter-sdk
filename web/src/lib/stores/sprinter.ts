import { writable } from 'svelte/store';
import { Sprinter, setBaseUrl } from '@chainsafe/sprinter-sdk';
import { selectedProvider } from '$lib/stores/wallet';

setBaseUrl('https://api.test.sprinter.buildwithsygma.com/');

export const sprinter = writable<Sprinter>();

selectedProvider.subscribe((event) => {
	if (event) sprinter.set(new Sprinter(event.provider));
});
