const midtransClient = require('midtrans-client');
const {Transaction, sequelize,Seat} = require('../models');

class Controller {
  static async postTransaction(req, res, next) {
    const t = await sequelize.transaction()
    try {
      const { ktp, email, categorySeat, price , seats,MatchId } = req.body

      // let order_id = `${email}-${categorySeat}-${price}`
      // let snap = new midtransClient.Snap({
      //   isProduction: false,
      //   serverKey: 'SB-Mid-server-Q-5hHH0OgKqNO5y8JB5HPh6j',
      // });
      // let parameter = {
      //   transaction_details: {
      //     order_id: order_id,
      //     gross_amount: price
      //   },
      //   customer_details: {
      //     email: email
      //   },
      //   enabled_payments: ["credit_card","bca_klikbca", "bca_klikpay", "permata_va",
      //     "bca_va","gopay"],
      // }
      // const transaction = await snap.createTransaction(parameter)
      // let {payment_url,token} = transaction
      const newTransaction = await Transaction.create({ktp, email, categorySeat, price},{transaction : t})
      const seatsInput = seats.map(el=> {
        return {seatNumber : el.seatNumber ,TransactionId : newTransaction.id}
      })
      await Seat.bulkCreate(seatsInput,{transaction:t})
      await t.commit()
      res.status(200).json({ transaction })
    } catch (error) {
      await t.rollback()
      next(error)
    }
  }
  static async paymentHandler(req,res,next){
    try {
      
    } catch (error) {
      
    }
  }
}


module.exports = Controller