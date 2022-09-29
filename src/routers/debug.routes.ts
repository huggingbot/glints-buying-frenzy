import express from 'express'
import { apiConfig } from '~/core/api.config'
import { appConfig } from '~/core/app.config'
import { getCurrentSGTime } from '~/utils/dateUtil'
import HttpStatus from 'http-status-codes'

const debugRouter = express.Router()

debugRouter.get('/version', (_, res) => {
  res.status(HttpStatus.OK).json({
    appVersion: appConfig.version,
    apiVersion: apiConfig.version,
    env: process.env.NODE_ENV,
    currentDateTime: getCurrentSGTime(),
  })
})

export default debugRouter
