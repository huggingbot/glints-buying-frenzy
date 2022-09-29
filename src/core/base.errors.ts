import { genericApiResultCode } from './base.controller'

export class CustomError extends Error {
  public code: number
  public error?: unknown

  public constructor(message?: string, code: number = genericApiResultCode.failure, error?: unknown) {
    super(message)
    this.name = 'CustomError'
    this.message = message
    this.code = code
    this.error = error
  }
}
