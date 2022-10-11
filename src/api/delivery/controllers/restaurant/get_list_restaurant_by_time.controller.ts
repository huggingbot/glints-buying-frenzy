import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import Joi, { ValidationError } from 'joi'
import j2s from 'joi-to-swagger'
import { OpenAPIV3 } from 'openapi-types'
import { EContentType } from '~/src/constants'
import { ETransactional } from '~/src/core/audit.logging'
import { customApiErrorResponseSchema, customApiResponseSchema, CustomController } from '~/src/core/base.controller'
import { CustomError } from '~/src/core/base.errors'
import { IApiResult } from '~/src/core/types'
import { IRestaurantTime } from '~/src/modules/restaurant/restaurant.types'
import { RestaurantTimeService } from '~/src/modules/restaurant/restaurant_time.service'

interface IGetListRestaurantByTimeQuery {
  timestamp?: number
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
      const { timestamp } = req.query

      const result = await this.restaurantTimeService.getRestaurantsByTime(Number(timestamp))

      return this.success(result, 'Successfully got restaurants')
    } catch (err) {
      if (err instanceof CustomError || err instanceof ValidationError) {
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
  timestamp: Joi.number().required(),
})

export const swGetListRestaurantByTime: OpenAPIV3.OperationObject = {
  summary: 'Get restaurants by time',
  description: 'List all restaurants that are open at a certain datetime.',
  tags: ['restaurant'],
  parameters: [
    {
      name: 'timestamp',
      in: 'query',
      description: 'Timestamp in milliseconds',
      required: true,
      schema: {
        type: 'number',
      },
    },
  ],
  responses: {
    [HttpStatus.OK]: {
      description: 'Successfully got restaurants',
      content: {
        [EContentType.Json]: {
          schema: j2s(
            customApiResponseSchema(
              Joi.object({
                restaurantName: Joi.string().required(),
                dayOfWeek: Joi.number().required().min(1).max(7),
                openingHour: Joi.number().required().min(0).max(1439),
                closingHour: Joi.number().required().min(0).max(1439),
              }).required(),
            ),
          ).swagger,
        },
      },
    },
    [HttpStatus.BAD_REQUEST]: {
      description: 'Bad Request. Validation Error.',
      content: {
        [EContentType.Json]: {
          schema: j2s(customApiErrorResponseSchema()).swagger,
        },
      },
    },
    [HttpStatus.INTERNAL_SERVER_ERROR]: {
      description: 'Internal Server Error',
      content: {
        [EContentType.Json]: {
          schema: j2s(customApiErrorResponseSchema()).swagger,
        },
      },
    },
  },
}
