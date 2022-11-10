const midtransClient = require('midtrans-client');
const processPayment = require('../helpers/nodemailer');
const {Transaction, sequelize,Seat,Match} = require('../models');

class Controller {
  static async postTransaction(req, res, next) {
    const t = await sequelize.transaction()
    try {
      const { ktp, email, categorySeat, ticketPrice , seat,MatchId } = req.body
      const newTransaction = await Transaction.create({ktp, email, categorySeat, ticketPrice ,amount:seat.length,MatchId},{transaction : t})
      const seatsInput = seat.map(el=> {
        return {seatNumber : el.seatNumber ,TransactionId : newTransaction.id}
      })
      await Seat.bulkCreate(seatsInput,{transaction:t})
      await t.commit()
      res.status(201).json({ message : "succes buy please confirm your payment" , id:newTransaction.id })
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
  static async transactionByMatch(req,res,next){
    try {
      const {matchId} = req.params
      const transactions = await Transaction.findAll({
        where : {
          isPaid:true,
          MatchId : matchId
        },
        include : Seat
      })
      res.status(200).json(transactions)
    } catch (error) {
      next(error)
    }
  }
  static async transactionById (req,res,next){
    try {
      const {transactionId} = req.params
      const availTransaction = await Transaction.findByPk(transactionId,{
        include : [Seat,Match]
      })
      if(!availTransaction){
        throw {name : 'Transaction Not Found'}
      }
      res.status(200).json(availTransaction)
    } catch (error) {
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
      const randomOrder =  Math.floor(Math.random()*1000)
      let order_id = `${randomOrder}-${availTransaction.email}-${availTransaction.categorySeat}-${availTransaction.ticketPrice}`
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
      let pdfTransaction = await Transaction.findByPk(transactionId,{
        include : [Match]
      })
      pdfTransaction = pdfTransaction.dataValues
      let result = {
        id:pdfTransaction.id,
        email:pdfTransaction.email,
        categorySeat:pdfTransaction.categorySeat,
        isPaid:pdfTransaction.isPaid,
        ticketPrice:pdfTransaction.ticketPrice,
        amount:pdfTransaction.amount,
        updateAt:pdfTransaction.updatedAt,
        macth:pdfTransaction.Match.dataValues.opponent
      }
      const transaction = await snap.createTransaction(parameter)
      await Transaction.update({paymentUrl : transaction.redirect_url},{
        where : {
          id : transactionId
        }
      })
      await processPayment(transaction.redirect_url,availTransaction.email,result)
      res.status(201).json({ transactionToken: transaction.token })
    } catch (error) {
      console.log(error);
      next(error)
    }
  }

  static async paymentHandler(req,res,next){
    try {
      const {TransactionId} = req.body
      console.log(req.body)
      if(req.body.transaction_status =="capture" || req.body.transaction_status =="settlement" ){
        const updatePaid = await Transaction.update({isPaid : true},{
          where : {
            id : TransactionId
          },
          returning:true
        })
        await Match.decrement('availableSeats',{
          by: updatePaid[1][0].dataValues.amount,
          where : {
            id : updatePaid[1][0].dataValues.MatchId
          }
        })
        let pdfTransaction = await Transaction.findByPk(TransactionId,{
          include : [Match]
        })
        pdfTransaction = pdfTransaction.dataValues
        let result = {
          id:pdfTransaction.id,
          email:pdfTransaction.email,
          categorySeat:pdfTransaction.categorySeat,
          isPaid:pdfTransaction.isPaid,
          ticketPrice:pdfTransaction.ticketPrice,
          amount:pdfTransaction.amount,
          updateAt:pdfTransaction.updatedAt,
          macth:pdfTransaction.Match.dataValues.opponent
        }
        await processPayment(pdfTransaction.paymentUrl,pdfTransaction.email,result)
        res.status(200).json({message : 'OK'})
      }else {
        res.status(400).json({message:'Something Wrong'})
      }
    } catch (error) {
      next(error)
    }
  }
}


module.exports = Controller