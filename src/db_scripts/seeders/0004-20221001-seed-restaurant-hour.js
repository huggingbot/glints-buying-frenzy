const restaurantHourJson = require('../etl/output/restaurant_hour.json')

const TABLE_NAME = 'restaurant_hour'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(TABLE_NAME, restaurantHourJson, {})
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(TABLE_NAME, {}, {})
  },
}
