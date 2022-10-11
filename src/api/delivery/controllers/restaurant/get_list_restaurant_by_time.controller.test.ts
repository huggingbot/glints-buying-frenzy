/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { ValidationError } from 'joi'
import moment from 'moment'
import { CustomError } from '~/src/core/base.errors'
import { IApiResult } from '~/src/core/types'
import { RestaurantTimeService } from '~/src/modules/restaurant/restaurant_time.service'
import { GetListRestaurantByTime } from './get_list_restaurant_by_time.controller'

describe('GetListRestaurantByTime', () => {
  const dayOfWeek = 1
  const openingHour = 100
  const closingHour = 1000
  const timestamp = moment('Sat Jan 01 2022 08:00:00 GMT+0800 (Singapore Standard Time)').valueOf()

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
      query: { timestamp: String(timestamp) },
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

      expect(restaurantTimeServiceSpy).toBeCalledWith(timestamp)
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

      expect(restaurantTimeServiceSpy).toBeCalledWith(timestamp)
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).not.toBeCalledWith(error)
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle unknown error thrown by restaurantTimeService', async () => {
      const error = { bad: 'error' }
      restaurantTimeServiceSpy.mockRejectedValueOnce(error)

      controller = new GetListRestaurantByTime(req as Request, res as Response)
      await controller.handleRequest()

      expect(restaurantTimeServiceSpy).toBeCalledWith(timestamp)
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).not.toBeCalled()
      expect(internalServerErrorSpy).toBeCalledWith(error)
    })
  })
})
