import express from 'express'
import auditLogger from '~/src/core/audit.logging'

const apiMwRouter = express.Router()

apiMwRouter.use((req, res, next) => {
  auditLogger.generateApiTransactionId(req, res, next)
})
apiMwRouter.use((req, res, next) => {
  auditLogger.generateTransactionStartTime(req, res, next)
})
apiMwRouter.use((req, res, next) => {
  auditLogger.extractSourceIp(req, res, next)
})

export default apiMwRouter
