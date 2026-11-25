import { databaseUrl } from "./src/config/env.js";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl(),
  },
});