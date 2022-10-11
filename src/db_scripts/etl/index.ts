import fs from 'fs'
import { join } from 'path'
import restaurantJson from './input/restaurant_with_menu.json'
import userJson from './input/users_with_purchase_history.json'
import { IMenu, IRestaurant, IRestaurantRaw } from './restaurant.types'
import { IUserRaw } from './user.types'
import { transformMenu, transformRestaurants, transformRestaurantTime } from './utils/restaurant.util'
import { transformPurchaseHistory, transformUser } from './utils/user.util'

const OUTPUT_PATH = join(__dirname, 'output')

const appendId = <T>(data: T[]): Record<string, T> => {
  return data.reduce((obj, item, index) => ({ ...obj, [index + 1]: item }), {} as Record<string, T>)
}

const parseRestaurants = (data: Record<string, IRestaurantRaw>): ReturnType<typeof transformRestaurants> => {
  console.log('Extracting and transforming restaurants')
  const transformed = transformRestaurants(data)
  const arr = Object.values(transformed).map((i) => i)
  const json = JSON.stringify(arr, null, 2)
  fs.writeFileSync(join(OUTPUT_PATH, 'restaurant.json'), json, 'utf-8')
  console.log('Completed restaurants')
  return transformed
}

const parseRestaurantTime = (data: Record<string, IRestaurantRaw>): ReturnType<typeof transformRestaurantTime> => {
  console.log('Extracting and transforming restaurant time')
  const transformed = transformRestaurantTime(data)
  const arr = Object.values(transformed).map((i) => i)
  const json = JSON.stringify(arr, null, 2)
  fs.writeFileSync(join(OUTPUT_PATH, 'restaurant_time.json'), json, 'utf-8')
  console.log('Completed restaurant time')
  return transformed
}

const parseMenus = (data: Record<string, IRestaurantRaw>): ReturnType<typeof transformMenu> => {
  console.log('Extracting and transforming menus')
  const transformed = transformMenu(data)
  const arr = Object.values(transformed).map((i) => i)
  const json = JSON.stringify(arr, null, 2)
  fs.writeFileSync(join(OUTPUT_PATH, 'menu.json'), json, 'utf-8')
  console.log('Completed menus')
  return transformed
}

const parseUsers = (data: Record<string, IUserRaw>): ReturnType<typeof transformUser> => {
  console.log('Extracting and transforming users')
  const transformed = transformUser(data)
  const arr = Object.values(transformed).map((i) => i)
  const json = JSON.stringify(arr, null, 2)
  fs.writeFileSync(join(OUTPUT_PATH, 'user.json'), json, 'utf-8')
  console.log('Completed users')
  return transformed
}

const parsePurchaseHistory = (
  users: Record<string, IUserRaw>,
  restaurants: Record<string, IRestaurant>,
  menus: Record<string, IMenu>,
): ReturnType<typeof transformPurchaseHistory> => {
  console.log('Extracting and transforming purchase history')
  const transformed = transformPurchaseHistory(users, restaurants, menus)
  const arr = Object.values(transformed).map((i) => i)
  const json = JSON.stringify(arr, null, 2)
  fs.writeFileSync(join(OUTPUT_PATH, 'purchase_history.json'), json, 'utf-8')
  console.log('Completed purchase history')
  return transformed
}

const main = async (): Promise<void> => {
  const restaurantData: IRestaurantRaw[] = restaurantJson
  const restaurantDataObj = appendId(restaurantData)

  const userData: IUserRaw[] = userJson
  const userDataObj = appendId(userData)

  const restaurants = parseRestaurants(restaurantDataObj)
  parseRestaurantTime(restaurantDataObj)
  const menus = parseMenus(restaurantDataObj)
  parseUsers(userDataObj)
  parsePurchaseHistory(userDataObj, restaurants, menus)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
