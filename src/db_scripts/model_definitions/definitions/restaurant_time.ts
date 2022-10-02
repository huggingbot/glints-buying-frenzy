import { DataTypes, fn } from 'sequelize'
import { AssocType, ICreatorDefinition } from '../types'

export const definition: ICreatorDefinition = {
  tableName: 'restaurant_time',
  modelName: 'RestaurantTime',
  attributes: {
    restaurantTimeId: {
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
    dayOfWeek: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    openingHour: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    closingHour: {
      type: DataTypes.INTEGER.UNSIGNED,
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
      attributes: ['dayOfWeek', 'openingHour', 'closingHour'],
      options: {
        unique: false,
        name: 'restaurant_time_dayOfWeek_openingHour_closingHour',
      },
    },
  ],
  associations: [
    {
      assocType: AssocType.BelongsTo,
      assocModelName: 'Restaurant',
      foreignKey: 'restaurantId',
    },
  ],
}
