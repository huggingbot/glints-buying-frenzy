import { BaseService } from '~/core/base.service'
import { ILogContext } from '~/core/types'
import { IRestaurant } from './restaurant.types'
import { RestaurantTimeDb } from './restaurant_time.db'

export class RestaurantTimeService extends BaseService {
  private restaurantTimeDb: RestaurantTimeDb

  public constructor(logContext: ILogContext) {
    super(logContext)
    this.restaurantTimeDb = new RestaurantTimeDb(logContext)
  }

  public async getRestaurantsByTime(dayOfWeek: number, timeAsMinutes: number): Promise<IRestaurant[]> {
    const result = await this.restaurantTimeDb.findRestaurantsByTime(dayOfWeek, timeAsMinutes)
    return result.map(({ restaurantIdRestaurantModel: { restaurantId, restaurantName, cashBalance } }) => ({
      restaurantId,
      restaurantName,
      cashBalance,
    }))
  }
}
