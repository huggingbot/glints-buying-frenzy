import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getCurrentSGDate } from '~/utils/dateUtil'
import { retrieveIpAddress } from '~/utils/ipUtil'

export default class auditLogger {
  static generateApiTransactionId(req: Request, _: Response, next: NextFunction): void {
    req.trxContext = { uuid: uuidv4() }
    next()
  }

  static generateTransactionStartTime(req: Request, _: Response, next: NextFunction): void {
    req.trxContext.startTime = getCurrentSGDate()
    next()
  }

  static extractSourceIp(req: Request, _: Response, next: NextFunction): void {
    const ipAddress = retrieveIpAddress(req)
    req.trxContext.sourceIp = ipAddress
    next()
  }
}
