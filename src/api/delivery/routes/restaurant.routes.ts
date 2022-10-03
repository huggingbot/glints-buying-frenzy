import express from 'express'
import { OpenAPIV3 } from 'openapi-types'
import { Swagger } from '~/swagger'
import {
  GetListRestaurantByPrice,
  swGetListRestaurantByPrice,
} from '../controllers/restaurant/get_list_restaurant_by_price.controller'
import { GetListRestaurantByTime } from '../controllers/restaurant/get_list_restaurant_by_time.controller'
import { SearchRestaurantMenu } from '../controllers/restaurant/search_restaurant_menu.controller'

export const restaurantRouter = express.Router()
const baseRoute = '/restaurants'

restaurantRouter.get(`${baseRoute}/by-time`, (req, res) => {
  void new GetListRestaurantByTime(req, res).handleRequest()
})

const getListRestaurantByPriceMethod = OpenAPIV3.HttpMethods.GET
const getListRestaurantByPriceRoute = `${baseRoute}/by-price`
Swagger.register(getListRestaurantByPriceRoute, getListRestaurantByPriceMethod, swGetListRestaurantByPrice)
restaurantRouter[getListRestaurantByPriceMethod](getListRestaurantByPriceRoute, (req, res) => {
  void new GetListRestaurantByPrice(req, res).handleRequest()
})

restaurantRouter.get(`${baseRoute}/search`, (req, res) => {
  void new SearchRestaurantMenu(req, res).handleRequest()
})
