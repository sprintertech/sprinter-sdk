# Sprinter & Miso API Documentation

> **Initial draft** — This is the first pass at API documentation for the Sprinter and Miso ecosystem. Content is auto-generated from OpenAPI specs and source code. Expect refinements, additional examples, and expanded coverage in future updates.

## What's Documented

| Service             | Source Repo                     | Type                                            |
| ------------------- | ------------------------------- | ----------------------------------------------- |
| **Miso API**        | `sprintertech/miso-api`         | REST API — user registration, cards, referrals  |
| **Sprinter API**    | `sprintertech/sprinter-api`     | REST API — credit, liquidity, solver operations |
| **Signing API**     | `sprintertech/sprinter-signing` | MPC threshold signing service                   |
| **Stash Repayment** | `sprintertech/stash-repayment`  | Architecture overview (background worker)       |

## Development

Requires Node 22 LTS (Node 25+ is not supported by Mintlify).

```bash
npx mintlify dev
```

Preview at `http://localhost:3000`.

## Publishing

Install the Mintlify GitHub app from your [dashboard](https://dashboard.mintlify.com/settings/organization/github-app) to auto-deploy on push to the default branch.
