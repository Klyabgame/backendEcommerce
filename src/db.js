import { createPool } from "mysql2";
import * as dotenv from 'dotenv'
dotenv.config()

export const connection = createPool({
  host:process.env.host,
  user:process.env.user,
  password:process.env.password,
  database:process.env.database
  
});
