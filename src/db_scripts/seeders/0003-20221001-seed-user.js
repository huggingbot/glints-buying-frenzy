const userJson = require('../etl/output/user.json')

const TABLE_NAME = 'user'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(TABLE_NAME, userJson, {})
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(TABLE_NAME, {}, {})
  },
}
