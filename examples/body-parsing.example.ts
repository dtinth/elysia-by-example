import { Elysia } from "elysia";
import { inspect } from "node:util";
export default new Elysia().post("/parse", async ({ body }) => {
  return inspect(body);
});

// @test json
// @curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: application/json" \
//    -d '{"x":1,"a":[2,3],"o":{"b":{"j":"k"}}}'
// @expect 200 "a: [ 2, 3 ]"

// @test urlencoded
// @curl -s -D- "$SERVER/parse" -X POST \
//    -d x=1 -d y=2 -d z=3
// @expect 200 "x: '1', y: '2', z: '3'"

// @test urlencoded_php_arrays_are_unsupported
// @curl -s -D- "$SERVER/parse" -X POST \
//    -d o[b][j]=k -d a[]=1
// @expect 200 "'o[b][j]': 'k', 'a[]': '1'"

// @test urlencoded_duplicate_keys_become_array
// @curl -s -D- "$SERVER/parse" -X POST \
//    -d a=foo -d a=bar -d a=baz
// @expect 200 "a: [ 'foo', 'bar', 'baz' ]"

// @test multipart
// @curl -s -D- "$SERVER/parse" -X POST \
//    -F x=1 -F y=2 -F z=3 \
//    -F a=foo -F a=bar -F a=baz
// @expect 200 "x: '1', y: '2', z: '3', a: [ 'foo', 'bar', 'baz' ]"

// @test file_upload
// @curl -s -D- "$SERVER/parse" -X POST \
//    -F file=@package.json
// @expect 200 "file: "

// @test file_upload_multiple
// @curl -s -D- "$SERVER/parse" -X POST \
//    -F file=@package.json \
//    -F file=@tsconfig.json
// @expect 200 "file: ["

// @test plain_text
// @curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: text/plain" \
//    -d "hello, world"
// @expect 200 "'hello, world'"

// @test octet_stream
// @curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: application/octet-stream" \
//    -d "hello, world"
// @expect 200 "ArrayBuffer"

// @test xml_is_treated_as_urlencoded
// @curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: application/xml" \
//    -d "<hello>world</hello>"
// @expect 200 "'<hello>world</hello>': ''"

// @test ndjson_is_treated_as_urlencoded
// @curl -s -D- "$SERVER/parse" -X POST \
//    -H "Content-Type: application/x-ndjson" \
//    -d $'{"hello":"world"}\n{"foo":"bar"}\n'
// @expect 200 "'{\"hello\":\"world\"}\\n{\"foo\":\"bar\"}\\n': ''"
