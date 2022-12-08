import Message from '../../models/message.model.js'
import User from '../../models/user.model.js'
import { removeFile } from '../../utils/file.js'
import onError from '../../utils/onError.js'

const messages = {}

export default function messageHandlers(io, socket) {
  const { roomId } = socket

  const updateMessageList = () => {
    io.to(roomId).emit('message_list:update', messages[roomId])
  }

  socket.on('message:get', async () => {
    try {
      const _messages = await Message.find({ roomId })

      messages[roomId] = _messages

      updateMessageList()
    } catch (e) {
      onError(e)
    }
  })

  socket.on('message:add', async (messageS) => {

    console.log(messageS)

    await User.findOne({token: socket.handshake.query.token}, (err, res) => {
      let user = res

      const message = {
        ...messageS,
        userId: user._id,
        userName: user.userName + ' ' + user.userSurname
      }
      Message.create(message).catch(onError)
  
      message.createdAt = Date.now()
  
      messages[roomId].push(message)
  
      updateMessageList()

    }).clone().catch(function(err){ console.log(err)})
    
    
  })

  socket.on('message:remove', (message) => {
    const { messageId, messageType, textOrPathToFile } = message

    Message.deleteOne({ messageId })
      .then(() => {
        if (messageType !== 'text') {
          removeFile(textOrPathToFile)
        }
      })
      .catch(onError)

    messages[roomId] = messages[roomId].filter((m) => m.messageId !== messageId)

    updateMessageList()
  })
}
