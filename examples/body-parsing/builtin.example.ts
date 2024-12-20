// # Body Parsing
// By default, Elysia is able to parse request body of various formats.

import { Elysia } from "elysia";
export default new Elysia().post("/parse", async ({ body }) => {
  return Bun.inspect(body);
});

// [prose]
// ## Built-in
// ### JSON
// **Mime type:** `application/json`

//$ curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: application/json" \
//    -d '{"x":1,"a":[2,3],"o":{"b":{"j":"k"}}}'

// ### URL-encoded form
// Mime type: `application/x-www-form-urlencoded`

// Elysia doesn’t automatically convert numeric strings to numbers by default.
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -d x=1 -d y=2 -d z=3

// Elysia doesn’t support PHP-style nested arrays in URL-encoded forms.
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -d o[b][j]=k -d a[]=1

// However, upon receiving a duplicate key, Elysia will return an array of values.
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -d a=foo -d a=bar -d a=baz

// ### Multipart form
// Mime type: `multipart/form-data`

// Same parsing logic as URL-encoded form.
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -F x=1 -F y=2 -F z=3 \
//    -F a=foo -F a=bar -F a=baz

// File uploads are supported.
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -F file=@package.json

// Multiple file uploads are supported.
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -F file=@package.json \
//    -F file=@tsconfig.json

// ### Plain text
// Mime type: `text/plain`
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: text/plain" \
//    -d "hello, world"

// ### Binary data
// Mime type: `application/octet-stream`

// When the content type is `application/octet-stream`, Elysia will provide an `ArrayBuffer` object in the `body` context.
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: application/octet-stream" \
//    -d "hello, world"

// ### Unknown type
// When a type is unknown to Elysia, the raw body will be `undefined`.

//$ curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: application/xml" \
//    -d "<hello>world</hello>" # application/xml

//$ curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: application/x-ndjson" \
//    -d $'{"hello":"world"}\n{"foo":"bar"}\n' # application/x-ndjson
