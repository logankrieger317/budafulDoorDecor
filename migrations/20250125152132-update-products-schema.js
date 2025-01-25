'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Add new columns
      await queryInterface.addColumn('Products', 'color', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Unknown' // temporary default for existing records
      }, { transaction });

      await queryInterface.addColumn('Products', 'brand', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Unknown' // temporary default for existing records
      }, { transaction });

      // Modify existing columns
      await queryInterface.changeColumn('Products', 'width', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      await queryInterface.changeColumn('Products', 'length', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      await queryInterface.changeColumn('Products', 'imageUrl', {
        type: Sequelize.STRING,
        allowNull: true
      }, { transaction });

      // Remove category column
      await queryInterface.removeColumn('Products', 'category', { transaction });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Revert column removals
      await queryInterface.addColumn('Products', 'category', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Uncategorized'
      }, { transaction });

      // Remove added columns
      await queryInterface.removeColumn('Products', 'color', { transaction });
      await queryInterface.removeColumn('Products', 'brand', { transaction });

      // Revert modified columns
      await queryInterface.changeColumn('Products', 'width', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      }, { transaction });

      await queryInterface.changeColumn('Products', 'length', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      }, { transaction });

      await queryInterface.changeColumn('Products', 'imageUrl', {
        type: Sequelize.STRING,
        allowNull: false
      }, { transaction });
    });
  }
};
