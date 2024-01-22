import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWTgenerator = (payload = "") => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "4h" },
      (err, token) => {
        if (err) reject("No se pudo generar el token");
        else resolve(token);
      }
    );
  });
};

const JWTVerify = async (token = "") => {
  if (token.length < 10) return null;

  try {
    const { email } = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({ email });
    if (!user) return null;

    return user;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // El token ha caducado
      console.error({ error: "Token expirado" });
      // process.exit(0);
    } else {
      // El token es inválido por otra razón
      console.error(error);
      // process.exit(0);
    }
  }
};

export { JWTgenerator, JWTVerify };
