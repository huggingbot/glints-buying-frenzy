import { QueryInterface } from 'sequelize'

const INDEX_NAME = 'restaurant_time_dayOfWeek_openingHour_closingHour'
const TABLE_NAME = 'restaurant_time'

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const index = {
      attributes: ['dayOfWeek', 'openingHour', 'closingHour'],
      options: {
        unique: false,
        name: INDEX_NAME,
      },
    }
    return queryInterface.addIndex(TABLE_NAME, index.attributes, index.options)
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.removeIndex(TABLE_NAME, INDEX_NAME)
  },
}
