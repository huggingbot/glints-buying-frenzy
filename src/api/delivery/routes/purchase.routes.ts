import express from 'express'
import { CreatePurchaseController } from '../controllers/purchase/create_purchase.controller'

export const purchaseRouter = express.Router()
const baseRoute = '/purchases'

// TODO: Authenticate user
purchaseRouter.post(`${baseRoute}`, (req, res) => {
  void new CreatePurchaseController(req, res).handleRequest()
})
