import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import { ProductAttributes, ProductCreationAttributes } from '../types/models';
import { AppError } from '../types/errors';
import { getDatabase } from '../models';

const parseDecimalFields = (product: any) => {
  try {
    // Get the plain object, whether it's a Sequelize model or already a plain object
    const plainProduct = product.get ? product.get({ plain: true }) : product;
    
    return {
      ...plainProduct,
      price: plainProduct.price ? parseFloat(plainProduct.price) : 0,
      width: plainProduct.width ? parseFloat(plainProduct.width) : null,
      length: plainProduct.length ? parseFloat(plainProduct.length) : null,
    };
  } catch (error) {
    console.error('[ERROR] Failed to parse product:', error);
    // Return the original product if parsing fails
    return product;
  }
};

class ProductController {
  // Get all products
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const db = getDatabase();
      const products = await db.Product.findAll();
      res.json(products.map(parseDecimalFields));
    } catch (error) {
      console.error('[ERROR] Failed to get products:', error);
      if (error instanceof Error) {
        res.status(500).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'An unknown error occurred'
        });
      }
    }
  }

  // Get product by SKU
  async getProductBySku(req: Request, res: Response): Promise<void> {
    try {
      const { sku } = req.params;
      if (!sku) {
        throw new AppError('Product SKU is required', 400);
      }
      
      const db = getDatabase();
      const product = await db.Product.findOne({
        where: { sku }
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      res.json(parseDecimalFields(product));
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
      const db = getDatabase();
      const product = await db.Product.create(productData);
      res.status(201).json(parseDecimalFields(product));
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new AppError(error.message, 400);
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
      const updates: Partial<ProductAttributes> = req.body;
      const db = getDatabase();
      const [updatedCount] = await db.Product.update(updates, {
        where: { sku }
      });

      if (updatedCount === 0) {
        throw new AppError('Product not found', 404);
      }

      const updatedProduct = await db.Product.findOne({
        where: { sku }
      });

      res.json(parseDecimalFields(updatedProduct));
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new AppError(error.message, 400);
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
      const db = getDatabase();
      const deletedCount = await db.Product.destroy({
        where: { sku }
      });

      if (deletedCount === 0) {
        throw new AppError('Product not found', 404);
      }

      res.status(204).end();
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

      const db = getDatabase();
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

      res.json(parseDecimalFields(updatedProduct));
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
