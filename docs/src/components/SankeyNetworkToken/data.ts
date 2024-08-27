import {getChainTokens, getFungibleTokens, getSupportedChains} from "@chainsafe/sprinter-sdk/dist/api";

export async function getData(url: string) {
  const chains= await getSupportedChains();
  const leftNodes = chains.map(({ name, logoURI }) => ({ id: name, img: logoURI }));
  const leftNodesLength = leftNodes.length;

  const tokens = await getFungibleTokens();
  const rightNodes = tokens.map(({ name, logoURI }) => ({ id: name, img: logoURI }));
  const rightNodesLength = rightNodes.length;

  const connections = await Promise.all(chains.map(async ({ chainID, name }) => ({ tokens: (await getChainTokens(chainID)), network: name })));
  const links = [];

  console.log(leftNodes, rightNodes);

  connections.forEach((networkTokens) => {
    const source = leftNodes.findIndex(({ id }) => networkTokens.network === id);

    console.log(source, networkTokens.tokens.length);

    if (source === -1) return;
    networkTokens.tokens.forEach((token) => {
      const target = rightNodes.findIndex(({ id }) => token.name === id);
      if (target === -1) return;

      links.push({source, target: target + leftNodesLength, value: 1});
    });
  });

  console.log(links);

  return {
    data: {
      nodes: [...leftNodes, ...rightNodes],
      links,
    },
    leftNodes, leftNodesLength,
    rightNodes, rightNodesLength,
  }
}
