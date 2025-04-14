import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Sprinter",
  tagline: "The Fast Lane For Crosschain",
  favicon: "img/sprinter.ico",

  url: "https://docs.sprinter.buildwithsygma.com/",
  baseUrl: "/",

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
    navbar: {
      title: "Sprinter",
      logo: {
        alt: "Sprinter Temp Logo",
        src: "img/sprinter-logo.svg",
        srcDark: "img/sprinter-logo-white.svg",
      },
      items: [
        {
          href: "https://app.sprinter.tech/",
          label: "Stash",
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
            }
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
  ],
};

export default config;
