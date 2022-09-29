import express from 'express'
import { TestController } from '../controllers/profile/test.controller'

export const testRouter = express.Router()
const baseRoute = '/test'

testRouter.get(`${baseRoute}/1`, (req, res) => {
  void new TestController(req, res).handleRequest()
})
