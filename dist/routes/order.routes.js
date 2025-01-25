"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = express_1.default.Router();
router.post('/', (0, asyncHandler_1.asyncHandler)(orderController_1.orderController.createOrder.bind(orderController_1.orderController)));
router.get('/:id', (0, asyncHandler_1.asyncHandler)(orderController_1.orderController.getOrder.bind(orderController_1.orderController)));
router.get('/number/:orderNumber', (0, asyncHandler_1.asyncHandler)(orderController_1.orderController.getOrderByNumber.bind(orderController_1.orderController)));
router.patch('/:id/status', (0, asyncHandler_1.asyncHandler)(orderController_1.orderController.updateOrderStatus.bind(orderController_1.orderController)));
exports.orderRoutes = router;
exports.default = router;
