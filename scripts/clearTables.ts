import { getDatabase, initializeDatabase } from '../src/models';

async function clearTables() {
  try {
    console.log('Initializing database connection...');
    await initializeDatabase();
    const db = getDatabase();
    
    // Using transaction to ensure both operations succeed or fail together
    await db.sequelize.transaction(async (transaction) => {
      console.log('Clearing Orders table...');
      await db.Order.destroy({
        where: {},
        force: true,
        transaction
      });

      console.log('Clearing Products table...');
      await db.Product.destroy({
        where: {},
        force: true,
        transaction
      });
    });

    console.log('Successfully cleared all data from Orders and Products tables');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing tables:', error);
    process.exit(1);
  }
}

clearTables();
