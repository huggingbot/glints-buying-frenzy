import compression from 'compression'
import cookieParser from 'cookie-parser'
import express from 'express'
import { appConfig } from './core/app.config'
import { securityMwRouter } from './middlewares'

import logger from './core/logging'

export const startServer = async (): Promise<void> => {
  const app = express()
  app.use(compression())
  app.use(cookieParser())
  app.use(express.json())

  app.use(securityMwRouter)

  app.listen(appConfig.expressConfig.port)
  logger.info(`Node Version: ${process.version}`)
  logger.info(`NODE_ENV: ${process.env.NODE_ENV ?? ''}`)
  logger.info(`Running express server on port ${appConfig.expressConfig.port}`)
}
