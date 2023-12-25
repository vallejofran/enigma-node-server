require('dotenv').config();
const express = require('express');
const { createServer } = require('http')
const { Server } = require("socket.io");

const cors = require('cors');

const { connectDb } = require('./database/mongo-conn');
const { socketController } = require('./sockets/controllers/socketsController')
const routes = require('./routes')


class ServerApp {
    constructor() {
        this.port = process.env.PORT
        this.app = express()
        this.server = createServer(this.app)
        this.io = new Server(this.server, {
            cors: {
                origin: "*",
                // methods: ["GET", "POST"],
                // credentials: true
            }
        });

        // Middlewares
        this.middlewares()

        // Routes
        this.routes()

        // Sockets
        this.sockets()
    }

    middlewares() {
        const corsOptions = {
            origin: '*', // URL del cliente React
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
            credentials: true, // Permite enviar y recibir cookies
        };

        this.app.use(cors());
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
    }

    routes() {
        this.app.use('/', routes)
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io))
        // this.io.on('connection', socketController)
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor en funcionamiento en el puerto ${this.port}`)
            // Connect to MognoDB 
            connectDb()
        });
    }
}

module.exports = ServerApp