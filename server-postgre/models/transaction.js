'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Match)
    }
  }
  Transaction.init({
    ktp: DataTypes.STRING,
    email: DataTypes.STRING,
    categorySeat: DataTypes.STRING,
    isPaid: DataTypes.BOOLEAN,
    MatchId: DataTypes.INTEGER,
    paymentUrl: DataTypes.STRING,
    ticketPrice: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};