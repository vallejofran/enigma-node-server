import dotenv from "dotenv";
dotenv.config();
import express, { json, urlencoded } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import cors from "cors";

import connectDb from "./database/mongo-conn.js";
import socketController from "./sockets/controllers/sockets-controller.js";
import routes from "./routes/index.js";

class ServerApp {
  constructor() {
    this.port = process.env.PORT;
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: "*",
        // methods: ["GET", "POST"],
        // credentials: true
      },
    });

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();

    // Sockets
    this.sockets();
  }

  middlewares() {
    const corsOptions = {
      origin: "*", // URL del cliente React
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos permitidos
      credentials: true, // Permite enviar y recibir cookies
    };

    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  routes() {
    this.app.use("/", routes);
  }

  sockets() {
    this.io.on("connection", (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Servidor en funcionamiento en el puerto ${this.port}`);
      // Connect to MognoDB
      connectDb();
    });
  }
}

export default ServerApp;
