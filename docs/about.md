# About

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
- “Wow, you can do _this??_ That’s magical!”

### The challenges

- Understanding the underlying mechanics
- Finding best practices for common patterns (e.g., authentication)
- Dealing with advanced concepts like `derive`, `resolve`, `mapResponse`, `store`, and lifecycle hooks
- Debugging issues due to the framework's code generation approach
- “What’s going on here?? What kind of magic is this?”

## About this project

This **Elysia by Example** project aims to demystify Elysia.js's “magical” aspects. It is not trying to be a comprehensive guide. Rather, it’s a collection of examples that document surprising or unexpected behaviors I’ve encountered while working with Elysia.js in production applications.

Think of it as a curated list of “gotchas” and learning moments that helps demystify the framework’s behavior. When Elysia.js doesn’t behave the way I expect it to, I create minimal examples to understand and document these edge cases.

The contents of this website are generated from [`*.example.ts` files in the `dtinth/elysia-by-example` repo](https://github.com/dtinth/elysia-by-example/tree/main/examples).
