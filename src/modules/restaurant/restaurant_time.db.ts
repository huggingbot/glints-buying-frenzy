import { Op } from 'sequelize'
import { BaseDb } from '~/core/base.db'
import { ILogContext } from '~/core/types'
import {
  IRestaurantTimeModelAttrs,
  RestaurantTimeModelStatic,
  restaurantTimeModelStatic,
} from '~/models/RestaurantTimeModel'

export class RestaurantTimeDb extends BaseDb<RestaurantTimeModelStatic, IRestaurantTimeModelAttrs> {
  public constructor(logContext: ILogContext) {
    super(logContext, restaurantTimeModelStatic)
  }

  public async findRestaurantsByTime(dayOfWeek: number, timeAsMinutes: number): Promise<IRestaurantTimeModelAttrs[]> {
    const restaurantModelStatic = restaurantTimeModelStatic.assoc.restaurantIdRestaurantModel()

    return (
      await restaurantTimeModelStatic.findAll({
        where: {
          [restaurantTimeModelStatic.attrs.dayOfWeek]: dayOfWeek,
          [restaurantTimeModelStatic.attrs.openingHour]: { [Op.lte]: timeAsMinutes },
          [restaurantTimeModelStatic.attrs.closingHour]: { [Op.gte]: timeAsMinutes },
        },
        include: [
          {
            model: restaurantModelStatic,
            required: true,
            as: restaurantTimeModelStatic.alias.restaurantIdRestaurantModel,
          },
        ],
      })
    ).map((i) => i.toJSON()) as IRestaurantTimeModelAttrs[]
  }
}
