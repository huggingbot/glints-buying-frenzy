import express from 'express'
import { appConfig } from './config'

import logger from './core/logging'

export const startServer = async (): Promise<void> => {
  const app = express()

  app.listen(appConfig.expressConfig.port)
  logger.info(`Node Version: ${process.version}`)
  logger.info(`NODE_ENV: ${process.env.NODE_ENV ?? ''}`)
  logger.info(`Running express server on port ${appConfig.expressConfig.port}`)
}
