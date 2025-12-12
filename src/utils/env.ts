import { readFileSync } from "node:fs";

export const env = (key: string): string => {
  try {
    if (process.env[`${key}_FILE`]) {
      return readFileSync(process.env[`${key}_FILE`]!, "utf8") as string;
    }
  } catch (cause) {
    console.warn(`Failed to read from file ${key}_FILE`);
  }
  return process.env[key] as string;
};
