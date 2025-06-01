# Elysia by Example

A collection of practical examples and edge cases for [Elysia.js](https://elysiajs.com), a TypeScript web framework. This project aims to demystify Elysia.js's "magical" aspects through runnable examples and comprehensive testing.

🌐 **Website**: [dtinth.github.io/elysia-by-example](https://dtinth.github.io/elysia-by-example)

## About

Elysia.js can feel **magical** — both in good and challenging ways. This project documents surprising behaviors, edge cases, and learning moments encountered while working with Elysia.js in production applications. Think of it as a curated collection of "gotchas" and insights that help developers understand the framework's behavior better.

## Project Structure

The project follows a systematic workflow:

```
examples/ → snapshots/ → docs/examples/ → VitePress site
```

### Key Directories

- **`examples/`** - TypeScript example files with embedded test commands
- **`snapshots/`** - JSON snapshots of test execution results
- **`docs/examples/`** - Generated Markdown documentation
- **`src/`** - Build tools and test runners
- **`bin/`** - Utility scripts for Docker-based testing

## Example File Format

Example files follow a specific format with embedded test directives:

```typescript
// example-name.example.ts
import { Elysia } from "elysia";

export default new Elysia().get("/", () => "Hello World");

//# test basic_functionality
//$ curl -s -D- "$SERVER/"
//# expect 200 "Hello World"

//# test another_case
//$ curl -s -D- "$SERVER/nonexistent"
//# expect 404
//# expect-not 200
```

### Test Directives

- **`//# test <name>`** - Defines a new test case
- **`//$`** - Marks the start of a command (can span multiple lines with `\`)
- **`//# expect <text>`** - Asserts the presence of text in response
- **`//# expect-not <text>`** - Asserts the absence of text in response

### Special Variables

- **`$SERVER`** - Automatically replaced with `http://localhost:3000` during test execution

## Development Workflow

### Prerequisites

- [Docker](https://www.docker.com/) (for isolated test execution)
- [Bun](https://bun.sh/) (primary runtime)
- [Node.js](https://nodejs.org/) (for Node.js compatibility testing)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/dtinth/elysia-by-example.git
   cd elysia-by-example
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Build Docker image** (required for snapshot generation)
   ```bash
   bin/build
   ```

### Commands

#### Generate Snapshots

```bash
bun snapshot
```

Runs all example files in both Bun and Node.js runtimes inside isolated Docker containers, generating/updating snapshot files with test results.

#### Generate Documentation

```bash
bun generate
```

Uses snapshot files to generate Markdown documentation in the VitePress site structure.

#### Preview Site

```bash
bun docs:dev
```

Starts the VitePress development server to preview the documentation site.

#### Build Site

```bash
bun docs:build
```

Builds the static site for production deployment.

## Testing Framework

The project includes a sophisticated testing framework that:

- **Dual Runtime Support**: Tests run in both Bun and Node.js for compatibility verification
- **Isolated Execution**: Docker containers prevent test interference
- **Snapshot Testing**: Results are captured and compared for regression detection
- **Parallel Execution**: Multiple tests run concurrently with rate limiting
- **Comprehensive Logging**: Both runtime output and test execution are captured

### Test Execution Flow

1. **Parse Examples**: Extract test directives from `.example.ts` files
2. **Generate Tasks**: Create runnable tasks for each test × runtime combination
3. **Execute in Docker**: Run tests in isolated containers
4. **Capture Output**: Save both server logs and HTTP response data
5. **Generate Snapshots**: Store normalized results for comparison
6. **Create Documentation**: Transform snapshots into readable Markdown

## Deployment

The site is automatically deployed to GitHub Pages.

## Contributing

1. **Add Examples**: Create new `.example.ts` files following the established format
2. **Update Snapshots**: Run `bun snapshot` to capture test results
3. **Generate Docs**: Run `bun generate` to update documentation
4. **Preview Changes**: Use `bun docs:dev` to review the site locally

## Runtime Support

Examples are tested against:

- **Bun** (latest) - Primary runtime with native Elysia support
- **Node.js** (v22) - Using `@elysiajs/node` adapter for compatibility
