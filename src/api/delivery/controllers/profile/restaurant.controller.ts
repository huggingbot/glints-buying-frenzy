import { Request, Response } from 'express'
import { ETransactional } from '~/core/audit.logging'
import { CustomController } from '~/core/base.controller'
import { CustomError } from '~/core/base.errors'
import { IApiResult } from '~/core/types'
import { RestaurantService } from '~/modules/restaurant/restaurant.service'

interface IRestaurantQuery {
  dayOfWeek?: number
  timeAsMinutes?: number
}

export class RestaurantController extends CustomController<unknown> {
  private restaurantService: RestaurantService

  public constructor(req: Request, res: Response) {
    super(req, res)
    this.restaurantService = new RestaurantService(this.logContext)
  }

  protected async doRequest(req: Request<unknown, unknown, unknown, IRestaurantQuery>): Promise<IApiResult> {
    try {
      const { dayOfWeek, timeAsMinutes } = req.query

      if (!dayOfWeek && !timeAsMinutes) {
        throw new CustomError('Required query strings of "dayOfWeek" and "timeAsMinutes" not found')
      }
      // TODO: Add services
      // this.restaurantService

      return this.success({ test: req.txContext.uuid }, 'testing')
    } catch (err) {
      if (err instanceof CustomError) {
        return this.badRequest(err)
      }
      return this.internalServerError(err)
    }
  }

  protected getTxType(): string {
    return ETransactional.Test
  }
}
