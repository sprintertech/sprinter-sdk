# Poc interface for Sprinter-ts

## Developing

Install dependancies with

```bash
yarn
```

Make sure you build the entire sprinter-ts packages, with

```bash
cd ..
yarn build
```

Start a development server:

```bash
yarn dev

# or start the server and open the app in a new browser tab
yarn dev -- --open
```

## Building

To create a production version of your app:

```bash
yarn build
```

You can preview the production build with `yarn preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
