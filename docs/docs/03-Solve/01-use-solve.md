---
id: solvestart
title: Utilizing Solve
sidebar_position: 1
---

## Getting Started

### Accessing the Solve API

- **Mainnet:** `https://swaps.sprinter.tech/mainnet`
- **Base:** `https://swaps.sprinter.tech/base`

### Authentication

All requests must include:

```http
X-API-Key: <your_key>
```

### Basic Usage Flow

1. Request an API key via the [Sprinter Solve Request Form](https://forms.gle/TCAUwcYqguQbWi3bA)
2. Review [Solve API](solveapi)
3. Call `/v2/route` to get quote + execution data
4. Send transaction using `swap_call_data`
