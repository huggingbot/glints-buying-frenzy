import express from 'express'
import { OpenAPIV3 } from 'openapi-types'
import { Swagger } from '~/src/swagger'
import { CreatePurchase, swCreatePurchase } from '../controllers/purchase/create_purchase.controller'

export const purchaseRouter = express.Router()
const baseRoute = '/purchases'

// TODO: Authenticate user
const createPurchaseMethod = OpenAPIV3.HttpMethods.POST
const createPurchaseRoute = `${baseRoute}`
Swagger.register(createPurchaseRoute, createPurchaseMethod, swCreatePurchase)
purchaseRouter[createPurchaseMethod](createPurchaseRoute, (req, res) => {
  void new CreatePurchase(req, res).handleRequest()
})
