import { NextFunction, Request, Response } from 'express'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { ITxContext } from '~/modules/common/types'
import { getCurrentSGDate } from '~/utils/dateUtil'
import { retrieveIpAddress } from '~/utils/ipUtil'
import logger from './logging'

interface ITxInfo {
  txId: string
  txType: string
  txResult: 'SUCCESS' | 'FAILURE'
  totalTime: number
  ipAddress: string
}

enum ELogType {
  Transactional = 'TRANS',
}

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

  static logTransactionSuccess(
    txContext: ITxContext,
    txType: string,
    metadataInput = {}
  ): { txInfo: ITxInfo; metadata: Record<string, unknown> } {
    const { uuid, startTime, sourceIp } = txContext

    const totalTime = startTime ? moment().diff(startTime) : 0
    const txInfo: ITxInfo = {
      txId: uuid ?? '',
      txType,
      txResult: 'SUCCESS',
      totalTime,
      ipAddress: sourceIp ?? '',
    }
    const metadata: Record<string, unknown> = { ...metadataInput }
    metadata.logType = ELogType.Transactional

    logger.info(JSON.stringify(txInfo), metadata)
    return { txInfo, metadata }
  }

  static logTransactionFailure(
    txContext: ITxContext,
    txType: string,
    error: unknown,
    metadataInput = {}
  ): { txInfo: ITxInfo; metadata: Record<string, unknown> } {
    const { uuid, startTime, sourceIp } = txContext

    const totalTime = startTime ? moment().diff(startTime) : 0
    const txInfo: ITxInfo = {
      txId: uuid ?? '',
      txType,
      txResult: 'FAILURE',
      totalTime,
      ipAddress: sourceIp ?? '',
    }
    let errorReason = error
    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>
      errorReason = err.stack || err.error || err.message
    }
    const metadata: Record<string, unknown> = { ...metadataInput }
    metadata.internalErrorInfo = { errorReason }
    metadata.logType = ELogType.Transactional

    logger.warn(JSON.stringify(txInfo), metadata)
    return { txInfo, metadata }
  }
}
