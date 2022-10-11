import { BaseDb } from '~/src/core/base.db'
import { ILogContext } from '~/src/core/types'
import { database } from '~/src/db_scripts'
import { IMenuModelAttrs } from '~/src/models/MenuModel'
import {
  IPurchaseHistoryModelAttrs,
  PurchaseHistoryModelStatic,
  purchaseHistoryModelStatic,
} from '~/src/models/PurchaseHistoryModel'
import { IUserModelAttrs } from '~/src/models/UserModel'

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
    const userModelStatic = purchaseHistoryModelStatic.assoc.userIdUserModel()
    const menuModelStatic = purchaseHistoryModelStatic.assoc.menuIdMenuModel()
    const restaurantModelStatic = menuModelStatic.assoc.restaurantIdRestaurantModel()

    const results = await database.transaction(async (transaction) => {
      const userModel = await userModelStatic.findOne({ where: { userId } })
      const user = userModel?.toJSON() as IUserModelAttrs | null
      if (!user) throw new Error(`User with userId '${userId}' not found`)

      const userNetCashBalance = user.cashBalance - transactionAmount
      if (userNetCashBalance < 0) throw new Error(`User has insufficient cash balance`)

      const menuModel = await menuModelStatic.findOne({ where: { menuId } })
      const menu = menuModel?.toJSON() as IMenuModelAttrs | null
      if (!menu) throw new Error(`Menu with menuId '${menuId}' not found`)

      userModelStatic.decrement(userModelStatic.attrs.cashBalance, {
        by: transactionAmount,
        where: { [userModelStatic.attrs.userId]: user.userId },
      })

      restaurantModelStatic.increment(restaurantModelStatic.attrs.cashBalance, {
        by: transactionAmount,
        where: { [restaurantModelStatic.attrs.restaurantId]: menuModel.restaurantId },
      })

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
