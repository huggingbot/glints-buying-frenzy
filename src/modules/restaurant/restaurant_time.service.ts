import moment from 'moment'
import { CustomError } from '~/src/core/base.errors'
import { BaseService } from '~/src/core/base.service'
import { ILogContext } from '~/src/core/types'
import { IRestaurantTime } from './restaurant.types'
import { RestaurantTimeDb } from './restaurant_time.db'

export class RestaurantTimeService extends BaseService {
  private restaurantTimeDb: RestaurantTimeDb

  public constructor(logContext: ILogContext) {
    super(logContext)
    this.name = 'RestaurantTimeService'
    this.restaurantTimeDb = new RestaurantTimeDb(logContext)
  }

  public async getRestaurantsByTime(timestamp: number): Promise<IRestaurantTime[]> {
    try {
      const date = moment(timestamp)
      const dayOfWeek = date.day() + 1
      const timeAsMinutes = moment.duration(date.format('HH:mm')).asMinutes()

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
