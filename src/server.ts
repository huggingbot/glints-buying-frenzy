import express from 'express'
import { appConfig } from './config'

export const startServer = async (): Promise<void> => {
  const app = express()

  app.listen(appConfig.expressConfig.port)
  console.log(`Node Version: ${process.version}`)
  console.log(`NODE_ENV: ${process.env.NODE_ENV ?? ''}`)
  console.log(`Running express server on port ${appConfig.expressConfig.port}`)
}
