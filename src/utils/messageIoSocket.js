const mensajes = [
    // {user: 'fede', message: 'hola'}
]

// importar manager message
exports.messageIoSocket = (io)=>{
    io.on('connection', socket => {       
    
        socket.on('message', data => {
            // console.log(data)
            mensajes.push(data)
            io.emit('messageLogs', mensajes)
        })
    
        socket.on('authenticated', data => {
            socket.broadcast.emit('newUserConnected', data)
        })
    })
}