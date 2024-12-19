import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Elysia by Example",
  description: "@dtinth's Elysia.js study notes",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/examples/intro" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Introduction", link: "/examples/intro" },
          { text: "The Smallest Server", link: "/examples/empty" },
          { text: "Basic Routing", link: "/examples/basic-routing" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/dtinth/elysia-by-example" },
    ],
  },
});
