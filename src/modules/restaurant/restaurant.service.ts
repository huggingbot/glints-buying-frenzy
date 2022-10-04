import { CustomError } from '~/src/core/base.errors'
import { BaseService } from '~/src/core/base.service'
import { ILogContext } from '~/src/core/types'
import { RestaurantDb } from './restaurant.db'
import { IRestaurantName } from './restaurant.types'

export class RestaurantService extends BaseService {
  private restaurantDb: RestaurantDb

  public constructor(logContext: ILogContext) {
    super(logContext)
    this.name = 'RestaurantService'
    this.restaurantDb = new RestaurantDb(logContext)
  }

  public async getRestaurantsByDishCountInPriceRange(
    minPrice: number,
    maxPrice: number,
    dishComparison: 'greater' | 'less',
    dishCount: number,
    restaurantCount: number,
  ): Promise<IRestaurantName[]> {
    try {
      const result = await this.restaurantDb.findRestaurantsByDishCountInPriceRange(
        minPrice,
        maxPrice,
        dishComparison,
        dishCount,
        restaurantCount,
      )
      return result.map(({ restaurantName }) => ({ restaurantName }))
    } catch (err) {
      throw new CustomError(this.name)
    }
  }
}
