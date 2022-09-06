// const { Socket } = require('express-socket.io-session');
const express = require('express');
const app = express();
const {createServer, Server} = require('http');
const server = createServer(app);
const{server} = require("socket.io");
const port = 3001;

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on('connection', socket => {
    console.log(`a user connected: ${socket.id}`);
    socket.on("json_room", ({user, room}) =>  {
        socket.join(room)
    })

    socket.on("send-msg", ({room, user, message}) => {
        const d = {user: user, message: message}
        socket.to(room).emit("receive_msg", d);
    });
});

server.listen(port, () => {
    console.log(`listening on ${port}`);
});