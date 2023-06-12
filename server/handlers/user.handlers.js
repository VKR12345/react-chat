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
    await User.findOne({userLogin: userLogin})
      .exec()
      .then(async (user) => {
        if (!user){
            res.status(404).json({message: 'Пользователь не найден'})
            return
        }
        const isValid = bcrypt.compareSync (userPassword, user.userPassword)
        if (isValid){

            const token = await jwt.sign({ _id: user._id.toString() }, 
            jwtSecret)
            user.token = token
            await user.save()
            const {userName, userSurname, userLogin} = user
            res.json({token, userId: user._id, userName, userSurname, userLogin})
        } else{
            res.status(401).json({message: 'Пароли не совпадают, попробуйте снова'})
        }
    })
    .catch(err => res.status(500).json({message: err.message}))
}

export const getUser = async (req, res) => {
    console.log(req.body)
}

export const changePassword = async (req, res) => {
    const {userPassword, token} = req.body
    console.log(token)
    await User.findOne({token: token})
      .then(async (user) => {
        if (!user){
            res.status(404).json({message: 'Пользователь не найден'})
            return
        }
        let isValid = false
        await jwt.verify(token, jwtSecret, async (err, decoded) => {
            if (err) {
                console.log(err)
            }
            isValid = (user._id.toString() === decoded._id)
        })
        if (isValid){
            await bcrypt.hash(userPassword, 10, async (err, hash) => {
                if (err) {
                    console.error(err)
                    return 0
                }
                user.userPassword = hash
                await user.save()
            })
                res.status(200).json({message: 'Пароль изменен'})
        } else{
            res.status(401).json({message: 'Пароли не совпадают, попробуйте снова'})
        }
    })
    .catch(err => res.status(500).json({message: err.message}))
}
