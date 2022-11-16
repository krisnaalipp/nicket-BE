'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Match.hasMany(models.Transaction)
    }
  }
  Match.init({
    opponent: {
      type : DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: {
          msg: 'opponent is required'
        },
        notEmpty: {
          msg: 'opponent is required'
        }
      }
    },
    opponentLogo: {
      type : DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: {
          msg: 'opponentLogo is required'
        },
        notEmpty: {
          msg: 'opponentLogo is required'
        }
      }
    },
    startDate: {
      type : DataTypes.DATE,
      allowNull:false,
      validate: {
        notNull: {
          msg: 'startDate is required'
        },
        notEmpty: {
          msg: 'startDate is required'
        }
      }
    },
    availableSeats: {
      type : DataTypes.INTEGER,
      defaultValue : 500
    },
    result: {
      type : DataTypes.STRING,
      defaultValue : 'Not Started'
    }
  }, {
    sequelize,
    modelName: 'Match',
  });
  Match.beforeCreate((data)=> {
    data.startDate = new Date(data.startDate)
  })
  return Match;
};