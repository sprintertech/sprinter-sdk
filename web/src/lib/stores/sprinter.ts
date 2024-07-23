import { writable } from 'svelte/store';
import { Sprinter, setBaseUrl } from '@chainsafe/sprinter-sdk';
import { selectedProvider } from '$lib/stores/wallet';

setBaseUrl('https://api.test.sprinter.buildwithsygma.com/');

export const sprinter = writable<Sprinter>();

selectedProvider.subscribe((event) => {
	if (event) sprinter.set(new Sprinter(event.provider));
});

export const SPRINTER_SEPOLIA_ADDRESS = '0xa8bf0d2Ad50e9B0686da8838AE7D33bEfAbc1413';
