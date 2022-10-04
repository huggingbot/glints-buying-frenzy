import { QueryTypes } from 'sequelize'
import { BaseDb } from '~/src/core/base.db'
import { ILogContext } from '~/src/core/types'
import { database } from '~/src/db_scripts'
import { IRestaurantModelAttrs, RestaurantModelStatic, restaurantModelStatic } from '~/src/models/RestaurantModel'

export class RestaurantDb extends BaseDb<RestaurantModelStatic, IRestaurantModelAttrs> {
  public constructor(logContext: ILogContext) {
    super(logContext, restaurantModelStatic)
  }

  public async findRestaurantsByDishCountInPriceRange(
    minPrice: number,
    maxPrice: number,
    dishComparison: 'greater' | 'less',
    dishCount: number,
    restaurantCount: number,
  ): Promise<IRestaurantModelAttrs[]> {
    const comparison = dishComparison === 'greater' ? '>' : '<'

    return (await database.query(
      `
        SELECT 
            r.restaurantId, r.restaurantName, COUNT(*) AS dishCount
        FROM
            restaurant AS r
                INNER JOIN
            restaurant_menu AS rm ON r.restaurantId = rm.restaurantId
        WHERE
            rm.price BETWEEN :minPrice AND :maxPrice
        GROUP BY r.restaurantId
        HAVING dishCount ${comparison} :dishCount
        ORDER BY r.restaurantName ASC
        LIMIT :restaurantCount
      `,
      {
        replacements: { minPrice, maxPrice, dishCount, restaurantCount },
        type: QueryTypes.SELECT,
      },
    )) as IRestaurantModelAttrs[]
  }
}
