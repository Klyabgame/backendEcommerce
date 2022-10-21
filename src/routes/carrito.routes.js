import { Router } from "express";
import { connection } from "../db.js";
import { cache } from "../middleware/cache.js";

const router = Router();
//LEER BIEN LOS COMENTARIOS ANTES DE CUALQUIER USO..

//Este primer get servira para mostrarnos todos los carritos --EXPERIMENTAL--
router.get("/api/carrito/:idUsuario", (req, res) => {
  const id = req.params.idUsuario;
  connection.query(
    "SELECT idCarrito,CARRITO.idProductos,CARRITO.idUsuario, cantidadCarrito, precio, nombreProducto,descripcion,precioUnitario,stock,imagenProducto,email,nombreMarca  FROM CARRITO INNER JOIN PRODUCTOS on CARRITO.idProductos=PRODUCTOS.idProductos INNER JOIN USUARIO on CARRITO.idUsuario=USUARIO.idUsuario INNER JOIN MARCA on PRODUCTOS.idMarca=MARCA.idMarca WHERE USUARIO.idUsuario = ?",
    [id],
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

  const sqlSearchCarrito = "SELECT * FROM CARRITO WHERE idProductos = ? AND idUsuario = ?";
  const sqlUpdate =
    "UPDATE CARRITO SET cantidadCarrito = ? WHERE idProductos = ?";
  const sqlAddProduct = "INSERT INTO CARRITO SET ?";
  const sqlSearchProduct = "SELECT * FROM PRODUCTOS WHERE idProductos = ?";

  connection.query(sqlSearchCarrito, [idProductos, idUsuario], (error, result) => {
    if (error) {
      throw error;
    } else {
      if (result.length > 0) {
        const beforeQuantity = result[0].cantidadCarrito;
        const newQuantity = beforeQuantity + cantidadCarrito;
        connection.query(sqlSearchProduct, [idProductos], (err, result) => {
          if (err) {
            throw err;
          } else {
            const stock = result[0].stock;
            if (stock >= newQuantity) {
              connection.query(
                sqlUpdate,
                [newQuantity, idProductos],
                (err, result) => {
                  if (err) {
                    throw err;
                  } else {
                    res.send({ ok: true, message: "Agregado al carrito" });
                  }
                }
              );
            } else {
              res.send({ ok: false, message: "Stock no disponible" });
            }
          }
        });
      } else {
        connection.query(sqlAddProduct, data, (error, result) => {
          if (error) {
            throw error;
          } else {
            res.send({ ok: true, message: "Agregado al carrito" });
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

router.put("/api/carrito/:idCarrito", (req, res) => {
  const idCarrito = req.params.idCarrito;
  const idProducto = req.body.product;
  const quantity = req.body.quantity;
  const sql = "UPDATE CARRITO SET cantidadCarrito=? WHERE idCarrito=?";
  const sqlSearchProduct = "SELECT * FROM PRODUCTOS WHERE idProductos=?";
  const sqlSearchCarrito = "SELECT * FROM CARRITO WHERE idCarrito=?";

  connection.query(sqlSearchProduct, [idProducto], (err, result) => {
    if (err) {
      throw err;
    } else {
      const stock = result[0].stock;
      connection.query(sqlSearchCarrito, [idCarrito], (err, result) => {
        if (err) {
          throw err;
        } else {
          const newQuantity = result[0].cantidadCarrito + quantity;
          if (stock >= newQuantity) {
            connection.query(sql, [newQuantity, idCarrito], (err, result) => {
              if (err) {
                throw err;
              } else {
                res.send({ ok: true, message: "Agregado al carrito" });
              }
            });
          } else {
            res.send({ ok: false, message: "Stock no disponible" });
          }
        }
      });
    }
  });
});

// Para decrementar el carrito puesto que la ruta de arriba ⬆️ no me sirve
router.put("/api/carrito/decrementar/:idCarrito", (req, res) => {
  const idCarrito = req.params.idCarrito;
  const quantity = req.body.quantity; 
  const sql = "UPDATE CARRITO SET cantidadCarrito=? WHERE idCarrito=?";

  connection.query(sql, [quantity, idCarrito], (err, result) => {
    if(err) {
      throw err;
    }else{
      res.send({ok:true, message: 'Carrito actualizado'});
    }
  })
  
});

//4.- ELIMINAR CARRITO--Este delete elimina el ID_CARRITO no confundir y colocar idUsuario,en front captura el id de carrito para eliminarlo.
router.delete("/api/carrito/producto/:idCarrito", (req, res) => {
  const id = req.params.idCarrito;
  connection.query(
    "DELETE FROM CARRITO WHERE IdCarrito=?",
    [id],
    (error, result) => {
      if (error) {
        throw error;
      } else {
        res.send({ ok: true, message: "Producto eliminado" });
      }
    }
  );
});

router.delete("/api/carrito/:idUsuario", (req, res) => {
  const idUsuario = req.params.idUsuario;
  const sql = "DELETE FROM CARRITO WHERE idUsuario = ?";

  connection.query(sql, [idUsuario], (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send({ ok: true, message: "Carrito Eliminado" });
    }
  });
});


export default router;
