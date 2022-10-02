const restaurantMenuJson = require('../etl/output/restaurant_menu.json')

const TABLE_NAME = 'restaurant_menu'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(TABLE_NAME, restaurantMenuJson, {})
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(TABLE_NAME, {}, {})
  },
}
