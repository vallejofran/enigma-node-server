import { Router } from "express";
const router = Router();

import authMiddleware from "../middlewares/jwt-autorization.js";

router.get("/validate-token", authMiddleware, (req, res) => {
  res.status(200).send("Enhorabuena has accedido a una ruta protegida");
});

router.get("/renew-token", authMiddleware, (req, res) => {
  res.status(200).send("Enhorabuena has accedido a una ruta protegida");
});

export default router;
