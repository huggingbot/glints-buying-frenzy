import { Request, Response } from 'express'
import Joi from 'joi'
import { ETransactional } from '~/core/audit.logging'
import { CustomController } from '~/core/base.controller'
import { CustomError } from '~/core/base.errors'
import { IApiResult } from '~/core/types'
import { PurchaseService } from '~/modules/purchase/purchase.service'
import { IPurchase, IPurchaseRequestBody } from '~/modules/purchase/purchase.types'

export class CreatePurchaseController extends CustomController<IPurchase[]> {
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
        userId,
        restaurantId,
        menuId,
        transactionAmount,
        transactionDate,
      )

      return this.success(result, 'Successfully created purchase history record')
    } catch (err) {
      if (err instanceof CustomError) {
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
  userId: Joi.number().required(),
  restaurantId: Joi.number().required(),
  menuId: Joi.number().required(),
  transactionAmount: Joi.number().required(),
  transactionDate: Joi.date().required(),
})
