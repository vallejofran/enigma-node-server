require('dotenv').config();
const express = require('express');

const { connectDb } = require('./database/mongo-conn');
const routes = require('./routes')


class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT

        // Conectar la base de datos
        this.connectDb()

        // Middlewares
        this.middlewares()

        // Routes
        this.routes()
    }

    async connectDb() {
        await connectDb()
    }

    middlewares() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
    }

    routes() {
        this.app.use('/', routes)
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor en funcionamiento en el puerto ${this.port}`)
        });
    }    
}

module.exports = Server

