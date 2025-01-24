"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = exports.query = void 0;
const pg_1 = require("pg");
const errors_1 = require("../types/errors");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
const query = async (options) => {
    const client = await pool.connect();
    try {
        return await client.query(options);
    }
    catch (error) {
        throw new errors_1.AppError(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
    finally {
        client.release();
    }
};
exports.query = query;
const healthCheck = async () => {
    try {
        const result = await (0, exports.query)({ text: 'SELECT 1' });
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.healthCheck = healthCheck;
