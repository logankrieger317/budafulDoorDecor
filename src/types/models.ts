import { Sequelize } from 'sequelize';
import { Product } from '../models/product';
import { Order } from '../models/order.model';

export interface CartItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  customOptions?: {
    width?: number;
    length?: number;
    isWired?: boolean;
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface ProductAttributes {
  sku: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  width: number;
  length: number;
  isWired: boolean;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ProductCreationAttributes extends Omit<ProductAttributes, 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  Product: typeof Product;
  Order: typeof Order;
}
