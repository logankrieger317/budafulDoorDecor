import { Sequelize } from 'sequelize';
import { DB } from '../src/types/models';
import { initProduct } from './product';
import { initUser } from './users';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
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
