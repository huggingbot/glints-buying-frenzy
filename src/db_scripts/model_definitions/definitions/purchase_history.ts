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
    restaurantMenuId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'restaurant_menu',
        key: 'restaurantMenuId',
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
      assocModelName: 'RestaurantMenu',
      foreignKey: 'restaurantMenuId',
    },
    {
      assocType: AssocType.BelongsTo,
      assocModelName: 'User',
      foreignKey: 'userId',
    },
  ],
}
