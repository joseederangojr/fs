import { CamelCasePlugin, PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import { Pool } from "pg";
import config from "./src/utils/config";

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: config.DATABASE_URL,
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
