# Sprinter TS - Cross-Chain Developer Toolkit

## Table of Contents

- [Sprinter TS - Cross-Chain Developer Toolkit](#sprinter-ts---cross-chain-developer-toolkit)
    - [Introduction](#introduction)
    - [Prerequisites](#prerequisites)
    - [Getting Started](#getting-started)
    - [Building](#building)
    - [Testing](#testing)
    - [Linting and Formatting](#linting-and-formatting)

---

<a name="introduction"></a>
## Introduction

Sprinter TS is a powerful developer toolkit designed to simplify cross-chain integrations and enhance the developer experience. It includes:

- **TypeScript SDK** for strongly typed APIs and simplified interactions.
- **React SDK** with hooks and context for seamless integration into React applications.
- **Comprehensive Documentation** to guide and support developers.

Whether you're building cross-chain applications or experimenting with decentralized technologies, Sprinter provides the tools you need to succeed.

---

<a name="prerequisites"></a>
## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js >= 20.0.0 (we recommend using [nvm](https://github.com/nvm-sh/nvm) for managing Node versions)
- Yarn >= 4.3 (via [corepack](https://github.com/nodejs/corepack))

---

<a name="getting-started"></a>
## Getting Started

To get started with the project:

1. Clone the repository:
   ```shell
   git clone https://github.com/ChainSafe/sprinter-ts.git
   ```

2. Navigate to the project root:
   ```shell
   cd sprinter-ts
   ```

3. Set Node.js to the compatible version _(skip if you use a manual approach)_:
   ```shell
   nvm use
   ```

4. Enable Corepack:
   ```shell
   corepack enable
   ```

5. Install the dependencies:
   ```shell
   yarn install
   ```

---

<a name="building"></a>
## Building

To build all packages, run:

```shell
yarn build
```

---

Here's the corrected and updated **Testing** and **Linting and Formatting** documentation that reflects your unchanged `package.json`.

---

<a name="testing"></a>
## Testing

### Run Unit Tests

```shell
yarn test:unit
```

This command executes unit tests in all packages where they are defined.

### Run Integration Tests

```shell
yarn test:integrations
```

This command executes integration tests in all packages where they are defined.

---

<a name="linting-and-formatting"></a>
## Linting and Formatting

This project uses [ESLint](https://eslint.org/) to enforce code style and formatting. To ensure consistent code quality, you can use the following command:

### Check for Linting Issues

```shell
yarn lint
```

This command runs the linter across all workspaces to identify any issues.

