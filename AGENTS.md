# Documentation project instructions

## About this project

- Sprinter API documentation site built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Run `mint dev` to preview locally
- Run `mint broken-links` to check links

## Repos documented

| Repo | Type | Spec |
|------|------|------|
| `sprintertech/miso-api` | REST API (Go/Gin) | OpenAPI 3.0 at `api-reference/miso/openapi.json` |
| `sprintertech/sprinter-api` | REST API (Go/Gin) | OpenAPI 3.0 at `api-reference/sprinter/openapi.json` |
| `sprintertech/sprinter-signing` | MPC signing (Go/Gorilla Mux) | Manual MDX pages in `api-reference/signing/` |
| `sprintertech/stash-repayment` | Background worker (Go) | Architecture page in `architecture/` |

## Terminology

- "credit" — collateralized borrowing via CreditHub contracts
- "solver" — entity that fills cross-chain intents
- "earn vault" — yield-bearing wrapper (Morpho, Yo Protocol)
- CAIP-2 format for chain IDs: `eip155:8453` (Base), `eip155:1` (Ethereum)
- "MPC signing" — threshold signature scheme across multiple nodes

## Style preferences

- **LLM/agent-optimized**: prioritize code snippets, types, and structured tables over prose
- Curl examples for every endpoint
- Go type definitions from source code
- JSON request/response examples
- Minimal explanatory text — let code speak
- Use tables for parameters, enums, and config
- Use active voice and second person ("you")

## Content boundaries

- Do not document internal deployment/ops procedures
- Do not document environment variables or secrets
- Focus on external-facing API contracts only
