import { AiOutlineUser } from 'react-icons/ai'

export default function UserList({ users }) {
  return (
    <div className='container user'>
      <h2>Пользователи</h2>
      <ul className='list user'>
        {users.map(({ userId, userLogin }) => (
          <li key={userId} className='item user'>
            <AiOutlineUser className='icon user' />
            {userLogin}
          </li>
        ))}
      </ul>
    </div>
  )
}
