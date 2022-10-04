/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { ValidationError } from 'joi'
import { CustomError } from '~/core/base.errors'
import { IApiResult } from '~/core/types'
import { RestaurantMenuService } from '~/modules/restaurant/restaurant_menu.service'
import { SearchRestaurantMenu } from './search_restaurant_menu.controller'

describe('SearchRestaurantMenu', () => {
  const searchTerm = 'seafood'

  let controller: SearchRestaurantMenu
  let req: Partial<Request>
  let res: Partial<Response<IApiResult>>

  let restaurantMenuServiceSpy: jest.SpyInstance
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
      query: { searchTerm },
    }
    res = {
      status: jest.fn(),
      json: jest.fn(),
    }
    restaurantMenuServiceSpy = jest.spyOn(RestaurantMenuService.prototype, 'searchRestaurantsAndMenusByName')
    successSpy = jest.spyOn(SearchRestaurantMenu.prototype as any, 'success')
    badRequestSpy = jest.spyOn(SearchRestaurantMenu.prototype as any, 'badRequest')
    internalServerErrorSpy = jest.spyOn(SearchRestaurantMenu.prototype as any, 'internalServerError')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('search restaurant and menu names', () => {
    test('should call the success method with the correct input', async () => {
      const result = [{ searchResult: 'myrestaurant', score: 5 }]
      restaurantMenuServiceSpy.mockResolvedValue(result)

      controller = new SearchRestaurantMenu(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantMenuServiceSpy).toBeCalledWith(searchTerm)
      expect(successSpy).toBeCalledWith(result, 'Success')
      expect(badRequestSpy).not.toBeCalled()
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle ValidationError thrown by Joi with the incorrect input', async () => {
      req.query = { ...req.query, noSuchProp: 'hello' }

      controller = new SearchRestaurantMenu(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantMenuServiceSpy).not.toBeCalled()
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).toBeCalledWith(expect.any(ValidationError))
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle CustomError thrown by RestaurantMenuService', async () => {
      const error = { bad: 'error' }
      restaurantMenuServiceSpy.mockImplementationOnce(() => {
        throw new CustomError(error.bad)
      })

      controller = new SearchRestaurantMenu(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantMenuServiceSpy).toBeCalledWith(searchTerm)
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).not.toBeCalledWith(error)
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle unknown error thrown by RestaurantMenuService', async () => {
      const error = { bad: 'error' }
      restaurantMenuServiceSpy.mockRejectedValueOnce(error)

      controller = new SearchRestaurantMenu(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantMenuServiceSpy).toBeCalledWith(searchTerm)
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).not.toBeCalled()
      expect(internalServerErrorSpy).toBeCalledWith(error)
    })
  })
})
