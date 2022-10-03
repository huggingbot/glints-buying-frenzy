import { BaseDb } from '~/core/base.db'
import { ILogContext } from '~/core/types'
import { database } from '~/db_scripts'
import {
  IPurchaseHistoryModelAttrs,
  PurchaseHistoryModelStatic,
  purchaseHistoryModelStatic,
} from '~/models/PurchaseHistoryModel'
import { IRestaurantMenuModelAttrs } from '~/models/RestaurantMenuModel'

export class PurchaseDb extends BaseDb<PurchaseHistoryModelStatic, IPurchaseHistoryModelAttrs> {
  public constructor(logContext: ILogContext) {
    super(logContext, purchaseHistoryModelStatic)
  }

  public async purchaseDish(
    userId: number,
    restaurantId: number,
    menuId: number,
    transactionAmount: number,
    transactionDate: Date,
  ): Promise<IPurchaseHistoryModelAttrs[]> {
    const restaurantMenuModelStatic = purchaseHistoryModelStatic.assoc.restaurantMenuIdRestaurantMenuModel()

    const results = await database.transaction(async (transaction) => {
      const model = await restaurantMenuModelStatic.findOne({ where: { restaurantId, menuId } })
      const restaurantMenu = model?.toJSON() as IRestaurantMenuModelAttrs | null
      if (!restaurantMenu) throw new Error('Failed to create purchase history record')

      const purchaseHistory = {
        userId,
        restaurantMenuId: restaurantMenu.restaurantMenuId,
        transactionAmount,
        transactionDate,
      } as IPurchaseHistoryModelAttrs

      return await this.staticModel.bulkCreate([{ ...purchaseHistory }], { transaction })
    })
    return results as IPurchaseHistoryModelAttrs[]
  }
}
