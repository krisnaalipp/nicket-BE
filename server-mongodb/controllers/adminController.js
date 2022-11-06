const {hashPassword,comparePassword} = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const Admin = require('../models/admin');


class Controller {
  static async readAllUser(req,res){
    try {
      let result = await Admin.find()
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
  static async addNewUser (req,res){
    try {
      const {username,email,password} = req.body
      const userInput = {username,email,password}
      await Admin.create(userInput)
      res.status(201).json({message : 'Success create a new Admin'})
    } catch (error) {
      if(error.name === 'ValidationError'){
        const errors = Object.values(error.errors).map((el) => el.message);
        res.status(400).json({message : `${errors}`})
      }else {
        res.status(500).json(error.message)
      }
    }
  }
  static async getUserById(req,res){
    try {
      const {adminId} = req.params
      const user = await Admin.findById(adminId)
      if(!user){
        return res.status(404).json({message : 'Admin Not Found'})
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
  static async deleteUser (req,res) {
    try {
      const {adminId} = req.params
      const user = await Admin.findById(adminId)
      const deletedUser = await Admin.findByIdAndRemove(adminId,{
        returnOriginal : true
      })
      res.status(200).json(deletedUser)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
  static async login (req,res) {
    try {
      const {email,password} = req.body
      
      if(!email || !password){
        return res.status(400).json({message : 'Invalid input'})
      }
      const userLogin = await Admin.findOne({email})
      if(!userLogin){
        return res.status(401).json({message : 'Wrong email/ password'})
      }
      const isValid = comparePassword(userLogin.password,password)
      if(!isValid){
        return res.status(401).json({message : 'Wrong email/ password'})
      }
      const payload = {
        email : userLogin.email
      }
      const access_token = signToken(payload)
      res.status(200).json({access_token})
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
}

module.exports = Controller