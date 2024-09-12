import { readable, writable } from 'svelte/store';
import { createStore, type EIP6963ProviderDetail } from 'mipd';

export const selectedProvider = writable<false | EIP6963ProviderDetail>();

export const selectedAccount = writable<false | string>();

const store = createStore();
export const providers = readable(store.getProviders(), store.subscribe);
