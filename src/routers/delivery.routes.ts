import express from 'express'
import { testRouter } from '~/api/delivery/routes/test.routes'

const deliveryApiVersion = 'v1'
const deliveryApiBaseRoute = `/api/delivery/${deliveryApiVersion}`

const deliveryRoutes = express.Router()
deliveryRoutes.use(deliveryApiBaseRoute, testRouter)

export default deliveryRoutes
