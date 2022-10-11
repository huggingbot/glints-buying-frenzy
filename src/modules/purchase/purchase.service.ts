import { CustomError } from '~/src/core/base.errors'
import { BaseService } from '~/src/core/base.service'
import { ILogContext } from '~/src/core/types'
import { PurchaseDb } from './purchase.db'
import { IPurchase } from './purchase.types'

export class PurchaseService extends BaseService {
  private purchaseDb: PurchaseDb

  public constructor(logContext: ILogContext) {
    super(logContext)
    this.name = 'PurchaseService'
    this.purchaseDb = new PurchaseDb(logContext)
  }

  public async purchaseDish(
    userId: number,
    menuId: number,
    transactionAmount: number,
    transactionDate: Date,
  ): Promise<IPurchase[]> {
    try {
      const result = await this.purchaseDb.purchaseDish(userId, menuId, transactionAmount, transactionDate)
      return result.map(({ purchaseHistoryId }) => ({ purchaseHistoryId }))
    } catch (err) {
      throw new CustomError(this.name)
    }
  }
}
