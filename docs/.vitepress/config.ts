import elysiaJs from "elysia/package.json" with { type: "json" };
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Elysia by Example",
  base: process.env.VITEPRESS_BASE || "/",
  description: "@dtinth's Elysia.js study notes",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/examples/intro" },
      {
        text: "Elysia v" + elysiaJs.version,
        link:
          "https://github.com/elysiajs/elysia/releases/tag/" + elysiaJs.version,
      },
    ],

    sidebar: [
      {
        text: "Learning",
        items: [
          { text: "Introduction", link: "/examples/intro" },
          { text: "The Smallest Server", link: "/examples/empty" },
          { text: "Basic Routing", link: "/examples/basic-routing" },
          { text: "Response Coercion", link: "/examples/response-coercion" },
        ],
      },
      {
        text: "Understanding",
        items: [{ text: "Hooks", link: "/examples/hooks" }],
      },
      {
        text: "Bugs",
        items: [{ text: "Bugs", link: "/examples/bugs" }],
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
