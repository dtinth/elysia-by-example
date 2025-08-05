# Copilot Instructions: Updating Elysia to the Latest Version

When asked to update Elysia to the latest version in this repository, follow these steps:

1. **Install dependencies and build Docker image (if not already done):**

   - Run `bun install` to ensure all dependencies are installed.
   - Run `bin/build` to build the Docker image (required for snapshot generation).

2. **Check the latest versions:**

   - Run `npm info elysia version` to get the latest version of `elysia`.
   - Run `npm info @elysiajs/node version` to get the latest version of `@elysiajs/node`.

3. **Update `package.json`:**

   - Set the `elysia` dependency to the latest version (e.g., `^1.3.8`).
   - Set the `@elysiajs/node` dependency to its latest available version (e.g., `^1.3.0`).
   - Do NOT assume both packages share the same version number; check each separately.

4. **Install updated dependencies:**

   - Run `bun install` again to update the lockfile and install the new versions.

5. **Validate the update:**

   - Run `bun snapshot` to execute all example files in both Bun and Node.js runtimes, generating/updating snapshot files with test results.
   - Ensure there are no errors or failed tests.

6. **If there are issues:**

   - Check the Elysia changelog for breaking changes.
   - Update code as needed, especially in `src/runtimes/node.ts` or example files.

7. **Communicate completion:**
   - Confirm that the update and validation are complete, or describe any issues found.

---

**Note:**

- Always check the latest version of both `elysia` and `@elysiajs/node` separately.
- Follow the project’s README for setup and validation commands.
- Do not proceed with the update if the required version of `@elysiajs/node` is not available.
