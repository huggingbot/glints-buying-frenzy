/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { ValidationError } from 'joi'
import { CustomError } from '~/src/core/base.errors'
import { IApiResult } from '~/src/core/types'
import { PurchaseService } from '~/src/modules/purchase/purchase.service'
import { CreatePurchase } from './create_purchase.controller'

describe('CreatePurchase', () => {
  jest.useFakeTimers().setSystemTime(new Date('2022-01-01'))

  const userId = 1
  const menuId = 1
  const transactionAmount = 10
  const transactionDate = 'Sat Jan 01 2022 08:00:00 GMT+0800 (Singapore Standard Time)'

  let controller: CreatePurchase
  let req: Partial<Request>
  let res: Partial<Response<IApiResult>>

  let purchaseServiceSpy: jest.SpyInstance
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
      body: {
        userId: String(userId),
        menuId: String(menuId),
        transactionAmount: String(transactionAmount),
        transactionDate: String(transactionDate),
      },
    }
    res = {
      status: jest.fn(),
      json: jest.fn(),
    }
    purchaseServiceSpy = jest.spyOn(PurchaseService.prototype, 'purchaseDish')
    successSpy = jest.spyOn(CreatePurchase.prototype as any, 'success')
    badRequestSpy = jest.spyOn(CreatePurchase.prototype as any, 'badRequest')
    internalServerErrorSpy = jest.spyOn(CreatePurchase.prototype as any, 'internalServerError')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('create purchase', () => {
    test('should call the success method with the correct input', async () => {
      const result = [{ purchaseHistoryId: 1 }]
      purchaseServiceSpy.mockResolvedValue(result)

      controller = new CreatePurchase(req as Request, res as Response)
      await controller.handleRequest()

      expect(purchaseServiceSpy).toBeCalledWith(userId, menuId, transactionAmount, transactionDate)
      expect(successSpy).toBeCalledWith(result, 'Successfully created purchase history record')
      expect(badRequestSpy).not.toBeCalled()
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle ValidationError thrown by Joi with the incorrect input', async () => {
      req.body = { ...req.body, transactionAmount: 'hello' }

      controller = new CreatePurchase(req as Request, res as Response)
      await controller.handleRequest()

      expect(purchaseServiceSpy).not.toBeCalled()
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).toBeCalledWith(expect.any(ValidationError))
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle CustomError thrown by PurchaseService', async () => {
      const error = { bad: 'error' }
      purchaseServiceSpy.mockImplementationOnce(() => {
        throw new CustomError(error.bad)
      })

      controller = new CreatePurchase(req as Request, res as Response)
      await controller.handleRequest()

      expect(purchaseServiceSpy).toBeCalledWith(userId, menuId, transactionAmount, transactionDate)
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).not.toBeCalledWith(error)
      expect(internalServerErrorSpy).not.toBeCalled()
    })

    test('should handle unknown error thrown by PurchaseService', async () => {
      const error = { bad: 'error' }
      purchaseServiceSpy.mockRejectedValueOnce(error)

      controller = new CreatePurchase(req as Request, res as Response)
      await controller.handleRequest()

      expect(purchaseServiceSpy).toBeCalledWith(userId, menuId, transactionAmount, transactionDate)
      expect(successSpy).not.toBeCalled()
      expect(badRequestSpy).not.toBeCalled()
      expect(internalServerErrorSpy).toBeCalledWith(error)
    })
  })
})
