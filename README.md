<table><tbody><tr><td width="400">

In Bun, you can start a web server without having to explicitly call
the `listen` method \u2014 just `export default` an object
that has a `fetch` method.

</td><td width="400">

```ts
export default () => new Response("haiyaa", { status: 200 });
```

<table><tr><td><details><summary>Example request</summary>

TODO

</details></td></tr></table>

</td></tr></tbody></table>
