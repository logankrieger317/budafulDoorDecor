import express from 'express';
import { productController } from '../controllers/productController';

const router = express.Router();

// Get all products
router.get('/', productController.getAllProducts.bind(productController));

// Get product by SKU
router.get('/:sku', productController.getProductBySku.bind(productController));

// Get products by category
router.get('/category/:category', productController.getProductsByCategory.bind(productController));

// Create new product
router.post('/', productController.createProduct.bind(productController));

// Update product
router.put('/:sku', productController.updateProduct.bind(productController));

// Delete product
router.delete('/:sku', productController.deleteProduct.bind(productController));

// Update product quantity
router.patch('/:sku/quantity', productController.updateQuantity.bind(productController));

export default router;
