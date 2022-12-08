import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {jwtSecret} from '../config.js'

export const createUser = async (req, res) => {

    const password = req.body.userPassword
    const rounds = 10

    const newUser = req.body

    await bcrypt.hash(password, rounds, async (err, hash) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(hash)
    newUser.userPassword = hash

    await User.create(newUser, (err) => {
        if (err) {
          
            return res.send('Регистрация прошла неуспешно')
        }

        return res.send('Пользователь был создан успешно')
    })

    })

    
}
export const signIn = async (req,res)=>{
    const {userLogin, userPassword} = req.body;
    await User.findOne({userLogin})
      .exec()
      .then(async (user) => {
        if (!user){
            res.status(404).json({message: 'Пользователь не найден'})
            return
        }
        const isValid = bcrypt.compareSync (userPassword, user.userPassword)
        
        if (isValid){
            const token = jwt.sign(user._id.toString(), jwtSecret)
            user.token = token
            await user.save()
            res.json({token, userId: user._id})
        } else{
            res.status(401).json({message: 'Пароли не совпадают, попробуйте снова'})
        }
    })
    .catch(err => res.status(500).json({message: err.message}))
}

export const getUser = async (req, res) => {
    console.log(req.body)
}
