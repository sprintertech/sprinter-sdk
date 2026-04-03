# Sprinter Documentation

Official documentation for Sprinter — programmable credit infrastructure for apps and AI agents.

**Live docs:** [docs.sprinter.tech](https://docs.sprinter.tech)

## What's Inside

### Documentation (Mintlify)

| Section | Description |
|---------|-------------|
| **Getting Started** | What is Sprinter, API reference links, community |
| **Quickstart** | Credit Draw, Card Issuer Integration, Agent Skills |
| **Sprinter Credit (V2)** | Credit Engine, Policy Engine, Supported Assets, Risk Management |
| **API Reference** | Full Sprinter Credit API with interactive playground |

### Examples & Demos

| Directory | Description |
|-----------|-------------|
| [`demo/`](demo/) | Credit Draw demo — full lock/draw/repay/unlock lifecycle with web UI |
| [`examples/sprinter-mcp/`](examples/sprinter-mcp/) | MCP server exposing Sprinter Credit as agent tools |
| [`card-issuer-demo-mock/`](card-issuer-demo-mock/) | Card issuer integration demo with mock issuer |

### API

| Resource | URL |
|----------|-----|
| Base URL | `https://api.sprinter.tech` |
| Swagger UI | [api.sprinter.tech/swagger/index.html](https://api.sprinter.tech/swagger/index.html) |
| OpenAPI Spec | [api.sprinter.tech/swagger/doc.json](https://api.sprinter.tech/swagger/doc.json) |

## Development

Requires Node 22 LTS (Node 25+ is not supported by Mintlify).

```bash
cd docs
npx mintlify dev
```

Preview at `http://localhost:3000`.

## Deployment

Docs auto-deploy on push to `main` via the [Mintlify GitHub app](https://dashboard.mintlify.com/settings/organization/github-app).

## Links

- **Docs:** [docs.sprinter.tech](https://docs.sprinter.tech)
- **Website:** [sprinter.tech](https://sprinter.tech)
- **Telegram:** [t.me/sprinter_tech](https://t.me/sprinter_tech)
- **X:** [@sprinter_ux](https://x.com/sprinter_ux)
- **GitHub:** [github.com/sprintertech](https://github.com/sprintertech)
