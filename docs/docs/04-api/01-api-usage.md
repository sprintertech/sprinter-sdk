---
sidebar_position: 2
---

# API Usage

If you prefer using API calls directly or due to limitations of your environment, you can use the Sprinter API. This guide provides an overview of the available endpoints and examples of how to interact with them.

You can use the Swagger documentation available at [Sprinter Swagger API](https://api.sprinter.buildwithsygma.com/swagger/index.html) for more detailed information.

### Example

Example of getting a list of supported networks:

```shell
curl -X 'GET' \
  'https://api.sprinter.buildwithsygma.com/networks' \
  -H 'accept: application/json'
```

### Table of Contents

For more detailed information about each endpoint, please refer to the specific documents:

- [Fungible Assets](02-assets.md)
  - Get all assets information
  - Get specific assets information
  - Get specific network assets
- [User Assets](03-user-assets.md)
  - Get assets for a specific user
- [Networks](04-networks.md)
  - Get all supported networks
- [Solutions](05-solutions.md)
  - Token aggregation
  - Token aggregation with contract call

Explore each section to understand how to make the most out of the Sprinter API.
