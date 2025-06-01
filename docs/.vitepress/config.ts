import elysiaJs from "elysia/package.json" with { type: "json" };
import { defineConfig } from "vitepress";
import examples from "./examples.json" with { type: "json" };

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Elysia by Example",
  base: process.env.VITEPRESS_BASE || "/",
  description: "@dtinth's Elysia.js study notes",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/examples/" },
      {
        text: "Elysia v" + elysiaJs.version,
        link:
          "https://github.com/elysiajs/elysia/releases/tag/" + elysiaJs.version,
      },
    ],

    sidebar: [
      {
        text: "About",
        link: "/about",
      },
      {
        text: "Examples",
        link: "/examples/",
        items: examples.exampleNames.map((example) => ({
          text: example,
          link: `/examples/${example}`,
        })),
      },
    ],
    outline: { level: [2, 3] },

    socialLinks: [
      { icon: "github", link: "https://github.com/dtinth/elysia-by-example" },
    ],

    footer: {
      copyright: "© 2024–2025 @dtinth",
    },
  },
});
