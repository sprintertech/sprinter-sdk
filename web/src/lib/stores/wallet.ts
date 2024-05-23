import { writable } from 'svelte/store';

import { MetaMaskSDK } from '@metamask/sdk';

export function connect() {
	MMSDK.connect().then(web3Connected.set);
}

export const MMSDK = new MetaMaskSDK({
	dappMetadata: {
		name: 'Gopher POC'
	}
});

export const web3Connected = writable(false);
