import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle({ client: pool });