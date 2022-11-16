'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ktp: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      categorySeat: {
        type: Sequelize.STRING
      },
      isPaid: {
        type: Sequelize.BOOLEAN
      },
      MatchId: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Matches',
          key : 'id'
        },
      },
      ticketPrice: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER
      },
      paymentUrl: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};