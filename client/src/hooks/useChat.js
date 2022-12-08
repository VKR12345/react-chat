import { SERVER_URI, USER_KEY } from 'constants'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import storage from 'utils/storage'

export default function useChat() {
  const token = storage.get('authToken')
  const user = storage.get(USER_KEY)
  console.log(user)
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [log, setLog] = useState(null)
  const { current: socket } = useRef(
    io(SERVER_URI, {
      query: {
        token: storage.get('authToken'),
        roomId: user.roomId,
        userName: user.userName
      }
    })
  )

  useEffect(() => {
    socket.emit('user:add', token)

    socket.emit('message:get')

    socket.on('log', (log) => {
      setLog(log)
    })

    socket.on('user_list:update', (users) => {
      setUsers(users)
    })

    socket.on('message_list:update', (messages) => {
      setMessages(messages)
    })
  }, [])

  const sendMessage = (message) => {
    console.log(message)
    console.log('Sending message...')
    socket.emit('message:add', message)
  }

  const removeMessage = (message) => {
    socket.emit('message:remove', message)
  }

  return { users, messages, log, sendMessage, removeMessage }
}
