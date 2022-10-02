import express from 'express'
import { GetListRestaurantController } from '../controllers/restaurant/get_list_restaurant.controller'

export const restaurantRouter = express.Router()
const baseRoute = '/restaurants'

restaurantRouter.get(`${baseRoute}`, (req, res) => {
  void new GetListRestaurantController(req, res).handleRequest()
})
