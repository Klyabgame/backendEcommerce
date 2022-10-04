import { response, request } from "express";
import jwt from "jsonwebtoken";

export const revalidateToken = (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    res.status(401).send({
      ok: false,
      message: "Token hay token en la petición",
    });
  }

  try {
    const payload = jwt.verify(token, "clavexd");

    delete payload.iat;
    delete payload.exp;

    req.body = payload;
  } catch (error) {
    res.status(401).send({
      ok: false,
      message: "Token no valido",
    });
  }
  next();
};
