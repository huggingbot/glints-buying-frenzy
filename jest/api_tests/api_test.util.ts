import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { DELIVERY_API_URL } from '~/src/constants'
import { MockCookie } from './mock-cookie'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export const createMockCookie = (): MockCookie => {
  return new MockCookie()
}

export const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: DELIVERY_API_URL,
  })

  const onRequest = (request: AxiosRequestConfig): AxiosRequestConfig => {
    // Intercept request header here if necessary
    return request
  }

  instance.interceptors.request.use(onRequest)

  return instance
}
