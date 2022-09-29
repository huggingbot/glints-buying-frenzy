import { NextFunction, Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import logger from '../core/logging'

interface ICustomError {
  code: number
  message: string
}

const getRequestUrl = (req: Request): string => `${req.protocol}://${req.get('host')}${req.originalUrl}`

const errorBuilder = (code: number, message: string): ICustomError => {
  return { code, message }
}

export const sendApiNotFoundResponse = (req: Request, res: Response): void => {
  const msg = 'Not Found'
  res.status(HttpStatus.NOT_FOUND)
  res.json(errorBuilder(HttpStatus.NOT_FOUND, msg))
  const metadata = { path: new URL(getRequestUrl(req)).pathname }
  logger.error(`${HttpStatus.NOT_FOUND}`, 'No matching API', msg, metadata)
}

export const generalErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  if (error) {
    const msg = 'There are issue(s) with the request, please rectify and try again.'
    res.status(HttpStatus.BAD_REQUEST)
    res.json(errorBuilder(HttpStatus.BAD_REQUEST, msg))
    const metadata = { internalErrorInfo: { error }, path: new URL(getRequestUrl(req)).pathname }
    logger.error(`${HttpStatus.BAD_REQUEST}`, 'OtherError', msg, metadata)
  } else {
    next()
  }
}
