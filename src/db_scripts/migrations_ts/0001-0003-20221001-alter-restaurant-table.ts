import { QueryInterface } from 'sequelize'

const TABLE_NAME = 'restaurant'

module.exports = {
  up: (queryInterface: QueryInterface): Promise<[unknown[], unknown]> => {
    return queryInterface.sequelize.query(`ALTER TABLE ${TABLE_NAME} ADD FULLTEXT(restaurantName);`)
  },
  down: (): void => {
    return
  },
}
