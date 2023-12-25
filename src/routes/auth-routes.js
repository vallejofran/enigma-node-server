import { Router } from "express";
const router = Router();
import { check } from "express-validator";

import {
  registerUser,
  loginUser,
  googleSignin,
  validateToken,
} from "../controllers/auth-controller.js";

import fieldsValidator from "../middlewares/fields-validator.js";
import authMiddleware from "../middlewares/jwt-autorization.js";

router.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

router.post("/register", registerUser);

router.post(
  "/login",
  [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    fieldsValidator,
  ],
  loginUser
);

router.post(
  "/login-google",
  [check("token", "El token es necesario").not().isEmpty()],
  googleSignin
);

router.post("/validate-token", authMiddleware, validateToken);

export default router;
