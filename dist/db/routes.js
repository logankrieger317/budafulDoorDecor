"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queries_1 = require("./queries");
const router = express_1.default.Router();
const healthCheckHandler = async (_req, res, next) => {
    try {
        const isHealthy = await (0, queries_1.healthCheck)();
        if (isHealthy) {
            res.json({ status: 'healthy', timestamp: new Date().toISOString() });
        }
        else {
            res.status(503).json({ status: 'unhealthy', timestamp: new Date().toISOString() });
        }
    }
    catch (error) {
        next(error);
    }
};
router.get('/health', healthCheckHandler);
exports.default = router;
