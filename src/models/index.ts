import { menuModelInit } from './MenuModel'
import { purchaseHistoryModelInit } from './PurchaseHistoryModel'
import { restaurantModelInit } from './RestaurantModel'
import { restaurantMenuModelInit } from './RestaurantMenuModel'
import { restaurantTimeModelInit } from './RestaurantTimeModel'
import { userModelInit } from './UserModel'
export const modelsInit = (): void => {
  menuModelInit()
  purchaseHistoryModelInit()
  restaurantModelInit()
  restaurantMenuModelInit()
  restaurantTimeModelInit()
  userModelInit()
}
