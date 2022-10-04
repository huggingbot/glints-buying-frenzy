import express from 'express'
import HttpStatus from 'http-status-codes'
import { appConfig } from '~/src/core/app.config'
import { getCurrentSGTime } from '~/src/utils/date.util'

const debugRouter = express.Router()

debugRouter.get('/version', (_, res) => {
  res.status(HttpStatus.OK).json({
    appVersion: appConfig.version,
    env: process.env.NODE_ENV,
    currentDateTime: getCurrentSGTime(),
  })
})

export default debugRouter
