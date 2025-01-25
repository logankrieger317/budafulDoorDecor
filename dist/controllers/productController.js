"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const sequelize_1 = require("sequelize");
const errors_1 = require("../types/errors");
const models_1 = require("../models");
const parseDecimalFields = (product) => {
    return {
        ...product.get({ plain: true }),
        price: parseFloat(product.price),
        width: product.width ? parseFloat(product.width) : null,
        length: product.length ? parseFloat(product.length) : null,
    };
};
class ProductController {
    // Get all products
    async getAllProducts(req, res) {
        try {
            const db = (0, models_1.getDatabase)();
            const products = await db.Product.findAll();
            res.json(products.map(parseDecimalFields));
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
            const db = (0, models_1.getDatabase)();
            const product = await db.Product.findOne({
                where: { sku }
            });
            if (!product) {
                throw new errors_1.AppError('Product not found', 404);
            }
            res.json(parseDecimalFields(product));
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
            const db = (0, models_1.getDatabase)();
            const products = await db.Product.findAll({
                where: { category }
            });
            res.json(products.map(parseDecimalFields));
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
    // Create new product
    async createProduct(req, res) {
        try {
            const productData = req.body;
            const db = (0, models_1.getDatabase)();
            const product = await db.Product.create(productData);
            res.status(201).json(parseDecimalFields(product));
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
            const db = (0, models_1.getDatabase)();
            const [updatedCount] = await db.Product.update(updates, {
                where: { sku }
            });
            if (updatedCount === 0) {
                throw new errors_1.AppError('Product not found', 404);
            }
            const updatedProduct = await db.Product.findOne({
                where: { sku }
            });
            res.json(parseDecimalFields(updatedProduct));
        }
        catch (error) {
            if (error instanceof sequelize_1.ValidationError) {
                throw new errors_1.AppError(error.message, 400);
            }
            if (error instanceof errors_1.AppError) {
                throw error;
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
            const db = (0, models_1.getDatabase)();
            const deletedCount = await db.Product.destroy({
                where: { sku }
            });
            if (deletedCount === 0) {
                throw new errors_1.AppError('Product not found', 404);
            }
            res.status(204).end();
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
            const db = (0, models_1.getDatabase)();
            const [updated] = await db.Product.update({ quantity }, { where: { sku } });
            if (updated === 0) {
                throw new errors_1.AppError('Product not found', 404);
            }
            const updatedProduct = await db.Product.findOne({
                where: { sku }
            });
            res.json(parseDecimalFields(updatedProduct));
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
