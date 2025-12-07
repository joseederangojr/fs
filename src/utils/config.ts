import { z } from "zod";
import { hourToSeconds } from "./date";

export const ConfigSchema = z.object({
  APP_URL: z.url().default("http://localhost:5000"),
  APP_PORT: z.coerce.number().default(5000),
  APP_ENV: z.enum(["development", "production"]).default("development"),
  BODY_LIMIT: z.coerce.number().transform((x: number) => Number(x) * 1024),
  DATABASE_URL: z.string().min(1),
  HASH_ROUNDS: z.coerce.number().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRY: z.coerce
    .number()
    .min(1)
    .default(1)
    .transform((x) => hourToSeconds(x)),
  JWT_ALG: z
    .enum([
      "HS256",
      "HS384",
      "HS512",
      "RS256",
      "RS384",
      "RS512",
      "PS256",
      "PS384",
      "PS512",
      "ES256",
      "ES384",
      "ES512",
      "EdDSA",
    ])
    .default("HS256"),
  CORS_ORIGIN: z.string().transform((x) => x.split(",")),
});

export type ConfigData = z.infer<typeof ConfigSchema>;

export default ConfigSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ConfigData {}
  }
}
