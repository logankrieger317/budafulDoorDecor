'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Products', [
      {
        sku: 'RIB-SLW-25',
        name: 'Silver Lattice Wired Ribbon',
        description: 'Silver lattice wired ribbon, perfect for decorative purposes',
        price: 10.00,
        category: 'Ribbon',
        width: 2.50,
        length: 10.0,
        isWired: true,
        quantity: 100,
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-GLW-25',
        name: 'Gold Lattice Wired Ribbon',
        description: 'Gold lattice wired ribbon, perfect for decorative purposes',
        price: 10.00,
        category: 'Ribbon',
        width: 2.50,
        length: 10.0,
        isWired: true,
        quantity: 100,
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-BPE-15',
        name: 'Baby Pink Embossed Wired Ribbon',
        description: 'Baby pink embossed wired ribbon with elegant pattern',
        price: 9.00,
        category: 'Ribbon',
        width: 1.50,
        length: 10.0,
        isWired: true,
        quantity: 100,
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-BVN-87',
        name: 'Black Velvet Non-Wired Ribbon',
        description: 'Luxurious black velvet non-wired ribbon',
        price: 11.00,
        category: 'Ribbon',
        width: 0.875,
        length: 25.0,
        isWired: false,
        quantity: 100,
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-WVN-87',
        name: 'White Velvet Non-Wired Ribbon',
        description: 'Elegant white velvet non-wired ribbon',
        price: 11.00,
        category: 'Ribbon',
        width: 0.875,
        length: 25.0,
        isWired: false,
        quantity: 100,
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-SWL-25',
        name: 'Baby Pink/White/Fuschia Swirls Ribbon',
        description: 'Decorative ribbon with swirl pattern in baby pink, white, and fuschia',
        price: 11.00,
        category: 'Ribbon',
        width: 2.50,
        length: 10.0,
        isWired: true,
        quantity: 100,
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-RED-15',
        name: 'Red Embossed Wired Ribbon',
        description: 'Red embossed wired ribbon with elegant pattern',
        price: 9.00,
        category: 'Ribbon',
        width: 1.50,
        length: 10.0,
        isWired: true,
        quantity: 100,
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-GWS-25',
        name: 'Gold/White Stripe/Polka Dot Wired Ribbon',
        description: 'Decorative wired ribbon with gold and white stripes and polka dots',
        price: 11.00,
        category: 'Ribbon',
        width: 2.50,
        length: 10.0,
        isWired: true,
        quantity: 100,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
