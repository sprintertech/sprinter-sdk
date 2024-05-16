import {MMSDK} from "$lib/stores/wallet";

export function hacks_getChainIcon(id: number): string {
  switch (id) {
    case 1:
      return "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg";
    case 42161:
      return "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg";
    case 10:
      return "https://icons.llamao.fi/icons/chains/rsz_optimism.jpg";
    case 137:
      return "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg";
    case 8453:
      return "https://icons.llamao.fi/icons/chains/rsz_base.jpg";
    case 43114:
      return "https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg";
    case 100:
      return "https://icons.llamao.fi/icons/chains/rsz_xdai.jpg";
    default:
      return "https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/svg/1f937-2642.svg"
  }
}

export async function hacks_getNetworkDetails(chainID: number): Promise<Object> {
  const account = await MMSDK.getProvider()!.request({ method: "eth_requestAccounts", params: [] });

  const url = "https://corsproxy.io/?" + encodeURIComponent(`https://api.gopher.chainsafe.dev/networks/${chainID}/assets/fungible`);
  const assets = await fetch(url).then(r => r.json());

  const userAssets = await Promise.all(assets.data.map(asset => {
    const url = "https://corsproxy.io/?" + encodeURIComponent(`https://api.gopher.chainsafe.dev/accounts/${account[0]}/assets/fungible/${asset.Symbol}`);
    return fetch(url).then(r => r.json()).then(r => r.data.find(assetData => assetData.chainId === chainID)).then(r => ({...r, Symbol: asset.Symbol}));
  }));

  return {
    data: assets.data,
    assets: userAssets,
    assetsMap: userAssets.reduce((p, c) => ({ ...p, [c.Symbol]: c}), {})
  }
}
