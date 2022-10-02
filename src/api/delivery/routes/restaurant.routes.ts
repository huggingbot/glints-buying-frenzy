import express from 'express'
import { RestaurantController } from '../controllers/profile/restaurant.controller'

export const restaurantRouter = express.Router()
const baseRoute = '/restaurant'

restaurantRouter.get(`${baseRoute}/1`, (req, res) => {
  void new RestaurantController(req, res).handleRequest()
})
