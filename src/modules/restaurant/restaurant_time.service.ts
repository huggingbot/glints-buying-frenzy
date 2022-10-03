import { CustomError } from '~/core/base.errors'
import { BaseService } from '~/core/base.service'
import { ILogContext } from '~/core/types'
import { IRestaurantTime } from './restaurant.types'
import { RestaurantTimeDb } from './restaurant_time.db'

export class RestaurantTimeService extends BaseService {
  private restaurantTimeDb: RestaurantTimeDb

  public constructor(logContext: ILogContext) {
    super(logContext)
    this.name = 'RestaurantTimeService'
    this.restaurantTimeDb = new RestaurantTimeDb(logContext)
  }

  public async getRestaurantsByTime(dayOfWeek: number, timeAsMinutes: number): Promise<IRestaurantTime[]> {
    try {
      const result = await this.restaurantTimeDb.findRestaurantsByTime(dayOfWeek, timeAsMinutes)
      return result.map(({ restaurantIdRestaurantModel: { restaurantName }, dayOfWeek, openingHour, closingHour }) => ({
        restaurantName,
        dayOfWeek,
        openingHour,
        closingHour,
      }))
    } catch (err) {
      throw new CustomError(this.name)
    }
  }
}
