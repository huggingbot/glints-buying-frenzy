import { ITxContext } from '~/core/types'

/**
 * Extension of express request typing
 */
declare module 'express-serve-static-core' {
  interface Request {
    txContext: ITxContext
  }
}
