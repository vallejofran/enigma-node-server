const Socket = require('socket.io')


const socketController = async (socket = new Socket(), io) => {
    console.log('### socketController')

    
    socket.on('nuevo-mensaje', ( payload, callback ) => {
        
        console.log(payload);

        const id = 123456789;
        callback( id );

        socket.broadcast.emit('enviar-mensaje', payload );

    })
}


module.exports = {
    socketController
}