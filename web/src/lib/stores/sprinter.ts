import { writable } from 'svelte/store';
import { Sprinter, setBaseUrl, Environment } from '@chainsafe/sprinter-sdk';
import { selectedProvider } from '$lib/stores/wallet';

setBaseUrl(Environment.TESTNET);

export const sprinter = writable<Sprinter>();

selectedProvider.subscribe((event) => {
	if (event) sprinter.set(new Sprinter());
});

export const SPRINTER_SEPOLIA_ADDRESS = '0xf70fb86F700E8Bb7cDf1c20197633518235c3425';
