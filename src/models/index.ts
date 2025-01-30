import { Sequelize } from 'sequelize';
import { DB } from '../types/models';
import { initProduct } from './product';
import { initOrder } from './order.model';

const env = process.env.NODE_ENV || 'development';

// Create a singleton instance
export class Database {
  private static instance: Database;
  private _db: DB = {
    sequelize: null as any,
    Sequelize,
    Product: null as any,
    Order: null as any
  };
  private initialized = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  get db(): DB {
    if (!this.initialized) {
      throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return this._db;
  }

  // Initialize database
  async initialize(): Promise<DB> {
    if (this.initialized) {
      return this._db;
    }

    try {
      let sequelize: Sequelize;
      
      if (process.env.DATABASE_URL) {
        console.log('Initializing database connection using Railway configuration');
        sequelize = new Sequelize(process.env.DATABASE_URL, {
          dialect: 'postgres',
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          },
          logging: console.log // Keep logging enabled for debugging
        });
      } else {
        throw new Error('DATABASE_URL environment variable is not set');
      }

      // Test the connection
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');

      // Initialize models
      console.log('[DEBUG] Initializing models...');
      const Product = initProduct(sequelize);
      const Order = initOrder(sequelize);

      // Update the db object with initialized values
      this._db = {
        sequelize,
        Sequelize,
        Product,
        Order
      };

      console.log('[DEBUG] Models initialized successfully');
      console.log('[DEBUG] Available models:', Object.keys(this._db).join(', '));

      // Force sync in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[DEBUG] Development environment detected, running alter sync');
        await sequelize.sync({ alter: true });
      } else {
        console.log('[DEBUG] Production environment detected, running normal sync');
        await sequelize.sync();
      }

      this.initialized = true;
      console.log('Models initialized:', Object.keys(this._db).join(', '));
      return this._db;
    } catch (error) {
      console.error('Unable to initialize database:', error);
      throw error;
    }
  }
}

// Export the initialization function
export const initializeDatabase = async (): Promise<DB> => {
  const database = Database.getInstance();
  return database.initialize();
};

// Export a function to get the database instance
export const getDatabase = (): DB => {
  const database = Database.getInstance();
  return database.db;
};
