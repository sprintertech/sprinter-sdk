import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Sprinter',
  tagline: 'Do Not Walk, Sprint.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.sprinter.buildwithsygma.com/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ChainSafe', // Usually your GitHub org/user name.
  projectName: 'sprinter-ts', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Sprinter',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        // {
        //  type: 'docSidebar',
        //  sidebarId: 'tutorialSidebar',
        //  position: 'left',
        //  label: 'Docs',
        // }
        {
          href: 'https://poc.sprinter.buildwithsygma.com/',
          label: 'POC',
          position: 'left',
        },
        {
          href: 'https://github.com/ChainSafe/sprinter-ts',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/introduction',
            },
            {
              label: 'SDK',
              to: '/docs/category/sdk',
            },
            {
              label: 'API',
              to: '/docs/category/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/sprinter_ux',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/DjpAhQvbkw',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Website',
              href: 'https://sprinter.box',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/ChainSafe/sprinter-ts',
            },
            {
              label: 'Blog',
              href: 'https://blog.chainsafe.io',
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
};

export default config;
