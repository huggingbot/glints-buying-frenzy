import { BaseDb } from '~/core/base.db'
import { ILogContext } from '~/core/types'
import { IRestaurantModelAttrs, RestaurantModelStatic, restaurantModelStatic } from '~/models/RestaurantModel'

export class RestaurantDb extends BaseDb<RestaurantModelStatic, IRestaurantModelAttrs> {
  public constructor(logContext: ILogContext) {
    super(logContext, restaurantModelStatic)
  }
}