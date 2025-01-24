import { Pool } from 'pg';

// Database configuration
const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD?.toString(),
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false // Required for some cloud databases
    }
});

// Test the connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default {
    query: (text: string, params?: any[]) => pool.query(text, params),
    pool
};
