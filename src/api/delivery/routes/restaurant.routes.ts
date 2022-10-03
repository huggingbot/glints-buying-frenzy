import express from 'express'
import { GetListRestaurantByPriceController } from '../controllers/restaurant/get_list_restaurant_by_price.controller'
import { GetListRestaurantByTimeController } from '../controllers/restaurant/get_list_restaurant_by_time.controller'
import { SearchRestaurantMenuController } from '../controllers/restaurant/search_restaurant_menu.controller'

export const restaurantRouter = express.Router()
const baseRoute = '/restaurants'

restaurantRouter.get(`${baseRoute}/by-time`, (req, res) => {
  void new GetListRestaurantByTimeController(req, res).handleRequest()
})

restaurantRouter.get(`${baseRoute}/by-price`, (req, res) => {
  void new GetListRestaurantByPriceController(req, res).handleRequest()
})

restaurantRouter.get(`${baseRoute}/search`, (req, res) => {
  void new SearchRestaurantMenuController(req, res).handleRequest()
})
