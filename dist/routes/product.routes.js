"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
// Get all products
router.get('/', productController_1.productController.getAllProducts.bind(productController_1.productController));
// Get product by SKU
router.get('/:sku', productController_1.productController.getProductBySku.bind(productController_1.productController));
// Create new product
router.post('/', productController_1.productController.createProduct.bind(productController_1.productController));
// Update product
router.put('/:sku', productController_1.productController.updateProduct.bind(productController_1.productController));
// Delete product
router.delete('/:sku', productController_1.productController.deleteProduct.bind(productController_1.productController));
// Update product quantity
router.patch('/:sku/quantity', productController_1.productController.updateQuantity.bind(productController_1.productController));
exports.default = router;
