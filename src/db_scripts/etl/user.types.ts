interface IPurchaseHistoryRaw {
  dishName: string
  restaurantName: string
  transactionAmount: number
  transactionDate: string
}

export interface IUserRaw {
  id: number
  name: string
  cashBalance: number
  purchaseHistory: IPurchaseHistoryRaw[]
}

export interface IUser {
  userId: number
  name: string
  cashBalance: number
}

export interface IPurchaseHistory {
  purchaseHistoryId: number
  restaurantMenuId: number
  userId: number
  transactionAmount: number
  transactionDate: string
}
