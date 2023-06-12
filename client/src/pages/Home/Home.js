import { NameInput, Room } from 'components'
import { USER_KEY } from 'constants'
import storage from 'utils/storage'
import {generation, download} from 'utils/credentials'

export const Home = () => {
  const user = storage.get(USER_KEY)
  const token = storage.get('authToken')
  const logOut = () => {
    window.localStorage.clear()
    window.location.reload();
  }

  const changePassword = async () => {
    const newPassword = generation()
    
    await fetch('http://localhost:4000/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({userLogin: user.userLogin, userPassword: newPassword, token})
    })
    download('Ваши_новые_данные',`Логин:${user.userLogin} \nПароль:${newPassword}`)
  }

  if (user) {
    return (
    <div>
      <div className='settings'>
        <span>{user.userSurname + ' ' +  user.userName}</span>
        <div className='settings__dropdown'>
          <ul className='settings__menu'>
            <li className='settings__item' onClick={changePassword}>Сменить пароль</li>
            <li className='settings__item' onClick={logOut}>Выйти</li>
          </ul>
        </div>
      </div>
      <Room /> 
    </div>
    
    )
  } else {
    return <NameInput />
  }
}
