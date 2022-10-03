import { BaseService } from '~/core/base.service'
import { ILogContext } from '~/core/types'
import { RestaurantDb } from './restaurant.db'
import { IRestaurantName } from './restaurant.types'

export class RestaurantService extends BaseService {
  private restaurantDb: RestaurantDb

  public constructor(logContext: ILogContext) {
    super(logContext)
    this.restaurantDb = new RestaurantDb(logContext)
  }

  public async getRestaurantsByDishCountInPriceRange(
    minPrice: number,
    maxPrice: number,
    dishComparison: 'greater' | 'less',
    dishCount: number,
    restaurantCount: number,
  ): Promise<IRestaurantName[]> {
    const result = await this.restaurantDb.findRestaurantsByDishCountInPriceRange(
      minPrice,
      maxPrice,
      dishComparison,
      dishCount,
      restaurantCount,
    )
    return result.map(({ restaurantName }) => ({ restaurantName }))
  }
}
