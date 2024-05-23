import { readable, writable } from 'svelte/store';
import { announceProvider, createStore, type EIP6963ProviderDetail } from 'mipd';
import { dev } from '$app/environment';

export const selectedProvider = writable<false | EIP6963ProviderDetail>();

const store = createStore();
export const providers = readable(store.getProviders(), store.subscribe);

// want to use impersonator, hack to add it on the provider list
try {
	if (dev && typeof window !== 'undefined') {
		setTimeout(() => {
			announceProvider({
				info: {
					icon: 'https://pa1.aminoapps.com/8618/9035ab93575fa9b12d8f3d6bf5cad45abf10d18fr1-720-450_hq.gif',
					name: 'Non-EIP6963Provider',
					rdns: 'window.ethereum',
					uuid: '00000000-0000-0000-0000-000000000000'
				},
				provider: window.ethereum
			});
		}, 1000);
	}
} catch {
	console.log('skip announceProvider');
}
