interface IMenuRaw {
  dishName: string
  price: number
}

export interface IRestaurantRaw {
  restaurantName: string
  cashBalance: number
  openingHours: string
  menu: IMenuRaw[]
}

export interface IRestaurant {
  restaurantId: number
  restaurantName: string
  cashBalance: number
}

export interface IRestaurantTime {
  restaurantTimeId: number
  restaurantId: number
  dayOfWeek: number
  openingHour: number
  closingHour: number
}

export interface IMenu {
  menuId: number
  restaurantId: number
  dishName: string
  price: number
}
