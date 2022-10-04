import express from 'express'
import { restaurantRouter } from '~/src/api/delivery/routes/restaurant.routes'
import { purchaseRouter } from '~/src/api/delivery/routes/purchase.routes'

const deliveryApiVersion = 'v1'
const deliveryApiBaseRoute = `/api/delivery/${deliveryApiVersion}`

const deliveryRoutes = express.Router()
deliveryRoutes.use(deliveryApiBaseRoute, restaurantRouter)
deliveryRoutes.use(deliveryApiBaseRoute, purchaseRouter)

export default deliveryRoutes
