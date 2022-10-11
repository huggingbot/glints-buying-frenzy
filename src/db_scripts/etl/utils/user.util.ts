import moment from 'moment'
import { IMenu, IRestaurant } from '../restaurant.types'
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
): Record<string, IPurchaseHistory> => {
  let purchaseHistoryId = 1
  const purchaseHistory: Record<string, IPurchaseHistory> = {}

  Object.entries(users).forEach(([userId, user]) => {
    user.purchaseHistory.forEach(({ dishName, restaurantName, transactionDate, transactionAmount }) => {
      const restaurantItem = Object.values(restaurants).filter(
        (r) => r.restaurantName === restaurantName.trim().toLowerCase(),
      )
      const restaurantId = restaurantItem[0]?.restaurantId
      const menuItem = Object.values(menus).filter(
        (m) => m.restaurantId === restaurantId && m.dishName === dishName.trim().toLowerCase(),
      )
      if (menuItem.length) {
        purchaseHistory[purchaseHistoryId] = {
          purchaseHistoryId,
          menuId: menuItem[0].menuId,
          userId: Number(userId),
          transactionAmount,
          transactionDate: moment(new Date(transactionDate)).format('YYYY-MM-DD HH:mm:ss'),
        }
        purchaseHistoryId += 1
      }
    })
  })
  return purchaseHistory
}
