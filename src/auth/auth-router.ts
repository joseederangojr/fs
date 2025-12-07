import { Hono } from "hono";
import authController from "./auth-controller";
import { SigninSchema, SignupSchema } from "./auth-schema";
import { resultToResponse } from "../utils/neverthrow";
import { jwt } from "../middleware/jwt";
import { zValidator } from "../middleware/z-validator";
export const authRouter = new Hono();

authRouter.post("/signin", zValidator("json", SigninSchema), async (c) => {
  const result = await resultToResponse(
    authController.signin(c.req.valid("json")),
  );

  return c.json(result);
});

authRouter.post("/signup", zValidator("json", SignupSchema), async (c) => {
  const json = c.req.valid("json");
  const { password, ...createdUser } = await resultToResponse(
    authController.signup(json),
  );
  return c.json({ data: createdUser });
});

authRouter.get("/me", jwt(), async (c) => {
  const payload = c.get("jwtPayload");
  const { password, ...user } = await resultToResponse(
    authController.me({ id: payload.sub }),
  );

  return c.json({ data: user });
});

export default authRouter;
