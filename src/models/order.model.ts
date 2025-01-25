import { Model, DataTypes, Sequelize } from 'sequelize';
import { db } from '../config/database';

interface OrderAttributes {
  id: string;
  orderNumber: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  orderItems: {
    sku: string;
    name: string;
    quantity: number;
    price: number;
    customOptions?: {
      width?: number;
      length?: number;
      isWired?: boolean;
    };
  }[];
  total: number;
  notes?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes extends Omit<OrderAttributes, 'id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public orderNumber!: string;
  public customerFirstName!: string;
  public customerLastName!: string;
  public customerEmail!: string;
  public customerPhone!: string;
  public shippingStreet!: string;
  public shippingCity!: string;
  public shippingState!: string;
  public shippingZipCode!: string;
  public orderItems!: {
    sku: string;
    name: string;
    quantity: number;
    price: number;
    customOptions?: {
      width?: number;
      length?: number;
      isWired?: boolean;
    };
  }[];
  public total!: number;
  public notes!: string;
  public status!: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    customerFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingStreet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingState: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingZipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderItems: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize: db,
    tableName: 'orders',
    modelName: 'Order',
  }
);

export default Order;
