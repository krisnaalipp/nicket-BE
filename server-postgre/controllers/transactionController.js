const midtransClient = require('midtrans-client');
const processPayment = require('../helpers/nodemailer');
const {Transaction, sequelize,Seat} = require('../models');

class Controller {
  static async postTransaction(req, res, next) {
    const t = await sequelize.transaction()
    try {
      const { ktp, email, categorySeat, ticketPrice , seat,MatchId } = req.body
      console.log(req.body)
      const newTransaction = await Transaction.create({ktp, email, categorySeat, ticketPrice ,amount:seat.length,MatchId},{transaction : t})
      const seatsInput = seat.map(el=> {
        return {seatNumber : el.seatNumber ,TransactionId : newTransaction.id}
      })
      await Seat.bulkCreate(seatsInput,{transaction:t})
      await t.commit()
      res.status(200).json({ message : "succes buy please confirm your payment" , id:newTransaction.id })
    } catch (error) {
      await t.rollback()
      next(error)
    }
  }
  static async allTransactions (req,res,next){
    try {
      const transactions = await Transaction.findAll({
        order : [['createdAt','ASC']],
        include : Seat
      })
      res.status(200).json(transactions)
    } catch (error) {
      next(error)
    }
  }
  static async transactionById (req,res,next){
    try {
      console.log
      const {transactionId} = req.params
      const availTransaction = await Transaction.findByPk(transactionId,{
        include : Seat
      })
      if(!availTransaction){
        throw {name : 'Transaction Not Found'}
      }
      res.status(200).json(availTransaction)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  static async postOrder (req,res,next){
    try {
      const {transactionId} = req.body
      const availTransaction = await Transaction.findByPk(transactionId)
      if(!availTransaction){
        throw {name : 'Transaction Not Found'}
      }
      let order_id = `${availTransaction.email}-${availTransaction.categorySeat}-${availTransaction.ticketPrice}`
      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: 'SB-Mid-server-Q-5hHH0OgKqNO5y8JB5HPh6j',
      });
      let parameter = {
        transaction_details: {
          order_id: order_id,
          gross_amount: availTransaction.ticketPrice * availTransaction.amount
        },
        customer_details: {
          email: availTransaction.email
        },
        enabled_payments: ["credit_card","bca_klikbca", "bca_klikpay", "permata_va",
          "bca_va","gopay"],
      }
      const transaction = await snap.createTransaction(parameter)
      await processPayment(transaction.redirect_url)
      res.status(200).json({ transactionToken: transaction.token })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  static async paymentHandler(req,res,next){
    try {
      const {TransactionId} = req.body
      if(req.body.transaction_status =="capture" || req.body.transaction_status =="settlement" ){
        const updatePaid = await Transaction.update({isPaid : true},{
          where : {
            id : TransactionId
          }
        })
      }
      res.status(200).json({message : 'OK'})
    } catch (error) {
      next(error)
    }
  }
}


module.exports = Controller