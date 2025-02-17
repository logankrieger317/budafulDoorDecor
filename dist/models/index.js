"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = exports.initializeDatabase = exports.Database = void 0;
const sequelize_1 = require("sequelize");
const product_1 = require("./product");
const order_model_1 = require("./order.model");
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
// Create a singleton instance
class Database {
    constructor() {
        this._db = {
            sequelize: null,
            Sequelize: sequelize_1.Sequelize,
            Product: null,
            Order: null
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
                    logging: false, // Disable logging for production
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
            console.log('[DEBUG] Initializing models...');
            const Product = (0, product_1.initProduct)(sequelize);
            const Order = (0, order_model_1.initOrder)(sequelize);
            // Update the db object with initialized values
            this._db = {
                sequelize,
                Sequelize: sequelize_1.Sequelize,
                Product,
                Order
            };
            console.log('[DEBUG] Models initialized successfully');
            console.log('[DEBUG] Available models:', Object.keys(this._db).join(', '));
            // Force sync in development
            if (process.env.NODE_ENV === 'development') {
                console.log('[DEBUG] Development environment detected, running alter sync');
                await sequelize.sync({ alter: true });
            }
            else {
                console.log('[DEBUG] Production environment detected, running normal sync');
                await sequelize.sync();
            }
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
