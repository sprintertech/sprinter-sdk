---
sidebar_position: 3
---

# Fungible Assets

Get list of fungible tokens available on service

<hr />

## /assets/fungible

Returns supported tokens

### Example

```shell
curl -X 'GET' \
  'https://gopher.test.buildwithsygma.com/assets/fungible' \
  -H 'accept: application/json'
```

<hr />

## /assets/fungible/{"{token}"}

 * ### {"{token}"} - Token Symbol

Return information of selected token

### Example

```shell
curl -X 'GET' \
  'https://gopher.test.buildwithsygma.com/assets/fungible/usdc' \
  -H 'accept: application/json'
```

<hr />



## /networks/{"{chainID}"}/assets/fungible

* ### {"{chainID}"} - Chain id of network

Return supported tokens for specific network

### Example

```shell
curl -X 'GET' \
  'https://gopher.test.buildwithsygma.com/networks/1/assets/fungible' \
  -H 'accept: application/json'
```