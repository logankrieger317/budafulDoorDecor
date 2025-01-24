"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../types/errors");
const errorHandler = (error, req, res, next) => {
    console.error(error);
    if (error instanceof errors_1.AppError) {
        res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
        return;
    }
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
};
exports.errorHandler = errorHandler;
