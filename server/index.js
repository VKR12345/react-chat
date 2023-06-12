import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import { ALLOWED_ORIGIN, jwtSecret, MONGODB_URI } from './config.js'
import { changePassword, createUser, getUser } from './handlers/user.handlers.js'
import { signIn } from './handlers/user.handlers.js'
import onConnection from './socket_io/onConnection.js'
import { getFilePath } from './utils/file.js'
import onError from './utils/onError.js'
import upload from './utils/upload.js'
import jwt from 'jsonwebtoken'
import User from './models/user.model.js'

const app = express()

app.use(
  cors({
    origin: ALLOWED_ORIGIN
  })
)
app.use(express.json())

app.use('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.sendStatus(400)

  const relativeFilePath = req.file.path
    .replace(/\\/g, '/')
    .split('server/files')[1]

  res.status(201).json(relativeFilePath)
})

app.use('/files', (req, res) => {
  const filePath = getFilePath(req.url)

  res.status(200).sendFile(filePath)
})

app.use(onError)

try {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  console.log('🚀 Connected')
} catch (e) {
  onError(e)
}

app.post('/user', createUser)
app.post('/login', signIn)
app.post('/password', changePassword)
app.get('/user', getUser)

const server = createServer(app)

const io = new Server(server, {
  cors: ALLOWED_ORIGIN,
  serveClient: false
})


io.use(async function(socket, next){
  console.log('connection socket')
  if (socket.handshake.query && socket.handshake.query.token){
    await jwt.verify(socket.handshake.query.token, jwtSecret, async function(err, decoded) {
      if (err) {
        console.log('error auth')
        return next(new Error('Authentication error'));
      }
      socket.decoded = decoded;

      await User.findById(socket.decoded, (err, res) => {
        if (err) {
          console.log(err)
        }
        socket.userName = res.userLogin
      }).clone().catch(function(err){ console.log(err)})
      

      console.log('decoded: ',decoded)
      next();
    });
  }
  else {
    console.log('error auth')
    next(new Error('Authentication error'));
  }    
}).on('connection', (socket) => {
  console.log('we have socket connection')
  onConnection(io, socket)
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`)
})

