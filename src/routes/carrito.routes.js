import { Router } from "express";
import { connection } from "../db.js";
import { cache } from "../middleware/cache.js";

const router = Router();
//LEER BIEN LOS COMENTARIOS ANTES DE CUALQUIER USO.

//Este primer get servira para mostrarnos todos los carritos --EXPERIMENTAL--
router.get("/api/carrito/", (req, res) => {

    connection.query('SELECT idCarrito,CARRITO.idProductos,CARRITO.idUsuario, cantidadCarrito, precioCarrito, nombreProducto,descripcion,precioUnitario,stock,imagenProducto,email,nombreMarca  FROM CARRITO INNER JOIN PRODUCTOS on CARRITO.idProductos=PRODUCTOS.idProductos INNER JOIN USUARIO on CARRITO.idUsuario=USUARIO.idUsuario INNER JOIN MARCA on PRODUCTOS.idMarca=MARCA.idMarca', (error,result)=>{
        if(error){
            throw error;

        }else{
            for (const product of result) {
                const b64 = Buffer.from(product.imagenProducto).toString("base64");
                const mimeType = "image/png"; // e.g., image/png
                const url = `data:${mimeType};base64,${b64}`;
                product.imagenProducto = url;
              }
            res.send(result);
        }
    })
});

//1.INSERTAR CARRITO--Este metodo nos servira para registrar el carrito
router.post('/api/carrito/',(req,res)=>{

    let idProductos=req.body.idProductos;
    let idUsuario=req.body.idUsuario;
    let cantidadCarrito= req.body.cantidadCarrito;
    let precioCarrito=req.body.precioCarrito;
    let data= {idProductos,idUsuario,cantidadCarrito,precioCarrito}

    let sql="INSERT INTO CARRITO SET ?";
    connection.query(sql, data, function(error, results){
        if(error){
            throw error;

        }else{
            /* res.send(results); */
            Object.assign(data,{id:results.insertId});
            res.send(data);
            
        }
    });
});

//2.-MOSTRAR CARRITO---Este get nos servira para mostrar todos los carritos pertenecientes a un idUsuario. capturar el id del usuario que a iniciado sesion
router.get("/api/carrito/:id",cache, (req, res) => {

    connection.query('SELECT idCarrito,CARRITO.idProductos,CARRITO.idUsuario, cantidadCarrito, precioCarrito, nombreProducto,descripcion,precioUnitario,stock,imagenProducto,email,nombreMarca  FROM CARRITO INNER JOIN PRODUCTOS on CARRITO.idProductos=PRODUCTOS.idProductos INNER JOIN USUARIO on CARRITO.idUsuario=USUARIO.idUsuario INNER JOIN MARCA on PRODUCTOS.idMarca=MARCA.idMarca WHERE CARRITO.idUsuario=?',[req.params.id], (error,result)=>{
        if(error){
            throw error;

        }else{
            for (const product of result) {
                const b64 = Buffer.from(product.imagenProducto).toString("base64");
                const mimeType = "image/png"; // e.g., image/png
                const url = `data:${mimeType};base64,${b64}`;
                product.imagenProducto = url;
              }
            res.send(result);
        }
    })
});

//3.- EDITAR CARRITO----ESTO SERVIRA PARA EDITAR EL CARRITO

router.put('/api/carrito/:id', (req,res)=>{
    let idCarrito =req.params.id;
    let cantidadCarrito=req.body.cantidadCarrito;
    let precioCarrito=req.body.precioCarrito;
    let sql=`UPDATE CARRITO SET cantidadCarrito=?, precioCarrito=? WHERE idCarrito=${idCarrito}`;
    connection.query(sql,[cantidadCarrito,precioCarrito, idCarrito], function(error,results){
        if(error){
            throw error;

        }else{
            res.send(results);
            
        }
    });
});

//4.- ELIMINAR CARRITO--Este delete elimina el ID_CARRITO no confundir y colocar idUsuario,en front captura el id de carrito para eliminarlo.
router.delete('/api/carrito/:id', (req,res)=>{
    connection.query('DELETE FROM CARRITO WHERE IdCarrito=?', [req.params.id],function(error,filas){
        if(error){
            throw error;

        }else{
            res.send(filas);
            
        }
    });
});

  export default router;