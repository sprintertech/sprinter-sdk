---
id: StashAPI
title: Stash API Endpoints
hide_table_of_contents: true
sidebar_position: 3
---

:::tip
You can also visit the [Stash swagger](https://api.sprinter.buildwithsygma.com/swagger/index.html#/Liquidity/get_liquidity_protocol__protocol__deposit__txHash__request) directly
:::

<span style={{ background: '#28a745', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', marginRight: '8px' }}>GET</span>
`/liquidity/protocol/{protocol}/deposit/{txHash}/request`

→ Get the borrow cost for a liquidity transaction

<span style={{ background: '#28a745', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', marginRight: '8px' }}>GET</span>
`/liquidity/protocol/{protocol}/type/{type}/quote`

→ Get the borrow quote for a liquidity transaction based on the input data

---

import SwaggerUI from '@site/src/components/SwaggerUI';

<SwaggerUI specUrl="/api/stash-openapi.yaml" />
