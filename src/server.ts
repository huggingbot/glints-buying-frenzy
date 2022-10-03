import compression from 'compression'
import cookieParser from 'cookie-parser'
import express from 'express'
import { apiNotFoundMw, genericErrorMw } from '~/middlewares/error.middleware'
import { appConfig } from './core/app.config'
import logger from './core/logging'
import { apiMwRouter, securityMwRouter } from './middlewares'
import { modelsInit } from './models'
import debugRouter from './routers/debug.routes'
import deliveryRoutes from './routers/delivery.routes'
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from '~/swagger/swagger.def'

export const startServer = async (): Promise<void> => {
  const app = express()

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

  app.use(compression())
  app.use(cookieParser())
  app.use(express.json())

  app.use(securityMwRouter)
  app.use('/api', apiMwRouter)
  app.use('/api/debug', debugRouter)

  app.use('/', deliveryRoutes)

  app.all('/api/*', apiNotFoundMw)
  app.use(genericErrorMw)

  modelsInit()

  app.listen(appConfig.expressConfig.port)
  logger.info(`Node Version: ${process.version}`)
  logger.info(`NODE_ENV: ${process.env.NODE_ENV ?? ''}`)
  logger.info(`Running express server on port ${appConfig.expressConfig.port}`)
}
