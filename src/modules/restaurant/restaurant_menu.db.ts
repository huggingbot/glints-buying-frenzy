import { QueryTypes } from 'sequelize'
import { BaseDb } from '~/src/core/base.db'
import { ILogContext } from '~/src/core/types'
import { database } from '~/src/db_scripts'
import { IRestaurantModelAttrs, RestaurantModelStatic, restaurantModelStatic } from '~/src/models/RestaurantModel'
import { IRestaurantMenuSearch } from './restaurant.types'

export class RestaurantMenuDb extends BaseDb<RestaurantModelStatic, IRestaurantModelAttrs> {
  public constructor(logContext: ILogContext) {
    super(logContext, restaurantModelStatic)
  }

  public async findRestaurantsAndMenusByName(searchTerm: string): Promise<IRestaurantMenuSearch[]> {
    return (await database.query(
      `
      SELECT 
          *
      FROM
          (SELECT
                  restaurantName AS searchResult,
                  MATCH (restaurantName) AGAINST (:searchTerm IN BOOLEAN MODE) AS score
          FROM
              restaurant
          WHERE
              MATCH (restaurantName) AGAINST (:searchTerm IN BOOLEAN MODE)
          UNION
          SELECT 
                  dishName AS searchResult,
                  MATCH (dishName) AGAINST (:searchTerm IN BOOLEAN MODE) AS score
          FROM
              menu
          WHERE
              MATCH (dishName) AGAINST (:searchTerm IN BOOLEAN MODE)) AS unionSearch
      ORDER BY score DESC
      `,
      {
        replacements: { searchTerm },
        type: QueryTypes.SELECT,
      },
    )) as IRestaurantMenuSearch[]
  }
}
