/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { ValidationError } from 'joi'
import { CustomError } from '~/src/core/base.errors'
import { IApiResult } from '~/src/core/types'
import { RestaurantService } from '~/src/modules/restaurant/restaurant.service'
import { GetListRestaurantByPrice } from './get_list_restaurant_by_price.controller'

describe('GetListRestaurantByPrice', () => {
  const minPrice = 5
  const maxPrice = 20
  const dishComparison = 'greater'
  const dishCount = 3
  const restaurantCount = 10

  let controller: GetListRestaurantByPrice
  let req: Partial<Request>
  let res: Partial<Response<IApiResult>>

  let restaurantServiceSpy: jest.SpyInstance
  let successSpy: jest.SpyInstance
  let badRequestSpy: jest.SpyInstance
  let internalServerErrorSpy: jest.SpyInstance

  beforeEach(() => {
    req = {
      txContext: {
        uuid: '1',
        startTime: new Date(),
        sourceIp: 'sourceIp',
      },
      query: {
        minPrice: String(minPrice),
        maxPrice: String(maxPrice),
        dishComparison: dishComparison,
        dishCount: String(dishCount),
        restaurantCount: String(restaurantCount),
      },
    }
    res = {
      status: jest.fn(),
      json: jest.fn(),
    }
    restaurantServiceSpy = jest.spyOn(RestaurantService.prototype, 'getRestaurantsByDishCountInPriceRange')
    successSpy = jest.spyOn(GetListRestaurantByPrice.prototype as any, 'success')
    badRequestSpy = jest.spyOn(GetListRestaurantByPrice.prototype as any, 'badRequest')
    internalServerErrorSpy = jest.spyOn(GetListRestaurantByPrice.prototype as any, 'internalServerError')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('retrieve restaurants by price', () => {
    test('should call the success method with the correct input', async () => {
      const result = [{ restaurantName: 'myrestaurant' }]
      restaurantServiceSpy.mockResolvedValue(result)

      controller = new GetListRestaurantByPrice(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantServiceSpy).toBeCalledWith(minPrice, maxPrice, dishComparison, dishCount, restaurantCount)
      expect(successSpy).toBeCalledWith(result, 'Successfully got restaurants')
      expect(badRequestSpy).not.toBeCalled()
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle ValidationError thrown by Joi with the incorrect input', async () => {
      req.query = { ...req.query, minPrice: '-1' }

      controller = new GetListRestaurantByPrice(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantServiceSpy).not.toBeCalled()
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).toBeCalledWith(expect.any(ValidationError))
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle CustomError thrown by restaurantService', async () => {
      const error = { bad: 'error' }
      restaurantServiceSpy.mockImplementationOnce(() => {
        throw new CustomError(error.bad)
      })

      controller = new GetListRestaurantByPrice(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantServiceSpy).toBeCalledWith(minPrice, maxPrice, dishComparison, dishCount, restaurantCount)
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).not.toBeCalledWith(error)
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle unknown error thrown by restaurantService', async () => {
      const error = { bad: 'error' }
      restaurantServiceSpy.mockRejectedValueOnce(error)

      controller = new GetListRestaurantByPrice(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantServiceSpy).toBeCalledWith(minPrice, maxPrice, dishComparison, dishCount, restaurantCount)
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).not.toBeCalled()
      expect(internalServerErrorSpy).toBeCalledWith(error)
    })
  })
})
