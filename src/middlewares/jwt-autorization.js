// require("dotenv").config();

import { verify } from "jsonwebtoken";
import User from "../models/user.js";

function authMiddleware(req, res, next) {
  const token = req.header("x-token");

  if (!token)
    return res
      .status(401)
      .json({ message: "Token de autenticación no proporcionado" });

  try {
    const secretKey = process.env.SECRET_KEY;

    verify(token, secretKey, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          // El token ha caducado
          return res.status(401).json({ error: "Token expirado" });
        } else {
          // El token es inválido por otra razón
          return res.status(401).json({ error: "Token inválido" });
        }
      }

      // El token es válido y no ha caducado
      const email = decoded.email;

      // Verificar si el usuario existe en la base de datos
      const existingUser = await User.findOne({ email });

      if (!existingUser)
        return res.status(403).json({ message: "Acceso denegado" });

      // El usuario tiene acceso, puedes continuar con el siguiente middleware o controlador
      const params = {
        user: existingUser,
        token,
      };

      req.params = params;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Token de autenticación inválido" });
  }
}

export default authMiddleware;
