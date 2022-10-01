import moment from 'moment'
import { IMenu, IRestaurant, IRestaurantMenu } from '../restaurant.types'
import { IPurchaseHistory, IUser, IUserRaw } from '../user.types'

export const transformUser = (data: Record<string, IUserRaw>): Record<string, IUser> => {
  return Object.entries(data).reduce((obj, [id, { name, cashBalance }]) => {
    return { ...obj, [id]: { userId: Number(id), name: name.trim().toLowerCase(), cashBalance } }
  }, {} as Record<string, IUser>)
}

export const transformPurchaseHistory = (
  users: Record<string, IUserRaw>,
  restaurants: Record<string, IRestaurant>,
  menus: Record<string, IMenu>,
  restaurantMenus: Record<string, IRestaurantMenu>,
): Record<string, IPurchaseHistory> => {
  let purchaseHistoryId = 1
  const purchaseHistory: Record<string, IPurchaseHistory> = {}

  Object.entries(users).forEach(([userId, user]) => {
    user.purchaseHistory.forEach(({ dishName, restaurantName, transactionDate, transactionAmount }) => {
      const restaurantItem = Object.values(restaurants).filter(
        (r) => r.restaurantName === restaurantName.trim().toLowerCase(),
      )
      const menuItem = Object.values(menus).filter((m) => m.dishName === dishName.trim().toLowerCase())

      if (restaurantItem.length && menuItem.length) {
        const restaurantMenuItem = Object.values(restaurantMenus).filter(
          (rm) => rm.menuId === menuItem[0].menuId && rm.restaurantId === restaurantItem[0].restaurantId,
        )

        if (restaurantMenuItem.length) {
          purchaseHistory[purchaseHistoryId] = {
            purchaseHistoryId,
            restaurantMenuId: restaurantMenuItem[0].restaurantMenuId,
            userId: Number(userId),
            transactionAmount,
            transactionDate: moment(transactionDate).format('YYYY-MM-DD HH:mm:ss'),
          }
          purchaseHistoryId += 1
        }
      }
    })
  })
  return purchaseHistory
}
