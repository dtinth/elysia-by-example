<table><tbody><tr><td width="400" valign="top">

In Bun, you can start a web server without having to explicitly call
the `listen` method — just `export default` an object that has a
`fetch` method.

</td><td width="400" valign="top">

```ts
export default {
  fetch() {
    return new Response("hi", {
      status: 200,
    });
  },
};
```

<table><tr><td><details><summary>Example request</summary>

TODO

</details></td></tr></table>

</td></tr></tbody></table>
