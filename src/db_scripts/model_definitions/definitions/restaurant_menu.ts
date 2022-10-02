import { DataTypes, fn } from 'sequelize'
import { AssocType, ICreatorDefinition } from '../types'

export const definition: ICreatorDefinition = {
  tableName: 'restaurant_menu',
  modelName: 'RestaurantMenu',
  attributes: {
    restaurantMenuId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    restaurantId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'restaurant',
        key: 'restaurantId',
      },
    },
    menuId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'menu',
        key: 'menuId',
      },
    },
    price: {
      type: DataTypes.FLOAT.UNSIGNED,
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
  indexes: [
    {
      attributes: ['price'],
      options: {
        unique: false,
        name: 'restaurant_menu_price',
      },
    },
  ],
  associations: [
    {
      assocType: AssocType.BelongsTo,
      assocModelName: 'Restaurant',
      foreignKey: 'restaurantId',
    },
    {
      assocType: AssocType.BelongsTo,
      assocModelName: 'Menu',
      foreignKey: 'menuId',
    },
    {
      assocType: AssocType.HasMany,
      assocModelName: 'PurchaseHistory',
      foreignKey: 'restaurantMenuId',
    },
    {
      assocType: AssocType.BelongsToMany,
      assocModelName: 'User',
      foreignKey: 'restaurantMenuId',
      through: 'PurchaseHistory',
    },
  ],
}
