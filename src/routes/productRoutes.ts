import { Router } from 'express';
import { productController } from '../controllers/productController';

const router = Router();

// Get all products
router.get('/', (req, res, next) => {
  productController.getAllProducts(req, res).catch(next);
});

// Get products by category
router.get('/category/:category', (req, res, next) => {
  productController.getProductsByCategory(req, res).catch(next);
});

// Get a single product by SKU
router.get('/:sku', (req, res, next) => {
  productController.getProductBySku(req, res).catch(next);
});

// Create a new product
router.post('/', (req, res, next) => {
  productController.createProduct(req, res).catch(next);
});

// Update a product
router.put('/:sku', (req, res, next) => {
  productController.updateProduct(req, res).catch(next);
});

// Delete a product
router.delete('/:sku', (req, res, next) => {
  productController.deleteProduct(req, res).catch(next);
});

export default router;
