import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { ValidationError } from 'joi'
import auditLogger from '~/src/core/audit.logging'
import logger, { generateLogContext } from '~/src/core/logging'
import { CustomError } from './base.errors'
import { IApiResponse, IApiResult, ILogContext } from './types'
import Joi, { Schema } from 'joi'

export const genericApiResultCode = {
  success: 1,
  failure: -1,
}

interface IController {
  handleRequest(req: Request, res: Response): Promise<void>
}

abstract class BaseController<ResBody> implements IController {
  protected req: Request
  protected res: Response
  protected logContext: ILogContext
  protected readonly reqId: string

  protected successLogFn?: (logContext: ILogContext) => void
  protected failureLogFn?: (logContext: ILogContext) => void
  protected abstract doRequest(req: Request): Promise<IApiResult<ResBody>>
  protected abstract getTxType(req: Request): string

  public constructor(req: Request, res: Response) {
    this.req = req
    this.res = res
    if (!req.txContext?.uuid) {
      throw new Error('Request Id is undefined')
    }
    this.reqId = req.txContext.uuid
    this.logContext = this.generateLogContext()
  }

  protected generateLogContext(err?: Error): ILogContext {
    return generateLogContext(this.req, this.getTxType(this.req), err)
  }

  public async handleRequest(): Promise<void> {
    try {
      const apiResult = await this.doRequest(this.req)
      this.processApiResult(apiResult)
    } catch (err) {
      this.processErrorCaught(err)
    }
  }

  private processApiResult(apiResult: IApiResult<ResBody>): void {
    const statusCode = apiResult.statusCode
    if (statusCode === HttpStatus.MOVED_TEMPORARILY || statusCode === HttpStatus.TEMPORARY_REDIRECT) {
      const url = apiResult.redirectUrl
      if (!url) {
        throw new Error('Empty redirect Url')
      }
      logger.info(`Setting Redirection: ${url}`, this.reqId)

      this.res.setHeader('Location', url)
      this.res.status(statusCode)
      this.res.json({})
      this.log(apiResult.rawError)
      return
    }
    this.log(apiResult.rawError)
    this.res.status(statusCode)
    this.res.json(apiResult.resBody)
    return
  }

  private processErrorCaught(rawError: unknown): void {
    logger.debug('[processErrorCaught] ', rawError)
    const errorRes = this.constructErrorResponse(rawError)
    const rawErrorCode = rawError ? (rawError as Record<string, number>).httpCode : 0
    let statusCode = rawErrorCode || HttpStatus.INTERNAL_SERVER_ERROR
    if (rawError instanceof CustomError) {
      statusCode = HttpStatus.BAD_REQUEST
    }
    this.res.status(statusCode)
    this.res.json(errorRes)

    this.logFailure(errorRes, rawError)
  }

  protected constructErrorResponse(rawError: unknown, msgOverride?: string): unknown {
    const isCustomErr = rawError instanceof CustomError
    const isValidationErr = rawError instanceof ValidationError
    const resultCode = isCustomErr ? Number(rawError.code) : genericApiResultCode.failure
    const errorId = this.reqId
    const msg = isCustomErr || isValidationErr ? rawError.message : 'Something unexpected went wrong'

    return {
      resultCode: isValidationErr ? -400 : resultCode,
      error: {
        errorId,
        errorCode: isCustomErr ? rawError.code : genericApiResultCode.failure,
        errorReason: msgOverride || msg,
      },
      body: isCustomErr ? rawError.error || {} : {},
    }
  }

  protected log(rawError?: unknown): void {
    if (rawError) {
      this.logFailure(this.constructErrorResponse(rawError), rawError)
    } else {
      this.logSuccess()
    }
  }

  private logSuccess(): void {
    this.successLogFn?.(this.logContext)
  }

  private logFailure(errResponse: unknown, rawError?: unknown): void {
    if (!this.failureLogFn) return
    this.logContext.error = rawError
    this.logContext.metadata.errorResponse = errResponse
    const rawErrorMeta = rawError ? (rawError as Record<string, unknown>).metadata : {}
    this.logContext.metadata = { ...this.logContext.metadata, rawErrorMeta }
    this.failureLogFn(this.logContext)
  }

