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
    dishName: {
      type: DataTypes.STRING(512),
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
      assocModelName: 'RestaurantMenu',
      foreignKey: 'menuId',
    },
    {
      assocType: AssocType.BelongsToMany,
      assocModelName: 'Restaurant',
      foreignKey: 'menuId',
      through: 'RestaurantMenu',
    },
  ],
}
