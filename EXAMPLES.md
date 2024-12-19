
<table><tbody><tr><td width="1000" valign="top">

In Bun, you can start a web server without having to explicitly call
the `listen` method — just `export default` an object that has a
`fetch` method.

When you run:

~~~sh
bun examples/00_wintercg/index.ts
~~~

You should see:

~~~
Started development server: http://localhost:3000
~~~

- You can configure the listening port by setting the `PORT` environment variable.
- If you set `NODE_ENV=production`, it will say “Started server” instead of “Started development server”.

</td><td width="1000" valign="top">

```ts
export default {
  fetch() {
    return new Response("hi", {
      status: 200,
    });
  },
};
```

</td></tr></tbody></table>

<table><tr><td><details><summary>Example request</summary>

```sh-session
$ curl -s -D- "http://localhost:3000/"
HTTP/1.1 200 OK
content-type: text/plain;charset=utf-8
Date: Thu, 19 Dec 2024 12:25:10 GMT
Content-Length: 2

hi
```

</details></td></tr></table>