  protected redirect(
    url: string,
    statusCode:
      | typeof HttpStatus.MOVED_TEMPORARILY
      | typeof HttpStatus.TEMPORARY_REDIRECT = HttpStatus.MOVED_TEMPORARILY,
    contentType = 'json',
    err?: Error,
  ): IApiResult<ResBody> {
    return {
      redirectUrl: url,
      statusCode,
      contentType,
      rawError: err,
    }
  }
}

/**
 * Convenience class for standard API response
 */
export abstract class CustomController<Body, Metadata = unknown> extends BaseController<IApiResponse<Body, Metadata>> {
  public constructor(req: Request, res: Response) {
    super(req, res)
    this.successLogFn = (ctx: ILogContext): void => {
      auditLogger.logTransactionSuccess(ctx.txContext, ctx.txType, ctx.metadata)
    }
    this.failureLogFn = (ctx: ILogContext): void => {
      auditLogger.logTransactionFailure(ctx.txContext, ctx.txType, ctx.error, ctx.metadata)
    }
  }

  protected success(
    body: Body,
    message = 'success',
    resultCode = genericApiResultCode.success,
    metadata?: Metadata,
  ): Promise<IApiResult<IApiResponse<Body, Metadata>>> {
    return Promise.resolve(this.buildApiResult(HttpStatus.OK, body, message, resultCode, metadata))
  }

  protected unauthorized(err: unknown, message?: string): Promise<IApiResult<IApiResponse<Body, Metadata>>> {
    return Promise.resolve({
      statusCode: HttpStatus.UNAUTHORIZED,
      resBody: this.processError(err, message),
      rawError: err,
    })
  }

  protected badRequest(err: unknown, message?: string): Promise<IApiResult<IApiResponse<Body, Metadata>>> {
    return Promise.resolve({
      statusCode: HttpStatus.BAD_REQUEST,
      resBody: this.processError(err, message),
      rawError: err,
    })
  }

  protected forbidden(err: unknown, message?: string): Promise<IApiResult<IApiResponse<Body, Metadata>>> {
    return Promise.resolve({
      statusCode: HttpStatus.FORBIDDEN,
      resBody: this.processError(err, message),
      rawError: err,
    })
  }

  protected notFound(err: unknown, message?: string): Promise<IApiResult<IApiResponse<Body, Metadata>>> {
    return Promise.resolve({
      statusCode: HttpStatus.NOT_FOUND,
      resBody: this.processError(err, message),
      rawError: err,
    })
  }

  protected internalServerError(err: unknown, message?: string): Promise<IApiResult<IApiResponse<Body, Metadata>>> {
    return Promise.resolve({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      resBody: this.processError(err, message),
      rawError: err,
    })
  }

  protected tooManyRequests(err: unknown, message?: string): Promise<IApiResult<IApiResponse<Body, Metadata>>> {
    return Promise.resolve({
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      resBody: this.processError(err, message),
      rawError: err,
    })
  }

  private buildApiResult(
    httpCode: number,
    body: Body,
    message?: string,
    resultCode?: number,
    metadata?: Metadata,
  ): IApiResult<IApiResponse<Body, Metadata>> {
    const resBody: IApiResponse<Body, Metadata> = {
      body,
      resultCode,
      message,
      metadata,
    }
    return {
      statusCode: httpCode,
      resBody,
    }
  }

  private processError(err: CustomError | unknown, message?: string): IApiResponse<Body, Metadata> {
    return super.constructErrorResponse(err, message) as IApiResponse<Body, Metadata>
  }
}

export const customApiResponseSchema = (body: Schema, metadata?: Schema): Schema => {
  return Joi.object({
    body,
    resultCode: Joi.number().required().valid(1),
    message: Joi.string().required(),
    metadata: metadata ?? Joi.object(),
  })
}

export const customApiErrorResponseSchema = (): Schema => {
  return Joi.object({
    resultCode: Joi.number().required().valid(-1),
    error: Joi.object({
      errorId: Joi.string(),
      errorReason: Joi.string(),
      customMessage: Joi.string(),
      message: Joi.string(),
    }),
  })
}
