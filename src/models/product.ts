import { Model, DataTypes, Sequelize } from 'sequelize';
import { ProductAttributes, ProductCreationAttributes } from '../types/models';

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public sku!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public imageUrl?: string;
  public width!: number;
  public length!: number;
  public color!: string;
  public brand!: string;
  public isWired!: boolean;
  public quantity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

export function initProduct(sequelize: Sequelize): typeof Product {
  Product.init(
    {
      sku: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      width: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Width in inches',
      },
      length: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isWired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      paranoid: true,
      timestamps: true,
    }
  );

  return Product;
}
