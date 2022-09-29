import { Request } from 'express'
import winston, { createLogger, format } from 'winston'
import { ILogContext } from './types'

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({
      level: ['development', 'local'].includes(process.env.NODE_ENV || '') ? 'debug' : 'info',
      silent: ['test'].includes(process.env.NODE_ENV || ''),
    }),
  ],
})

export const generateLogContext = (req: Request, txType: string, err?: Error): ILogContext => {
  return {
    txContext: req.txContext,
    txType,
    metadata: {
      requestBody: req.body,
      requestParams: req.params,
      requestQuery: req.query,
    },
    error: err,
  }
}

export default logger
