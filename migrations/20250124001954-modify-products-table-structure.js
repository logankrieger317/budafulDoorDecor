'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, remove all existing records
    await queryInterface.bulkDelete('Products', null, {});

    // Drop the existing id column and add SKU
    await queryInterface.removeColumn('Products', 'id');
    await queryInterface.addColumn('Products', 'sku', {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    });

    // Add width and length columns
    await queryInterface.addColumn('Products', 'width', {
      type: Sequelize.DECIMAL(4, 2),
      allowNull: false
    });

    await queryInterface.addColumn('Products', 'length', {
      type: Sequelize.DECIMAL(4, 1),
      allowNull: false
    });

    // Add isWired column
    await queryInterface.addColumn('Products', 'isWired', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    // Remove unnecessary columns
    await queryInterface.removeColumn('Products', 'inStock');
  },

  async down(queryInterface, Sequelize) {
    // Add back the original id column
    await queryInterface.addColumn('Products', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    });

    // Add back inStock
    await queryInterface.addColumn('Products', 'inStock', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });

    // Remove new columns
    await queryInterface.removeColumn('Products', 'sku');
    await queryInterface.removeColumn('Products', 'width');
    await queryInterface.removeColumn('Products', 'length');
    await queryInterface.removeColumn('Products', 'isWired');
  }
};
