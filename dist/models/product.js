"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
exports.initProduct = initProduct;
const sequelize_1 = require("sequelize");
class Product extends sequelize_1.Model {
}
exports.Product = Product;
function initProduct(sequelize) {
    Product.init({
        sku: {
            type: sequelize_1.DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        imageUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        category: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        width: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        length: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        isWired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        quantity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        paranoid: true,
        timestamps: true,
    });
    return Product;
}
