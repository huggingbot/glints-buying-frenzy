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
import { RestaurantService } from '~/modules/restaurant/restaurant.service'
import { IRestaurantName } from '~/modules/restaurant/restaurant.types'

interface IGetListRestaurantByPriceQuery {
  minPrice?: number
  maxPrice?: number
  dishComparison?: 'greater' | 'less'
  dishCount?: number
  restaurantCount?: number
}

export class GetListRestaurantByPrice extends CustomController<IRestaurantName[]> {
  private restaurantService: RestaurantService

  public constructor(req: Request, res: Response) {
    super(req, res)
    this.restaurantService = new RestaurantService(this.logContext)
  }

  protected async doRequest(
    req: Request<unknown, unknown, unknown, IGetListRestaurantByPriceQuery>,
  ): Promise<IApiResult> {
    try {
      await validationSchema.validateAsync(req.query)
      const { minPrice, maxPrice, dishComparison, dishCount, restaurantCount } = req.query

      const result = await this.restaurantService.getRestaurantsByDishCountInPriceRange(
        Number(minPrice),
        Number(maxPrice),
        dishComparison,
        Number(dishCount),
        Number(restaurantCount),
      )

      return this.success(result, 'Successfully got restaurants')
    } catch (err) {
      if (err instanceof CustomError || err instanceof ValidationError) {
        return this.badRequest(err)
      }
      return this.internalServerError(err)
    }
  }

  protected getTxType(): string {
    return ETransactional.GetListRestaurantByPrice
  }
}

const validationSchema = Joi.object({
  minPrice: Joi.number().required().min(0),
  maxPrice: Joi.number().required().min(0),
  dishComparison: Joi.string().required().valid('greater', 'lesser'),
  dishCount: Joi.number().required().min(0),
  restaurantCount: Joi.number().required().min(0),
})

export const swGetListRestaurantByPrice: OpenAPIV3.OperationObject = {
  summary: 'Get restaurants by price',
  description:
    'List top y restaurants that have more or less than x number of dishes within a price range, ranked alphabetically. More or less (than x) is a parameter that the API allows the consumer to enter.',
  tags: ['restaurant'],
  parameters: [
    {
      name: 'minPrice',
      in: 'query',
      description: 'Minimum price',
      required: true,
      schema: {
        type: 'number',
        minimum: 0,
      },
    },
    {
      name: 'maxPrice',
      in: 'query',
      description: 'Maximum price',
      required: true,
      schema: {
        type: 'number',
        minimum: 0,
      },
    },
    {
      name: 'dishComparison',
      in: 'query',
      description: 'Operator used by a query result to compare against `dishCount`',
      required: true,
      schema: {
        type: 'string',
        enum: ['greater', 'less'],
      },
    },
    {
      name: 'dishCount',
      in: 'query',
      description: 'Number of dishes to be compared against',
      required: true,
      schema: {
        type: 'number',
        minimum: 0,
      },
    },
    {
      name: 'restaurantCount',
      in: 'query',
      description: 'Number of restaurants to list',
      required: true,
      schema: {
        type: 'number',
        minimum: 0,
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
                restaurantName: Joi.string().required(),
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
