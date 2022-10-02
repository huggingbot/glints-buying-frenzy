import { BaseService } from '~/core/base.service'
import { ILogContext } from '~/core/types'

export class RestaurantService extends BaseService {
  public constructor(logContext: ILogContext) {
    super(logContext)
  }
}
