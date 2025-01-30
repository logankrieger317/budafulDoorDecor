import { Model, Optional } from 'sequelize';

// Product Interfaces
interface ProductAttributes {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  width: number;
  length: number;
  color: string;
  brand: string;
  isWired: boolean;
  inStock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes {}

// Database Interface
declare interface Database {
  Product: typeof Model & {
    new (values?: object, options?: object): ProductInstance;
  };
}

// Module Declaration
declare module '../../models' {
  const db: Database;
  export = db;
}
