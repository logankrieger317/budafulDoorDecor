'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Products', {
      fields: ['sku'],
      type: 'unique',
      name: 'products_sku_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Products', 'products_sku_unique');
  }
};
