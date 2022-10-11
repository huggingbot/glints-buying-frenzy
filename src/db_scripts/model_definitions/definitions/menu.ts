import { DataTypes, fn } from 'sequelize'
import { AssocType, ICreatorDefinition } from '../types'

export const definition: ICreatorDefinition = {
  tableName: 'menu',
  modelName: 'Menu',
  attributes: {
    menuId: {
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
    dishName: {
      type: DataTypes.STRING(512),
      allowNull: false,
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
  indexes: [],
  associations: [
    {
      assocType: AssocType.BelongsTo,
      assocModelName: 'Restaurant',
      foreignKey: 'restaurantId',
    },
  ],
}
