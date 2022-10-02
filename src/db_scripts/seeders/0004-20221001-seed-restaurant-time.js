const restaurantTimeJson = require('../etl/output/restaurant_time.json')

const TABLE_NAME = 'restaurant_time'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(TABLE_NAME, restaurantTimeJson, {})
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(TABLE_NAME, {}, {})
  },
}
