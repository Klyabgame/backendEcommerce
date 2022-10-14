import jwt from "jsonwebtoken";

export const generateJWT = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      "clavexd",
      {
        expiresIn: "999999years",
      },
      (err, token) => {
        if (err) {
          reject("No se pudo generar le token");
        }
        resolve(token);
      }
    );
  });
};
