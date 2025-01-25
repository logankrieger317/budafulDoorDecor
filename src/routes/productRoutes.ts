import { Router } from 'express';
import { productController } from '../controllers/productController';

const router = Router();

// Get all products
router.get('/', productController.getAllProducts);

// Get product by SKU
router.get('/:sku', productController.getProductBySku);

// Create new product
router.post('/', productController.createProduct);

// Update product
router.put('/:sku', productController.updateProduct);

// Delete product
router.delete('/:sku', productController.deleteProduct);

export const productRoutes = router;
