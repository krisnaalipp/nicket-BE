const mongoose = require('mongoose');
const validator = require('validator');
const { hashPassword } = require('../helpers/bcrypt');

const adminSchema = mongoose.Schema({
  username : {
    type: String,
    required : [true,'username is required'],
  },
  email : {
    type: String,
    required : [true,'email is required'],
    unique : true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error('Invalid Email')
      }
    }
  },
  password : {
    type: String,
    required : [true,'password is required']
  }
})

adminSchema.pre('save',async function (next){
  const admin = this
  admin.password = hashPassword(admin.password)
  next()
})

const Admin = mongoose.model('Admin',adminSchema)

module.exports = Admin
