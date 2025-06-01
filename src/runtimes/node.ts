/**
 * Node runtime script for executing Elysia examples
 * Usage: node --experimental-transform-types src/runtimes/node.ts <example-path>
 */

import { node } from "@elysiajs/node";
import { Elysia } from "elysia";

import { pathToFileURL } from "node:url";

const examplePath = process.argv[2];

if (!examplePath) {
  console.error(
    "Usage: node --experimental-transform-types src/runtimes/node.ts <example-path>"
  );
  process.exit(1);
}

// Convert path to file URL for importing
const fileUrl = pathToFileURL(examplePath).href;

// Dynamically import and re-export the default export
const exampleModule = await import(fileUrl);

console.log("[runtime] Node " + process.version);

new Elysia({ adapter: node() })
  .use(exampleModule.default)
  .listen(3000, ({ hostname, port }) => {
    console.log(`🦊 Elysia is running at ${hostname}:${port}`);
  });
