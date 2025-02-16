import {config} from "dotenv";
config();

export const configEnv = {
  portApp: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbHost: process.env.DB_HOST,
  database: process.env.DB_NAME,
  dbPassword: process.env.DB_PASS,
  dbPort: parseInt(process.env.DB_PORT || '5432'),
};