export interface IRestaurantTime {
  restaurantName: string
  dayOfWeek: number
  openingHour: number
  closingHour: number
}

export interface IRestaurantName {
  restaurantName: string
}

export interface IRestaurantMenuSearch {
  searchResult: string
  score: number
}
