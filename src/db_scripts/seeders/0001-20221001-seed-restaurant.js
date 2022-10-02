const restaurantJson = require('../etl/output/restaurant.json')

const TABLE_NAME = 'restaurant'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(TABLE_NAME, restaurantJson, {})
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(TABLE_NAME, {}, {})
  },
}
