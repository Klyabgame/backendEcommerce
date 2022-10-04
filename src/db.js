import { createPool } from "mysql2";

export const connection = createPool({
  host: "65.109.53.171",
  user: "schwartz_franz",
  password: "Ecommerce123",
  database: "schwartz_Proyecto_ecommerce",
});
