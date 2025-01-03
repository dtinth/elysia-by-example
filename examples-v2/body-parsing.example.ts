import { Elysia } from "elysia";
export default new Elysia().post("/parse", async ({ body }) => {
  return Bun.inspect(body);
});

//# test json
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: application/json" \
//    -d '{"x":1,"a":[2,3],"o":{"b":{"j":"k"}}}'
//# expect 200 "a: [ 2, 3 ]"

//# test urlencoded
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -d x=1 -d y=2 -d z=3

//# test urlencoded_php_arrays_are_unsupported
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -d o[b][j]=k -d a[]=1

//# test urlencoded_duplicate_keys_become_array
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -d a=foo -d a=bar -d a=baz

//# test multipart
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -F x=1 -F y=2 -F z=3 \
//    -F a=foo -F a=bar -F a=baz

//# test file_upload
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -F file=@package.json

//# test file_upload_multiple
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -F file=@package.json \
//    -F file=@tsconfig.json

//# test plain_text
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: text/plain" \
//    -d "hello, world"

//# test octet_stream
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: application/octet-stream" \
//    -d "hello, world"

//# test xml_is_unsupported
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: application/xml" \
//    -d "<hello>world</hello>"

//# test ndjson_is_unsupported
//$ curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: application/x-ndjson" \
//    -d $'{"hello":"world"}\n{"foo":"bar"}\n'
