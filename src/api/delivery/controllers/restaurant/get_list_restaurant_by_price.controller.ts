import { Request, Response } from 'express'
import { ETransactional } from '~/core/audit.logging'
import { CustomController } from '~/core/base.controller'
import { CustomError } from '~/core/base.errors'
import { IApiResult } from '~/core/types'
import { RestaurantService } from '~/modules/restaurant/restaurant.service'
import { IRestaurantName } from '~/modules/restaurant/restaurant.types'

interface IGetListRestaurantByPriceQuery {
  minPrice?: number
  maxPrice?: number
  dishComparison?: 'greater' | 'less'
  dishCount?: number
  restaurantCount?: number
}

export class GetListRestaurantByPriceController extends CustomController<IRestaurantName[]> {
  private restaurantService: RestaurantService

  public constructor(req: Request, res: Response) {
    super(req, res)
    this.restaurantService = new RestaurantService(this.logContext)
  }

  protected async doRequest(
    req: Request<unknown, unknown, unknown, IGetListRestaurantByPriceQuery>,
  ): Promise<IApiResult> {
    try {
      const { minPrice, maxPrice, dishComparison, dishCount, restaurantCount } = req.query

      if (!minPrice || !maxPrice || !dishComparison || !dishCount || !restaurantCount) {
        throw new CustomError('Required query string(s) not found')
      }
      const result = await this.restaurantService.getRestaurantsByDishCountInPriceRange(
        Number(minPrice),
        Number(maxPrice),
        dishComparison,
        Number(dishCount),
        Number(restaurantCount),
      )

      return this.success(result, 'Successfully got restaurants')
    } catch (err) {
      if (err instanceof CustomError) {
        return this.badRequest(err)
      }
      return this.internalServerError(err)
    }
  }

  protected getTxType(): string {
    return ETransactional.GetListRestaurantByPrice
  }
}
