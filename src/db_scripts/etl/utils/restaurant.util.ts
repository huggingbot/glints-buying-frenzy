import moment from 'moment'
import { IMenu, IRestaurant, IRestaurantRaw, IRestaurantTime } from '../restaurant.types'

export const transformRestaurants = (data: Record<string, IRestaurantRaw>): Record<string, IRestaurant> => {
  return Object.entries(data).reduce((obj, [id, { restaurantName, cashBalance }]) => {
    return {
      ...obj,
      [id]: { restaurantId: Number(id), restaurantName: restaurantName.trim().toLowerCase(), cashBalance },
    }
  }, {} as Record<string, IRestaurant>)
}

export const transformRestaurantTime = (data: Record<string, IRestaurantRaw>): Record<string, IRestaurantTime> => {
  const dayOfWeek = { Mon: 1, Tues: 2, Wed: 3, Weds: 3, Thu: 4, Thurs: 4, Fri: 5, Sat: 6, Sun: 7 }
  const toMinutes = (time: string): number => moment.duration(moment(time, ['h:mm A']).format('HH:mm')).asMinutes()

  const restaurantTime: Record<string, IRestaurantTime> = {}
  let restaurantTimeId = 1

  Object.entries(data).forEach(([restaurantId, { openingHours }]) => {
    openingHours.split('/').forEach((date) => {
      const days = [...date.matchAll(/[A-Z][a-z]+/g)].map((i) => i[0])
      const timeRange = [...date.matchAll(/\d+(:\d+)?\s*(am|pm)?/g)].map((i) => i[0])

      days.forEach((day) => {
        const openingHour = toMinutes(timeRange[0])
        const closingHour = toMinutes(timeRange[1])

        restaurantTime[restaurantTimeId] = {
          restaurantTimeId,
          restaurantId: Number(restaurantId),
          dayOfWeek: dayOfWeek[day],
          openingHour,
          closingHour,
        }
        restaurantTimeId++
      })
    })
  })
  return restaurantTime
}

export const transformMenu = (data: Record<string, IRestaurantRaw>): Record<string, IMenu> => {
  const dishes = new Set<string>()
  const menu: Record<string, IMenu> = {}
  let menuId = 1

  Object.entries(data).forEach(([restaurantId, restaurant]) => {
    restaurant.menu.forEach(({ dishName, price }) => {
      const dish = dishName.trim().toLowerCase()

      if (dishes.has(dish)) return
      dishes.add(dish)

      menu[menuId] = {
        menuId,
        restaurantId: Number(restaurantId),
        dishName: dish,
        price: Number(price),
      }
      menuId++
    })
  })
  return menu
}
