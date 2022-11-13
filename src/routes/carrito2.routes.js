import { Router } from "express";
import { connection } from "../database/db.js";

const router = Router();

router.post("/api/ventas/:id", (req, res) => {
  const idUsuario = req.params.id;
  const products = req.body.products.map(p => Object.values(p));
  const quantityTotal = req.body.totalVenta;
  let idVenta;

  const sqlVenta =
    "INSERT INTO COMPRA_PRODUCTO_USUARIO (idUsuario, totalVenta) VALUES (?,?)";

  connection.query(sqlVenta, [idUsuario, quantityTotal], (error, result) => {
    if (error) {
      throw error;
    } else {
      idVenta = result.insertId;
      let sqlDetalle =
        "INSERT INTO DETALLE_COMPRA_PRODUCTO_USUARIO (idVenta,cantidad, idProductos, totalDetalle) VALUES ";
      for (const product of products) {
        product[0] = idVenta;
        sqlDetalle = sqlDetalle + `(${product}),`;
      }
      const newSql = sqlDetalle.substring(0, sqlDetalle.length - 1);
      connection.query(newSql, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.send({ ok: true });
        }
      });
    }
  });
});

router.post("/api/detailsSale/:id", async (req, res) => {
  const idUsuario = req.params.id;

  connection.query(newSql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send({ ok: true });
  });
});

export default router;
