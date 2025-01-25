'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const products = [
      {
        sku: 'RIB-SLW-25',
        name: 'Silver Lattice Wired Ribbon',
        description: 'Silver lattice wired ribbon, perfect for decorative purposes',
        price: 10,
        width: 2.5,
        length: 10,
        isWired: true,
        quantity: 100,
        color: 'Silver',
        brand: 'Lattice',
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-GLW-25',
        name: 'Gold Lattice Wired Ribbon',
        description: 'Gold lattice wired ribbon, perfect for decorative purposes',
        price: 10,
        width: 2.5,
        length: 10,
        isWired: true,
        quantity: 100,
        color: 'Gold',
        brand: 'Lattice',
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-BPE-15',
        name: 'Baby Pink Embossed Wired Ribbon',
        description: 'Baby pink embossed wired ribbon with elegant pattern',
        price: 9,
        width: 1.5,
        length: 10,
        isWired: true,
        quantity: 100,
        color: 'Baby Pink',
        brand: 'Embossed',
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-BVN-87',
        name: 'Black Velvet Non-Wired Ribbon',
        description: 'Luxurious black velvet non-wired ribbon',
        price: 11,
        width: 0.875,
        length: 25,
        isWired: false,
        quantity: 100,
        color: 'Black',
        brand: 'Velvet',
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-WVN-87',
        name: 'White Velvet Non-Wired Ribbon',
        description: 'Elegant white velvet non-wired ribbon',
        price: 11,
        width: 0.875,
        length: 25,
        isWired: false,
        quantity: 100,
        color: 'White',
        brand: 'Velvet',
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-SWL-25',
        name: 'Baby Pink/White/Fuschia Swirls Ribbon',
        description: 'Decorative ribbon with swirl pattern in baby pink, white, and fuschia',
        price: 11,
        width: 2.5,
        length: 10,
        isWired: true,
        quantity: 100,
        color: 'Multi',
        brand: 'Swirls',
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-RED-15',
        name: 'Red Embossed Wired Ribbon',
        description: 'Red embossed wired ribbon with elegant pattern',
        price: 9,
        width: 1.5,
        length: 10,
        isWired: true,
        quantity: 100,
        color: 'Red',
        brand: 'Embossed',
        createdAt: now,
        updatedAt: now
      },
      {
        sku: 'RIB-GWS-25',
        name: 'Gold/White Stripe/Polka Dot Wired Ribbon',
        description: 'Decorative wired ribbon with gold and white stripes and polka dots',
        price: 11,
        width: 2.5,
        length: 10,
        isWired: true,
        quantity: 100,
        color: 'Multi',
        brand: 'Stripe',
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const product of products) {
      try {
        await queryInterface.sequelize.query(
          `INSERT INTO "Products" ("sku", "name", "description", "price", "width", "length", "isWired", "quantity", "color", "brand", "createdAt", "updatedAt")
           VALUES (:sku, :name, :description, :price, :width, :length, :isWired, :quantity, :color, :brand, :createdAt, :updatedAt)
           ON CONFLICT ("sku") DO UPDATE 
           SET "name" = EXCLUDED."name",
               "description" = EXCLUDED."description",
               "price" = EXCLUDED."price",
               "width" = EXCLUDED."width",
               "length" = EXCLUDED."length",
               "isWired" = EXCLUDED."isWired",
               "quantity" = EXCLUDED."quantity",
               "color" = EXCLUDED."color",
               "brand" = EXCLUDED."brand",
               "updatedAt" = EXCLUDED."updatedAt"`,
          {
            replacements: product,
            type: Sequelize.QueryTypes.INSERT
          }
        );
      } catch (error) {
        console.error(`Error inserting product ${product.sku}:`, error);
        throw error;
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
