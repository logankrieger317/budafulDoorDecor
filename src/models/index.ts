import { Sequelize } from 'sequelize';
import { DB } from '../types/models';
import { initProduct } from './product';
import { initUser } from './users';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

// Create a singleton instance
export class Database {
  private static instance: Database;
  private _db: DB = {
    sequelize: null as any,
    Sequelize,
    Product: null as any,
    User: null as any
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
        console.log('Using DATABASE_URL for connection');
        sequelize = new Sequelize(process.env.DATABASE_URL, {
          dialect: 'postgres',
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          },
          logging: console.log, // Enable logging for debugging
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
        });
      } else if (config.use_env_variable && process.env[config.use_env_variable]) {
        console.log(`Using ${config.use_env_variable} for connection`);
        sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
      } else {
        console.log('Using local config for connection');
        sequelize = new Sequelize(config.database, config.username, config.password, {
          ...config,
          dialect: 'postgres'
        });
      }

      // Test the connection
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');

      // Initialize models
      const Product = initProduct(sequelize);
      const User = initUser(sequelize);

      // Update the db object with initialized values
      this._db = {
        sequelize,
        Sequelize,
        Product,
        User
      };

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
