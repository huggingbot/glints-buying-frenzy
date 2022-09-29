import express from 'express'
import helmet from 'helmet'

const securityMwRouter = express.Router()
securityMwRouter.use(helmet())
securityMwRouter.use(helmet.hidePoweredBy())

export default securityMwRouter
