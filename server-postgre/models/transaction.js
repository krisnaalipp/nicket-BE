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
      Transaction.hasMany(models.Seat)
    }
  }
  Transaction.init({
    ktp: {
      type :DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: {
          msg: 'KTP is required'
        },
        notEmpty: {
          msg: 'KTP is required'
        }
      }
    },
    email: {
      type :DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: {
          msg: 'Email is required'
        },
        notEmpty: {
          msg: 'Email is required'
        }
      }
    },
    categorySeat: DataTypes.STRING,
    isPaid: {
      type : DataTypes.BOOLEAN,
      defaultValue: false
    },
    MatchId: DataTypes.INTEGER,
    ticketPrice: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};