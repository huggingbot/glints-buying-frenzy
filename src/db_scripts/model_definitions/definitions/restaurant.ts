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
      validate: {
        min: 0,
      },
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
      assocModelName: 'RestaurantTime',
      foreignKey: 'restaurantId',
    },
    {
      assocType: AssocType.HasMany,
      assocModelName: 'menu',
      foreignKey: 'restaurantId',
    },
  ],
}
