import { fn, Op, where } from 'sequelize'
import { BaseDb } from '~/core/base.db'
import { ILogContext } from '~/core/types'
import { IRestaurantModelAttrs, RestaurantModelStatic, restaurantModelStatic } from '~/models/RestaurantModel'

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
    const restaurantMenuModelStatic = restaurantModelStatic.assoc.restaurantIdRestaurantMenuModels()

    return (
      await restaurantModelStatic.findAll({
        where: {
          [restaurantMenuModelStatic.attrs.price]: { [Op.between]: [minPrice, maxPrice] },
        },
        include: [
          {
            model: restaurantMenuModelStatic,
            required: true,
            as: restaurantModelStatic.alias.restaurantIdRestaurantMenuModels,
          },
        ],
        group: [restaurantModelStatic.attrs.restaurantId],
        having: where(fn('COUNT', '*'), {
          [dishComparison === 'greater' ? Op.gt : Op.lt]: dishCount,
        }),
        order: [restaurantModelStatic.attrs.restaurantName, 'ASC'],
        limit: restaurantCount,
      })
    ).map((i) => i.toJSON()) as IRestaurantModelAttrs[]
  }
}
