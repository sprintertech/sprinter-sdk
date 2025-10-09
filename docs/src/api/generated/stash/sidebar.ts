import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "Liquidity",
      items: [
        {
          type: "doc",
          id: "../src/api/generated/stash/get-signing-authorization-for-a-liquidity-transaction",
          label: "Get signing authorization for a liquidity transaction",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "../src/api/generated/stash/get-the-borrow-quote-for-a-liquidity-transaction-based-on-the-input-data",
          label:
            "Get the borrow quote for a liquidity transaction based on the input data.",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
