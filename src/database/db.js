import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const connectionDB = new Pool({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USERDB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_URL,
});
