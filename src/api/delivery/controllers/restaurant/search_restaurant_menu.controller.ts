import { Request, Response } from 'express'
import Joi from 'joi'
import { ETransactional } from '~/core/audit.logging'
import { CustomController } from '~/core/base.controller'
import { CustomError } from '~/core/base.errors'
import { IApiResult } from '~/core/types'
import { IRestaurantMenuSearch } from '~/modules/restaurant/restaurant.types'
import { RestaurantMenuService } from '~/modules/restaurant/restaurant_menu.service'

interface ISearchRestaurantMenuControllerQuery {
  searchTerm?: string
}

export class SearchRestaurantMenuController extends CustomController<IRestaurantMenuSearch[]> {
  private restaurantMenuService: RestaurantMenuService

  public constructor(req: Request, res: Response) {
    super(req, res)
    this.restaurantMenuService = new RestaurantMenuService(this.logContext)
  }

  protected async doRequest(
    req: Request<unknown, unknown, unknown, ISearchRestaurantMenuControllerQuery>,
  ): Promise<IApiResult> {
    try {
      await validationSchema.validateAsync(req.query)
      const { searchTerm } = req.query

      const result = await this.restaurantMenuService.searchRestaurantsAndMenusByName(searchTerm)

      return this.success(result, 'Success')
    } catch (err) {
      if (err instanceof CustomError) {
        return this.badRequest(err)
      }
      return this.internalServerError(err)
    }
  }

  protected getTxType(): string {
    return ETransactional.SearchRestaurantMenu
  }
}

const validationSchema = Joi.object({
  searchTerm: Joi.string().required(),
})
