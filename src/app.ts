import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { authRouter } from "./auth/auth-router";
import config from "./utils/config";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
const app = new Hono().basePath("api");

app.use(
  cors({
    origin: config.CORS_ORIGIN,
  }),
);
app.use(
  bodyLimit({
    maxSize: config.BODY_LIMIT,
  }),
);
app.use(requestId());
app.use(logger());

app.route("/auth", authRouter);
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return new Response(
    JSON.stringify({
      message: "Internal Server Error",
    }),
    {
      status: 500,
      statusText: "Internal Server Error",
    },
  );
});

export default app;
