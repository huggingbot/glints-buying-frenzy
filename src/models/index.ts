import { menuModelInit } from './MenuModel'
import { purchaseHistoryModelInit } from './PurchaseHistoryModel'
import { restaurantModelInit } from './RestaurantModel'
import { restaurantHourModelInit } from './RestaurantHourModel'
import { restaurantMenuModelInit } from './RestaurantMenuModel'
import { userModelInit } from './UserModel'
export const modelsInit = (): void => {
  menuModelInit()
  purchaseHistoryModelInit()
  restaurantModelInit()
  restaurantHourModelInit()
  restaurantMenuModelInit()
  userModelInit()
}
