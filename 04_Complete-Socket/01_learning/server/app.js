// import express from 'express'
// import { Server } from 'socket.io'
// import { createServer } from 'http'
// import cors from 'cors'
// import jwt from 'jsonwebtoken'
// import cookieParser from 'cookie-parser'
// const PORT = 3000
// const JWT_SECRET = 'JWT_SECRET'
// const app = express()
// const server = createServer(app)

// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:5173',
//         methods: ['GET', 'POST'],
//         credentials: true
//     }
// })


// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST'],
//     credentials: true
// }))



// app.get("/", (req, res) => {
//     res.send("hello world")
// })

// app.get("/login", (req, res) => {
//     const TOKEN = jwt.sign({ _id: 'fdsfhgsdhfgsjf' }, JWT_SECRET)
//     res.cookie('token', TOKEN, { httpOnly: true, secure: true, sameSite: "none" }).json({ message: "Login Success" })
// })

// //scoket middleware
// io.use((socket, next) => {
//     cookieParser()(socket.request, socket.request.res, (err) => {
//         if (err) {
//             return next(err)
//         }
//         const token = socket.request.cookies.token
//         if (!token) {
//             return next(new Error('Authentication Failed'))
//         }
//         const decoded = jwt.verify(token, JWT_SECRET);
//         next()

//     })

// })

// io.on('connection', (socket) => {
//     console.log('user connected', socket.id);

//     socket.on('message', (data) => {
//         console.log(data)
//         // for a percular user/room
//         socket.to(data.room).emit('receive.message', data.message)
//         // socket.broadcast.emit('receive.message',data)
//     }
//     )

//     socket.on('join.room', (data) => {
//         console.log('join.room', data);

//         socket.join(data)
//     })
//     socket.on('disconnect', () => {
//         console.log('user diconnected', socket.id);

//     })
//     // socket.emit("welcome",`welcome to the socket server `)
//     // socket.broadcast.emit('welcome',`${socket.id} joined the server`)

// })

// server.listen(PORT, () => {
//     console.log(`server is running on port ${PORT}`);

// })



// Import necessary modules
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

// Constants
const PORT = 3000;
const JWT_SECRET = 'JWT_SECRET';

// Initialize express app and HTTP server
const app = express();
const server = createServer(app);

// Setup CORS for both Express and Socket.IO
const corsOptions = {
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST'],
    credentials: true // Allow cookies to be sent
};

// Apply CORS to Express app
app.use(cors(corsOptions));

// Setup Socket.IO with CORS options
const io = new Server(server, {
    cors: corsOptions
});

// ===== Routes =====

// Root route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Dummy login route - issues JWT and sets it as a cookie
app.get('/login', (req, res) => {
    const TOKEN = jwt.sign({ _id: 'example-user-id' }, JWT_SECRET);
    res
        .cookie('token', TOKEN, {
            httpOnly: true,        // Prevent JavaScript access
            secure: true,          // Use HTTPS in production
            sameSite: 'none'       // Allow cross-site cookies
        })
        .json({ message: 'Login Success' });
});

// ===== Socket.IO Authentication Middleware =====
io.use((socket, next) => {
    // Parse cookies from incoming request
    cookieParser()(socket.request, socket.request.res || {}, (err) => {
        if (err) return next(err);

        const token = socket.request.cookies?.token;
        if (!token) return next(new Error('Authentication Failed'));

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            socket.user = decoded; // Attach user info to socket if needed
            next();
        } catch (error) {
            return next(new Error('Invalid Token'));
        }
    });
});

// ===== Socket.IO Event Handling =====
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listen for join room event
    socket.on('join.room', (roomId) => {
        console.log('Joining room:', roomId);
        socket.join(roomId);
    });

    // Listen for message event
    socket.on('message', (data) => {
        console.log('Received message:', data);

        // Emit message to others in the same room
        socket.to(data.room).emit('receive.message', data.message);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    // Optional: emit welcome message
    // socket.emit("welcome", "Welcome to the socket server");
    // socket.broadcast.emit('welcome', `${socket.id} joined the server`);
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
