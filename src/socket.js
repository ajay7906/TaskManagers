const {Server} = require('socket.io');

function initSocket(server, options = {}){
    const io = new Server(server, {
        cors:{
            origin: "*",
            methods:["GET", "POST", "PUT", "DELETE", "PATCH"]
        },
        ...options
    });

    io.on("connection", (socket) => {
        socket.on("join", (userId) => {
            if(userId) socket.join(`User: ${userId}`)
        })
       socket.on("disconnect", () => {
          console.log('Socked disconnect', socket.id)
       })

    })

    return io
} 

module.exports = initSocket;