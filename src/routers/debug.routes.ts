import express from 'express'
import HttpStatus from 'http-status-codes'
import { appConfig } from '~/core/app.config'
import { getCurrentSGTime } from '~/utils/date.util'

const debugRouter = express.Router()

debugRouter.get('/version', (_, res) => {
  res.status(HttpStatus.OK).json({
    appVersion: appConfig.version,
    env: process.env.NODE_ENV,
    currentDateTime: getCurrentSGTime(),
  })
})

export default debugRouter
