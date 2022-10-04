import jwt from "jsonwebtoken";

export const generateJWT = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      "clavexd",
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log("error en archuvo jwt", err);
          reject("No se pudo generar le token");
        }
        resolve(token);
      }
    );
  });
};
