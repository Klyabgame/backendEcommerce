import jwt from "jsonwebtoken";

export const generateJWT = (payload) => {
  return jwt.sign(payload, "clavexd", {
    expiresIn: "2h",
  });
};
