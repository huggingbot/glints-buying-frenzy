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
import { PurchaseService } from '~/modules/purchase/purchase.service'
import { IPurchase, IPurchaseRequestBody } from '~/modules/purchase/purchase.types'

export class CreatePurchase extends CustomController<IPurchase[]> {
  private purchaseService: PurchaseService

  public constructor(req: Request, res: Response) {
    super(req, res)
    this.purchaseService = new PurchaseService(this.logContext)
  }

  protected async doRequest(req: Request<unknown, unknown, IPurchaseRequestBody>): Promise<IApiResult> {
    try {
      await validationSchema.validateAsync(req.body)
      const { userId, restaurantId, menuId, transactionAmount, transactionDate } = req.body

      const result = await this.purchaseService.purchaseDish(
        Number(userId),
        Number(restaurantId),
        Number(menuId),
        Number(transactionAmount),
        transactionDate,
      )

      return this.success(result, 'Successfully created purchase history record')
    } catch (err) {
      if (err instanceof CustomError || err instanceof ValidationError) {
        return this.badRequest(err)
      }
      return this.internalServerError(err)
    }
  }

  protected getTxType(): string {
    return ETransactional.CreatePurchase
  }
}

const validationSchema = Joi.object({
  userId: Joi.number().required().min(1),
  restaurantId: Joi.number().required().min(1),
  menuId: Joi.number().required().min(1),
  transactionAmount: Joi.number().required(),
  transactionDate: Joi.date().required(),
})

export const swCreatePurchase: OpenAPIV3.OperationObject = {
  summary: 'Create purchase',
  description: 'Process a user purchasing a dish from a restaurant.',
  tags: ['purchase'],
  requestBody: {
    content: {
      [EContentType.JSON]: {
        schema: j2s(validationSchema).swagger,
      },
    },
  },
  responses: {
    [HttpStatus.OK]: {
      description: 'Successfully got restaurants',
      content: {
        [EContentType.JSON]: {
          schema: j2s(
            customApiResponseSchema(
              Joi.object({
                purchaseHistoryId: Joi.number().required().min(1),
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
