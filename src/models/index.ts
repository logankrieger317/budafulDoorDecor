import { Sequelize } from 'sequelize';
import { DB } from '../types/models';
import { initProduct } from './product';
import { initUser } from './users';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

let sequelize: Sequelize;
if (process.env.DATABASE_URL) {
  // Use DATABASE_URL if available (production)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else if (config.use_env_variable && process.env[config.use_env_variable]) {
  // Use other environment variable if specified
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  // Use local config
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    dialect: 'postgres'
  });
}

const Product = initProduct(sequelize);
const User = initUser(sequelize);

const db = {
  sequelize,
  Sequelize,
  Product,
  User,
} as DB;

export default db;
