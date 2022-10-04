import express from "express";
import cors from 'cors';
import indexRoutes from "./routes/index.routes.js";
import authRoutes from './routes/auth.routes.js';
import ecommerceRoutes from './routes/ecommer.routes.js';

const PORT = 3000;
const app = express();

app.use(cors())
app.use(express.json());
app.use(indexRoutes);
app.use(authRoutes);
app.use(ecommerceRoutes)


// //-------------------------------------------------------------------------------------------------------------------->
// //ROL CRUD
// //ver tablas rol

// app.get("/api/rol", (req, res) => {
//   connection.query("SELECT * FROM ROL", (error, filas) => {
//     if (error) {
//       throw error;
//     } else {
//       res.send(filas);
//     }
//   });
// });

// //mostrar solo un ROL
// app.get("/api/rol/:id", (req, res) => {
//   connection.query(
//     "SELECT * FROM ROL WHERE idRol=?",
//     [req.params.id],
//     (error, fila) => {
//       if (error) {
//         throw error;
//       } else {
//         res.send(fila);
//       }
//     }
//   );
// });

// //para insertar
// app.post("/api/rol", (req, res) => {
//   /* let idRol =req.params.idRol; */
//   let tipoRol = req.body.tipoRol;
//   let data = { tipoRol };
//   let sql = "INSERT INTO ROL SET ?";
//   /* let sql="INSERT INTO `rol` (`idRol`, `tipoRol`) VALUES ('?', '?')" */
//   connection.query(sql, data, function (error, results) {
//     if (error) {
//       throw error;
//     } else {
//       Object.assign(data, { id: results.insertId });
//       res.send(data);
//     }
//   });
// });

// //para editar
// app.put("/api/rol/:id", (req, res) => {
//   let idRol = req.params.id;
//   let tipoRol = req.body.tipoRol;
//   let sql = "UPDATE ROL SET tipoRol=? WHERE idRol=?";
//   connection.query(sql, [tipoRol, idRol], function (error, results) {
//     if (error) {
//       throw error;
//     } else {
//       res.send(results);
//     }
//   });
// });

// //eliminar articulos
// app.delete("/api/rol/:id", (req, res) => {
//   connection.query(
//     "DELETE FROM ROL WHERE idRol=?",
//     [req.params.id],
//     function (error, filas) {
//       if (error) {
//         throw error;
//       } else {
//         res.send(filas);
//       }
//     }
//   );
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
