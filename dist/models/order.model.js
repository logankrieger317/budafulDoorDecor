"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Order extends sequelize_1.Model {
}
Order.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    orderNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    customerFirstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerLastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    customerPhone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    shippingStreet: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    shippingCity: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    shippingState: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    shippingZipCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    orderItems: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
    },
    total: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
    },
}, {
    sequelize: database_1.db,
    tableName: 'orders',
    modelName: 'Order',
});
exports.default = Order;
