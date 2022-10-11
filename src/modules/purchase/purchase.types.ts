export interface IPurchaseRequestBody {
  userId: number
  menuId: number
  transactionAmount: number
  transactionDate: Date
}

export interface IPurchase {
  purchaseHistoryId: number
}
