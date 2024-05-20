import { MMSDK } from '$lib/stores/wallet';

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

export async function hacks_getNetworkDetails(chainID: number): Promise<Object> {
	const account = await MMSDK.getProvider()!.request({ method: 'eth_requestAccounts', params: [] });

	const url =
		'https://corsproxy.io/?' +
		encodeURIComponent(`https://api.gopher.chainsafe.dev/networks/${chainID}/assets/fungible`);
	const assets = await fetch(url).then((r) => r.json());

	const userAssets = await Promise.all(
		assets.data.map((asset) => {
			const url =
				'https://corsproxy.io/?' +
				encodeURIComponent(
					`https://api.gopher.chainsafe.dev/accounts/${account[0]}/assets/fungible/${asset.Symbol}`
				);
			return fetch(url)
				.then((r) => r.json())
				.then((r) => r.data.find((assetData) => assetData.chainId === chainID))
				.then((r) => ({ ...r, Symbol: asset.Symbol }));
		})
	);

	return {
		data: assets.data,
		assets: userAssets,
		assetsMap: userAssets.reduce((p, c) => ({ ...p, [c.Symbol]: c }), {})
	};
}

export async function hacks_getGopherData(): Promise<Object> {
	const networksResponse = await fetch(makeUrl('https://api.gopher.chainsafe.dev/networks')).then(
		(r) => r.json()
	);
	const networks = networksResponse.data.reduce(
		(prev, network) => prev.set(network.ChainID, network),
		new Map<number, Object>()
	);

	const fungibleResponses = await Promise.all(
		networks
			.keys()
			.map((key) =>
				fetch(makeUrl(`https://api.gopher.chainsafe.dev/networks/${key}/assets/fungible`)).then(
					(r) => r.json()
				)
			)
	);

	const tokens = new Map<string, Object>();
	fungibleResponses.forEach((response) => {
		response.data.forEach((asset) => {
			if (tokens.has(asset.Symbol)) return;
			tokens.set(asset.Symbol, asset);
		});
	});

	const account = await MMSDK.getProvider()!.request({ method: 'eth_requestAccounts', params: [] });
	const balancesResponses = await Promise.all(
		tokens
			.keys()
			.map((key) => fetch(
            makeUrl(`https://api.gopher.chainsafe.dev/accounts/${account}/assets/fungible/${key}`)
          ).then(r => r.json()).then((r) =>({ Symbol: key, ...r }))
			)
	);

	const balances = new Map<string, Object[]>();
	balancesResponses.forEach((balance) => {
		balances.set(balance.Symbol, balance.data);
	});

	const tokensData = [...tokens.keys()].map(key => {
		const tokenData = tokens.get(key);
		const balanceData = balances.get(key);

		const totalBalance = balanceData.reduce((prev, cur) => prev + Number(cur.balance), 0)
		return { ...tokenData, balances: balanceData, total: totalBalance };
	});

	return { raw: { networks, tokens, balances }, tokens: tokensData };
}

const makeUrl = (url: string): string => 'https://corsproxy.io/?' + encodeURIComponent(url);
