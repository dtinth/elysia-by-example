#!/usr/bin/env bun

/**
 * Bun runtime script for executing Elysia examples
 * Usage: bun src/runtimes/bun.ts <example-path>
 */

import { pathToFileURL } from "node:url";

const examplePath = process.argv[2];

if (!examplePath) {
  console.error("Usage: bun src/runtimes/bun.ts <example-path>");
  process.exit(1);
}

// Convert path to file URL for importing
const fileUrl = pathToFileURL(examplePath).href;

console.log("[runtime] Bun " + Bun.version);

// Dynamically import and re-export the default export
const exampleModule = await import(fileUrl);
export default exampleModule.default;
