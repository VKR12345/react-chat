import { USER_KEY } from 'constants'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import storage from 'utils/storage'
const commonPasswords = require('utils/10m most common.json')






//52 пароля
//Конечный код, который генерирует пароль и проверяет его на наличие как минимум одного числа, одной заглавной и строчной букв, 
//одного специального символа, а также на популярность, может выглядеть следующим образом:
//Мы добавили массив popularPasswords, который содержит наиболее распространенные и легко подбираемые пароли, и использовали его в цикле генерации пароля, 
//чтобы избежать создания очень простых и неэффективных паролей. Если сгенерированный пароль совпадает с одним из элементов массива popularPasswords, 
//то цикл генерации продолжается, пока не будет создан уникальный пароль.

// function generation() {
//   const length = 20;
//   const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+`}{[];?><,./-=';
//   let password = ''
// while (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]|[_]).{8,}$/.test(password) && commonPasswords.includes(password)) {
//     password = ''
//     for (let i = 0; i < length; i++) {
//         password += charset.charAt(Math.floor(Math.random() * charset.length));
//     }
// }

// return password;
// }

function generation() {
  const length = 20;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+`|}{[]\:;?><,./-=';
  let password = '';

  while (true) {
    password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random()*characters.length);
      const randomChar = characters.charAt(randomIndex);
      password += randomChar;
    }

    if (!commonPasswords.includes(password) &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*()_+~`|}{[\]:;?><,.\/-=]/.test(password)) {
      break;
    }
  }

  return password;
}




const initialForm = {
    userName: '',
    userSurname: '',
    userOtch: '',
    userEmail: '',
    userTel: '',
    userOtdel: '', 
    roomId: 'main_room'
}

const initialCredentials = {
    userLogin: '',
    userPassword: '',
}

