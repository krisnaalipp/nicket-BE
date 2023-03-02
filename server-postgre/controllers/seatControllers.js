const {Seat} = require('../models');

class Controller{
    static async readAllSeat (req,res,next){
        try {
            let data = await Seat.findAll()
            data = data.map( e => e.dataValues)
            let result = data.map( e => {
                e.seatNumber = e.seatNumber.split('-')
                return {
                    id : e.id,
                    row : e.seatNumber[0],
                    col : e.seatNumber[1],
                    TransactionId:e.TransactionId
                }
            })
            res.status(200).json(result)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = Controller