import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./src/db/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING,
  },
});