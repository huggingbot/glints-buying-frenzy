import express from 'express'
import { restaurantRouter } from '~/api/delivery/routes/restaurant.routes'

const deliveryApiVersion = 'v1'
const deliveryApiBaseRoute = `/api/delivery/${deliveryApiVersion}`

const deliveryRoutes = express.Router()
deliveryRoutes.use(deliveryApiBaseRoute, restaurantRouter)

export default deliveryRoutes
