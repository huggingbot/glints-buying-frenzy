import { BaseDb } from '~/src/core/base.db'
import { ILogContext } from '~/src/core/types'
import { database } from '~/src/db_scripts'
import {
  IPurchaseHistoryModelAttrs,
  PurchaseHistoryModelStatic,
  purchaseHistoryModelStatic,
} from '~/src/models/PurchaseHistoryModel'
import { IMenuModelAttrs } from '~/src/models/MenuModel'

export class PurchaseDb extends BaseDb<PurchaseHistoryModelStatic, IPurchaseHistoryModelAttrs> {
  public constructor(logContext: ILogContext) {
    super(logContext, purchaseHistoryModelStatic)
  }

  public async purchaseDish(
    userId: number,
    menuId: number,
    transactionAmount: number,
    transactionDate: Date,
  ): Promise<IPurchaseHistoryModelAttrs[]> {
    const menuModelStatic = purchaseHistoryModelStatic.assoc.menuIdMenuModel()

    const results = await database.transaction(async (transaction) => {
      const model = await menuModelStatic.findOne({ where: { menuId } })
      const menu = model?.toJSON() as IMenuModelAttrs | null
      if (!menu) throw new Error('Failed to create purchase history record')

      const purchaseHistory = {
        userId,
        menuId: menu.menuId,
        transactionAmount,
        transactionDate,
      } as IPurchaseHistoryModelAttrs

      return await this.staticModel.bulkCreate([{ ...purchaseHistory }], { transaction })
    })
    return results as IPurchaseHistoryModelAttrs[]
  }
}
