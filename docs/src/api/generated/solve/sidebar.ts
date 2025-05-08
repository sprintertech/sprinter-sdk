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
          id: "../src/api/generated/solve/",
          label: "Missing summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "../src/api/generated/solve/",
          label: "Missing summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "../src/api/generated/solve/",
          label: "Missing summary",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
