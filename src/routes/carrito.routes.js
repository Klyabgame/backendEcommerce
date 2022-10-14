import { Router } from "express";
import { connection } from "../db.js";
import { cache } from "../middleware/cache.js";

const router = Router();
//LEER BIEN LOS COMENTARIOS ANTES DE CUALQUIER USO..

//Este primer get servira para mostrarnos todos los carritos --EXPERIMENTAL--
router.get("/api/carrito/", (req, res) => {
  connection.query(
    "SELECT idCarrito,CARRITO.idProductos,CARRITO.idUsuario, cantidadCarrito, precio, nombreProducto,descripcion,precioUnitario,stock,imagenProducto,email,nombreMarca  FROM CARRITO INNER JOIN PRODUCTOS on CARRITO.idProductos=PRODUCTOS.idProductos INNER JOIN USUARIO on CARRITO.idUsuario=USUARIO.idUsuario INNER JOIN MARCA on PRODUCTOS.idMarca=MARCA.idMarca",
    (error, result) => {
      if (error) {
        throw error;
      } else {
        for (const product of result) {
          const b64 = Buffer.from(product.imagenProducto).toString("base64");
          const mimeType = "image/png"; // e.g., image/png
          const url = `data:${mimeType};base64,${b64}`;
          product.imagenProducto = url;
        }
        res.send(result);
      }
    }
  );
});

//1.INSERTAR CARRITO--Este metodo nos servira para registrar el carrito
router.post("/api/carrito/", (req, res) => {
  const idProductos = req.body.idProductos;
  const idUsuario = req.body.idUsuario;
  const cantidadCarrito = req.body.cantidadCarrito;
  const precio = req.body.precio;
  const data = { idProductos, idUsuario, cantidadCarrito, precio };

  const sqlAddProduct = "INSERT INTO CARRITO SET ?";
  const sqlUpdate = "UPDATE CARRITO SET cantidadCarrito = ? WHERE idProductos = ?";
  const sqlSearchCarrito = "SELECT * FROM CARRITO WHERE idProductos = ?";

  connection.query(sqlSearchCarrito, [idProductos], (error, result) => {
    if (error) {
      throw error;
    } else {
      if (result.length > 0) {
        const beforeQuantity = result[0].cantidadCarrito;
        const newQuantity = beforeQuantity + cantidadCarrito;
        connection.query(sqlUpdate, [ newQuantity, idProductos],(error, result) => {
          if (error) {
            throw error;
          } else {
            res.send({ ok: true, message: "Producto actualizado" });
          }
        });
      } else {
        connection.query(sqlAddProduct, data, (error, result) => {
          if (error) {
            throw error;
          } else {
            res.send({ ok: true, message: "Producto agregado al carrito" });
          }
        });
      }
    }
  });
});

//2.-MOSTRAR CARRITO---Este get nos servira para mostrar todos los carritos pertenecientes a un idUsuario. capturar el id del usuario que a iniciado sesion
router.get("/api/carrito/:id", cache, (req, res) => {
  connection.query(
    "SELECT idCarrito,CARRITO.idProductos,CARRITO.idUsuario, cantidadCarrito, precio, nombreProducto,descripcion,precioUnitario,stock,imagenProducto,email,nombreMarca  FROM CARRITO INNER JOIN PRODUCTOS on CARRITO.idProductos=PRODUCTOS.idProductos INNER JOIN USUARIO on CARRITO.idUsuario=USUARIO.idUsuario INNER JOIN MARCA on PRODUCTOS.idMarca=MARCA.idMarca WHERE CARRITO.idUsuario=?",
    [req.params.id],
    (error, result) => {
      if (error) {
        throw error;
      } else {
        for (const product of result) {
          const b64 = Buffer.from(product.imagenProducto).toString("base64");
          const mimeType = "image/png"; // e.g., image/png
          const url = `data:${mimeType};base64,${b64}`;
          product.imagenProducto = url;
        }
        res.send(result);
      }
    }
  );
});

//3.- EDITAR CARRITO----ESTO SERVIRA PARA EDITAR EL CARRITO

router.put("/api/carrito/:id", (req, res) => {
  let idCarrito = req.params.id;
  let cantidadCarrito = req.body.cantidadCarrito;
  let precio = req.body.precio;
  let sql = `UPDATE CARRITO SET precio=?, precio=? WHERE idCarrito=${idCarrito}`;
  connection.query(
    sql,
    [cantidadCarrito, precio, idCarrito],
    function (error, results) {
      if (error) {
        throw error;
      } else {
        res.send(results);
      }
    }
  );
});

//4.- ELIMINAR CARRITO--Este delete elimina el ID_CARRITO no confundir y colocar idUsuario,en front captura el id de carrito para eliminarlo.
router.delete("/api/carrito/:id", (req, res) => {
  connection.query(
    "DELETE FROM CARRITO WHERE IdCarrito=?",
    [req.params.id],
    function (error, filas) {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
});

export default router;
