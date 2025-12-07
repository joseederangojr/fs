import z, { ZodType } from "zod";
import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

export const zValidator = <
  T extends ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      throw new HTTPException(422, {
        message: "Unprocessable Entity Error",
        res: new Response(
          JSON.stringify(z.flattenError(result.error).fieldErrors),
          {
            status: 422,
            statusText: "Unprocessable Entity Error",
          },
        ),
      });
    }
  });
