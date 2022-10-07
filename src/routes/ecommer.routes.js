import { Router } from "express";
import { connection } from "../db.js";
import { cache } from "../middleware/cache.js";

const router = Router();

router.get("/api/ecommerce/products", cache, (req, res) => {
  const sql = "SELECT * FROM PRODUCTOS";
  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    for (const product of result) {
      const b64 = Buffer.from(product.imagenProducto).toString("base64");
      const mimeType = "image/png"; // e.g., image/png
      const url = `data:${mimeType};base64,${b64}`;
      product.imagenProducto = url;
    }
    
    res.send(result);
  });
});

export default router;
