import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import connectDB from "./config/db";
import { customLogger } from "./config/logger";
import dotenv from "dotenv";
import { blogsRoute } from "./modules/blog";

dotenv.config();

const app = new Hono();

app.use(poweredBy());
app.use(logger(customLogger), prettyJSON());

connectDB()
  .then(() => {
    app.get("/db-connection", (c) =>
      c.json({ message: "Db connection is live" }, 200)
    );

    app.get("/", (c) => {
      return c.text("Hello Hemanth!");
    });

    app.route("/blogs", blogsRoute);
  })
  .catch((err) => {
    customLogger("mongodb connection:", `Error: ${err.message}`);

    app.get("/*", (c) => {
      customLogger("mongodb connection:", `Error: ${err.message}`);
      return c.json({ message: "internal server error" }, 500);
    });
  });

app.onError((err, c) => {
  customLogger("ON Error", `Error: ${err?.message}`);
  return c.json("Internal server error", 500);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
