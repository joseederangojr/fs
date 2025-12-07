import { HTTPException } from "hono/http-exception";
import { ResultAsync } from "neverthrow";
import { z } from "zod";

export const safeParseAsync = <TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown,
) => {
  return ResultAsync.fromPromise(schema.parseAsync(data), (err: unknown) => {
    return new HTTPException(422, {
      message: "Validation error",
      res: new Response(
        JSON.stringify(z.flattenError(err as z.ZodError<TSchema>).fieldErrors),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    });
  });
};
