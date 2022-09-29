import { ILogContext } from './types'

export abstract class BaseService {
  protected logContext: ILogContext
  protected name: string

  public constructor(logContext: ILogContext, name = 'service') {
    this.logContext = logContext
    this.name = name
  }
}
