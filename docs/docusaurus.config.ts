import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

const config: Config = {
  title: "Sprinter",
  tagline: "The Fast Lane For Crosschain",
  favicon: "img/sprinter.ico",

  url: "https://docs.sprinter.tech/",
  baseUrl: "https://api.sprinter.tech",

  organizationName: "Sprinter",
  projectName: "sprinter-ts",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
          docItemComponent: "@theme/ApiItem",
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/chainsafe/sprinter-ts",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    mermaid: {
      theme: { light: "neutral", dark: "dark" },
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false, // optional: hide theme toggle switch
      respectPrefersColorScheme: false, // always force dark unless user switches
    },
    navbar: {
      title: "Sprinter",
      logo: {
        alt: "Sprinter Temp Logo",
        src: "img/sprinter-logo.svg",
        srcDark: "img/sprinter-logo-white.svg",
      },
      items: [
        {
          href: "https://sprinter.tech/",
          label: "Website",
          position: "left",
        },
        {
          href: "https://api.sprinter.buildwithsygma.com/swagger/index.html",
          label: "Swagger",
          position: "right",
        },
        {
          href: "https://github.com/sprintertech",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/sprinter_ux",
            },
            {
              label: "Discord",
              href: "https://discord.gg/Qdf6GyNB5J",
            },
            {
              label: "YouTube",
              href: "https://youtube.com/@buildwithsygma",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Website",
              href: "https://sprinter.box",
            },
            {
              label: "GitHub",
              href: "https://github.com/ChainSafe/sprinter-ts",
            },
            {
              label: "Swagger",
              href: "https://api.test.sprinter.buildwithsygma.com/swagger/index.html",
            },
            {
              label: "Blog",
              href: "https://blog.buildwithsygma.com",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sprinter, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    languageTabs: [
      {
        language: "curl",
        highlight: "bash",
        logoClass: "curl",
      },
      {
        language: "go",
        highlight: "go",
        logoClass: "go",
      },
      {
        language: "javascript",
        highlight: "javascript",
        logoClass: "javascript",
      },
      {
        language: "csharp",
        highlight: "csharp",
        logoClass: "csharp",
      },
      {
        language: "java",
        highlight: "java",
        logoClass: "java",
      },
    ],
  } satisfies Preset.ThemeConfig,
  plugins: [
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        indexBlog: false,
        indexPages: false,
        indexDocs: true,
      },
    ],
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "openapi",
        docsPluginId: "classic",
        config: {
          // petstore: { // EXAMPLE
          //   specPath: "src/api/petstore-utf8.yaml",
          //   outputDir: "docs/../src/api/generated/petstore",
          //   downloadUrl:
          //       "https://raw.githubusercontent.com/PaloAltoNetworks/docusaurus-template-openapi-docs/main/examples/petstore.yaml",
          //   sidebarOptions: {
          //     groupPathsBy: "tag",
          //   },
          // } satisfies OpenApiPlugin.Options,
          solve: {
            specPath: "src/api/solve-openapi.yaml",
            outputDir: "docs/../src/api/generated/solve",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          } satisfies OpenApiPlugin.Options,
          stash: {
            specPath: "src/api/stash-openapi.yaml",
            outputDir: "docs/../src/api/generated/stash",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          } satisfies OpenApiPlugin.Options,
          
      },
    ],
  ],

  themes: ["docusaurus-theme-openapi-docs", "@docusaurus/theme-mermaid"],

  markdown: {
    mermaid: true,
  },
};

export default config;
