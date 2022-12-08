import mongoose from 'mongoose'

const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true
    },
    userSurname: {
      type: String,
      required: true
    },
    userOtch: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true,
      unique: true
    },
    
    userTel: {
      type: String,
      required: true
    },
    userOtdel: {
      type: String,
      required: true,
    },
    userLogin:{
      type: String,
      required: true
    },
    userPassword:{
      type: String,
      required: true
    },
    token:{
      type: String
    },
  },
  {
    timestamps: true
  }
)

export default model('User', userSchema)