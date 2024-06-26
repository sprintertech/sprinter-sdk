---
sidebar_position: 3
---

# User Assets

Get list of assets of specific user

<hr />

## /accounts/{"{token}"}/assets/fungible/{"{address}"}

* ### {"{token}"} - Token Symbol
* ### {"{address}"} - User Address

Returns supported networks

### Example

```shell
curl -X 'GET' \
  'https://gopher.test.buildwithsygma.com/accounts/usdc/assets/fungible/0x' \
  -H 'accept: application/json'
```
