"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = void 0;
const sequelize_1 = require("sequelize");
const product_1 = require("./product");
const users_1 = require("./users");
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
// Initialize database and export functions
const initializeDatabase = async () => {
    try {
        let sequelize;
        if (process.env.DATABASE_URL) {
            console.log('Using DATABASE_URL for connection');
            sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, {
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
        }
        else if (config.use_env_variable && process.env[config.use_env_variable]) {
            console.log(`Using ${config.use_env_variable} for connection`);
            sequelize = new sequelize_1.Sequelize(process.env[config.use_env_variable], config);
        }
        else {
            console.log('Using local config for connection');
            sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, {
                ...config,
                dialect: 'postgres'
            });
        }
        // Test the connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        const Product = (0, product_1.initProduct)(sequelize);
        const User = (0, users_1.initUser)(sequelize);
        return {
            sequelize,
            Sequelize: sequelize_1.Sequelize,
            Product,
            User,
        };
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
// Create a default export that will be initialized when the database connects
const defaultDb = {
    sequelize: null, // Will be initialized later
    Sequelize: // Will be initialized later
    sequelize_1.Sequelize,
    Product: null, // Will be initialized later
    User: null, // Will be initialized later
};
exports.default = defaultDb;
