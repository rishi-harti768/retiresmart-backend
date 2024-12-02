import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
});

pool.on("error", (err) => console.log("database error: " + err));

export const initDB = async () => {
  const accounts = `CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type integer NOT NULL Default 1,
    verified boolean NOT NULL DEFAULT false,
    password_token VARCHAR(255),
    verify_token VARCHAR(255),
    refresh_token VARCHAR(255));`;
  try {
    await pool.query(accounts);
    console.log("Accounts table created");
  } catch (err) {
    console.log(err);
  }
};

export default pool;
