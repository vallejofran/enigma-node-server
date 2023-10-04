require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connectDb } = require('./database/mongo-conn');
const routes = require('./routes')

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT

        // Middlewares
        this.middlewares()

        // Routes
        this.routes()
    }

    middlewares() {
        this.app.use( cors() );
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
    }

    routes() {
        this.app.use('/', routes)
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor en funcionamiento en el puerto ${this.port}`)
            // Connect to MognoDB 
            connectDb()
        });
    }    
}

module.exports = Server

