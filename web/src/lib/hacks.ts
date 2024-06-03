import { get } from 'svelte/store';
import { selectedProvider } from '$lib/stores/wallet';

export function hacks_getChainIcon(id: number): string {
	switch (id) {
		case 1:
			return 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg';
		case 42161:
			return 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg';
		case 10:
			return 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg';
		case 137:
			return 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg';
		case 8453:
			return 'https://icons.llamao.fi/icons/chains/rsz_base.jpg';
		case 43114:
			return 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg';
		case 100:
			return 'https://icons.llamao.fi/icons/chains/rsz_xdai.jpg';
		default:
			return 'https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/svg/1f937-2642.svg';
	}
}

function getProvider() {
	const storeProvider = get(selectedProvider);
	if (!storeProvider) return;

	return storeProvider.provider;
}

export async function hacks_getGopherData(): Promise<Object> {
	const networksResponse = await fetch('https://gopher.test.buildwithsygma.com/networks').then(
		(r) => r.json()
	);
	const networks = networksResponse.data.reduce(
		(prev, network) => prev.set(network.chainID, network),
		new Map<number, Object>()
	);

	const fungibleResponses = await Promise.all(
		networks
			.keys()
			.map((key) =>
				fetch(`https://gopher.test.buildwithsygma.com/networks/${key}/assets/fungible`).then((r) =>
					r.json()
				)
			)
	);

	const tokens = new Map<string, Object>();
	fungibleResponses.forEach((response) => {
		response.data.forEach((asset) => {
			if (tokens.has(asset.symbol)) return;
			tokens.set(asset.symbol, asset);
		});
	});

	const account = await getProvider().request({ method: 'eth_requestAccounts', params: [] });
	const balancesResponses = await Promise.all(
		tokens.keys().map((key) =>
			fetch(`https://gopher.test.buildwithsygma.com/accounts/${account}/assets/fungible/${key}`)
				.then((r) => r.json())
				.then((r) => ({ symbol: key, ...r }))
		)
	);

	const balances = new Map<string, Object[]>();
	balancesResponses.forEach((balance) => {
		balances.set(balance.symbol, balance.data);
	});

	const tokensData = [...tokens.keys()].map((key) => {
		const tokenData = tokens.get(key);
		const balanceData = balances.get(key);

		const totalBalance = balanceData.reduce((prev, cur) => prev + Number(cur.balance), 0);
		return { ...tokenData, balances: balanceData, total: totalBalance };
	});

	return { raw: { networks, tokens, balances }, tokens: tokensData };
}

export async function hacks_getQuota(value: Object) {
	const url = new URL('https://gopher.test.buildwithsygma.com/solutions/aggregation');

	const account = await getProvider().request({ method: 'eth_requestAccounts', params: [] });
	url.searchParams.set('account', account[0]);

	url.searchParams.set('destination', value.network);
	url.searchParams.set('token', value.token);
	url.searchParams.set('amount', value.amount);
	//
	if (value.whitelisted) url.searchParams.set('whitelistedSourceChains', value.whitelisted);
	if (value.threshold) url.searchParams.set('threshold', value.threshold);

	return await fetch(url.toString()).then((r) =>
		r.json().then(json => {
			if (r.ok) return json;
			throw new Error(JSON.stringify(json));
		}));
}
