import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getCurrentSGDate } from '~/utils/dateUtil'
import { retrieveIpAddress } from '~/utils/ipUtil'

export default class auditLogger {
  static generateApiTransactionId(req: Request, _: Response, next: NextFunction): void {
    req.txContext = { uuid: uuidv4() }
    next()
  }

  static generateTransactionStartTime(req: Request, _: Response, next: NextFunction): void {
    req.txContext.startTime = getCurrentSGDate()
    next()
  }

  static extractSourceIp(req: Request, _: Response, next: NextFunction): void {
    const ipAddress = retrieveIpAddress(req)
    req.txContext.sourceIp = ipAddress
    next()
  }
}
