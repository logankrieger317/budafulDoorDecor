"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
// Get all products
router.get('/', productController_1.productController.getAllProducts);
// Get product by SKU
router.get('/:sku', productController_1.productController.getProductBySku);
// Get products by category
router.get('/category/:category', productController_1.productController.getProductsByCategory);
// Create new product
router.post('/', productController_1.productController.createProduct);
// Update product
router.put('/:sku', productController_1.productController.updateProduct);
// Delete product
router.delete('/:sku', productController_1.productController.deleteProduct);
exports.productRoutes = router;
