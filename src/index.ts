import app from "./app";
import config from "./utils/config";

Bun.serve({
  fetch: app.fetch,
  port: config.PORT,
});
