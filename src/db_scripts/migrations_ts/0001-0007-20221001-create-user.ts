import { QueryInterface, fn, DataTypes } from 'sequelize'

const TABLE_NAME = 'user'

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.createTable(TABLE_NAME, {
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
    })
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.dropTable(TABLE_NAME)
  },
}
