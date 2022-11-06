'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      opponent: {
        type: Sequelize.STRING
      },
      opponentLogo: {
        type: Sequelize.STRING
      },
      startDate: {
        type: Sequelize.DATE
      },
      availableSeats: {
        type: Sequelize.INTEGER,
        defaultValue : 500
      },
      result: {
        type: Sequelize.STRING,
        defaultValue : 'Not Started'
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
    await queryInterface.dropTable('Matches');
  }
};