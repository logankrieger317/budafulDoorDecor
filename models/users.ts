import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export interface UserAttributes {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public role!: 'admin' | 'manager' | 'user';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initUser(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'manager', 'user'),
        allowNull: false,
        defaultValue: 'user',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
    }
  );

  return User;
}