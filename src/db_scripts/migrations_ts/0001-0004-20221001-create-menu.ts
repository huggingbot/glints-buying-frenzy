import { QueryInterface, fn, DataTypes } from 'sequelize'

const TABLE_NAME = 'menu'

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.createTable(TABLE_NAME, {
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
    })
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.dropTable(TABLE_NAME)
  },
}
