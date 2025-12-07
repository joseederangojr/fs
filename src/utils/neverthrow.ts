import { HTTPException } from "hono/http-exception";
import { ok, type Result } from "neverthrow";

export const resultToResponse = async <T, E>(func: Promise<Result<T, E>>) => {
  const result = await func;
  if (result.isErr()) {
    if (result.error instanceof HTTPException) {
      throw result.error;
    }

    throw new HTTPException(500);
  }

  return result.value;
};

export const safeLogger = (context: string) => {
  return (...args: unknown[]) => {
    console.log(`[${context}]`, ...args);
    return ok();
  };
};
