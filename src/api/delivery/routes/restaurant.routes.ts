import express from 'express'
import { OpenAPIV3 } from 'openapi-types'
import { Swagger } from '~/src/swagger'
import {
  GetListRestaurantByPrice,
  swGetListRestaurantByPrice,
} from '../controllers/restaurant/get_list_restaurant_by_price.controller'
import {
  GetListRestaurantByTime,
  swGetListRestaurantByTime,
} from '../controllers/restaurant/get_list_restaurant_by_time.controller'
import {
  SearchRestaurantMenu,
  swSearchRestaurantMenu,
} from '../controllers/restaurant/search_restaurant_menu.controller'

export const restaurantRouter = express.Router()
const baseRoute = '/restaurants'

const getListRestaurantByTimeMethod = OpenAPIV3.HttpMethods.GET
const getListRestaurantByTimeRoute = `${baseRoute}/by-time`
Swagger.register(getListRestaurantByTimeRoute, getListRestaurantByTimeMethod, swGetListRestaurantByTime)
restaurantRouter[getListRestaurantByTimeMethod](getListRestaurantByTimeRoute, (req, res) => {
  void new GetListRestaurantByTime(req, res).handleRequest()
})

const getListRestaurantByPriceMethod = OpenAPIV3.HttpMethods.GET
const getListRestaurantByPriceRoute = `${baseRoute}/by-price`
Swagger.register(getListRestaurantByPriceRoute, getListRestaurantByPriceMethod, swGetListRestaurantByPrice)
restaurantRouter[getListRestaurantByPriceMethod](getListRestaurantByPriceRoute, (req, res) => {
  void new GetListRestaurantByPrice(req, res).handleRequest()
})

const searchRestaurantMenuMethod = OpenAPIV3.HttpMethods.GET
const searchRestaurantMenuRoute = `${baseRoute}/search`
Swagger.register(searchRestaurantMenuRoute, searchRestaurantMenuMethod, swSearchRestaurantMenu)
restaurantRouter[searchRestaurantMenuMethod](searchRestaurantMenuRoute, (req, res) => {
  void new SearchRestaurantMenu(req, res).handleRequest()
})
