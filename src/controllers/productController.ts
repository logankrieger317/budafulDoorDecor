import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import db from '../../models';
import { ProductAttributes, ProductCreationAttributes } from '../types/models';
import { AppError } from '../types/errors';

class ProductController {
  // Get all products
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await db.Product.findAll();
      res.json(products);
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }
      throw new AppError('An unknown error occurred', 500);
    }
  }

  // Get product by SKU
  async getProductBySku(req: Request, res: Response): Promise<void> {
    try {
      const { sku } = req.params;
      if (!sku) {
        throw new AppError('Product SKU is required', 400);
      }
      const product = await db.Product.findOne({
        where: { sku }
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      res.json(product);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }
      throw new AppError('An unknown error occurred', 500);
    }
  }

  // Create new product
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData: ProductCreationAttributes = req.body;
      const product = await db.Product.create(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new AppError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
      }
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }
      throw new AppError('An unknown error occurred', 500);
    }
  }

  // Update product
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { sku } = req.params;
      if (!sku) {
        throw new AppError('Product SKU is required', 400);
      }
      const updates: Partial<ProductAttributes> = req.body;

      const [updated] = await db.Product.update(updates, {
        where: { sku }
      });

      if (updated === 0) {
        throw new AppError('Product not found', 404);
      }

      const updatedProduct = await db.Product.findOne({
        where: { sku }
      });

      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new AppError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400);
      }
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }
      throw new AppError('An unknown error occurred', 500);
    }
  }

  // Delete product
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { sku } = req.params;
      if (!sku) {
        throw new AppError('Product SKU is required', 400);
      }
      const deleted = await db.Product.destroy({
        where: { sku }
      });

      if (!deleted) {
        throw new AppError('Product not found', 404);
      }

      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }
      throw new AppError('An unknown error occurred', 500);
    }
  }

  // Get products by category
  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      if (!category) {
        throw new AppError('Category is required', 400);
      }
      const products = await db.Product.findAll({
        where: { category }
      });
      res.json(products);
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }
      throw new AppError('An unknown error occurred', 500);
    }
  }

  // Update product quantity
  async updateQuantity(req: Request, res: Response): Promise<void> {
    try {
      const { sku } = req.params;
      const { quantity } = req.body;

      if (!sku) {
        throw new AppError('Product SKU is required', 400);
      }

      if (typeof quantity !== 'number') {
        throw new AppError('Quantity must be a number', 400);
      }

      const [updated] = await db.Product.update(
        { quantity },
        { where: { sku } }
      );

      if (updated === 0) {
        throw new AppError('Product not found', 404);
      }

      const updatedProduct = await db.Product.findOne({
        where: { sku }
      });

      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }
      throw new AppError('An unknown error occurred', 500);
    }
  }
}

export const productController = new ProductController();