export const NameInput = () => {
  const [formData, setFormData] = useState({
    ...initialForm
  })
  const [credentials, setCredentials] = useState({
    ...initialCredentials
  })
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [isLogin, setLogin] = useState(true)

  useEffect(() => {
    // const isSomeFieldEmpty = Object.values(formData.userLogin).some((f) => !f.trim())
    // setSubmitDisabled(isSomeFieldEmpty)
    const isSomeFieldEmpty = Object.values(formData).some((v) => !v.trim())
    setSubmitDisabled(isSomeFieldEmpty)
  }, [formData])

  const onChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value })
  }

  const onChangeLogin = ({ target: { name, value } }) => {
    setCredentials({ ...credentials, [name]: value })
  }


  function translitRuEn (str) {
    var arrayLits = [["а","a"],["б","b"],["в","v"],["г","g"],["д","d"],["е","e"],
    ["ё","yo"],["ж","zh"],["з","z"],["и","i"],["й","j"],["к","k"],["л","l"],
    ["м","m"],["н","n"],["о","o"],["п","p"],["р","r"],["с","s"],["т","t"],
    ["у","u"],["ф","f"],["х","h"],["ц","c"],["ч","ch"],["ш","sh"],["щ","shh"],
    ["ъ","tvz"],["ы","y"],["ь","mjz"],["э","je"],["ю","yu"],["я","ya"],["А","A"],
    ["Б","B"],["В","V"],["Г","G"],["Д","D"],["Е","E"],["Ё","YO"],["Ж","YO"],
    ["З","Z"],["И","I"],["Й","J"],["К","K"],["Л","L"],["М","M"],["Н","N"],
    ["О","O"],["П","P"],["Р","R"],["С","S"],["Т","T"],["У","U"],["Ф","F"],
    ["Х","H"],["Ц","C"],["Ч","CH"],["Ш","SH"],["Щ","SHH"],["Ъ","TVZ"],["Ы","Y"],  
    ["Ь","MZJ"],["Э","JE"],["Ю","YU"],["Я","YA"] ];

    function getEnLit(lit){
        var s = arrayLits.find(i=>i[0]===lit)
        return s != undefined ? s[1] : " "
      }
    return [...str].map(getEnLit).join("")
  }
  function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  function big(str){
    return str[0].toUpperCase() + str.substring(1)
  }
  const onSubmit = async(e) => {
    e.preventDefault()

    const userId = nanoid()

    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({userLogin: credentials.userLogin, userPassword: credentials.userPassword})
    }).then((response) => response.json())
    .then(async (data) => {
      console.log(data)
      if (data.token) {
        await storage.set('authToken', data.token)

        await storage.set(USER_KEY, {
          userId: data.userId,
          roomId: formData.roomId,
          userName: data.userName,
          userSurname: data.userSurname,
          userLogin: data.userLogin
        })
        window.location.reload()
      } else {
        alert('неверные данные')
      }
      
    });

    
  }
  
  

  const generate = async (e) => {
    
    e.preventDefault()
    const login = 'O'+ translitRuEn(big(formData.userOtdel[0]))+'_'+
    translitRuEn(big(formData.userSurname))+translitRuEn(big(formData.userName[0]))
    const password = generation()
    
    
    
    alert('Вы зарегестрировались')
    download('Ваши_данные',`Фамилия: ${formData.userName} \nИмя:${formData.userSurname} \nОтчество:${formData.userOtch} \nЭлектронная почта:${formData.userEmail} \nНомер телефона:${formData.userTel} \nОтдел:${formData.userOtdel} \nЛогин:${login} \nПароль:${password}`)
    
    setFormData({...formData, userLogin: login, userPassword: password})
    console.log(formData)

    await fetch('http://localhost:4000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({...formData, userLogin: login, userPassword: password})
    })
  }

  return (
    
    <div className='container name-input'>
      <h2>Локальный чат</h2>
      { !isLogin &&
        <form >
        <div>
          <label htmlFor='userSurname'>Фамилия</label>
          <input
            type='text'
            id='userSurname'
            name='userSurname'
            minLength={2}
            required
            value={formData.userSurname}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor='userName'>Имя</label>
          <input
            type='text'
            id='userName'
            name='userName'
            minLength={2}
            required
            value={formData.userName}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor='userOtch'>Отчество</label>
          <input
            type='text'
            id='userOtch'
            name='userOtch'
            minLength={2}
            required
            value={formData.userOtch}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor='userEmail'>Электронная почта</label>
          <input
            type='text'
            id='userEmail'
            name='userEmail'
            minLength={2}
            required
            value={formData.userEmail}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor='userTel'>Рабочий номер телефона</label>
          <input
            type='text'
            id='userTel'
            name='userTel'
            minLength={2}
            required
            value={formData.userTel}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor='userOtdel'>Отдел</label>
          <input
            type='text'
            id='userOtdel'
            name='userOtdel'
            minLength={2}
            required
            value={formData.userOtdel}
            onChange={onChange}
          />
        </div>
        <div className='visually-hidden'>
          <label htmlFor='roomId'>Enter room ID</label>
          <input
            type='text'
            id='roomId'
            name='roomId'
            minLength={4}
            required
            value={formData.roomId}
            onChange={onChange}
          />
        </div>
        <button 
        onClick={generate}
        
        >
        Зарегестрироваться
        </button>
        <button 
        className='btn chat'> 
        <a onClick={() => setLogin(true)}>Авторизация</a>
        </button>
      </form>
      }
      { isLogin && 
      <form onSubmit={onSubmit}>
        <div>
          <label>Логин</label>
          <input
          type='text'
          id='userLogin'
          name='userLogin'
          value={credentials.userLogin}
          onChange={onChangeLogin}
          minLength={2}
          required
          />
          </div>
          <div>
            <label>Пароль</label>
            <input
            type='password'
            id='userPassword'
            name='userPassword'
            value={credentials.userPassword}
            onChange={onChangeLogin}
            minLength={2}
            required
            />
            </div>
            <button
            >
              Чат
              </button>
              <button 
              className='btn chat'>
                <a onClick={() => setLogin(false)}>Зарегестрироваться</a>
                </button>
                </form>}
                </div>
                

              
                )
      }
