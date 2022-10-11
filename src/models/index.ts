import { menuModelInit } from './MenuModel'
import { purchaseHistoryModelInit } from './PurchaseHistoryModel'
import { restaurantModelInit } from './RestaurantModel'
import { restaurantTimeModelInit } from './RestaurantTimeModel'
import { userModelInit } from './UserModel'
export const modelsInit = (): void => {
  menuModelInit()
  purchaseHistoryModelInit()
  restaurantModelInit()
  restaurantTimeModelInit()
  userModelInit()
}
