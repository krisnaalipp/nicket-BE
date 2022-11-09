const {Match,Transaction} = require('../models');

class Controller {
  static async allMatch(req,res,next){
    try {
      const matches = await Match.findAll({
        include : Transaction,
        order :[['startDate','ASC']],
        
      })
      res.status(200).json(matches)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  static async oneMatch(req,res,next){
    try {
      const matches = await Match.findAll({
        where : {
          result : 'Not Started'
        },
        include : Transaction,
        order :[['startDate','ASC']],
        limit : 1, 
        
      })
      res.status(200).json(matches[0])
    } catch (error) {
      next(error)
    }
  }
  static async matchById (req,res,next){
    try {
      const {matchId} = req.params
      const match = await Match.findByPk(matchId)
      if (!match) {
        throw {name : 'Match Not Found'}
      }
      res.status(200).json(match)
    } catch (error) {
      next(error)
    }
  }
  static async createNewMatch(req,res,next){
    try {
      const {opponent,opponentLogo,startDate} = req.body
      await Match.create({opponent,startDate,opponentLogo})
      res.status(201).json({message : 'succes'})
    } catch (error) {
      next(error)
    }
  }
  static async updateMatch (req,res,next){
    try {
      const {matchId} = req.params
      const {result} = req.body
      const availMatch = await Match.findByPk(matchId)
      if(!availMatch){
        throw {name : 'Match Not Found'}
      }
      await Match.update({result},{
        where : {
          id : matchId
        }
      })
      res.status(200).json({message : 'Succes update result'})
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Controller