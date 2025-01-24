'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS \'manager\'');
  },

  async down(queryInterface, Sequelize) {
    // Note: PostgreSQL does not support removing values from an enum type
    console.log('Skipping removal of manager role from enum as PostgreSQL does not support this');
  }
};
