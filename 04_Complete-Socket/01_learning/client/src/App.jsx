import { Button, Container, TextField, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

function App() {
  
  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [socketID,setSocketID]=useState('')
  const [recievedMessage,setRecievedMessage]=useState('')
  //prevent to change userid prequantly 
  const socket = useMemo(()=>io('http://localhost:3000'),[])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message',{message,room})
    setMessage('')

  }
  useEffect(() => {
    socket.on('connect', () => {
      console.log("Connected--", socket.id);
      setSocketID(socket.id)

    })
    socket.on('receive.message',(data)=>{
      console.log('receive.message',data);
      setRecievedMessage(data)
      
    })
    socket.on('welcome', (data) => {
      console.log(data);

    })
    return () => (
      socket.disconnect()
    )
  }, [])
  return (
    <Container maxWidth='sm'>
      {/* <Typography variant='h1' component='div' gutterBottom>
        Welcome to Socket.io
      </Typography> */}
      <Typography variant='h6' component='div' gutterBottom>
     {socketID}
      </Typography>
      <Typography variant='h6' component='div' gutterBottom>
     {recievedMessage}
      </Typography>

      <form onSubmit={handleSubmit}>

        <TextField id='' label='Message' variant='outlined' value={message} onChange={(e) => setMessage(e.target.value)} />
        <TextField id='' label='Room' variant='outlined' value={room} onChange={(e) => setRoom(e.target.value)} />
        <Button variant='contained' color='primary' type='submit'>
          Send
        </Button>
      </form>
    </Container>
  )
}

export default App