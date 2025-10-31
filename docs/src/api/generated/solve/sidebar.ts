import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "../src/api/generated/solve/swap-by-blanc",
    },
    {
      type: "category",
      label: "UNTAGGED",
      items: [
        {
          type: "doc",
          id: "../src/api/generated/solve/get-route-v-1",
          label: "getRouteV1",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
