import { Pool, QueryResult, QueryResultRow } from 'pg';
import { AppError } from '../types/errors';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

interface QueryOptions {
  text: string;
  values?: any[];
}

export const query = async <T extends QueryResultRow = QueryResultRow>(
  options: QueryOptions
): Promise<QueryResult<T>> => {
  const client = await pool.connect();
  try {
    return await client.query<T>(options);
  } catch (error) {
    throw new AppError(
      `Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  } finally {
    client.release();
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const result = await query({ text: 'SELECT 1' });
    return true;
  } catch (error) {
    return false;
  }
};
