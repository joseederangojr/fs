import { jwt as jwtMiddlware } from "hono/jwt";
import config from "../utils/config";

export const jwt = () =>
  jwtMiddlware({
    verification: {
      aud: [config.APP_URL],
      iss: config.APP_URL,
    },
    secret: config.JWT_SECRET,
    alg: config.JWT_ALG,
  });
