import { Request, Response } from 'express'
import { ETransactional } from '~/core/audit.logging'
import { CustomController } from '~/core/base.controller'
import { CustomError } from '~/core/base.errors'
import { IApiResult } from '~/core/types'
import { IRestaurant } from '~/modules/restaurant/restaurant.types'
import { RestaurantTimeService } from '~/modules/restaurant/restaurant_time.service'

interface IRestaurantQuery {
  dayOfWeek?: number
  timeAsMinutes?: number
}

export class GetListRestaurantByTimeController extends CustomController<IRestaurant[]> {
  private restaurantTimeService: RestaurantTimeService

  public constructor(req: Request, res: Response) {
    super(req, res)
    this.restaurantTimeService = new RestaurantTimeService(this.logContext)
  }

  protected async doRequest(req: Request<unknown, unknown, unknown, IRestaurantQuery>): Promise<IApiResult> {
    try {
      const { dayOfWeek, timeAsMinutes } = req.query

      if (!dayOfWeek || !timeAsMinutes) {
        throw new CustomError('Required query strings not found')
      }
      const result = await this.restaurantTimeService.getRestaurantsByTime(dayOfWeek, timeAsMinutes)

      return this.success(result as IRestaurant[], 'Successfully got restaurants')
    } catch (err) {
      if (err instanceof CustomError) {
        return this.badRequest(err)
      }
      return this.internalServerError(err)
    }
  }

  protected getTxType(): string {
    return ETransactional.GetListRestaurant
  }
}
