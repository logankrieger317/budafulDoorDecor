import { Request } from 'express-serve-static-core';
import { ProductAttributes } from './models';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      isAdmin?: boolean;
    }
  }
}

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export interface ProductRequest extends TypedRequestBody<ProductAttributes> {}
