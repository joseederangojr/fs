import { CamelCasePlugin, PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import { Pool } from "pg";
import { env } from "./src/utils/env";

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: env("DATABASE_URL"),
    }),
  }),
  migrations: {
    migrationFolder: "database/migrations",
  },
  plugins: [new CamelCasePlugin()],
  seeds: {
    seedFolder: "database/seeds",
  },
});
