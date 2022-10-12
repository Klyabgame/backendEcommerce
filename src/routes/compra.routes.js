import { Router } from "express";
import { connection } from "../db.js";
import { cache } from "../middleware/cache.js";

const router = Router();

//En esta pagina realizaremos la compra final de los productos.

//consulta para ver el historial de compras por ID DE USUARIO
router.get('/api/historialCompras/:id',cache, (req,res)=>{

    let sql=`SELECT COMPRA_PRODUCTO_USUARIO.idVenta,DETALLE_COMPRA_PRODUCTO_USUARIO.idProductos,PRODUCTOS.imagenProducto,PRODUCTOS.nombreProducto, CATEGORIA.nombreCategoria,MARCA.nombreMarca,PRODUCTOS.precioUnitario,DETALLE_COMPRA_PRODUCTO_USUARIO.cantidad,DETALLE_COMPRA_PRODUCTO_USUARIO.totalDetalle, COMPRA_PRODUCTO_USUARIO.totalVenta, USUARIO.email,COMPRA_PRODUCTO_USUARIO.fechaVenta  FROM COMPRA_PRODUCTO_USUARIO INNER JOIN DETALLE_COMPRA_PRODUCTO_USUARIO on COMPRA_PRODUCTO_USUARIO.idVenta=DETALLE_COMPRA_PRODUCTO_USUARIO.idVenta INNER JOIN PRODUCTOS on DETALLE_COMPRA_PRODUCTO_USUARIO.idProductos=PRODUCTOS.idProductos INNER JOIN USUARIO on COMPRA_PRODUCTO_USUARIO.idUsuario=USUARIO.idUsuario INNER JOIN CATEGORIA on PRODUCTOS.idCategoria= CATEGORIA.idCategoria INNER JOIN MARCA on PRODUCTOS.idMarca=MARCA.idMarca WHERE USUARIO.idUsuario=?`
    connection.query(sql,[req.params.id], (error,result)=>{
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

//Consulta para insertar la VENTA de los productos

router.post('/api/compras/',(req,res)=>{

    let totalVenta=req.body.totalVenta;
    let idUsuario=req.body.idUsuario;
    let data= {totalVenta,idUsuario}

    let sql="INSERT INTO COMPRA_PRODUCTO_USUARIO SET ?";
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

//Consulta para insertar los detalle venta de los productos

router.post('/api/detalleCompras/',(req,res)=>{

    let idVenta=req.body.idVenta;
    let cantidad=req.body.cantidad;
    let idProductos=req.body.idProductos;
    let totalDetalle=req.body.totalDetalle;
    let data= {idVenta,cantidad,idProductos,totalDetalle}

    let sql="INSERT INTO DETALLE_COMPRA_PRODUCTO_USUARIO SET ?";
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

export default router;