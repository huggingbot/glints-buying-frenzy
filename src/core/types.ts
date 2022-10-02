export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export interface ITxContext {
  uuid?: string
  startTime?: Date
  sourceIp?: string
}

export interface ILogContext {
  txContext: ITxContext
  txType: string
  metadata: Record<string, unknown>
  error?: unknown
}

export interface IApiResult<ResBody = unknown> {
  statusCode: number
  resBody?: ResBody
  redirectUrl?: string
  rawError?: unknown
  contentType?: string
}

export interface IApiResponse<Body, Metadata = unknown> {
  resultCode?: number
  message?: string
  body?: Body
  metadata?: Metadata
  error?: IApiError
}

export interface IApiError {
  errorId?: string
  errorCode?: number
  errorReason?: string
}
