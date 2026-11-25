import { databaseUrl } from "./env.js";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  connectionString: databaseUrl(),
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle({ client: pool });