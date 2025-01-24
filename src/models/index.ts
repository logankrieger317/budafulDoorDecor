import { Sequelize } from 'sequelize';
import { DB } from '../types/models';
import { initProduct } from './product';
import { initUser } from './users';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

// Initialize database and export functions
export const initializeDatabase = async (): Promise<DB> => {
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

    const Product = initProduct(sequelize);
    const User = initUser(sequelize);

    return {
      sequelize,
      Sequelize,
      Product,
      User,
    } as DB;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Create a default export that will be initialized when the database connects
const defaultDb: DB = {
  sequelize: null as any, // Will be initialized later
  Sequelize,
  Product: null as any, // Will be initialized later
  User: null as any, // Will be initialized later
};

export default defaultDb;
