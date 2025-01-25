'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'brand', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // In the down migration, we'll make it NOT NULL again but set a default value
    // to handle any null values that might exist
    await queryInterface.changeColumn('Products', 'brand', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Unknown' // This will replace any NULL values when reverting
    });
  }
};
