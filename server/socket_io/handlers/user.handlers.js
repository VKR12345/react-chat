import User from './../../models/user.model.js'
const users = {}

export default function userHandlers(io, socket) {
  const { roomId, userName, userLogin } = socket

  if (!users[roomId]) {
    users[roomId] = []
  }

  const updateUserList = () => {
    io.to(roomId).emit('user_list:update', users[roomId])
  }

  socket.on('user:add', async (token) => {

    let userFull 
    console.log('add user socket: ',token)
    await User.findOne({token}, (err, res) => {
      if(err) {
        console.log(err)
      }
      console.log(res)
      userFull = res

      const user = {
      userName: userFull.userName + ' ' + userFull.userSurname,
      userLogin: userFull.userLogin,
      userId: userFull._id
    }

    socket.to(roomId).emit('log', `Пользователь ${user.userLogin} подключился`)
    
    user.socketId = socket.id

    users[roomId].push(user)

    updateUserList()

    }).clone().catch(function(err){ console.log(err)})

    
  })

  socket.on('disconnect', () => {
    if (!users[roomId]) return

    socket.to(roomId).emit('log', `Пользователь отключился`)

    users[roomId] = users[roomId].filter((u) => u.socketId !== socket.id)

    updateUserList()
  })
}
