const hashPassword = require('../helpers/hashPassword');
const User = require('../models/user');


class Controller {
  static async readAllUser(req,res){
    try {
      let result = await User.findAll()
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  }
  static async addNewUser (req,res){
    try {
      const {username,email,password,phoneNumber,address,role} = req.body
      if(!username || !email || !password ){
        return res.status(404).json({message : 'Invalid input'})
      }
      const userInput = {username,email,password : hashPassword(password),phoneNumber,address,role}
      await User.create(userInput)
      res.status(201).json({message : 'Success create a new User'})
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  }
  static async getUserById(req,res){
    try {
      const {userId} = req.params
      const user = await User.findOne(id)
      if(!user){
        return res.status(404).json({message : 'User Not Found'})
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json(error)
    }
  }
  static async deleteUser (req,res) {
    try {
      const {userId} = req.params
      const user = await User.findOne(id)
      if(!user){
        return res.status(404).json({message : 'User Not Found'})
      }
      await User.destroy(id)
      res.status(200).json({message : 'Successfully delete User'})
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

module.exports = Controller