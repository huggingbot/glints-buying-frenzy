import { QueryInterface } from 'sequelize'

const INDEX_NAME = 'restaurant_menu_price'
const TABLE_NAME = 'restaurant_menu'

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const index = {
      attributes: ['price'],
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
