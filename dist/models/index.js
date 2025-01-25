"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = exports.initializeDatabase = exports.Database = void 0;
const sequelize_1 = require("sequelize");
const product_1 = require("./product");
const users_1 = require("./users");
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
// Create a singleton instance
class Database {
    constructor() {
        this._db = {
            sequelize: null,
            Sequelize: sequelize_1.Sequelize,
            Product: null,
            User: null
        };
        this.initialized = false;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    get db() {
        if (!this.initialized) {
            throw new Error('Database not initialized. Call initializeDatabase() first.');
        }
        return this._db;
    }
    // Initialize database
    async initialize() {
        if (this.initialized) {
            return this._db;
        }
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
            // Initialize models
            const Product = (0, product_1.initProduct)(sequelize);
            const User = (0, users_1.initUser)(sequelize);
            // Update the db object with initialized values
            this._db = {
                sequelize,
                Sequelize: sequelize_1.Sequelize,
                Product,
                User
            };
            this.initialized = true;
            console.log('Models initialized:', Object.keys(this._db).join(', '));
            return this._db;
        }
        catch (error) {
            console.error('Unable to initialize database:', error);
            throw error;
        }
    }
}
exports.Database = Database;
// Export the initialization function
const initializeDatabase = async () => {
    const database = Database.getInstance();
    return database.initialize();
};
exports.initializeDatabase = initializeDatabase;
// Export a function to get the database instance
const getDatabase = () => {
    const database = Database.getInstance();
    return database.db;
};
exports.getDatabase = getDatabase;
