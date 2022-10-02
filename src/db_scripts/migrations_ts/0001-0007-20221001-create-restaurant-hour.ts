import { QueryInterface, fn, DataTypes } from 'sequelize'

const TABLE_NAME = 'restaurant_hour'

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.createTable(TABLE_NAME, {
      restaurantHourId: {
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
    })
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.dropTable(TABLE_NAME)
  },
}
