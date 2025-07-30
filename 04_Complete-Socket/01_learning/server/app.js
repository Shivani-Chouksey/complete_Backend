import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors'
const PORT = 3000

const app = express()
const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
})


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}))

app.get("/", (req, res) => {
    res.send("hello world")
})


io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('message', (data) => {
        console.log(data)
        // for a percular user/room
        socket.to(data.room).emit('receive.message',data.message)
        // socket.broadcast.emit('receive.message',data)
    }
    )


    socket.on('disconnect', () => {
        console.log('user diconnected', socket.id);

    })
    // socket.emit("welcome",`welcome to the socket server `)
    // socket.broadcast.emit('welcome',`${socket.id} joined the server`)

})

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);

})