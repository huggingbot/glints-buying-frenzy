/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { ValidationError } from 'joi'
import { CustomError } from '~/core/base.errors'
import { IApiResult } from '~/core/types'
import { RestaurantTimeService } from '~/modules/restaurant/restaurant_time.service'
import { GetListRestaurantByTime } from './get_list_restaurant_by_time.controller'

describe('GetListRestaurantByTime', () => {
  const dayOfWeek = 1
  const timeAsMinutes = 1000
  const openingHour = 100
  const closingHour = 1000

  let controller: GetListRestaurantByTime
  let req: Partial<Request>
  let res: Partial<Response<IApiResult>>

  let restaurantTimeServiceSpy: jest.SpyInstance
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
      query: { dayOfWeek: String(dayOfWeek), timeAsMinutes: String(timeAsMinutes) },
    }
    res = {
      status: jest.fn(),
      json: jest.fn(),
    }
    restaurantTimeServiceSpy = jest.spyOn(RestaurantTimeService.prototype, 'getRestaurantsByTime')
    successSpy = jest.spyOn(GetListRestaurantByTime.prototype as any, 'success')
    badRequestSpy = jest.spyOn(GetListRestaurantByTime.prototype as any, 'badRequest')
    internalServerErrorSpy = jest.spyOn(GetListRestaurantByTime.prototype as any, 'internalServerError')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('retrieve restaurants by time', () => {
    test('should call the success method with the correct input', async () => {
      const result = [{ restaurantName: 'myrestaurant', dayOfWeek, openingHour, closingHour }]
      restaurantTimeServiceSpy.mockResolvedValue(result)

      controller = new GetListRestaurantByTime(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantTimeServiceSpy).toBeCalledWith(dayOfWeek, timeAsMinutes)
      expect(successSpy).toBeCalledWith(result, 'Successfully got restaurants')
      expect(badRequestSpy).not.toBeCalled()
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle ValidationError thrown by Joi with the incorrect input', async () => {
      req.query = { ...req.query, dayOfWeek: '8' }

      controller = new GetListRestaurantByTime(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantTimeServiceSpy).not.toBeCalled()
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).toBeCalledWith(expect.any(ValidationError))
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle CustomError thrown by restaurantTimeService', async () => {
      const error = { bad: 'error' }
      restaurantTimeServiceSpy.mockImplementationOnce(() => {
        throw new CustomError(error.bad)
      })

      controller = new GetListRestaurantByTime(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantTimeServiceSpy).toBeCalledWith(dayOfWeek, timeAsMinutes)
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).not.toBeCalledWith(error)
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle unknown error thrown by restaurantTimeService', async () => {
      const error = { bad: 'error' }
      restaurantTimeServiceSpy.mockRejectedValueOnce(error)

      controller = new GetListRestaurantByTime(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantTimeServiceSpy).toBeCalledWith(dayOfWeek, timeAsMinutes)
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).not.toBeCalled()
      expect(internalServerErrorSpy).toBeCalledWith(error)
    })
  })
})
