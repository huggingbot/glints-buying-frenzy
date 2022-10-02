import { QueryInterface, fn, DataTypes } from 'sequelize'

const TABLE_NAME = 'purchase_history'

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.createTable(TABLE_NAME, {
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
    })
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.dropTable(TABLE_NAME)
  },
}
