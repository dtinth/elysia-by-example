import Elysia from "elysia";

const hookNames: string[] = [];
const app = new Elysia().get("/", () => hookNames);
for (const [eventName, handlers] of Object.entries(app.event)) {
  if (Array.isArray(handlers)) hookNames.push(eventName);
}

export default app;

//# test
//$ curl -s -D- $SERVER
