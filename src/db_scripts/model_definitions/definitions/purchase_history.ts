import { DataTypes, fn } from 'sequelize'
import { AssocType, ICreatorDefinition } from '../types'

export const definition: ICreatorDefinition = {
  tableName: 'purchase_history',
  modelName: 'PurchaseHistory',
  attributes: {
    purchaseHistoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    menuId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'menu',
        key: 'menuId',
      },
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'user',
        key: 'userId',
      },
    },
    transactionAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: fn('NOW'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: fn('NOW'),
    },
  },
  indexes: [],
  associations: [
    {
      assocType: AssocType.BelongsTo,
      assocModelName: 'menu',
      foreignKey: 'menuId',
    },
    {
      assocType: AssocType.BelongsTo,
      assocModelName: 'User',
      foreignKey: 'userId',
    },
  ],
}
