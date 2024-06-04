import { readable, writable } from 'svelte/store';
import { createStore, type EIP6963ProviderDetail } from 'mipd';

export const selectedProvider = writable<false | EIP6963ProviderDetail>();

const store = createStore();
export const providers = readable(store.getProviders(), store.subscribe);
