import { DataTypes, fn } from 'sequelize'
import { AssocType, ICreatorDefinition } from '../types'

export const definition: ICreatorDefinition = {
  tableName: 'restaurant',
  modelName: 'Restaurant',
  attributes: {
    restaurantId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    restaurantName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cashBalance: {
      type: DataTypes.FLOAT,
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
      assocType: AssocType.HasMany,
      assocModelName: 'RestaurantHour',
      foreignKey: 'restaurantId',
    },
    {
      assocType: AssocType.HasMany,
      assocModelName: 'RestaurantMenu',
      foreignKey: 'restaurantId',
    },
    {
      assocType: AssocType.BelongsToMany,
      assocModelName: 'Menu',
      foreignKey: 'restaurantId',
      through: 'RestaurantMenu',
    },
  ],
}
