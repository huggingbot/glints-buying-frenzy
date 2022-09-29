import { Request, Response } from 'express'
import { ETransactional } from '~/core/audit.logging'
import { CustomController } from '~/core/base.controller'
import { CustomError } from '~/core/base.errors'
import { IApiResult } from '~/core/types'

export class TestController extends CustomController<unknown> {
  public constructor(req: Request, res: Response) {
    super(req, res)
  }

  protected async doRequest(req: Request<unknown, unknown, unknown, unknown>): Promise<IApiResult> {
    try {
      return this.success({ test: req.txContext.uuid }, 'testing')
    } catch (err) {
      if (err instanceof CustomError) {
        return this.badRequest(err)
      }
      return this.internalServerError(err)
    }
  }

  protected getTxType(): string {
    return ETransactional.Test
  }
}
