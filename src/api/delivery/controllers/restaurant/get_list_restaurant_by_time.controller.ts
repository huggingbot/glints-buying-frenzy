import { Request, Response } from 'express'
import Joi from 'joi'
import { ETransactional } from '~/core/audit.logging'
import { CustomController } from '~/core/base.controller'
import { CustomError } from '~/core/base.errors'
import { IApiResult } from '~/core/types'
import { IRestaurantTime } from '~/modules/restaurant/restaurant.types'
import { RestaurantTimeService } from '~/modules/restaurant/restaurant_time.service'

interface IGetListRestaurantByTimeQuery {
  dayOfWeek?: number
  timeAsMinutes?: number
}

export class GetListRestaurantByTime extends CustomController<IRestaurantTime[]> {
  private restaurantTimeService: RestaurantTimeService

  public constructor(req: Request, res: Response) {
    super(req, res)
    this.restaurantTimeService = new RestaurantTimeService(this.logContext)
  }

  protected async doRequest(
    req: Request<unknown, unknown, unknown, IGetListRestaurantByTimeQuery>,
  ): Promise<IApiResult> {
    try {
      await validationSchema.validateAsync(req.query)
      const { dayOfWeek, timeAsMinutes } = req.query

      const result = await this.restaurantTimeService.getRestaurantsByTime(Number(dayOfWeek), Number(timeAsMinutes))

      return this.success(result, 'Successfully got restaurants')
    } catch (err) {
      if (err instanceof CustomError) {
        return this.badRequest(err)
      }
      return this.internalServerError(err)
    }
  }

  protected getTxType(): string {
    return ETransactional.GetListRestaurantByTime
  }
}

const validationSchema = Joi.object({
  dayOfWeek: Joi.number().required().min(1).max(7),
  timeAsMinutes: Joi.number().required().min(0).max(1439),
})
