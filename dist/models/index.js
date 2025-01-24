"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const product_1 = require("./product");
const users_1 = require("./users");
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
let sequelize;
if (config.use_env_variable) {
    sequelize = new sequelize_1.Sequelize(process.env[config.use_env_variable], config);
}
else {
    sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, config);
}
const Product = (0, product_1.initProduct)(sequelize);
const User = (0, users_1.initUser)(sequelize);
const db = {
    sequelize,
    Sequelize: sequelize_1.Sequelize,
    Product,
    User,
};
exports.default = db;
