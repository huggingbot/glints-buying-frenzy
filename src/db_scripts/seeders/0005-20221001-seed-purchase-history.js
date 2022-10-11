const purchaseHistoryJson = require('../etl/output/purchase_history.json')

const TABLE_NAME = 'purchase_history'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(TABLE_NAME, purchaseHistoryJson, {})
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(TABLE_NAME, {}, {})
  },
}
