export enum EContentType {
  Json = 'application/json',
}

export enum EApiVersion {
  Delivery = 'v1',
}

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3010'
export const DELIVERY_API_URL = `${BASE_URL}/api/delivery/${EApiVersion.Delivery}`
