// import { Button, Container, Stack, TextField, Typography } from '@mui/material'
// import { useEffect, useMemo, useState } from 'react'
// import { io } from 'socket.io-client'

// function App() {

//   const [message, setMessage] = useState('')
//   const [room, setRoom] = useState('')
//   const [socketID, setSocketID] = useState('')
//   const [roomName, setRoomName] = useState('')
//   const [recievedMessage, setRecievedMessage] = useState([])
//   //prevent to change userid prequantly 
//   const socket = useMemo(() => io('http://localhost:3000', {
//     withCredentials: true
//   }), [])

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     socket.emit('message', { message, room })
//     setMessage('')

//   }
//   const joinRoomHandler = (e) => {
//     e.preventDefault()
//     socket.emit('join.room', roomName)
//     setRoomName('')

//   }
//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log("Connected--", socket.id);
//       setSocketID(socket.id)

//     })
//     socket.on('receive.message', (data) => {
//       console.log('receive.message', data);
//       setRecievedMessage(prev => [...prev, data])

//     })
//     socket.on('welcome', (data) => {
//       console.log(data);

//     })
//     return () => (
//       socket.disconnect()
//     )
//   }, [])
//   return (
//     <Container maxWidth='sm'>
//       {/* <Typography variant='h1' component='div' gutterBottom>
//         Welcome to Socket.io
//       </Typography> */}
//       <Typography variant='h6' component='div' gutterBottom>
//         {socketID}
//       </Typography>

//       <form onSubmit={joinRoomHandler}>
//         <h5>Join Room</h5>
//         <TextField id='' label='Room Name' variant='outlined' value={roomName} onChange={(e) => setRoomName(e.target.value)} />
//         <Button variant='contained' color='primary' type='submit'>
//           Join
//         </Button>
//       </form>

//       <form onSubmit={handleSubmit}>

//         <TextField id='' label='Message' variant='outlined' value={message} onChange={(e) => setMessage(e.target.value)} />
//         <TextField id='' label='Room' variant='outlined' value={room} onChange={(e) => setRoom(e.target.value)} />
//         <Button variant='contained' color='primary' type='submit'>
//           Send
//         </Button>
//       </form>
//       <Stack>
//         <Typography variant='h6' component='div' gutterBottom>
//           Messages List
//         </Typography>

//         {
//           recievedMessage.map((msg, i) => (
//             <Typography key={i} variant='h6' component='div' gutterBottom>
//               {msg}
//             </Typography>
//           ))
//         }
//       </Stack>
//     </Container>
//   )
// }

// export default App


import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  // Message to be sent
  const [message, setMessage] = useState('');

  // Room to send the message to
  const [room, setRoom] = useState('');

  // Socket ID of the current user
  const [socketID, setSocketID] = useState('');

  // Room name to join
  const [roomName, setRoomName] = useState('');

  // List of received messages
  const [recievedMessage, setRecievedMessage] = useState([]);

  /**
   * Create a socket connection using useMemo to avoid recreating on each render.
   * withCredentials allows cookies (including JWT) to be sent along with requests.
   */
  const socket = useMemo(() => io('http://localhost:3000', {
    withCredentials: true
  }), []);

  /**
   * Handle form submit to emit message to a specific room
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', { message, room });
    setMessage('');
  };

  /**
   * Join a room by emitting 'join.room' event
   */
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit('join.room', roomName);
    setRoomName('');
  };

  /**
   * Setup socket event listeners
   */
  useEffect(() => {
    // When connected, set the socket ID
    socket.on('connect', () => {
      console.log("Connected--", socket.id);
      setSocketID(socket.id);
    });

    // Listen for incoming messages from the server
    socket.on('receive.message', (data) => {
      console.log('receive.message', data);
      setRecievedMessage(prev => [...prev, data]);
    });

    // Optional welcome message from server
    socket.on('welcome', (data) => {
      console.log(data);
    });

    // Clean up socket on unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <Container maxWidth='sm'>
      <Typography variant='h6' component='div' gutterBottom>
        Socket ID: {socketID}
      </Typography>

      {/* Form to join room */}
      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          label='Room Name'
          variant='outlined'
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button variant='contained' color='primary' type='submit'>
          Join
        </Button>
      </form>

      {/* Form to send message */}
      <form onSubmit={handleSubmit}>
        <TextField
          label='Message'
          variant='outlined'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          label='Room'
          variant='outlined'
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button variant='contained' color='primary' type='submit'>
          Send
        </Button>
      </form>

      {/* Display received messages */}
      <Stack>
        <Typography variant='h6' component='div' gutterBottom>
          Messages List
        </Typography>
        {
          recievedMessage.map((msg, i) => (
            <Typography key={i} variant='body1' gutterBottom>
              {msg}
            </Typography>
          ))
        }
      </Stack>
    </Container>
  );
}

export default App;
