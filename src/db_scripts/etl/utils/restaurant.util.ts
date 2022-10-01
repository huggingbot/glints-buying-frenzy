import moment from 'moment'
import { IMenu, IRestaurant, IRestaurantHour, IRestaurantMenu, IRestaurantRaw } from '../restaurant.types'

export const transformRestaurants = (data: Record<string, IRestaurantRaw>): Record<string, IRestaurant> => {
  return Object.entries(data).reduce((obj, [id, { restaurantName, cashBalance }]) => {
    return {
      ...obj,
      [id]: { restaurantId: Number(id), restaurantName: restaurantName.trim().toLowerCase(), cashBalance },
    }
  }, {} as Record<string, IRestaurant>)
}

export const transformRestaurantHours = (data: Record<string, IRestaurantRaw>): Record<string, IRestaurantHour> => {
  const dayOfWeek = { Mon: 1, Tues: 2, Wed: 3, Weds: 3, Thu: 4, Thurs: 4, Fri: 5, Sat: 6, Sun: 7 }
  const toMinutes = (time: string): number => moment.duration(moment(time, ['h:mm A']).format('HH:mm')).asMinutes()

  const restaurantHour: Record<string, IRestaurantHour> = {}
  let restaurantHourId = 1

  Object.entries(data).forEach(([restaurantId, { openingHours }]) => {
    openingHours.split('/').forEach((date) => {
      const days = [...date.matchAll(/[A-Z][a-z]+/g)].map((i) => i[0])
      const timeRange = [...date.matchAll(/\d+(:\d+)?\s*(am|pm)?/g)].map((i) => i[0])

      days.forEach((day) => {
        const openingHour = toMinutes(timeRange[0])
        const closingHour = toMinutes(timeRange[1])

        restaurantHour[restaurantHourId] = {
          restaurantHourId,
          restaurantId: Number(restaurantId),
          dayOfWeek: dayOfWeek[day],
          openingHour,
          closingHour,
        }
        restaurantHourId++
      })
    })
  })
  return restaurantHour
}

export const transformMenu = (data: IRestaurantRaw[]): Record<string, IMenu> => {
  const dishes = new Set<string>()
  const menu: Record<string, IMenu> = {}
  let menuId = 1

  data.forEach((restaurant) => {
    restaurant.menu.forEach(({ dishName }) => {
      const dish = dishName.trim().toLowerCase()

      if (dishes.has(dish)) return
      dishes.add(dish)

      menu[menuId] = { menuId, dishName: dish }
      menuId++
    })
  })
  return menu
}

export const transformRestaurantMenu = (
  restaurants: Record<string, IRestaurantRaw>,
  menus: Record<string, IMenu>,
): Record<string, IRestaurantMenu> => {
  let restaurantMenuId = 1
  const restaurantMenu: Record<string, IRestaurantMenu> = {}

  Object.entries(restaurants).forEach(([restaurantId, restaurant]) => {
    restaurant.menu.forEach(({ dishName, price }) => {
      const menuItem = Object.values(menus).filter((m) => m.dishName === dishName.trim().toLowerCase())

      if (menuItem.length) {
        restaurantMenu[restaurantMenuId] = {
          restaurantMenuId,
          restaurantId: Number(restaurantId),
          menuId: menuItem[0].menuId,
          price,
        }
        restaurantMenuId += 1
      }
    })
  })
  return restaurantMenu
}
