import { Sequelize } from 'sequelize';
import { Product } from '../models/product';
import { User } from '../models/users';

export interface ProductAttributes {
  sku: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
  width?: number;
  length?: number;
  isWired: boolean;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ProductCreationAttributes extends Omit<ProductAttributes, 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  Product: typeof Product;
  User: typeof User;
}
