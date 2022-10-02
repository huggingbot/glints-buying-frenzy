import express from 'express'
import { GetListRestaurantByTimeController } from '../controllers/restaurant/get_list_restaurant_by_time.controller'

export const restaurantRouter = express.Router()
const baseRoute = '/restaurants'

restaurantRouter.get(`${baseRoute}/by-price`, (req, res) => {
  void new GetListRestaurantByTimeController(req, res).handleRequest()
})
