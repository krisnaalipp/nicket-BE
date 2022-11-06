'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const match = require('../data/match.json');
    match.forEach(el => {
      el.startDate = new Date(el.startDate)
      el.createdAt = new Date()
      el.updatedAt = new Date()
      if(!el.result){
        el.result = 'Not Started'
      }
    })
    await queryInterface.bulkInsert('Matches',match,{})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Matches',null,{})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
