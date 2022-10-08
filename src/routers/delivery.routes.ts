import express from 'express'
import { purchaseRouter } from '~/src/api/delivery/routes/purchase.routes'
import { restaurantRouter } from '~/src/api/delivery/routes/restaurant.routes'
import { EApiVersion } from '../constants'

const deliveryApiBaseRoute = `/api/delivery/${EApiVersion.Delivery}`

const deliveryRoutes = express.Router()
deliveryRoutes.use(deliveryApiBaseRoute, restaurantRouter)
deliveryRoutes.use(deliveryApiBaseRoute, purchaseRouter)

export default deliveryRoutes
