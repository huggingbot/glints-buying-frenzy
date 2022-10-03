import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import Joi, { ValidationError } from 'joi'
import j2s from 'joi-to-swagger'
import { OpenAPIV3 } from 'openapi-types'
import { EContentType } from '~/constants'
import { ETransactional } from '~/core/audit.logging'
import { customApiErrorResponseSchema, customApiResponseSchema, CustomController } from '~/core/base.controller'
import { CustomError } from '~/core/base.errors'
import { IApiResult } from '~/core/types'
import { IRestaurantMenuSearch } from '~/modules/restaurant/restaurant.types'
import { RestaurantMenuService } from '~/modules/restaurant/restaurant_menu.service'

interface ISearchRestaurantMenuControllerQuery {
  searchTerm?: string
}

export class SearchRestaurantMenu extends CustomController<IRestaurantMenuSearch[]> {
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
      if (err instanceof CustomError || err instanceof ValidationError) {
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

export const swSearchRestaurantMenu: OpenAPIV3.OperationObject = {
  summary: 'Search restaurant and menu names',
  description: 'Search for restaurants or dishes by name, ranked by relevance to search term.',
  tags: ['restaurant'],
  parameters: [
    {
      name: 'searchTerm',
      in: 'query',
      description: 'Search term',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
  responses: {
    [HttpStatus.OK]: {
      description: 'Successfully got restaurants',
      content: {
        [EContentType.JSON]: {
          schema: j2s(
            customApiResponseSchema(
              Joi.object({
                searchResult: Joi.string().required(),
                score: Joi.number().required(),
              }).required(),
            ),
          ).swagger,
        },
      },
    },
    [HttpStatus.BAD_REQUEST]: {
      description: 'Bad Request. Validation Error.',
      content: {
        [EContentType.JSON]: {
          schema: j2s(customApiErrorResponseSchema()).swagger,
        },
      },
    },
    [HttpStatus.INTERNAL_SERVER_ERROR]: {
      description: 'Internal Server Error',
      content: {
        [EContentType.JSON]: {
          schema: j2s(customApiErrorResponseSchema()).swagger,
        },
      },
    },
  },
}
