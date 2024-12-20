# Introduction

This website contains my study notes about Elysia.js, a TypeScript web framework that has significantly improved my development workflow compared to other JavaScript frameworks.

## Why Elysia.js?

Elysia.js excels in several areas:

- Developer-friendly request/response handling with minimal code
- Type-safe APIs without verbose boilerplate
- Efficient routing with great performance
- Automatic request validation through schema definitions
- Automatic OpenAPI schema generation

While Elysia.js can feel **magical** (in both good and bad ways), it's important to understand its behavior:

### The good

- Simplified request validation through schema definitions
- Automatic API documentation generation
- End-to-end type safety

### The challenges

- Understanding the underlying mechanics
- Finding best practices for common patterns (e.g., authentication)
- Dealing with advanced concepts like `derive`, `resolve`, `mapResponse`, `store`, and lifecycle hooks
- Debugging issues due to the framework's code generation approach

## About this project

This **Elysia by Example** project aims to demystify these “magical” aspects through code examples. Since Elysia.js uses static analysis and dynamic code generation for optimizing performance, understanding its behavior can be challenging by just reading the source code. These examples may help clarify how things work under the hood.

The contents of this website are generated from [`*.example.ts` files in the `dtinth/elysia-by-example` repo](https://github.com/dtinth/elysia-by-example/tree/main/examples).
