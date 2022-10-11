import { DataTypes, fn } from 'sequelize'
import { AssocType, ICreatorDefinition } from '../types'

export const definition: ICreatorDefinition = {
  tableName: 'user',
  modelName: 'User',
  attributes: {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
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
      assocModelName: 'PurchaseHistory',
      foreignKey: 'userId',
    },
    {
      assocType: AssocType.BelongsToMany,
      assocModelName: 'menu',
      foreignKey: 'userId',
      through: 'PurchaseHistory',
    },
  ],
}
