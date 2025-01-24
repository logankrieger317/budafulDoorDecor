'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        name: 'Logan Krieger',
        role: 'admin',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Shannon Williams',
        role: 'manager',
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      name: {
        [Sequelize.Op.in]: ['Logan Krieger', 'Shannon Williams']
      }
    });
  }
};
