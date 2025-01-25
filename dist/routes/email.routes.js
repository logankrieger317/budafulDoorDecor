"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRoutes = void 0;
const express_1 = __importDefault(require("express"));
const emailController_1 = require("../controllers/emailController");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = express_1.default.Router();
router.post('/order-confirmation', (0, asyncHandler_1.asyncHandler)(emailController_1.emailController.sendOrderConfirmationEmail.bind(emailController_1.emailController)));
router.post('/order-status-update', (0, asyncHandler_1.asyncHandler)(emailController_1.emailController.sendOrderStatusUpdateEmail.bind(emailController_1.emailController)));
exports.emailRoutes = router;
exports.default = router;
