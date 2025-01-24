"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../models"));
const errors_1 = require("../types/errors");
class ProductController {
    // Get all products
    async getAllProducts(req, res) {
        try {
            const products = await models_1.default.Product.findAll();
            res.json(products);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new errors_1.AppError(error.message, 500);
            }
            throw new errors_1.AppError('An unknown error occurred', 500);
        }
    }
    // Get product by SKU
    async getProductBySku(req, res) {
        try {
            const { sku } = req.params;
            if (!sku) {
                throw new errors_1.AppError('Product SKU is required', 400);
            }
            const product = await models_1.default.Product.findOne({
                where: { sku }
            });
            if (!product) {
                throw new errors_1.AppError('Product not found', 404);
            }
            res.json(product);
        }
        catch (error) {
            if (error instanceof errors_1.AppError) {
                throw error;
            }
            if (error instanceof Error) {
                throw new errors_1.AppError(error.message, 500);
            }
            throw new errors_1.AppError('An unknown error occurred', 500);
        }
    }
    // Get products by category
    async getProductsByCategory(req, res) {
        try {
            const { category } = req.params;
            if (!category) {
                throw new errors_1.AppError('Category is required', 400);
            }
            const products = await models_1.default.Product.findAll({
                where: { category }
            });
            res.json(products);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new errors_1.AppError(error.message, 500);
            }
            throw new errors_1.AppError('An unknown error occurred', 500);
        }
    }
    // Create new product
    async createProduct(req, res) {
        try {
            const productData = req.body;
            const product = await models_1.default.Product.create(productData);
            res.status(201).json(product);
        }
        catch (error) {
            if (error instanceof sequelize_1.ValidationError) {
                throw new errors_1.AppError(error.message, 400);
            }
            if (error instanceof Error) {
                throw new errors_1.AppError(error.message, 500);
            }
            throw new errors_1.AppError('An unknown error occurred', 500);
        }
    }
    // Update product
    async updateProduct(req, res) {
        try {
            const { sku } = req.params;
            const updates = req.body;
            const [updated] = await models_1.default.Product.update(updates, {
                where: { sku }
            });
            if (!updated) {
                throw new errors_1.AppError('Product not found', 404);
            }
            const updatedProduct = await models_1.default.Product.findOne({
                where: { sku }
            });
            res.json(updatedProduct);
        }
        catch (error) {
            if (error instanceof sequelize_1.ValidationError) {
                throw new errors_1.AppError(error.message, 400);
            }
            if (error instanceof Error) {
                throw new errors_1.AppError(error.message, 500);
            }
            throw new errors_1.AppError('An unknown error occurred', 500);
        }
    }
    // Delete product
    async deleteProduct(req, res) {
        try {
            const { sku } = req.params;
            const deleted = await models_1.default.Product.destroy({
                where: { sku }
            });
            if (!deleted) {
                throw new errors_1.AppError('Product not found', 404);
            }
            res.status(204).send();
        }
        catch (error) {
            if (error instanceof Error) {
                throw new errors_1.AppError(error.message, 500);
            }
            throw new errors_1.AppError('An unknown error occurred', 500);
        }
    }
    // Update product quantity
    async updateQuantity(req, res) {
        try {
            const { sku } = req.params;
            const { quantity } = req.body;
            if (!sku) {
                throw new errors_1.AppError('Product SKU is required', 400);
            }
            if (typeof quantity !== 'number') {
                throw new errors_1.AppError('Quantity must be a number', 400);
            }
            const [updated] = await models_1.default.Product.update({ quantity }, { where: { sku } });
            if (updated === 0) {
                throw new errors_1.AppError('Product not found', 404);
            }
            const updatedProduct = await models_1.default.Product.findOne({
                where: { sku }
            });
            res.json(updatedProduct);
        }
        catch (error) {
            if (error instanceof errors_1.AppError) {
                throw error;
            }
            if (error instanceof Error) {
                throw new errors_1.AppError(error.message, 500);
            }
            throw new errors_1.AppError('An unknown error occurred', 500);
        }
    }
}
exports.productController = new ProductController();
