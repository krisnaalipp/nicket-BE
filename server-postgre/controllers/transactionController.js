const { Transaction, Seat } = require("../models");

class Controller {
  static async readAllTransaction(req, res, next) {
    try {
      const transaction = await Transaction.findAll();
      console.log(transaction);
      res.status(200).json(transaction);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async transactionById(req, res, next) {
    try {
      const { transactionId } = req.params;
      const transaction = await Transaction.findByPk(transactionId);
      if (!transaction) {
        throw { name: "Transactiom Not Found" };
      }
      console.log(transaction);
      res.status(200).json(match);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async createTransaction(req, res, next) {
    try {
      const {
        ktp,
        email,
        categorySeat,
        isPaid,
        MatchId,
        paymentUrl,
        ticketPrice,
        amount,
        seat,
      } = req.body;
      let data = await Transaction.create({
        ktp,
        email,
        categorySeat,
        isPaid,
        MatchId,
        paymentUrl,
        ticketPrice,
        amount,
      });

      seat.forEach((e) => {
        let TransactionId = data.dataValues.id;
        Seat.create({
          seatNumber: `${e.row}-${e.col}`,
          TransactionId,
        });
      });
      res.status(201).json({ message: "succes" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateTransaction(req, res, next) {
    try {
      const { transactionId } = req.params;
      const { result } = req.body;
      const oneTransaction = await Transaction.findByPk(transactionId);
      if (!oneTransaction) {
        throw { name: "Transaction Not Found" };
      }
      await Transaction.update(
        { result },
        {
          where: {
            id: transactionId,
          },
        }
      );
      res.status(200).json({ message: "Succes update Transaction" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
