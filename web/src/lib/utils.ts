import {
	type Chain,
	type ChainID,
	ChainType,
	type FungibleToken,
	type TokenSymbol
} from '@chainsafe/sprinter-sdk';

const noNetworkFound: Chain = {
	chainID: 0,
	chainType: ChainType.EVM,
	name: 'none',
	logoURI: 'https://static.thenounproject.com/png/75231-200.png',
	rpcURLs: []
};

export function getNetworkByChainId(networks: Chain[], chainId: ChainID) {
	return networks.find((network) => network.chainID === chainId) || noNetworkFound;
}

const noTokenFound: FungibleToken = {
	addresses: {},
	decimals: 0,
	logoURI: 'https://static.thenounproject.com/png/75231-200.png',
	name: 'none',
	symbol: 'none'
};

export function getTokenBySymbol(tokens: FungibleToken[], symbol: TokenSymbol) {
	return tokens.find((token) => token.symbol === symbol) || noTokenFound;
}
