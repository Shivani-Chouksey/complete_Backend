Working Overview: How This Works
🔐 1. Authentication
The backend /login route creates a JWT and sets it as an httpOnly cookie.

The client uses withCredentials: true to ensure this cookie is sent when connecting to the socket server.

📡 2. Socket Connection
The client connects to http://localhost:3000 using Socket.IO.

On the backend, a middleware checks the JWT from the cookie before allowing the connection.

🔁 3. Join Room
The user enters a room name and clicks "Join".

The client emits join.room with the room name.

The server adds that socket to the room using socket.join(roomName).

💬 4. Send & Receive Messages
The user types a message and specifies the room to send it to.

The message is emitted via message event to the server.

The server then broadcasts the message to all other users in that room using socket.to(room).emit(...).

The client listens for receive.message and updates the UI.

🔌 5. Disconnect
When the React component unmounts (or browser closes), the socket disconnects cleanly.