import { Model, Optional, BuildOptions, Sequelize, ModelStatic } from 'sequelize';

// Product Types
export interface ProductAttributes {
  sku: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
  width: number;
  length: number;
  isWired: boolean;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Product Creation Attributes Interface
export interface ProductCreationAttributes extends Optional<ProductAttributes, 'createdAt' | 'updatedAt' | 'deletedAt'> {}

// Product Instance Interface
export interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes {
  dataValues: ProductAttributes;
}

// Product Model Static Interface
export type ProductModel = ModelStatic<ProductInstance> & {
  associate?: (models: any) => void;
};

// User Attributes Interface
export interface UserAttributes {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

// User Creation Attributes Interface
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt'> {}

// User Instance Interface
export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  dataValues: UserAttributes;
}

// User Model Static Interface
export type UserModel = ModelStatic<UserInstance> & {
  associate?: (models: any) => void;
};

// Database Interface
export interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  Product: ProductModel;
  User: UserModel;
}

// Declare module for models/index.js
declare module '../../models' {
  const db: DB;
  export = db;
}
